const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const EMAIL_QUEUE_FILE = path.join(__dirname, 'email_queue.json');
const recentEmailDispatches = new Map();
let isProcessingEmailQueue = false;

// 1. Create Nodemailer Transport
// Default fallback recipients (override via .env NOTIFICATION_EMAIL)
const DEFAULT_CLINIC_EMAIL = process.env.NOTIFICATION_EMAIL || 'aravasamarth@gmail.com';

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.NOTIFICATION_EMAIL || 'aravasamarth@gmail.com';
  const pass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

  if (!pass) {
    console.warn('⚠️ SMTP_PASS / GMAIL_APP_PASSWORD is not configured in .env file. Email notifications will log to console & local queue.');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000
  });
};

// Verify Transporter Health on startup
const verifyTransporter = async () => {
  const transporter = createTransporter();
  if (!transporter) return false;
  try {
    await transporter.verify();
    console.log('✅ Nodemailer SMTP connection verified successfully.');
    return true;
  } catch (err) {
    console.warn('⚠️ Nodemailer SMTP verification warning (Failed emails will automatically queue):', err.message);
    return false;
  }
};
verifyTransporter();

// 2. Queue Operations for Offline / Failed Email Self-Healing
function getEmailQueue() {
  try {
    if (fs.existsSync(EMAIL_QUEUE_FILE)) {
      const data = fs.readFileSync(EMAIL_QUEUE_FILE, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (err) {
    console.error('⚠️ Could not read email queue file:', err.message);
  }
  return [];
}

function saveToEmailQueue(emailTask) {
  try {
    const queue = getEmailQueue();
    const newItem = {
      id: `email_queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...emailTask,
      attempts: 0,
      created_at: new Date().toISOString()
    };
    queue.push(newItem);
    fs.writeFileSync(EMAIL_QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
    console.log(`📦 [Email Self-Healing Queue] Saved failed email to local queue. Total pending emails: ${queue.length}`);
    return newItem;
  } catch (err) {
    console.error('❌ Failed to write email queue file:', err.message);
  }
}

// 3. Email Queue Processor
async function processEmailQueue() {
  if (isProcessingEmailQueue) return;
  const queue = getEmailQueue();
  if (queue.length === 0) return;

  isProcessingEmailQueue = true;
  console.log(`🔄 [Email Self-Healing Queue] Processing ${queue.length} pending queued emails...`);
  const remainingQueue = [];

  for (const item of queue) {
    const result = await sendEmailNotificationDirect({
      to: item.to,
      subject: item.subject,
      html: item.html,
      text: item.text
    });

    if (result.success) {
      console.log(`✅ [Email Queue Restored] Delivered queued email ID ${item.id} to ${item.to}`);
    } else {
      item.attempts = (item.attempts || 0) + 1;
      if (item.attempts < 10) {
        remainingQueue.push(item);
      } else {
        console.error(`❌ [Email Queue Max Retries] Dropping queued email ${item.id} after 10 failed attempts.`);
      }
    }
  }

  try {
    fs.writeFileSync(EMAIL_QUEUE_FILE, JSON.stringify(remainingQueue, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Error updating email queue file:', err.message);
  }
  isProcessingEmailQueue = false;
}

// Start 20s Email Queue Drain Loop
setInterval(processEmailQueue, 20000);

// Helper function to send email directly with 3 retries
async function sendEmailNotificationDirect({ to, subject, html, text }) {
  const transporter = createTransporter();
  const recipient = to || DEFAULT_CLINIC_EMAIL;

  if (!transporter) {
    console.log(`[Email Console Backup] To: ${recipient} | Subject: ${subject}`);
    return { success: false, reason: 'SMTP_PASS missing' };
  }

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const info = await transporter.sendMail({
        from: `"SS Dental Care" <${process.env.SMTP_USER || 'aravasamarth@gmail.com'}>`,
        to: recipient,
        subject: subject,
        text: text,
        html: html
      });
      console.log(`✅ Email notification sent successfully (Attempt ${attempts}):`, info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.warn(`⚠️ Email send attempt ${attempts} failed:`, error.message);
      if (attempts < maxAttempts) {
        await new Promise(res => setTimeout(res, 1500 * attempts)); // Backoff delay
      } else {
        return { success: false, error: error.message };
      }
    }
  }
  return { success: false, error: 'Max attempts reached' };
}

// 4. Public Email Notification Handler (with Deduplication & Queue Fallback)
async function sendEmailNotification({ to, subject, html, text }) {
  const recipient = to || DEFAULT_CLINIC_EMAIL;
  
  // Deduplication check (10-minute window for identical recipient + subject)
  const hashKey = `${recipient}_${subject}`;
  const now = Date.now();
  if (recentEmailDispatches.has(hashKey)) {
    const lastSent = recentEmailDispatches.get(hashKey);
    if (now - lastSent < 600000) { // 10 minutes
      console.log(`ℹ️ [Email Suppressed] Duplicate email for ${hashKey} within 10 min window.`);
      return { success: true, duplicateSuppressed: true };
    }
  }
  recentEmailDispatches.set(hashKey, now);

  console.log(`[Email Notification Triggered] To: ${recipient} | Subject: ${subject}`);

  const result = await sendEmailNotificationDirect({ to: recipient, subject, html, text });
  
  if (!result.success && result.reason !== 'SMTP_PASS missing') {
    // Save to queue for self-healing automatic background delivery
    saveToEmailQueue({ to: recipient, subject, html, text });
  }

  return result;
}

// 5. SMS Notification Handler (Fast2SMS)
async function sendSMSNotification({ phone, message }) {
  const apiKey = process.env.FAST2SMS_API_KEY;

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
      console.error('❌ Error sending SMS via Fast2SMS:', err.message);
      return { success: false, error: err.message };
    }
  } else {
    console.log(`[SMS Notification Console Backup] To: ${phone} | Text: ${message}`);
  }

  return { success: true, logged: true };
}

// 6. WhatsApp Notification Handler
async function sendWhatsAppNotification({ phone, message }) {
  const whatsappKey = process.env.WHATSAPP_API_KEY;

  console.log(`[WhatsApp Notification Triggered] To Phone: ${phone}`);

  if (whatsappKey) {
    // WhatsApp API integration — add your provider's API call here
    console.log('✅ WhatsApp API key configured. Ready to send message.');
  } else {
    console.log(`[WhatsApp Notification Console Backup] To: ${phone} | Text: ${message}`);
  }

  return { success: true, logged: true };
}

// 7. Unified Dispatcher for Appointments & Paid Bookings
async function notifyNewBooking(bookingDetails) {
  const { name, email, phone, date, time, payment_method, payment_status, amount_paid, created_at } = bookingDetails;
  const clinicEmail = DEFAULT_CLINIC_EMAIL;
  const targetPhone = phone || process.env.DEMO_TEST_PHONE || '';

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
  notifyNewBooking,
  getEmailQueueStatus: () => ({ pendingCount: getEmailQueue().length }),
  processEmailQueue
};

