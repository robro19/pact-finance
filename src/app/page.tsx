import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const benefits = [
  {
    icon: CheckCircle2,
    title: "Use rent you already pay",
    description:
      "Turn your consistent monthly rent payments into a stronger Canadian credit history.",
  },
  {
    icon: ShieldCheck,
    title: "Verified and secure",
    description:
      "Your payments are verified before being shared with Pact’s licensed reporting partner.",
  },
  {
    icon: Building2,
    title: "Built for newcomers",
    description:
      "Start building financial momentum in Canada without taking on another loan.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream-50 text-ink-900">
      <header className="border-b border-cream-200 bg-cream-50/90">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <Link href="/" aria-label="Pact home">
            <BrandLogo className="h-12 w-28" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:bg-white hover:text-teal-700"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(21,154,140,0.2)] transition hover:bg-teal-700"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-24">
        <div>
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
            Built for Canada’s newcomers
          </p>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            Your rent already counts. Let it help build your credit.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-600">
            Pact helps turn verified rent payments into Canadian credit history,
            so you can move toward the cards, plans, and opportunities you want.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 font-bold text-white shadow-[0_10px_28px_rgba(21,154,140,0.22)] transition hover:bg-teal-700"
            >
              Get started <ArrowRight size={18} />
            </Link>
            <Link
              href="/signup?role=landlord"
              className="inline-flex items-center justify-center rounded-full border border-cream-300 bg-white px-6 py-3.5 font-bold text-ink-800 transition hover:border-teal-300 hover:text-teal-700"
            >
              I’m a landlord
            </Link>
          </div>

          <p className="mt-5 text-sm text-ink-500">
            Canada only · Pact does not lend money or hold your funds.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[3rem] bg-coral-100/70 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2.5rem] border border-cream-200 bg-white p-3 shadow-[0_24px_70px_rgba(44,54,48,0.1)]">
            <img
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80"
              alt="Bright apartment living room"
              className="h-[360px] w-full rounded-[2rem] object-cover sm:h-[440px]"
            />
            <div className="absolute bottom-8 left-8 right-8 rounded-3xl border border-white/60 bg-white/95 p-5 shadow-xl backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-coral-500">
                This month
              </p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-ink-900">Rent payment verified</p>
                  <p className="mt-1 text-sm text-ink-600">
                    Ready for partner reporting
                  </p>
                </div>
                <CheckCircle2 className="shrink-0 text-teal-600" size={28} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-cream-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-12 md:grid-cols-3 lg:px-8">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-3xl bg-cream-50 p-6">
              <Icon className="text-teal-600" size={25} />
              <h2 className="mt-5 text-xl font-bold">{title}</h2>
              <p className="mt-2 leading-7 text-ink-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-16 text-center lg:py-24">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
          A simple first step
        </p>
        <h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
          Make the payment you already make work harder for you.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl leading-7 text-ink-600">
          Choose bank verification, landlord confirmation, or manual payment
          proof. Each path is designed to help you keep building consistently.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 font-bold text-white transition hover:bg-teal-700"
        >
          Create your Pact account <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}