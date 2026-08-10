import { useState } from "react";
import { Check, Send, Landmark, Unlink } from "lucide-react";
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
import {
  currentUser,
  disconnectBank,
  inviteLandlord,
  PARTNER_LANDLORDS,
  saveLease,
  usePact,
} from "@/lib/store";
import { COUNTRIES, REGIONS, type Country } from "@/lib/types";
import { formatDate, formatMoney, currentMonth } from "@/lib/format";
import { showSuccess } from "@/utils/toast";

const LeaseDetails = () => {
  const db = usePact();
  const user = currentUser(db)!;
  const lease = db.leases.find((l) => l.tenantId === user.id);
  const bank = db.bankLinks.find((b) => b.tenantId === user.id);

  const [form, setForm] = useState({
    line1: lease?.address.line1 ?? "",
    line2: lease?.address.line2 ?? "",
    city: lease?.address.city ?? "",
    region: lease?.address.region ?? "ON",
    postalCode: lease?.address.postalCode ?? "",
    country: (lease?.address.country ?? "CA") as Country,
    monthlyRent: String(lease?.monthlyRent ?? ""),
    landlordName: lease?.landlordName ?? "",
    landlordEmail: lease?.landlordEmail ?? "",
    landlordPhone: lease?.landlordPhone ?? "",
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    saveLease({
      id: lease?.id,
      tenantId: user.id,
      address: {
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        region: form.region,
        postalCode: form.postalCode,
        country: form.country,
      },
      monthlyRent: Number(form.monthlyRent) || 0,
      currency: "CAD",
      country: form.country,
      landlordName: form.landlordName || "My landlord",
      landlordEmail: form.landlordEmail,
      landlordPhone: form.landlordPhone || undefined,
      startedOn: lease?.startedOn ?? `${currentMonth()}-01`,
    });
    showSuccess("Rental details saved.");
  };

  const knownPartner = PARTNER_LANDLORDS.find(
    (p) => p.email === form.landlordEmail.trim().toLowerCase(),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl">Your rental</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep this accurate — it's what we compare payments against.
        </p>
      </div>

      <section className="space-y-3 rounded-3xl border bg-card p-5">
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
          <Label>Street address</Label>
          <Input className="rounded-xl" value={form.line1} onChange={(e) => set("line1", e.target.value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Unit (optional)</Label>
            <Input className="rounded-xl" value={form.line2} onChange={(e) => set("line2", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>City</Label>
            <Input className="rounded-xl" value={form.city} onChange={(e) => set("city", e.target.value)} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
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
          <div className="grid gap-2">
            <Label>Postal code</Label>
            <Input className="rounded-xl" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Monthly rent</Label>
            <Input className="rounded-xl" inputMode="decimal" value={form.monthlyRent} onChange={(e) => set("monthlyRent", e.target.value)} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Landlord name</Label>
            <Input className="rounded-xl" value={form.landlordName} onChange={(e) => set("landlordName", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Landlord email</Label>
            <Input className="rounded-xl" value={form.landlordEmail} onChange={(e) => set("landlordEmail", e.target.value)} />
          </div>
        </div>
        <Button className="w-full rounded-xl" onClick={save}>
          Save rental details
        </Button>
        {knownPartner && (
          <p className="flex items-center gap-2 text-sm text-primary">
            <Check className="h-4 w-4" /> {knownPartner.name} is already a Pact partner.
          </p>
        )}
      </section>

      {lease && (
        <section className="rounded-3xl border bg-card p-5">
          <h2 className="mb-1 font-semibold">Landlord participation</h2>
          <p className="text-sm text-muted-foreground">
            {lease.partnerMatched
              ? `${lease.landlordName} is set up on Pact and can confirm your rent in one tap.`
              : `${lease.landlordName} isn't on Pact yet. Inviting them adds a third way to verify — but you don't need them: bank matching and entering payments yourself work just as well.`}
          </p>
          {lease.invitedAt ? (
            <p className="mt-3 rounded-2xl bg-secondary p-3 text-xs">
              Invite sent {formatDate(lease.invitedAt)}. Rent: {formatMoney(lease.monthlyRent)} ·{" "}
              {lease.address.line1}
            </p>
          ) : (
            !lease.partnerMatched && (
              <Button
                variant="outline"
                className="mt-3 w-full rounded-xl"
                disabled={!lease.landlordEmail}
                onClick={() => {
                  inviteLandlord(lease.id);
                  showSuccess("Invite sent to your landlord.");
                }}
              >
                <Send className="mr-2 h-4 w-4" /> Invite my landlord
              </Button>
            )
          )}
        </section>
      )}

      <section className="rounded-3xl border bg-card p-5">
        <h2 className="mb-1 flex items-center gap-2 font-semibold">
          <Landmark className="h-4 w-4 text-primary" /> Bank connection
        </h2>
        {bank ? (
          <>
            <p className="text-sm text-muted-foreground">
              {bank.institutionName} · {bank.accountName} ••{bank.accountMask} · read-only ·
              linked {formatDate(bank.linkedAt)}
            </p>
            <Button
              variant="outline"
              className="mt-3 rounded-xl"
              onClick={() => {
                disconnectBank(user.id);
                showSuccess("Bank disconnected. You can still verify rent the other two ways.");
              }}
            >
              <Unlink className="mr-2 h-4 w-4" /> Disconnect
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            No bank connected. That's completely fine — entering payments yourself or landlord
            confirmation are equally valid.
          </p>
        )}
      </section>
    </div>
  );
};

export default LeaseDetails;