import { ShieldCheck } from "lucide-react";

export const ComplianceNote = ({ compact = false }: { compact?: boolean }) => (
  <div className="rounded-2xl border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
    <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
      <ShieldCheck className="h-4 w-4 text-primary" />
      What Pact does and doesn't do
    </p>
    <ul className="space-y-1.5">
      <li>• Pact never holds or moves your money. You keep paying rent to your landlord the way you already do — we only confirm that the payment happened.</li>
      <li>• Pact does not lend money and is not a lender.</li>
      <li>• Pact is not a credit bureau. Verified payments go to a licensed rent-reporting partner, which submits them to the credit bureaus.</li>
      {!compact && (
        <li>• We can't promise a specific credit score change. What the bureaus do with reported information, and how lenders read it, is outside our control.</li>
      )}
      <li>• Pact currently supports Canada only.</li>
    </ul>
  </div>
);