const fs = require('fs');
const path = require('path');
const supabase = require('./db');
const { notifyNewBooking } = require('./notifications');

const WATCHER_IDS_FILE = path.join(__dirname, 'processed_watcher_ids.json');

const processedAppointments = new Set();
const processedPaidBookings = new Set();
let isInitialRun = true;

// Load persisted processed IDs on startup
function loadPersistedIds() {
  try {
    if (fs.existsSync(WATCHER_IDS_FILE)) {
      const data = JSON.parse(fs.readFileSync(WATCHER_IDS_FILE, 'utf8') || '{}');
      if (Array.isArray(data.appointments)) {
        data.appointments.forEach(id => processedAppointments.add(id));
      }
      if (Array.isArray(data.paid_bookings)) {
        data.paid_bookings.forEach(id => processedPaidBookings.add(id));
      }
      console.log(`📋 [Watcher State] Loaded ${processedAppointments.size} processed appointment IDs & ${processedPaidBookings.size} processed paid booking IDs.`);
    }
  } catch (err) {
    console.warn('⚠️ Could not read watcher state file:', err.message);
  }
}

// Save processed IDs to disk
function savePersistedIds() {
  try {
    const data = {
      appointments: Array.from(processedAppointments).slice(-1000), // keep last 1000
      paid_bookings: Array.from(processedPaidBookings).slice(-1000)
    };
    fs.writeFileSync(WATCHER_IDS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('⚠️ Could not save watcher state file:', err.message);
  }
}

loadPersistedIds();

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
          savePersistedIds();

          if (!isInitialRun) {
            console.log(`📧 [Auto-Watcher] Processing NEW appointment record for ${item.full_name || 'Patient'} (ID: ${item.id}). Dispatching email...`);
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
            }).catch(err => console.error('Watcher email error:', err.message));
          }
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
          savePersistedIds();

          if (!isInitialRun) {
            console.log(`📧 [Auto-Watcher] Processing NEW paid booking record for ${item.full_name || 'Patient'} (ID: ${item.id}). Dispatching email...`);
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
            }).catch(err => console.error('Watcher email error:', err.message));
          }
        }
      }
    }

    if (isInitialRun) {
      isInitialRun = false;
      console.log(`✅ [Auto-Watcher] Initial sync complete. Historical emails suppressed. Active monitoring on new Supabase table entries...`);
    }

  } catch (err) {
    console.warn('Notice in auto-watcher cycle:', err.message);
  }
}

function markAsProcessed(table, id) {
  if (!id) return;
  if (table === 'appointments') processedAppointments.add(id);
  if (table === 'paid_bookings') processedPaidBookings.add(id);
  savePersistedIds();
}

function startWatcher(intervalMs = 10000) {
  checkNewSubmissions();
  setInterval(checkNewSubmissions, intervalMs);
}

module.exports = { startWatcher, markAsProcessed };


