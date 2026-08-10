import { useState } from "react";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import {
  bankingProvider,
  type BankConnection,
  type Institution,
  type RecurringCandidate,
} from "@/integrations/banking/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MockBadge } from "@/components/MockBadge";
import { COUNTRIES, type Country, type Lease } from "@/lib/types";
import { formatMoney } from "@/lib/format";
import { saveBankLink } from "@/lib/store";
import { showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

export const BankPath = ({
  lease,
  month,
  onVerified,
}: {
  lease: Lease;
  month: string;
  onVerified: (args: { amount: number; paidOn: string; source: string }) => Promise<void>;
}) => {
  const [country, setCountry] = useState<Country>("CA");
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [connection, setConnection] = useState<BankConnection | null>(null);
  const [candidates, setCandidates] = useState<RecurringCandidate[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const institutions = bankingProvider.listInstitutions(country);

  const connect = async () => {
    if (!institution || !username || !password) {
      showError("Choose your bank and enter the sandbox sign-in details.");
      return;
    }
    setBusy(true);
    const conn = await bankingProvider.connect(institution.id, username);
    setConnection(conn);
    saveBankLink({
      tenantId: lease.tenantId,
      provider: bankingProvider.id,
      institutionId: conn.institutionId,
      institutionName: conn.institutionName,
      accountName: conn.accountName,
      accountMask: conn.accountMask,
      country,
      access: "read-only",
      status: "linked",
    });
    const found = await bankingProvider.detectRecurringRent(
      conn,
      lease.monthlyRent,
      lease.landlordName,
    );
    setCandidates(found);
    setBusy(false);
  };

  const confirmCandidate = async (c: RecurringCandidate) => {
    if (!connection) return;
    setSubmitting(true);
    await onVerified({
      amount: c.amount,
      paidOn: c.lastDate,
      source: `${connection.institutionName} ${connection.accountName} ••${connection.accountMask}`,
    });
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <MockBadge>
        This is a simulated connection using {bankingProvider.label}. No real bank
        credentials are sent anywhere. A real provider (Flinks, Plaid or Finicity) can be
        connected later without changing this screen.
      </MockBadge>

      {!connection ? (
        <>
          <div className="grid gap-2">
            <Label>Country</Label>
            <Select value={country} onValueChange={(v) => setCountry(v as Country)}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code} disabled={!c.active}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Pact supports Canadian banks today. US support is planned but not built yet.
            </p>
          </div>

          <div>
            <Label className="mb-2 block">Choose your bank</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {institutions.map((inst) => (
                <button
                  key={inst.id}
                  onClick={() => setInstitution(inst)}
                  className={cn(
                    "rounded-2xl border p-3 text-left transition-all",
                    institution?.id === inst.id
                      ? "border-primary ring-2 ring-primary/25"
                      : "hover:border-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "mb-2 grid h-8 w-8 place-items-center rounded-lg text-[11px] font-bold",
                      inst.tint,
                    )}
                  >
                    {inst.short}
                  </span>
                  <span className="block text-xs font-medium leading-tight">{inst.name}</span>
                </button>
              ))}
            </div>
          </div>

          {institution && (
            <div className="space-y-3 rounded-2xl border bg-card p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Lock className="h-4 w-4 text-primary" />
                Read-only access to {institution.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Pact can only read transaction descriptions to find your rent payment. We
                cannot move money, and we never store your sign-in details.
              </p>
              <div className="grid gap-2">
                <Label htmlFor="bank-user">Sandbox username</Label>
                <Input
                  id="bank-user"
                  className="rounded-xl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="demo_user"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bank-pass">Sandbox password</Label>
                <Input
                  id="bank-pass"
                  type="password"
                  className="rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="anything works in sandbox"
                />
              </div>
              <Button onClick={connect} disabled={busy} className="w-full rounded-xl">
                {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {busy ? "Looking for your rent payment…" : "Connect securely"}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <p className="flex items-center gap-2 rounded-2xl border bg-accent/60 p-3 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            Connected: {connection.institutionName} {connection.accountName} ••
            {connection.accountMask} (read-only)
          </p>
          <p className="text-sm text-muted-foreground">
            We found these repeating payments. Pick the one that is your rent for this month.
          </p>
          {candidates.map((c) => (
            <div key={c.id} className="rounded-2xl border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{c.recipient}</p>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Seen {c.occurrences} months in a row · last on {c.lastDate}
                  </p>
                </div>
                <p className="whitespace-nowrap text-sm font-bold">{formatMoney(c.amount)}</p>
              </div>
              <Button
                variant={c.looksLikeRent ? "default" : "outline"}
                className="mt-3 w-full rounded-xl"
                disabled={submitting}
                onClick={() => confirmCandidate(c)}
              >
                {c.looksLikeRent ? "This is my rent — verify it" : "Use this payment instead"}
              </Button>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Nothing looks right? Entering the payment yourself works exactly the same — it is
            reported in the same way.
          </p>
        </div>
      )}
    </div>
  );
};