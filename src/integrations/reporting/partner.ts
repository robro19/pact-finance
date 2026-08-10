import type { Country, PaymentMethod, ReportStatus } from "@/lib/types";

/**
 * MOCK / SANDBOX RENT-REPORTING PARTNER
 * -------------------------------------
 * Pact is NOT a credit bureau and does NOT furnish data to bureaus itself.
 * Verified rent payments are handed to a licensed rent-reporting partner
 * (comparable to FrontLobby or Naborly in Canada) which submits them to the
 * bureaus on its own schedule. Bureau-side outcomes are outside Pact's control.
 *
 * Swap `reportingPartner` for a real partner client implementing
 * `RentReportingPartner` — nothing else needs to change.
 */

export interface SubmissionInput {
  tenantName: string;
  periodMonth: string;
  amount: number;
  currency: string;
  paidOn: string;
  verificationMethod: PaymentMethod;
  country: Country;
}

export interface SubmissionResult {
  partnerRef: string;
  status: ReportStatus;
  message: string;
}

export interface RentReportingPartner {
  id: string;
  name: string;
  sandbox: boolean;
  submitPayment(input: SubmissionInput): Promise<SubmissionResult>;
}

const methodWording: Record<PaymentMethod, string> = {
  bank: "verified from a read-only bank transaction match",
  landlord: "confirmed by your landlord",
  manual: "verified from the payment details you submitted",
};

export const reportingPartner: RentReportingPartner = {
  id: "sandbox-rent-reporting-partner",
  name: "Rent Reporting Partner (Sandbox)",
  sandbox: true,

  async submitPayment(input) {
    await new Promise((r) => setTimeout(r, 1100));
    if (input.country !== "CA") {
      return {
        partnerRef: "",
        status: "issue",
        message:
          "Pact currently supports Canada only. This payment was not sent for reporting.",
      };
    }
    return {
      partnerRef: `RRP-${input.periodMonth.replace("-", "")}-${Math.floor(
        1000 + Math.random() * 8999,
      )}`,
      status: "submitted",
      message: `Your ${input.periodMonth} rent payment of $${input.amount} (${methodWording[input.verificationMethod]}) was sent to our licensed reporting partner. The partner includes it in its next monthly file to the credit bureaus.`,
    };
  },
};