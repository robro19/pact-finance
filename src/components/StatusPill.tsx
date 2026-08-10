import { CheckCircle2, Clock, AlertTriangle, CircleDashed, MailQuestion } from "lucide-react";
import type { MonthState } from "@/lib/reporting";
import { cn } from "@/lib/utils";

const MAP: Record<MonthState, { cls: string; Icon: typeof CheckCircle2 }> = {
  reported: { cls: "bg-emerald-100 text-emerald-900 border-emerald-200", Icon: CheckCircle2 },
  in_progress: { cls: "bg-sky-100 text-sky-900 border-sky-200", Icon: Clock },
  issue: { cls: "bg-amber-100 text-amber-900 border-amber-300", Icon: AlertTriangle },
  awaiting: { cls: "bg-muted text-muted-foreground border-border", Icon: CircleDashed },
  awaiting_landlord: { cls: "bg-secondary text-secondary-foreground border-border", Icon: MailQuestion },
};

export const StatusPill = ({
  state,
  label,
  className,
}: {
  state: MonthState;
  label: string;
  className?: string;
}) => {
  const { cls, Icon } = MAP[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        cls,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
};