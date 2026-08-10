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
        "relative inline-flex shrink-0 overflow-hidden rounded-xl bg-white",
        compact ? "h-10 w-10" : "h-12 w-28",
        className,
      )}
      aria-label="Pact"
    >
      <img
        src="/Pact Logo.png"
        alt="Pact"
        className={cn(
          "absolute max-w-none object-contain",
          compact ? "left-[-62%] top-[-28%] h-[165%] w-[165%]" : "left-[-33%] top-[-28%] h-[165%] w-[165%]",
        )}
      />
    </span>
  );
}