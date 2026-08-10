import { useSyncExternalStore } from "react";
import type {
  BankLink,
  ConfirmationRequest,
  Country,
  DB,
  Lease,
  PactNotification,
  Payment,
  PaymentMethod,
  ReportingRecord,
  Role,
  User,
} from "./types";
import { addMonths, currentMonth, monthLabel, todayISO } from "./format";
import { reportingPartner } from "@/integrations/reporting/partner";

const KEY = "pact.mock.db.v1";

/** Landlords/property managers already onboarded with Pact (mock partner directory). */
export const PARTNER_LANDLORDS = [
  { name: "Maple Grove Properties", email: "landlord@demo.ca" },
  { name: "Skyline Rentals", email: "hello@skylinerentals.ca" },
  { name: "Harbourview Property Management", email: "rent@harbourview.ca" },
];

const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;
const listeners = new Set<() => void>();

function seed(): DB {
  const now = new Date().toISOString();
  const landlord: User = {
    id: "usr_landlord",
    role: "landlord",
    name: "Ama Osei",
    email: "landlord@demo.ca",
    password: "demo1234",
    company: "Maple Grove Properties",
    country: "CA",
    onboarded: true,
    reportingConsent: true,
    createdAt: now,
  };
  const tenant: User = {
    id: "usr_tenant",
    role: "tenant",
    name: "Priya Sharma",
    email: "tenant@demo.ca",
    password: "demo1234",
    country: "CA",
    onboarded: true,
    reportingConsent: true,
    createdAt: now,
  };
  const tenant2: User = {
    id: "usr_tenant2",
    role: "tenant",
    name: "Luis Fernández",
    email: "luis@demo.ca",
    password: "demo1234",
    country: "CA",
    onboarded: true,
    reportingConsent: true,
    createdAt: now,
  };

  const lease1: Lease = {
    id: "lse_1",
    tenantId: tenant.id,
    address: {
      line1: "218 Sherbourne St",
      line2: "Unit 704",
      city: "Toronto",
      region: "ON",
      postalCode: "M5A 3Z5",
      country: "CA",
    },
    monthlyRent: 1850,
    currency: "CAD",
    country: "CA",
    landlordName: "Maple Grove Properties",
    landlordEmail: "landlord@demo.ca",
    landlordUserId: landlord.id,
    partnerMatched: true,
    startedOn: addMonths(currentMonth(), -6) + "-01",
    createdAt: now,
  };
  const lease2: Lease = {
    id: "lse_2",
    tenantId: tenant2.id,
    address: {
      line1: "51 Rue Rachel E",
      city: "Montréal",
      region: "QC",
      postalCode: "H2W 1C7",
      country: "CA",
    },
    monthlyRent: 1420,
    currency: "CAD",
    country: "CA",
    landlordName: "Maple Grove Properties",
    landlordEmail: "landlord@demo.ca",
    landlordUserId: landlord.id,
    partnerMatched: true,
    startedOn: addMonths(currentMonth(), -3) + "-01",
    createdAt: now,
  };

  const history: { offset: number; method: PaymentMethod; source: string; status: ReportingRecord["status"] }[] = [
    { offset: -1, method: "manual", source: "e-Transfer confirmation (uploaded)", status: "reported" },
    { offset: -2, method: "bank", source: "TD chequing ••4821", status: "reported" },
    { offset: -3, method: "landlord", source: "Confirmed by Maple Grove Properties", status: "reported" },
    { offset: -4, method: "manual", source: "Rent receipt (uploaded)", status: "reported" },
    { offset: -5, method: "bank", source: "TD chequing ••4821", status: "issue" },
  ];

  const payments: Payment[] = [];
  const reports: ReportingRecord[] = [];
  history.forEach((h) => {
    const month = addMonths(currentMonth(), h.offset);
    const pid = uid("pay");
    payments.push({
      id: pid,
      leaseId: lease1.id,
      tenantId: tenant.id,
      periodMonth: month,
      amount: 1850,
      currency: "CAD",
      paidOn: `${month}-01`,
      method: h.method,
      source: h.source,
      verifiedAt: `${month}-02T10:00:00.000Z`,
    });
    reports.push({
      id: uid("rpt"),
      paymentId: pid,
      tenantId: tenant.id,
      leaseId: lease1.id,
      periodMonth: month,
      country: "CA",
      partnerName: reportingPartner.name,
      partnerRef: `RRP-${month.replace("-", "")}-${1000 + Math.floor(Math.random() * 8999)}`,
      status: h.status,
      message:
        h.status === "reported"
          ? `Your ${monthLabel(month)} rent was sent to our licensed reporting partner and included in its monthly file to the credit bureaus.`
          : `The partner flagged a mismatch between the amount on file ($1,850) and the transaction we sent for ${monthLabel(month)}. Re-verify this month to fix it.`,
      updatedAt: `${month}-05T10:00:00.000Z`,
    });
  });

  const bankLink: BankLink = {
    id: uid("bnk"),
    tenantId: tenant.id,
    provider: "mock-flinks-sandbox",
    institutionId: "td",
    institutionName: "TD Canada Trust",
    accountName: "Everyday Chequing",
    accountMask: "4821",
    country: "CA",
    access: "read-only",
    status: "linked",
    linkedAt: now,
  };

  const requests: ConfirmationRequest[] = [
    {
      id: uid("req"),
      leaseId: lease2.id,
      tenantId: tenant2.id,
      landlordEmail: landlord.email,
      periodMonth: currentMonth(),
      status: "pending",
      createdAt: now,
    },
  ];

  return {
    users: [tenant, tenant2, landlord],
    leases: [lease1, lease2],
    bankLinks: [bankLink],
    payments,
    reports,
    requests,
    notifications: [],
    sessionUserId: null,
  };
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DB;
  } catch {
    // fall through to a fresh seed
  }
  const fresh = seed();
  localStorage.setItem(KEY, JSON.stringify(fresh));
  return fresh;
}

