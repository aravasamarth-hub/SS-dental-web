const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');

// Database module (Supabase client + resilience helpers)
const {
  supabaseAdmin,
  checkDbHealth,
  getDbHealthStatus,
  saveToDbQueue,
  processDbQueue,
  checkRecordAlreadyExists,
  isSlotBooked,
  withDbRetry
} = require('./db');

// Brevo & Durable Outbox Engine
const { enqueueNotification, startOutboxWorker, stopOutboxWorker } = require('./outbox-worker');
const { startReminderScheduler, stopReminderScheduler, runReminderJob } = require('./reminder-scheduler');
const dentaFlowAdapter = require('./dentaflow-adapter');

const app = express();
app.set('trust proxy', 1);

// Self-healing: ensure public_html/.htaccess does not contain broken loopback proxy rules
try {
  const candidateHtaccessPaths = [
    '/home/u666654356/domains/ssdentalcare.in/public_html/.htaccess',
    path.resolve(__dirname, '../../../../public_html/.htaccess'),
    path.resolve(__dirname, '../../../public_html/.htaccess'),
    path.resolve(__dirname, '../../public_html/.htaccess')
  ];
  for (const p of candidateHtaccessPaths) {
    if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('mod_proxy.c') || content.includes('127.0.0.1:5000')) {
        content = content.replace(/<IfModule mod_proxy\.c>[\s\S]*?<\/IfModule>/g, '');
        fs.writeFileSync(p, content, 'utf8');
        console.log(`✅ [Self-Healing]: Removed legacy mod_proxy rules from ${p}`);
      }
    }
  }
} catch (e) {
  console.warn('⚠️ [Self-Healing Warning]:', e.message);
}

// ---------------------------------------------------------------------------
// Security Middleware: Helmet, Static Assets & CORS
// ---------------------------------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
  })
);

// Serve static frontend assets before CORS
const candidateDistPaths = [
  path.resolve(__dirname, '../../dist/apps/web'),
  path.resolve(__dirname, '../web/dist'),
  path.resolve(__dirname, '../../public_html'),
  path.resolve(process.cwd(), 'dist/apps/web'),
  path.resolve(process.cwd(), 'apps/web/dist')
];
const distPath = candidateDistPaths.find(p => fs.existsSync(p) && fs.existsSync(path.join(p, 'index.html')));

if (distPath) {
  app.use(express.static(distPath));
}

const allowedOrigins = [
  'https://www.ssdentalcare.in',
  'https://ssdentalcare.in',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
  process.env.PUBLIC_WEBSITE_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.some(o => origin.startsWith(o.replace(/\/$/, ''))) ||
        origin.endsWith('.hostingersite.com') ||
        origin.endsWith('.ssdentalcare.in');
      if (isAllowed || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-idempotency-key', 'x-cron-secret', 'x-razorpay-signature']
  })
);

// Capture raw body for cryptographic webhook signature verification
app.use(
  express.json({
    limit: '2mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

// ---------------------------------------------------------------------------
// Rate Limiting
// ---------------------------------------------------------------------------
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' }
});

const bookingLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  message: { success: false, message: 'Too many booking attempts from this device. Please wait a few minutes.' }
});

app.use('/api/', generalLimiter);

// ---------------------------------------------------------------------------
// Validation Schemas (Zod)
// ---------------------------------------------------------------------------
const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Full name is required (min 2 characters)').max(255),
  phone: z.string().trim().min(7, 'Phone number must be at least 7 digits').max(50),
  email: z.string().trim().email('Invalid email format').or(z.literal('')).optional().default(''),
  date: z.string().trim().min(4, 'Appointment date is required'),
  time: z.string().trim().min(1, 'Appointment time is required'),
  doctor: z.string().trim().max(100).optional().default('Dr. Naveen / Dr. Sunitha'),
  treatment: z.string().trim().max(255).optional().default('General Dental Consultation'),
  notes: z.string().trim().max(1000).optional().default(''),
  amount: z.number().nonnegative().optional().default(250.00),
  payment_method: z.string().trim().optional().default('Visit to pay'),
  idempotency_key: z.string().trim().min(1).max(255).optional()
});

