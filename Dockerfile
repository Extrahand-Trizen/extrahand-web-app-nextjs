# =========================================================
# Optimized Multi-Stage Dockerfile for Next.js Production
# Fast deploy + lower CPU + lower disk I/O for CapRover/VPS
# IMPORTANT:
# In next.config.ts add:
# output: 'standalone'
# =========================================================

# -------------------------------
# Stage 1: Install Dependencies
# -------------------------------
FROM node:20-slim AS deps

WORKDIR /app

# Minimal required packages
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libc6 \
    && rm -rf /var/lib/apt/lists/*

# NPM reliability + speed
RUN npm config set fetch-retries 5 && \
    npm config set fetch-timeout 300000 && \
    npm config set prefer-offline true

# Copy package files only (better caching)
COPY package.json package-lock.json* ./

# Clean deterministic install
RUN npm ci --no-audit


# -------------------------------
# Stage 2: Build Application
# -------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Build-time ARGs
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_CHAT_SERVICE_URL
ARG NEXT_PUBLIC_TASK_SERVICE_URL
ARG NEXT_PUBLIC_VAPID_KEY
ARG NEXT_PUBLIC_NOTIFICATION_SERVICE_URL
ARG GOOGLE_MAPS_API_KEY

# Environment for Next build
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_CHAT_SERVICE_URL=$NEXT_PUBLIC_CHAT_SERVICE_URL
ENV NEXT_PUBLIC_TASK_SERVICE_URL=$NEXT_PUBLIC_TASK_SERVICE_URL
ENV NEXT_PUBLIC_VAPID_KEY=$NEXT_PUBLIC_VAPID_KEY
ENV NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=$NEXT_PUBLIC_NOTIFICATION_SERVICE_URL
ENV GOOGLE_MAPS_API_KEY=$GOOGLE_MAPS_API_KEY

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV TMPDIR=/tmp

# Temp directory
RUN mkdir -p /tmp && chmod 1777 /tmp

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy project files
COPY . .

# Build standalone production app
RUN npm run build


# -------------------------------
# Stage 3: Production Runner
# -------------------------------
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Security: non-root user
RUN useradd -m -u 1001 nextjs

# Copy ONLY minimal runtime files
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

# Runtime cache dirs
RUN mkdir -p /app/.next/cache/images /app/.next/cache/fetch-cache && \
    chown -R nextjs:nextjs /app

USER nextjs

EXPOSE 3000

# Standalone output runs server.js directly
CMD ["node", "server.js"]