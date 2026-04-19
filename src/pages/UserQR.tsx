/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Search, ShieldAlert, Download, Share2, ArrowLeft } from "lucide-react";
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
      <div className="flex items-center justify-between">
        <Link to="/" className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {!user ? (
        <div className="space-y-6 text-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Generate Your ID QR</h1>
            <p className="text-gray-500 mt-2">Enter your ID number to generate your personal borrowing QR code.</p>
          </div>

          <Card className="p-8 max-w-md mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
            <form onSubmit={handleSearch} className="space-y-6">
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
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition uppercase font-mono text-lg font-bold"
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Search className="text-slate-300 w-5 h-5" />
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-tight text-left border border-red-100">
                  <ShieldAlert className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full py-4 text-xs tracking-widest" isLoading={loading}>
                AUTHENTICATE & GENERATE
              </Button>
            </form>
          </Card>

        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Your QR is Ready</h1>
            <p className="text-gray-500 mt-2">Present this code at the counter for key borrowing.</p>
          </div>

          <Card className="relative overflow-visible">
            <div className="absolute inset-x-0 top-0 h-2 bg-primary" />
            <div className="p-8 md:p-12 text-center flex flex-col items-center">
              <div className="mb-8 p-4 bg-white rounded-2xl border-4 border-gray-50 shadow-inner">
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

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{user.Nama}</h2>
                <div className="flex flex-col items-center gap-1">
                  <span className="px-3 py-1 bg-blue-50 text-primary font-mono font-semibold rounded-full text-sm">
                    {user.ID}
                  </span>
                  <span className="text-gray-500 font-medium">{user.Jabatan}</span>
                </div>
              </div>

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
                className="mt-6 text-sm text-gray-400 hover:text-gray-600 font-medium"
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
