/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Filter, Search, MapPin, Loader2, Building2, Layers } from "lucide-react";
import { fetchRooms } from "../services/api";
import { Room, BookingStatus } from "../types";
import { Card, Badge, Button } from "../components/UI";
import { cn } from "../lib/utils";

export default function RoomAvailability() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [floorFilter, setFloorFilter] = useState<string | "all">("all");

  useEffect(() => {
    async function load() {
      const data = await fetchRooms();
      // Initialize with status available (would come from DB in real usage)
      setRooms(data.map(r => ({ ...r, status: 'available' })));
      setLoading(false);
    }
    load();
  }, []);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room["nama bilik"].toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || room.status === statusFilter;
    const matchesFloor = floorFilter === "all" || room.tingkat === floorFilter;
    return matchesSearch && matchesStatus && matchesFloor;
  });

  const floors = Array.from(new Set(rooms.map(r => r.tingkat))).sort();

  const statusColors: Record<string, string> = {
    available: "from-emerald-50/60 to-teal-50/40 border-emerald-200/30 hover:border-emerald-300/50",
    inprogress: "from-rose-50/60 to-red-50/40 border-rose-200/30 hover:border-rose-300/50",
    booked: "from-blue-50/60 to-indigo-50/40 border-blue-200/30 hover:border-blue-300/50",
    pending: "from-amber-50/60 to-orange-50/40 border-amber-200/30 hover:border-amber-300/50",
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Room Availability</h1>
          <p className="text-slate-500 mt-1 text-sm">Check real-time status of all rooms and keys.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Building2 className="w-4 h-4" />
          <span className="font-semibold">{filteredRooms.length}</span> rooms
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 glass-strong sticky top-0 z-40">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search room name..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200/60 rounded-xl outline-none transition-all duration-200 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-8 py-2.5 bg-white/80 border border-slate-200/60 rounded-xl outline-none transition-all duration-200 text-sm font-medium text-slate-600 cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="inprogress">In Progress</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-8 py-2.5 bg-white/80 border border-slate-200/60 rounded-xl outline-none transition-all duration-200 text-sm font-medium text-slate-600 cursor-pointer"
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
              >
                <option value="all">All Floors</option>
                {floors.map(floor => (
                  <option key={floor} value={floor}>Floor {floor}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Room Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-primary/10 animate-pulse-ring" />
          </div>
          <p className="text-sm text-slate-400 mt-4">Loading rooms...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {filteredRooms.map((room) => (
            <div key={room["no."]}>
              <Card className={cn(
                "group h-full border p-5 flex flex-col gap-2.5 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 bg-gradient-to-br",
                statusColors[room.status || 'available'] || "from-slate-50/60 to-white border-slate-200/30"
              )}>
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">F{room.tingkat}-{room["no."]}</span>
                    </div>
                    {room.status === 'inprogress' && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                    )}
                 </div>
                 <span className="font-bold text-slate-800 text-[15px] leading-snug">{room["nama bilik"]}</span>
                 <div>
                   <Badge status={room.status || 'available'}>
                      {(room.status || 'available').toUpperCase()}
                   </Badge>
                 </div>
                 
                 <div className="mt-auto pt-2">
                    <Button 
                      variant={room.status === 'available' ? 'primary' : 'outline'} 
                      size="sm" 
                      className="w-full opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300"
                    >
                       {room.status === 'available' ? 'Book Now' : 'Details'}
                    </Button>
                 </div>
              </Card>
            </div>
          ))}
        </div>

      )}

      {/* Empty State */}
      {!loading && filteredRooms.length === 0 && (
        <div className="text-center py-20 rounded-3xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No rooms found matching your filters.</p>
          <Button variant="ghost" className="mt-3" onClick={() => { setSearch(""); setStatusFilter("all"); setFloorFilter("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
