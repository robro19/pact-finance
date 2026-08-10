import { Send, MailQuestion, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestLandlordConfirmation, usePact } from "@/lib/store";
import { monthLabel } from "@/lib/format";
import { showSuccess } from "@/utils/toast";
import type { Lease } from "@/lib/types";

export const LandlordPath = ({ lease, month }: { lease: Lease; month: string }) => {
  const db = usePact();
  const request = db.requests.find((r) => r.leaseId === lease.id && r.periodMonth === month);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-card p-4 text-sm">
        <p className="font-semibold">{lease.landlordName}</p>
        <p className="text-muted-foreground">{lease.landlordEmail}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {lease.partnerMatched
            ? "Your landlord already uses Pact, so confirming takes them one tap."
            : "Your landlord isn't on Pact yet. We'll send them a short invite with a one-tap confirmation link."}
        </p>
      </div>

      {request?.status === "confirmed" ? (
        <p className="flex items-center gap-2 rounded-2xl border bg-accent/60 p-4 text-sm">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          {lease.landlordName} confirmed {monthLabel(month)} rent.
        </p>
      ) : request?.status === "pending" ? (
        <p className="flex items-start gap-2 rounded-2xl border bg-secondary p-4 text-sm">
          <MailQuestion className="mt-0.5 h-4 w-4" />
          <span>
            We asked {lease.landlordName} to confirm {monthLabel(month)}. You don't have to
            wait — verifying it yourself with your bank or payment details is treated exactly
            the same.
          </span>
        </p>
      ) : (
        <Button
          className="w-full rounded-xl"
          onClick={() => {
            requestLandlordConfirmation(lease, month);
            showSuccess("Confirmation request sent to your landlord.");
          }}
        >
          <Send className="mr-2 h-4 w-4" />
          Ask {lease.landlordName} to confirm {monthLabel(month)}
        </Button>
      )}

      {request?.status === "issue" && (
        <p className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Your landlord flagged this month: "{request.issueNote}". Nothing was sent for
          reporting. You can verify this month with your bank or by entering the payment
          yourself.
        </p>
      )}
    </div>
  );
};