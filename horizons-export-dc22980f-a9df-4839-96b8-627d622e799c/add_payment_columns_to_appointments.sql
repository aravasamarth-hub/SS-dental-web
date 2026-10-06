-- ===========================================================================
-- OPTIONAL MIGRATION: Add payment_method and payment_status to appointments
-- Project: SS DENTAL CARE
-- Run in Supabase Dashboard -> SQL Editor (if you wish to see these columns in appointments)
-- ===========================================================================

ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'Visit to pay';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
