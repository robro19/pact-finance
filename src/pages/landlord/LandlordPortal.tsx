import { useState } from "react";
import { Check, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/StatusPill";
import { currentUser, landlordConfirm, landlordFlagIssue, nameOf, usePact } from "@/lib/store";
import { getMonthStatus } from "@/lib/reporting";
import { currentMonth, formatMoney, monthLabel } from "@/lib/format";
import { showSuccess } from "@/utils/toast";

const LandlordPortal = () => {
  const db = usePact();
  const user = currentUser(db)!;
  const month = currentMonth();
  const leases = db.leases.filter(
    (l) => l.landlordEmail === user.email || l.landlordUserId === user.id,
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [issueFor, setIssueFor] = useState<string | null>(null);
  const [issueNote, setIssueNote] = useState("");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl">Your enrolled tenants</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One tap confirms rent was received on time for {monthLabel(month)}. Nothing else is
          required from you — no accounting, no uploads.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
        Confirming only says "this tenant paid the rent we agreed, on time." Pact passes that to
        a licensed rent-reporting partner. Pact does not collect rent and does not decide credit
        scores.
      </div>

      {leases.length === 0 && (
        <div className="rounded-3xl border bg-card p-8 text-center text-sm text-muted-foreground">
          No tenants have linked your email yet. When a tenant enters your email in their rental
          details, they'll appear here.
        </div>
      )}

      <div className="space-y-3">
        {leases.map((lease) => {
          const status = getMonthStatus(db, lease, month);
          const pending = status.state === "awaiting" || status.state === "awaiting_landlord";
          return (
            <div key={lease.id} className="rounded-3xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{nameOf(lease.tenantId)}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {lease.address.line1}
                    {lease.address.line2 ? `, ${lease.address.line2}` : ""} · {lease.address.city},{" "}
                    {lease.address.region}
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {formatMoney(lease.monthlyRent, lease.currency)} / month
                  </p>
                </div>
                <StatusPill state={status.state} label={status.label} />
              </div>

              {pending ? (
                <div className="mt-4 space-y-2">
                  <Button
                    className="h-12 w-full rounded-xl text-base"
                    disabled={busy === lease.id}
                    onClick={async () => {
                      setBusy(lease.id);
                      await landlordConfirm(lease.id, month);
                      setBusy(null);
                      showSuccess(`${monthLabel(month)} confirmed for ${nameOf(lease.tenantId)}.`);
                    }}
                  >
                    {busy === lease.id ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-5 w-5" />
                    )}
                    Rent received on time
                  </Button>
                  {issueFor === lease.id ? (
                    <div className="space-y-2 rounded-2xl border p-3">
                      <Input
                        className="rounded-xl"
                        placeholder="What happened? e.g. paid 10 days late"
                        value={issueNote}
                        onChange={(e) => setIssueNote(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl"
                          onClick={() => setIssueFor(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1 rounded-xl"
                          disabled={!issueNote.trim()}
                          onClick={() => {
                            landlordFlagIssue(lease.id, month, issueNote.trim());
                            setIssueFor(null);
                            setIssueNote("");
                            showSuccess("Reported. Nothing was sent for reporting this month.");
                          }}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full rounded-xl text-sm text-muted-foreground"
                      onClick={() => setIssueFor(lease.id)}
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" /> There was a problem this month
                    </Button>
                  )}
                </div>
              ) : (
                <p className="mt-3 rounded-2xl bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
                  {status.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandlordPortal;