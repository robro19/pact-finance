import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen bg-cream-50">
      <section className="hidden flex-1 flex-col justify-between bg-coral-100 p-10 text-ink-900 lg:flex">
        <Link href="/" className="text-2xl font-bold tracking-[-0.04em]">pact</Link>
        <div className="max-w-lg">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-coral-700">
            A better starting point
          </p>
          <h2 className="text-5xl font-bold leading-[1.05] tracking-[-0.06em]">
            The payment you already make can help open more doors.
          </h2>
          <p className="mt-6 max-w-md leading-7 text-ink-700">
            Set up your Pact account in a few minutes, then choose the
            verification path that fits your life.
          </p>
        </div>
        <p className="text-sm text-ink-600">Clear, secure, and built for progress.</p>
      </section>
      <section className="flex flex-1 items-center justify-center px-5 py-12">
        <div>
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-ink-600 hover:text-teal-700">
            <ArrowLeft size={16} /> Back to Pact
          </Link>
          <AuthForm mode="signup" />
        </div>
      </section>
    </main>
  );
}