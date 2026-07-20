const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_API_KEY || 'placeholder-key'
);

// Test the connection
supabase
  .from('appointments')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) console.error('Connection error:', error);
    else console.log('Connected to Supabase. Sample data:', data);
  });

module.exports = supabase;
