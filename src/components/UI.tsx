/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: any) => void;
  disabled?: boolean;
}



export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  disabled,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "gradient-primary text-white shadow-[0_2px_8px_rgba(0,108,224,0.3)] hover:shadow-[0_4px_16px_rgba(0,108,224,0.4)] hover:brightness-110 active:scale-[0.98]",
    secondary: "bg-slate-800 text-white hover:bg-slate-900 shadow-sm hover:shadow-md active:scale-[0.98]",
    outline: "border border-slate-200/80 text-slate-600 hover:bg-white hover:border-slate-300 hover:shadow-sm bg-white/50 backdrop-blur-sm",
    ghost: "text-slate-500 hover:bg-slate-100/80 hover:text-slate-700",
    danger: "bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600 shadow-[0_2px_8px_rgba(239,68,68,0.3)] active:scale-[0.98]"
  };

  const sizes = {
    sm: "px-3.5 py-1.5 text-[10px] uppercase font-bold tracking-wider",
    md: "px-5 py-2.5 text-sm font-semibold",
    lg: "px-7 py-3.5 text-base font-bold"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string; key?: string | number }) {
  return (
    <div className={cn("card-utility overflow-hidden", className)}>
      {children}
    </div>
  );
}

export function Badge({ children, status, className }: { children: ReactNode; status: string; className?: string; key?: string | number }) {
  const statusClasses: Record<string, string> = {
    pending: "status-pending",
    booked: "status-booked",
    inprogress: "status-inprogress",
    available: "status-available",
    completed: "status-completed",
    cancelled: "status-cancelled",
    returned_early: "status-completed",
    rejected: "bg-red-50 text-red-600 border-red-100"
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border backdrop-blur-sm",
      statusClasses[status] || "bg-slate-100 text-slate-600 border-slate-200",
      className
    )}>
      {children}
    </span>
  );
}



