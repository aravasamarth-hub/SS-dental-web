const { createClient } = require('@supabase/supabase-js');

const hasSupabaseCreds = !!(process.env.SUPABASE_URL && process.env.SUPABASE_API_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_API_KEY || 'placeholder-key'
);

// Test the connection if credentials are provided
if (hasSupabaseCreds) {
  supabase
    .from('appointments')
    .select('*')
    .limit(1)
    .then(({ data, error }) => {
      if (error) console.error('Connection error:', error);
      else console.log('Connected to Supabase. Sample data:', data);
    });
} else {
  console.log('Supabase environment variables not set. Skipping live database connection test.');
}

module.exports = supabase;
