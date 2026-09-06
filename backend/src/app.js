"use strict";

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// ─────────────────────────────────────────────────────────────────────────────
// Firebase Admin SDK — singleton init
// ─────────────────────────────────────────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Route handlers
// ─────────────────────────────────────────────────────────────────────────────
const yapRouter = require("./routes/yap");
const memoriesRouter = require("./routes/memories");
const insightsRouter = require("./routes/insights");
const astroRouter = require("./routes/astro");

const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// CORS — allow frontend origins
// ─────────────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, Cloud Run health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// Body parsing — JSON for most routes
// Audio routes use raw body (handled in-route via async iterator)
// ─────────────────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));

// ─────────────────────────────────────────────────────────────────────────────
// Health check — Cloud Run / load balancer probe
// ─────────────────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "lifeos-api",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────────────────────
app.use("/api/yap", yapRouter);
app.use("/api/memories", memoriesRouter);
app.use("/api/insights", insightsRouter);
app.use("/api/astro", astroRouter);

// ─────────────────────────────────────────────────────────────────────────────
// 404 handler
// ─────────────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// ─────────────────────────────────────────────────────────────────────────────
// Global error handler
// Never expose stack traces to the client
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[app] Unhandled error:", err.message);
  res.status(err.status ?? 500).json({
    error: err.expose ? err.message : "Internal server error.",
  });
});

module.exports = app;
