/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Key, Map, UserCheck, ShieldCheck, LogOut, Home, ClipboardList, LucideIcon } from "lucide-react";
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
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Sidebar Nav */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">K</div>
          <div>
            <h1 className="text-lg font-bold leading-none text-primary">KeyMas</h1>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold italic">Bercham System</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "p-2 rounded-md flex items-center gap-3 transition-colors text-sm font-semibold",
                  isActive
                    ? "bg-slate-50 text-primary"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.name}
                {item.count && (
                  <span className="ml-auto bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px]">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100">
          {isAdmin ? (
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 italic">Admin Session</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden">
                   <UserCheck className="w-5 h-5 text-slate-500" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold truncate">Admin Suhaimi</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="text-[10px] text-red-500 font-bold hover:underline"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/admin/login"
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              ADMIN PORTAL
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-lg text-slate-800">
              {navItems.find(i => i.path === location.pathname)?.name || "Page Overview"}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.location.href = "/get-qr"}>
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

