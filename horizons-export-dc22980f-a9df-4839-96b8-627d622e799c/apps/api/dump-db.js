const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function backup() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connecting to live Supabase database for backup...');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.resolve(__dirname, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const backupFile = path.join(backupDir, `ss_dental_backup_${timestamp}.sql`);

    let dumpOutput = `-- =========================================================================\n` +
      `-- SS DENTAL CARE (PROD) DATABASE BACKUP\n` +
      `-- Exported At: ${new Date().toISOString()}\n` +
      `-- Project Ref: zuhwtdslylbzfzyhiywa (South Asia - Mumbai)\n` +
      `-- =========================================================================\n\n`;

    // 1. Export tables data as SQL inserts
    const tables = ['appointments', 'notification_outbox', 'notification_events'];
    for (const table of tables) {
      const res = await client.query(`SELECT * FROM public.${table};`);
      dumpOutput += `-- Table: ${table} (${res.rows.length} rows)\n`;
      if (res.rows.length > 0) {
        for (const row of res.rows) {
          const cols = Object.keys(row).join(', ');
          const vals = Object.values(row).map(v => {
            if (v === null) return 'NULL';
            if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
            if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
            if (v instanceof Date) return `'${v.toISOString()}'::timestamptz`;
            return v;
          }).join(', ');
          dumpOutput += `INSERT INTO public.${table} (${cols}) VALUES (${vals}) ON CONFLICT DO NOTHING;\n`;
        }
      }
      dumpOutput += `\n`;
    }

    fs.writeFileSync(backupFile, dumpOutput, 'utf8');
    console.log(`✅ Backup successfully saved to ${backupFile}`);
    console.log(`✅ File size: ${fs.statSync(backupFile).size} bytes`);
  } catch (err) {
    console.error('❌ Backup failed:', err);
  } finally {
    await client.end();
  }
}

backup();

