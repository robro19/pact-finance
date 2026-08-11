begin;

-- =========================================================
-- 1. Enable RLS
-- =========================================================

alter table public.profiles enable row level security;
alter table public.leases enable row level security;
alter table public.bank_connections enable row level security;
alter table public.payment_records enable row level security;
alter table public.reporting_status enable row level security;
alter table public.landlord_invites enable row level security;
alter table public.waitlist_notify enable row level security;

-- =========================================================
-- 2. Grants
-- =========================================================

revoke all on table public.profiles from anon;
revoke all on table public.leases from anon;
revoke all on table public.bank_connections from anon;
revoke all on table public.payment_records from anon;
revoke all on table public.reporting_status from anon;
revoke all on table public.landlord_invites from anon;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.leases to authenticated;
grant select, insert, update, delete on table public.bank_connections to authenticated;
grant select, insert, update, delete on table public.payment_records to authenticated;
grant select on table public.reporting_status to authenticated;
grant select, insert, update, delete on table public.landlord_invites to authenticated;

grant select, insert, update, delete on table public.profiles to service_role;
grant select, insert, update, delete on table public.leases to service_role;
grant select, insert, update, delete on table public.bank_connections to service_role;
grant select, insert, update, delete on table public.payment_records to service_role;
grant select, insert, update, delete on table public.reporting_status to service_role;
grant select, insert, update, delete on table public.landlord_invites to service_role;

-- Keep this table public only for the waitlist insert flow.
revoke all on table public.waitlist_notify from authenticated;
revoke all on table public.waitlist_notify from anon;
grant insert on table public.waitlist_notify to anon;
grant select, insert, update, delete on table public.waitlist_notify to service_role;

-- =========================================================
-- 3. Remove conflicting policies
-- =========================================================

drop policy if exists profiles_select_policy on public.profiles;
drop policy if exists profiles_insert_policy on public.profiles;
drop policy if exists profiles_update_policy on public.profiles;
drop policy if exists profiles_delete_policy on public.profiles;

drop policy if exists leases_select_own on public.leases;
drop policy if exists leases_insert_own on public.leases;
drop policy if exists leases_update_own on public.leases;
drop policy if exists leases_delete_own on public.leases;

drop policy if exists bank_connections_select_tenant on public.bank_connections;
drop policy if exists bank_connections_insert_tenant on public.bank_connections;
drop policy if exists bank_connections_update_tenant on public.bank_connections;
drop policy if exists bank_connections_delete_tenant on public.bank_connections;

drop policy if exists payment_records_select_lease_owner on public.payment_records;
drop policy if exists payment_records_insert_lease_owner on public.payment_records;
drop policy if exists payment_records_update_lease_owner on public.payment_records;
drop policy if exists payment_records_delete_lease_owner on public.payment_records;

drop policy if exists reporting_status_select on public.reporting_status;
drop policy if exists reporting_status_insert_service_role on public.reporting_status;
drop policy if exists reporting_status_update_service_role on public.reporting_status;
drop policy if exists reporting_status_delete_service_role on public.reporting_status;

drop policy if exists landlord_invites_select on public.landlord_invites;
drop policy if exists landlord_invites_insert on public.landlord_invites;
drop policy if exists landlord_invites_update on public.landlord_invites;
drop policy if exists landlord_invites_delete on public.landlord_invites;

drop policy if exists waitlist_notify_insert_anon on public.waitlist_notify;

-- =========================================================
-- 4. Profiles policies
-- =========================================================

create policy profiles_select_own
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy profiles_delete_own
on public.profiles
for delete
to authenticated
using (id = auth.uid());

-- =========================================================
-- 5. Lease policies
-- =========================================================

create policy leases_select_participant
on public.leases
for select
to authenticated
using (
  tenant_id = auth.uid()
  or landlord_id = auth.uid()
);

create policy leases_insert_renter_owned
on public.leases
for insert
to authenticated
with check (
  tenant_id = auth.uid()
  and landlord_id is null
);

create policy leases_update_renter_owned
on public.leases
for update
to authenticated
using (tenant_id = auth.uid())
with check (
  tenant_id = auth.uid()
  and landlord_id is not distinct from landlord_id
);

