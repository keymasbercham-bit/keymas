/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Room } from "../types";

const USER_API = "http://opensheet.elk.sh/1Hdif6aXe82IkOc-efflzcGa1D6pD82Cyw62CnkntvWo/nama";
const ROOM_API = "https://opensheet.elk.sh/1Hdif6aXe82IkOc-efflzcGa1D6pD82Cyw62CnkntvWo/bilik";

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(USER_API);
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("User API Error:", error);
    return [];
  }
}

export async function fetchRooms(): Promise<Room[]> {
  try {
    const response = await fetch(ROOM_API);
    if (!response.ok) throw new Error("Failed to fetch rooms");
    return await response.json();
  } catch (error) {
    console.error("Room API Error:", error);
    return [];
  }
}

export async function findUserById(id: string): Promise<User | null> {
  const users = await fetchUsers();
  return users.find(u => u.ID.trim().toLowerCase() === id.trim().toLowerCase()) || null;
}
