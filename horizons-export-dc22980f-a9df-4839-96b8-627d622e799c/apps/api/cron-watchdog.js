/**
 * SS Dental Care — Production Reminder Watchdog
 * Invoked by Hostinger Scheduled Cron every 30 minutes.
 * Makes an authenticated POST request to the production reminders endpoint.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function runWatchdog() {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error(`[${new Date().toISOString()}] 🚨 [Watchdog Error]: CRON_SECRET is not configured in environment.`);
    process.exitCode = 1;
    return;
  }

  const endpoint = (process.env.PUBLIC_WEBSITE_URL || 'https://www.ssdentalcare.in').replace(/\/$/, '') + '/api/cron/reminders';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'User-Agent': 'SS-Dental-Watchdog-Cron/1.0'
      }
    });

    const status = response.status;
    const body = await response.json().catch(() => null);

    if (response.ok) {
      console.log(`[${new Date().toISOString()}] ✅ [Watchdog Success]: HTTP ${status}`, JSON.stringify(body));
      process.exitCode = 0;
    } else {
      console.error(`[${new Date().toISOString()}] ❌ [Watchdog Failed]: HTTP ${status}`, JSON.stringify(body));
      process.exitCode = 1;
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] 🚨 [Watchdog Exception]:`, err.message);
    process.exitCode = 1;
  }
}

runWatchdog();
