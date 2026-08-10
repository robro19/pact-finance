import Link from "next/link";
import { ArrowRight, Check, Handshake, ShieldCheck, UsersRound } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const benefits = [
  "Confirm monthly rent with one tap",
  "Keep tenant bank and proof details private",
  "Support stronger tenant retention",
  "No money movement or lending involved",
];

export default function LandlordsPage() {
  return (
    <main className="min-h-screen bg-coral-50 text-ink-900">
      <header className="border-b border-coral-200 bg-coral-50/95">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <Link href="/" aria-label="Pact home">
            <BrandLogo className="h-12 w-28" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-full px-4 py-2.5 text-sm font-bold text-ink-700 hover:text-teal-700">
              Log in
            </Link>
            <Link href="/signup?role=landlord" className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700">
              Join as a landlord
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:px-8 lg:pb-28 lg:pt-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-700">
            A simpler tenant experience
          </p>
          <h1 className="mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.06em] sm:text-6xl">
            Help good tenants build a stronger start in Canada.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-700">
            Pact gives landlords a lightweight way to confirm rent received
            each month—without handling money or seeing private financial data.
          </p>
          <Link href="/signup?role=landlord" className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 font-bold text-white hover:bg-teal-700">
            Create a landlord account <ArrowRight size={18} />
          </Link>
        </div>

        <div className="rounded-[2.5rem] border border-coral-200 bg-white p-7 shadow-[0_24px_70px_rgba(44,54,48,0.1)]">
          <div className="flex items-center justify-between border-b border-cream-200 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-coral-500">This month</p>
              <h2 className="mt-2 text-2xl font-bold">Tenant payments</h2>
            </div>
            <Handshake className="text-teal-600" size={28} />
          </div>
          <div className="mt-6 rounded-2xl bg-cream-50 p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <UsersRound size={19} />
              </span>
              <div>
                <p className="font-bold">Matched tenant</p>
                <p className="text-sm text-ink-600">Rent confirmation requested</p>
              </div>
            </div>
            <button className="mt-5 w-full rounded-full bg-teal-600 px-4 py-3 font-bold text-white hover:bg-teal-700">
              Confirm rent received
            </button>
          </div>
          <p className="mt-5 flex gap-2 text-sm leading-6 text-ink-600">
            <ShieldCheck className="mt-0.5 shrink-0 text-teal-600" size={17} />
            You only see lease and confirmation details—not bank connections or uploaded proof.
          </p>
        </div>
      </section>

      <section className="border-y border-coral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-500">Why landlords use Pact</p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em]">Minimal effort. Meaningful support.</h2>
          </div>
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 rounded-2xl bg-cream-50 p-4 font-bold">
                <Check className="mt-0.5 shrink-0 text-teal-600" size={19} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}