-- =========================================================================
-- SS DENTAL CARE — SAFE MIGRATION & REPAIR SCRIPT FOR EXISTING DATA
-- Migration: 02_safe_data_migration_from_legacy.sql
-- Purpose: Safely converts legacy VARCHAR created_at columns to TIMESTAMPTZ,
--          preserves valid historical values, handles legacy date formats,
--          and merges legacy paid_bookings data into unified appointments.
-- =========================================================================

DO $$
BEGIN
    -- 1. If old VARCHAR created_at column exists in appointments, convert safely to TIMESTAMPTZ
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'appointments' 
          AND column_name = 'created_at' 
          AND data_type = 'character varying'
    ) THEN
        RAISE NOTICE 'Converting appointments.created_at from VARCHAR to TIMESTAMPTZ...';
        
        -- Temporary conversion column
        ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS created_at_tz TIMESTAMPTZ;
        
        -- Update using best-effort parsing with fallback to now() for unparseable entries
        UPDATE public.appointments
        SET created_at_tz = CASE 
            WHEN created_at IS NULL THEN timezone('utc', now())
            -- ISO format or YYYY-MM-DD
            WHEN created_at ~ '^\d{4}-\d{2}-\d{2}' THEN created_at::timestamptz
            -- DD/MM/YYYY format
            WHEN created_at ~ '^\d{2}/\d{2}/\d{4}' THEN 
                to_timestamp(created_at, 'DD/MM/YYYY, HH12:MI:SS AM')
            ELSE timezone('utc', now())
        END;
        
        ALTER TABLE public.appointments DROP COLUMN created_at;
        ALTER TABLE public.appointments RENAME COLUMN created_at_tz TO created_at;
        ALTER TABLE public.appointments ALTER COLUMN created_at SET DEFAULT timezone('utc', now());
        ALTER TABLE public.appointments ALTER COLUMN created_at SET NOT NULL;
    END IF;

    -- 2. Consolidate any records from legacy standalone paid_bookings table into appointments
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name = 'paid_bookings' 
          AND table_type = 'BASE TABLE'
    ) THEN
        RAISE NOTICE 'Merging legacy paid_bookings into unified appointments table...';

        INSERT INTO public.appointments (
            patient_name,
            patient_email,
            patient_phone,
            treatment,
            doctor_name,
            appointment_date,
            appointment_time,
            appointment_status,
            payment_status,
            payment_method,
            amount,
            razorpay_order_id,
            razorpay_payment_id,
            idempotency_key,
            created_at
        )
        SELECT 
            pb.full_name,
            COALESCE(pb.email, ''),
            pb.phone,
            'General Dental Consultation / Online Treatment Deposit',
            'Dr. Naveen / Dr. Sunitha',
            COALESCE(
                CASE 
                    WHEN pb.appointment_date ~ '^\d{4}-\d{2}-\d{2}' THEN pb.appointment_date::date
                    ELSE CURRENT_DATE
                END, 
                CURRENT_DATE
            ),
            COALESCE(pb.appointment_time, 'General Consult'),
            'confirmed',
            'paid',
            'Razorpay',
            COALESCE(pb.amount_paid, 250.00),
            pb.order_id,
            pb.payment_id,
            pb.idempotency_key,
            timezone('utc', now())
        FROM public.paid_bookings pb
        WHERE pb.idempotency_key IS NOT NULL 
          AND NOT EXISTS (
              SELECT 1 FROM public.appointments a 
              WHERE a.idempotency_key = pb.idempotency_key
          );

        -- Rename base table to preserve backup, view will replace it
        ALTER TABLE public.paid_bookings RENAME TO legacy_paid_bookings_backup;
    END IF;
END $$;

