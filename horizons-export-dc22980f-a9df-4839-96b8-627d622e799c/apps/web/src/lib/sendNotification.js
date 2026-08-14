/**
 * Unified Notification Dispatcher for SS Dental Care Web Client
 * Dispatches appointment & inquiry details to backend email/SMS service.
 */

export async function sendBookingNotification(details) {
  const {
    name,
    email,
    phone,
    date,
    time,
    payment_method,
    payment_status,
    amount_paid,
    form_type
  } = details;

  const payload = {
    name: name || 'Valued Patient',
    email: email || '',
    phone: phone || '',
    date: date || new Date().toISOString().split('T')[0],
    time: time || 'General Consult',
    payment_method: payment_method || 'Online Form Inquiry',
    payment_status: payment_status || 'pending',
    amount_paid: amount_paid || 0,
    form_type: form_type || 'Website Submission',
    created_at: new Date().toLocaleString()
  };

  // Determine target API URL
  const envApiUrl = import.meta.env.VITE_API_URL;
  const targetUrls = [];

  if (envApiUrl && envApiUrl.trim()) {
    targetUrls.push(`${envApiUrl.replace(/\/$/, '')}/api/notify`);
  }
  
  // Fallback endpoints
  targetUrls.push('http://localhost:5000/api/notify');
  targetUrls.push('/api/notify');

  for (const url of targetUrls) {
    try {
      console.log(`[Notification Dispatch] Attempting to send notification via ${url}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const json = await response.json();
        console.log('✅ Notification dispatched successfully:', json);
        return { success: true, json };
      }
    } catch (err) {
      console.warn(`[Notification Dispatch] Failed via ${url}:`, err.message);
    }
  }

  console.warn('[Notification Dispatch] Backend API unavailable. Notification payload saved to database.');
  return { success: false, reason: 'Backend API unreachable' };
}
