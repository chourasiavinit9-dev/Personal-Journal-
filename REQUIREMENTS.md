# LIFEOS — Requirements Checklist

## Core Challenge Requirements

- [x] User authentication via Firebase (Google Sign-In)
- [x] Multi-turn interaction with Gemini API
- [x] User-isolated Firestore document storage
- [x] Secure API key retrieval via Google Cloud Secret Manager
- [x] Deployed to Google Cloud Run
- [x] Cloud Run service labelled: `dev-tutorial=cloud-run-ai-challenge`

## Custom Feature Enhancements

- [x] Just Yap — voice-to-structured-memory via Gemini multimodal
- [x] Connect the Dots — cross-entry pattern detection with evidence
- [x] Living World — room environment that evolves with entries
- [x] AI Companion — reacts to mood and streak state
- [x] Plot Twist — contradiction detection across entries
- [x] Weekly Roast — shareable AI-generated week summary
- [x] Your Era — Gemini names current life chapter
- [x] Future Me — time-delayed letter with Gemini comparison
- [x] SanctuaryHome — editorial home with dynamic digest
- [x] JournalDesk — in-place editing with double-click
- [x] CityCrawlsPassport — dynamic badge and route system
- [x] HabitGarden — botanical habit tracking with stamps
- [x] MemoriesVault — curated envelope archive
- [x] LockscreenView — styled lockscreen with live weather
- [x] YearWrapped — annual retrospective with stats

## Security Requirements

- [x] No hardcoded API keys anywhere in source
- [x] GEMINI_API_KEY stored in Google Cloud Secret Manager
- [x] Firestore security rules — uid isolation enforced
- [x] All AI calls server-side via Cloud Run backend
- [x] Firebase Auth JWT verified on every backend request
- [x] Rate limiting on Yap (20/hr) and Insights (10/hr)
- [x] Zod validation on all Gemini output before Firestore write
- [x] Prompt injection defence in all system prompts

## Google Services Used (9/9)

- [x] Gemini 2.0 Flash (with fallback ladder)
- [x] Google Cloud Secret Manager
- [x] Cloud Firestore
- [x] Firebase Authentication
- [x] Firebase Hosting (frontend)
- [x] Google Cloud Run (backend)
- [x] Cloud Build (container build)
- [x] Cloud Scheduler (Future Me delivery)
- [x] Google Maps API (Places with Lore)
