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
          "customSelectButton w-full flex items-center justify-between rounded-lg border border-border bg-card text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/60 transition shadow-sm appearance-none min-h-[48px] text-base",
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
        <ul className="customSelectDropdown absolute z-50 mt-1 w-full rounded-lg bg-card/95 shadow-lg border border-border max-h-60 overflow-auto animate-in fade-in-0 zoom-in-95" role="listbox">
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
      <style jsx global>{`
        .customSelectButton {
          background: #18181b;
          color: #fff;
          border-radius: 8px;
          border: 1px solid #2e323c;
          font-size: 1rem;
          transition: border 0.15s, outline 0.15s;
        }
        .customSelectButton:focus {
          outline: 2px solid #7f5af0;
          border-color: #7f5af0;
        }
        .customSelectDropdown {
          background: #23272f !important;
          color: #fff !important;
          border-radius: 8px;
          border: 1px solid #2e323c;
        }
      `}</style>
    </div>
  );
}
