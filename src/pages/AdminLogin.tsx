/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User, ShieldCheck, ArrowRight, Loader2, Lock, Sparkles } from "lucide-react";
import { Card, Button } from "../components/UI";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        navigate("/admin");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="relative overflow-hidden p-8 space-y-8 shadow-xl border-white/60">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 gradient-primary" />
          
          {/* Subtle glow */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center relative">
            <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_4px_16px_rgba(0,108,224,0.25)] relative overflow-hidden">
              <ShieldCheck className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 animate-shimmer opacity-20" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h1>
            <p className="text-slate-500 mt-1 text-sm">Authorized personnel only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl outline-none transition-all duration-200 text-sm font-medium"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50/80 border border-slate-200/80 rounded-xl outline-none transition-all duration-200 text-sm font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm flex items-center gap-2 border border-rose-100 animate-fade-in">
                <ShieldCheck className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full py-3.5 group" isLoading={loading}>
              Sign In to Dashboard
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="text-center">
            <p className="text-[11px] text-slate-400">
              For emergencies, please contact the IT department.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
