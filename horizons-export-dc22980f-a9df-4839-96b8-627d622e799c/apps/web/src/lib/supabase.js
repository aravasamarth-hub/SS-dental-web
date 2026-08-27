import { createClient } from '@supabase/supabase-js';
import { executeWithAuthRetry, createAuthFetch, isAuth401Error, refreshAuthSession } from './supabaseAuth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gthczioqtznvfxhqvslm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_SgwUX2SPWcxT4RfLQoHeSg_7q2Nnkxj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to execute operations against Supabase with auto-refresh on 401
export const withAuthRetry = (operation, options) => executeWithAuthRetry(operation, supabase, options);

// Enhanced fetch helper with auto-refresh on 401
export const authFetch = async (url, options) => (await createAuthFetch(supabase))(url, options);

export { executeWithAuthRetry, createAuthFetch, isAuth401Error, refreshAuthSession };

