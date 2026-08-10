import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showError } from "@/utils/toast";
import { todayISO } from "@/lib/format";
import type { Lease } from "@/lib/types";

const SOURCES = [
  "e-Transfer confirmation",
  "Rent receipt from landlord",
  "Cheque record",
  "Cash receipt",
  "Pre-authorized debit statement",
  "Other proof of payment",
];

export const ManualPath = ({
  lease,
  onVerified,
}: {
  lease: Lease;
  onVerified: (args: {
    amount: number;
    paidOn: string;
    source: string;
    proofFileName?: string;
    note?: string;
  }) => Promise<void>;
}) => {
  const [amount, setAmount] = useState(String(lease.monthlyRent));
  const [paidOn, setPaidOn] = useState(todayISO());
  const [source, setSource] = useState(SOURCES[0]);
  const [fileName, setFileName] = useState<string>();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      showError("Enter the rent amount you paid.");
      return;
    }
    if (!paidOn) {
      showError("Enter the date you paid.");
      return;
    }
    setBusy(true);
    await onVerified({
      amount: value,
      paidOn,
      source: fileName ? `${source} (uploaded)` : source,
      proofFileName: fileName,
      note: note.trim() || undefined,
    });
    setBusy(false);
  };

  return (
    <div className="space-y-4">
      <p className="rounded-2xl border bg-accent/60 p-3 text-sm">
        Entering your payment yourself is a full, equal way to verify rent on Pact. It is sent
        to our reporting partner in exactly the same way as a bank-matched payment.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount you paid ({lease.currency})</Label>
          <Input
            id="amount"
            inputMode="decimal"
            className="rounded-xl"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="paidOn">Date you paid</Label>
          <Input
            id="paidOn"
            type="date"
            className="rounded-xl"
            value={paidOn}
            onChange={(e) => setPaidOn(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label>How did you pay?</Label>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SOURCES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="proof">Attach proof (optional)</Label>
        <label
          htmlFor="proof"
          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-4 text-sm text-muted-foreground hover:border-primary/50"
        >
          <Upload className="h-4 w-4" />
          {fileName ?? "Screenshot of an e-Transfer, receipt or bank statement"}
        </label>
        <Input
          id="proof"
          type="file"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name)}
        />
        <p className="text-xs text-muted-foreground">
          Optional. In this prototype only the file name is stored.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="note">Anything we should know? (optional)</Label>
        <Textarea
          id="note"
          className="rounded-xl"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. I paid in two parts this month"
        />
      </div>

      <Button className="w-full rounded-xl" onClick={submit} disabled={busy}>
        {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {busy ? "Sending to reporting partner…" : "Verify this payment"}
      </Button>
    </div>
  );
};