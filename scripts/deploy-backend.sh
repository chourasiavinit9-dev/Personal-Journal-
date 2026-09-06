#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# LIFEOS — Deploy backend to Cloud Run
#
# Run from the repo root:
#   chmod +x scripts/deploy-backend.sh
#   ./scripts/deploy-backend.sh
#
# Prerequisites:
#   gcloud CLI authenticated: gcloud auth login
#   Project set: gcloud config set project YOUR_PROJECT_ID
#   Secrets created: ./scripts/setup-secrets.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
SERVICE_NAME="lifeos-api"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "→ Project:  ${PROJECT_ID}"
echo "→ Region:   ${REGION}"
echo "→ Service:  ${SERVICE_NAME}"
echo ""

# ── Step 1: Build and push the container image ────────────────────────────────
echo "[1/4] Building container image..."
cd backend
gcloud builds submit \
  --tag "${IMAGE}" \
  --project "${PROJECT_ID}"
cd ..

# ── Step 2: Deploy to Cloud Run ───────────────────────────────────────────────
echo "[2/4] Deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "NODE_ENV=production,GOOGLE_CLOUD_PROJECT=${PROJECT_ID}" \
  --set-secrets "GEMINI_API_KEY=GEMINI_API_KEY:latest,MAPS_API_KEY=MAPS_API_KEY:latest" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 60

# ── Step 3: Apply verification label ─────────────────────────────────────────
# MANDATORY for Gen AI Cohort 3A automated verification.
# Without this label the Cloud Run challenge bot cannot verify your submission.
echo "[3/4] Applying challenge verification label..."
gcloud run services update "${SERVICE_NAME}" \
  --update-labels "dev-tutorial=cloud-run-ai-challenge" \
  --region "${REGION}"

# ── Step 4: Print the service URL ─────────────────────────────────────────────
echo "[4/4] Deployment complete."
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --region "${REGION}" \
  --format "value(status.url)")

echo ""
echo "✓ LIFEOS API deployed: ${SERVICE_URL}"
echo "✓ Health check:        ${SERVICE_URL}/health"
echo "✓ Challenge label:     dev-tutorial=cloud-run-ai-challenge"
echo ""
echo "Next: update VITE_API_URL=${SERVICE_URL} in frontend/.env.local"
echo "Then run: ./scripts/deploy-frontend.sh"
