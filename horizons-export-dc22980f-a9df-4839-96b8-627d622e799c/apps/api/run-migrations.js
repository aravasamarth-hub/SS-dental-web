const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  console.log('Connecting to Supabase PostgreSQL at aws-0-ap-south-1.pooler.supabase.com...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully to Supabase PostgreSQL database!');

    // Read Migration 1
    const m1Path = path.resolve(__dirname, '../../supabase/migrations/01_create_core_tables.sql');
    const m1Sql = fs.readFileSync(m1Path, 'utf8');
    console.log('Applying Migration 01: Core tables, indexes, RLS, functions...');
    await client.query(m1Sql);
    console.log('✅ Migration 01 applied successfully!');

    // Read Migration 2
    const m2Path = path.resolve(__dirname, '../../supabase/migrations/02_safe_data_migration_from_legacy.sql');
    const m2Sql = fs.readFileSync(m2Path, 'utf8');
    console.log('Applying Migration 02: Safe legacy data migration & views...');
    await client.query(m2Sql);
    console.log('✅ Migration 02 applied successfully!');

    // Verify tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('\n📊 Tables in public schema:');
    res.rows.forEach(r => console.log('  - ' + r.table_name));

    // Verify RLS
    const rlsRes = await client.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace 
      WHERE nspname = 'public' AND relkind = 'r';
    `);
    console.log('\n🔒 RLS Status:');
    rlsRes.rows.forEach(r => console.log(`  - ${r.relname}: RLS ${r.relrowsecurity ? 'ENABLED' : 'DISABLED'}`));

    // Verify functions
    const fnRes = await client.query(`
      SELECT proname 
      FROM pg_proc 
      JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace 
      WHERE nspname = 'public';
    `);
    console.log('\n⚡ Functions in public schema:');
    fnRes.rows.forEach(r => console.log('  - ' + r.proname));

  } catch (err) {
    console.error('❌ Migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
