/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UserQR from "./pages/UserQR";
import RoomAvailability from "./pages/RoomAvailability";
import AdminLogin from "./pages/AdminLogin";
import AdminScanner from "./pages/AdminScanner";
import AdminDashboard from "./pages/AdminDashboard";
import { Key, Map, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

const Landing = () => (
  <div className="text-center py-12 px-4 max-w-4xl mx-auto animate-fade-in-up">
    {/* Hero Badge */}
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-xs font-bold mb-8 border border-primary/10">
      <Sparkles className="w-3.5 h-3.5" />
      Smart Campus Key Management
    </div>

    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
      Effortless{" "}
      <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
        Key Borrowing
      </span>
      {" & "}
      <span className="relative inline-block">
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Room Booking
        </span>
        <div className="absolute -bottom-1 left-0 right-0 h-[3px] gradient-primary rounded-full opacity-40" />
      </span>
    </h1>

    <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto">
      Digitize your campus room bookings with KeyMas Bercham. Secure, fast, and real-time.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mb-16">
      <a
        href="/get-qr"
        className="group relative px-8 py-4 gradient-primary text-white rounded-2xl font-bold text-lg shadow-[0_4px_16px_rgba(0,108,224,0.3)] hover:shadow-[0_8px_32px_rgba(0,108,224,0.4)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Key className="w-5 h-5" />
          Generate My QR
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
        <div className="absolute inset-0 animate-shimmer opacity-20" />
      </a>
      <a
        href="/rooms"
        className="group px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-primary/20 text-primary rounded-2xl font-bold text-lg hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
      >
        <Map className="w-5 h-5" />
        View Availability
      </a>
    </div>

    {/* Feature Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto stagger-children">
      <div className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Zap className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-bold text-slate-800 mb-1">Instant QR</h3>
        <p className="text-sm text-slate-500 leading-relaxed">Generate your personal QR code in seconds for fast key collection.</p>
      </div>

      <div className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Map className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="font-bold text-slate-800 mb-1">Live Monitor</h3>
        <p className="text-sm text-slate-500 leading-relaxed">Real-time room availability tracking across all floors.</p>
      </div>

      <div className="group p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Shield className="w-6 h-6 text-violet-600" />
        </div>
        <h3 className="font-bold text-slate-800 mb-1">Secure Access</h3>
        <p className="text-sm text-slate-500 leading-relaxed">Admin-verified borrowing with full audit trail and history.</p>
      </div>
    </div>
  </div>
);

// Lazy-load pages later, use placeholders for now
const BookingStatus = () => (
  <div className="max-w-2xl mx-auto py-12 text-center animate-fade-in-up">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-6">
      <Sparkles className="w-7 h-7 text-slate-400" />
    </div>
    <h2 className="text-2xl font-bold mb-3 text-slate-800">Under Construction</h2>
    <p className="text-slate-500">This feature is coming soon. Stay tuned!</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Landing /></Layout>} />
        <Route path="/get-qr" element={<Layout><UserQR /></Layout>} />
        <Route path="/rooms" element={<Layout><RoomAvailability /></Layout>} />
        <Route path="/status" element={<Layout><BookingStatus /></Layout>} />
        <Route path="/admin/login" element={<Layout><AdminLogin /></Layout>} />
        <Route path="/admin" element={<Layout isAdmin><AdminDashboard /></Layout>} />
        <Route path="/admin/scanner" element={<Layout isAdmin><AdminScanner /></Layout>} />
        <Route path="/admin/history" element={<Layout isAdmin><div>History Content</div></Layout>} />
        <Route path="/admin/requests" element={<Layout isAdmin><div>Requests Content</div></Layout>} />
      </Routes>
    </Router>
  );
}


