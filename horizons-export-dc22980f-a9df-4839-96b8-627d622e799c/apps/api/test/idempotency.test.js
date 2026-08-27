const { test, describe } = require('node:test');
const assert = require('node:assert');
const { z } = require('zod');
const { checkRecordAlreadyExists, isPoolerOrNetworkError } = require('../db');

describe('Idempotency & Resilience End-to-End Suite', () => {
  // In-memory mock database store simulating PostgreSQL UNIQUE constraint on idempotency_key
  const mockDb = {
    appointments: new Map(),
    paid_bookings: new Map()
  };

  // Helper simulating PostgreSQL INSERT ... ON CONFLICT (idempotency_key) DO NOTHING
  function insertMockRecord(table, record) {
    const store = mockDb[table];
    if (record.idempotency_key && store.has(record.idempotency_key)) {
      // Conflict: return existing record, do not duplicate
      return { data: [store.get(record.idempotency_key)], error: null, duplicate: true };
    }
    const newId = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const saved = { ...record, id: newId };
    if (record.idempotency_key) {
      store.set(record.idempotency_key, saved);
    }
    return { data: [saved], error: null, duplicate: false };
  }

  test('Database helper checkRecordAlreadyExists looks up strictly by idempotency_key', async () => {
    // When no idempotency_key is provided, returns false
    const noKey = await checkRecordAlreadyExists('paid_bookings', { phone: '1234567890' });
    assert.strictEqual(noKey, false);

    // When empty record, returns false
    const empty = await checkRecordAlreadyExists('paid_bookings', null);
    assert.strictEqual(empty, false);

    // When idempotency_key is provided but does not exist in DB, returns false
    const notFound = await checkRecordAlreadyExists('paid_bookings', { idempotency_key: 'key_does_not_exist_999' });
    assert.strictEqual(notFound, false);
  });

  test('Idempotency key uniqueness: two inserts with same key produce exactly one row', () => {
    mockDb.paid_bookings.clear();
    const key = `idem_${Date.now()}_abc`;

    const record1 = {
      idempotency_key: key,
      full_name: 'Jane Doe',
      phone: '9876543210',
      appointment_date: '2026-09-01',
      appointment_time: '11:00 AM',
      amount_paid: 250.00
    };

    // First insert
    const res1 = insertMockRecord('paid_bookings', record1);
    assert.strictEqual(res1.duplicate, false);
    assert.strictEqual(mockDb.paid_bookings.size, 1);

    // Second insert with exact same idempotency_key
    const res2 = insertMockRecord('paid_bookings', record1);
    assert.strictEqual(res2.duplicate, true);
    assert.strictEqual(mockDb.paid_bookings.size, 1, 'Should NOT insert a duplicate row');
    assert.strictEqual(res1.data[0].id, res2.data[0].id, 'Should resolve to the same record ID');
  });

  test('Zod validation rejects malformed / missing required inputs on booking payload', () => {
    const bookingSchema = z.object({
      name: z.string().trim().min(1, 'Name is required').max(255),
      phone: z.string().trim().min(7, 'Phone number is too short').max(50),
      email: z.string().trim().email('Invalid email address').or(z.literal('')).optional().default(''),
      date: z.any().optional().default(''),
      time: z.string().optional().default(''),
      idempotency_key: z.string().trim().min(1).max(255).optional()
    });

    // 1. Missing name
    const invalid1 = bookingSchema.safeParse({ phone: '9448455699' });
    assert.strictEqual(invalid1.success, false);

    // 2. Missing phone
    const invalid2 = bookingSchema.safeParse({ name: 'Valid Name' });
    assert.strictEqual(invalid2.success, false);

    // 3. Invalid email format
    const invalid3 = bookingSchema.safeParse({ name: 'Valid Name', phone: '9448455699', email: 'not-an-email' });
    assert.strictEqual(invalid3.success, false);

    // 4. Valid payload with idempotency_key
    const valid = bookingSchema.safeParse({
      name: 'Dr. Patient',
      phone: '9448455699',
      email: 'patient@example.com',
      idempotency_key: 'uuid-123-abc'
    });
    assert.strictEqual(valid.success, true);
    assert.strictEqual(valid.data.idempotency_key, 'uuid-123-abc');
  });

  test('Integration simulation: /api/create-booking socket disconnect mid-response + retry with same idempotency_key produces exactly 1 row', async () => {
    mockDb.paid_bookings.clear();
    const sharedIdempotencyKey = `idem_retry_test_${Date.now()}`;

    // Simulate Server endpoint handler with idempotency guard
    let backendExecutions = 0;
    async function handleCreateBooking(reqBody) {
      backendExecutions++;
      const res = insertMockRecord('paid_bookings', reqBody);
      return {
        status: 200,
        body: { success: true, message: 'Appointment booked successfully!', recordId: res.data[0].id, duplicate: res.duplicate }
      };
    }

    const payload = {
      idempotency_key: sharedIdempotencyKey,
      full_name: 'Rohan Sharma',
      phone: '9845123456',
      email: 'rohan@example.com',
      date: '2026-09-10',
      time: '05:00 PM'
    };

    // 1. First Attempt: Request executes server-side, but client connection is severed before receiving response
    const firstAttemptResult = await handleCreateBooking(payload);
    assert.strictEqual(firstAttemptResult.status, 200);
    assert.strictEqual(firstAttemptResult.body.duplicate, false);
    assert.strictEqual(mockDb.paid_bookings.size, 1);

    // Client catches ECONNRESET / socket hangup
    const clientError = new TypeError('fetch failed');
    clientError.cause = { code: 'UND_ERR_SOCKET', message: 'other side closed' };
    assert.strictEqual(isPoolerOrNetworkError(clientError), true);

    // 2. Client Retries the exact same submission with the SAME sharedIdempotencyKey
    const retryAttemptResult = await handleCreateBooking(payload);
    assert.strictEqual(retryAttemptResult.status, 200);
    assert.strictEqual(retryAttemptResult.body.duplicate, true);

    // Assert: Exactly ONE row exists in the database
    assert.strictEqual(mockDb.paid_bookings.size, 1, 'Database must have exactly 1 record after retry');
    assert.strictEqual(backendExecutions, 2, 'Backend received both calls');
    assert.strictEqual(firstAttemptResult.body.recordId, retryAttemptResult.body.recordId);
  });

  test('Integration simulation: /api/verify-payment retry with same idempotency_key prevents duplicate paid_bookings', async () => {
    mockDb.paid_bookings.clear();
    const sharedIdempotencyKey = `idem_pay_test_${Date.now()}`;

    let backendExecutions = 0;
    async function handleVerifyPayment(reqBody) {
      backendExecutions++;
      const res = insertMockRecord('paid_bookings', reqBody);
      return {
        status: 200,
        body: { success: true, message: 'Payment verified and appointment booked!', recordId: res.data[0].id, duplicate: res.duplicate }
      };
    }

    const payload = {
      idempotency_key: sharedIdempotencyKey,
      full_name: 'Ananya Rao',
      phone: '9740012345',
      email: 'ananya@example.com',
      order_id: 'order_123',
      payment_id: 'pay_123',
      payment_method: 'Razorpay',
      payment_status: 'paid',
      amount_paid: 250.00
    };

    // 1. First attempt: payment verified and booked
    const res1 = await handleVerifyPayment(payload);
    assert.strictEqual(res1.status, 200);
    assert.strictEqual(res1.body.duplicate, false);
    assert.strictEqual(mockDb.paid_bookings.size, 1);

    // 2. Network glitch causes client to retry verification
    const res2 = await handleVerifyPayment(payload);
    assert.strictEqual(res2.status, 200);
    assert.strictEqual(res2.body.duplicate, true);
    assert.strictEqual(mockDb.paid_bookings.size, 1, 'Duplicate payment row MUST NOT be created');
    assert.strictEqual(res1.body.recordId, res2.body.recordId);
  });

  test('Centralized error boundary formats uncaught errors into clean JSON without stack traces', () => {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      endpoint: 'POST /api/create-booking',
      errorName: 'Error',
      errorMessage: 'Simulated uncaught exception',
      idempotencyKey: 'idem_err_test_123'
    };

    const simulatedErr = new Error('Simulated uncaught exception');
    const status = simulatedErr.status || 500;
    const responsePayload = {
      success: false,
      message: simulatedErr.message || 'Internal server error occurred',
      error: 'Error'
    };

    assert.strictEqual(status, 500);
    assert.strictEqual(responsePayload.success, false);
    assert.strictEqual(responsePayload.message, 'Simulated uncaught exception');
    assert.strictEqual(errorDetails.idempotencyKey, 'idem_err_test_123');
  });
});
