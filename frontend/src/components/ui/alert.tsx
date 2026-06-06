import { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type AlertVariant = "error" | "success" | "info";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const variantStyles: Record<AlertVariant, string> = {
  error: "border-red-500/30 bg-red-500/10 text-red-200",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  info: "border-indigo-500/30 bg-indigo-500/10 text-indigo-200",
};

export function Alert({ className, variant = "info", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
