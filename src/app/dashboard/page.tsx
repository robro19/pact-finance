"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck, Home, LogOut, Plus, Settings, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BrandLogo } from "@/components/brand-logo";
import { LeaseSetupForm } from "@/components/lease-setup-form";
import { supabase } from "@/integrations/supabase/client";

type Lease = {
  id: string;
  address: string;
  monthly_rent_amount: number;
  start_date: string;
  status: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [leases, setLeases] = useState<Lease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeaseForm, setShowLeaseForm] = useState(false);

  const loadLeases = useCallback(async (tenantId: string) => {
    const { data, error } = await supabase
      .from("leases")
      .select("id, address, monthly_rent_amount, start_date, status")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("We couldn’t load your lease details.");
      return;
    }

    setLeases(data ?? []);
  }, []);

  useEffect(() => {
    async function loadDashboard() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setUserId(data.user.id);
      setEmail(data.user.email ?? "");
      await loadLeases(data.user.id);
      setIsLoading(false);
    }

    loadDashboard();
  }, [loadLeases, router]);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("You’ve been signed out.");
    router.replace("/");
  }

  async function handleLeaseCreated() {
    await loadLeases(userId);
    setShowLeaseForm(false);
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream-50 text-sm font-bold text-teal-700">
        Loading your Pact dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50 text-ink-900">
      <header className="border-b border-cream-200 bg-white/85">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" aria-label="Pact home">
            <BrandLogo className="h-11 w-28" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:border-teal-300 hover:text-teal-700"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:border-teal-300 hover:text-teal-700"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-16">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
              Your Pact dashboard
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">
              Your rent journey starts here.
            </h1>
            <p className="mt-3 text-ink-600">{email}</p>
          </div>

          {!showLeaseForm && (
            <button
              onClick={() => setShowLeaseForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 font-bold text-white shadow-[0_8px_24px_rgba(21,154,140,0.2)] transition hover:bg-teal-700"
            >
              <Plus size={18} />
              Add a lease
            </button>
          )}
        </div>

        {showLeaseForm && (
          <section className="mt-10 max-w-3xl rounded-[2rem] border border-teal-100 bg-white p-6 shadow-[0_16px_45px_rgba(44,54,48,0.06)] sm:p-8">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                  <Home size={21} />
                </div>
                <h2 className="mt-5 text-2xl font-bold">Add your rental details</h2>
                <p className="mt-2 leading-7 text-ink-600">
                  Tell us about the home connected to your monthly rent payment.
                </p>
              </div>
              <button
                onClick={() => setShowLeaseForm(false)}
                className="text-sm font-bold text-ink-500 hover:text-teal-700"
              >
                Cancel
              </button>
            </div>
            <LeaseSetupForm userId={userId} onCreated={handleLeaseCreated} />
          </section>
        )}

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
                Rental details
              </p>
              <h2 className="mt-2 text-2xl font-bold">Your leases</h2>
            </div>
            {leases.length > 0 && (
              <span className="rounded-full bg-teal-100 px-3 py-1.5 text-sm font-bold text-teal-800">
                {leases.length} {leases.length === 1 ? "lease" : "leases"}
              </span>
            )}
          </div>

          {leases.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-cream-300 bg-white p-8 text-center sm:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral-100 text-coral-700">
                <Home size={25} />
              </div>
              <h3 className="mt-5 text-2xl font-bold">No lease added yet</h3>
              <p className="mx-auto mt-3 max-w-md leading-7 text-ink-600">
                Add your current rental details so Pact can prepare your payment verification
                timeline.
              </p>
              <button
                onClick={() => setShowLeaseForm(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 font-bold text-white hover:bg-teal-700"
              >
                Set up your lease <ArrowRight size={17} />
              </button>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {leases.map((lease) => (
                <article
                  key={lease.id}
                  className="rounded-[2rem] border border-cream-200 bg-white p-6 shadow-[0_16px_45px_rgba(44,54,48,0.06)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                      <Home size={21} />
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1.5 text-xs font-bold capitalize text-teal-800">
                      <CircleCheck size={14} />
                      {lease.status}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{lease.address}</h3>
                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-cream-200 pt-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-500">
                        Monthly rent
                      </p>
                      <p className="mt-1 text-lg font-bold">
                        ${Number(lease.monthly_rent_amount).toLocaleString("en-CA")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink-500">
                        Started
                      </p>
                      <p className="mt-1 text-lg font-bold">
                        {new Date(`${lease.start_date}T00:00:00`).toLocaleDateString("en-CA", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex items-start gap-3 rounded-2xl bg-cream-50 p-4 text-sm leading-6 text-ink-600">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-teal-600" />
                    Your lease is ready for payment verification.
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}