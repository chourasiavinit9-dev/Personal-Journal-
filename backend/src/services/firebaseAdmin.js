"use strict";

const admin = require("firebase-admin");

/**
 * Robust Firebase Admin SDK Initializer
 * Supports:
 * - Local dev (credentials file or project ID fallback)
 * - Cloud Run in same project (Application Default Credentials)
 * - Cloud Run in different GCP project (Service account JSON or Base64 env var)
 */
function initFirebaseAdmin() {
  if (admin.apps.length) {
    return admin.app();
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    "life-os-33c6b";

  let credential;

  // 1. Check for raw or base64 service account JSON in environment
  const serviceAccountRaw =
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountRaw) {
    try {
      let parsed;
      if (serviceAccountRaw.trim().startsWith("{")) {
        parsed = JSON.parse(serviceAccountRaw);
      } else {
        const decoded = Buffer.from(serviceAccountRaw, "base64").toString("utf8");
        parsed = JSON.parse(decoded);
      }
      credential = admin.credential.cert(parsed);
      console.log("[firebase-admin] ✓ Initialized with service account credentials from ENV");
    } catch (e) {
      console.warn("[firebase-admin] ⚠ Failed to parse service account JSON from ENV:", e.message);
    }
  }

  // 2. Fall back to Application Default Credentials or standard projectId
  const appOptions = { projectId };
  if (credential) {
    appOptions.credential = credential;
  }

  try {
    admin.initializeApp(appOptions);
    console.log(`[firebase-admin] ✓ Admin SDK initialized for project "${projectId}"`);
  } catch (err) {
    console.error("[firebase-admin] Failed to initialize Firebase Admin:", err.message);
    throw err;
  }

  return admin.app();
}

const app = initFirebaseAdmin();
const auth = admin.auth();
const db = admin.firestore();

module.exports = {
  admin,
  app,
  auth,
  db,
};