const paymentVerifySchema = z.object({
  razorpay_order_id: z.string().trim().min(1, 'Order ID is required'),
  razorpay_payment_id: z.string().trim().min(1, 'Payment ID is required'),
  razorpay_signature: z.string().trim().min(1, 'Signature is required'),
  idempotency_key: z.string().trim().min(1).max(255).optional(),
  bookingDetails: z.object({
    name: z.string().trim().min(2, 'Name is required').max(255),
    phone: z.string().trim().min(7, 'Phone is required').max(50),
    email: z.string().trim().email('Invalid email').or(z.literal('')).optional().default(''),
    date: z.string().trim().min(4, 'Date is required'),
    time: z.string().trim().min(1, 'Time is required'),
    doctor: z.string().trim().optional().default('Dr. Naveen / Dr. Sunitha'),
    treatment: z.string().trim().optional().default('General Dental Consultation'),
    notes: z.string().trim().optional().default(''),
    amount: z.number().nonnegative().optional().default(250.00)
  })
});

const formatDate = (dateVal) => {
  if (!dateVal) return new Date().toISOString().split('T')[0];
  if (typeof dateVal === 'string' && dateVal.includes('-')) return dateVal.split('T')[0];
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(dateVal).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// ---------------------------------------------------------------------------
// 1. Health & Diagnostics Endpoint
// ---------------------------------------------------------------------------
app.get('/api/health', async (req, res) => {
  const dbHealth = await checkDbHealth();
  const isBrevoConfigured = Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL);
  const isRazorpayConfigured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

  res.json({
    status: dbHealth.healthy ? 'ok' : 'degraded',
    service: 'SS Dental Care Production API',
    timestamp: new Date().toISOString(),
    database: {
      healthy: dbHealth.healthy,
      lastError: dbHealth.lastError,
      pendingQueueCount: getDbHealthStatus().pendingQueueCount
    },
    integrations: {
      brevoEmail: isBrevoConfigured ? 'configured' : 'missing_credentials',
      razorpay: isRazorpayConfigured ? 'configured' : 'missing_credentials',
      dentaFlow: dentaFlowAdapter.enabled ? 'enabled' : 'standalone'
    }
  });
});

// ---------------------------------------------------------------------------
// 2. Razorpay: Create Order (Server-Side Calculation)
// ---------------------------------------------------------------------------
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

app.post('/api/create-order', bookingLimiter, async (req, res, next) => {
  try {
    const rawAmount = Number(req.body.amount);
    const validatedAmount = (!isNaN(rawAmount) && rawAmount >= 100 && rawAmount <= 100000) ? rawAmount : 250;
    const amountInPaise = Math.round(validatedAmount * 100);

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ success: false, message: 'Payment gateway credentials are not configured on server.' });
      }
      return res.json({
        success: true,
        order_id: `order_dev_${Date.now()}`,
        amount: amountInPaise,
        currency: 'INR',
        is_test_fallback: true
      });
    }

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    };

    const order = await razorpay.orders.create(options);
    console.log(`💳 [Razorpay Order Created]: Order ID ${order.id} for ₹${validatedAmount}`);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// 3. Razorpay: Verify Payment & Confirm Appointment
