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
          "formInput modern-select w-full border border-[#2e323c] bg-[#18181b] text-white rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#7f5af0] transition shadow-sm appearance-none",
          "dropdown-padding",
          error && "border-red-500",
          className
        )}
        style={{ color: '#fff', background: '#18181b', minHeight: '48px', fontSize: '1rem', boxSizing: 'border-box' }}
        {...props}
      >
        {children}
      </select>
      <style jsx global>{`
        select.modern-select option {
          color: var(--card-foreground, #f3f4f6);
          background: var(--card, #23272f);
          padding-left: 1rem;
          padding-right: 1rem;
        }
        .dropdown-padding {
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
      `}</style>
      {error && <div className="text-xs text-red-400 mt-1">{error}</div>}
    </div>
  )
);
ModernSelect.displayName = "ModernSelect";
