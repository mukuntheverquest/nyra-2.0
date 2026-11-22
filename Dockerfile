# Multi-stage Dockerfile for Nyra 2.0 (FastAPI Backend + Next.js Frontend)
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN npm run build

FROM python:3.11-slim
WORKDIR /app

# Install Node.js runtime for Next.js production server
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend codebase
COPY backend ./backend

# Copy built Next.js artifacts and dependencies
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/
COPY --from=frontend-builder /app/frontend/node_modules ./frontend/node_modules
COPY frontend/next.config.mjs ./frontend/

# Copy startup orchestrator script
COPY scripts/start.py ./scripts/start.py

ENV PORT=10000
ENV BACKEND_INTERNAL_URL="http://127.0.0.1:8000"
ENV NODE_ENV=production
EXPOSE 10000

CMD ["python", "scripts/start.py"]
