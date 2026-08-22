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
      .limit(20);

    if (apptErr) {
      console.warn('⚠️ [Auto-Watcher] Supabase appointments check notice:', apptErr.message);
    } else if (appointments) {
      for (const item of appointments) {
        if (!processedAppointments.has(item.id)) {
          processedAppointments.add(item.id);
          
          // Skip emailing existing historical records on initial startup
          if (!isInitialRun) {
            console.log(`[Auto-Watcher] New appointment detected from Supabase (ID: ${item.id}). Dispatching email...`);
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
    }

    // 2. Check `public.paid_bookings`
    const { data: paidBookings, error: paidErr } = await supabase
      .from('paid_bookings')
      .select('*')
      .order('id', { ascending: false })
      .limit(20);

    if (paidErr) {
      console.warn('⚠️ [Auto-Watcher] Supabase paid_bookings check notice:', paidErr.message);
    } else if (paidBookings) {
      for (const item of paidBookings) {
        if (!processedPaidBookings.has(item.id)) {
          processedPaidBookings.add(item.id);
          
          // Skip emailing existing historical records on initial startup
          if (!isInitialRun) {
            console.log(`[Auto-Watcher] New paid booking detected from Supabase (ID: ${item.id}). Dispatching email...`);
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
    }

    if (isInitialRun) {
      isInitialRun = false;
      console.log(`[Auto-Watcher] Initialized sync. Monitoring for new phone/email submissions...`);
    }

  } catch (err) {
    console.warn('Notice in auto-watcher cycle (handing gracefully):', err.message);
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

