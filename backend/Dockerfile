# ─────────────────────────────────────────────────────────────────────────────
# LIFEOS — Backend Dockerfile
# Target: Google Cloud Run (linux/amd64)
# ─────────────────────────────────────────────────────────────────────────────

# Stage 1: deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --omit=dev keeps the image lean — no jest, nodemon, etc.
RUN npm ci --omit=dev

# Stage 2: final image
FROM node:20-alpine AS runner
WORKDIR /app

# Non-root user — Cloud Run best practice
RUN addgroup --system lifeos && adduser --system --ingroup lifeos lifeos

COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./

# Cloud Run injects PORT — default 8080
ENV PORT=8080
ENV NODE_ENV=production

# Owned by non-root user
RUN chown -R lifeos:lifeos /app
USER lifeos

EXPOSE 8080

CMD ["node", "src/server.js"]
