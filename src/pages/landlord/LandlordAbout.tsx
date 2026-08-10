import { ComplianceNote } from "@/components/ComplianceNote";
import { MockBadge } from "@/components/MockBadge";

const points = [
  {
    t: "What you're being asked to do",
    d: "Once a month, tap to confirm that a tenant paid the rent you agreed, on time. That's the whole job.",
  },
  {
    t: "What it does for your tenant",
    d: "Many newcomers have no Canadian credit file. A confirmed rent payment gives them a real, verifiable record of paying on time.",
  },
  {
    t: "What it does for you",
    d: "Tenants who know their rent is reported tend to prioritise paying it. You keep collecting rent exactly as you do today.",
  },
  {
    t: "Pact never touches rent money",
    d: "Payments continue to flow directly from your tenant to you. Pact only records that the payment happened.",
  },
  {
    t: "You are not the reporter",
    d: "Pact hands verified payments to a licensed rent-reporting partner, which submits them to the credit bureaus. You are simply confirming a fact.",
  },
  {
    t: "If something's wrong",
    d: "Use 'There was a problem this month' instead of confirming. Nothing is sent for reporting, and your tenant is told.",
  },
];

const LandlordAbout = () => (
  <div className="space-y-5">
    <div>
      <h1 className="font-display text-2xl">How this works</h1>
      <p className="mt-1 text-sm text-muted-foreground">Two minutes a month, at most.</p>
    </div>
    <div className="space-y-3">
      {points.map((p) => (
        <div key={p.t} className="rounded-2xl border bg-card p-4">
          <p className="text-sm font-semibold">{p.t}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
        </div>
      ))}
    </div>
    <MockBadge>
      This prototype simulates reminder emails and the reporting partner submission.
    </MockBadge>
    <ComplianceNote />
  </div>
);

export default LandlordAbout;