"use strict";

const admin = require("firebase-admin");

// ─────────────────────────────────────────────────────────────────────────────
// Firebase Admin SDK — singleton init
// In Cloud Run, GOOGLE_APPLICATION_DEFAULT_CREDENTIALS is auto-configured.
// Locally, set GOOGLE_APPLICATION_CREDENTIALS to a service account JSON path.
// Never commit the service account JSON file.
// ─────────────────────────────────────────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
  });
}

const auth = admin.auth();

// ─────────────────────────────────────────────────────────────────────────────
// verifyAuth()
//
// Express middleware. Extracts and verifies the Firebase ID token from the
// Authorization header. Attaches decoded token fields to req.user.
//
// Expected header:  Authorization: Bearer <firebase-id-token>
//
// On success:  calls next() with req.user = { uid, email, emailVerified, admin }
// On failure:  returns 401 (missing token) or 403 (invalid/expired token)
//
// NEVER trust req.user fields set by the client — they come from the
// verified JWT payload only.
// ─────────────────────────────────────────────────────────────────────────────
async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization ?? "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Missing authorization token.",
        code: "AUTH_MISSING",
      });
    }

    const idToken = authHeader.slice(7); // Strip "Bearer "

    if (!idToken || idToken.length < 20) {
      return res.status(401).json({
        error: "Malformed authorization token.",
        code: "AUTH_MALFORMED",
      });
    }

    // verifyIdToken() checks:
    //   - Signature (signed by Google)
    //   - Expiry (Firebase tokens expire after 1 hour)
    //   - Audience (matches your Firebase project)
    //   - Issuer
    const decoded = await auth.verifyIdToken(idToken, true); // checkRevoked = true

    // Attach only what routes need — don't expose the full decoded JWT
    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? null,
      emailVerified: decoded.email_verified ?? false,
      admin: decoded.admin === true, // Custom claim — set via Admin SDK only
    };

    next();
  } catch (error) {
    const code = error.code ?? "";

    // Distinguish between expired and invalid tokens for better client UX
    if (code === "auth/id-token-expired") {
      return res.status(401).json({
        error: "Token expired. Please sign in again.",
        code: "AUTH_EXPIRED",
      });
    }

    if (code === "auth/id-token-revoked") {
      return res.status(401).json({
        error: "Token revoked. Please sign in again.",
        code: "AUTH_REVOKED",
      });
    }

    // All other verification failures
    console.error("[auth] Token verification failed:", code, error.message);
    return res.status(403).json({
      error: "Invalid authorization token.",
      code: "AUTH_INVALID",
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// requireAdmin()
//
// Secondary middleware — use AFTER verifyAuth() on admin-only routes.
// Checks the admin custom claim set by the Firebase Admin SDK.
//
// Usage:  router.get("/admin/users", verifyAuth, requireAdmin, handler)
// ─────────────────────────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  if (!req.user) {
    // verifyAuth must run first
    return res.status(500).json({ error: "requireAdmin used without verifyAuth." });
  }

  if (req.user.admin !== true) {
    return res.status(403).json({
      error: "Admin access required.",
      code: "ADMIN_REQUIRED",
    });
  }

  next();
}

module.exports = { verifyAuth, requireAdmin };
