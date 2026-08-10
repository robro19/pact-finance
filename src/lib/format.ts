export const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export const currentMonth = () => monthKey(new Date());

export function addMonths(key: string, delta: number) {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y, m - 1 + delta, 1));
}

export function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric",
  });
}

export function shortMonthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-CA", {
    month: "short",
    year: "2-digit",
  });
}

export function recentMonths(count: number, from = currentMonth()) {
  return Array.from({ length: count }, (_, i) => addMonths(from, -i));
}

export const formatMoney = (n: number, currency = "CAD") =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const todayISO = () => new Date().toISOString().slice(0, 10);