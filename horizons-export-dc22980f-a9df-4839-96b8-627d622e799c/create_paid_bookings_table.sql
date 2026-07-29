-- =========================================================================
-- CREATE `paid_bookings` TABLE IN SUPABASE (BESIDE `appointments`)
-- Project: SS DENTAL CARE
-- =========================================================================

-- 1. Create the `paid_bookings` table
CREATE TABLE IF NOT EXISTS public.paid_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    state VARCHAR(100) DEFAULT 'Karnataka',
    appointment_date VARCHAR(50),
    appointment_time VARCHAR(50),
    payment_method VARCHAR(50) DEFAULT 'Razorpay',
    payment_status VARCHAR(50) DEFAULT 'paid',
    payment_id VARCHAR(255),
    order_id VARCHAR(255),
    amount_paid NUMERIC(10, 2) DEFAULT 250.00
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.paid_bookings ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public / anonymous visitors to insert paid bookings
DROP POLICY IF EXISTS "Enable insert for public visitors" ON public.paid_bookings;
CREATE POLICY "Enable insert for public visitors"
ON public.paid_bookings
FOR INSERT
TO public
WITH CHECK (true);

-- 4. Policy: Allow viewing paid bookings
DROP POLICY IF EXISTS "Enable select for public visitors" ON public.paid_bookings;
CREATE POLICY "Enable select for public visitors"
ON public.paid_bookings
FOR SELECT
TO public
USING (true);

-- 5. Grant permissions to public roles
GRANT ALL ON TABLE public.paid_bookings TO anon, authenticated, service_role;

-- =========================================================================
-- DONE! Copy and execute this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gthczioqtznvfxhqvsml/sql/new
-- =========================================================================
