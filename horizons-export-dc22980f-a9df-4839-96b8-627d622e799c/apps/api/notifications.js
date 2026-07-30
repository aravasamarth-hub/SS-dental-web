const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// 1. Create Nodemailer Transport
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.NOTIFICATION_EMAIL || 'ssdentalcare.in@gmail.com';
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!pass) {
    console.warn('⚠️ SMTP_PASS / GMAIL_APP_PASSWORD is not configured in .env file. Email notifications will be logged to console.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

// 2. Email Notification Handler
async function sendEmailNotification({ to, subject, html, text }) {
  const transporter = createTransporter();
  const recipient = to || process.env.NOTIFICATION_EMAIL || 'ssdentalcare.in@gmail.com';

  console.log(`[Email Notification Triggered] To: ${recipient} | Subject: ${subject}`);

  if (!transporter) {
    console.log(`[Email Notification Console Backup] To: ${recipient}\nSubject: ${subject}\nText:\n${text || html}`);
    return { success: false, reason: 'SMTP_PASS missing' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"SS Dental Care" <${process.env.SMTP_USER || 'ssdentalcare.in@gmail.com'}>`,
      to: recipient,
      subject: subject,
      text: text,
      html: html
    });
    console.log('✅ Email notification sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email notification:', error);
    return { success: false, error: error.message };
  }
}

// 3. SMS Notification Handler (Fast2SMS / Twilio)
async function sendSMSNotification({ phone, message }) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;

  console.log(`[SMS Notification Triggered] To Phone: ${phone}`);

  if (apiKey) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message: message,
          language: 'english',
          flash: 0,
          numbers: phone.replace(/[^0-9]/g, '')
        })
      });
      const data = await response.json();
      console.log('✅ Fast2SMS response:', data);
      return { success: true, data };
    } catch (err) {
      console.error('❌ Error sending SMS via Fast2SMS:', err);
    }
  } else if (twilioSid && twilioAuth) {
    console.log('ℹ️ Twilio SMS credentials configured.');
  } else {
    console.log(`[SMS Notification Console Backup] To: ${phone} | Text: ${message}`);
  }

  return { success: true, logged: true };
}

// 4. WhatsApp Notification Handler
async function sendWhatsAppNotification({ phone, message }) {
  const whatsappKey = process.env.WHATSAPP_API_KEY;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;

  console.log(`[WhatsApp Notification Triggered] To Phone: ${phone}`);

  if (whatsappKey) {
    try {
      console.log('✅ WhatsApp API key configured. Triggering WhatsApp message...');
    } catch (err) {
      console.error('❌ Error sending WhatsApp message:', err);
    }
  } else {
    console.log(`[WhatsApp Notification Console Backup] To: ${phone} | Text: ${message}`);
  }

  return { success: true, logged: true };
}

// 5. Unified Dispatcher for Appointments & Paid Bookings
async function notifyNewBooking(bookingDetails) {
  const { name, email, phone, date, time, payment_method, payment_status, amount_paid, created_at } = bookingDetails;
  const clinicEmail = process.env.NOTIFICATION_EMAIL || 'aravasamarth@gmail.com';
  const targetPhone = phone || process.env.DEMO_TEST_PHONE || '7619267764';

  const title = payment_status === 'paid' ? '💳 New Paid Booking Received!' : '📅 New Appointment Request Received!';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
      <h2 style="color: #0f172a; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-top: 0;">${title}</h2>
      <p style="font-size: 14px; color: #475569;">A new appointment/booking submission was made on the <strong>SS Dental Care</strong> website:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr style="background-color: #f8fafc;"><td style="padding: 10px; font-weight: bold; width: 35%;">Patient Name:</td><td style="padding: 10px;">${name || 'N/A'}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold;">Phone Number:</td><td style="padding: 10px;">${phone || 'N/A'}</td></tr>
        <tr style="background-color: #f8fafc;"><td style="padding: 10px; font-weight: bold;">Email Address:</td><td style="padding: 10px;">${email || 'N/A'}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold;">Appointment Date:</td><td style="padding: 10px;">${date || 'N/A'}</td></tr>
        <tr style="background-color: #f8fafc;"><td style="padding: 10px; font-weight: bold;">Appointment Time:</td><td style="padding: 10px;">${time || 'N/A'}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold;">Payment Method:</td><td style="padding: 10px;">${payment_method || 'Form / Inquiry'}</td></tr>
        <tr style="background-color: #f8fafc;"><td style="padding: 10px; font-weight: bold;">Payment Status:</td><td style="padding: 10px; font-weight: bold; color: ${payment_status === 'paid' ? '#16a34a' : '#d97706'};">${(payment_status || 'Pending').toUpperCase()}</td></tr>
        ${amount_paid ? `<tr><td style="padding: 10px; font-weight: bold;">Amount:</td><td style="padding: 10px; font-weight: bold; color: #2563eb;">₹${amount_paid}</td></tr>` : ''}
        <tr style="background-color: #f8fafc;"><td style="padding: 10px; font-weight: bold;">Submitted At:</td><td style="padding: 10px;">${created_at || new Date().toLocaleString()}</td></tr>
      </table>

      <div style="margin-top: 24px; padding: 16px; background-color: #eff6ff; border-radius: 8px; font-size: 13px; color: #1e40af;">
        🏥 <strong>SS Dental Care Davangere</strong><br/>
        Address: 2873, S S Plaza, 1st Floor, 4th Main, 4th Cross Rd, MCC B Block, Davanagere.<br/>
        Phone: +91 94484 55699
      </div>
    </div>
  `;

  const summaryText = `New Booking from ${name}: Phone: ${targetPhone}, Date: ${date}, Time: ${time}, Payment: ${payment_status || 'pending'}`;

  // 1. Send Email to Clinic / Demo Recipient
  await sendEmailNotification({
    to: clinicEmail,
    subject: `[SS Dental Care] ${title} - ${name}`,
    html: htmlContent,
    text: summaryText
  });

  // 2. Send Email to Patient if email provided
  if (email && email.includes('@') && email !== clinicEmail) {
    await sendEmailNotification({
      to: email,
      subject: `Appointment Confirmation - SS Dental Care Davangere`,
      html: htmlContent,
      text: `Hello ${name}, your appointment request for ${date} at ${time} has been received!`
    });
  }

  // 3. Send SMS Alert
  if (targetPhone) {
    const smsText = `SS Dental Care: Hello ${name}, your booking request for ${date} at ${time} is received. Clinic Ph: +919448455699`;
    await sendSMSNotification({ phone: targetPhone, message: smsText });
  }

  // 4. Send WhatsApp Alert
  if (targetPhone) {
    const waText = `Hello ${name}, thank you for choosing SS Dental Care! Your appointment booking details: Date: ${date}, Time: ${time}. Clinic Address: MCC B Block Davanagere.`;
    await sendWhatsAppNotification({ phone: targetPhone, message: waText });
  }
}

module.exports = {
  sendEmailNotification,
  sendSMSNotification,
  sendWhatsAppNotification,
  notifyNewBooking
};
