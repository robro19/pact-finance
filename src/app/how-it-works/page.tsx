import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  CheckCircle2,
  FileCheck2,
  Handshake,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const renterSteps = [
  {
    icon: Banknote,
    number: "01",
    title: "Choose how to verify rent",
    copy: "Connect a supported Canadian bank, invite your landlord, or enter payment details manually. Every option is treated equally.",
  },
  {
    icon: FileCheck2,
    number: "02",
    title: "Confirm your monthly payment",
    copy: "Pact checks that your rent payment matches the lease details you provided before it moves forward.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Send verified data to our partner",
    copy: "Verified payments are submitted to Pact’s licensed reporting partner in a sandboxed workflow for this launch.",
  },
  {
    icon: CheckCircle2,
    number: "04",
    title: "Build consistently over time",
    copy: "Credit history grows through consistent reporting over multiple months—not overnight and never with a guaranteed score.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-cream-50 text-ink-900">
      <header className="border-b border-cream-200 bg-cream-50/95">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <Link href="/" aria-label="Pact home">
            <BrandLogo className="h-12 w-28" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-full px-4 py-2.5 text-sm font-bold text-ink-700 hover:text-teal-700">
              Log in
            </Link>
            <Link href="/signup" className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-700">
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-5 pb-14 pt-16 text-center lg:px-8 lg:pt-24">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
          Simple by design
        </p>
        <h1 className="mt-4 text-5xl font-bold leading-[1.02] tracking-[-0.06em] sm:text-6xl">
          Make your rent part of your financial story.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-ink-600">
          Pact helps turn verified Canadian rent payments into reportable credit
          data while you stay in control of your money.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {renterSteps.map(({ icon: Icon, number, title, copy }) => (
            <article key={number} className="rounded-[2rem] border border-cream-200 bg-white p-7 shadow-[0_16px_45px_rgba(44,54,48,0.06)]">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-coral-500">{number}</span>
                <Icon className="text-teal-600" size={25} />
              </div>
              <h2 className="mt-10 text-2xl font-bold">{title}</h2>
              <p className="mt-3 leading-7 text-ink-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-cream-200 bg-teal-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-mustard-300">
              For landlords
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
              Confirm rent in seconds, not spreadsheets.
            </h2>
          </div>
          <div className="rounded-[2rem] bg-white/10 p-7">
            <Handshake className="text-mustard-300" size={28} />
            <p className="mt-5 leading-8 text-teal-50/85">
              Once matched with a tenant, landlords see only what they need:
              the lease, the current payment status, and a one-tap confirmation
              action. Bank details and payment proof stay private to the renter.
            </p>
            <Link href="/landlords" className="mt-7 inline-flex items-center gap-2 font-bold text-white hover:text-mustard-300">
              Learn about Pact for landlords <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 text-center lg:px-8 lg:py-24">
        <h2 className="text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
          Ready to make rent count?
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-ink-600">
          Start with a free Pact account and choose the verification path that
          fits your household.
        </p>
        <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 font-bold text-white hover:bg-teal-700">
          Get started <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}