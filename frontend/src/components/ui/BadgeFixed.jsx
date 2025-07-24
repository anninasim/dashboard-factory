import React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
  default: "inline-flex items-center rounded-md border border-transparent bg-slate-700 px-2.5 py-0.5 text-xs font-semibold text-white shadow hover:bg-slate-600 transition-colors",
  secondary: "inline-flex items-center rounded-md border border-transparent bg-slate-600 px-2.5 py-0.5 text-xs font-semibold text-slate-200 shadow hover:bg-slate-500 transition-colors",
  destructive: "inline-flex items-center rounded-md border border-transparent bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow hover:bg-red-700 transition-colors",
  outline: "inline-flex items-center rounded-md border border-slate-600 px-2.5 py-0.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors",
  success: "inline-flex items-center rounded-md border border-transparent bg-green-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow hover:bg-green-700 transition-colors",
  warning: "inline-flex items-center rounded-md border border-transparent bg-orange-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow hover:bg-orange-700 transition-colors",
  info: "inline-flex items-center rounded-md border border-transparent bg-cyan-600 px-2.5 py-0.5 text-xs font-semibold text-white shadow hover:bg-cyan-700 transition-colors",
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <div className={cn(badgeVariants[variant], className)} {...props} />
  );
}

export { Badge };
