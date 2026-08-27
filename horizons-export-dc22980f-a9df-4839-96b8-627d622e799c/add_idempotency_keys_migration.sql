-- ===========================================================================
-- HOTFIX: Restore anon INSERT + Correct SELECT RLS
-- Project: SS DENTAL CARE (gthczioqtznvfxhqvslm)
-- Run in Supabase Dashboard -> SQL Editor
-- ===========================================================================

-- =====================================================
-- APPOINTMENTS
-- =====================================================

-- Drop all existing policies cleanly
DROP POLICY IF EXISTS "Allow public appointments insertion" ON public.appointments;
DROP POLICY IF EXISTS "Allow public appointments select"   ON public.appointments;
DROP POLICY IF EXISTS "Allow staff select appointments"    ON public.appointments;
DROP POLICY IF EXISTS "Allow service role appointments all" ON public.appointments;

-- Re-create INSERT: anon web visitors can book appointments
CREATE POLICY "Allow public appointments insertion"
ON public.appointments FOR INSERT TO anon, authenticated, service_role
WITH CHECK (full_name IS NOT NULL AND phone IS NOT NULL);

-- SELECT: service_role only (backend watcher + staff dashboard only)
-- anon key is embedded in the JS bundle — never allow anon to enumerate patient rows
CREATE POLICY "Allow staff select appointments"
ON public.appointments FOR SELECT TO service_role
USING (true);

-- Ensure grants are in place
GRANT SELECT, INSERT ON TABLE public.appointments TO anon, authenticated, service_role;


-- =====================================================
-- PAID_BOOKINGS
-- =====================================================

DROP POLICY IF EXISTS "Allow public paid bookings insertion" ON public.paid_bookings;
DROP POLICY IF EXISTS "Allow public paid bookings select"    ON public.paid_bookings;
DROP POLICY IF EXISTS "Allow staff select paid bookings"     ON public.paid_bookings;
DROP POLICY IF EXISTS "Allow service role paid bookings all" ON public.paid_bookings;

-- INSERT: anon web visitors can create paid bookings (Razorpay flow)
CREATE POLICY "Allow public paid bookings insertion"
ON public.paid_bookings FOR INSERT TO anon, authenticated, service_role
WITH CHECK (full_name IS NOT NULL AND phone IS NOT NULL);

-- SELECT: service_role only
CREATE POLICY "Allow staff select paid bookings"
ON public.paid_bookings FOR SELECT TO service_role
USING (true);

GRANT SELECT, INSERT ON TABLE public.paid_bookings TO anon, authenticated, service_role;


-- =====================================================
-- VERIFY — paste output back
-- =====================================================
SELECT
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('appointments', 'paid_bookings')
ORDER BY tablename, cmd;
