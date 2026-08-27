-- =========================================================================
-- MASTER SUPABASE TABLES, SECURITY PERMISSIONS & RLS POLICIES SCRIPT
-- Project: SS DENTAL CARE (SSDENTALCARE)
-- =========================================================================

-- 1. DROP ALL OLD & DUPLICATE POLICIES TO CLEAR SECURITY ADVISOR WARNINGS
DROP POLICY IF EXISTS "Allow public appointments insertion" ON public.appointments;
DROP POLICY IF EXISTS "Allow public appointments select" ON public.appointments;
DROP POLICY IF EXISTS "Allow staff select appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow service role appointments all" ON public.appointments;

DROP POLICY IF EXISTS "Allow public paid bookings insertion" ON public.paid_bookings;
DROP POLICY IF EXISTS "Allow public paid bookings select" ON public.paid_bookings;
DROP POLICY IF EXISTS "Allow staff select paid bookings" ON public.paid_bookings;
DROP POLICY IF EXISTS "Allow service role paid bookings all" ON public.paid_bookings;

-- 2. `public.appointments` TABLE & SECURE RLS POLICIES
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    idempotency_key VARCHAR(255) UNIQUE,
    created_at VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    state VARCHAR(100) DEFAULT 'Karnataka',
    appointment_date VARCHAR(50),
    appointment_time VARCHAR(50)
);

ALTER TABLE public.appointments ALTER COLUMN created_at TYPE VARCHAR(100) USING created_at::text;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(255) UNIQUE;

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow public web visitors to insert valid new appointment requests
CREATE POLICY "Allow public appointments insertion"
ON public.appointments FOR INSERT TO anon, authenticated, service_role 
WITH CHECK (full_name IS NOT NULL AND phone IS NOT NULL);

-- SELECT: service_role only (anon key is public; never allow patient PII enumeration)
CREATE POLICY "Allow staff select appointments"
ON public.appointments FOR SELECT TO service_role
USING (true);

GRANT SELECT, INSERT ON TABLE public.appointments TO anon, authenticated, service_role;


-- 3. `public.paid_bookings` TABLE & SECURE RLS POLICIES
CREATE TABLE IF NOT EXISTS public.paid_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    idempotency_key VARCHAR(255) UNIQUE,
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
ALTER TABLE public.paid_bookings ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(255) UNIQUE;

ALTER TABLE public.paid_bookings ENABLE ROW LEVEL SECURITY;

-- Allow public web visitors to insert valid new paid bookings
CREATE POLICY "Allow public paid bookings insertion"
ON public.paid_bookings FOR INSERT TO anon, authenticated, service_role 
WITH CHECK (full_name IS NOT NULL AND phone IS NOT NULL);

-- SELECT: service_role only (anon key is public; never allow patient PII enumeration)
CREATE POLICY "Allow staff select paid bookings"
ON public.paid_bookings FOR SELECT TO service_role
USING (true);

GRANT SELECT, INSERT ON TABLE public.paid_bookings TO anon, authenticated, service_role;
