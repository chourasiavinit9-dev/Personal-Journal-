"use strict";

const express = require("express");
const rateLimit = require("express-rate-limit");
const { verifyAuth } = require("../middleware/auth");
const { getMemories, saveInsights, getInsights } = require("../services/firestore");
const { generateInsights } = require("../services/gemini");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Rate limiter — 10 insight requests per hour per IP
// ─────────────────────────────────────────────────────────────────────────────
const insightsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { error: "Too many insight requests. Try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/insights
//
// Returns AI-generated cross-entry insights for the user.
// Generates fresh insights if none exist or if ?refresh=true is passed.
//
// Response: InsightResponse object
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", verifyAuth, insightsLimiter, async (req, res) => {
  try {
    const { uid } = req.user;
    const refresh = req.query.refresh === "true";

    // Return cached insights unless a refresh is requested
    if (!refresh) {
      const cached = await getInsights(uid);
      if (cached) {
        return res.status(200).json(cached);
      }
    }

    // Need at least 3 memories to generate meaningful insights
    const memories = await getMemories(uid, 30);
    if (memories.length < 3) {
      return res.status(200).json({
        era: null,
        connectTheDots: { found: false, pattern: null },
        plotTwist: { found: false, contradiction: null },
        weeklyRoast: null,
        message: "Add at least 3 memories to unlock insights.",
      });
    }

    // Generate insights with Gemini
    const insights = await generateInsights(memories);

    // Save to Firestore (best effort — don't fail the request if save fails)
    saveInsights(uid, insights).catch((err) =>
      console.error("[insights] Failed to cache insights:", err.message)
    );

    return res.status(200).json(insights);
  } catch (err) {
    console.error("[insights] Error:", err.message);
    return res.status(500).json({ error: "Failed to generate insights." });
  }
});

module.exports = router;
