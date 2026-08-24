const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');

// Import DB module — supabase client + self-healing queue helpers
const supabase = require('./db');
const { getDbHealthStatus, saveToDbQueue, processDbQueue } = require('./db');

// Import notifications
const { notifyNewBooking, getEmailQueueStatus } = require('./notifications');

// Import watcher — MUST be at top so markAsProcessed is defined before route handlers run
const { startWatcher, markAsProcessed } = require('./watcher');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

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
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.warn('⚠️ RAZORPAY_KEY_SECRET is not configured in .env. Providing fallback order ID for client checkout.');
      return res.json({
        success: true,
        order_id: `order_client_${Date.now()}`,
        amount: (amount || 250) * 100,
        is_fallback: true
      });
    }

    const options = {
      amount: (amount || 250) * 100,
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
    console.error('Error creating order:', error.message);
    res.status(500).json({ success: false, message: 'Could not initiate payment' });
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

// Endpoint 2: Verify Payment & Confirm Booking
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails } = req.body;

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
        amount_paid: 250.00
      };

      try {
        const { data: insertedData, error: paidError } = await supabase
          .from('paid_bookings')
          .insert([record])
          .select('id');

        if (paidError) {
          console.warn('⚠️ [Supabase DB Issue] Insert to paid_bookings failed. Saving to self-healing retry queue:', paidError.message);
          saveToDbQueue('paid_bookings', record);
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
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ success: false, message: 'Verification process failed' });
  }
});

// Endpoint 3: Create Booking (for Visit to Pay option)
app.post('/api/create-booking', async (req, res) => {
  try {
    const { name, email, phone, date, time } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Missing required booking details' });
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
      amount_paid: 250.00
    };

    try {
      const { data: insertedData, error } = await supabase
        .from('paid_bookings')
        .insert([record])
        .select('id');

      if (error) {
        console.warn('⚠️ Supabase insert notice. Saving to self-healing DB queue:', error.message);
        saveToDbQueue('paid_bookings', record);
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
    console.error('Error creating booking:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Endpoint 4: Direct Notification Trigger for General Inquiries & Form Submissions
app.post('/api/notify', async (req, res) => {
  try {
    const { name, email, phone, date, time, payment_method, payment_status, amount_paid, created_at, form_type } = req.body;

    await notifyNewBooking({
      name: name || 'Valued Patient',
      email: email || '',
      phone: phone || '',
      date: date || new Date().toISOString().split('T')[0],
      time: time || 'General Consult',
      payment_method: payment_method || form_type || 'General Form Inquiry',
      payment_status: payment_status || 'pending',
      amount_paid: amount_paid || 0.00,
      created_at: created_at || getFormattedTimestamp()
    });

    res.json({ success: true, message: 'Notification dispatched successfully!' });
  } catch (error) {
    console.error('Error dispatching notification:', error.message);
    res.status(500).json({ success: false, message: 'Failed to dispatch notification' });
  }
});

// Endpoint 5: Sync Offline Backup Queue
app.post('/api/sync-backup', async (req, res) => {
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
    console.error('Error syncing backup items:', error.message);
    res.status(500).json({ success: false, message: 'Failed to sync backup queue' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SS Dental Care API running on port ${PORT}`);
  // Start watcher to detect new Supabase entries and send email for new ones
  startWatcher(10000);
  // Flush any previously queued DB inserts that failed before last restart
  processDbQueue();
});