let db: DB = load();

function persist() {
  localStorage.setItem(KEY, JSON.stringify(db));
  listeners.forEach((l) => l());
}

function write(fn: (d: DB) => DB) {
  db = fn(db);
  persist();
}

export function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export const getSnapshot = () => db;

export function usePact(): DB {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function resetDemoData() {
  db = seed();
  persist();
}

/* ----------------------------- auth (mock) ----------------------------- */

export function signUp(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
  country: Country;
  company?: string;
}): { ok: boolean; error?: string } {
  const email = input.email.trim().toLowerCase();
  if (db.users.some((u) => u.email === email))
    return { ok: false, error: "An account already exists with this email." };
  const user: User = {
    id: uid("usr"),
    role: input.role,
    name: input.name.trim(),
    email,
    password: input.password,
    company: input.company,
    country: input.country,
    onboarded: input.role === "landlord",
    reportingConsent: false,
    createdAt: new Date().toISOString(),
  };
  write((d) => ({ ...d, users: [...d.users, user], sessionUserId: user.id }));
  return { ok: true };
}

export function signIn(email: string, password: string): { ok: boolean; error?: string } {
  const user = db.users.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password,
  );
  if (!user) return { ok: false, error: "We couldn't find an account with those details." };
  write((d) => ({ ...d, sessionUserId: user.id }));
  return { ok: true };
}

export function signOut() {
  write((d) => ({ ...d, sessionUserId: null }));
}

export function currentUser(d: DB = db) {
  return d.users.find((u) => u.id === d.sessionUserId) ?? null;
}

export function updateUser(userId: string, patch: Partial<User>) {
  write((d) => ({
    ...d,
    users: d.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
  }));
}

/* ----------------------------- leases ----------------------------- */

export function saveLease(
  input: Omit<Lease, "id" | "createdAt" | "partnerMatched" | "landlordUserId"> & { id?: string },
): Lease {
  const email = input.landlordEmail.trim().toLowerCase();
  const partner = PARTNER_LANDLORDS.find((p) => p.email === email);
  const landlordUser = db.users.find((u) => u.email === email && u.role === "landlord");
  const lease: Lease = {
    ...input,
    landlordEmail: email,
    id: input.id ?? uid("lse"),
    partnerMatched: Boolean(partner || landlordUser),
    landlordUserId: landlordUser?.id,
    createdAt: new Date().toISOString(),
  };
  write((d) => ({
    ...d,
    leases: [...d.leases.filter((l) => l.id !== lease.id), lease],
  }));
  return lease;
}

