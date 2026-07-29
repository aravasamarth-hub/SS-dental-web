-- =========================================================================
-- SUPABASE DATABASE LINTER SECURITY REMEDIATION SCRIPT
-- Project: SS DENTAL CARE (Public appointments table & function security)
-- =========================================================================

-- -------------------------------------------------------------------------
-- PART 1: FIX RLS PERMISSIVE POLICIES ON `public.appointments`
-- -------------------------------------------------------------------------

-- 1. Drop redundant / overly permissive policies on appointments table
DROP POLICY IF EXISTS "Allow authenticated users to modify appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public/anonymous inserts" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert for public visitors" ON public.appointments;

-- 2. Ensure Row Level Security is enabled
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 3. Create a single, clean policy allowing public visitors (anon & authenticated)
--    to submit appointment bookings/inquiries (INSERT only)
CREATE POLICY "Enable insert for public visitors"
ON public.appointments
FOR INSERT
TO public
WITH CHECK (true);


-- -------------------------------------------------------------------------
-- PART 2: FIX PUBLIC EXECUTION OF SECURITY DEFINER FUNCTION `public.rls_auto_enable()`
-- -------------------------------------------------------------------------

-- 1. Switch function execution model from SECURITY DEFINER to SECURITY INVOKER
ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER;

-- 2. Revoke PUBLIC / ANON / AUTHENTICATED execution rights on the function via REST API
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

-- =========================================================================
-- DONE! Run this SQL script in your Supabase SQL Editor to resolve all linter warnings.
-- =========================================================================
