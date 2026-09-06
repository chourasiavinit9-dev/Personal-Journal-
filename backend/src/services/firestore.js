"use strict";

const admin = require("firebase-admin");

// Singleton Firestore instance
let _db = null;

function getDb() {
  if (_db) return _db;
  _db = admin.firestore();
  return _db;
}

// ─────────────────────────────────────────────────────────────────────────────
// User-scoped collection paths — all data is isolated by uid
// Pattern: users/{uid}/memories, users/{uid}/insights
// ─────────────────────────────────────────────────────────────────────────────

function memoriesRef(uid) {
  return getDb().collection("users").doc(uid).collection("memories");
}

function insightsRef(uid) {
  return getDb().collection("users").doc(uid).collection("insights");
}

// ─────────────────────────────────────────────────────────────────────────────
// saveMemory()
//
// Saves a validated memory object to Firestore under the user's uid.
// Returns the created document ID.
// ─────────────────────────────────────────────────────────────────────────────
async function saveMemory(uid, memoryData) {
  const doc = await memoriesRef(uid).add({
    ...memoryData,
    uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return doc.id;
}

// ─────────────────────────────────────────────────────────────────────────────
// getMemories()
//
// Returns the most recent N memories for a user, ordered by createdAt desc.
// ─────────────────────────────────────────────────────────────────────────────
async function getMemories(uid, limit = 30) {
  const snapshot = await memoriesRef(uid)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    // Convert Firestore Timestamp → ISO string for JSON serialisation
    createdAt: doc.data().createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// saveInsights()
//
// Saves AI-generated insights snapshot. Overwrites the latest doc.
// ─────────────────────────────────────────────────────────────────────────────
async function saveInsights(uid, insightsData) {
  await insightsRef(uid).doc("latest").set({
    ...insightsData,
    uid,
    generatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// getInsights()
//
// Returns the latest insight snapshot for a user, or null if none exist.
// ─────────────────────────────────────────────────────────────────────────────
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
