const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
const supabase = require('./db');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Razorpay Instance
// Store these values securely in a .env file!
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_SeQO0J84sbnMZb',
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Endpoint 1: Create an Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in INR, e.g. 250
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise (25000 paise = ₹250)
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
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Could not initiate payment' });
  }
});

// Helper to format date cleanly as YYYY-MM-DD
const formatDate = (dateVal) => {
  if (!dateVal) return new Date().toISOString().split('T')[0];
  if (typeof dateVal === 'string' && dateVal.includes('-')) {
    return dateVal;
  }
  return `2026-07-${dateVal.toString().padStart(2, '0')}`;
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

const { notifyNewBooking } = require('./notifications');

// Endpoint 2: Verify Payment & Confirm Booking
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails } = req.body;

    const saveBooking = async () => {
      if (!bookingDetails) return;
      const formattedTs = getFormattedTimestamp();
      const apptDate = formatDate(bookingDetails.date);
      const apptTime = (bookingDetails.time || 'General Consult').slice(0, 20);

      // Insert into paid_bookings table exclusively
      const { error: paidError } = await supabase
        .from('paid_bookings')
        .insert([
          {
            created_at: formattedTs,
            full_name: bookingDetails.name,
            email: bookingDetails.email,
            phone: bookingDetails.phone,
            appointment_date: apptDate,
            appointment_time: apptTime,
            payment_method: 'Razorpay',
            payment_status: 'paid',
            payment_id: razorpay_payment_id,
            order_id: razorpay_order_id,
            amount_paid: 250.00
          }
        ]);
      if (paidError) {
        console.error('Error inserting into paid_bookings:', paidError);
      } else {
        console.log('Successfully saved paid booking to paid_bookings table in Supabase');
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
      }).catch(err => console.error('Notification dispatch error:', err));
    };

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.warn('Warning: RAZORPAY_KEY_SECRET is not set in environment. Skipping verification check.');
      await saveBooking();
      return res.json({ success: true, message: 'Skipped signature validation due to missing credentials' });
    }

    // Verify signature
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
    console.error('Error verifying payment:', error);
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

    const { error } = await supabase
      .from('paid_bookings')
      .insert([
        {
          created_at: formattedTs,
          full_name: name,
          email: email || '',
          phone: phone,
          appointment_date: apptDate,
          appointment_time: apptTime,
          payment_method: 'Visit to pay',
          payment_status: 'pending',
          amount_paid: 250.00
        }
      ]);

    if (error) {
      console.error('Error inserting booking into paid_bookings table:', error);
      return res.status(500).json({ success: false, message: 'Failed to create booking in database' });
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
    }).catch(err => console.error('Notification dispatch error:', err));

    res.json({ success: true, message: 'Appointment booked successfully!' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Secure payment backend running on port ${PORT}`);
});
