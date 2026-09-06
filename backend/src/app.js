"use strict";

const express = require("express");
const cors = require("cors");

// ─────────────────────────────────────────────────────────────────────────────
// Firebase Admin SDK singleton initialization
// ─────────────────────────────────────────────────────────────────────────────
require("./services/firebaseAdmin");

// Route handlers
const yapRouter = require("./routes/yap");
const memoriesRouter = require("./routes/memories");
const insightsRouter = require("./routes/insights");
const astroRouter = require("./routes/astro");

const app = express();

// ─────────────────────────────────────────────────────────────────────────────
// Security Headers
// ─────────────────────────────────────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(self)");
  next();
});

// ─────────────────────────────────────────────────────────────────────────────
// CORS Configuration — Robust and Safe
// ─────────────────────────────────────────────────────────────────────────────
const staticAllowedOrigins = [
  "https://life-os-33c6b.web.app",
  "https://life-os-33c6b.firebaseapp.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

const isOriginAllowed = (origin) => {
  // Allow curl, Postman, server-to-server, or local tools
  if (!origin) return true;

  // Allow explicit static origins
  if (staticAllowedOrigins.includes(origin)) return true;

  // Allow localhost on any port for local development & testing
  if (/^http:\/\/localhost:[0-9]+$/.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1:[0-9]+$/.test(origin)) return true;

  return false;
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        // Return null, false rather than throwing an Error
        callback(null, false);
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "Accept"],
    credentials: true,
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// Body parsing — JSON with size limits & syntax error protection
// ─────────────────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));

// Handle invalid JSON syntax in request body
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Malformed JSON payload.",
      code: "INVALID_JSON",
    });
  }
  next(err);
});

// ─────────────────────────────────────────────────────────────────────────────
// Health check — Cloud Run / load balancer probe
// ─────────────────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "lifeos-api",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
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
  res.status(404).json({
    error: "Route not found.",
    code: "NOT_FOUND",
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Global error handler — Never leak stack traces to client
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[app] Unhandled error:", err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.expose ? err.message : "Internal server error.",
    code: err.code || "INTERNAL_ERROR",
  });
});

module.exports = app;
