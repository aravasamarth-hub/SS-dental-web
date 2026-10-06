import { createClient } from '@supabase/supabase-js';
import { executeWithAuthRetry, createAuthFetch, isAuth401Error, refreshAuthSession } from './supabaseAuth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dryhmzalotgxdqihnrln.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_7VIOvS0g_y0VtrNmHEIYVA_5fCdkWru';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to execute operations against Supabase with auto-refresh on 401
export const withAuthRetry = (operation, options) => executeWithAuthRetry(operation, supabase, options);

// Enhanced fetch helper with auto-refresh on 401
export const authFetch = async (url, options) => (await createAuthFetch(supabase))(url, options);

export { executeWithAuthRetry, createAuthFetch, isAuth401Error, refreshAuthSession };

