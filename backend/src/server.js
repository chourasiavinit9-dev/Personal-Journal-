"use strict";

// Load .env for local development (no-op in Cloud Run where the file doesn't exist)
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const app = require("./app");
const { preloadSecrets } = require("./services/secrets");

const PORT = parseInt(process.env.PORT ?? "8080", 10);

// ─────────────────────────────────────────────────────────────────────────────
// Startup sequence:
//   1. Preload secrets from Secret Manager (warms cache, fails fast if missing)
//   2. Start HTTP server
//
// Failing before the server starts means Cloud Run marks the deployment as
// unhealthy and rolls back — correct behaviour for a misconfigured secret.
// ─────────────────────────────────────────────────────────────────────────────
async function start() {
  try {
    await preloadSecrets();

    app.listen(PORT, () => {
      console.log(`[server] LIFEOS API running on port ${PORT}`);
      console.log(`[server] Environment: ${process.env.NODE_ENV ?? "development"}`);
      console.log(`[server] Project: ${process.env.GOOGLE_CLOUD_PROJECT ?? "unknown"}`);
    });
  } catch (error) {
    console.error("[server] Fatal startup error:", error.message);
    process.exit(1);
  }
}

// Graceful shutdown — Cloud Run sends SIGTERM before killing the container
process.on("SIGTERM", () => {
  console.log("[server] SIGTERM received — shutting down gracefully");
  process.exit(0);
});

start();
