"use strict";

const { z } = require("zod");

// ─────────────────────────────────────────────────────────────────────────────
// Canonical set of mood labels Gemini may assign to a memory.
// Keep in sync with frontend src/lib/types.ts
// ─────────────────────────────────────────────────────────────────────────────
const MOOD_LABELS = [
  "joyful",
  "nostalgic",
  "reflective",
  "melancholic",
  "anxious",
  "grateful",
  "energised",
  "peaceful",
  "frustrated",
  "hopeful",
  "overwhelmed",
  "proud",
];

// ─────────────────────────────────────────────────────────────────────────────
// MemoryOutputSchema
//
// Zod schema for validating Gemini's structured memory JSON output before it
// is written to Firestore. Every field is validated to prevent malformed or
// prompt-injected data from reaching the database.
// ─────────────────────────────────────────────────────────────────────────────
const MemoryOutputSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title too long"),

  summary: z
    .string()
    .min(1, "Summary cannot be empty")
    .max(2000, "Summary too long"),

  moodLabel: z.enum(MOOD_LABELS, {
    errorMap: () => ({ message: `moodLabel must be one of: ${MOOD_LABELS.join(", ")}` }),
  }),

  moodScore: z
    .number()
    .int()
    .min(1, "moodScore must be at least 1")
    .max(10, "moodScore must be at most 10"),

  themes: z
    .array(z.string().min(1).max(50))
    .min(1, "At least one theme is required")
    .max(10, "Too many themes"),

  people: z
    .array(z.string().min(1).max(100))
    .max(20, "Too many people")
    .optional()
    .default([]),

  locationHint: z
    .string()
    .max(200)
    .nullable()
    .optional()
    .default(null),

  importantMoment: z
    .string()
    .max(500)
    .nullable()
    .optional()
    .default(null),

  actionItem: z
    .string()
    .max(300)
    .nullable()
    .optional()
    .default(null),

  companionReaction: z
    .string()
    .min(1, "companionReaction cannot be empty")
    .max(500, "companionReaction too long"),

  bookColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "bookColor must be a valid hex colour e.g. #7eb8f7"),

  bookHeight: z
    .number()
    .int()
    .min(20, "bookHeight must be at least 20")
    .max(160, "bookHeight must be at most 160"),
});

module.exports = { MemoryOutputSchema, MOOD_LABELS };
