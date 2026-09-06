# LIFEOS — Code Quality Standards

## TypeScript Configuration
- `strict: true` — enabled in tsconfig.json
- `noImplicitAny: true` — zero implicit any types
- `noUnusedLocals: true` — no dead variables
- Zero `any` types anywhere in the codebase

## Function Length
- Maximum 25 lines per function
- Functions exceeding this are split into named helpers
- Services (insightEngine, worldEngine) use single-responsibility functions

## Architecture Rules
- All magic values in `src/lib/constants.ts`
- All TypeScript interfaces in `src/lib/types.ts` and `src/types.ts`
- All Zod schemas in `backend/src/schemas/`
- Frontend never imports Firebase Firestore directly — all data via API
- No secret values ever reach the frontend bundle

## Error Handling
- Every async route handler wrapped in try/catch
- All database writes catch and surface errors to the UI
- Gemini failures handled by 4-model fallback ladder
- Client shown friendly messages — never internal stack traces

## ESLint
- Config: `eslint.config.mjs`
- `npm run lint` produces zero warnings on clean build
- Rules: no-unused-vars, no-explicit-any, consistent-return

## Security Checklist (per PR)
- [ ] No new hardcoded values
- [ ] New API routes have verifyAuth middleware
- [ ] New Gemini prompts have security preamble
- [ ] New Firestore paths follow uid/{userId}/... pattern
