/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Database path
  const DB_PATH = path.join(__dirname, "db.json");
  
  // Initialize DB if not exists
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
      bookings: [],
      requests: [],
      rooms: [], // This will be synced with API but store live status
      admins: [{ id: "1", username: "admin", password: "password123" }] // Default credentials
    }, null, 2));
  }

  const getDB = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
  const saveDB = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

  // --- API ROUTES ---

  // Auth
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    const db = getDB();
    const admin = db.admins.find((a: any) => a.username === username && a.password === password);
    if (admin) {
      res.json({ success: true, user: { id: admin.id, username: admin.username } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Bookings
  app.get("/api/bookings", (req, res) => {
    res.json(getDB().bookings);
  });

  app.post("/api/bookings", (req, res) => {
    const db = getDB();
    const newBooking = { 
      id: Math.random().toString(36).substr(2, 9), 
      createdAt: new Date().toISOString(),
      ...req.body 
    };
    db.bookings.push(newBooking);
    saveDB(db);
    res.status(201).json(newBooking);
  });

  app.patch("/api/bookings/:id", (req, res) => {
    const db = getDB();
    const index = db.bookings.findIndex((b: any) => b.id === req.params.id);
    if (index !== -1) {
      db.bookings[index] = { ...db.bookings[index], ...req.body, updatedAt: new Date().toISOString() };
      saveDB(db);
      res.json(db.bookings[index]);
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  });

  // Requests
  app.get("/api/requests", (req, res) => {
    res.json(getDB().requests);
  });

  app.post("/api/requests", (req, res) => {
    const db = getDB();
    const newRequest = { 
      id: Math.random().toString(36).substr(2, 9), 
      createdAt: new Date().toISOString(),
      status: 'pending',
      ...req.body 
    };
    db.requests.push(newRequest);
    saveDB(db);
    res.status(201).json(newRequest);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KeyMas Bercham Backend running on http://localhost:${PORT}`);
  });
}

startServer();
