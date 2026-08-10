import type { DB, Lease, Payment, ReportingRecord } from "./types";
import { METHOD_LABEL } from "./types";
import { monthLabel } from "./format";

export type MonthState = "reported" | "in_progress" | "issue" | "awaiting" | "awaiting_landlord";

export interface MonthStatus {
  month: string;
  state: MonthState;
  label: string;
  explanation: string;
  payment?: Payment;
  report?: ReportingRecord;
  methodLabel?: string;
}

export function getMonthStatus(db: DB, lease: Lease, month: string): MonthStatus {
  const payment = db.payments.find(
    (p) => p.leaseId === lease.id && p.periodMonth === month,
  );
  const report = db.reports.find(
    (r) => r.leaseId === lease.id && r.periodMonth === month,
  );
  const request = db.requests.find(
    (r) => r.leaseId === lease.id && r.periodMonth === month,
  );

  if (payment && report) {
    const methodLabel = METHOD_LABEL[payment.method];
    if (report.status === "reported")
      return {
        month,
        state: "reported",
        label: "Reported",
        methodLabel,
        payment,
        report,
        explanation: report.message,
      };
    if (report.status === "issue")
      return {
        month,
        state: "issue",
        label: "Needs attention",
        methodLabel,
        payment,
        report,
        explanation: report.message,
      };
    return {
      month,
      state: "in_progress",
      label: "Sent to partner",
      methodLabel,
      payment,
      report,
      explanation: report.message,
    };
  }

  if (request?.status === "pending")
    return {
      month,
      state: "awaiting_landlord",
      label: "Waiting on landlord",
      explanation: `We asked ${lease.landlordName} to confirm ${monthLabel(month)} rent. You can also verify it yourself with your bank or payment details — it counts exactly the same.`,
    };

  if (request?.status === "issue")
    return {
      month,
      state: "issue",
      label: "Needs attention",
      explanation: `Your landlord flagged ${monthLabel(month)}: "${request.issueNote}". Nothing was sent for reporting. You can verify this month another way.`,
    };

  return {
    month,
    state: "awaiting",
    label: "Not verified yet",
    explanation: `${monthLabel(month)} hasn't been verified. Choose any of the three ways to verify — bank match, landlord confirmation, or entering the payment yourself.`,
  };
}

export function leaseMonths(lease: Lease, upTo: string): string[] {
  const start = lease.startedOn.slice(0, 7);
  const months: string[] = [];
  let cursor = upTo;
  while (cursor >= start && months.length < 24) {
    months.push(cursor);
    const [y, m] = cursor.split("-").map(Number);
    const d = new Date(y, m - 2, 1);
    cursor = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  return months;
}