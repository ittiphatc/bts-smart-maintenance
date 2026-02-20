# ====================================
# BTS Landing — Multi-stage Dockerfile
# Next.js 16 + Prisma 7 + PostgreSQL
# Compatible with Podman & Docker
# ====================================

# --- Stage 1: Dependencies ---
FROM node:22-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

# --- Stage 2: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js (standalone output)
RUN npm run build

# --- Stage 3: Production Runner ---
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy Next.js standalone output (server.js + minimal node_modules)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy full node_modules from builder (ทับ standalone node_modules)
# เพื่อให้ prisma CLI, tsx, pg + transitive deps ทำงานได้ครบ
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy Prisma generated client + schema + config
COPY --from=builder --chown=nextjs:nodejs /app/lib/generated ./lib/generated
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
