export type Country = "CA" | "US";

export const COUNTRIES: { code: Country; label: string; active: boolean }[] = [
  { code: "CA", label: "Canada", active: true },
  { code: "US", label: "United States — coming soon", active: false },
];

export const REGIONS: Record<Country, { code: string; label: string }[]> = {
  CA: [
    { code: "AB", label: "Alberta" },
    { code: "BC", label: "British Columbia" },
    { code: "MB", label: "Manitoba" },
    { code: "NB", label: "New Brunswick" },
    { code: "NL", label: "Newfoundland and Labrador" },
    { code: "NS", label: "Nova Scotia" },
    { code: "NT", label: "Northwest Territories" },
    { code: "NU", label: "Nunavut" },
    { code: "ON", label: "Ontario" },
    { code: "PE", label: "Prince Edward Island" },
    { code: "QC", label: "Quebec" },
    { code: "SK", label: "Saskatchewan" },
    { code: "YT", label: "Yukon" },
  ],
  US: [],
};

export type Role = "tenant" | "landlord";

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  region: string; // province / state code
  postalCode: string;
  country: Country;
}

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  password: string; // prototype only — mock local auth
  company?: string;
  phone?: string;
  country: Country;
  onboarded: boolean;
  reportingConsent: boolean;
  createdAt: string;
}

export interface Lease {
  id: string;
  tenantId: string;
  address: Address;
  monthlyRent: number;
  currency: "CAD" | "USD";
  country: Country;
  landlordName: string;
  landlordEmail: string;
  landlordPhone?: string;
  landlordUserId?: string;
  partnerMatched: boolean;
  invitedAt?: string;
  startedOn: string;
  createdAt: string;
}

export interface BankLink {
  id: string;
  tenantId: string;
  provider: string;
  institutionId: string;
  institutionName: string;
  accountName: string;
  accountMask: string;
  country: Country;
  access: "read-only";
  status: "linked" | "disconnected";
  linkedAt: string;
}

export type PaymentMethod = "bank" | "landlord" | "manual";

export interface Payment {
  id: string;
  leaseId: string;
  tenantId: string;
  periodMonth: string; // YYYY-MM
  amount: number;
  currency: "CAD" | "USD";
  paidOn: string; // ISO date
  method: PaymentMethod;
  source: string; // human readable: "TD chequing ••4821", "Landlord confirmation", "e-Transfer receipt"
  proofFileName?: string;
  note?: string;
  verifiedAt: string;
}

export type ReportStatus = "queued" | "submitted" | "reported" | "issue";

export interface ReportingRecord {
  id: string;
  paymentId: string;
  tenantId: string;
  leaseId: string;
  periodMonth: string;
  country: Country;
  partnerName: string;
  partnerRef?: string;
  status: ReportStatus;
  message: string;
  updatedAt: string;
}

export interface ConfirmationRequest {
  id: string;
  leaseId: string;
  tenantId: string;
  landlordEmail: string;
  periodMonth: string;
  status: "pending" | "confirmed" | "issue";
  createdAt: string;
  resolvedAt?: string;
  issueNote?: string;
}

export interface PactNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  actionPath?: string;
  actionLabel?: string;
  read: boolean;
  createdAt: string;
}

export interface DB {
  users: User[];
  leases: Lease[];
  bankLinks: BankLink[];
  payments: Payment[];
  reports: ReportingRecord[];
  requests: ConfirmationRequest[];
  notifications: PactNotification[];
  sessionUserId: string | null;
}

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  bank: "Bank-verified",
  landlord: "Landlord-confirmed",
  manual: "Manually verified",
};