/**
 * SS Dental Care — Scheduled Appointment Reminder Worker & Slot Sweeper
 * Timezone: Asia/Kolkata (IST, UTC+05:30)
 * Evaluates upcoming appointments for 24-hour and 2-hour reminders,
 * checks cancellation status, auto-expires abandoned checkouts,
 * and enqueues durable Brevo notifications.
 */

const { supabaseAdmin, withDbRetry } = require('./db');
const { enqueueNotification } = require('./outbox-worker');

/**
 * Parse an appointment date and time into an absolute UTC timestamp,
 * interpreting the appointment date and time in Asia/Kolkata timezone.
 * @param {string} dateStr - e.g. "2026-11-05"
 * @param {string} timeStr - e.g. "10:30 AM", "04:00 PM", "11:00"
 * @returns {Date|null}
 */
function parseIndianAppointmentTime(dateStr, timeStr) {
  try {
    if (!dateStr) return null;
    const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
    const [year, month, day] = cleanDate.split('-').map(Number);
    if (!year || !month || !day) return null;

    let hours = 10;
    let minutes = 0;

    if (timeStr) {
      const match = timeStr.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
      if (match) {
        hours = parseInt(match[1], 10);
        minutes = match[2] ? parseInt(match[2], 10) : 0;
        const meridian = match[3] ? match[3].toUpperCase() : null;

        if (meridian === 'PM' && hours < 12) hours += 12;
        if (meridian === 'AM' && hours === 12) hours = 0;
      }
    }

    // Construct ISO string with +05:30 timezone offset
    const pad = (n) => String(n).padStart(2, '0');
    const isoString = `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00+05:30`;
    const date = new Date(isoString);

    return isNaN(date.getTime()) ? null : date;
  } catch (err) {
    console.warn('⚠️ Error parsing appointment time:', err.message);
    return null;
  }
}

/**
 * Auto-expire abandoned Razorpay checkout attempts (> 60 minutes old) to free slots
 */
async function expireStalePendingAppointments(timeoutMinutes = 60) {
  try {
    // 1. Try calling the PostgreSQL RPC if present
    const { data: rpcCount, error: rpcError } = await withDbRetry(() =>
      supabaseAdmin.rpc('expire_stale_pending_bookings', { p_timeout_minutes: timeoutMinutes })
    );

    if (!rpcError && typeof rpcCount === 'number') {
      if (rpcCount > 0) {
        console.log(`🧹 [Slot Sweeper RPC]: Auto-expired ${rpcCount} abandoned pending appointment(s).`);
      }
      return rpcCount;
    }
  } catch (ex) {
    // Fall back to direct query
  }

  // Fallback: Node.js query
  try {
    const cutoff = new Date(Date.now() - timeoutMinutes * 60 * 1000).toISOString();
    const { data, error } = await withDbRetry(() =>
      supabaseAdmin
        .from('appointments')
        .update({
          appointment_status: 'expired',
          updated_at: new Date().toISOString()
        })
        .eq('appointment_status', 'pending')
        .eq('payment_status', 'pending')
        .eq('payment_method', 'Razorpay')
        .lt('created_at', cutoff)
        .select('id')
    );

    if (!error && data && data.length > 0) {
      console.log(`🧹 [Slot Sweeper]: Auto-expired ${data.length} abandoned checkout appointment(s). Slots freed.`);
      return data.length;
    }
    return 0;
  } catch (err) {
    console.warn('⚠️ [Slot Sweeper Exception]:', err.message);
    return 0;
  }
}

/**
 * Evaluate all upcoming appointments and enqueue reminders
 * @returns {Promise<{evaluated: number, enqueued24h: number, enqueued2h: number, expiredSlots: number}>}
 */
