import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gthczioqtznvfxhqvslm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_SgwUX2SPWcxT4RfLQoHeSg_7q2Nnkxj';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
