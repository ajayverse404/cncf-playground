#!/usr/bin/env bash

set -euo pipefail

OWNER="${OWNER:-ajayverse404}"
TAG="${1:-latest}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

BACKEND_IMAGE="${OWNER}/k8s-learning-backend:${TAG}"
FRONTEND_IMAGE="${OWNER}/k8s-learning-frontend:${TAG}"

echo "Building backend image: ${BACKEND_IMAGE}"
docker build -t "${BACKEND_IMAGE}" "${ROOT_DIR}/backend"

echo "Building frontend image: ${FRONTEND_IMAGE}"
docker build -t "${FRONTEND_IMAGE}" "${ROOT_DIR}/frontend"

echo "Pushing backend image: ${BACKEND_IMAGE}"
docker push "${BACKEND_IMAGE}"

echo "Pushing frontend image: ${FRONTEND_IMAGE}"
docker push "${FRONTEND_IMAGE}"

cat <<EOF

Images pushed successfully.
- Backend: ${BACKEND_IMAGE}
- Frontend: ${FRONTEND_IMAGE}

Update your Kubernetes manifests to reference these image names, for example:

  image: ${BACKEND_IMAGE}
  image: ${FRONTEND_IMAGE}

Set OWNER environment variable or pass a different tag if you need to override defaults, e.g.:

  OWNER=your-dockerhub-username ./scripts/publish-images.sh v1.0.0

EOF

