import { FlaskConical } from "lucide-react";

export const MockBadge = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2 rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
    <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
    <span>
      <strong className="font-semibold">Sandbox / mock data.</strong> {children}
    </span>
  </div>
);