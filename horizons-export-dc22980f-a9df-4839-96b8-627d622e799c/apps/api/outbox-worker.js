/**
 * SS Dental Care — Durable Notification Outbox Worker
 * Implements Transactional Outbox Pattern, Atomic Database Claiming,
 * Strict Deduplication, Exponential Backoff, and Audit Telemetry.
 */

const { supabaseAdmin, withDbRetry } = require('./db');
const { sendTransactionalEmail, templates } = require('./brevo');

let isWorkerRunning = false;
const MAX_ATTEMPTS = 5;
const WORKER_ID = `worker_${process.pid}_${Math.random().toString(36).slice(2, 7)}`;

/**
 * Enqueue a notification into the durable outbox table
 */
async function enqueueNotification({
  appointmentId,
  recipientEmail,
  recipientName = '',
  recipientType = 'patient',
  notificationType,
  metadata = {},
  customDeduplicationKey
}) {
  if (!recipientEmail || !recipientEmail.includes('@')) {
    return { success: false, error: 'INVALID_RECIPIENT_EMAIL' };
  }

  // Authoritative composite deduplication key: prevents duplicate emails under race conditions
  const deduplicationKey = customDeduplicationKey || 
    `${appointmentId}_${recipientType}_${notificationType}_${recipientEmail.trim().toLowerCase()}`;

  const record = {
    appointment_id: (appointmentId && appointmentId.includes('-')) ? appointmentId : null,
    recipient_email: recipientEmail.trim().toLowerCase(),
    recipient_name: recipientName,
    recipient_type: recipientType,
    notification_type: notificationType,
    provider: 'brevo',
    status: 'pending',
    attempts: 0,
    next_retry_at: new Date().toISOString(),
    deduplication_key: deduplicationKey,
    metadata
  };

  try {
    const { data, error } = await withDbRetry(() =>
      supabaseAdmin
        .from('notification_outbox')
        .insert([record])
        .select('id')
    );

    if (error) {
      if (error.code === '23505' || (error.message && error.message.includes('deduplication_key'))) {
        console.log(`ℹ️ [Outbox Deduplication]: Notification already enqueued with key: ${deduplicationKey}`);
        return { success: true, duplicate: true };
      }
      console.warn('⚠️ [Outbox Enqueue Warning]:', error.message);
      return { success: false, error: error.message };
    }

    const outboxId = data?.[0]?.id;
    console.log(`📥 [Outbox Enqueued]: ${notificationType} to ${recipientEmail} (Outbox ID: ${outboxId})`);
    
    // Trigger asynchronous queue processing immediately
    setImmediate(processOutbox);

    return { success: true, outboxId };
  } catch (err) {
    console.error('🚨 [Outbox Enqueue Exception]:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Claim pending outbox items atomically using PostgreSQL RPC or atomic conditional update
 */
async function claimPendingItems(batchSize = 10) {
  // Strategy 1: Try calling atomic PostgreSQL RPC claim_notification_outbox
  try {
    const { data: rpcData, error: rpcError } = await withDbRetry(() =>
      supabaseAdmin.rpc('claim_notification_outbox', {
        p_worker_id: WORKER_ID,
        p_batch_size: batchSize
      })
    );

    if (!rpcError && Array.isArray(rpcData)) {
      return rpcData;
    }
  } catch (rpcEx) {
    // Fall back to Strategy 2 if RPC does not exist yet
  }

  // Strategy 2: Node.js fallback with atomic status update
  const nowIso = new Date().toISOString();
  const { data: candidates, error: selectError } = await withDbRetry(() =>
    supabaseAdmin
      .from('notification_outbox')
      .select('*')
      .eq('status', 'pending')
      .lte('next_retry_at', nowIso)
      .lt('attempts', MAX_ATTEMPTS)
      .order('created_at', { ascending: true })
      .limit(batchSize)
  );

  if (selectError || !candidates || candidates.length === 0) {
    return [];
  }

  const claimed = [];
  for (const item of candidates) {
    // Atomic check-and-claim: only updates if status is STILL pending
    const { data: updated, error: updateError } = await withDbRetry(() =>
      supabaseAdmin
        .from('notification_outbox')
        .update({
          status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id)
        .eq('status', 'pending')
        .select('*')
    );

    if (!updateError && updated && updated.length > 0) {
      claimed.push(updated[0]);
    }
  }

  return claimed;
}

/**
 * Process pending notifications from the durable outbox
 */
async function processOutbox() {
  if (isWorkerRunning) return;
  isWorkerRunning = true;

  try {
    const claimedItems = await claimPendingItems(10);

    if (!claimedItems || claimedItems.length === 0) {
      isWorkerRunning = false;
      return;
    }

    console.log(`📤 [Outbox Worker]: Processing ${claimedItems.length} claimed notification(s)...`);

    for (const item of claimedItems) {
      await processSingleItem(item);
    }
  } catch (err) {
    console.error('🚨 [Outbox Worker Loop Exception]:', err.message);
  } finally {
    isWorkerRunning = false;
  }
}

/**
 * Process a single claimed notification item
 */
async function processSingleItem(item) {
  const currentAttempts = (item.attempts || 0) + 1;
  const meta = item.metadata || {};
  let emailPayload = null;

  try {
    switch (item.notification_type) {
      case 'booking_received':
        emailPayload = templates.patientBookingReceived(meta);
        break;
      case 'doctor_alert':
        emailPayload = templates.doctorAlert(meta);
        break;
      case 'confirmation':
        emailPayload = templates.appointmentConfirmed(meta);
        break;
      case 'rescheduled':
        emailPayload = item.recipient_type === 'patient'
          ? templates.appointmentRescheduled(meta)
          : templates.appointmentRescheduledDoctor(meta);
        break;
      case 'cancelled':
        emailPayload = item.recipient_type === 'patient'
          ? templates.appointmentCancelled(meta)
          : templates.appointmentCancelledDoctor(meta);
        break;
      case 'reminder_24h':
      case 'reminder_2h':
        emailPayload = templates.appointmentReminder({ ...meta, reminderType: item.notification_type });
        break;
      default:
        emailPayload = {
          subject: meta.subject || 'SS Dental Care Notification',
          htmlContent: meta.htmlContent || `<p>${meta.textContent || 'Notification from SS Dental Care'}</p>`,
          textContent: meta.textContent || 'Notification from SS Dental Care'
        };
    }
  } catch (templateErr) {
    console.error(`🚨 [Template Error for outbox ${item.id}]:`, templateErr.message);
    await markItemFailed(item.id, currentAttempts, `Template Error: ${templateErr.message}`);
    return;
  }

  // Send via Brevo API
  const result = await sendTransactionalEmail({
    to: item.recipient_email,
    recipientName: item.recipient_name,
    subject: emailPayload.subject,
    htmlContent: emailPayload.htmlContent,
    textContent: emailPayload.textContent,
    tags: [item.notification_type, item.recipient_type]
  });

  if (result.success) {
    // 1. Mark outbox as sent
    await withDbRetry(() =>
      supabaseAdmin
        .from('notification_outbox')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          provider_message_id: result.messageId || null,
          last_error: null
        })
        .eq('id', item.id)
    );

    // 2. Insert audit event
    await withDbRetry(() =>
      supabaseAdmin
        .from('notification_events')
        .insert([{
          outbox_id: item.id,
          event_type: 'sent',
          provider: 'brevo',
          response_payload: { messageId: result.messageId, statusCode: result.statusCode },
          created_at: new Date().toISOString()
        }])
    ).catch(() => {});

    console.log(`✨ [Outbox Completed]: Outbox ID ${item.id} delivered via Brevo (MsgId: ${result.messageId}).`);
  } else {
    // Handle failure with exponential backoff: 2m, 4m, 8m, 16m, 32m
    const isFatal = currentAttempts >= MAX_ATTEMPTS;
    const backoffMinutes = Math.pow(2, currentAttempts);
    const nextRetry = new Date(Date.now() + backoffMinutes * 60 * 1000).toISOString();

    await withDbRetry(() =>
      supabaseAdmin
        .from('notification_outbox')
        .update({
          status: isFatal ? 'failed' : 'pending',
          attempts: currentAttempts,
          next_retry_at: nextRetry,
          last_error: result.error || 'Dispatch failed'
        })
        .eq('id', item.id)
    );

    // Audit event for failure / retry
    await withDbRetry(() =>
      supabaseAdmin
        .from('notification_events')
        .insert([{
          outbox_id: item.id,
          event_type: isFatal ? 'failed' : 'retry',
          provider: 'brevo',
          error_message: result.error || 'Failed',
          response_payload: { attempts: currentAttempts, nextRetry },
          created_at: new Date().toISOString()
        }])
    ).catch(() => {});

    console.warn(`⚠️ [Outbox Retry Scheduled]: ID ${item.id} (Attempt ${currentAttempts}/${MAX_ATTEMPTS}), Next retry: ${nextRetry}`);
  }
}

async function markItemFailed(outboxId, attempts, errorMsg) {
  await withDbRetry(() =>
    supabaseAdmin
      .from('notification_outbox')
      .update({
        status: 'failed',
        attempts,
        last_error: errorMsg
      })
      .eq('id', outboxId)
  ).catch(() => {});
}

let workerIntervalId = null;

function startOutboxWorker(intervalMs = 15000) {
  if (workerIntervalId) return;
  console.log(`🚀 [Notification Outbox Worker]: Active (Polling interval: ${intervalMs}ms)`);
  processOutbox();
  workerIntervalId = setInterval(processOutbox, intervalMs);
  if (workerIntervalId && typeof workerIntervalId.unref === 'function') {
    workerIntervalId.unref();
  }
}

function stopOutboxWorker() {
  if (workerIntervalId) {
    clearInterval(workerIntervalId);
    workerIntervalId = null;
  }
}

module.exports = {
  enqueueNotification,
  processOutbox,
  startOutboxWorker,
  stopOutboxWorker,
  claimPendingItems
};
