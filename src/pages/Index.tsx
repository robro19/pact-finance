import { Link } from "react-router-dom";
import { Building2, Landmark, FileCheck2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/BrandLogo";
import { ComplianceNote } from "@/components/ComplianceNote";
import { MockBadge } from "@/components/MockBadge";
import { MadeWithDyad } from "@/components/made-with-dyad";

const paths = [
  {
    icon: Landmark,
    title: "Connect your bank",
    body: "Read-only. We look for your repeating rent payment at RBC, TD, Scotiabank, BMO, CIBC, National Bank, Tangerine or Desjardins.",
  },
  {
    icon: Building2,
    title: "Ask your landlord",
    body: "Your landlord taps once each month to confirm the rent arrived on time.",
  },
  {
    icon: FileCheck2,
    title: "Enter it yourself",
    body: "Add the amount and date, and attach an e-Transfer screenshot or receipt if you have one. Fully equal to the other two.",
  },
];

const Index = () => (
  <div className="min-h-screen">
    <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
      <Link to="/" aria-label="Pact home">
        <BrandLogo className="h-14 w-auto" />
      </Link>
      <Button asChild variant="ghost" className="rounded-xl">
        <Link to="/signin">Sign in</Link>
      </Button>
    </header>

    <main className="mx-auto max-w-5xl px-5 pb-16">
      <section className="animate-fade-up py-8 md:py-14">
        <p className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          Canada · for newcomers building credit
        </p>
        <h1 className="font-display text-3xl leading-tight md:text-5xl">
          You already pay rent. Let it help build your Canadian credit history.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          If you're new to Canada, you probably have no credit file yet — so banks have no
          record of you paying anything on time. Pact verifies your monthly rent and sends it
          to a licensed rent-reporting partner, which reports it to the credit bureaus.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-xl">
            <Link to="/signup?role=tenant">
              Start as a renter <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl">
            <Link to="/signup?role=landlord">I'm a landlord or property manager</Link>
          </Button>
        </div>
      </section>

      <section
        className="animate-fade-up overflow-hidden rounded-3xl border bg-card"
        style={{ animationDelay: "120ms" }}
      >
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=70"
          alt="A bright apartment living room"
          className="h-48 w-full object-cover md:h-72"
        />
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {paths.map((p, i) => (
          <div
            key={p.title}
            className="animate-fade-up rounded-3xl border bg-card p-5"
            style={{ animationDelay: `${180 + i * 90}ms` }}
          >
            <p.icon className="mb-3 h-6 w-6 text-primary" />
            <h3 className="mb-1 font-semibold">{p.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-primary p-6 text-primary-foreground">
          <h3 className="font-display text-xl">This takes months, not minutes</h3>
          <p className="mt-2 text-sm leading-relaxed opacity-90">
            Credit history is built from a pattern of on-time payments. Most people start to
            see a payment history on their credit file after a few reported months. Pact
            cannot promise a specific score — bureaus and lenders decide that, not us.
          </p>
        </div>
        <ComplianceNote />
      </section>

      <div className="mt-8 space-y-3">
        <MockBadge>
          This is a working prototype. Bank connections and bureau reporting are simulated with
          clearly labelled sandbox data.
        </MockBadge>
        <div className="rounded-2xl border bg-card p-4 text-sm">
          <p className="font-semibold">Try the demo accounts</p>
          <p className="text-muted-foreground">
            Renter: <code>tenant@demo.ca</code> · Landlord: <code>landlord@demo.ca</code> —
            password <code>demo1234</code>
          </p>
        </div>
      </div>
    </main>
    <MadeWithDyad />
  </div>
);

export default Index;