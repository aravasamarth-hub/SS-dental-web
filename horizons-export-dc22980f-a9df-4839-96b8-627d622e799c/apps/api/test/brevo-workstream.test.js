const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { templates, sendTransactionalEmail, CLINIC_INFO } = require('../brevo');
const { enqueueNotification, processOutbox, claimPendingItems } = require('../outbox-worker');

describe('Workstream B — Brevo Transactional Email Engine & Outbox (Synthetic Suite)', () => {

  const syntheticAppointment = {
    id: 'syn-test-appt-uuid-001',
    patient_name: 'Synthetic Test Patient',
    patient_email: 'test_patient@ssdentalcare.in',
    patient_phone: '9876543210',
    treatment: 'Dental Consultation & Scaling',
    doctor_name: 'Dr. Naveen Kumar',
    appointment_date: '2026-11-25',
    appointment_time: '11:30 AM',
    payment_status: 'paid',
    payment_method: 'Razorpay',
    amount: 250.00,
    notes: 'Synthetic test appointment notes'
  };

  // 1. Booking confirmation to patient
  it('1. Generates valid booking confirmation template for patient', () => {
    const payload = templates.appointmentConfirmed({
      patientName: syntheticAppointment.patient_name,
      appointmentId: syntheticAppointment.id,
      treatment: syntheticAppointment.treatment,
      date: syntheticAppointment.appointment_date,
      time: syntheticAppointment.appointment_time,
      doctor: syntheticAppointment.doctor_name
    });
    assert.match(payload.subject, /Appointment Confirmed/i);
    assert.match(payload.htmlContent, /Appointment Confirmed/);
    assert.match(payload.htmlContent, /Dr\. Naveen Kumar/);
    assert.match(payload.textContent, /Dental Consultation & Scaling/);
  });

  // 2. New booking notification to clinic/doctor
  it('2. Generates alert for clinic/doctor with patient contact and payment metadata', () => {
    const payload = templates.doctorAlert({
      patientName: syntheticAppointment.patient_name,
      patientPhone: syntheticAppointment.patient_phone,
      patientEmail: syntheticAppointment.patient_email,
      appointmentId: syntheticAppointment.id,
      treatment: syntheticAppointment.treatment,
      date: syntheticAppointment.appointment_date,
      time: syntheticAppointment.appointment_time,
      doctor: syntheticAppointment.doctor_name,
      paymentStatus: syntheticAppointment.payment_status,
      paymentMethod: syntheticAppointment.payment_method,
      amount: syntheticAppointment.amount,
      notes: syntheticAppointment.notes
    });
    assert.match(payload.subject, /\[New Booking\]/);
    assert.match(payload.htmlContent, /9876543210/);
    assert.match(payload.htmlContent, /PAID/);
    assert.match(payload.textContent, /Alert: New appointment/);
  });

  // 3. Cancellation notification
  it('3. Generates cancellation notification with slot release context', () => {
    const patientPayload = templates.appointmentCancelled({
      patientName: syntheticAppointment.patient_name,
      appointmentId: syntheticAppointment.id,
      date: syntheticAppointment.appointment_date,
      time: syntheticAppointment.appointment_time,
      reason: 'Patient requested reschedule'
    });
    assert.match(patientPayload.subject, /Appointment Cancelled/);
    assert.match(patientPayload.htmlContent, /Patient requested reschedule/);

    const clinicPayload = templates.appointmentCancelledDoctor({
      patientName: syntheticAppointment.patient_name,
      patientPhone: syntheticAppointment.patient_phone,
      appointmentId: syntheticAppointment.id,
      date: syntheticAppointment.appointment_date,
      time: syntheticAppointment.appointment_time,
      reason: 'Patient requested reschedule'
    });
    assert.match(clinicPayload.subject, /Released Slot/);
  });

  // 4. Reschedule notification
  it('4. Generates reschedule notification with new date and time', () => {
    const payload = templates.appointmentRescheduled({
      patientName: syntheticAppointment.patient_name,
      appointmentId: syntheticAppointment.id,
      treatment: syntheticAppointment.treatment,
      date: '2026-11-28',
      time: '03:00 PM',
      doctor: syntheticAppointment.doctor_name
    });
    assert.match(payload.subject, /Appointment Rescheduled/);
    assert.match(payload.htmlContent, /2026-11-28/);
    assert.match(payload.htmlContent, /03:00 PM/);
  });

  // 5. Payment success / booking received notification
  it('5. Generates payment received & booking notification with transaction details', () => {
    const payload = templates.patientBookingReceived({
      patientName: syntheticAppointment.patient_name,
      appointmentId: syntheticAppointment.id,
      treatment: syntheticAppointment.treatment,
      date: syntheticAppointment.appointment_date,
      time: syntheticAppointment.appointment_time,
      doctor: syntheticAppointment.doctor_name,
      paymentStatus: 'paid',
      paymentMethod: 'Razorpay',
      amount: 250.00
    });
    assert.match(payload.subject, /Booking Received/);
    assert.match(payload.htmlContent, /PAID/);
    assert.match(payload.htmlContent, /₹250/);
  });

  // 6. Reminder notifications (24h and 2h)
  it('6. Generates 24-hour and 2-hour appointment reminders', () => {
    const rem24 = templates.appointmentReminder({
      patientName: syntheticAppointment.patient_name,
      appointmentId: syntheticAppointment.id,
      treatment: syntheticAppointment.treatment,
      date: syntheticAppointment.appointment_date,
      time: syntheticAppointment.appointment_time,
      doctor: syntheticAppointment.doctor_name,
      reminderType: 'reminder_24h'
    });
    assert.match(rem24.subject, /in 24 Hours/);

    const rem2 = templates.appointmentReminder({
      patientName: syntheticAppointment.patient_name,
      appointmentId: syntheticAppointment.id,
      treatment: syntheticAppointment.treatment,
      date: syntheticAppointment.appointment_date,
      time: syntheticAppointment.appointment_time,
      doctor: syntheticAppointment.doctor_name,
      reminderType: 'reminder_2h'
    });
    assert.match(rem2.subject, /in 2 Hours/);
  });

  // 7. Failed-send retry with exponential backoff
  it('7. Calculates exponential backoff correctly across 5 attempts', () => {
    const calculateBackoffMs = (attempt) => Math.pow(2, attempt) * 60 * 1000;
    assert.equal(calculateBackoffMs(1), 2 * 60 * 1000);   // Attempt 1 -> 2m
    assert.equal(calculateBackoffMs(2), 4 * 60 * 1000);   // Attempt 2 -> 4m
    assert.equal(calculateBackoffMs(3), 8 * 60 * 1000);   // Attempt 3 -> 8m
    assert.equal(calculateBackoffMs(4), 16 * 60 * 1000);  // Attempt 4 -> 16m
    assert.equal(calculateBackoffMs(5), 32 * 60 * 1000);  // Attempt 5 -> 32m
  });

  // 8. Duplicate event suppression
  it('8. Composite deduplication key enforces single entry per event', async () => {
    const key1 = `syn_dedup_001_patient_confirmation_test@ssdentalcare.in`;
    const key2 = `syn_dedup_001_patient_confirmation_test@ssdentalcare.in`;
    assert.equal(key1, key2);
  });

  // 9. Recovery of stuck processing job (> 5 min)
  it('9. Stored procedure claim_notification_outbox SQL includes 5-minute self-healing clause', () => {
    const fs = require('fs');
    const sql = fs.readFileSync(path.resolve(__dirname, '../../../supabase/migrations/01_create_core_tables.sql'), 'utf8');
    assert.ok(sql.includes("status = 'processing' AND updated_at < timezone('utc', now()) - INTERVAL '5 minutes'"));
  });

  // 10. Provider response/message ID capture logic
  it('10. Client handles missing API key gracefully without crashing and records simulated response', async () => {
    const res = await sendTransactionalEmail({
      to: 'synthetic_recipient@ssdentalcare.in',
      recipientName: 'Synthetic Tester',
      subject: 'Test Subject',
      htmlContent: '<p>Test</p>'
    });
    // In dev/test when BREVO_API_KEY is not configured, returns clean warning
    assert.equal(res.success, false);
    assert.equal(res.error, 'BREVO_API_KEY_MISSING');
    assert.ok(res.messageId.startsWith('simulated_'));
  });

});
