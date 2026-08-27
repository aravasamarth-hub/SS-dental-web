/**
 * Supabase Auth Interceptor & Retry Utility
 * 
 * Context: Supabase Incident (Aug 14, 2026) - "401 errors due to JWT rejections"
 * Intermittent HTTP 401 errors caused by token refresh timing desynchronization.
 * 
 * This module provides:
 * 1. executeWithAuthRetry: Wraps Supabase queries / API calls. On 401, calls
 *    supabase.auth.refreshSession() once and retries the operation.
 * 2. Deduplicated refresh promise to avoid refresh stampedes across concurrent requests.
 * 3. Strict single-retry limit to prevent infinite loops and replay attacks.
 */

let activeRefreshPromise = null;

/**
 * Checks if an error or response indicates an authentication/JWT rejection (401)
 */
export function isAuth401Error(errorOrResponse) {
  if (!errorOrResponse) return false;

  // Check HTTP Response
  if (typeof errorOrResponse.status === 'number' && errorOrResponse.status === 401) {
    return true;
  }

  // Check PostgREST / Supabase Error object
  const status = errorOrResponse.status || errorOrResponse.statusCode || errorOrResponse.code;
  if (status === 401 || status === '401' || status === 'PGRST301' || status === 'JWT_EXPIRED') {
    return true;
  }

  const message = (errorOrResponse.message || errorOrResponse.error_description || String(errorOrResponse)).toLowerCase();
  return (
    message.includes('jwt') ||
    message.includes('token expired') ||
    message.includes('invalid claim') ||
    message.includes('unauthorized') ||
    message.includes('401')
  );
}

/**
 * Safely refreshes the Supabase auth session with deduplication across concurrent requests.
 * If the refresh token itself is expired or invalid, performs a clean local signOut.
 */
export async function refreshAuthSession(supabaseClient) {
  if (!supabaseClient || !supabaseClient.auth || typeof supabaseClient.auth.refreshSession !== 'function') {
    return { data: null, error: new Error('Supabase client auth is not configured') };
  }

  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      console.info('🔄 [Supabase Auth] Intercepted 401. Refreshing auth session...');
      const { data, error } = await supabaseClient.auth.refreshSession();
      if (error) {
        console.warn('⚠️ [Supabase Auth] Session refresh failed (token expired/revoked):', error.message);
        // Cleanly clear local unauthenticated session without throwing
        if (typeof supabaseClient.auth.signOut === 'function') {
          try {
            await supabaseClient.auth.signOut({ scope: 'local' });
          } catch {
            // ignore signOut network failure
          }
        }
        return { data: null, error };
      }
      console.log('✅ [Supabase Auth] Session successfully refreshed.');
      return { data, error: null };
    } catch (err) {
      console.error('❌ [Supabase Auth] Exception during session refresh:', err);
      if (typeof supabaseClient.auth.signOut === 'function') {
        try {
          await supabaseClient.auth.signOut({ scope: 'local' });
        } catch {}
      }
      return { data: null, error: err };
    } finally {
      // Mutex / dedup lock is guaranteed to be released under all circumstances
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

/**
 * Executes a Supabase query or authenticated fetch operation with automatic 401 refresh-and-retry.
 * 
 * @param {Function} operation - Async function returning { data, error } or fetch Response
 * @param {Object} supabaseClient - Supabase JS client instance
 * @param {Object} [options]
 * @param {number} [options.maxRetries=1] - Maximum retry attempts (strictly 1 to prevent loops)
 * @returns {Promise<any>}
 */
export async function executeWithAuthRetry(operation, supabaseClient, options = {}) {
  const maxRetries = options.maxRetries !== undefined ? options.maxRetries : 1;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await operation();

      // Check if response is a fetch Response
      if (result && typeof result.status === 'number') {
        if (result.status === 401 && attempt < maxRetries) {
          const refreshResult = await refreshAuthSession(supabaseClient);
          if (refreshResult.error) {
            // Refresh token is also dead -> return original 401 cleanly (unauthenticated)
            return result;
          }
          continue; // retry operation once with refreshed token
        }
        return result;
      }

      // Check if response is a Supabase { data, error } object
      if (result && result.error) {
        if (isAuth401Error(result.error) && attempt < maxRetries) {
          const refreshResult = await refreshAuthSession(supabaseClient);
          if (refreshResult.error) {
            // Refresh token is dead -> return unauthenticated error cleanly
            return result;
          }
          continue; // retry operation once
        }
      }

      return result;
    } catch (err) {
      if (isAuth401Error(err) && attempt < maxRetries) {
        const refreshResult = await refreshAuthSession(supabaseClient);
        if (!refreshResult.error) {
          continue; // retry operation once
        }
      }
      throw err;
    }
  }
}

/**
 * Authenticated fetch helper that injects auth header and handles 401 refresh-and-retry.
 */
export async function createAuthFetch(supabaseClient) {
  return async function authFetch(url, options = {}) {
    return executeWithAuthRetry(async () => {
      const headers = new Headers(options.headers || {});
      
      // If we have an active session, inject authorization header if not already present
      if (supabaseClient?.auth?.getSession) {
        try {
          const { data } = await supabaseClient.auth.getSession();
          if (data?.session?.access_token && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${data.session.access_token}`);
          }
        } catch {
          // ignore session retrieval error for public endpoints
        }
      }

      return fetch(url, { ...options, headers });
    }, supabaseClient);
  };
}