export function inviteLandlord(leaseId: string) {
  const lease = db.leases.find((l) => l.id === leaseId);
  if (!lease) return;
  write((d) => ({
    ...d,
    leases: d.leases.map((l) =>
      l.id === leaseId ? { ...l, invitedAt: new Date().toISOString() } : l,
    ),
  }));
  const landlordUser = db.users.find((u) => u.email === lease.landlordEmail);
  if (landlordUser) {
    notify(landlordUser.id, {
      title: "A tenant invited you to confirm rent",
      body: `${nameOf(lease.tenantId)} at ${lease.address.line1} asked you to confirm monthly rent payments.`,
      actionPath: "/landlord",
      actionLabel: "Open landlord portal",
    });
  }
}

export function nameOf(userId: string) {
  return db.users.find((u) => u.id === userId)?.name ?? "Tenant";
}

/* ----------------------------- bank links ----------------------------- */

export function saveBankLink(link: Omit<BankLink, "id" | "linkedAt">) {
  const record: BankLink = { ...link, id: uid("bnk"), linkedAt: new Date().toISOString() };
  write((d) => ({
    ...d,
    bankLinks: [...d.bankLinks.filter((b) => b.tenantId !== link.tenantId), record],
  }));
  return record;
}

export function disconnectBank(tenantId: string) {
  write((d) => ({ ...d, bankLinks: d.bankLinks.filter((b) => b.tenantId !== tenantId) }));
}

/* ----------------------------- payments + reporting ----------------------------- */

export async function recordPayment(input: {
  lease: Lease;
  periodMonth: string;
  amount: number;
  paidOn: string;
  method: PaymentMethod;
  source: string;
  proofFileName?: string;
  note?: string;
}): Promise<ReportingRecord> {
  const payment: Payment = {
    id: uid("pay"),
    leaseId: input.lease.id,
    tenantId: input.lease.tenantId,
    periodMonth: input.periodMonth,
    amount: input.amount,
    currency: input.lease.currency,
    paidOn: input.paidOn,
    method: input.method,
    source: input.source,
    proofFileName: input.proofFileName,
    note: input.note,
    verifiedAt: new Date().toISOString(),
  };

  const report: ReportingRecord = {
    id: uid("rpt"),
    paymentId: payment.id,
    tenantId: payment.tenantId,
    leaseId: payment.leaseId,
    periodMonth: payment.periodMonth,
    country: input.lease.country,
    partnerName: reportingPartner.name,
    status: "queued",
    message: "Waiting to be sent to our licensed reporting partner.",
    updatedAt: new Date().toISOString(),
  };

  write((d) => ({
    ...d,
    payments: [
      ...d.payments.filter(
        (p) => !(p.leaseId === payment.leaseId && p.periodMonth === payment.periodMonth),
      ),
      payment,
    ],
    reports: [
      ...d.reports.filter(
        (r) => !(r.leaseId === report.leaseId && r.periodMonth === report.periodMonth),
      ),
      report,
    ],
  }));

  const result = await reportingPartner.submitPayment({
    tenantName: nameOf(payment.tenantId),
    periodMonth: payment.periodMonth,
    amount: payment.amount,
    currency: payment.currency,
    paidOn: payment.paidOn,
    verificationMethod: payment.method,
    country: input.lease.country,
  });

  const updated: ReportingRecord = {
    ...report,
    status: result.status,
    partnerRef: result.partnerRef,
    message: result.message,
    updatedAt: new Date().toISOString(),
  };

  write((d) => ({
    ...d,
    reports: d.reports.map((r) => (r.id === report.id ? updated : r)),
  }));

  notify(payment.tenantId, {
    title: `${monthLabel(payment.periodMonth)} rent verified`,
    body: result.message,
    actionPath: "/app/history",
    actionLabel: "See reporting history",
  });

  return updated;
}

/* ----------------------------- landlord confirmation ----------------------------- */

