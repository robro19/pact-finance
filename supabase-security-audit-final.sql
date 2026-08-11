-- =========================================================
-- Pact Supabase security hardening
-- Run after supabase-enum-fix.sql succeeds.
-- This script does not delete tables, columns, or user data.
-- =========================================================

-- ---------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reporting_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landlord_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_notify ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- Grants
-- ---------------------------------------------------------

REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.leases FROM anon;
REVOKE ALL ON TABLE public.bank_connections FROM anon;
REVOKE ALL ON TABLE public.payment_records FROM anon;
REVOKE ALL ON TABLE public.reporting_status FROM anon;
REVOKE ALL ON TABLE public.landlord_invites FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.profiles
TO authenticated;

GRANT SELECT, INSERT, DELETE
ON TABLE public.leases
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.bank_connections
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.payment_records
TO authenticated;

GRANT SELECT
ON TABLE public.reporting_status
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.landlord_invites
TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.profiles
TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.leases
TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.bank_connections
TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.payment_records
TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.reporting_status
TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.landlord_invites
TO service_role;

REVOKE ALL ON TABLE public.waitlist_notify FROM anon;
REVOKE ALL ON TABLE public.waitlist_notify FROM authenticated;

GRANT INSERT
ON TABLE public.waitlist_notify
TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.waitlist_notify
TO service_role;

-- ---------------------------------------------------------
-- Remove known conflicting policies
-- ---------------------------------------------------------

DROP POLICY IF EXISTS profiles_select_policy ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_policy ON public.profiles;
DROP POLICY IF EXISTS profiles_update_policy ON public.profiles;
DROP POLICY IF EXISTS profiles_delete_policy ON public.profiles;
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
DROP POLICY IF EXISTS profiles_delete_own ON public.profiles;

DROP POLICY IF EXISTS leases_select_own ON public.leases;
DROP POLICY IF EXISTS leases_insert_own ON public.leases;
DROP POLICY IF EXISTS leases_update_own ON public.leases;
DROP POLICY IF EXISTS leases_delete_own ON public.leases;
DROP POLICY IF EXISTS leases_select_participant ON public.leases;
DROP POLICY IF EXISTS leases_insert_renter_owned ON public.leases;
DROP POLICY IF EXISTS leases_update_renter_owned ON public.leases;
DROP POLICY IF EXISTS leases_delete_renter_owned ON public.leases;
DROP POLICY IF EXISTS leases_update_valid_landlord_acceptance ON public.leases;

DROP POLICY IF EXISTS bank_connections_select_tenant ON public.bank_connections;
DROP POLICY IF EXISTS bank_connections_insert_tenant ON public.bank_connections;
DROP POLICY IF EXISTS bank_connections_update_tenant ON public.bank_connections;
DROP POLICY IF EXISTS bank_connections_delete_tenant ON public.bank_connections;
DROP POLICY IF EXISTS bank_connections_select_own ON public.bank_connections;
DROP POLICY IF EXISTS bank_connections_insert_own ON public.bank_connections;
DROP POLICY IF EXISTS bank_connections_update_own ON public.bank_connections;
DROP POLICY IF EXISTS bank_connections_delete_own ON public.bank_connections;

DROP POLICY IF EXISTS payment_records_select_lease_owner ON public.payment_records;
DROP POLICY IF EXISTS payment_records_insert_lease_owner ON public.payment_records;
DROP POLICY IF EXISTS payment_records_update_lease_owner ON public.payment_records;
DROP POLICY IF EXISTS payment_records_delete_lease_owner ON public.payment_records;
DROP POLICY IF EXISTS payment_records_select_lease_participant ON public.payment_records;
DROP POLICY IF EXISTS payment_records_insert_renter_owned ON public.payment_records;
DROP POLICY IF EXISTS payment_records_update_renter_owned ON public.payment_records;
DROP POLICY IF EXISTS payment_records_update_landlord_confirmation ON public.payment_records;
DROP POLICY IF EXISTS payment_records_delete_renter_owned ON public.payment_records;

DROP POLICY IF EXISTS reporting_status_select ON public.reporting_status;
DROP POLICY IF EXISTS reporting_status_select_participant ON public.reporting_status;
DROP POLICY IF EXISTS reporting_status_insert_service_role ON public.reporting_status;
DROP POLICY IF EXISTS reporting_status_update_service_role ON public.reporting_status;
DROP POLICY IF EXISTS reporting_status_delete_service_role ON public.reporting_status;

DROP POLICY IF EXISTS landlord_invites_select ON public.landlord_invites;
DROP POLICY IF EXISTS landlord_invites_insert ON public.landlord_invites;
DROP POLICY IF EXISTS landlord_invites_update ON public.landlord_invites;
DROP POLICY IF EXISTS landlord_invites_delete ON public.landlord_invites;
DROP POLICY IF EXISTS landlord_invites_select_renter_or_matching_landlord ON public.landlord_invites;
DROP POLICY IF EXISTS landlord_invites_insert_renter_owned ON public.landlord_invites;
DROP POLICY IF EXISTS landlord_invites_update_renter_or_matching_landlord ON public.landlord_invites;
DROP POLICY IF EXISTS landlord_invites_delete_renter_owned ON public.landlord_invites;

