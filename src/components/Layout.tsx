/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Key, Map, UserCheck, ShieldCheck, LogOut, Home, ClipboardList, LucideIcon, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./UI";

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
  count?: number;
}

interface LayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export default function Layout({ children, isAdmin = false }: LayoutProps) {
  const location = useLocation();

  const userNav: NavItem[] = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Get QR Code", path: "/get-qr", icon: Key },
    { name: "Room Monitor", path: "/rooms", icon: Map },
    { name: "My Booking", path: "/status", icon: ClipboardList },
  ];

  const adminNav: NavItem[] = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "QR Scanner", path: "/admin/scanner", icon: ShieldCheck },
    { name: "Requests", path: "/admin/requests", icon: UserCheck, count: 4 },
    { name: "History", path: "/admin/history", icon: ClipboardList },
  ];

  const navItems = isAdmin ? adminNav : userNav;

  return (
    <div className="flex h-screen bg-bg-base text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Nav */}
      <aside className="hidden md:flex w-64 gradient-sidebar border-r border-slate-200/60 flex-col shrink-0 relative">
        {/* Subtle gradient accent at top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />
        
        <div className="p-6 flex items-center gap-3 relative">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_2px_8px_rgba(0,108,224,0.3)] relative overflow-hidden">
            <span className="relative z-10">K</span>
            <div className="absolute inset-0 animate-shimmer opacity-30" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-none bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">KeyMas</h1>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold italic">Bercham System</span>
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 text-sm font-semibold relative group",
                  isActive
                    ? "bg-gradient-to-r from-primary/10 to-accent/5 text-primary shadow-[inset_0_0_0_1px_rgba(0,108,224,0.1)]"
                    : "text-slate-500 hover:bg-slate-50/80 hover:text-slate-700"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 gradient-primary rounded-full" />
                )}
                <Icon className={cn("w-[18px] h-[18px] transition-transform duration-200", isActive && "scale-110")} />
                {item.name}
                {item.count && (
                  <span className="ml-auto bg-gradient-to-r from-amber-100 to-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100/80 relative">
          {isAdmin ? (
            <div className="gradient-primary-soft p-4 rounded-xl border border-primary/5">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 italic flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Admin Session
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center overflow-hidden shadow-sm">
                   <UserCheck className="w-4 h-4 text-white" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate">Admin Suhaimi</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="text-[10px] text-rose-500 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <LogOut className="w-2.5 h-2.5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/admin/login"
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-all duration-200 group"
            >
              <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
              ADMIN PORTAL
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 glass-strong border-b border-slate-200/50 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-lg text-slate-800">
              {navItems.find(i => i.path === location.pathname)?.name || "Page Overview"}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.location.href = "/get-qr"}>
              <Sparkles className="w-3 h-3 mr-1.5" />
              New Booking
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}

