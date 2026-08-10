import { useState } from "react";
import { Landmark, Building2, FileCheck2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BankPath } from "@/components/verify/BankPath";
import { LandlordPath } from "@/components/verify/LandlordPath";
import { ManualPath } from "@/components/verify/ManualPath";
import { StatusPill } from "@/components/StatusPill";
import { currentUser, recordPayment, usePact } from "@/lib/store";
import { getMonthStatus } from "@/lib/reporting";
import { currentMonth, monthLabel, recentMonths } from "@/lib/format";
import { showSuccess } from "@/utils/toast";
import type { PaymentMethod } from "@/lib/types";

const Verify = () => {
  const db = usePact();
  const user = currentUser(db)!;
  const lease = db.leases.find((l) => l.tenantId === user.id);
  const [month, setMonth] = useState(currentMonth());

  if (!lease) return <p className="text-sm">Add your rental details first.</p>;

  const status = getMonthStatus(db, lease, month);

  const submit =
    (method: PaymentMethod) =>
    async (args: { amount: number; paidOn: string; source: string; proofFileName?: string; note?: string }) => {
      const report = await recordPayment({ lease, periodMonth: month, method, ...args });
      showSuccess(report.message);
    };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl">Verify your rent</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Three ways, all equal. Pick whichever suits you — every path is reported the same way.
        </p>
      </div>

      <div className="grid gap-3 rounded-3xl border bg-card p-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-2">
          <Label>Which month?</Label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {recentMonths(4).map((m) => (
                <SelectItem key={m} value={m}>
                  {monthLabel(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <StatusPill state={status.state} label={status.label} className="justify-self-start" />
      </div>

      {status.state === "reported" || status.state === "in_progress" ? (
        <div className="rounded-3xl border bg-accent/50 p-4 text-sm leading-relaxed">
          {monthLabel(month)} is already verified as {status.methodLabel?.toLowerCase()}. You can
          re-verify below if something was wrong — the newest verification replaces the old one.
        </div>
      ) : null}

      <Tabs defaultValue="bank">
        <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-muted p-1">
          <TabsTrigger value="bank" className="flex-col gap-1 rounded-xl py-2 text-xs">
            <Landmark className="h-4 w-4" /> Bank match
          </TabsTrigger>
          <TabsTrigger value="landlord" className="flex-col gap-1 rounded-xl py-2 text-xs">
            <Building2 className="h-4 w-4" /> Landlord
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex-col gap-1 rounded-xl py-2 text-xs">
            <FileCheck2 className="h-4 w-4" /> I'll enter it
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bank" className="mt-4 rounded-3xl border bg-card p-4">
          <BankPath lease={lease} month={month} onVerified={submit("bank")} />
        </TabsContent>
        <TabsContent value="landlord" className="mt-4 rounded-3xl border bg-card p-4">
          <LandlordPath lease={lease} month={month} />
        </TabsContent>
        <TabsContent value="manual" className="mt-4 rounded-3xl border bg-card p-4">
          <ManualPath lease={lease} onVerified={submit("manual")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Verify;