async function runReminderJob() {
  console.log('⏰ [Reminder Scheduler]: Starting scan in Asia/Kolkata timezone...');
  
  const stats = { evaluated: 0, enqueued24h: 0, enqueued2h: 0, expiredSlots: 0 };
  const now = new Date();

  // Step 1: Sweep and release abandoned checkout slots
  stats.expiredSlots = await expireStalePendingAppointments(60);

  // Step 2: Query upcoming appointments (not cancelled, completed, or expired)
  try {
    const todayIso = now.toISOString().split('T')[0];
    const twoDaysLater = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];

    const { data: appointments, error } = await withDbRetry(() =>
      supabaseAdmin
        .from('appointments')
        .select('*')
        .gte('appointment_date', todayIso)
        .lte('appointment_date', twoDaysLater)
        .not('appointment_status', 'in', '("cancelled","completed","expired")')
    );

    if (error) {
      console.warn('⚠️ [Reminder Scheduler] Error querying appointments:', error.message);
      return stats;
    }

    if (!appointments || appointments.length === 0) {
      console.log('ℹ️ [Reminder Scheduler]: No upcoming appointments in target window.');
      return stats;
    }

    stats.evaluated = appointments.length;

    for (const appt of appointments) {
      if (!appt.patient_email || !appt.patient_email.includes('@')) {
        continue;
      }

      const apptTimestamp = parseIndianAppointmentTime(appt.appointment_date, appt.appointment_time);
      if (!apptTimestamp) continue;

      const diffMs = apptTimestamp.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      const metadata = {
        patientName: appt.patient_name,
        appointmentId: appt.id,
        treatment: appt.treatment || 'Dental Care',
        date: appt.appointment_date,
        time: appt.appointment_time,
        doctor: appt.doctor_name || 'Dr. Naveen / Dr. Sunitha'
      };

      // 1. 24-Hour Reminder Window: between 23h and 25h ahead
      if (diffHours >= 23 && diffHours <= 25) {
        const deduplicationKey = `reminder_24h_${appt.id}`;
        const result = await enqueueNotification({
          appointmentId: appt.id,
          recipientEmail: appt.patient_email,
          recipientName: appt.patient_name,
          recipientType: 'patient',
          notificationType: 'reminder_24h',
          metadata,
          customDeduplicationKey: deduplicationKey
        });

        if (result.success && !result.duplicate) {
          stats.enqueued24h++;
        }
      }

      // 2. 2-Hour Reminder Window: between 1.5h and 2.5h ahead
      if (diffHours >= 1.5 && diffHours <= 2.5) {
        const deduplicationKey = `reminder_2h_${appt.id}`;
        const result = await enqueueNotification({
          appointmentId: appt.id,
          recipientEmail: appt.patient_email,
          recipientName: appt.patient_name,
          recipientType: 'patient',
          notificationType: 'reminder_2h',
          metadata,
          customDeduplicationKey: deduplicationKey
        });

        if (result.success && !result.duplicate) {
          stats.enqueued2h++;
        }
      }
    }

    console.log(`✅ [Reminder Scheduler Completed]: Evaluated: ${stats.evaluated}, Enqueued 24h: ${stats.enqueued24h}, Enqueued 2h: ${stats.enqueued2h}, Expired Slots: ${stats.expiredSlots}`);
    return stats;
  } catch (err) {
    console.error('🚨 [Reminder Scheduler Exception]:', err.message);
    return stats;
  }
}

/**
 * In-process interval loop for production server runtime
 */
let reminderIntervalId = null;

function startReminderScheduler(intervalMs = 15 * 60 * 1000) { // Every 15 minutes
  if (reminderIntervalId) return;
  console.log(`⏰ [Reminder Scheduler Service]: Active (Scan interval: ${intervalMs / 60000} minutes)`);
  setTimeout(runReminderJob, 30000);
  reminderIntervalId = setInterval(runReminderJob, intervalMs);
  if (reminderIntervalId && typeof reminderIntervalId.unref === 'function') {
    reminderIntervalId.unref();
  }
}

function stopReminderScheduler() {
  if (reminderIntervalId) {
    clearInterval(reminderIntervalId);
    reminderIntervalId = null;
  }
}

module.exports = {
  runReminderJob,
  expireStalePendingAppointments,
  startReminderScheduler,
  stopReminderScheduler,
  parseIndianAppointmentTime
};
