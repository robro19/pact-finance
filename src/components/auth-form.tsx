"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type AuthMode = "login" | "signup";
type AuthRole = "renter" | "landlord";

type AuthFormProps = {
  mode: AuthMode;
  role?: AuthRole;
};

function getSiteOrigin() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredSiteUrl) {
    return configuredSiteUrl.replace(/\/+$/, "");
  }

  return window.location.origin;
}

export function AuthForm({ mode, role = "renter" }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSignup = mode === "signup";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const result = isSignup
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${getSiteOrigin()}/login`,
            data: { full_name: fullName, role },
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    if (isSignup && !result.data.session) {
      toast.success("Check your email to confirm your Pact account.");
      return;
    }

    const accountRole = isSignup
      ? role
      : (
          await supabase
            .from("profiles")
            .select("role")
            .eq("id", result.data.user?.id ?? "")
            .maybeSingle()
        ).data?.role ?? result.data.user?.user_metadata.role ?? "renter";

    const requestedPath = searchParams.get("next");
    const destination =
      requestedPath &&
      requestedPath.startsWith("/") &&
      !requestedPath.startsWith("//")
        ? requestedPath
        : accountRole === "landlord"
          ? "/landlord-dashboard"
          : "/dashboard";

    toast.success(isSignup ? "Your Pact account is ready." : "Welcome back.");
    router.push(destination);
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-[0_8px_22px_rgba(21,154,140,0.22)]">
          {isSignup ? <UserRound size={22} /> : <LockKeyhole size={22} />}
        </div>
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
          Pact account
        </p>
        <h1 className="text-4xl font-bold tracking-[-0.055em] text-ink-900">
          {isSignup ? "Start making rent count." : "Welcome back."}
        </h1>
        <p className="mt-3 leading-7 text-ink-600">
          {isSignup
            ? "Create your account and take the first step toward building your Canadian credit history."
            : "Sign in to manage your verified rent payments and Pact timeline."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink-800">Full name</span>
            <div className="relative">
              <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
              <input
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="w-full rounded-2xl border border-cream-300 bg-white px-11 py-3.5 text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                placeholder="Your name"
              />
            </div>
          </label>
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink-800">Email address</span>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-cream-300 bg-white px-11 py-3.5 text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              placeholder="you@example.com"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink-800">Password</span>
          <div className="relative">
            <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={18} />
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-cream-300 bg-white px-11 py-3.5 text-ink-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              placeholder="At least 6 characters"
            />
          </div>
        </label>

        {isSignup && (
          <div className="rounded-2xl bg-teal-50 px-4 py-3 text-sm text-teal-900">
            Creating an account as{" "}
            <strong>{role === "landlord" ? "landlord" : "renter"}</strong>.
          </div>
        )}

        <button
          disabled={isSubmitting}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3.5 font-bold text-white shadow-[0_8px_24px_rgba(21,154,140,0.2)] transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSignup ? "Create account" : "Log in"}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-ink-600">
        {isSignup ? "Already have an account?" : "New to Pact?"}{" "}
        <Link
          href={isSignup ? "/login" : "/signup"}
          className="font-bold text-teal-700 hover:text-teal-800"
        >
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}