export function requestLandlordConfirmation(lease: Lease, periodMonth: string) {
  const existing = db.requests.find(
    (r) => r.leaseId === lease.id && r.periodMonth === periodMonth,
  );
  if (existing && existing.status === "pending") return existing;
  const req: ConfirmationRequest = {
    id: uid("req"),
    leaseId: lease.id,
    tenantId: lease.tenantId,
    landlordEmail: lease.landlordEmail,
    periodMonth,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  write((d) => ({
    ...d,
    requests: [...d.requests.filter((r) => r.id !== existing?.id), req],
  }));
  const landlordUser = db.users.find((u) => u.email === lease.landlordEmail);
  if (landlordUser) {
    notify(landlordUser.id, {
      title: `Confirm ${monthLabel(periodMonth)} rent`,
      body: `${nameOf(lease.tenantId)} — ${lease.address.line1}. One tap confirms rent was received on time.`,
      actionPath: "/landlord",
      actionLabel: "Confirm now",
    });
  }
  return req;
}

export async function landlordConfirm(leaseId: string, periodMonth: string) {
  const lease = db.leases.find((l) => l.id === leaseId);
  if (!lease) return;
  write((d) => ({
    ...d,
    requests: d.requests.map((r) =>
      r.leaseId === leaseId && r.periodMonth === periodMonth
        ? { ...r, status: "confirmed", resolvedAt: new Date().toISOString() }
        : r,
    ),
  }));
  await recordPayment({
    lease,
    periodMonth,
    amount: lease.monthlyRent,
    paidOn: `${periodMonth}-01`,
    method: "landlord",
    source: `Confirmed by ${lease.landlordName}`,
  });
}

export function landlordFlagIssue(leaseId: string, periodMonth: string, note: string) {
  const lease = db.leases.find((l) => l.id === leaseId);
  if (!lease) return;
  write((d) => ({
    ...d,
    requests: d.requests.map((r) =>
      r.leaseId === leaseId && r.periodMonth === periodMonth
        ? { ...r, status: "issue", issueNote: note, resolvedAt: new Date().toISOString() }
        : r,
    ),
  }));
  notify(lease.tenantId, {
    title: `${monthLabel(periodMonth)} needs your attention`,
    body: `Your landlord flagged this month: "${note}". Nothing has been sent for reporting. You can verify this month another way.`,
    actionPath: "/app/verify",
    actionLabel: "Verify another way",
  });
}

/* ----------------------------- notifications ----------------------------- */

export function notify(
  userId: string,
  n: { title: string; body: string; actionPath?: string; actionLabel?: string },
) {
  const record: PactNotification = {
    id: uid("ntf"),
    userId,
    read: false,
    createdAt: new Date().toISOString(),
    ...n,
  };
  write((d) => ({ ...d, notifications: [record, ...d.notifications] }));
}

export function markNotificationsRead(userId: string) {
  write((d) => ({
    ...d,
    notifications: d.notifications.map((n) =>
      n.userId === userId ? { ...n, read: true } : n,
    ),
  }));
}

/**
 * Basic monthly reminder engine. Runs on app load: prompts tenants who have not
 * verified the current month (whatever path they use) and landlords with
 * pending one-tap confirmations.
 */
export function runMonthlyReminders() {
  const month = currentMonth();
  const stamp = `reminder:${month}`;
  db.users.forEach((user) => {
    const already = db.notifications.some(
      (n) => n.userId === user.id && n.body.includes(stamp),
    );
    if (already) return;

    if (user.role === "tenant") {
      const lease = db.leases.find((l) => l.tenantId === user.id);
      if (!lease) return;
      const paid = db.payments.some(
        (p) => p.leaseId === lease.id && p.periodMonth === month,
      );
      if (paid) return;
      const bankLinked = db.bankLinks.some((b) => b.tenantId === user.id);
      notify(user.id, {
        title: `Time to verify ${monthLabel(month)} rent`,
        body: bankLinked
          ? `We found a possible rent transaction to review. Confirm it, or enter the payment yourself — both count the same. (${stamp})`
          : `Add this month's payment details, upload a receipt, or ask your landlord to confirm — all three count the same. (${stamp})`,
        actionPath: "/app/verify",
        actionLabel: "Verify this month",
      });
    } else {
      const pending = db.requests.filter(
        (r) => r.landlordEmail === user.email && r.periodMonth === month && r.status === "pending",
      );
      if (!pending.length) return;
      notify(user.id, {
        title: `${pending.length} tenant${pending.length > 1 ? "s" : ""} waiting on you`,
        body: `One tap confirms rent was received for ${monthLabel(month)}. (${stamp})`,
        actionPath: "/landlord",
        actionLabel: "Confirm now",
      });
    }
  });
}

export const todayDefault = todayISO;