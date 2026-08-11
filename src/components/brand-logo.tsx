import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center font-bold tracking-[-0.06em] text-teal-900",
        compact ? "text-xl" : "text-3xl",
        className,
      )}
      aria-label="Pact"
    >
      Pact<span className="text-coral-500">.</span>
    </span>
  );
}