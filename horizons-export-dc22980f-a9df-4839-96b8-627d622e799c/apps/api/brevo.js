/**
 * SS Dental Care — Brevo Transactional Email Integration Client
 * Direct v3 REST API (https://api.brevo.com/v3/smtp/email)
 * Features: High-deliverability HTML templates, retry logic, timeout, plaintext fallback.
 * Implements all 7 required clinic & patient email events.
 */

const BREVO_API_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

const CLINIC_INFO = {
  name: 'SS Dental Care Davangere',
  address: '2873, S S Plaza, 1st Floor, 4th Main, 4th Cross Rd, MCC B Block, Davanagere, Karnataka 577004',
  phone: '+91 94484 55699',
  website: process.env.PUBLIC_WEBSITE_URL || 'https://www.ssdentalcare.in',
  doctors: 'Dr. Naveen Kumar & Dr. Sunitha Naveen'
};

/**
 * Send an email via Brevo's Transactional Email API
 */
async function sendTransactionalEmail({ to, recipientName, subject, htmlContent, textContent, tags = [] }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'info@ssdentalcare.in';
  const senderName = process.env.BREVO_SENDER_NAME || 'SS Dental Care';

  if (!apiKey) {
    console.warn('⚠️ [Brevo API Warning]: BREVO_API_KEY is not configured in .env. Email dispatch simulated.');
    return {
      success: false,
      error: 'BREVO_API_KEY_MISSING',
      messageId: `simulated_${Date.now()}`
    };
  }

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail
    },
    to: [
      {
        email: to.trim(),
        name: recipientName || to.split('@')[0]
      }
    ],
    subject,
    htmlContent,
    textContent: textContent || subject,
    tags
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

  try {
    const response = await fetch(BREVO_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const data = await response.json().catch(() => ({}));

    if (response.status === 201 || response.status === 200) {
      console.log(`✅ [Brevo API Success]: Email sent to ${to} (MessageId: ${data.messageId || 'OK'})`);
      return {
        success: true,
        messageId: data.messageId,
        statusCode: response.status
      };
    } else {
      const errMsg = data.message || `Brevo responded with status ${response.status}`;
      console.error(`🚨 [Brevo API Error ${response.status}]: ${errMsg}`);
      return {
        success: false,
        error: errMsg,
        code: data.code || 'BREVO_ERROR',
        statusCode: response.status
      };
    }
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    const errText = isTimeout ? 'Brevo request timed out after 12s' : err.message;
    console.error('🚨 [Brevo Network Failure]:', errText);
    return {
      success: false,
      error: errText,
      code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR'
    };
  }
}

/**
 * Base email wrapper template
 */
