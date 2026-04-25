FROM node:22-alpine AS base

# Couche pour installer les dépendances (cache Docker optimisé)
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Couche de Build Next.js
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Couche d'exécution minimale pour la production
FROM base AS runner
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Configuration du volume Data SQLite par défaut
ENV DATABASE_URL="file:/app/data/prod.db"
ENV AUTH_SECRET="bmad-inv-super-secret-key-for-prod"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Assets publics et build standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/start.sh ./start.sh

RUN chmod +x ./start.sh

# Créer le répertoire pour les données de base de données persistée SQLite
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["./start.sh"]
