-- =========================================================================
-- SS DENTAL CARE (DAVANGERE) — MASTER SUPABASE DATABASE SCHEMA
-- Migration: 01_create_core_tables.sql
-- Database: PostgreSQL 15+ (Supabase)
-- Timezone Strategy: UTC for all storage, Asia/Kolkata for business queries
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------------------------
-- 1. APPOINTMENTS TABLE (Primary Source of Truth)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255),
    patient_phone VARCHAR(50) NOT NULL,
    treatment VARCHAR(255) NOT NULL DEFAULT 'General Dental Consultation',
    doctor_name VARCHAR(100) DEFAULT 'Dr. Naveen / Dr. Sunitha',
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(50) NOT NULL,
    appointment_status VARCHAR(50) NOT NULL DEFAULT 'pending' 
        CHECK (appointment_status IN ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'expired')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Visit to pay'
        CHECK (payment_method IN ('Visit to pay', 'Razorpay', 'Online Form Inquiry', 'UPI', 'Cash')),
    amount NUMERIC(10, 2) NOT NULL DEFAULT 250.00 CHECK (amount >= 0),
    notes TEXT,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    idempotency_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Indexing for appointment lookup and performance
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON public.appointments(appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(appointment_status, payment_status);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_phone ON public.appointments(patient_phone);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_email ON public.appointments(patient_email);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON public.appointments(created_at DESC);

-- Slot Collision Guard: Normalized unique index preventing double-booking active slots
-- Cancelled and expired slots are freed for new bookings
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_appointment_slot 
ON public.appointments(lower(trim(doctor_name)), appointment_date, lower(trim(appointment_time))) 
WHERE appointment_status NOT IN ('cancelled', 'expired');

-- -------------------------------------------------------------------------
-- 2. NOTIFICATION OUTBOX TABLE (Transactional & Reliable Delivery)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    recipient_type VARCHAR(50) NOT NULL CHECK (recipient_type IN ('patient', 'clinic', 'doctor')),
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN (
        'booking_received',
        'doctor_alert',
        'confirmation',
        'rescheduled',
        'cancelled',
        'reminder_24h',
        'reminder_2h'
    )),
    provider VARCHAR(50) NOT NULL DEFAULT 'brevo',
    provider_message_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
    attempts INT NOT NULL DEFAULT 0,
    next_retry_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    last_error TEXT,
    deduplication_key VARCHAR(255) UNIQUE NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    sent_at TIMESTAMPTZ
);

-- Index for background worker queue polling
CREATE INDEX IF NOT EXISTS idx_outbox_queue_drain 
ON public.notification_outbox(status, next_retry_at) 
WHERE status IN ('pending', 'processing');

CREATE INDEX IF NOT EXISTS idx_outbox_appointment_id 
ON public.notification_outbox(appointment_id);

-- -------------------------------------------------------------------------
-- 3. NOTIFICATION EVENTS TABLE (Audit Trail & Telemetry)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notification_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outbox_id UUID REFERENCES public.notification_outbox(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('attempt', 'sent', 'failed', 'retry')),
    provider VARCHAR(50) NOT NULL DEFAULT 'brevo',
    response_payload JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_notification_events_outbox_id 
ON public.notification_events(outbox_id);

-- -------------------------------------------------------------------------
-- 4. ATOMIC OUTBOX CLAIMING FUNCTION (Concurrency Safe via FOR UPDATE SKIP LOCKED)
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_notification_outbox(
    p_worker_id TEXT,
    p_batch_size INT DEFAULT 10
)
RETURNS SETOF public.notification_outbox AS $$
BEGIN
    RETURN QUERY
    WITH claimable AS (
        SELECT id
        FROM public.notification_outbox
        WHERE (
            status = 'pending' 
            OR (status = 'processing' AND updated_at < timezone('utc', now()) - INTERVAL '5 minutes')
        )
        AND next_retry_at <= timezone('utc', now())
        AND attempts < 5
        ORDER BY created_at ASC
        FOR UPDATE SKIP LOCKED
        LIMIT p_batch_size
    )
    UPDATE public.notification_outbox o
    SET 
        status = 'processing',
        updated_at = timezone('utc', now()),
        metadata = jsonb_set(COALESCE(o.metadata, '{}'::jsonb), '{claimed_by}', to_jsonb(p_worker_id))
    FROM claimable c
    WHERE o.id = c.id
    RETURNING o.*;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------------------------
