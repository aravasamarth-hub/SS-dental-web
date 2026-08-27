const { test, describe } = require('node:test');
const assert = require('node:assert');
const { withDbRetry, isPoolerOrNetworkError } = require('../db');

describe('Supabase & PostgREST Network Resilience (withDbRetry)', () => {
  test('isPoolerOrNetworkError correctly identifies direct and nested undici / Node 24 fetch error shapes', () => {
    // 1. Raw error codes
    assert.strictEqual(isPoolerOrNetworkError({ code: 'ECONNRESET', message: 'connection dropped' }), true);
    assert.strictEqual(isPoolerOrNetworkError(new Error('server closed the connection unexpectedly (pgbouncer)')), true);
    assert.strictEqual(isPoolerOrNetworkError(new Error('503 Service Unavailable')), true);
    assert.strictEqual(isPoolerOrNetworkError(new Error('520 Web Server Returned an Unknown Error')), true);

    // 2. Real Node 24 undici fetch failure shapes (err.cause)
    const undiciSocketErr = new TypeError('fetch failed');
    undiciSocketErr.cause = { name: 'SocketError', code: 'UND_ERR_SOCKET', message: 'other side closed' };
    assert.strictEqual(isPoolerOrNetworkError(undiciSocketErr), true);

    const undiciTimeoutErr = new TypeError('fetch failed');
    undiciTimeoutErr.cause = { name: 'ConnectTimeoutError', code: 'UND_ERR_CONNECT_TIMEOUT', message: 'Connect Timeout Error' };
    assert.strictEqual(isPoolerOrNetworkError(undiciTimeoutErr), true);

    const undiciRefusedErr = new TypeError('fetch failed');
    undiciRefusedErr.cause = { code: 'ECONNREFUSED', message: 'connect ECONNREFUSED 127.0.0.1:5432' };
    assert.strictEqual(isPoolerOrNetworkError(undiciRefusedErr), true);

    // 3. Non-network errors must be false
    assert.strictEqual(isPoolerOrNetworkError(new Error('column "foo" does not exist')), false);
    assert.strictEqual(isPoolerOrNetworkError(new Error('null value in column violates not-null constraint')), false);
  });

  test('withDbRetry returns data immediately if first call succeeds', async () => {
    let callCount = 0;
    const result = await withDbRetry(async () => {
      callCount++;
      return { data: [{ id: '123' }], error: null };
    });

    assert.strictEqual(callCount, 1);
    assert.deepStrictEqual(result.data, [{ id: '123' }]);
  });

  test('withDbRetry retries on real undici fetch failed (UND_ERR_SOCKET) and succeeds on attempt 2', async () => {
    let callCount = 0;
    const startTime = Date.now();

    const result = await withDbRetry(
      async () => {
        callCount++;
        if (callCount === 1) {
          const fetchErr = new TypeError('fetch failed');
          fetchErr.cause = { name: 'SocketError', code: 'UND_ERR_SOCKET', message: 'other side closed' };
          throw fetchErr;
        }
        return { data: [{ id: 'rec_recovered' }], error: null };
      },
      2,
      40
    );

    const elapsed = Date.now() - startTime;
    assert.strictEqual(callCount, 2);
    assert.deepStrictEqual(result.data, [{ id: 'rec_recovered' }]);
    assert.ok(elapsed >= 30, 'Should have applied backoff delay before retry');
  });

  test('withDbRetry retries on Supabase pgbouncer / 503 error object and succeeds', async () => {
    let callCount = 0;
    const result = await withDbRetry(
      async () => {
        callCount++;
        if (callCount === 1) {
          return {
            data: null,
            error: { message: '503 Service Unavailable: server closed connection', code: '08006' }
          };
        }
        return { data: [{ id: 'booking_saved' }], error: null };
      },
      2,
      30
    );

    assert.strictEqual(callCount, 2);
    assert.deepStrictEqual(result.data, [{ id: 'booking_saved' }]);
  });

  test('withDbRetry gives up after maxRetries if backend is completely unreachable', async () => {
    let callCount = 0;
    await assert.rejects(
      async () => {
        await withDbRetry(
          async () => {
            callCount++;
            const err = new TypeError('fetch failed');
            err.cause = { code: 'UND_ERR_CONNECT_TIMEOUT', message: 'timeout' };
            throw err;
          },
          2,
          20
        );
      },
      (err) => {
        assert.ok(err.message.includes('fetch failed'));
        return true;
      }
    );

    // Initial attempt (1) + 2 retries = 3 calls
    assert.strictEqual(callCount, 3);
  });

  test('withDbRetry fails immediately without retrying on non-network/schema errors', async () => {
    let callCount = 0;
    await assert.rejects(
      async () => {
        await withDbRetry(
          async () => {
            callCount++;
            throw new Error('violates unique key constraint "unique_phone"');
          },
          2,
          50
        );
      },
      (err) => {
        assert.ok(err.message.includes('unique key'));
        return true;
      }
    );

    assert.strictEqual(callCount, 1, 'Should not retry non-network schema errors');
  });
});

