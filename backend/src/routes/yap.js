"use strict";

const express = require("express");
const rateLimit = require("express-rate-limit");
const { verifyAuth } = require("../middleware/auth");
const { transcribeAndStructure } = require("../services/gemini");
const { MemoryOutputSchema } = require("../schemas/geminiOutput.schema");
const { saveMemory } = require("../services/firestore");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Rate limiter — 20 Yap requests per hour per IP
// ─────────────────────────────────────────────────────────────────────────────
const yapLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { error: "Too many Yap requests. Try again in an hour." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/yap
//
// Accepts a raw audio blob, transcribes it with Gemini multimodal,
// validates the structured output, and saves to Firestore.
//
// Request: Content-Type: audio/webm (or audio/*)
//          Body: raw audio bytes
//
// Response: { memory, saved, memoryId }
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", verifyAuth, yapLimiter, async (req, res) => {
  try {
    const { uid } = req.user;
    const mimeType = req.headers["content-type"] ?? "audio/webm";

    // Collect raw body chunks
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    if (audioBuffer.length < 100) {
      return res.status(400).json({ error: "Audio too short or empty." });
    }

    if (audioBuffer.length > 10 * 1024 * 1024) {
      return res.status(413).json({ error: "Audio exceeds 10 MB limit." });
    }

    // Transcribe and structure with Gemini
    const raw = await transcribeAndStructure(audioBuffer, mimeType, uid);

    // Validate with Zod before writing to Firestore
    const parsed = MemoryOutputSchema.safeParse(raw);
    if (!parsed.success) {
      console.error("[yap] Gemini output failed validation:", parsed.error.issues);
      return res.status(422).json({
        error: "Gemini returned invalid memory structure. Please try again.",
        details: parsed.error.issues,
      });
    }

    const memory = parsed.data;

    // Save to Firestore
    let memoryId = null;
    let saved = false;
    try {
      memoryId = await saveMemory(uid, memory);
      saved = true;
    } catch (dbErr) {
      console.error("[yap] Firestore save failed:", dbErr.message);
      // Return the memory even if save failed — client can still display it
    }

    return res.status(200).json({ memory: { ...memory, id: memoryId }, saved, memoryId });
  } catch (err) {
    console.error("[yap] Error:", err.message);
    return res.status(500).json({ error: err.message ?? "Yap failed." });
  }
});

module.exports = router;
