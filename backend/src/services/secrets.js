"use strict";

const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT;

// In-memory cache so we don't hit Secret Manager on every request
const secretCache = new Map();

// ─────────────────────────────────────────────────────────────────────────────
// getSecret()
//
// Fetches a secret by name from Google Cloud Secret Manager.
// Caches the result in memory for the lifetime of the process.
// ─────────────────────────────────────────────────────────────────────────────
async function getSecret(secretName) {
  if (secretCache.has(secretName)) {
    return secretCache.get(secretName);
  }

  // If provided in environment (local dev), use it directly
  if (process.env[secretName]) {
    secretCache.set(secretName, process.env[secretName]);
    return process.env[secretName];
  }

  const name = `projects/${PROJECT_ID}/secrets/${secretName}/versions/latest`;

  const [version] = await client.accessSecretVersion({ name });
  const value = version.payload?.data?.toString("utf8");

  if (!value) {
    throw new Error(`Secret "${secretName}" is empty or missing.`);
  }

  secretCache.set(secretName, value);
  return value;
}

// ─────────────────────────────────────────────────────────────────────────────
// preloadSecrets()
//
// Called at server startup to eagerly load required secrets.
// This ensures Cloud Run fails fast at boot if a secret is misconfigured,
// rather than failing on the first request.
// ─────────────────────────────────────────────────────────────────────────────
async function preloadSecrets() {
  // Locally (when GEMINI_API_KEY is in env or GOOGLE_CLOUD_PROJECT is not set),
  // fall back to environment variables so devs can run without Secret Manager.
  if (process.env.GEMINI_API_KEY || !PROJECT_ID) {
    console.log("[secrets] Using environment variables as local secret fallback.");
    if (process.env.GEMINI_API_KEY) {
      secretCache.set("GEMINI_API_KEY", process.env.GEMINI_API_KEY);
      console.log("[secrets] ✓ GEMINI_API_KEY (from env)");
    }
    if (process.env.MAPS_API_KEY) {
      secretCache.set("MAPS_API_KEY", process.env.MAPS_API_KEY);
      console.log("[secrets] ✓ MAPS_API_KEY (from env)");
    }
    return;
  }

  console.log("[secrets] Preloading secrets from Secret Manager...");
  const requiredSecrets = ["GEMINI_API_KEY"];

  // MAPS_API_KEY is optional — don't fail startup if missing
  const optionalSecrets = ["MAPS_API_KEY"];

  await Promise.all(
    requiredSecrets.map((name) =>
      getSecret(name).then(() => console.log(`[secrets] ✓ ${name}`))
    )
  );

  await Promise.allSettled(
    optionalSecrets.map((name) =>
      getSecret(name)
        .then(() => console.log(`[secrets] ✓ ${name} (optional)`))
        .catch(() => console.warn(`[secrets] ⚠ ${name} not found (optional)`))
    )
  );

  console.log("[secrets] Preload complete.");
}

module.exports = { getSecret, preloadSecrets };
