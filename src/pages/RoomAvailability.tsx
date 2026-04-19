/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Filter, Search, MapPin, Loader2 } from "lucide-react";
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Room Availability</h1>
        <p className="text-gray-500 mt-2">Check real-time status of all rooms and keys.</p>
      </div>

      <Card className="p-4 bg-white/50 backdrop-blur-sm sticky top-20 z-40 border-primary/10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search room name..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
              <option value="inprogress">In Progress</option>
              <option value="pending">Pending</option>
            </select>
            <select
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
            >
              <option value="all">All Floors</option>
              {floors.map(floor => (
                <option key={floor} value={floor}>Flr {floor}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <div key={room["no."]}>
              <Card className={cn(
                "hover:shadow-md transition group h-full border-slate-100 p-4 flex flex-col gap-2",
                room.status === 'available' ? "bg-green-50/30" : 
                room.status === 'inprogress' ? "bg-red-50/30" : 
                room.status === 'booked' ? "bg-blue-50/30" : 
                room.status === 'pending' ? "bg-orange-50/30" : "bg-slate-50/30"
              )}>
                 <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-400">F{room.tingkat}-{room["no."]}</span>
                    {room.status === 'inprogress' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>}
                 </div>
                 <span className="font-bold text-slate-800">{room["nama bilik"]}</span>
                 <Badge status={room.status || 'available'}>
                    {(room.status || 'available').toUpperCase()}
                 </Badge>
                 
                 <div className="mt-4 flex gap-2">
                    <Button variant={room.status === 'available' ? 'primary' : 'outline'} size="sm" className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       {room.status === 'available' ? 'Book' : 'Details'}
                    </Button>
                 </div>
              </Card>
            </div>
          ))}
        </div>

      )}

      {!loading && filteredRooms.length === 0 && (
        <div className="text-center py-20 bg-gray-100 rounded-3xl border-2 border-dashed">
          <p className="text-gray-500 font-medium">No rooms found matching your filters.</p>
          <Button variant="ghost" className="mt-2" onClick={() => { setSearch(""); setStatusFilter("all"); setFloorFilter("all"); }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