-- 5. ABANDONED PENDING BOOKING EXPIRATION FUNCTION
-- -------------------------------------------------------------------------
-- Releases slots for unpaid Razorpay checkouts abandoned > 60 minutes ago
CREATE OR REPLACE FUNCTION public.expire_stale_pending_bookings(p_timeout_minutes INT DEFAULT 60)
RETURNS INT AS $$
DECLARE
    v_expired_count INT;
BEGIN
    UPDATE public.appointments
    SET 
        appointment_status = 'expired',
        updated_at = timezone('utc', now()),
        notes = COALESCE(notes || ' | ', '') || 'Auto-expired due to abandoned checkout'
    WHERE appointment_status = 'pending'
      AND payment_status = 'pending'
      AND payment_method = 'Razorpay'
      AND created_at < timezone('utc', now()) - (p_timeout_minutes || ' minutes')::interval;

    GET DIAGNOSTICS v_expired_count = ROW_COUNT;
    RETURN v_expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -------------------------------------------------------------------------
-- 6. BACKWARD-COMPATIBILITY VIEW: paid_bookings
-- -------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.paid_bookings AS
SELECT 
    id,
    idempotency_key,
    created_at,
    patient_name AS full_name,
    patient_email AS email,
    patient_phone AS phone,
    'Karnataka'::VARCHAR(100) AS state,
    appointment_date::VARCHAR(50),
    appointment_time,
    payment_method,
    payment_status,
    razorpay_payment_id AS payment_id,
    razorpay_order_id AS order_id,
    amount AS amount_paid
FROM public.appointments
WHERE payment_method = 'Razorpay' OR payment_status = 'paid';

-- -------------------------------------------------------------------------
-- 7. AUTOMATED TRIGGER: update_updated_at_column
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_appointments_updated_at ON public.appointments;
CREATE TRIGGER set_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_notification_outbox_updated_at ON public.notification_outbox;
CREATE TRIGGER set_notification_outbox_updated_at
BEFORE UPDATE ON public.notification_outbox
FOR EACH ROW
EXECUTE FUNCTION public.trigger_set_updated_at();

-- -------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_events ENABLE ROW LEVEL SECURITY;

-- Clean existing policies
DROP POLICY IF EXISTS "Public web visitors can insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "Service role has full access to appointments" ON public.appointments;
DROP POLICY IF EXISTS "Service role has full access to outbox" ON public.notification_outbox;
DROP POLICY IF EXISTS "Service role has full access to events" ON public.notification_events;

-- POLICY 1: Public web visitors can INSERT new appointments (STRICT SECURITY VALIDATION)
CREATE POLICY "Public web visitors can insert appointments"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (
    patient_name IS NOT NULL AND length(trim(patient_name)) >= 2 AND
    patient_phone IS NOT NULL AND length(trim(patient_phone)) >= 7 AND
    appointment_date IS NOT NULL AND
    appointment_time IS NOT NULL AND
    payment_status = 'pending' AND
    appointment_status = 'pending'
);

-- POLICY 2: Backend server (service_role) has full privileges on appointments
CREATE POLICY "Service role has full access to appointments"
ON public.appointments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- POLICY 3 & 4: Outbox and audit logs are strictly service_role accessible
CREATE POLICY "Service role has full access to outbox"
ON public.notification_outbox
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role has full access to events"
ON public.notification_events
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Security: Revoke public SELECT on patient data
REVOKE SELECT ON TABLE public.appointments FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.notification_outbox FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLE public.notification_events FROM anon;

GRANT INSERT ON TABLE public.appointments TO anon, authenticated;
GRANT ALL ON TABLE public.appointments TO service_role;
GRANT ALL ON TABLE public.notification_outbox TO service_role;
GRANT ALL ON TABLE public.notification_events TO service_role;
