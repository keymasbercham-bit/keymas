/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Search, ShieldAlert, Download, Share2, ArrowLeft, Sparkles, QrCode, CheckCircle2 } from "lucide-react";
import { findUserById } from "../services/api";
import { User } from "../types";
import { Button, Card } from "../components/UI";
import { Link } from "react-router-dom";

export default function UserQR() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;

    setLoading(true);
    setError("");
    setUser(null);

    try {
      const foundUser = await findUserById(userId);
      if (foundUser) {
        setUser(foundUser);
      } else {
        setError("ID not found. Please check your ID and try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between animate-fade-in">
        <Link to="/" className="text-slate-500 hover:text-slate-900 transition-all duration-200 flex items-center gap-1.5 text-sm font-medium group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>
      </div>

      {!user ? (
        <div className="space-y-6 text-center animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-[10px] font-bold mb-4 border border-primary/10 uppercase tracking-wider">
              <QrCode className="w-3 h-3" />
              Identity Verification
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Generate Your ID QR</h1>
            <p className="text-slate-500 mt-2 text-sm">Enter your ID number to generate your personal borrowing QR code.</p>
          </div>

          <Card className="p-8 max-w-md mx-auto relative overflow-hidden">
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <form onSubmit={handleSearch} className="space-y-6 relative">
              <div className="text-left">
                <label className="label-micro block mb-2">
                  Matric / Staff ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value.toUpperCase())}
                    placeholder="Enter ID..."
                    className="w-full px-4 py-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl outline-none transition-all duration-200 uppercase font-mono text-lg font-bold"
                    autoFocus
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <Search className="text-slate-300 w-5 h-5" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold uppercase tracking-tight text-left border border-rose-100 animate-fade-in">
                  <ShieldAlert className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full py-4 text-xs tracking-widest group" isLoading={loading}>
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                AUTHENTICATE & GENERATE
              </Button>
            </form>
          </Card>

        </div>
      ) : (
        <div className="space-y-8 animate-scale-in">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold mb-4 border border-emerald-100 uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" />
              Verified Successfully
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Your QR is Ready</h1>
            <p className="text-slate-500 mt-2 text-sm">Present this code at the counter for key borrowing.</p>
          </div>

          <Card className="relative overflow-hidden">
            {/* Top gradient bar */}
            <div className="absolute inset-x-0 top-0 h-1.5 gradient-primary" />
            
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-60 bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />
            
            <div className="p-8 md:p-12 text-center flex flex-col items-center relative">
              {/* QR Code */}
              <div className="mb-8 p-5 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative">
                <div className="absolute inset-0 rounded-2xl glow-primary-sm opacity-30" />
                <QRCodeSVG 
                  value={JSON.stringify({
                    id: user.ID,
                    name: user.Nama,
                    dept: user.Jabatan
                  })}
                  size={240}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* User Info */}
              <div className="space-y-3">
                <h2 className="text-2xl font-extrabold text-slate-900">{user.Nama}</h2>
                <div className="flex flex-col items-center gap-2">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-primary font-mono font-bold rounded-full text-sm border border-blue-100/60">
                    {user.ID}
                  </span>
                  <span className="text-slate-500 font-medium text-sm">{user.Jabatan}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-sm">
                <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                  <Download className="w-4 h-4" />
                  Print
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'My KeyMas QR',
                      text: `ID: ${user.ID} - Name: ${user.Nama}`
                    });
                  }
                }}>
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              <button 
                onClick={() => setUser(null)}
                className="mt-6 text-sm text-slate-400 hover:text-primary font-medium transition-colors cursor-pointer"
              >
                Scan another ID
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