DROP POLICY IF EXISTS waitlist_notify_insert_anon ON public.waitlist_notify;
DROP POLICY IF EXISTS waitlist_notify_public_insert ON public.waitlist_notify;

-- ---------------------------------------------------------
-- Profiles: users can access only their own profile
-- ---------------------------------------------------------

CREATE POLICY profiles_select_own
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY profiles_insert_own
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

CREATE POLICY profiles_update_own
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY profiles_delete_own
ON public.profiles
FOR DELETE
TO authenticated
USING (id = auth.uid());

-- ---------------------------------------------------------
-- Leases
-- Direct lease updates are intentionally disabled for clients.
-- Landlords must use the secure invitation RPC below.
-- ---------------------------------------------------------

CREATE POLICY leases_select_participant
ON public.leases
FOR SELECT
TO authenticated
USING (
  tenant_id = auth.uid()
  OR landlord_id = auth.uid()
);

CREATE POLICY leases_insert_renter_owned
ON public.leases
FOR INSERT
TO authenticated
WITH CHECK (
  tenant_id = auth.uid()
  AND landlord_id IS NULL
);

CREATE POLICY leases_delete_renter_owned
ON public.leases
FOR DELETE
TO authenticated
USING (tenant_id = auth.uid());

-- ---------------------------------------------------------
-- Bank connections: tenant only
-- ---------------------------------------------------------

CREATE POLICY bank_connections_select_own
ON public.bank_connections
FOR SELECT
TO authenticated
USING (tenant_id = auth.uid());

CREATE POLICY bank_connections_insert_own
ON public.bank_connections
FOR INSERT
TO authenticated
WITH CHECK (tenant_id = auth.uid());

CREATE POLICY bank_connections_update_own
ON public.bank_connections
FOR UPDATE
TO authenticated
USING (tenant_id = auth.uid())
WITH CHECK (tenant_id = auth.uid());

CREATE POLICY bank_connections_delete_own
ON public.bank_connections
FOR DELETE
TO authenticated
USING (tenant_id = auth.uid());

-- ---------------------------------------------------------
-- Payment records
-- ---------------------------------------------------------

CREATE POLICY payment_records_select_lease_participant
ON public.payment_records
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.leases AS l
    WHERE l.id = payment_records.lease_id
      AND (
        l.tenant_id = auth.uid()
        OR l.landlord_id = auth.uid()
      )
  )
);

CREATE POLICY payment_records_insert_renter_owned
ON public.payment_records
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.leases AS l
    WHERE l.id = payment_records.lease_id
      AND l.tenant_id = auth.uid()
  )
);

CREATE POLICY payment_records_update_renter_owned
ON public.payment_records
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.leases AS l
    WHERE l.id = payment_records.lease_id
      AND l.tenant_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.leases AS l
    WHERE l.id = payment_records.lease_id
      AND l.tenant_id = auth.uid()
  )
);

CREATE POLICY payment_records_update_landlord_confirmation
ON public.payment_records
FOR UPDATE
TO authenticated
USING (
  payment_records.verification_method::text = 'landlord'
  AND EXISTS (
    SELECT 1
    FROM public.leases AS l
    WHERE l.id = payment_records.lease_id
      AND l.landlord_id = auth.uid()
  )
)
WITH CHECK (
  payment_records.verification_method::text = 'landlord'
  AND EXISTS (
    SELECT 1
    FROM public.leases AS l
    WHERE l.id = payment_records.lease_id
      AND l.landlord_id = auth.uid()
  )
);

CREATE POLICY payment_records_delete_renter_owned
ON public.payment_records
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.leases AS l
    WHERE l.id = payment_records.lease_id
      AND l.tenant_id = auth.uid()
  )
);

-- ---------------------------------------------------------
-- Protect landlords from changing payment details
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.prevent_unsafe_landlord_payment_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  landlord_owns_lease boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM public.leases AS l
    WHERE l.id = OLD.lease_id
      AND l.landlord_id = auth.uid()
      AND l.tenant_id <> auth.uid()
  )
  INTO landlord_owns_lease;

  IF landlord_owns_lease THEN
    IF NEW.id IS DISTINCT FROM OLD.id
      OR NEW.lease_id IS DISTINCT FROM OLD.lease_id
      OR NEW.month IS DISTINCT FROM OLD.month
      OR NEW.verification_method::text IS DISTINCT FROM OLD.verification_method::text
      OR NEW.amount IS DISTINCT FROM OLD.amount
      OR NEW.proof_url IS DISTINCT FROM OLD.proof_url
      OR NEW.created_at IS DISTINCT FROM OLD.created_at
      OR NEW.status::text NOT IN ('verified', OLD.status::text) THEN
      RAISE EXCEPTION 'Landlords may only confirm the payment status';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_unsafe_landlord_payment_update
