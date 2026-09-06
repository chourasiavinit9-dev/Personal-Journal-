"use strict";

const { admin, db } = require("./firebaseAdmin");
const { isValidUid } = require("../middleware/auth");

function assertValidUid(uid) {
  if (!isValidUid(uid)) {
    throw new Error(`Security Exception: Invalid UID format "${uid}"`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// User-scoped collection paths — all data is strictly isolated by uid
// Pattern: users/{uid}/memories, users/{uid}/insights
// ─────────────────────────────────────────────────────────────────────────────

function memoriesRef(uid) {
  assertValidUid(uid);
  return db.collection("users").doc(uid).collection("memories");
}

function insightsRef(uid) {
  assertValidUid(uid);
  return db.collection("users").doc(uid).collection("insights");
}

/**
 * Saves a validated memory object to Firestore under the user's uid.
 */
async function saveMemory(uid, memoryData) {
  const doc = await memoriesRef(uid).add({
    ...memoryData,
    uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return doc.id;
}

/**
 * Returns the most recent N memories for a user, ordered by createdAt desc.
 */
async function getMemories(uid, limit = 30) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 30, 100));

  const snapshot = await memoriesRef(uid)
    .orderBy("createdAt", "desc")
    .limit(safeLimit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
  }));
}

/**
 * Saves AI-generated insights snapshot.
 */
async function saveInsights(uid, insightsData) {
  await insightsRef(uid).doc("latest").set({
    ...insightsData,
    uid,
    generatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

/**
 * Returns the latest insight snapshot for a user, or null if none exist.
 */
async function getInsights(uid) {
  const doc = await insightsRef(uid).doc("latest").get();
  if (!doc.exists) return null;
  const data = doc.data();
  return {
    ...data,
    generatedAt: data.generatedAt?.toDate?.()?.toISOString() ?? null,
  };
}

module.exports = { saveMemory, getMemories, saveInsights, getInsights };
