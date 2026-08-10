"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleCheck, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error }) => {
      if (error || !data.user) {
        router.replace("/login");
        return;
      }
      setEmail(data.user.email ?? "");
      setIsLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("You’ve been signed out.");
    router.replace("/");
  }

  if (isLoading) {
    return <main className="flex min-h-screen items-center justify-center bg-cream-50 text-sm font-bold text-teal-700">Loading your Pact...</main>;
  }

  return (
    <main className="min-h-screen bg-cream-50 text-ink-900">
      <header className="border-b border-cream-200 bg-white/80">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <a href="/" className="text-2xl font-bold tracking-[-0.05em]">pact</a>
          <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2.5 text-sm font-bold text-ink-700 hover:border-teal-300 hover:text-teal-700">
            <LogOut size={16} /> Sign out
          </button>
        </nav>
      </header>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-500">Your Pact dashboard</p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.055em] sm:text-5xl">Welcome back.</h1>
        <p className="mt-3 text-ink-600">{email}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["Your timeline", "Start by adding your current rental details.", CircleCheck],
            ["Verify a payment", "Connect, upload proof, or ask your landlord to confirm.", ShieldCheck],
            ["Next step", "Complete your profile to prepare for reporting.", ArrowRight],
          ].map(([title, copy, Icon]) => (
            <div key={title as string} className="rounded-[1.75rem] border border-cream-200 bg-white p-6 shadow-[0_16px_45px_rgba(44,54,48,0.06)]">
              <Icon className="text-teal-600" size={23} />
              <h2 className="mt-7 text-xl font-bold">{title as string}</h2>
              <p className="mt-2 leading-7 text-ink-600">{copy as string}</p>
              <button className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-teal-700">
                Coming next <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}