# Kubernetes Concepts Learning App

This repository provides a minimal end-to-end application for experimenting with core Kubernetes workload primitives:

- **Python FastAPI backend** packaged as a Docker image.
- **React + Vite frontend** built into a static site served by Nginx.
- **Kubernetes manifests** that demonstrate ConfigMaps, Secrets, ReplicaSets, Deployments, and Services.

Use it as a lab environment to explore how application components fit together inside a cluster.

## Repository Layout

- `backend/` – FastAPI service exposing `/api/health` and `/api/message`, reads values from environment variables.
- `frontend/` – React single-page app that loads configuration at runtime and calls the backend API.
- `infra/` – Kubernetes manifests grouped with a `kustomization.yaml` for easy apply/delete workflows.

## Prerequisites

- Docker or another container build tool.
- Node.js 18+ (only required if you plan to develop the frontend outside of Docker).
- Python 3.11+ (only required if you plan to run the backend outside of Docker).
- A Kubernetes cluster (Kind, Minikube, k3d, local Docker Desktop, or managed cloud cluster).
- `kubectl` configured to talk to the target cluster.

## Build the Container Images

From the repository root:

```bash
# Backend FastAPI image
docker build -t k8s-learning-backend:latest ./backend

# Frontend React image
docker build -t k8s-learning-frontend:latest ./frontend
```

> **Tip:** If you are using Kind or another local cluster, either push these images to a registry reachable by the cluster or load the images directly (e.g. `kind load docker-image k8s-learning-backend:latest`).

## Deploy to Kubernetes

1. **Create the namespace, ConfigMaps, Secret, ReplicaSet, Deployment, and Services:**

   ```bash
   kubectl apply -k infra
   ```

   The `kustomization.yaml` applies the resources in the correct order.

2. **Confirm that the ReplicaSet and Deployment created the expected Pods:**

   ```bash
   kubectl get pods -n k8s-learning
   kubectl describe rs backend-rs -n k8s-learning
   ```

3. **Inspect ConfigMap and Secret consumption:**

   ```bash
   kubectl exec -n k8s-learning deploy/frontend-deployment -- \
     ls /usr/share/nginx/html/config

   kubectl exec -n k8s-learning rs/backend-rs -- \
     env | grep APP_
   ```

4. **Access the frontend:**

   The frontend Service is configured as a `NodePort` on `30080`. When running on a local cluster, open `http://localhost:30080`. In managed clusters, adjust the Service type as needed (for example, change to `LoadBalancer`).

5. **Check the backend health endpoint:**

   ```bash
   kubectl port-forward -n k8s-learning svc/backend-service 8000:8000
   curl http://localhost:8000/api/health
   ```

## Customize the Demo

- Update `infra/backend-configmap.yaml` to tweak the message and environment label surfaced by the API.
- Replace the example token in `infra/backend-secret.yaml` with your own Secret values.
- Modify the image references in `infra/backend-replicaset.yaml` and `infra/frontend-deployment.yaml` to match published image names in your container registry.
- Adjust `infra/frontend-service.yaml` to the appropriate Service type for your environment.

## Clean Up

When you are done experimenting:

```bash
kubectl delete -k infra
```

This removes the namespace and all associated resources from the cluster.

