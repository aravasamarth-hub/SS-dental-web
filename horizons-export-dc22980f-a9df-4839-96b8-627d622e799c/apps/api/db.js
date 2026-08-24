const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://gthczioqtznvfxhqvslm.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY || 'sb_publishable_SgwUX2SPWcxT4RfLQoHeSg_7q2Nnkxj';

const supabase = createClient(supabaseUrl, supabaseKey);

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

// 3. Process DB Queue (Self-Healing Loop)
async function processDbQueue() {
  if (isProcessingDbQueue) return;
  const queue = getDbQueue();
  if (queue.length === 0) return;

  isProcessingDbQueue = true;
  console.log(`🔄 [DB Self-Healing Queue] Processing ${queue.length} pending database inserts...`);
  const remainingQueue = [];

  for (const item of queue) {
    try {
      const { data, error } = await supabase.from(item.table).insert([item.record]).select('id');
      if (error) {
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
async function checkDbHealth() {
  try {
    const { data, error } = await supabase
      .from('paid_bookings')
      .select('id')
      .limit(1);

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
setInterval(checkDbHealth, 15000);

module.exports = supabase;
module.exports.checkDbHealth = checkDbHealth;
module.exports.getDbHealthStatus = () => ({ healthy: isDbHealthy, lastError: lastDbError, pendingQueueCount: getDbQueue().length });
module.exports.saveToDbQueue = saveToDbQueue;
module.exports.getDbQueue = getDbQueue;
module.exports.processDbQueue = processDbQueue;

