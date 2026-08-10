import { Link } from "react-router-dom";
import { ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/StatusPill";
import { ComplianceNote } from "@/components/ComplianceNote";
import { MockBadge } from "@/components/MockBadge";
import { currentUser, usePact } from "@/lib/store";
import { getMonthStatus } from "@/lib/reporting";
import { currentMonth, formatMoney, monthLabel, recentMonths, shortMonthLabel } from "@/lib/format";
import { reportingPartner } from "@/integrations/reporting/partner";

const Dashboard = () => {
  const db = usePact();
  const user = currentUser(db)!;
  const lease = db.leases.find((l) => l.tenantId === user.id);

  if (!lease)
    return (
      <div className="rounded-3xl border bg-card p-6 text-center">
        <Building2 className="mx-auto mb-3 h-6 w-6 text-primary" />
        <p className="mb-4 text-sm text-muted-foreground">Add your rental to get started.</p>
        <Button asChild className="rounded-xl">
          <Link to="/app/lease">Add rental details</Link>
        </Button>
      </div>
    );

  const month = currentMonth();
  const thisMonth = getMonthStatus(db, lease, month);
  const months = recentMonths(6).map((m) => getMonthStatus(db, lease, m));
  const reportedCount = db.reports.filter(
    (r) => r.leaseId === lease.id && r.status === "reported",
  ).length;

  return (
    <div className="space-y-5">
      <section className="animate-fade-up rounded-3xl bg-primary p-5 text-primary-foreground">
        <p className="text-xs uppercase tracking-wide opacity-80">
          {monthLabel(month)} · {lease.address.city}, {lease.address.region},{" "}
          {lease.address.country}
        </p>
        <h1 className="mt-1 font-display text-2xl">{formatMoney(lease.monthlyRent)} rent</h1>
        <div className="mt-3">
          <StatusPill state={thisMonth.state} label={thisMonth.label} className="bg-white/90 text-primary" />
        </div>
        <p className="mt-3 text-sm leading-relaxed opacity-90">{thisMonth.explanation}</p>
        {thisMonth.state !== "reported" && (
          <Button asChild variant="secondary" className="mt-4 w-full rounded-xl sm:w-auto">
            <Link to="/app/verify">
              Verify {monthLabel(month)} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
        {thisMonth.methodLabel && (
          <p className="mt-3 text-xs opacity-80">Verified by: {thisMonth.methodLabel}</p>
        )}
      </section>

      <section className="animate-fade-up rounded-3xl border bg-card p-5" style={{ animationDelay: "80ms" }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Last 6 months</h2>
          <Link to="/app/history" className="text-sm font-medium text-primary underline">
            Full history
          </Link>
        </div>
        <div className="space-y-2">
          {months.map((m) => (
            <div key={m.month} className="flex items-center justify-between gap-3 rounded-2xl border p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{shortMonthLabel(m.month)}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {m.methodLabel ?? "No verification yet"}
                </p>
              </div>
              <StatusPill state={m.state} label={m.label} />
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {reportedCount} month{reportedCount === 1 ? "" : "s"} reported so far. Bank-verified,
          landlord-confirmed and manually verified payments are all sent the same way.
        </p>
      </section>

      <section className="animate-fade-up rounded-3xl border bg-card p-5" style={{ animationDelay: "140ms" }}>
        <h2 className="mb-2 font-semibold">What we send, in plain language</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          For each verified month we send your name, rental address, the rent amount, the date
          you paid, and how it was verified to <strong>{reportingPartner.name}</strong>. They
          are the licensed party that files it with the credit bureaus. We never send your bank
          login, your balance, or any payments other than rent.
        </p>
      </section>

      <MockBadge>
        Reporting submissions in this prototype go to a simulated partner API, not to a real
        credit bureau.
      </MockBadge>
      <ComplianceNote />
    </div>
  );
};

export default Dashboard;