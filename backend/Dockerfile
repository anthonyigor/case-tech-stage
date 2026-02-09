# ---------- STAGE 1: Build ----------
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

# Gera Prisma Client
RUN npx prisma generate

# Build do Nest (gera dist/)
RUN npm run build


# ---------- STAGE 2: Production ----------
FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# Copia build
COPY --from=builder /app/dist ./dist

# Copia Prisma runtime (schema/migrations/config)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

COPY --from=builder /app/generated ./generated

EXPOSE 3000

CMD ["node", "dist/src/main.js"]