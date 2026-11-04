const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://dryhmzalotgxdqihnrln.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_API_KEY || 'sb_publishable_placeholder';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client — used for client anon inserts
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

// Admin / service-role client — used for trusted backend operations
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : supabase;

// ---------------------------------------------------------------------------
// Network & HTTP Resilience Utility (Resilience hardening for Supabase PostgREST)
// ---------------------------------------------------------------------------
function isPoolerOrNetworkError(err) {
  if (!err) return false;

  const cause = err.cause || {};
  const code = ((err.code || cause.code || '') + '').toLowerCase();
  const name = ((err.name || cause.name || '') + '').toLowerCase();
  const msg = ((err.message || '') + ' ' + (cause.message || '')).toLowerCase();

  const networkCodes = [
    'econnreset',
    'etimedout',
    'econnrefused',
    'enotfound',
    'und_err_socket',
    'und_err_connect_timeout',
    'und_err_headers_timeout',
    'und_err_body_timeout',
    'und_err_info',
    '08006', // pg connection failure
    '57p01'  // admin shutdown
  ];

  if (networkCodes.some(c => code.includes(c))) {
    return true;
  }

  return (
    name.includes('socketerror') ||
    name.includes('fetcherror') ||
    msg.includes('fetch failed') ||
    msg.includes('other side closed') ||
    msg.includes('socket hang up') ||
    msg.includes('connection reset') ||
    msg.includes('server closed the connection') ||
    msg.includes('terminating connection') ||
    msg.includes('pgbouncer') ||
    msg.includes('503 service unavailable') ||
    msg.includes('520 web server') ||
    msg.includes('504 gateway') ||
    msg.includes('econnreset')
  );
}

async function withDbRetry(operation, maxRetries = 2, baseDelayMs = 200) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();
      if (result && result.error && isPoolerOrNetworkError(result.error)) {
        throw result.error;
      }
      return result;
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries && isPoolerOrNetworkError(err)) {
        const delay = Math.min(baseDelayMs * Math.pow(2, attempt) + Math.floor(Math.random() * 50), 3000);
        console.warn(`⚠️ [DB Network Retry] Transient connection drop on attempt ${attempt + 1}/${maxRetries + 1}. Retrying in ${delay}ms... Details: ${err.message || err}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

const DB_QUEUE_FILE = path.join(__dirname, 'db_queue.json');
let isDbHealthy = false;
let lastDbError = null;
let isProcessingDbQueue = false;

function getDbQueue() {
  try {
    if (fs.existsSync(DB_QUEUE_FILE)) {
      const data = fs.readFileSync(DB_QUEUE_FILE, 'utf8');
      return JSON.parse(data || '[]');
    }
  } catch (err) {
    console.error('⚠️ Could not read DB queue file:', err.message);
  }
  return [];
}

function saveToDbQueue(table, record) {
  try {
    const queue = getDbQueue();
    const newItem = {
      id: `db_queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      table,
      record,
      attempts: 0,
      created_at: new Date().toISOString()
    };
    queue.push(newItem);
    fs.writeFileSync(DB_QUEUE_FILE, JSON.stringify(queue, null, 2), 'utf8');
    console.log(`📦 [DB Self-Healing Queue] Saved pending ${table} insert to local disk queue. Queue size: ${queue.length}`);
    return newItem;
  } catch (err) {
    console.error('❌ Failed to write to DB queue file:', err.message);
  }
}

async function checkRecordAlreadyExists(table, record) {
  if (!record || !record.idempotency_key) return false;
  try {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select('id')
      .eq('idempotency_key', record.idempotency_key)
      .limit(1);

    if (error) {
      console.warn(`⚠️ [Idempotency Check Warning] ${table}:`, error.message);
      return false;
    }
    return Boolean(data && data.length > 0);
  } catch (ex) {
    console.warn('Idempotency check exception:', ex.message);
    return false;
  }
}

/**
 * Check if an appointment slot is already taken for a given doctor, date, and time
 */
async function isSlotBooked(doctorName, date, time) {
  if (!date || !time) return false;
  try {
    const query = supabaseAdmin
      .from('appointments')
      .select('id')
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .not('appointment_status', 'in', '("cancelled")');

    if (doctorName) {
      query.eq('doctor_name', doctorName);
    }

    const { data, error } = await withDbRetry(() => query.limit(1));
    if (error) {
      console.warn('⚠️ [Slot Collision Check Warning]:', error.message);
      return false;
    }
    return Boolean(data && data.length > 0);
  } catch (err) {
    console.warn('⚠️ [Slot Collision Check Exception]:', err.message);
    return false;
  }
}

