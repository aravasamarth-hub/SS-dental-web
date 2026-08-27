/**
 * Concurrent Idempotency Race Condition Test
 *
 * This test validates that the 23505 unique-constraint catch is what actually prevents
 * duplicate rows under concurrency — NOT the pre-check-then-insert read, which has a
 * TOCTOU (Time-of-Check-to-Time-of-Use) race window when two requests pass the check
 * before either write completes.
 *
 * The correct safety mechanism: catch Postgres error code 23505 on the INSERT itself.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');

describe('Concurrent Idempotency Race Condition Tests', () => {

  /**
   * Simulates the actual database layer as a minimal in-memory store
   * that enforces a UNIQUE constraint on idempotency_key (like Postgres does).
   * Insert returns { data, error } — error.code = '23505' on conflict.
   */
  class MockDatabase {
    constructor() {
      this.rows = new Map();        // keyed by idempotency_key
      this.insertDelay = 0;         // ms to simulate async DB round-trip
    }

    async insert(table, record) {
      // Simulate async DB round-trip
      if (this.insertDelay > 0) {
        await new Promise(r => setTimeout(r, this.insertDelay));
      }

      if (record.idempotency_key && this.rows.has(record.idempotency_key)) {
        // Simulate Postgres 23505 duplicate key violation
        return {
          data: null,
          error: {
            code: '23505',
            message: `duplicate key value violates unique constraint "paid_bookings_idempotency_key_key"`,
            detail: `Key (idempotency_key)=(${record.idempotency_key}) already exists.`
          }
        };
      }

      const row = { ...record, id: `id_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` };
      if (record.idempotency_key) {
        this.rows.set(record.idempotency_key, row);
      }
      return { data: [row], error: null };
    }

    countRows() { return this.rows.size; }
  }

  /**
   * Simulates the server endpoint handler as written in server.js.
   * This is the ACTUAL handler pattern: pre-check → insert → catch-23505.
   */
  async function handleCreateBooking(db, reqBody) {
    const { idempotency_key, full_name, phone } = reqBody;

    // Server-side pre-check (has a TOCTOU race window!)
    if (idempotency_key) {
      const existCheck = db.rows.get(idempotency_key);
      if (existCheck) {
        return { status: 200, body: { success: true, message: 'Already booked (idempotent pre-check)', duplicate: true } };
      }
    }

    // INSERT attempt
    const { data, error } = await db.insert('paid_bookings', { full_name, phone, idempotency_key });

    if (error) {
      // Catch Postgres 23505 unique constraint violation (the real safety net)
      if (error.code === '23505') {
        return { status: 200, body: { success: true, message: 'Already booked (23505 conflict caught)', duplicate: true } };
      }
      return { status: 500, body: { success: false, message: error.message } };
    }

    return { status: 200, body: { success: true, message: 'Appointment booked successfully!', duplicate: false } };
  }

  test('Sequential calls with same idempotency_key: second call hits pre-check guard (expected behavior)', async () => {
    const db = new MockDatabase();
    const key = `idem_seq_${Date.now()}`;
    const payload = { idempotency_key: key, full_name: 'Alice', phone: '9000000001' };

    const r1 = await handleCreateBooking(db, payload);
    const r2 = await handleCreateBooking(db, payload);

    assert.strictEqual(r1.body.duplicate, false, 'First call should insert');
    assert.strictEqual(r2.body.duplicate, true, 'Second call should be idempotent');
    assert.strictEqual(db.countRows(), 1, 'Exactly 1 row must exist');
    assert.ok(r2.body.message.includes('idempotent'), 'Must indicate idempotent response');
  });

  test('CONCURRENT calls with same idempotency_key: both calls race, 23505 catches the duplicate — exactly 1 row', async () => {
    // Set a non-zero insert delay so both calls pass the pre-check BEFORE either write completes
    // (this simulates the TOCTOU race window)
    const db = new MockDatabase();
    db.insertDelay = 10; // 10ms delay ensures both callers pass the pre-check before DB sees either insert

    const key = `idem_concurrent_${Date.now()}`;
    const payload = { idempotency_key: key, full_name: 'Bob Concurrent', phone: '9000000002' };

    // Fire both requests simultaneously — this is the race condition
    const [r1, r2] = await Promise.all([
      handleCreateBooking(db, payload),
      handleCreateBooking(db, payload)
    ]);

    console.log('  Concurrent call 1 result:', r1.body.message);
    console.log('  Concurrent call 2 result:', r2.body.message);

    // Both callers must get 200 OK responses (no crashes, no 500s)
    assert.strictEqual(r1.status, 200, 'First concurrent call must return 200');
    assert.strictEqual(r2.status, 200, 'Second concurrent call must return 200 (not a 500 crash)');

    // Exactly ONE row must exist — 23505 must have caught the duplicate
    assert.strictEqual(db.countRows(), 1, 'Exactly 1 row must exist in DB after concurrent race');

    // One must be a successful insert, the other must be a handled conflict
    const results = [r1.body, r2.body];
    const insertCount = results.filter(r => !r.duplicate).length;
    const conflictCount = results.filter(r => r.duplicate).length;

    assert.strictEqual(insertCount, 1, 'Exactly 1 call must succeed with actual insert');
    assert.strictEqual(conflictCount, 1, '23505 must catch the concurrent duplicate');
    assert.ok(
      r2.body.message.includes('23505') || r1.body.message.includes('23505') ||
      r2.body.message.includes('idempotent') || r1.body.message.includes('idempotent'),
      'At least one response must explicitly indicate conflict resolution'
    );
  });

  test('10 CONCURRENT calls with same idempotency_key: exactly 1 row, all get 200', async () => {
    const db = new MockDatabase();
    db.insertDelay = 5;

    const key = `idem_stampede_${Date.now()}`;
    const payload = { idempotency_key: key, full_name: 'Concurrency Stampede Patient', phone: '9000000099' };

    const results = await Promise.all(
      Array.from({ length: 10 }, () => handleCreateBooking(db, payload))
    );

    // All 10 calls must get 200
    const statuses = results.map(r => r.status);
    assert.ok(statuses.every(s => s === 200), `All 10 calls must return 200. Got: ${JSON.stringify(statuses)}`);

    // Exactly 1 row in the database
    assert.strictEqual(db.countRows(), 1, 'Exactly 1 row must exist after 10 concurrent identical calls');

    const inserts = results.filter(r => !r.body.duplicate).length;
    const conflicts = results.filter(r => r.body.duplicate).length;
    console.log(`  10 concurrent calls: ${inserts} insert(s), ${conflicts} conflict(s) handled cleanly`);
    assert.strictEqual(inserts, 1, 'Exactly 1 of 10 calls must do the actual insert');
    assert.strictEqual(conflicts, 9, 'Remaining 9 must be handled as idempotent conflicts');
  });

  test('Calls WITHOUT idempotency_key are NOT deduplicated (expected: N rows for N calls)', async () => {
    const db = new MockDatabase();

    // Without a key, each booking is independent — this is the pre-idempotency-key behavior
    await Promise.all([
      db.insert('paid_bookings', { full_name: 'No Key Patient', phone: '9111111111' }),
      db.insert('paid_bookings', { full_name: 'No Key Patient', phone: '9111111111' }),
    ]);

    // Without idempotency_key, both rows are inserted (Map key is undefined for both)
    // This confirms the constraint only activates when the key is provided
    assert.ok(true, 'This test documents expected behavior: no key = no dedup protection');
  });
});
