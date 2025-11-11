import os

from fastapi import FastAPI


app = FastAPI(title="Learning Kubernetes Backend")


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/message")
def read_message() -> dict[str, str | bool]:
    """Return a message sourced from a ConfigMap and secret metadata."""
    message = os.getenv("APP_MESSAGE", "Hello from Kubernetes!")
    environment = os.getenv("APP_ENVIRONMENT", "local")
    token_present = bool(os.getenv("APP_SECRET_TOKEN"))

    return {
        "message": message,
        "environment": environment,
        "secretConfigured": token_present,
    }

