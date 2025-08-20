import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function CustomSelect({ label, value, onChange, options, placeholder = "Select...", className }) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find(opt => opt.value === value);

  return (
    <div className={cn("relative w-full mb-2", className)}>
      {label && <label className="block mb-1 text-sm font-medium text-foreground">{label}</label>}
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between rounded-lg border border-border bg-card text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/60 transition shadow-sm appearance-none",
          open && "ring-2 ring-accent/60"
        )}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? "" : "text-muted-foreground"}>{selected ? selected.label : placeholder}</span>
        <ChevronDown size={18} className="ml-2 text-muted-foreground" />
      </button>
      {open && (
        <ul className="absolute z-50 mt-1 w-full rounded-lg bg-card/95 shadow-lg border border-border max-h-60 overflow-auto animate-in fade-in-0 zoom-in-95" role="listbox">
          {options.map(opt => (
            <li
              key={opt.value}
              className={cn(
                "px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-accent/20 text-foreground",
                value === opt.value && "bg-accent/30 font-semibold"
              )}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              role="option"
              aria-selected={value === opt.value}
            >
              {value === opt.value && <Check size={16} className="text-accent" />}
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
