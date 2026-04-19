/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Users, DoorOpen, Clock, AlertCircle, ArrowUpRight, CheckCircle2, XCircle, TrendingUp, Activity, Sparkles } from "lucide-react";
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

  const statCards = [
    {
      label: "Total Rooms",
      value: stats.totalRooms,
      icon: DoorOpen,
      gradient: "from-slate-500 to-slate-600",
      bgGlow: "bg-slate-500",
      lightBg: "from-slate-50 to-slate-100",
      textColor: "text-slate-700"
    },
    {
      label: "Available",
      value: stats.availableRooms,
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-500",
      bgGlow: "bg-emerald-500",
      lightBg: "from-emerald-50 to-teal-50",
      textColor: "text-emerald-600"
    },
    {
      label: "Active Bookings",
      value: stats.active,
      icon: Activity,
      gradient: "from-primary to-blue-500",
      bgGlow: "bg-primary",
      lightBg: "from-blue-50 to-indigo-50",
      textColor: "text-primary"
    },
    {
      label: "Pending Requests",
      value: stats.pending,
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      bgGlow: "bg-amber-500",
      lightBg: "from-amber-50 to-orange-50",
      textColor: "text-amber-600"
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="group relative overflow-hidden p-5 hover:-translate-y-0.5 transition-all duration-300">
              {/* Subtle gradient bg */}
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 ${stat.bgGlow} opacity-[0.04] rounded-full blur-2xl group-hover:opacity-[0.08] transition-opacity duration-500`} />
              
              <div className="relative">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.lightBg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <p className="label-micro mb-1">{stat.label}</p>
                <div className={`text-3xl font-bold ${stat.textColor} tracking-tight`}>{stat.value}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Recent Transactions */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <Card className="flex flex-col animate-fade-in-up" >
            <div className="p-5 border-b border-slate-100/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full gradient-primary" />
                <h3 className="font-bold text-slate-700">Recent Transactions</h3>
              </div>
              <div className="flex gap-2">
                <Badge status="inprogress">ACTIVE</Badge>
                <Badge status="completed">HISTORY</Badge>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100/60">
                    <th className="px-6 py-4 label-micro opacity-60">User Details</th>
                    <th className="px-6 py-4 label-micro opacity-60">Room</th>
                    <th className="px-6 py-4 label-micro opacity-60">Status</th>
                    <th className="px-6 py-4 label-micro opacity-60 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60">
                  {recentBookings.length > 0 ? recentBookings.map((b, i) => (
                    <tr key={b.id} className="hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-transparent transition-all duration-200 group" style={{ animationDelay: `${i * 60}ms` }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-primary font-bold text-xs">
                            {b.userName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{b.userName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{b.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium">{b.roomName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={b.status}>{b.status.replace('_', ' ')}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-xs font-bold text-primary hover:text-primary-dark transition-colors flex items-center gap-1 ml-auto cursor-pointer">
                          Manage
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mx-auto mb-3">
                          <Activity className="w-5 h-5 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-400 italic">No active bookings at this time.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Action Requests */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <Card className="h-full animate-slide-in-right">
            <div className="p-5 border-b border-slate-100/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <h3 className="font-bold text-slate-700">Action Requests</h3>
              </div>
              <Badge status="pending">{pendingRequests.length}</Badge>
            </div>
            <div className="p-5 space-y-4">
              {pendingRequests.length > 0 ? pendingRequests.map(req => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-100/80 bg-gradient-to-br from-white to-slate-50/50 space-y-3 hover:shadow-sm transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-amber-600 font-bold text-[10px]">
                        {req.userName?.charAt(0) || "?"}
                      </div>
                      <div className="font-bold text-slate-900 text-sm leading-tight">{req.userName}</div>
                    </div>
                    <Badge status="pending">NEW</Badge>
                  </div>
                  <p className="label-micro text-slate-500">{req.requestType.replace('_', ' ')}</p>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-rose-500 hover:text-rose-600">
                      <XCircle className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                   <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                   </div>
                   <p className="text-sm font-medium text-slate-400 italic">No pending requests</p>
                   <p className="text-[10px] text-slate-300 mt-1">All caught up! 🎉</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

