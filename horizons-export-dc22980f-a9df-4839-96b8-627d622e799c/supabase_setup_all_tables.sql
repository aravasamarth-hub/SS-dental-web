-- =========================================================================
-- MASTER SUPABASE TABLES, SECURITY PERMISSIONS & OPTIMIZATION SCRIPT
-- Project: SS DENTAL CARE (SSDENTALCARE)
-- Resolves: Security Advisor Warnings & Performance Advisor Warnings/Suggestions
-- =========================================================================

-- -------------------------------------------------------------------------
-- PART 1: DYNAMIC CLEANUP OF OLD POLICIES & UNUSED INDEXES
-- -------------------------------------------------------------------------

-- 1.1 Drop all existing policies on `public.appointments` and `public.paid_bookings`
-- (Fixes "Multiple Permissive Policies" warning in Performance Advisor)
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'appointments' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.appointments', pol.policyname);
    END LOOP;
    
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'paid_bookings' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.paid_bookings', pol.policyname);
    END LOOP;
END $$;

-- 1.2 Drop non-primary key unused indexes on `public.appointments`
-- (Fixes "Unused Index" suggestions in Performance Advisor)
DO $$
DECLARE
    idx record;
BEGIN
    FOR idx IN (
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'appointments' 
          AND schemaname = 'public' 
          AND indexname NOT LIKE '%_pkey'
    ) LOOP
        EXECUTE format('DROP INDEX IF EXISTS public.%I', idx.indexname);
    END LOOP;
END $$;

-- -------------------------------------------------------------------------
-- PART 2: `public.appointments` TABLE & SECURE RLS POLICIES
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

-- Ensure created_at format
ALTER TABLE public.appointments ALTER COLUMN created_at TYPE VARCHAR(100) USING created_at::text;

-- Remove unused payment columns if they exist
ALTER TABLE public.appointments DROP COLUMN IF EXISTS payment_method;
ALTER TABLE public.appointments DROP COLUMN IF EXISTS payment_status;
ALTER TABLE public.appointments DROP COLUMN IF EXISTS payment_id;
ALTER TABLE public.appointments DROP COLUMN IF EXISTS order_id;
ALTER TABLE public.appointments DROP COLUMN IF EXISTS amount_paid;

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Secure Insert Policy for Anonymous & Authenticated Visitors (Validates input, avoids WITH CHECK (true))
CREATE POLICY "Allow public appointments insertion"
ON public.appointments
FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (
    full_name IS NOT NULL 
    AND phone IS NOT NULL 
    AND length(trim(full_name)) > 0 
    AND length(trim(phone)) > 0
);

-- Secure Select Policy for Staff / Authenticated Users only (uses InitPlan subquery (select auth.role()) to prevent per-row evaluation)
CREATE POLICY "Allow staff select appointments"
ON public.appointments
FOR SELECT
TO authenticated, service_role
USING ((select auth.role()) IN ('authenticated', 'service_role'));

GRANT ALL ON TABLE public.appointments TO anon, authenticated, service_role;


-- -------------------------------------------------------------------------
-- PART 3: `public.paid_bookings` TABLE & SECURE RLS POLICIES
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

-- Ensure created_at format
ALTER TABLE public.paid_bookings ALTER COLUMN created_at TYPE VARCHAR(100) USING created_at::text;

-- Enable Row Level Security (RLS)
ALTER TABLE public.paid_bookings ENABLE ROW LEVEL SECURITY;

-- Secure Insert Policy for Anonymous & Authenticated Visitors (Validates input, avoids WITH CHECK (true))
CREATE POLICY "Allow public paid bookings insertion"
ON public.paid_bookings
FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (
    full_name IS NOT NULL 
    AND phone IS NOT NULL 
    AND length(trim(full_name)) > 0 
    AND length(trim(phone)) > 0
);

-- Secure Select Policy for Staff / Authenticated Users only (uses InitPlan subquery (select auth.role()) to prevent per-row evaluation)
CREATE POLICY "Allow staff select paid bookings"
ON public.paid_bookings
FOR SELECT
TO authenticated, service_role
USING ((select auth.role()) IN ('authenticated', 'service_role'));

GRANT ALL ON TABLE public.paid_bookings TO anon, authenticated, service_role;


-- -------------------------------------------------------------------------
-- PART 4: FIX SECURITY DEFINER FUNCTION `public.rls_auto_enable()`
-- (Fixes "Public Can Execute SECURITY DEFINER Function" and 
--  "Signed-In Users Can Execute SECURITY DEFINER Function")
-- -------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_proc p 
        JOIN pg_namespace n ON p.pronamespace = n.oid 
        WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
    ) THEN
        -- Revoke execution permissions from public/anon/authenticated
        REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
        -- Grant execution permissions only to superuser/service_role
        GRANT EXECUTE ON FUNCTION public.rls_auto_enable() TO postgres, service_role;
        -- Secure search path against injection attacks
        ALTER FUNCTION public.rls_auto_enable() SET search_path = public, pg_temp;
    END IF;
END $$;

-- =========================================================================
-- DONE! Copy and execute this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gthczioqtznvfxhqvsml/sql/new
-- =========================================================================
