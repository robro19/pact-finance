"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Handshake, Loader2, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand-logo";
import { supabase } from "@/integrations/supabase/client";

type Invite = {
  id: string;
  lease_id: string;
  invited_email: string;
  status: string;
};

type Lease = {
  id: string;
  address: string;
  monthly_rent_amount: number;
  start_date: string;
};

type Payment = {
  id: string;
  lease_id: string;
  month: string;
  amount: number | null;
  status: string;
  verification_method: string;
};

export function LandlordDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState("");

  const loadData = useCallback(async (landlordId: string, landlordEmail: string) => {
    const [{ data: inviteData, error: inviteError }, { data: leaseData, error: leaseError }] =
      await Promise.all([
        supabase
          .from("landlord_invites")
          .select("id, lease_id, invited_email, status")
          .eq("invited_email", landlordEmail.toLowerCase())
          .eq("status", "pending"),
        supabase
          .from("leases")
          .select("id, address, monthly_rent_amount, start_date")
          .eq("landlord_id", landlordId)
          .order("created_at", { ascending: false }),
      ]);

    if (inviteError || leaseError) {
      toast.error("We couldn’t load your landlord workspace.");
      return;
    }

    const loadedInvites = inviteData ?? [];
    const loadedLeases = leaseData ?? [];
    const inviteLeaseIds = loadedInvites.map((invite) => invite.lease_id);
    const allLeaseIds = [...new Set([...loadedLeases.map((lease) => lease.id), ...inviteLeaseIds])];

    let invitedLeaseData: Lease[] = [];
    if (inviteLeaseIds.length > 0) {
      const { data, error } = await supabase
        .from("leases")
        .select("id, address, monthly_rent_amount, start_date")
        .in("id", inviteLeaseIds);

      if (error) {
        toast.error("We couldn’t load your invitation details.");
        return;
      }

      invitedLeaseData = data ?? [];
    }

    if (allLeaseIds.length > 0) {
      const { data, error } = await supabase
        .from("payment_records")
        .select("id, lease_id, month, amount, status, verification_method")
        .in("lease_id", allLeaseIds)
        .eq("verification_method", "landlord")
        .order("month", { ascending: false });

      if (error) {
        toast.error("We couldn’t load payment confirmations.");
        return;
      }

      setPayments(data ?? []);
    } else {
      setPayments([]);
    }

    setInvites(loadedInvites);
    setLeases([
      ...loadedLeases,
      ...invitedLeaseData.filter(
        (item) => !loadedLeases.some((lease) => lease.id === item.id),
      ),
    ]);
  }, []);

  useEffect(() => {
    async function loadLandlord() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      const landlordEmail = data.user.email ?? "";
      setUserId(data.user.id);
      setEmail(landlordEmail);
      await loadData(data.user.id, landlordEmail);
      setIsLoading(false);
    }

    loadLandlord();
  }, [loadData, router]);

  async function acceptInvite(invite: Invite) {
    setIsWorking(invite.id);

    const { error } = await supabase.rpc("accept_landlord_invite", {
      invite_id: invite.id,
    });

    if (error) {
      toast.error(error.message || "We couldn’t accept this invitation.");
      setIsWorking("");
      return;
    }

    toast.success("Lease connected to your landlord account.");
    await loadData(userId, email);
    setIsWorking("");
  }

  async function confirmPayment(paymentId: string) {
    setIsWorking(paymentId);

    const { error } = await supabase
      .from("payment_records")
      .update({ status: "verified" })
      .eq("id", paymentId);

    if (error) {
      toast.error("We couldn’t confirm this payment.");
      setIsWorking("");
      return;
    }

    toast.success("Rent payment confirmed.");
    setPayments((current) =>
      current.map((payment) =>
        payment.id === paymentId ? { ...payment, status: "verified" } : payment,
      ),
    );
    setIsWorking("");
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    router.replace("/");
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream-50 text-sm font-bold text-teal-700">
        Loading your landlord workspace...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50 text-ink-900">
      <header className="border-b border-cream-200 bg-white/90">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" aria-label="Pact home">
            <BrandLogo className="h-11 w-28" />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="rounded-full border border-cream-300 px-4 py-2.5 text-sm font-bold text-ink-700 hover:border-teal-300 hover:text-teal-700"
            >
              Settings
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-cream-300 px-4 py-2.5 text-sm font-bold text-ink-700 hover:border-teal-300 hover:text-teal-700"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
          Landlord workspace
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-[-0.055em] sm:text-5xl">
          Confirm rent without seeing private payment details.
        </h1>
        <p className="mt-4 text-ink-600">{email}</p>

        {invites.length > 0 && (
          <section className="mt-10 rounded-[2rem] border border-mustard-200 bg-mustard-50 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Handshake className="mt-1 shrink-0 text-teal-700" size={24} />
              <div>
                <h2 className="text-2xl font-bold">New lease invitation</h2>
                <p className="mt-2 leading-7 text-ink-700">
                  A renter has invited you to connect a lease and confirm their rent payments.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {invites.map((invite) => {
                const lease = leases.find((item) => item.id === invite.lease_id);
                return (
                  <div
                    key={invite.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-bold">{lease?.address ?? "Rental lease"}</p>
                      <p className="mt-1 text-sm text-ink-600">
                        ${Number(lease?.monthly_rent_amount ?? 0).toLocaleString("en-CA")} per month
                      </p>
                    </div>
                    <button
                      onClick={() => acceptInvite(invite)}
                      disabled={isWorking === invite.id}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 font-bold text-white hover:bg-teal-700 disabled:opacity-60"
                    >
                      {isWorking === invite.id && <Loader2 size={17} className="animate-spin" />}
                      Accept invitation
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
              Payment confirmations
            </p>
            <h2 className="mt-2 text-2xl font-bold">Rent awaiting your review</h2>
          </div>

          {payments.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-cream-300 bg-white p-8 text-center">
              <p className="text-ink-600">Pending landlord confirmations will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {payments.map((payment) => {
                const lease = leases.find((item) => item.id === payment.lease_id);
                const isVerified = payment.status === "verified";

                return (
                  <article
                    key={payment.id}
                    className="rounded-[2rem] border border-cream-200 bg-white p-6 shadow-[0_16px_45px_rgba(44,54,48,0.06)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold">{lease?.address ?? "Rental payment"}</p>
                        <p className="mt-1 text-sm text-ink-600">
                          {new Date(`${payment.month}T00:00:00`).toLocaleDateString("en-CA", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span className="rounded-full bg-mustard-100 px-3 py-1.5 text-xs font-bold capitalize text-ink-800">
                        {payment.status}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-cream-200 pt-4">
                      <p className="text-xl font-bold">
                        {payment.amount == null
                          ? "Amount unavailable"
                          : `$${Number(payment.amount).toLocaleString("en-CA", {
                              minimumFractionDigits: 2,
                            })}`}
                      </p>
                      {isVerified ? (
                        <span className="inline-flex items-center gap-2 font-bold text-teal-700">
                          <CheckCircle2 size={18} />
                          Confirmed
                        </span>
                      ) : (
                        <button
                          onClick={() => confirmPayment(payment.id)}
                          disabled={isWorking === payment.id}
                          className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-60"
                        >
                          {isWorking === payment.id && <Loader2 size={16} className="animate-spin" />}
                          Confirm rent
                        </button>
                      )}
                    </div>

                    <div className="mt-5 flex items-start gap-3 rounded-2xl bg-teal-50 p-4 text-sm leading-6 text-teal-950">
                      <ShieldCheck size={18} className="mt-0.5 shrink-0 text-teal-600" />
                      You are only confirming rent received; no banking information is shared.
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}