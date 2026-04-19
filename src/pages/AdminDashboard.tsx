/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Users, DoorOpen, Clock, AlertCircle, ArrowUpRight, CheckCircle2, XCircle } from "lucide-react";
import { Card, Badge, Button } from "../components/UI";
import { Booking, BookingRequest } from "../types";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    active: 0,
    pending: 0,
    totalRooms: 0,
    availableRooms: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [pendingRequests, setPendingRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsRes, requestsRes] = await Promise.all([
          fetch("/api/bookings"),
          fetch("/api/requests")
        ]);
        
        const bookings: Booking[] = await bookingsRes.json();
        const requests: BookingRequest[] = await requestsRes.json();

        setRecentBookings(bookings.slice(-5).reverse());
        setPendingRequests(requests.filter(r => r.status === 'pending'));
        
        setStats({
          active: bookings.filter(b => b.status === 'inprogress').length,
          pending: requests.filter(r => r.status === 'pending').length,
          totalRooms: 20, // Mock total
          availableRooms: 15 // Mock available
        });
      } catch (err) {
        console.error("Dashboard data error", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <Card className="p-6 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 ${color} opacity-10 rounded-full group-hover:scale-110 transition-transform`} />
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="label-micro mb-1">Total Rooms</p>
          <div className="text-3xl font-light text-slate-800">{stats.totalRooms}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="label-micro mb-1">Available</p>
          <div className="text-3xl font-light text-green-600">{stats.availableRooms}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="label-micro mb-1">Active Bookings</p>
          <div className="text-3xl font-light text-primary">{stats.active}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="label-micro mb-1">Pending Requests</p>
          <div className="text-3xl font-light text-orange-500">{stats.pending}</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <Card className="flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="font-bold text-slate-700">Recent Transactions</h3>
              <div className="flex gap-2">
                <Badge status="inprogress">ACTIVE</Badge>
                <Badge status="completed">HISTORY</Badge>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-4 label-micro opacity-60">User Details</th>
                    <th className="px-6 py-4 label-micro opacity-60">Room</th>
                    <th className="px-6 py-4 label-micro opacity-60">Status</th>
                    <th className="px-6 py-4 label-micro opacity-60 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.length > 0 ? recentBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{b.userName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{b.userId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{b.roomName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={b.status}>{b.status.replace('_', ' ')}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-primary hover:underline">Manage</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm italic font-medium">
                        No active bookings at this time.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <Card className="h-full">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-700">Action Requests</h3>
              <Badge status="pending">{pendingRequests.length}</Badge>
            </div>
            <div className="p-5 space-y-4">
              {pendingRequests.length > 0 ? pendingRequests.map(req => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="font-bold text-slate-900 text-sm leading-tight">{req.userName}</div>
                    <Badge status="pending">NEW</Badge>
                  </div>
                  <p className="label-micro text-slate-500">{req.requestType.replace('_', ' ')}</p>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1">Approve</Button>
                    <Button variant="outline" size="sm" className="flex-1 text-red-500 hover:text-red-600">Reject</Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                   <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-slate-300" />
                   </div>
                   <p className="text-sm font-medium text-slate-400 italic">No pending requests</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

