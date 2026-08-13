-- =========================================================================
-- MASTER SUPABASE TABLES & RLS SECURITY PERMISSIONS SCRIPT
-- Project: SS DENTAL CARE
-- =========================================================================

-- -------------------------------------------------------------------------
-- PART 1: `public.appointments` TABLE & CLEANUP (REMOVE PAYMENT COLUMNS)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    appointment_date VARCHAR(50),
    appointment_time VARCHAR(50)
);

-- Change created_at to VARCHAR(100) for formatted timestamp string (DD/MM/YYYY hh:mm:ss AM/PM)
ALTER TABLE public.appointments ALTER COLUMN created_at TYPE VARCHAR(100) USING created_at::text;
ALTER TABLE public.appointments ALTER COLUMN created_at SET DEFAULT NULL;

-- Remove unused payment columns from appointments table
ALTER TABLE public.appointments DROP COLUMN IF EXISTS payment_method;
ALTER TABLE public.appointments DROP COLUMN IF EXISTS payment_status;
ALTER TABLE public.appointments DROP COLUMN IF EXISTS payment_id;
ALTER TABLE public.appointments DROP COLUMN IF EXISTS order_id;
ALTER TABLE public.appointments DROP COLUMN IF EXISTS amount_paid;

-- Enable Row Level Security (RLS) & Policies
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to modify appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public/anonymous inserts" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert for public visitors" ON public.appointments;

CREATE POLICY "Enable insert for public visitors"
ON public.appointments
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable select for public visitors" ON public.appointments;
CREATE POLICY "Enable select for public visitors"
ON public.appointments
FOR SELECT
TO public
USING (true);

GRANT ALL ON TABLE public.appointments TO anon, authenticated, service_role;


-- -------------------------------------------------------------------------
-- PART 2: `public.paid_bookings` TABLE & PERMISSIONS
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.paid_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at VARCHAR(100),
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

ALTER TABLE public.paid_bookings ALTER COLUMN created_at TYPE VARCHAR(100) USING created_at::text;
ALTER TABLE public.paid_bookings ALTER COLUMN created_at SET DEFAULT NULL;

ALTER TABLE public.paid_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for public visitors" ON public.paid_bookings;
CREATE POLICY "Enable insert for public visitors"
ON public.paid_bookings
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable select for public visitors" ON public.paid_bookings;
CREATE POLICY "Enable select for public visitors"
ON public.paid_bookings
FOR SELECT
TO public
USING (true);

GRANT ALL ON TABLE public.paid_bookings TO anon, authenticated, service_role;

-- =========================================================================
-- DONE! Copy and execute this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gthczioqtznvfxhqvsml/sql/new
-- =========================================================================
