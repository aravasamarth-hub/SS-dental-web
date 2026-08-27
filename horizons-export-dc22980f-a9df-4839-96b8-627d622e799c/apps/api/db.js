const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://gthczioqtznvfxhqvslm.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY || 'sb_publishable_SgwUX2SPWcxT4RfLQoHeSg_7q2Nnkxj';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client — used for anon INSERT (booking / payment forms)
const supabase = createClient(supabaseUrl, supabaseKey);

// Admin / service-role client — used for backend-only SELECT operations:
//   health check, idempotency guard, queue drain reads.
// RLS SELECT on appointments & paid_bookings is restricted to service_role;
// using the anon key for these reads would return permission errors.
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    })
  : supabase; // graceful fallback if key not set (dev/test without service key)

// ---------------------------------------------------------------------------
// Network & HTTP Resilience Utility (Resilience hardening for Supabase PostgREST)
// Note: Since this project connects to Supabase via PostgREST over HTTPS (port 443)
// rather than a direct TCP connection to the pgBouncer pooler (port 6543), this helper
// handles transient HTTP/fetch drops (ECONNRESET, undici socket drops, 503/520)
// on idempotent queries and background queue tasks.
// ---------------------------------------------------------------------------
function isPoolerOrNetworkError(err) {
  if (!err) return false;

  // Extract direct and nested cause properties (standard in Node 18+ undici fetch)
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
      // If result contains a Supabase error object, inspect it for network/pooler errors
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
let isDbHealthy = true;
let lastDbError = null;
let isProcessingDbQueue = false;

// 1. Load DB Queue
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

// 2. Save to DB Queue
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

// Helper for Idempotency: Check if record already landed in Postgres before retrying.
// Uses the service-role client — anon SELECT is locked to service_role only.
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
    if (data && data.length > 0) {
      return true;
    }
  } catch (ex) {
    console.warn('Idempotency check exception:', ex.message);
  }
  return false;
}

// 3. Process DB Queue (Self-Healing Loop with Idempotency Guard)
async function processDbQueue() {
  if (isProcessingDbQueue) return;
  const queue = getDbQueue();
  if (queue.length === 0) return;

  isProcessingDbQueue = true;
  console.log(`🔄 [DB Self-Healing Queue] Processing ${queue.length} pending database inserts...`);
  const remainingQueue = [];

  for (const item of queue) {
    try {
      // Idempotency check: verify strictly by idempotency_key if present
      const alreadyExists = await checkRecordAlreadyExists(item.table, item.record);
      if (alreadyExists) {
        console.log(`ℹ️ [DB Queue Idempotency] Record with idempotency_key '${item.record.idempotency_key}' already exists in ${item.table}. Skipping duplicate write.`);
        continue;
      }

      const { data, error } = await withDbRetry(() =>
        supabase.from(item.table).insert([item.record]).select('id')
      );
      if (error) {
        // If the error is a Postgres unique constraint violation on idempotency_key, treat as already succeeded!
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

// 4. DB Connection Health Check
// Uses the service-role client so the SELECT isn't blocked by the anon RLS policy.
async function checkDbHealth() {
  try {
    const { data, error } = await withDbRetry(() =>
      supabaseAdmin
        .from('paid_bookings')
        .select('id')
        .limit(1)
    );

    if (error) {
      isDbHealthy = false;
      lastDbError = error.message;
      console.warn('⚠️ Supabase connection test warning:', error.message);
    } else {
      if (!isDbHealthy) {
        console.log('✅ Supabase database connection restored!');
      }
      isDbHealthy = true;
      lastDbError = null;
      // Auto-trigger queue drain when DB is healthy
      processDbQueue();
    }
  } catch (err) {
    isDbHealthy = false;
    lastDbError = err.message;
    console.warn('⚠️ Supabase connection exception:', err.message);
  }
  return { healthy: isDbHealthy, lastError: lastDbError };
}

// Initial health check & start 15s health & queue polling loop
checkDbHealth();
const healthTimer = setInterval(checkDbHealth, 15000);
if (healthTimer && typeof healthTimer.unref === 'function') {
  healthTimer.unref();
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