async function processDbQueue() {
  if (isProcessingDbQueue) return;
  const queue = getDbQueue();
  if (queue.length === 0) return;

  isProcessingDbQueue = true;
  console.log(`🔄 [DB Self-Healing Queue] Processing ${queue.length} pending database inserts...`);
  const remainingQueue = [];

  for (const item of queue) {
    try {
      const alreadyExists = await checkRecordAlreadyExists(item.table, item.record);
      if (alreadyExists) {
        console.log(`ℹ️ [DB Queue Idempotency] Record with idempotency_key '${item.record.idempotency_key}' already exists in ${item.table}. Skipping duplicate write.`);
        continue;
      }

      const { data, error } = await withDbRetry(() =>
        supabaseAdmin.from(item.table).insert([item.record]).select('id')
      );
      if (error) {
        if (error.code === '23505' || (error.message && error.message.includes('idempotency_key'))) {
          console.log(`ℹ️ [DB Queue Idempotency] Postgres unique constraint caught for '${item.record.idempotency_key}' in ${item.table}. Duplicate prevented.`);
          continue;
        }
        console.warn(`⚠️ [DB Queue Retry] Failed inserting item ${item.id} into ${item.table}:`, error.message);
        item.attempts = (item.attempts || 0) + 1;
        if (item.attempts < 10) {
          remainingQueue.push(item);
        } else {
          console.error(`❌ [DB Queue Max Retries] Dropping item ${item.id} after 10 attempts.`);
        }
      } else {
        console.log(`✅ [DB Queue Restored] Successfully inserted item ${item.id} into ${item.table}:`, data);
      }
    } catch (err) {
      console.warn(`⚠️ [DB Queue Exception] ${item.id}:`, err.message);
      item.attempts = (item.attempts || 0) + 1;
      if (item.attempts < 10) {
        remainingQueue.push(item);
      }
    }
  }

  try {
    fs.writeFileSync(DB_QUEUE_FILE, JSON.stringify(remainingQueue, null, 2), 'utf8');
  } catch (err) {
    console.error('❌ Error updating DB queue file:', err.message);
  }
  isProcessingDbQueue = false;
}

async function checkDbHealth() {
  if (process.env.NODE_ENV === 'test') {
    return { healthy: isDbHealthy, lastError: lastDbError };
  }
  try {
    const { error } = await withDbRetry(() =>
      supabaseAdmin
        .from('appointments')
        .select('id')
        .limit(1)
    );

    if (error) {
      isDbHealthy = false;
      lastDbError = error.message;
    } else {
      if (!isDbHealthy) {
        console.log('✅ Supabase database connection verified successfully!');
      }
      isDbHealthy = true;
      lastDbError = null;
      processDbQueue();
    }
  } catch (err) {
    isDbHealthy = false;
    lastDbError = err.message;
  }
  return { healthy: isDbHealthy, lastError: lastDbError };
}

// Start health polling only in non-test mode
if (process.env.NODE_ENV !== 'test') {
  checkDbHealth();
  const healthTimer = setInterval(checkDbHealth, 30000);
  if (healthTimer && typeof healthTimer.unref === 'function') {
    healthTimer.unref();
  }
}

module.exports = supabaseAdmin;
module.exports.supabase = supabaseAdmin;
module.exports.supabaseAdmin = supabaseAdmin;
module.exports.supabaseAnon = supabase;
module.exports.checkDbHealth = checkDbHealth;
module.exports.getDbHealthStatus = () => ({ healthy: isDbHealthy, lastError: lastDbError, pendingQueueCount: getDbQueue().length });
module.exports.saveToDbQueue = saveToDbQueue;
module.exports.getDbQueue = getDbQueue;
module.exports.processDbQueue = processDbQueue;
module.exports.withDbRetry = withDbRetry;
module.exports.isPoolerOrNetworkError = isPoolerOrNetworkError;
module.exports.checkRecordAlreadyExists = checkRecordAlreadyExists;
module.exports.isSlotBooked = isSlotBooked;
