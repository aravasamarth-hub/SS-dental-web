/**
 * SS Dental Care — Unified Notification Gateway (Brevo & Outbox Adapter)
 * 
 * ARCHITECTURE UPGRADE:
 * Replaces old Gmail SMTP / Nodemailer delivery with the authoritative Brevo API
 * and durable PostgreSQL outbox (`outbox-worker.js`).
 * 
 * Preserves existing exported function signatures so existing code remains 100% compatible.
 */

const { enqueueNotification } = require('./outbox-worker');
const { sendTransactionalEmail, templates } = require('./brevo');

/**
 * Unified Dispatcher for Appointments & Bookings
 * Routes through the durable notification outbox
 */
async function notifyNewBooking(bookingDetails) {
  const {
    name,
    email,
    phone,
    date,
    time,
    payment_method,
    payment_status,
    amount_paid,
    treatment,
    doctor,
    notes,
    message,
    appointmentId
  } = bookingDetails;

  const apptId = appointmentId || `booking_${Date.now()}`;
  const clinicEmail = process.env.CLINIC_NOTIFICATION_EMAIL || process.env.NOTIFICATION_EMAIL || 'aravasamarth@gmail.com';
  const cleanPhone = phone || '';
  const cleanNotes = notes || message || '';
  const cleanTreatment = treatment || 'General Dental Consultation';
  const cleanDoctor = doctor || 'Dr. Naveen / Dr. Sunitha';

  const metadata = {
    patientName: name || 'Valued Patient',
    patientPhone: cleanPhone,
    patientEmail: email || '',
    appointmentId: apptId,
    treatment: cleanTreatment,
    date: date || new Date().toISOString().split('T')[0],
    time: time || 'General Consult',
    doctor: cleanDoctor,
    paymentStatus: payment_status || 'pending',
    paymentMethod: payment_method || 'Visit to pay',
    amount: amount_paid || 250.00,
    notes: cleanNotes
  };

  const results = { patient: null, clinic: null };

  // 1. Dispatch/Enqueue to Clinic Desk
  results.clinic = await enqueueNotification({
    appointmentId: apptId,
    recipientEmail: clinicEmail,
    recipientName: 'SS Dental Care Clinic Desk',
    recipientType: 'clinic',
    notificationType: 'doctor_alert',
    metadata
  });

  // 2. Dispatch/Enqueue to Patient if valid email provided
  if (email && email.includes('@')) {
    results.patient = await enqueueNotification({
      appointmentId: apptId,
      recipientEmail: email,
      recipientName: name,
      recipientType: 'patient',
      notificationType: 'booking_received',
      metadata
    });
  }

  return { success: true, results };
}

/**
 * Direct email sender wrapper (Brevo transactional API)
 */
async function sendEmailNotification({ to, subject, html, text }) {
  const recipient = to || process.env.CLINIC_NOTIFICATION_EMAIL || 'aravasamarth@gmail.com';
  return sendTransactionalEmail({
    to: recipient,
    subject,
    htmlContent: html,
    textContent: text
  });
}

module.exports = {
  notifyNewBooking,
  sendEmailNotification,
  getEmailQueueStatus: () => ({ pendingCount: 0 })
};
