#!/usr/bin/env bash
set -e

echo "Starting Nyra 2.0 FastAPI backend on 127.0.0.1:8000..."
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 &

echo "Waiting for FastAPI backend to be ready..."
sleep 2

echo "Starting Nyra 2.0 Next.js frontend on port ${PORT:-10000}..."
cd frontend
exec npm run start -- -p ${PORT:-10000}
