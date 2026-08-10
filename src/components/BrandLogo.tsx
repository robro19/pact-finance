import { cn } from "@/lib/utils";

export const BrandLogo = ({
  className,
  markOnly = false,
}: {
  className?: string;
  markOnly?: boolean;
}) => (
  <img
    src="/Pact Logo.png"
    alt="Pact"
    className={cn(
      "h-auto w-auto object-contain",
      markOnly ? "h-10 w-10 object-cover object-top" : "h-12 w-auto",
      className,
    )}
  />
);