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

const Landing = () => (
  <div className="text-center py-20 px-4 max-w-4xl mx-auto">
    <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
      Effortless <span className="text-primary italic">Key Borrowing</span> & <span className="text-primary underline underline-offset-8">Room Booking</span>
    </h1>
    <p className="text-xl text-gray-500 mb-10 leading-relaxed">
      Digitize your campus room bookings with KeyMas Bercham. Secure, fast, and real-time.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
      <a href="/get-qr" className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:shadow-lg transition">
        Generate My QR
      </a>
      <a href="/rooms" className="px-8 py-4 bg-white border-2 border-primary text-primary rounded-xl font-bold text-lg hover:bg-blue-50 transition">
        View Availability
      </a>
    </div>
  </div>
);

// Lazy-load pages later, use placeholders for now
const BookingStatus = () => (
  <div className="max-w-2xl mx-auto py-12 text-center">
    <h2 className="text-2xl font-bold mb-4">Under Construction</h2>
    <p className="text-gray-500">This feature is coming soon.</p>
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


