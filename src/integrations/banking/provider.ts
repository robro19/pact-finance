import type { Country } from "@/lib/types";

/**
 * MOCK / SANDBOX BANK-LINKING LAYER
 * ---------------------------------
 * Pact never moves money. This layer only reads transaction descriptions
 * to confirm that a rent payment happened.
 *
 * A real aggregator (Flinks, Plaid or Finicity) can replace `bankingProvider`
 * below without touching any UI, as long as it satisfies `BankingProvider`.
 */

export interface Institution {
  id: string;
  name: string;
  short: string;
  country: Country;
  tint: string;
}

export const INSTITUTIONS: Institution[] = [
  { id: "rbc", name: "RBC Royal Bank", short: "RBC", country: "CA", tint: "bg-blue-100 text-blue-800" },
  { id: "td", name: "TD Canada Trust", short: "TD", country: "CA", tint: "bg-green-100 text-green-800" },
  { id: "scotiabank", name: "Scotiabank", short: "SC", country: "CA", tint: "bg-red-100 text-red-800" },
  { id: "bmo", name: "BMO Bank of Montreal", short: "BMO", country: "CA", tint: "bg-sky-100 text-sky-800" },
  { id: "cibc", name: "CIBC", short: "CIBC", country: "CA", tint: "bg-rose-100 text-rose-800" },
  { id: "nbc", name: "National Bank of Canada", short: "NBC", country: "CA", tint: "bg-amber-100 text-amber-900" },
  { id: "tangerine", name: "Tangerine", short: "TAN", country: "CA", tint: "bg-orange-100 text-orange-800" },
  { id: "desjardins", name: "Desjardins", short: "DES", country: "CA", tint: "bg-emerald-100 text-emerald-800" },
];

export interface BankConnection {
  institutionId: string;
  institutionName: string;
  accountName: string;
  accountMask: string;
  access: "read-only";
}

export interface RecurringCandidate {
  id: string;
  recipient: string;
  description: string;
  amount: number;
  lastDate: string;
  occurrences: number;
  confidence: "high" | "medium" | "low";
  looksLikeRent: boolean;
}

export interface BankingProvider {
  id: string;
  label: string;
  sandbox: boolean;
  listInstitutions(country: Country): Institution[];
  connect(institutionId: string, username: string): Promise<BankConnection>;
  detectRecurringRent(
    connection: BankConnection,
    expectedRent: number,
    landlordName: string,
  ): Promise<RecurringCandidate[]>;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const bankingProvider: BankingProvider = {
  id: "mock-flinks-sandbox",
  label: "Sandbox aggregator (Flinks-compatible)",
  sandbox: true,

  listInstitutions(country) {
    return INSTITUTIONS.filter((i) => i.country === country);
  },

  async connect(institutionId, username) {
    await delay(900);
    const inst = INSTITUTIONS.find((i) => i.id === institutionId)!;
    const mask = String(1000 + (username.length * 371) % 8999).slice(0, 4);
    return {
      institutionId,
      institutionName: inst.name,
      accountName: "Everyday Chequing",
      accountMask: mask,
      access: "read-only",
    };
  },

  async detectRecurringRent(connection, expectedRent, landlordName) {
    await delay(1200);
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth(), 1);
    return [
      {
        id: "cand_rent",
        recipient: landlordName || "PROPERTY MGMT",
        description: `PRE-AUTH DEBIT ${(landlordName || "PROPERTY MGMT").toUpperCase()}`,
        amount: expectedRent,
        lastDate: last.toISOString().slice(0, 10),
        occurrences: 6,
        confidence: "high",
        looksLikeRent: true,
      },
      {
        id: "cand_other",
        recipient: "CITY FITNESS",
        description: "PRE-AUTH DEBIT CITY FITNESS MEMBERSHIP",
        amount: 64,
        lastDate: last.toISOString().slice(0, 10),
        occurrences: 9,
        confidence: "medium",
        looksLikeRent: false,
      },
    ];
  },
};