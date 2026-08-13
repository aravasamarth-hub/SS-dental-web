const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://gthczioqtznvfxhqvslm.supabase.co';
const supabaseKey = process.env.SUPABASE_API_KEY || 'sb_publishable_SgwUX2SPWcxT4RfLQoHeSg_7q2Nnkxj';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
supabase
  .from('paid_bookings')
  .select('id')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.warn('⚠️ Supabase connection test to paid_bookings warning:', error.message);
    } else {
      console.log('✅ Connected to Supabase live database successfully.');
    }
  });

module.exports = supabase;
