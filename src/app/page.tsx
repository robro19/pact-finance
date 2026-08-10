import {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  ChevronDown,
  CircleCheck,
  CreditCard,
  FileCheck2,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const banks = [
  "RBC",
  "TD",
  "Scotiabank",
  "BMO",
  "CIBC",
  "National Bank",
  "Tangerine",
  "Desjardins",
];

const faqs = [
  {
    question: "Does Pact cost money?",
    answer:
      "Pact is designed to keep access simple and affordable. Any applicable plan details are shown clearly before you activate reporting.",
  },
  {
    question: "Will my landlord know I’m using Pact?",
    answer:
      "Only if you choose the landlord-confirmation path or invite them to join. Bank matching and manual proof are private ways to verify your payment.",
  },
  {
    question: "Do I need a Social Insurance Number to start?",
    answer:
      "You can set up your Pact account and verify rent without one. Pact will explain any information needed for your reporting partner before submission.",
  },
  {
    question: "How long until my score is affected?",
    answer:
      "Credit history takes time. Once verified payments are submitted, it may take multiple reporting cycles for changes to appear, and outcomes vary by person.",
  },
  {
    question: "Which bureaus does Pact report to?",
    answer:
      "Pact works with a licensed Canadian rent-reporting partner that submits eligible verified payments to Canadian credit bureaus.",
  },
  {
    question: "What if my bank isn’t listed?",
    answer:
      "Manual entry and landlord confirmation are equally valid options. You can upload payment proof or ask your landlord to confirm rent each month.",
  },
];

function PactMark() {
  return (
    <span className="flex items-center gap-2.5" aria-label="Pact home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
        <span className="absolute h-4 w-2.5 -translate-x-1.5 rotate-45 rounded-sm border-2 border-white" />
        <span className="absolute h-4 w-2.5 translate-x-1.5 -rotate-45 rounded-sm border-2 border-cream-100" />
      </span>
      <span className="text-xl font-bold tracking-[-0.04em] text-ink-900">pact</span>
    </span>
  );
}

function StepCard({
  number,
  icon,
  title,
  children,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group rounded-[1.75rem] border border-cream-200 bg-white p-6 shadow-[0_16px_45px_rgba(44,54,48,0.06)] transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-8 flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          {icon}
        </span>
        <span className="font-mono text-xs font-bold tracking-[0.2em] text-coral-500">
          {number}
        </span>
      </div>
      <h3 className="mb-2 text-xl font-bold tracking-[-0.03em] text-ink-900">
        {title}
      </h3>
      <p className="leading-7 text-ink-600">{children}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-cream-50 text-ink-900">
      <header className="relative z-10 border-b border-cream-200/80 bg-cream-50/90 backdrop-blur">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"
          aria-label="Main navigation"
        >
          <a href="#" className="rounded-lg focus-visible:outline-teal-600">
            <PactMark />
          </a>
          <div className="hidden items-center gap-8 text-sm font-semibold text-ink-600 md:flex">
            <a className="transition-colors hover:text-teal-700" href="#how-it-works">
              How it works
            </a>
            <a className="transition-colors hover:text-teal-700" href="#landlords">
              For landlords
            </a>
            <a className="transition-colors hover:text-teal-700" href="#trust">
              Trust & security
            </a>
            <a className="transition-colors hover:text-teal-700" href="#faq">
              FAQ
            </a>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <a
              href="/login"
              className="rounded-full px-4 py-2.5 text-sm font-bold text-ink-700 transition-colors hover:bg-cream-200"
            >
              Log in
            </a>
            <a
              href="/signup"
              className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-teal-700 hover:shadow-md"
            >
              Get started
            </a>
          </div>
          <button
            className="rounded-xl p-2 text-ink-700 sm:hidden"
            aria-label="Open navigation menu"
            type="button"
          >
            <Menu size={22} />
          </button>
        </nav>
      </header>

      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-28 lg:pt-24">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-teal-800">
              <Sparkles size={14} />
              Built for newcomers to Canada
            </div>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.065em] text-ink-900 sm:text-6xl lg:text-7xl">
              Your rent has been building a story.{" "}
              <span className="text-teal-600">Let it count.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ink-600 sm:text-xl">
              Pact helps turn verified rent payments into Canadian credit
              history—so the payment you already make can help open more doors.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 font-bold text-white shadow-[0_8px_24px_rgba(21,154,140,0.24)] transition-all hover:-translate-y-0.5 hover:bg-teal-700"
              >
                Get started <ArrowRight size={18} />
              </a>
              <a
                href="#landlords"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-300 bg-white px-6 py-3.5 font-bold text-ink-800 transition-colors hover:border-teal-300 hover:text-teal-700"
              >
                I’m a landlord <Building2 size={17} />
              </a>
            </div>
            <p className="mt-5 text-xs font-medium text-ink-500">
              No lending. No money movement. No guaranteed score outcomes.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-mustard-100/70 blur-2xl" />
            <div className="absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-coral-100/70 blur-3xl" />
            <div className="relative rounded-[2.5rem] border border-cream-200 bg-[#fffdf7] p-5 shadow-[0_24px_70px_rgba(44,54,48,0.1)] sm:p-8">
              <div className="flex items-center justify-between border-b border-cream-200 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink-500">
                    Your Pact timeline
                  </p>
                  <p className="mt-1 text-lg font-bold text-ink-900">
                    Small steps, real history
                  </p>
                </div>
                <div className="rounded-2xl bg-mustard-100 p-3 text-mustard-700">
                  <CreditCard size={22} />
                </div>
              </div>
              <div className="relative my-8 h-48">
                <div className="absolute bottom-5 left-3 right-3 h-px bg-cream-300" />
                <div className="absolute bottom-5 left-4 top-5 w-px bg-cream-300" />
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 440 190"
                  fill="none"
                  aria-label="Upward credit history illustration"
                  role="img"
                >
                  <path
                    d="M22 158 C90 155 93 128 150 139 S213 105 247 111 S311 67 351 77 S395 34 420 25"
                    stroke="#159A8C"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <circle cx="150" cy="139" r="7" fill="#F2C14E" />
                  <circle cx="247" cy="111" r="7" fill="#EC806B" />
                  <circle cx="351" cy="77" r="7" fill="#159A8C" />
                  <circle cx="420" cy="25" r="9" fill="#159A8C" />
                </svg>
                <div className="absolute bottom-0 left-0 text-xs font-medium text-ink-500">
                  Today
                </div>
                <div className="absolute right-0 top-0 text-xs font-bold text-teal-700">
                  Over time
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {["Pay rent", "Verify", "Report"].map((item, index) => (
                  <div key={item} className="rounded-2xl bg-cream-100 p-3">
                    <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-teal-700 shadow-sm">
                      {index + 1}
                    </div>
                    <p className="text-xs font-bold text-ink-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-cream-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
              The gap is real
            </p>
            <h2 className="max-w-md text-3xl font-bold leading-tight tracking-[-0.045em] sm:text-4xl">
              New here shouldn’t mean invisible to the system.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              ["01", "You pay rent", "Reliably, every month."],
              ["02", "It goes uncounted", "Because rent history often isn’t reported."],
              ["03", "Doors stay closed", "Cards, loans, phone plans, and more."],
            ].map(([number, title, copy]) => (
              <div key={number} className="border-l-2 border-teal-200 pl-5">
                <p className="font-mono text-xs font-bold text-teal-600">{number}</p>
                <h3 className="mt-4 font-bold text-ink-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
            How Pact works
          </p>
          <h2 className="text-4xl font-bold tracking-[-0.05em] sm:text-5xl">
            A simple bridge from rent to credit history.
          </h2>
          <p className="mt-5 text-lg leading-8 text-ink-600">
            Choose the verification path that fits your life. Each option is
            designed to be clear, secure, and equally valid.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <StepCard number="01 / CONNECT" icon={<Banknote size={21} />} title="Verify your rent">
            Connect a supported Canadian bank or enter your payment manually.
            You can also ask your landlord to confirm each month.
          </StepCard>
          <StepCard number="02 / CONFIRM" icon={<FileCheck2 size={21} />} title="Pact checks the details">
            We match or review the payment details so only verified rent
            payments move forward.
          </StepCard>
          <StepCard number="03 / BUILD" icon={<CircleCheck size={21} />} title="History grows monthly">
            A licensed reporting partner submits eligible payments to Canadian
            credit bureaus. It’s progress, not an overnight promise.
          </StepCard>
        </div>
      </section>

      <section id="landlords" className="bg-teal-900 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1fr_.9fr] lg:px-8 lg:py-24">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-mustard-300">
              For landlords & property managers
            </p>
            <h2 className="max-w-xl text-4xl font-bold leading-tight tracking-[-0.05em] sm:text-5xl">
              Make reliable renting easier for everyone.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-teal-50/80">
              Pact gives tenants a practical way to build Canadian credit while
              giving you a lightweight monthly confirmation flow—without
              handling money or exposing private financial details.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {["One-tap monthly confirmation", "Less payment friction", "A calmer tenant experience", "Minimal admin overhead"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-semibold">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-mustard-300">
                      <Check size={15} />
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ul>
            <a
              href="/signup?role=landlord"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-mustard-300 px-6 py-3.5 font-bold text-teal-950 transition-colors hover:bg-mustard-200"
            >
              Explore Pact for landlords <ArrowRight size={18} />
            </a>
          </div>
          <div className="rounded-[2rem] bg-teal-800 p-6 shadow-inner sm:p-8">
            <div className="rounded-[1.5rem] bg-cream-50 p-5 text-ink-900 sm:p-6">
              <div className="mb-7 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-500">
                    This month
                  </p>
                  <p className="mt-1 text-xl font-bold">Rent confirmations</p>
                </div>
                <ShieldCheck className="text-teal-600" />
              </div>
              {["Amina K.", "Lucas R.", "Priya S."].map((tenant, index) => (
                <div key={tenant} className="flex items-center justify-between border-t border-cream-200 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
                      {tenant.charAt(0)}
                    </div>
                    <span className="text-sm font-bold">{tenant}</span>
                  </div>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${index === 2 ? "bg-mustard-100 text-mustard-800" : "bg-teal-100 text-teal-800"}`}>
                    {index === 2 ? "Confirm" : "Confirmed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="border-b border-cream-200 bg-cream-100">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-teal-700">
              Trust, in plain language
            </p>
            <h2 className="text-4xl font-bold tracking-[-0.05em]">
              Built to be useful, not mysterious.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              [LockKeyhole, "Your data stays yours", "Secure authentication and row-level access controls help keep your account private."],
              [ShieldCheck, "We don’t hold funds", "Pact never lends, moves, or stores your rent money."],
              [CreditCard, "No score promises", "Reporting can support your history, but no provider can guarantee a specific score."],
            ].map(([Icon, title, copy]) => (
              <div key={title as string} className="rounded-3xl bg-white p-6">
                <Icon className="text-teal-600" size={24} />
                <h3 className="mt-6 font-bold">{title as string}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-600">{copy as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="rounded-[2rem] border border-cream-200 bg-white p-7 shadow-[0_16px_45px_rgba(44,54,48,0.05)] sm:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-coral-500">
                Canadian coverage
              </p>
              <h2 className="text-3xl font-bold tracking-[-0.045em]">Connect your bank—or don’t.</h2>
              <p className="mt-3 max-w-xl text-ink-600">
                Pact supports major Canadian institutions. Manual entry and
                landlord confirmation are just as valid when your bank isn’t listed.
              </p>
            </div>
            <span className="rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800">
              Canada only for now
            </span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {banks.map((bank) => (
              <span key={bank} className="rounded-full border border-cream-300 bg-cream-50 px-4 py-2.5 text-sm font-bold text-ink-700">
                {bank}
              </span>
            ))}
            <span className="rounded-full border border-dashed border-teal-300 bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-800">
              Manual entry
            </span>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-cream-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-20 lg:py-24">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-teal-700">FAQ</p>
            <h2 className="text-4xl font-bold tracking-[-0.05em]">Good questions are welcome.</h2>
          </div>
          <div className="divide-y divide-cream-200 rounded-3xl border border-cream-200 bg-cream-50 px-6">
            {faqs.map((faq) => (
              <details key={faq.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-ink-900 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown size={19} className="shrink-0 text-teal-600 transition-transform group-open:rotate-180" />
                </summary>
                <p className="max-w-2xl pt-3 pr-8 text-sm leading-7 text-ink-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-coral-100 px-6 py-12 text-center sm:px-12">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-[24px] border-coral-200/70" />
          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-coral-700">Coming soon</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">
              Pact is starting in Canada.
            </h2>
            <p className="mx-auto mt-4 max-w-lg leading-7 text-ink-700">
              New York City and San Francisco are on our future map. Join the
              list and we’ll let you know when Pact reaches your city.
            </p>
            <form className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="waitlist-email">Email address</label>
              <input
                id="waitlist-email"
                type="email"
                placeholder="you@example.com"
                className="min-w-0 flex-1 rounded-full border border-coral-200 bg-white px-5 py-3.5 text-sm outline-none ring-teal-500 placeholder:text-ink-400 focus:ring-2"
              />
              <button type="submit" className="rounded-full bg-teal-700 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-teal-800">
                Notify me
              </button>
            </form>
            <p className="mt-3 text-xs text-ink-500">No spam. Just a launch note when the time comes.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-cream-200 bg-cream-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <PactMark />
            <div className="flex flex-wrap gap-3">
              <a href="/signup" className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-bold text-white hover:bg-teal-700">
                I’m a renter <UserRound size={16} />
              </a>
              <a href="/signup?role=landlord" className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-white px-5 py-3 text-sm font-bold text-ink-800 hover:border-teal-300">
                I’m a landlord <Building2 size={16} />
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-3 border-t border-cream-200 pt-6 text-xs text-ink-500 sm:flex-row">
            <p>© {new Date().getFullYear()} Pact. Made for Canada.</p>
            <p>Credit reporting through a licensed partner. Sample integrations are sandboxed.</p>
          </div>
        </div>
      </footer>
      <MadeWithDyad />
    </main>
  );
}