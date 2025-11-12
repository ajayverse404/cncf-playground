FROM python:3.11-slim AS base

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PATH="/opt/venv/bin:${PATH}"

RUN python -m venv /opt/venv

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY app.py /app/app.py

EXPOSE 42000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "42000"]

