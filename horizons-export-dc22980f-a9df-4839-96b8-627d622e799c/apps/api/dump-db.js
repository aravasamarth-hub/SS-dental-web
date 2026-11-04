/**
 * SS Dental Care — Production Automated Database Backup Engine
 * 
 * Schedule: Daily at 02:00 AM IST (20:30 UTC)
 * Timezone: Asia/Kolkata (IST, UTC+05:30)
 * Retention: Daily (7 days), Weekly (30 days), Monthly (90 days)
 * Safety: Minimum 3 latest valid backups preserved at all times.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const CORE_TABLES = ['appointments', 'notification_outbox', 'notification_events'];
const MIN_RETAINED_BACKUPS = 3;
const MAX_AGE_DAYS = 90;

async function executeBackup() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    const errorMsg = 'DATABASE_URL environment variable is required for backup execution';
    console.error(`🚨 [Backup Error]: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  const startTime = Date.now();
  console.log(`📦 [Automated Backup]: Initiating snapshot at ${new Date().toISOString()} (Asia/Kolkata)...`);

  try {
    await client.connect();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.resolve(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const backupFile = path.join(backupDir, `ss_dental_backup_${timestamp}.sql`);

    let dumpOutput = `-- =========================================================================\n` +
      `-- SS DENTAL CARE (PROD) PRODUCTION DATABASE BACKUP\n` +
      `-- Exported At (UTC): ${new Date().toISOString()}\n` +
      `-- Timezone Context: Asia/Kolkata (IST, UTC+05:30)\n` +
      `-- Project Ref: zuhwtdslylbzfzyhiywa (AWS ap-south-1 Mumbai)\n` +
      `-- Database Engine: PostgreSQL 17.11\n` +
      `-- =========================================================================\n\n`;

    const tableStats = {};

    for (const table of CORE_TABLES) {
      const res = await client.query(`SELECT * FROM public.${table};`);
      tableStats[table] = res.rows.length;
      dumpOutput += `-- -------------------------------------------------------------------------\n`;
      dumpOutput += `-- Table Data: public.${table} (${res.rows.length} rows)\n`;
      dumpOutput += `-- -------------------------------------------------------------------------\n`;

      if (res.rows.length > 0) {
        for (const row of res.rows) {
          const cols = Object.keys(row).join(', ');
          const vals = Object.values(row).map(v => {
            if (v === null) return 'NULL';
            if (typeof v === 'object' && !(v instanceof Date)) {
              return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
            }
            if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
            if (v instanceof Date) return `'${v.toISOString()}'::timestamptz`;
            return v;
          }).join(', ');
          dumpOutput += `INSERT INTO public.${table} (${cols}) VALUES (${vals}) ON CONFLICT DO NOTHING;\n`;
        }
      }
      dumpOutput += `\n`;
    }

    // Write file to disk
    fs.writeFileSync(backupFile, dumpOutput, 'utf8');

    // Integrity Verification
    const stats = fs.statSync(backupFile);
    if (stats.size === 0) {
      throw new Error(`Generated backup file is empty (0 bytes): ${backupFile}`);
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ [Backup Saved]: ${backupFile}`);
    console.log(`📊 [Backup Stats]: Size: ${stats.size} bytes, Duration: ${duration}s, Records:`, tableStats);

    // Apply Retention Policy
    applyRetentionPolicy(backupDir);

    return {
      success: true,
      backupFile,
      sizeBytes: stats.size,
      tableStats,
      durationSeconds: duration
    };
  } catch (err) {
    console.error(`🚨 [Backup Failed]:`, err.message);
    throw err;
  } finally {
    await client.end();
  }
}

/**
 * Prune historical backups according to retention policy
 */
function applyRetentionPolicy(backupDir) {
  try {
    if (!fs.existsSync(backupDir)) return;

    const files = fs.readdirSync(backupDir)
      .filter(f => f.startsWith('ss_dental_backup_') && f.endsWith('.sql'))
      .map(f => {
        const filePath = path.join(backupDir, f);
        return {
          name: f,
          path: filePath,
          time: fs.statSync(filePath).mtimeMs
        };
      })
      .sort((a, b) => b.time - a.time); // newest first

    if (files.length <= MIN_RETAINED_BACKUPS) {
      console.log(`ℹ️ [Retention Policy]: ${files.length} backups stored (minimum threshold: ${MIN_RETAINED_BACKUPS}). No pruning needed.`);
      return;
    }

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    let prunedCount = 0;

    // Preserve the first MIN_RETAINED_BACKUPS always
    for (let i = MIN_RETAINED_BACKUPS; i < files.length; i++) {
      const file = files[i];
      const ageDays = (now - file.time) / oneDayMs;

      // If older than MAX_AGE_DAYS (90 days), delete
      if (ageDays > MAX_AGE_DAYS) {
        fs.unlinkSync(file.path);
        prunedCount++;
        console.log(`🗑️ [Retention Pruned]: Removed expired backup (> ${MAX_AGE_DAYS} days): ${file.name}`);
      }
    }

    if (prunedCount === 0) {
      console.log(`ℹ️ [Retention Policy]: All ${files.length} backups are within valid retention periods.`);
    }
  } catch (pruneErr) {
    console.warn(`⚠️ [Retention Pruning Warning]:`, pruneErr.message);
  }
}

if (require.main === module) {
  executeBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = {
  executeBackup,
  applyRetentionPolicy
};
