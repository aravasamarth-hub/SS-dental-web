const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const db = require('../db');

const URL = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.trim() : '';
const ANON = process.env.SUPABASE_API_KEY ? process.env.SUPABASE_API_KEY.trim() : '';
const SRK = process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.trim() : '';

const anonClient = createClient(URL, ANON);
const adminClient = db; // uses supabaseAdmin from db.js

async function runAudit() {
  let pass = 0, fail = 0;

  console.log('====================================================');
  console.log('LIVE AUDIT VERIFICATION REPORT (Supabase: gthczioqtznvfxhqvslm)');
  console.log('====================================================');

  // CHECK 1: idempotency_key columns exist in Postgres
  const { error: ae } = await anonClient.from('appointments').select('id,idempotency_key').limit(0);
  const { error: pe } = await anonClient.from('paid_bookings').select('id,idempotency_key').limit(0);
  const c1 = !ae && !pe;
  console.log('\n[Check 1] Column idempotency_key existence in DB:');
  console.log('  appointments.idempotency_key:', !ae ? 'EXISTS (SUCCESS)' : 'ERROR: ' + ae.message);
  console.log('  paid_bookings.idempotency_key:', !pe ? 'EXISTS (SUCCESS)' : 'ERROR: ' + pe.message);
  c1 ? pass++ : fail++;

  // CHECK 2: Anonymous Public INSERT without returning (patient submitting appointment)
  const testKey = 'final_probe_' + Date.now();
  const resIns = await anonClient.from('paid_bookings').insert([{
    full_name: 'Verification Patient',
    phone: '9876543210',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    amount_paid: 250.00,
    idempotency_key: testKey
  }]);
  const c2 = resIns.status === 201 || !resIns.error;
  console.log('\n[Check 2] Anonymous Public INSERT (Booking/Payment Form):');
  console.log('  status code:', resIns.status, '| error:', resIns.error ? resIns.error.message : 'none');
  console.log('  result:', c2 ? 'ALLOWED (SUCCESS)' : 'BLOCKED');
  c2 ? pass++ : fail++;

  // CHECK 3: Anonymous Public SELECT restriction (Patient PII Leak Prevention)
  const { data: anonRows, error: se } = await anonClient.from('paid_bookings').select('id,full_name,phone').limit(5);
  // PostgREST returns 0 rows due to RLS filter
  const c3 = !se && (!anonRows || anonRows.length === 0);
  console.log('\n[Check 3] Anonymous Public SELECT restriction (PII Leak Prevention):');
  console.log('  rows returned to anon key:', anonRows ? anonRows.length : 0);
  console.log('  result:', c3 ? 'RESTRICTED (SUCCESS — 0 patient rows exposed to anon key)' : 'LEAK DETECTED — PII exposed!');
  c3 ? pass++ : fail++;

  // CHECK 4: Service Role Admin SELECT (Backend watcher & staff query)
  const { data: adminRows, error: are } = await adminClient.from('paid_bookings').select('id,full_name,phone,idempotency_key').eq('idempotency_key', testKey);
  const c4 = !are && adminRows && adminRows.length > 0;
  console.log('\n[Check 4] Service Role Admin SELECT (Backend Watcher / Processing):');
  console.log('  admin query result:', c4 ? 'ALLOWED (SUCCESS) — Found record: ' + JSON.stringify(adminRows[0]) : 'BLOCKED - ' + are?.message);
  c4 ? pass++ : fail++;

  // CHECK 5: Idempotency conflict enforcement (ON CONFLICT / 23505 duplicate prevention)
  const dupRes = await anonClient.from('paid_bookings').insert([{
    full_name: 'Duplicate Patient',
    phone: '9876543210',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    amount_paid: 250.00,
    idempotency_key: testKey
  }]);
  const dupErr = dupRes.error;
  const c5 = !!dupErr && (dupErr.code === '23505' || dupErr.message.includes('unique constraint') || dupErr.message.includes('idempotency_key'));
  console.log('\n[Check 5] PostgreSQL Unique Idempotency Constraint:');
  console.log('  duplicate insert caught:', c5 ? 'ENFORCED (SUCCESS) — Code ' + dupErr.code + ': ' + dupErr.message : 'FAILED — Duplicate row allowed!');
  c5 ? pass++ : fail++;

  // Cleanup probe row
  if (adminRows && adminRows[0]) {
    await adminClient.from('paid_bookings').delete().eq('id', adminRows[0].id);
    console.log('\n[Cleanup] Test probe row cleanly removed from DB.');
  }

  console.log('\n====================================================');
  console.log('AUDIT RESULT: ' + pass + '/5 CHECKS CONFIRMED PASSED.');
  console.log('====================================================');
}

runAudit().catch(e => console.error('Audit exception:', e));
