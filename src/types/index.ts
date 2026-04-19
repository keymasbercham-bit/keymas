/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BookingStatus = 'pending' | 'booked' | 'inprogress' | 'available' | 'completed' | 'cancelled' | 'returned_early' | 'rejected';

export interface User {
  ID: string;
  Nama: string;
  Jabatan: string;
}

export interface Room {
  "no.": string;
  "nama bilik": string;
  tingkat: string;
  status?: BookingStatus;
  currentBookingId?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  department: string;
  roomId: string;
  roomName: string;
  bookingType: 'walk-in' | 'advance';
  status: BookingStatus;
  startTime: string; // ISO string
  endTime: string; // ISO string
  actualReturnTime?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  approvedBy?: string;
  notes?: string;
}

export interface BookingRequest {
  id: string;
  bookingId?: string;
  requestType: 'cancel' | 'early_return' | 'advance_booking';
  requestedBy: string; // User ID
  userName: string;
  roomName?: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  createdAt: string;
  processedAt?: string;
  processedBy?: string;
}
