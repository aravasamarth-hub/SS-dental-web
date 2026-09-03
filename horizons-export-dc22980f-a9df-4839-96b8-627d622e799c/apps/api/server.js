const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
const { z } = require('zod');

// Import DB module — supabase client + self-healing queue helpers + idempotency
const supabase = require('./db');
const { getDbHealthStatus, saveToDbQueue, processDbQueue, checkRecordAlreadyExists, withDbRetry } = require('./db');

// Import notifications
const { notifyNewBooking, getEmailQueueStatus } = require('./notifications');

// Import watcher — MUST be at top so markAsProcessed is defined before route handlers run
const { startWatcher, markAsProcessed } = require('./watcher');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Zod Validation Schemas
const bookingSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(255),
  phone: z.string().trim().min(7, 'Phone number is too short').max(50),
  email: z.string().trim().email('Invalid email address').or(z.literal('')).optional().default(''),
  date: z.any().optional().default(''),
  time: z.string().optional().default(''),
  idempotency_key: z.string().trim().min(1).max(255).optional()
});

const paymentVerifySchema = z.object({
  razorpay_order_id: z.string().trim().optional(),
  razorpay_payment_id: z.string().trim().optional(),
  razorpay_signature: z.string().trim().optional(),
  idempotency_key: z.string().trim().min(1).max(255).optional(),
  bookingDetails: z.object({
    name: z.string().trim().min(1, 'Name is required').max(255),
    phone: z.string().trim().min(7, 'Phone number is too short').max(50),
    email: z.string().trim().email('Invalid email address').or(z.literal('')).optional().default(''),
    date: z.any().optional(),
    time: z.string().optional().default('')
  }).optional()
});

// Health Check Endpoint with Detailed Diagnostics
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SS Dental Care API',
    timestamp: new Date().toISOString(),
    database: getDbHealthStatus(),
    emailQueue: getEmailQueueStatus()
  });
});