create policy leases_update_valid_landlord_acceptance
on public.leases
for update
to authenticated
using (
  exists (
    select 1
    from public.landlord_invites li
    where li.lease_id = leases.id
      and li.status = 'pending'
      and lower(li.invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
)
with check (
  landlord_id = auth.uid()
  and tenant_id is not null
);

create policy leases_delete_renter_owned
on public.leases
for delete
to authenticated
using (tenant_id = auth.uid());

-- =========================================================
-- 6. Bank connection policies
-- =========================================================

create policy bank_connections_select_own
on public.bank_connections
for select
to authenticated
using (tenant_id = auth.uid());

create policy bank_connections_insert_own
on public.bank_connections
for insert
to authenticated
with check (tenant_id = auth.uid());

create policy bank_connections_update_own
on public.bank_connections
for update
to authenticated
using (tenant_id = auth.uid())
with check (tenant_id = auth.uid());

create policy bank_connections_delete_own
on public.bank_connections
for delete
to authenticated
using (tenant_id = auth.uid());

-- =========================================================
-- 7. Payment policies
-- =========================================================

create policy payment_records_select_lease_participant
on public.payment_records
for select
to authenticated
using (
  exists (
    select 1
    from public.leases l
    where l.id = payment_records.lease_id
      and (
        l.tenant_id = auth.uid()
        or l.landlord_id = auth.uid()
      )
  )
);

create policy payment_records_insert_renter_owned
on public.payment_records
for insert
to authenticated
with check (
  exists (
    select 1
    from public.leases l
    where l.id = payment_records.lease_id
      and l.tenant_id = auth.uid()
  )
);

create policy payment_records_update_renter_owned
on public.payment_records
for update
to authenticated
using (
  exists (
    select 1
    from public.leases l
    where l.id = payment_records.lease_id
      and l.tenant_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.leases l
    where l.id = payment_records.lease_id
      and l.tenant_id = auth.uid()
  )
);

create policy payment_records_update_landlord_confirmation
on public.payment_records
for update
to authenticated
using (
  verification_method = 'landlord'
  and exists (
    select 1
    from public.leases l
    where l.id = payment_records.lease_id
      and l.landlord_id = auth.uid()
  )
)
with check (
  verification_method = 'landlord'
  and exists (
    select 1
    from public.leases l
    where l.id = payment_records.lease_id
      and l.landlord_id = auth.uid()
  )
);

create policy payment_records_delete_renter_owned
on public.payment_records
for delete
to authenticated
using (
  exists (
    select 1
    from public.leases l
    where l.id = payment_records.lease_id
      and l.tenant_id = auth.uid()
  )
);

-- =========================================================
-- 8. Prevent landlords from modifying private payment fields
-- =========================================================

create or replace function public.prevent_unsafe_landlord_payment_update()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
declare
  is_landlord boolean;
begin
  select exists (
    select 1
    from public.leases l
    where l.id = old.lease_id
      and l.landlord_id = auth.uid()
      and l.tenant_id <> auth.uid()
  )
  into is_landlord;

  if is_landlord then
    if new.id is distinct from old.id
      or new.lease_id is distinct from old.lease_id
      or new.month is distinct from old.month
      or new.verification_method is distinct from old.verification_method
      or new.amount is distinct from old.amount
      or new.proof_url is distinct from old.proof_url
      or new.created_at is distinct from old.created_at
      or new.status not in ('verified', old.status) then
      raise exception 'Landlords may only confirm landlord verification payments';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_unsafe_landlord_payment_update
on public.payment_records;

create trigger prevent_unsafe_landlord_payment_update
before update on public.payment_records
for each row
execute function public.prevent_unsafe_landlord_payment_update();

-- =========================================================
-- 9. Reporting status policies
-- =========================================================

create policy reporting_status_select_participant
on public.reporting_status
for select
to authenticated
using (
  exists (
    select 1
    from public.payment_records pr
    join public.leases l on l.id = pr.lease_id
    where pr.id = reporting_status.payment_record_id
      and (
        l.tenant_id = auth.uid()
        or l.landlord_id = auth.uid()
      )
  )
);

-- No authenticated INSERT, UPDATE, or DELETE policies are created.
-- Trusted service_role code remains able to write.

-- =========================================================
-- 10. Landlord invitation policies
-- =========================================================

create policy landlord_invites_select_renter_or_matching_landlord
on public.landlord_invites
for select
to authenticated
using (
  exists (
    select 1
    from public.leases l
    where l.id = landlord_invites.lease_id
      and l.tenant_id = auth.uid()
  )
  or lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

create policy landlord_invites_insert_renter_owned
on public.landlord_invites
for insert
to authenticated
with check (
  exists (
    select 1
    from public.leases l
    where l.id = landlord_invites.lease_id
      and l.tenant_id = auth.uid()
  )
);

create policy landlord_invites_update_renter_or_matching_landlord
on public.landlord_invites
for update
to authenticated
using (
  exists (
    select 1
    from public.leases l
    where l.id = landlord_invites.lease_id
      and l.tenant_id = auth.uid()
  )
  or (
    lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and status = 'pending'
  )
)
with check (
  exists (
    select 1
    from public.leases l
    where l.id = landlord_invites.lease_id
      and l.tenant_id = auth.uid()
  )
  or (
    lower(invited_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    and status in ('pending', 'accepted')
  )
);

create policy landlord_invites_delete_renter_owned
on public.landlord_invites
for delete
to authenticated
using (
  exists (
    select 1
    from public.leases l
    where l.id = landlord_invites.lease_id
      and l.tenant_id = auth.uid()
  )
);

-- =========================================================
-- 11. Waitlist policy
-- =========================================================

create policy waitlist_notify_public_insert
on public.waitlist_notify
for insert
to anon
with check (
  length(trim(email)) between 5 and 320
  and position('@' in email) > 1
  and city is not null
);

-- =========================================================
-- 12. Supporting indexes
-- =========================================================

create index if not exists leases_tenant_id_idx
on public.leases (tenant_id);

create index if not exists leases_landlord_id_idx
on public.leases (landlord_id);

create index if not exists bank_connections_tenant_id_idx
on public.bank_connections (tenant_id);

create index if not exists payment_records_lease_id_idx
on public.payment_records (lease_id);

create index if not exists reporting_status_payment_record_id_idx
on public.reporting_status (payment_record_id);

create index if not exists landlord_invites_lease_id_idx
on public.landlord_invites (lease_id);

create index if not exists landlord_invites_invited_email_lower_idx
on public.landlord_invites (lower(invited_email));

commit;