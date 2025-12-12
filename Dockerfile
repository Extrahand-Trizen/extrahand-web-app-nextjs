# Multi-stage build for Next.js production image

# --- Stage 1: Dependencies -------------------------------------
FROM node:20-slim AS deps
WORKDIR /app

# Install OS dependencies needed for Next.js standalone
RUN apt-get update && apt-get install -y \
    ca-certificates \
    libc6 \
    && rm -rf /var/lib/apt/lists/*

# Configure npm for better network reliability (simplified)
RUN npm config set fetch-retries 5 && \
    npm config set fetch-timeout 300000

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (cached layer)
RUN npm ci --no-audit

# --- Stage 2: Builder --------------------------------------------
FROM node:20-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# --- Stage 3: Runner ---------------------------------------------
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN useradd -m nextjs
USER nextjs

# Copy required artifacts
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
