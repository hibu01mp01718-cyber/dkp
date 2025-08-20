import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const ModernSelect = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => (
    <div className="w-full mb-2">
      {label && <label className="block mb-1 text-sm font-medium text-foreground">{label}</label>}
      <select
        ref={ref}
        className={cn(
          "w-full rounded-lg border border-border bg-card text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/60 transition shadow-sm appearance-none modern-select",
          error && "border-red-500",
          className
        )}
        style={{ color: 'var(--card-foreground, #f3f4f6)', background: 'var(--card, #23272f)' }}
        {...props}
      >
        {children}
      </select>
      <style jsx global>{`
        select.modern-select option {
          color: var(--card-foreground, #f3f4f6);
          background: var(--card, #23272f);
        }
      `}</style>
      {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
    </div>
  )
);
ModernSelect.displayName = "ModernSelect";