ON public.payment_records;

CREATE TRIGGER prevent_unsafe_landlord_payment_update
BEFORE UPDATE ON public.payment_records
FOR EACH ROW
EXECUTE FUNCTION public.prevent_unsafe_landlord_payment_update();

-- ---------------------------------------------------------
-- Reporting status: authenticated users can read only
-- ---------------------------------------------------------

CREATE POLICY reporting_status_select_participant
ON public.reporting_status
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.payment_records AS pr
    JOIN public.leases AS l
      ON l.id = pr.lease_id
    WHERE pr.id = reporting_status.payment_record_id
      AND (
        l.tenant_id = auth.uid()
        OR l.landlord_id = auth.uid()
      )
  )
);

-- No authenticated INSERT, UPDATE, or DELETE policies are added.

-- ---------------------------------------------------------
-- Landlord invitations
-- ---------------------------------------------------------

CREATE POLICY landlord_invites_select_renter_or_matching_landlord
ON public.landlord_invites
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.leases AS l
    WHERE l.id = landlord_invites.lease_id
      AND l.tenant_id = auth.uid()
  )
  OR lower(landlord_invites.invited_email)
     = lower(coalesce(auth.jwt() ->> 'email', ''))
);

CREATE POLICY landlord_invites_insert_renter_owned
ON public.landlord_invites
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.leases AS l
    WHERE l.id = landlord_invites.lease_id
      AND l.tenant_id = auth.uid()
  )
);

CREATE POLICY landlord_invites_delete_renter_owned
ON public.landlord_invites
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.leases AS l
    WHERE l.id = landlord_invites.lease_id
      AND l.tenant_id = auth.uid()
  )
);

-- ---------------------------------------------------------
-- Secure landlord invitation acceptance
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.accept_landlord_invite(invite_id uuid)
RETURNS public.leases
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  current_email text;
  invite_row public.landlord_invites;
  updated_lease public.leases;
BEGIN
  current_user_id := auth.uid();
  current_email := lower(coalesce(auth.jwt() ->> 'email', ''));

  IF current_user_id IS NULL OR current_email = '' THEN
    RAISE EXCEPTION 'Authentication is required';
  END IF;

  SELECT *
  INTO invite_row
  FROM public.landlord_invites
  WHERE id = invite_id
    AND status::text = 'pending'
    AND lower(invited_email) = current_email
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invitation not found or no longer available';
  END IF;

  UPDATE public.leases
  SET landlord_id = current_user_id
  WHERE id = invite_row.lease_id
    AND landlord_id IS NULL
  RETURNING *
  INTO updated_lease;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'This lease is already connected to a landlord';
  END IF;

  UPDATE public.landlord_invites
  SET status = 'accepted'
  WHERE id = invite_row.id;

  RETURN updated_lease;
END;
$$;

REVOKE ALL
ON FUNCTION public.accept_landlord_invite(uuid)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.accept_landlord_invite(uuid)
TO authenticated;

-- ---------------------------------------------------------
-- Waitlist
-- ---------------------------------------------------------

CREATE POLICY waitlist_notify_public_insert
ON public.waitlist_notify
FOR INSERT
TO anon
WITH CHECK (
  length(trim(email)) BETWEEN 5 AND 320
  AND position('@' IN email) > 1
  AND city IS NOT NULL
);

-- ---------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------

CREATE INDEX IF NOT EXISTS leases_tenant_id_idx
ON public.leases (tenant_id);

CREATE INDEX IF NOT EXISTS leases_landlord_id_idx
ON public.leases (landlord_id);

CREATE INDEX IF NOT EXISTS bank_connections_tenant_id_idx
ON public.bank_connections (tenant_id);

CREATE INDEX IF NOT EXISTS payment_records_lease_id_idx
ON public.payment_records (lease_id);

CREATE INDEX IF NOT EXISTS reporting_status_payment_record_id_idx
ON public.reporting_status (payment_record_id);

CREATE INDEX IF NOT EXISTS landlord_invites_lease_id_idx
ON public.landlord_invites (lease_id);

CREATE INDEX IF NOT EXISTS landlord_invites_invited_email_lower_idx
ON public.landlord_invites (lower(invited_email));

-- ---------------------------------------------------------
-- Audit output
-- ---------------------------------------------------------

SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'profiles',
    'leases',
    'bank_connections',
    'payment_records',
    'reporting_status',
    'landlord_invites',
    'waitlist_notify'
  )
ORDER BY tablename;

SELECT
  n.nspname AS schema_name,
  t.typname AS enum_name,
  e.enumlabel AS enum_value
FROM pg_type AS t
JOIN pg_enum AS e ON e.enumtypid = t.oid
JOIN pg_namespace AS n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
  AND t.typname IN (
    'verification_method',
    'payment_status',
    'invite_status'
  )
ORDER BY t.typname, e.enumsortorder;