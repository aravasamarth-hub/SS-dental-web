import { test, describe } from 'node:test';
import assert from 'node:assert';
import { executeWithAuthRetry, createAuthFetch, isAuth401Error } from '../src/lib/supabaseAuth.js';

describe('Supabase Auth 401 Retry & Refresh (Incident Aug 2026)', () => {
  test('isAuth401Error detects 401 status, PGRST301, JWT expired messages', () => {
    assert.strictEqual(isAuth401Error({ status: 401 }), true);
    assert.strictEqual(isAuth401Error({ statusCode: 401 }), true);
    assert.strictEqual(isAuth401Error({ code: 'PGRST301', message: 'JWT expired' }), true);
    assert.strictEqual(isAuth401Error(new Error('Invalid JWT claim')), true);
    assert.strictEqual(isAuth401Error({ message: 'Unauthorized request' }), true);
    assert.strictEqual(isAuth401Error({ status: 404 }), false);
    assert.strictEqual(isAuth401Error(new Error('Resource not found')), false);
  });

  test('executeWithAuthRetry succeeds immediately when first call is successful', async () => {
    let callCount = 0;
    let refreshCount = 0;

    const mockSupabase = {
      auth: {
        refreshSession: async () => {
          refreshCount++;
          return { data: { session: { access_token: 'new_token' } }, error: null };
        }
      }
    };

    const result = await executeWithAuthRetry(async () => {
      callCount++;
      return { data: [{ id: 1, name: 'Test Record' }], error: null };
    }, mockSupabase);

    assert.strictEqual(callCount, 1);
    assert.strictEqual(refreshCount, 0);
    assert.deepStrictEqual(result.data, [{ id: 1, name: 'Test Record' }]);
  });

  test('executeWithAuthRetry recovers from 401 error via refreshSession -> retry 200 flow', async () => {
    let callCount = 0;
    let refreshCount = 0;

    const mockSupabase = {
      auth: {
        refreshSession: async () => {
          refreshCount++;
          return { data: { session: { access_token: 'refreshed_valid_token' } }, error: null };
        }
      }
    };

    // First attempt returns 401 JWT rejection, second attempt returns 200 data
    const result = await executeWithAuthRetry(async () => {
      callCount++;
      if (callCount === 1) {
        return {
          data: null,
          error: { status: 401, message: 'JWT expired or invalid token' }
        };
      }
      return { data: [{ id: 42, title: 'Secured Data' }], error: null };
    }, mockSupabase);

    assert.strictEqual(callCount, 2, 'Should execute 2 attempts (initial + 1 retry)');
    assert.strictEqual(refreshCount, 1, 'Should call refreshSession exactly once');
    assert.strictEqual(result.error, null);
    assert.deepStrictEqual(result.data, [{ id: 42, title: 'Secured Data' }]);
  });

  test('executeWithAuthRetry recovers from HTTP 401 fetch response -> refresh -> retry', async () => {
    let callCount = 0;
    let refreshCount = 0;

    const mockSupabase = {
      auth: {
        refreshSession: async () => {
          refreshCount++;
          return { data: { session: { access_token: 'token_abc' } }, error: null };
        }
      }
    };

    const mockResponse401 = { status: 401, ok: false };
    const mockResponse200 = { status: 200, ok: true, json: async () => ({ success: true }) };

    const result = await executeWithAuthRetry(async () => {
      callCount++;
      return callCount === 1 ? mockResponse401 : mockResponse200;
    }, mockSupabase);

    assert.strictEqual(callCount, 2);
    assert.strictEqual(refreshCount, 1);
    assert.strictEqual(result.status, 200);
  });

  test('executeWithAuthRetry treats permanent 401 as unauthenticated after single retry without looping', async () => {
    let callCount = 0;
    let refreshCount = 0;

    const mockSupabase = {
      auth: {
        refreshSession: async () => {
          refreshCount++;
          return { data: { session: { access_token: 'token_attempt' } }, error: null };
        }
      }
    };

    const result = await executeWithAuthRetry(async () => {
      callCount++;
      return {
        data: null,
        error: { status: 401, message: 'Session permanently revoked' }
      };
    }, mockSupabase);

    // Initial attempt (1) + single retry (1) = 2 calls total
    assert.strictEqual(callCount, 2);
    assert.strictEqual(refreshCount, 1);
    assert.strictEqual(result.error.status, 401);
  });

  test('executeWithAuthRetry cleanly signs out and aborts when refreshSession itself fails', async () => {
    let callCount = 0;
    let refreshCount = 0;
    let signOutCount = 0;

    const mockSupabase = {
      auth: {
        refreshSession: async () => {
          refreshCount++;
          // simulate refresh token revoked / expired
          return { data: null, error: new Error('Invalid Refresh Token: Refresh Token Not Found') };
        },
        signOut: async (opts) => {
          signOutCount++;
          assert.strictEqual(opts?.scope, 'local');
          return { error: null };
        }
      }
    };

    const result = await executeWithAuthRetry(async () => {
      callCount++;
      return {
        data: null,
        error: { status: 401, message: 'JWT expired' }
      };
    }, mockSupabase);

    // Initial attempt (1) -> refresh fails -> immediate clean exit (no 2nd retry attempt!)
    assert.strictEqual(callCount, 1, 'Must NOT retry if refresh token itself is invalid');
    assert.strictEqual(refreshCount, 1, 'Should have called refreshSession once');
    assert.strictEqual(signOutCount, 1, 'Should have performed clean local signOut');
    assert.strictEqual(result.error.status, 401);
  });

  test('refreshAuthSession releases mutex lock even if refreshSession throws an unhandled exception', async () => {
    let refreshCount = 0;

    const brokenSupabase = {
      auth: {
        refreshSession: async () => {
          refreshCount++;
          throw new Error('Fatal network crash during auth refresh');
        },
        signOut: async () => ({ error: null })
      }
    };

    // First call throws
    const res1 = await executeWithAuthRetry(async () => ({ data: null, error: { status: 401 } }), brokenSupabase);
    assert.strictEqual(res1.error.status, 401);

    // Second call should NOT be deadlocked by the previous error
    const res2 = await executeWithAuthRetry(async () => ({ data: null, error: { status: 401 } }), brokenSupabase);
    assert.strictEqual(res2.error.status, 401);
    assert.strictEqual(refreshCount, 2, 'Mutex should have unlocked, allowing subsequent calls to proceed');
  });

  test('executeWithAuthRetry does not call refreshSession on non-401 errors (e.g. 404, 500)', async () => {
    let callCount = 0;
    let refreshCount = 0;

    const mockSupabase = {
      auth: {
        refreshSession: async () => {
          refreshCount++;
          return { data: null, error: null };
        }
      }
    };

    const result = await executeWithAuthRetry(async () => {
      callCount++;
      return {
        data: null,
        error: { status: 404, message: 'Not found' }
      };
    }, mockSupabase);

    assert.strictEqual(callCount, 1);
    assert.strictEqual(refreshCount, 0, 'Must not refresh on 404');
    assert.strictEqual(result.error.status, 404);
  });
});
