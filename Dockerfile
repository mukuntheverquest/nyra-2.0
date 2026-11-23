# Multi-stage Dockerfile for Nyra 2.0 (FastAPI Backend + Next.js Frontend)
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
RUN mkdir -p public && npm run build

# Final lightweight unified production container
FROM python:3.11-slim
WORKDIR /app

# Install Node.js runtime and certificates using official NodeSource repository
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend codebase
COPY backend ./backend

# Copy built Next.js standalone artifacts and static assets
COPY --from=frontend-builder /app/frontend/.next/standalone ./frontend
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Copy process orchestrator
COPY scripts/start.py ./scripts/start.py

ENV PORT=10000
ENV BACKEND_INTERNAL_URL="http://127.0.0.1:8000"
ENV NODE_ENV=production
EXPOSE 10000

CMD ["python", "scripts/start.py"]
