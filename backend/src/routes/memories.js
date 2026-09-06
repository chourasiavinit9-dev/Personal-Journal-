"use strict";

const express = require("express");
const rateLimit = require("express-rate-limit");
const { verifyAuth } = require("../middleware/auth");
const { getMemories } = require("../services/firestore");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/memories
//
// Returns the user's most recent memories from Firestore.
// Query param: ?limit=30 (default 30, max 100)
//
// Response: { memories: Memory[] }
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", verifyAuth, async (req, res) => {
  try {
    const { uid } = req.user;
    const rawLimit = parseInt(req.query.limit ?? "30", 10);
    const limit = isNaN(rawLimit) || rawLimit < 1 ? 30 : Math.min(rawLimit, 100);

    const memories = await getMemories(uid, limit);
    return res.status(200).json({ memories });
  } catch (err) {
    console.error("[memories] Error:", err.message);
    return res.status(500).json({ error: "Failed to load memories." });
  }
});

module.exports = router;