// ---------------------------------------------------------------------------
app.post('/api/verify-payment', bookingLimiter, async (req, res, next) => {
  try {
    const parseResult = paymentVerifySchema.safeParse(req.body);
    if (!parseResult.success) {
      const errDetail = parseResult.error.errors[0]?.message || 'Invalid payment payload';
      return res.status(400).json({ success: false, message: `Validation Error: ${errDetail}` });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingDetails,
      idempotency_key
    } = parseResult.data;

    const secret = process.env.RAZORPAY_KEY_SECRET;

    // Strict Security: Never skip signature verification
    if (!secret) {
      console.error('🚨 [Razorpay Security Error]: RAZORPAY_KEY_SECRET is not configured on the server.');
      return res.status(500).json({
        success: false,
        message: 'RAZORPAY_KEY_SECRET is not configured on the server. Payment cannot be verified.'
      });
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('🚨 [Razorpay Security Error]: Invalid payment signature submitted!');
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
    }

    // Idempotency check: prevent duplicate confirmation
    if (idempotency_key) {
      const alreadyExists = await checkRecordAlreadyExists('appointments', { idempotency_key });
      if (alreadyExists) {
        console.log(`ℹ️ [Idempotency]: Payment for key '${idempotency_key}' already processed.`);
        return res.json({ success: true, message: 'Payment verified and appointment confirmed.', duplicate: true });
      }
    }

    const apptDate = formatDate(bookingDetails.date);
    const apptTime = bookingDetails.time;
    const validatedAmount = Number(bookingDetails.amount) || 250.00;

    const appointmentRecord = {
      patient_name: bookingDetails.name,
      patient_email: bookingDetails.email || null,
      patient_phone: bookingDetails.phone,
      treatment: bookingDetails.treatment || 'General Dental Consultation',
      doctor_name: bookingDetails.doctor || 'Dr. Naveen / Dr. Sunitha',
      appointment_date: apptDate,
      appointment_time: apptTime,
      appointment_status: 'confirmed',
      payment_status: 'paid',
      payment_method: 'Razorpay',
      amount: validatedAmount,
      notes: bookingDetails.notes || null,
      razorpay_order_id,
      razorpay_payment_id,
      idempotency_key: idempotency_key || `razorpay_${razorpay_payment_id}`,
      created_at: new Date().toISOString()
    };

    let savedId = null;

    try {
      const { data, error } = await withDbRetry(() =>
        supabaseAdmin.from('appointments').insert([appointmentRecord]).select('id')
      );

      if (error) {
        if (error.code === '23505') {
          console.log(`ℹ️ [Postgres Conflict]: Record already saved for key: ${appointmentRecord.idempotency_key}`);
        } else {
          console.warn('⚠️ [DB Warning]: Error saving appointment to Supabase. Enqueueing to offline fallback queue:', error.message);
          saveToDbQueue('appointments', appointmentRecord);
        }
      } else {
        savedId = data?.[0]?.id;
        console.log(`✅ [Appointment Confirmed]: Saved to Supabase with ID: ${savedId}`);
      }
    } catch (dbErr) {
      console.warn('⚠️ DB Exception during payment confirmation. Buffering to queue:', dbErr.message);
      saveToDbQueue('appointments', appointmentRecord);
    }

    const apptIdForNotification = savedId || `temp_${Date.now()}`;
    const clinicEmail = process.env.CLINIC_NOTIFICATION_EMAIL || process.env.NOTIFICATION_EMAIL || 'aravasamarth@gmail.com';

    // 1. Enqueue Patient Confirmation Email via Brevo
    if (bookingDetails.email && bookingDetails.email.includes('@')) {
      await enqueueNotification({
        appointmentId: apptIdForNotification,
        recipientEmail: bookingDetails.email,
        recipientName: bookingDetails.name,
        recipientType: 'patient',
        notificationType: 'confirmation',
        metadata: {
          patientName: bookingDetails.name,
          appointmentId: apptIdForNotification,
          treatment: appointmentRecord.treatment,
          date: apptDate,
          time: apptTime,
          doctor: appointmentRecord.doctor_name,
          paymentStatus: 'paid',
          paymentMethod: 'Razorpay',
          amount: validatedAmount
        }
      });
    }

    // 2. Enqueue Clinic Staff Alert via Brevo
    await enqueueNotification({
      appointmentId: apptIdForNotification,
      recipientEmail: clinicEmail,
      recipientName: 'SS Dental Care Clinic Desk',
      recipientType: 'clinic',
      notificationType: 'doctor_alert',
      metadata: {
        patientName: bookingDetails.name,
        patientPhone: bookingDetails.phone,
        patientEmail: bookingDetails.email,
        appointmentId: apptIdForNotification,
        treatment: appointmentRecord.treatment,
        date: apptDate,
        time: apptTime,
        doctor: appointmentRecord.doctor_name,
        paymentStatus: 'paid',
        paymentMethod: 'Razorpay',
        amount: validatedAmount,
        notes: bookingDetails.notes
      }
    });

    // 3. DentaFlow background sync (non-blocking)
    dentaFlowAdapter.syncAppointment({ ...appointmentRecord, id: apptIdForNotification }).catch(() => {});

    res.json({
      success: true,
      message: 'Payment verified and appointment confirmed successfully!',
      appointment_id: savedId
    });
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// 4. Razorpay: Official Webhook Endpoint (Server-to-Server Fallback)
// ---------------------------------------------------------------------------
app.post('/api/razorpay-webhook', async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const webhookSignature = req.headers['x-razorpay-signature'];

  if (!webhookSecret) {
    console.warn('⚠️ [Razorpay Webhook]: RAZORPAY_WEBHOOK_SECRET not set. Ignoring webhook.');
    return res.status(200).json({ status: 'ignored' });
  }

  // Cryptographic raw body signature check
  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(req.rawBody)
      .digest('hex');

    if (expectedSignature !== webhookSignature) {
      console.error('🚨 [Razorpay Webhook Error]: Invalid signature verification!');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
  } catch (err) {
    console.error('🚨 [Razorpay Webhook Exception]:', err.message);
    return res.status(400).json({ error: 'Signature check failed' });
  }

  const event = req.body;
  console.log(`🔔 [Razorpay Webhook Received]: Event ${event.event} (ID: ${event.id})`);

  // Webhook Deduplication guard: ignore already handled event IDs
  const eventIdKey = `webhook_${event.id}`;
  const alreadyProcessed = await checkRecordAlreadyExists('notification_outbox', { deduplication_key: eventIdKey });
  if (alreadyProcessed) {
    return res.json({ status: 'already_processed' });
  }

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const payment = event.payload?.payment?.entity;
    if (payment) {
      console.log(`✅ [Webhook Payment Confirmed]: Payment ID ${payment.id} for Order ${payment.order_id}`);
      await withDbRetry(() =>
        supabaseAdmin
          .from('appointments')
          .update({ payment_status: 'paid', appointment_status: 'confirmed', razorpay_payment_id: payment.id })
          .eq('razorpay_order_id', payment.order_id)
      ).catch(err => console.warn('Webhook DB reconcile warning:', err.message));
    }
  }

  res.json({ status: 'ok' });
});

// ---------------------------------------------------------------------------
// 5. Booking Creation: "Visit to Pay" / Form Inquiries
// ---------------------------------------------------------------------------
app.post(['/api/book-appointment', '/api/create-booking'], bookingLimiter, async (req, res, next) => {
  try {
    const parseResult = bookingSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errDetail = parseResult.error.errors[0]?.message || 'Invalid booking details';
      return res.status(400).json({ success: false, message: `Validation Error: ${errDetail}` });
    }

    const {
      name,
      phone,
      email,
      date,
      time,
      doctor,
      treatment,
      notes,
      amount,
      payment_method,
      idempotency_key
    } = parseResult.data;

    const apptDate = formatDate(date);

    // Concurrency Slot Conflict Guard (Application Layer)
    const slotTaken = await isSlotBooked(doctor, apptDate, time);
    if (slotTaken) {
      return res.status(409).json({
        success: false,
        message: `The selected appointment slot (${time} on ${apptDate}) has just been reserved by another patient. Please select an adjacent time slot.`
      });
    }

    // Idempotency check: prevent duplicate appointment submission
    if (idempotency_key) {
      const alreadySaved = await checkRecordAlreadyExists('appointments', { idempotency_key });
      if (alreadySaved) {
        console.log(`ℹ️ [Idempotency]: Appointment for key '${idempotency_key}' already recorded.`);
        return res.json({ success: true, message: 'Appointment already booked (duplicate prevented).', duplicate: true });
      }
    }

    const appointmentRecord = {
      patient_name: name,
      patient_email: email || null,
      patient_phone: phone,
      treatment: treatment || 'General Dental Consultation',
      doctor_name: doctor || 'Dr. Naveen / Dr. Sunitha',
      appointment_date: apptDate,
      appointment_time: time,
      appointment_status: 'pending',
      payment_status: 'pending',
      payment_method: payment_method || 'Visit to pay',
      amount: amount || 250.00,
      notes: notes || null,
      idempotency_key: idempotency_key || `booking_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString()
    };

    let savedId = null;

    try {
      const { data, error } = await withDbRetry(() =>
        supabaseAdmin.from('appointments').insert([appointmentRecord]).select('id')
      );

      if (error) {
        // Handle Postgres Unique Constraint Violation (23505)
        if (error.code === '23505') {
          if (error.message && error.message.includes('uq_active_appointment_slot')) {
            return res.status(409).json({
              success: false,
              message: `The selected appointment slot (${time} on ${apptDate}) has just been reserved by another patient. Please select an adjacent time slot.`
            });
          }
          console.log(`ℹ️ [Postgres Conflict]: Appointment already saved for key: ${appointmentRecord.idempotency_key}`);
          return res.json({ success: true, message: 'Appointment already booked (duplicate prevented).', duplicate: true });
        } else {
          console.warn('⚠️ [DB Warning]: Error saving appointment to Supabase. Enqueueing to offline fallback queue:', error.message);
          saveToDbQueue('appointments', appointmentRecord);
        }
      } else {
        savedId = data?.[0]?.id;
        console.log(`✅ [Appointment Booked]: Saved to Supabase with ID: ${savedId}`);
      }
    } catch (dbErr) {
      console.warn('⚠️ DB Exception during appointment booking. Buffering to queue:', dbErr.message);
      saveToDbQueue('appointments', appointmentRecord);
    }

    const apptIdForNotification = savedId || `temp_${Date.now()}`;
    const clinicEmail = process.env.CLINIC_NOTIFICATION_EMAIL || process.env.NOTIFICATION_EMAIL || 'aravasamarth@gmail.com';

    // 1. Enqueue Patient Confirmation Email via Brevo
    if (email && email.includes('@')) {
      await enqueueNotification({
        appointmentId: apptIdForNotification,
        recipientEmail: email,
        recipientName: name,
        recipientType: 'patient',
        notificationType: 'booking_received',
        metadata: {
          patientName: name,
          appointmentId: apptIdForNotification,
          treatment: appointmentRecord.treatment,
          date: apptDate,
          time,
          doctor: appointmentRecord.doctor_name,
          paymentStatus: 'pending',
          paymentMethod: appointmentRecord.payment_method,
          amount: appointmentRecord.amount
        }
      });
    }

    // 2. Enqueue Clinic Staff Alert via Brevo
    await enqueueNotification({
      appointmentId: apptIdForNotification,
      recipientEmail: clinicEmail,
      recipientName: 'SS Dental Care Clinic Desk',
      recipientType: 'clinic',
      notificationType: 'doctor_alert',
      metadata: {
        patientName: name,
        patientPhone: phone,
        patientEmail: email,
        appointmentId: apptIdForNotification,
        treatment: appointmentRecord.treatment,
        date: apptDate,
        time,
        doctor: appointmentRecord.doctor_name,
        paymentStatus: 'pending',
        paymentMethod: appointmentRecord.payment_method,
        amount: appointmentRecord.amount,
        notes
      }
    });

    // 3. DentaFlow background sync
    dentaFlowAdapter.syncAppointment({ ...appointmentRecord, id: apptIdForNotification }).catch(() => {});

    res.json({
      success: true,
      message: 'Appointment request received successfully! A confirmation email has been dispatched.',
      appointment_id: savedId
    });
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// 5B. Appointment Lifecycle: Cancellation & Slot Release
// ---------------------------------------------------------------------------
app.post(['/api/cancel-appointment', '/api/cancel-booking'], bookingLimiter, async (req, res, next) => {
  try {
    const { appointment_id, reason } = req.body;
    if (!appointment_id) {
      return res.status(400).json({ success: false, message: 'appointment_id is required' });
    }

    const { data: appt, error: fetchErr } = await withDbRetry(() =>
      supabaseAdmin.from('appointments').select('*').eq('id', appointment_id).maybeSingle()
    );

    if (fetchErr || !appt) {
      return res.status(404).json({ success: false, message: 'Appointment record not found.' });
    }

    if (appt.appointment_status === 'cancelled') {
      return res.json({ success: true, message: 'Appointment is already cancelled.', alreadyCancelled: true });
    }

    const cancelReason = reason || 'Patient/Clinic requested cancellation';
    const updatedNotes = appt.notes ? `${appt.notes} | Cancelled: ${cancelReason}` : `Cancelled: ${cancelReason}`;

    const { error: updateErr } = await withDbRetry(() =>
      supabaseAdmin
        .from('appointments')
        .update({
          appointment_status: 'cancelled',
          notes: updatedNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment_id)
    );

    if (updateErr) {
      return res.status(500).json({ success: false, message: `Failed to cancel appointment: ${updateErr.message}` });
    }

    const clinicEmail = process.env.CLINIC_NOTIFICATION_EMAIL || process.env.NOTIFICATION_EMAIL || 'aravasamarth@gmail.com';

    // 1. Enqueue patient cancellation email
    if (appt.patient_email && appt.patient_email.includes('@')) {
      await enqueueNotification({
        appointmentId: appt.id,
        recipientEmail: appt.patient_email,
        recipientName: appt.patient_name,
        recipientType: 'patient',
        notificationType: 'cancelled',
        metadata: {
          patientName: appt.patient_name,
          appointmentId: appt.id,
          date: appt.appointment_date,
          time: appt.appointment_time,
          reason: cancelReason
        }
      });
    }

    // 2. Enqueue clinic cancellation notification
    await enqueueNotification({
      appointmentId: appt.id,
      recipientEmail: clinicEmail,
      recipientName: 'SS Dental Care Clinic Desk',
      recipientType: 'clinic',
      notificationType: 'cancelled',
      metadata: {
        patientName: appt.patient_name,
        patientPhone: appt.patient_phone,
        appointmentId: appt.id,
        date: appt.appointment_date,
        time: appt.appointment_time,
        reason: cancelReason
      }
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully, slot released, and notifications dispatched.',
      appointment_id: appt.id,
      slot_released: { date: appt.appointment_date, time: appt.appointment_time }
    });
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// 5C. Appointment Lifecycle: Rescheduling
// ---------------------------------------------------------------------------
app.post(['/api/reschedule-appointment', '/api/reschedule-booking'], bookingLimiter, async (req, res, next) => {
  try {
    const { appointment_id, new_date, new_time, doctor } = req.body;
    if (!appointment_id || !new_date || !new_time) {
      return res.status(400).json({ success: false, message: 'appointment_id, new_date, and new_time are required' });
    }

    const apptDate = formatDate(new_date);

    const { data: appt, error: fetchErr } = await withDbRetry(() =>
      supabaseAdmin.from('appointments').select('*').eq('id', appointment_id).maybeSingle()
    );

    if (fetchErr || !appt) {
      return res.status(404).json({ success: false, message: 'Appointment record not found.' });
    }

    const targetDoctor = doctor || appt.doctor_name;

    const slotTaken = await isSlotBooked(targetDoctor, apptDate, new_time);
    if (slotTaken) {
      return res.status(409).json({
        success: false,
        message: `The selected appointment slot (${new_time} on ${apptDate}) is already reserved. Please select another slot.`
      });
    }

    const { error: updateErr } = await withDbRetry(() =>
      supabaseAdmin
        .from('appointments')
        .update({
          appointment_date: apptDate,
          appointment_time: new_time,
          doctor_name: targetDoctor,
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment_id)
    );

    if (updateErr) {
      return res.status(500).json({ success: false, message: `Failed to reschedule appointment: ${updateErr.message}` });
    }

    const clinicEmail = process.env.CLINIC_NOTIFICATION_EMAIL || process.env.NOTIFICATION_EMAIL || 'aravasamarth@gmail.com';

    if (appt.patient_email && appt.patient_email.includes('@')) {
      await enqueueNotification({
        appointmentId: appt.id,
        recipientEmail: appt.patient_email,
        recipientName: appt.patient_name,
        recipientType: 'patient',
        notificationType: 'rescheduled',
        metadata: {
          patientName: appt.patient_name,
          appointmentId: appt.id,
          treatment: appt.treatment,
          date: apptDate,
          time: new_time,
          doctor: targetDoctor
        }
      });
    }

    await enqueueNotification({
      appointmentId: appt.id,
      recipientEmail: clinicEmail,
      recipientName: 'SS Dental Care Clinic Desk',
      recipientType: 'clinic',
      notificationType: 'rescheduled',
      metadata: {
        patientName: appt.patient_name,
        patientPhone: appt.patient_phone,
        appointmentId: appt.id,
        treatment: appt.treatment,
        date: apptDate,
        time: new_time,
        doctor: targetDoctor
      }
    });

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully and notifications dispatched.',
      appointment_id: appt.id,
      new_date: apptDate,
      new_time
    });
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// 5D. Appointment Lifecycle: Manual / Staff Confirmation
// ---------------------------------------------------------------------------
app.post(['/api/confirm-appointment', '/api/confirm-booking'], bookingLimiter, async (req, res, next) => {
  try {
    const { appointment_id } = req.body;
    if (!appointment_id) {
      return res.status(400).json({ success: false, message: 'appointment_id is required' });
    }

    const { data: appt, error: fetchErr } = await withDbRetry(() =>
      supabaseAdmin.from('appointments').select('*').eq('id', appointment_id).maybeSingle()
    );

    if (fetchErr || !appt) {
      return res.status(404).json({ success: false, message: 'Appointment record not found.' });
    }

    const { error: updateErr } = await withDbRetry(() =>
      supabaseAdmin
        .from('appointments')
        .update({
          appointment_status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointment_id)
    );

    if (updateErr) {
      return res.status(500).json({ success: false, message: `Failed to confirm appointment: ${updateErr.message}` });
    }

    if (appt.patient_email && appt.patient_email.includes('@')) {
      await enqueueNotification({
        appointmentId: appt.id,
        recipientEmail: appt.patient_email,
        recipientName: appt.patient_name,
        recipientType: 'patient',
        notificationType: 'confirmation',
        metadata: {
          patientName: appt.patient_name,
          appointmentId: appt.id,
          treatment: appt.treatment,
          date: appt.appointment_date,
          time: appt.appointment_time,
          doctor: appt.doctor_name
        }
      });
    }

    res.json({
      success: true,
      message: 'Appointment confirmed successfully and confirmation email dispatched.',
      appointment_id: appt.id
    });
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// 6. General Form Inquiry Notification Endpoint
// ---------------------------------------------------------------------------
app.post('/api/notify', bookingLimiter, async (req, res, next) => {
  try {
    const { name, email, phone, date, time, message, notes, treatment } = req.body;
    const clinicEmail = process.env.CLINIC_NOTIFICATION_EMAIL || process.env.NOTIFICATION_EMAIL || 'aravasamarth@gmail.com';

    await enqueueNotification({
      appointmentId: `inquiry_${Date.now()}`,
      recipientEmail: clinicEmail,
      recipientName: 'SS Dental Care Staff',
      recipientType: 'clinic',
      notificationType: 'doctor_alert',
      metadata: {
        patientName: name || 'Website Visitor',
        patientPhone: phone || 'N/A',
        patientEmail: email || 'N/A',
        appointmentId: `INQ-${Date.now().toString().slice(-6)}`,
        treatment: treatment || 'General Consultation Inquiry',
        date: date || new Date().toISOString().split('T')[0],
        time: time || 'General Consult',
        doctor: 'Dr. Naveen / Dr. Sunitha',
        paymentStatus: 'pending',
        paymentMethod: 'Website Form Inquiry',
        amount: 250.00,
        notes: message || notes || 'Form inquiry from website.'
      }
    });

    res.json({ success: true, message: 'Inquiry notification enqueued successfully.' });
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// 7. Scheduled Reminders Cron Trigger (Hostinger / External Cron)
// ---------------------------------------------------------------------------
app.post('/api/cron/reminders', async (req, res) => {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers['authorization'];
  const querySecret = req.query.secret || req.headers['x-cron-secret'];

  if (secret) {
    const bearerMatch = authHeader === `Bearer ${secret}`;
    const headerMatch = querySecret === secret;
    if (!bearerMatch && !headerMatch) {
      return res.status(401).json({ error: 'Unauthorized: Invalid CRON_SECRET' });
    }
  }

  const results = await runReminderJob();
  res.json({ success: true, results });
});

// ---------------------------------------------------------------------------
// SPA Routing for Fullstack Deployment
// ---------------------------------------------------------------------------
if (distPath) {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ---------------------------------------------------------------------------
// Centralized Error Boundary Middleware
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    endpoint: `${req.method} ${req.originalUrl}`,
    errorName: err.name || 'Error',
    errorMessage: err.message || 'Internal Server Error'
  };

  console.error('🚨 [API Error Boundary]:', JSON.stringify(errorDetails));

  const status = err.status || (err.name === 'ZodError' ? 400 : 500);
  res.status(status).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'production' ? undefined : err.name
  });
});

// ---------------------------------------------------------------------------
// Server Startup & Graceful Lifecycle
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, () => {
    console.log(`🚀 SS Dental Care API running on port ${PORT}`);
    startOutboxWorker(15000);
    startReminderScheduler(15 * 60 * 1000);
    processDbQueue();
  });

  const handleShutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down services gracefully...`);
    stopOutboxWorker();
    stopReminderScheduler();
    server.close(() => {
      console.log('✅ HTTP server closed. Process terminating.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

module.exports = app;
