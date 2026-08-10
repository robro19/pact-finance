import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComplianceNote } from "@/components/ComplianceNote";
import { currentUser, PARTNER_LANDLORDS, saveLease, updateUser, usePact } from "@/lib/store";
import { COUNTRIES, REGIONS, type Country } from "@/lib/types";
import { showError, showSuccess } from "@/utils/toast";
import { currentMonth } from "@/lib/format";

const Onboarding = () => {
  const db = usePact();
  const user = currentUser(db)!;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [understood, setUnderstood] = useState(false);

  const [form, setForm] = useState({
    line1: "",
    line2: "",
    city: "",
    region: "ON",
    postalCode: "",
    country: "CA" as Country,
    monthlyRent: "",
    landlordName: "",
    landlordEmail: "",
    landlordPhone: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const partnerMatch = PARTNER_LANDLORDS.find(
    (p) =>
      p.email === form.landlordEmail.trim().toLowerCase() ||
      p.name.toLowerCase() === form.landlordName.trim().toLowerCase(),
  );

  const finish = () => {
    if (!form.line1 || !form.city || !form.monthlyRent) {
      showError("Add your address and monthly rent so we know what to verify.");
      return;
    }
    const lease = saveLease({
      tenantId: user.id,
      address: {
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        region: form.region,
        postalCode: form.postalCode,
        country: form.country,
      },
      monthlyRent: Number(form.monthlyRent),
      currency: "CAD",
      country: form.country,
      landlordName: form.landlordName || partnerMatch?.name || "My landlord",
      landlordEmail: form.landlordEmail,
      landlordPhone: form.landlordPhone || undefined,
      startedOn: `${currentMonth()}-01`,
    });
    updateUser(user.id, { onboarded: true, reportingConsent: true, country: form.country });
    showSuccess(
      lease.partnerMatched
        ? "Rental saved — your landlord is already on Pact."
        : "Rental saved.",
    );
    navigate("/app");
  };

  return (
    <div className="mx-auto max-w-xl px-5 py-8">
      <Progress value={((step + 1) / 3) * 100} className="mb-6 h-2" />

      {step === 0 && (
        <div className="animate-fade-up space-y-4">
          <h1 className="font-display text-2xl">What Pact actually does</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            In Canada, lenders look at your <strong>credit file</strong> — a record of money you
            borrow and bills you pay on time. When you arrive in Canada, that file is usually
            empty. An empty file isn't bad credit; it just means there's nothing to show.
          </p>
          <div className="space-y-3 rounded-2xl border bg-card p-4 text-sm leading-relaxed">
            <p>
              <strong>1. You keep paying rent as usual.</strong> To your landlord, from your own
              account. Pact never touches your money.
            </p>
            <p>
              <strong>2. Each month you verify the payment.</strong> Three equal ways: connect
              your bank read-only, have your landlord confirm it, or enter the payment details
              yourself.
            </p>
            <p>
              <strong>3. We pass the verified payment to a licensed reporting partner</strong>,
              which sends it to the credit bureaus. Pact is not a bureau and does not report
              directly.
            </p>
          </div>
          <ComplianceNote />
          <Button className="w-full rounded-xl" onClick={() => setStep(1)}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="animate-fade-up space-y-4">
          <h1 className="font-display text-2xl">What to expect</h1>
          <ul className="space-y-3 rounded-2xl border bg-card p-4 text-sm leading-relaxed">
            <li>• Credit history builds over <strong>months</strong>. Nothing changes overnight.</li>
            <li>• Your first reported month usually appears on your file a few weeks after it's submitted, depending on the bureaus' own schedules.</li>
            <li>• We can't promise a score, or say how much it will change. That's decided by the bureaus and lenders, not Pact.</li>
            <li>• Late or missed rent can also be reported. On-time payments help; missed ones can hurt.</li>
            <li>• You can stop reporting at any time.</li>
          </ul>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border bg-card p-4 text-sm">
            <Checkbox checked={understood} onCheckedChange={(v) => setUnderstood(Boolean(v))} />
            <span>
              I understand Pact verifies rent payments and does not lend money, hold my money,
              or guarantee any credit score result.
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border bg-card p-4 text-sm">
            <Checkbox checked={consent} onCheckedChange={(v) => setConsent(Boolean(v))} />
            <span>
              I agree that Pact may share my verified rent payment details with its licensed
              rent-reporting partner so they can be reported to the credit bureaus.
            </span>
          </label>

          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button
              className="flex-1 rounded-xl"
              disabled={!consent || !understood}
              onClick={() => setStep(2)}
            >
              Agree and continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-up space-y-4">
          <h1 className="font-display text-2xl">Your rental</h1>
          <p className="text-sm text-muted-foreground">
            This tells us what a rent payment should look like each month.
          </p>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label>Country</Label>
              <Select value={form.country} onValueChange={(v) => set("country", v)}>
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
            </div>
            <div className="grid gap-2">
              <Label htmlFor="line1">Street address</Label>
              <Input id="line1" className="rounded-xl" value={form.line1} onChange={(e) => set("line1", e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="line2">Unit / apartment (optional)</Label>
              <Input id="line2" className="rounded-xl" value={form.line2} onChange={(e) => set("line2", e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" className="rounded-xl" value={form.city} onChange={(e) => set("city", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Province</Label>
                <Select value={form.region} onValueChange={(v) => set("region", v)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS[form.country].map((r) => (
                      <SelectItem key={r.code} value={r.code}>
                        {r.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="postal">Postal code</Label>
                <Input id="postal" className="rounded-xl" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rent">Monthly rent (CAD)</Label>
                <Input id="rent" inputMode="decimal" className="rounded-xl" value={form.monthlyRent} onChange={(e) => set("monthlyRent", e.target.value)} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="llname">Landlord or property manager name</Label>
              <Input id="llname" className="rounded-xl" value={form.landlordName} onChange={(e) => set("landlordName", e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="llemail">Landlord email (if you have it)</Label>
                <Input id="llemail" type="email" className="rounded-xl" value={form.landlordEmail} onChange={(e) => set("landlordEmail", e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="llphone">Landlord phone (optional)</Label>
                <Input id="llphone" className="rounded-xl" value={form.landlordPhone} onChange={(e) => set("landlordPhone", e.target.value)} />
              </div>
            </div>

            {partnerMatch && (
              <p className="flex items-center gap-2 rounded-2xl border bg-accent/60 p-3 text-sm">
                <Check className="h-4 w-4 text-primary" /> {partnerMatch.name} already uses
                Pact — we'll link your rental to them.
              </p>
            )}
            {!partnerMatch && (
              <p className="rounded-2xl border bg-secondary p-3 text-xs leading-relaxed">
                No landlord email? That's fine. You can still verify rent with your bank or by
                entering payments yourself, and invite your landlord later.
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1 rounded-xl" onClick={finish}>
              Finish setup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;