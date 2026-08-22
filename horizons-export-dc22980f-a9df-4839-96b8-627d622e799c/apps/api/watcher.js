const supabase = require('./db');
const { notifyNewBooking } = require('./notifications');

const processedAppointments = new Set();
const processedPaidBookings = new Set();
let isInitialRun = true;

async function checkNewSubmissions() {
  try {
    // 1. Check `public.appointments`
    const { data: appointments, error: apptErr } = await supabase
      .from('appointments')
      .select('*')
      .order('id', { ascending: false })
      .limit(50);

    if (apptErr) {
      console.warn('⚠️ [Auto-Watcher] Supabase appointments check notice:', apptErr.message);
    } else if (appointments && appointments.length > 0) {
      for (const item of appointments) {
        if (!processedAppointments.has(item.id)) {
          processedAppointments.add(item.id);
          
          console.log(`📧 [Auto-Watcher] Processing appointment record for ${item.full_name || 'Patient'} (ID: ${item.id}). Dispatching email...`);
          await notifyNewBooking({
            name: item.full_name,
            email: item.email || '',
            phone: item.phone,
            date: item.appointment_date,
            time: item.appointment_time,
            payment_method: 'General Inquiry / Form',
            payment_status: 'pending',
            amount_paid: 0.00,
            created_at: item.created_at
          }).catch(err => console.error('Watcher email error:', err));
        }
      }
    }

    // 2. Check `public.paid_bookings`
    const { data: paidBookings, error: paidErr } = await supabase
      .from('paid_bookings')
      .select('*')
      .order('id', { ascending: false })
      .limit(50);

    if (paidErr) {
      console.warn('⚠️ [Auto-Watcher] Supabase paid_bookings check notice:', paidErr.message);
    } else if (paidBookings && paidBookings.length > 0) {
      for (const item of paidBookings) {
        if (!processedPaidBookings.has(item.id)) {
          processedPaidBookings.add(item.id);
          
          console.log(`📧 [Auto-Watcher] Processing paid booking record for ${item.full_name || 'Patient'} (ID: ${item.id}). Dispatching email...`);
          await notifyNewBooking({
            name: item.full_name,
            email: item.email || '',
            phone: item.phone,
            date: item.appointment_date,
            time: item.appointment_time,
            payment_method: item.payment_method || 'Razorpay',
            payment_status: item.payment_status || 'paid',
            amount_paid: item.amount_paid || 250.00,
            created_at: item.created_at
          }).catch(err => console.error('Watcher email error:', err));
        }
      }
    }

    if (isInitialRun) {
      isInitialRun = false;
      console.log(`✅ [Auto-Watcher] Initial sync complete. Active monitoring on Supabase tables...`);
    }

  } catch (err) {
    console.warn('Notice in auto-watcher cycle:', err.message);
  }
}

function markAsProcessed(table, id) {
  if (!id) return;
  if (table === 'appointments') processedAppointments.add(id);
  if (table === 'paid_bookings') processedPaidBookings.add(id);
}

function startWatcher(intervalMs = 10000) {
  // Run first check immediately
  checkNewSubmissions();
  // Poll every 10 seconds
  setInterval(checkNewSubmissions, intervalMs);
}

module.exports = { startWatcher, markAsProcessed };

