# ─────────────────────────────────────────────────────────────────────────────
# LIFE-OS — Frontend Dockerfile
# Stage 1: Build React/Vite app
# Stage 2: Serve with nginx on Cloud Run port 8080
# ─────────────────────────────────────────────────────────────────────────────

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Inject production API URL at build time
ARG VITE_API_URL=https://lifeos-backend-1037752492960.us-central1.run.app
ARG VITE_FIREBASE_API_KEY=AIzaSyDXY09la8cHHCceeB1WhlRjAA5kqXZZrOA
ARG VITE_FIREBASE_AUTH_DOMAIN=life-os-33c6b.firebaseapp.com
ARG VITE_FIREBASE_PROJECT_ID=life-os-33c6b
ARG VITE_FIREBASE_STORAGE_BUCKET=life-os-33c6b.firebasestorage.app
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=523793100270
ARG VITE_FIREBASE_APP_ID=1:523793100270:web:dcc1ba981a673ba7ed32ff

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine AS runner

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx config for SPA — all routes serve index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run requires listening on 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
