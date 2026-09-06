"use strict";

const { auth } = require("../services/firebaseAdmin");

/**
 * Validates UID to prevent any path traversal or injection in Firestore references.
 */
function isValidUid(uid) {
  return typeof uid === "string" && uid.length > 0 && uid.length <= 128 && !uid.includes("/") && !uid.includes("..");
}

/**
 * verifyAuth Express middleware
 *
 * Extracts and verifies the Firebase ID token from Authorization header.
 * Formats: "Bearer <firebase-id-token>"
 *
 * Security features:
 * - Checks revocation status
 * - Validates UID safety
 * - Distinguishes expired vs revoked vs malformed tokens
 * - Never leaks JWT internals or secrets
 */
async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization ?? "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Missing authorization token.",
        code: "AUTH_MISSING",
      });
    }

    const idToken = authHeader.slice(7).trim();

    if (!idToken || idToken.length < 20) {
      return res.status(401).json({
        error: "Malformed authorization token.",
        code: "AUTH_MALFORMED",
      });
    }

    // Verify token with Firebase Admin
    const decoded = await auth.verifyIdToken(idToken, true);

    if (!isValidUid(decoded.uid)) {
      return res.status(403).json({
        error: "Invalid user identity.",
        code: "AUTH_INVALID_UID",
      });
    }

    // Attach strictly sanitized user context
    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? null,
      emailVerified: decoded.email_verified ?? false,
      admin: decoded.admin === true,
    };

    next();
  } catch (error) {
    const code = error.code ?? "";

    if (code === "auth/id-token-expired") {
      return res.status(401).json({
        error: "Token expired. Please refresh your session.",
        code: "AUTH_EXPIRED",
      });
    }

    if (code === "auth/id-token-revoked") {
      return res.status(401).json({
        error: "Token has been revoked. Please sign in again.",
        code: "AUTH_REVOKED",
      });
    }

    console.error("[auth] Token verification failed:", code || error.message);
    return res.status(403).json({
      error: "Invalid authorization token.",
      code: "AUTH_INVALID",
    });
  }
}

/**
 * requireAdmin middleware
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
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

module.exports = { verifyAuth, requireAdmin, isValidUid };