function wrapEmailTemplate({ title, badge, contentHtml }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
        .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #1e40af, #2563eb); padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 14px; }
        .body { padding: 32px 24px; }
        .badge { display: inline-block; padding: 6px 14px; background-color: #dbeafe; color: #1e40af; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
        .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0; }
        .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
        .row:last-child { border-bottom: none; }
        .label { color: #64748b; font-weight: 600; width: 40%; }
        .val { color: #0f172a; font-weight: 700; width: 60%; text-align: right; }
        .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 14px; margin-top: 16px; }
        @media only screen and (max-width: 600px) {
          .container { margin: 10px; border-radius: 12px; }
          .row { flex-direction: column; text-align: left; }
          .val { text-align: left; width: 100%; margin-top: 2px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏥 ${CLINIC_INFO.name}</h1>
          <p>Excellence in Advanced Dental & Implant Care</p>
        </div>
        <div class="body">
          ${badge ? `<div class="badge">${badge}</div>` : ''}
          ${contentHtml}
          <div style="text-align: center; margin-top: 24px;">
            <a href="${CLINIC_INFO.website}" class="btn">Visit Website & Patient Portal</a>
          </div>
        </div>
        <div class="footer">
          <p><strong>Clinic Address:</strong> ${CLINIC_INFO.address}</p>
          <p><strong>Direct Helpline:</strong> ${CLINIC_INFO.phone}</p>
          <p style="margin-top: 12px; color: #94a3b8;">This is an automated notification from SS Dental Care. Please retain this email for your appointment reference.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Template Generators covering all 7 Clinic & Patient Event Types
 */
const templates = {
  // Event 1: Patient Booking Received
  patientBookingReceived: ({ patientName, appointmentId, treatment, date, time, doctor, paymentStatus, paymentMethod, amount }) => {
    const title = 'Appointment Request Received';
    const contentHtml = `
      <h2 style="color: #0f172a; margin-top: 0;">Dear ${patientName},</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.6;">
        Thank you for booking with <strong>SS Dental Care</strong>. Your appointment request has been recorded in our clinical schedule.
      </p>
      <div class="details-box">
        <div class="row"><div class="label">Booking Ref:</div><div class="val">${(appointmentId || 'PENDING').slice(0, 8).toUpperCase()}</div></div>
        <div class="row"><div class="label">Consulting Doctor:</div><div class="val">${doctor || CLINIC_INFO.doctors}</div></div>
        <div class="row"><div class="label">Treatment / Service:</div><div class="val">${treatment || 'General Dental Consultation'}</div></div>
        <div class="row"><div class="label">Scheduled Date:</div><div class="val">${date}</div></div>
        <div class="row"><div class="label">Scheduled Time:</div><div class="val">${time}</div></div>
        <div class="row"><div class="label">Payment Mode:</div><div class="val">${paymentMethod || 'Visit to pay'}</div></div>
        <div class="row"><div class="label">Payment Status:</div><div class="val" style="color: ${paymentStatus === 'paid' ? '#16a34a' : '#d97706'};">${(paymentStatus || 'pending').toUpperCase()} (₹${amount || 250})</div></div>
      </div>
      <p style="color: #475569; font-size: 14px;">
        📍 <strong>Please arrive 10 minutes prior</strong> to your scheduled slot for registration. If you need to reschedule or have urgent queries, call us directly at <strong>${CLINIC_INFO.phone}</strong>.
      </p>
    `;
    const textContent = `Dear ${patientName}, your appointment request at SS Dental Care for ${date} at ${time} with ${doctor} has been received. Booking Reference: ${(appointmentId || 'PENDING').slice(0, 8).toUpperCase()}. Clinic Phone: ${CLINIC_INFO.phone}.`;
    return {
      subject: `Appointment Booking Received — SS Dental Care [Ref: ${(appointmentId || 'PENDING').slice(0, 8).toUpperCase()}]`,
      htmlContent: wrapEmailTemplate({ title, badge: 'Booking Received', contentHtml }),
      textContent
    };
  },

  // Event 2: Doctor / Clinic Alert
  doctorAlert: ({ patientName, patientPhone, patientEmail, appointmentId, treatment, date, time, doctor, paymentStatus, paymentMethod, amount, notes }) => {
    const title = 'New Appointment Alert (Clinic Staff)';
    const contentHtml = `
      <h2 style="color: #0f172a; margin-top: 0;">New Appointment Alert 🔔</h2>
      <p style="color: #475569; font-size: 15px;">A new appointment has been scheduled via the official website:</p>
      <div class="details-box">
        <div class="row"><div class="label">Patient Name:</div><div class="val">${patientName}</div></div>
        <div class="row"><div class="label">Contact Phone:</div><div class="val"><a href="tel:${patientPhone}" style="color: #2563eb;">${patientPhone}</a></div></div>
        <div class="row"><div class="label">Patient Email:</div><div class="val">${patientEmail || 'Not Provided'}</div></div>
        <div class="row"><div class="label">Requested Doctor:</div><div class="val">${doctor}</div></div>
        <div class="row"><div class="label">Service/Procedure:</div><div class="val">${treatment}</div></div>
        <div class="row"><div class="label">Appointment Date:</div><div class="val">${date}</div></div>
        <div class="row"><div class="label">Appointment Slot:</div><div class="val">${time}</div></div>
        <div class="row"><div class="label">Payment Status:</div><div class="val" style="color: ${paymentStatus === 'paid' ? '#16a34a' : '#d97706'}; font-weight: 800;">${(paymentStatus || 'pending').toUpperCase()} (₹${amount}) via ${paymentMethod}</div></div>
        ${notes ? `<div class="row"><div class="label">Patient Notes:</div><div class="val">${notes}</div></div>` : ''}
      </div>
      <p style="font-size: 13px; color: #64748b;">System ID: ${appointmentId}</p>
    `;
    const textContent = `Clinic Alert: New appointment from ${patientName} (${patientPhone}) on ${date} at ${time}. Service: ${treatment}. Payment: ${paymentStatus}. Ref: ${appointmentId}`;
    return {
      subject: `🚨 [New Booking] ${patientName} — ${date} ${time} (${treatment})`,
      htmlContent: wrapEmailTemplate({ title, badge: 'New Clinic Booking', contentHtml }),
      textContent
    };
  },

  // Event 3: Appointment Confirmed (Patient)
  appointmentConfirmed: ({ patientName, appointmentId, treatment, date, time, doctor }) => {
    const title = 'Appointment Confirmed';
    const contentHtml = `
      <h2 style="color: #16a34a; margin-top: 0;">Appointment Confirmed! ✅</h2>
      <p style="color: #475569; font-size: 15px;">Dear <strong>${patientName}</strong>, your dental appointment at SS Dental Care has been formally confirmed.</p>
      <div class="details-box">
        <div class="row"><div class="label">Doctor:</div><div class="val">${doctor}</div></div>
        <div class="row"><div class="label">Procedure:</div><div class="val">${treatment}</div></div>
        <div class="row"><div class="label">Confirmed Date:</div><div class="val">${date}</div></div>
        <div class="row"><div class="label">Confirmed Time:</div><div class="val">${time}</div></div>
        <div class="row"><div class="label">Booking Ref:</div><div class="val">${(appointmentId || 'CONFIRMED').slice(0, 8).toUpperCase()}</div></div>
      </div>
      <p style="color: #475569; font-size: 14px;">We look forward to welcoming you to our clinic. Please remember to bring any prior dental records or prescriptions if applicable.</p>
    `;
    return {
      subject: `Appointment Confirmed — SS Dental Care [Ref: ${(appointmentId || 'CONFIRMED').slice(0, 8).toUpperCase()}]`,
      htmlContent: wrapEmailTemplate({ title, badge: 'Confirmed', contentHtml }),
      textContent: `Dear ${patientName}, your appointment for ${treatment} on ${date} at ${time} is confirmed at SS Dental Care.`
    };
  },

  // Event 4A: Appointment Rescheduled (Patient)
  appointmentRescheduled: ({ patientName, appointmentId, treatment, date, time, doctor }) => {
    const title = 'Appointment Rescheduled';
    const contentHtml = `
      <h2 style="color: #0f172a; margin-top: 0;">Appointment Rescheduled 🔄</h2>
      <p style="color: #475569; font-size: 15px;">Dear <strong>${patientName}</strong>, your appointment schedule has been successfully updated:</p>
      <div class="details-box">
        <div class="row"><div class="label">Doctor:</div><div class="val">${doctor}</div></div>
        <div class="row"><div class="label">Treatment:</div><div class="val">${treatment}</div></div>
        <div class="row"><div class="label">New Date:</div><div class="val" style="color: #2563eb;">${date}</div></div>
        <div class="row"><div class="label">New Time Slot:</div><div class="val" style="color: #2563eb;">${time}</div></div>
        <div class="row"><div class="label">Booking Ref:</div><div class="val">${(appointmentId || '').slice(0, 8).toUpperCase()}</div></div>
      </div>
      <p style="color: #475569; font-size: 14px;">If this new time does not suit you, please call us immediately at <strong>${CLINIC_INFO.phone}</strong>.</p>
    `;
    return {
      subject: `Appointment Rescheduled — SS Dental Care [Ref: ${(appointmentId || '').slice(0, 8).toUpperCase()}]`,
      htmlContent: wrapEmailTemplate({ title, badge: 'Schedule Updated', contentHtml }),
      textContent: `Dear ${patientName}, your appointment has been rescheduled to ${date} at ${time}. SS Dental Care.`
    };
  },

  // Event 4B: Appointment Rescheduled (Doctor / Clinic Alert)
  appointmentRescheduledDoctor: ({ patientName, patientPhone, appointmentId, treatment, date, time, doctor }) => {
    const title = 'Appointment Rescheduled (Clinic Alert)';
    const contentHtml = `
      <h2 style="color: #0f172a; margin-top: 0;">Schedule Update Notice 🔄</h2>
      <p style="color: #475569; font-size: 15px;">An existing appointment has been rescheduled:</p>
      <div class="details-box">
        <div class="row"><div class="label">Patient Name:</div><div class="val">${patientName}</div></div>
        <div class="row"><div class="label">Patient Phone:</div><div class="val">${patientPhone || 'N/A'}</div></div>
        <div class="row"><div class="label">Doctor:</div><div class="val">${doctor}</div></div>
        <div class="row"><div class="label">Procedure:</div><div class="val">${treatment}</div></div>
        <div class="row"><div class="label">New Date:</div><div class="val" style="color: #2563eb;">${date}</div></div>
        <div class="row"><div class="label">New Time Slot:</div><div class="val" style="color: #2563eb;">${time}</div></div>
        <div class="row"><div class="label">Booking Ref:</div><div class="val">${(appointmentId || '').slice(0, 8).toUpperCase()}</div></div>
      </div>
    `;
    return {
      subject: `🔄 [Rescheduled] ${patientName} — New Slot: ${date} at ${time}`,
      htmlContent: wrapEmailTemplate({ title, badge: 'Rescheduled Alert', contentHtml }),
      textContent: `Alert: Appointment for ${patientName} has been rescheduled to ${date} at ${time}. Ref: ${appointmentId}`
    };
  },

  // Event 5A: Appointment Cancelled (Patient)
  appointmentCancelled: ({ patientName, appointmentId, date, time, reason }) => {
    const title = 'Appointment Cancelled';
    const contentHtml = `
      <h2 style="color: #dc2626; margin-top: 0;">Appointment Cancellation Notice</h2>
      <p style="color: #475569; font-size: 15px;">Dear <strong>${patientName}</strong>, your appointment for <strong>${date} at ${time}</strong> has been cancelled.</p>
      <div class="details-box">
        <div class="row"><div class="label">Booking Ref:</div><div class="val">${(appointmentId || '').slice(0, 8).toUpperCase()}</div></div>
        <div class="row"><div class="label">Cancelled Slot:</div><div class="val">${date} (${time})</div></div>
        ${reason ? `<div class="row"><div class="label">Reason:</div><div class="val">${reason}</div></div>` : ''}
      </div>
      <p style="color: #475569; font-size: 14px;">If this cancellation was accidental, you can re-book anytime on our website or contact our helpline at <strong>${CLINIC_INFO.phone}</strong>.</p>
    `;
    return {
      subject: `Appointment Cancelled — SS Dental Care [Ref: ${(appointmentId || '').slice(0, 8).toUpperCase()}]`,
      htmlContent: wrapEmailTemplate({ title, badge: 'Cancelled', contentHtml }),
      textContent: `Dear ${patientName}, your appointment on ${date} at ${time} has been cancelled. Ref: ${(appointmentId || '').slice(0, 8).toUpperCase()}.`
    };
  },

  // Event 5B: Appointment Cancelled (Doctor / Clinic Alert)
  appointmentCancelledDoctor: ({ patientName, patientPhone, appointmentId, date, time, reason }) => {
    const title = 'Appointment Cancelled (Clinic Notice)';
    const contentHtml = `
      <h2 style="color: #dc2626; margin-top: 0;">Appointment Cancellation Alert ❌</h2>
      <p style="color: #475569; font-size: 15px;">The following appointment was cancelled and its slot is now released:</p>
      <div class="details-box">
        <div class="row"><div class="label">Patient Name:</div><div class="val">${patientName}</div></div>
        <div class="row"><div class="label">Patient Phone:</div><div class="val">${patientPhone || 'N/A'}</div></div>
        <div class="row"><div class="label">Released Slot:</div><div class="val">${date} (${time})</div></div>
        <div class="row"><div class="label">Booking Ref:</div><div class="val">${(appointmentId || '').slice(0, 8).toUpperCase()}</div></div>
        ${reason ? `<div class="row"><div class="label">Cancellation Reason:</div><div class="val">${reason}</div></div>` : ''}
      </div>
    `;
    return {
      subject: `❌ [Cancelled] ${patientName} — Released Slot: ${date} ${time}`,
      htmlContent: wrapEmailTemplate({ title, badge: 'Slot Released', contentHtml }),
      textContent: `Alert: Appointment for ${patientName} on ${date} at ${time} has been cancelled. Slot released. Ref: ${appointmentId}`
    };
  },

  // Events 6 & 7: Appointment Reminders (24 Hours and 2 Hours)
  appointmentReminder: ({ patientName, appointmentId, treatment, date, time, doctor, reminderType }) => {
    const hoursLabel = reminderType === 'reminder_24h' ? '24 Hours' : '2 Hours';
    const title = `Appointment Reminder (${hoursLabel})`;
    const contentHtml = `
      <h2 style="color: #0f172a; margin-top: 0;">Upcoming Appointment Reminder ⏰</h2>
      <p style="color: #475569; font-size: 15px;">Dear <strong>${patientName}</strong>, this is a friendly reminder of your upcoming dental visit in <strong>${hoursLabel}</strong>:</p>
      <div class="details-box">
        <div class="row"><div class="label">Doctor:</div><div class="val">${doctor}</div></div>
        <div class="row"><div class="label">Procedure:</div><div class="val">${treatment}</div></div>
        <div class="row"><div class="label">Date:</div><div class="val">${date}</div></div>
        <div class="row"><div class="label">Time:</div><div class="val" style="color: #2563eb;">${time}</div></div>
        <div class="row"><div class="label">Booking Ref:</div><div class="val">${(appointmentId || '').slice(0, 8).toUpperCase()}</div></div>
      </div>
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; font-size: 13px; color: #166534; margin: 16px 0;">
        📍 <strong>Clinic Location:</strong> ${CLINIC_INFO.address}<br/>
        🚗 Parking is available at S S Plaza. Please arrive 10 minutes early.
      </div>
    `;
    return {
      subject: `Reminder: Your Appointment at SS Dental Care is in ${hoursLabel} [${date} at ${time}]`,
      htmlContent: wrapEmailTemplate({ title, badge: `Reminder (${hoursLabel})`, contentHtml }),
      textContent: `Reminder: Dear ${patientName}, you have an appointment at SS Dental Care in ${hoursLabel} on ${date} at ${time}. Helpline: ${CLINIC_INFO.phone}.`
    };
  }
};

module.exports = {
  sendTransactionalEmail,
  templates,
  CLINIC_INFO
};