// Initialize Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_SeQO0J84sbnMZb',
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Endpoint 1: Create an Order
app.post('/api/create-order', async (req, res, next) => {
  try {
    const { amount } = req.body;
    const numAmount = Number(amount) || 250;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.warn('⚠️ RAZORPAY_KEY_SECRET is not configured in .env. Providing fallback order ID for client checkout.');
      return res.json({
        success: true,
        order_id: `order_client_${Date.now()}`,
        amount: numAmount * 100,
        is_fallback: true
      });
    }

    const options = {
      amount: numAmount * 100,
      currency: 'INR',
      receipt: `receipt_booking_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order_id: order.id,
      amount: order.amount
    });
  } catch (error) {
    next(error);
  }
});

// Helper to format date cleanly as YYYY-MM-DD
const formatDate = (dateVal) => {
  if (!dateVal) return new Date().toISOString().split('T')[0];
  if (typeof dateVal === 'string' && dateVal.includes('-')) {
    return dateVal;
  }
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(dateVal).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getFormattedTimestamp = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const strHours = String(hours).padStart(2, '0');
  return `${day}/${month}/${year}, ${strHours}:${minutes}:${seconds} ${ampm}`;
};

// Endpoint 2: Verify Payment & Confirm Booking (with Idempotency + Zod Validation)
app.post('/api/verify-payment', async (req, res, next) => {
  try {
    const parseResult = paymentVerifySchema.safeParse(req.body);
    if (!parseResult.success) {
      const errDetail = parseResult.error.errors[0]?.message || 'Invalid payload';
      return res.status(400).json({ success: false, message: `Validation Error: ${errDetail}` });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails, idempotency_key } = parseResult.data;

    // Idempotency check: if already confirmed under this idempotency_key, return early
    if (idempotency_key) {
      const alreadySaved = await checkRecordAlreadyExists('paid_bookings', { idempotency_key });
      if (alreadySaved) {
        console.log(`ℹ️ [Idempotency] Payment record for key '${idempotency_key}' already processed.`);
        return res.json({ success: true, message: 'Payment verified and appointment booked (idempotent)', duplicate: true });
      }
    }

    const saveBooking = async () => {
      if (!bookingDetails) return;
      const formattedTs = getFormattedTimestamp();
      const apptDate = formatDate(bookingDetails.date);
      const apptTime = (bookingDetails.time || 'General Consult').slice(0, 20);

      const record = {
        created_at: formattedTs,
        full_name: bookingDetails.name,
        email: bookingDetails.email || '',
        phone: bookingDetails.phone,
        appointment_date: apptDate,
        appointment_time: apptTime,
        payment_method: 'Razorpay',
        payment_status: 'paid',
        payment_id: razorpay_payment_id || null,
        order_id: razorpay_order_id || null,
        amount_paid: 250.00,
        idempotency_key: idempotency_key || null
      };

      try {
        const { data: insertedData, error: paidError } = await withDbRetry(() =>
          supabase
            .from('paid_bookings')
            .insert([record])
            .select('id')
        );

        if (paidError) {
          // Check for unique constraint violation on idempotency_key
          if (paidError.code === '23505' || (paidError.message && paidError.message.includes('idempotency_key'))) {
            console.log(`ℹ️ [Idempotency Conflict] Paid booking already saved in DB for key '${idempotency_key}'.`);
          } else {
            console.warn('⚠️ [Supabase DB Issue] Insert to paid_bookings failed. Saving to self-healing retry queue:', paidError.message);
            saveToDbQueue('paid_bookings', record);
          }
        } else {
          console.log('✅ Successfully saved paid booking to Supabase paid_bookings table.');
          if (insertedData && insertedData[0] && insertedData[0].id) {
            markAsProcessed('paid_bookings', insertedData[0].id);
          }
        }
      } catch (dbEx) {
        console.warn('⚠️ Supabase exception during insert. Saving to self-healing DB queue:', dbEx.message);
        saveToDbQueue('paid_bookings', record);
      }

      // Trigger Email, SMS, & WhatsApp Notifications
      notifyNewBooking({
        name: bookingDetails.name,
        email: bookingDetails.email,
        phone: bookingDetails.phone,
        date: apptDate,
        time: apptTime,
        payment_method: 'Razorpay',
        payment_status: 'paid',
        amount_paid: 250.00,
        created_at: formattedTs
      }).catch(err => console.error('Notification dispatch error:', err.message));
    };

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.warn('Warning: RAZORPAY_KEY_SECRET is not set in environment. Skipping verification check.');
      await saveBooking();
      return res.json({ success: true, message: 'Skipped signature validation due to missing credentials' });
    }

    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      console.log('Payment verified successfully for order:', razorpay_order_id);
      await saveBooking();
      res.json({ success: true, message: 'Payment verified and appointment booked!' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    next(error);
  }
});

// Endpoint 3: Create Booking (for Visit to Pay option with Idempotency + Zod Validation)
app.post('/api/create-booking', async (req, res, next) => {
  try {
    const parseResult = bookingSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errDetail = parseResult.error.errors[0]?.message || 'Invalid booking details';
      return res.status(400).json({ success: false, message: `Validation Error: ${errDetail}` });
    }

    const { name, email, phone, date, time, idempotency_key } = parseResult.data;

    // Idempotency check: if already confirmed under this idempotency_key, return early
    if (idempotency_key) {
      const alreadySaved = await checkRecordAlreadyExists('paid_bookings', { idempotency_key });
      if (alreadySaved) {
        console.log(`ℹ️ [Idempotency] Booking for key '${idempotency_key}' already processed.`);
        return res.json({ success: true, message: 'Appointment already booked (idempotent)', duplicate: true });
      }
    }

    const formattedTs = getFormattedTimestamp();
    const apptDate = formatDate(date);
    const apptTime = (time || 'General Consult').slice(0, 20);

    const record = {
      created_at: formattedTs,
      full_name: name,
      email: email || '',
      phone: phone,
      appointment_date: apptDate,
      appointment_time: apptTime,
      payment_method: 'Visit to pay',
      payment_status: 'pending',
      amount_paid: 250.00,
      idempotency_key: idempotency_key || null
    };

    try {
      const { data: insertedData, error } = await withDbRetry(() =>
        supabase
          .from('paid_bookings')
          .insert([record])
          .select('id')
      );

      if (error) {
        // Check for unique constraint violation on idempotency_key
        if (error.code === '23505' || (error.message && error.message.includes('idempotency_key'))) {
          console.log(`ℹ️ [Idempotency Conflict] Booking already saved in DB for key '${idempotency_key}'.`);
        } else {
          console.warn('⚠️ Supabase insert notice. Saving to self-healing DB queue:', error.message);
          saveToDbQueue('paid_bookings', record);
        }
      } else if (insertedData && insertedData[0] && insertedData[0].id) {
        markAsProcessed('paid_bookings', insertedData[0].id);
      }
    } catch (dbEx) {
      console.warn('⚠️ Supabase exception during booking create. Queueing for retry:', dbEx.message);
      saveToDbQueue('paid_bookings', record);
    }

    // Trigger Email, SMS, & WhatsApp Notifications
    notifyNewBooking({
      name,
      email,
      phone,
      date: apptDate,
      time: apptTime,
      payment_method: 'Visit to pay',
      payment_status: 'pending',
      amount_paid: 250.00,
      created_at: formattedTs
    }).catch(err => console.error('Notification dispatch error:', err.message));

    res.json({ success: true, message: 'Appointment booked successfully!' });
  } catch (error) {
    next(error);
  }
});

// Endpoint 4: Direct Notification Trigger for General Inquiries & Form Submissions
app.post('/api/notify', async (req, res, next) => {
  try {
    const { name, email, phone, date, time, payment_method, payment_status, amount_paid, created_at, form_type, message, notes } = req.body;

    await notifyNewBooking({
      name: name || 'Valued Patient',
      email: email || '',
      phone: phone || '',
      date: date || new Date().toISOString().split('T')[0],
      time: time || 'General Consult',
      payment_method: payment_method || form_type || 'General Form Inquiry',
      payment_status: payment_status || 'pending',
      amount_paid: amount_paid || 0.00,
      created_at: created_at || getFormattedTimestamp(),
      message: message || notes || ''
    });

    res.json({ success: true, message: 'Notification dispatched successfully!' });
  } catch (error) {
    next(error);
  }
});

// Endpoint 5: Sync Offline Backup Queue
app.post('/api/sync-backup', async (req, res, next) => {
  try {
    const { items } = req.body;
    if (Array.isArray(items)) {
      console.log(`[Backup Sync] Received ${items.length} backed up patient records for notification sync...`);
      for (const item of items) {
        await notifyNewBooking({
          name: item.name || 'Valued Patient',
          email: item.email || '',
          phone: item.phone || '',
          date: item.date || new Date().toISOString().split('T')[0],
          time: item.time || 'General Consult',
          payment_method: item.payment_method || 'Offline Backup Sync',
          payment_status: item.payment_status || 'pending',
          amount_paid: item.amount_paid || 0.00,
          created_at: item.timestamp || getFormattedTimestamp()
        }).catch(err => console.warn('Backup item notify warning:', err.message));
      }
    }
    res.json({ success: true, count: items ? items.length : 0 });
  } catch (error) {
    next(error);
  }
});

// ---------------------------------------------------------------------------
// Centralized Error Boundary Middleware
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
  const errorDetails = {
    timestamp: new Date().toISOString(),
    endpoint: `${req.method} ${req.originalUrl}`,
    errorName: err.name || 'Error',
    errorMessage: err.message || 'Internal Server Error',
    idempotencyKey: req.body?.idempotency_key || req.headers['x-idempotency-key'] || null
  };

  console.error('🚨 [API Error Boundary]:', JSON.stringify(errorDetails));

  const status = err.status || (err.name === 'ZodError' ? 400 : 500);
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? undefined : err.name
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SS Dental Care API running on port ${PORT}`);
    // Start watcher to detect new Supabase entries and send email for new ones
    startWatcher(10000);
    // Flush any previously queued DB inserts that failed before last restart
    processDbQueue();
  });
}

module.exports = app;

