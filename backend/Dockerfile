# ---------- STAGE 1: deps ----------
FROM node:22-slim AS deps
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci

# ---------- STAGE 2: build ----------
FROM node:22-slim AS build
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma ./prisma
COPY . .

# gera Prisma NO LINUX e escreve em /app/generated/prisma
RUN npx prisma generate

# build do Nest
RUN npm run build

# mantém só deps de produção
RUN npm prune --omit=dev

# ---------- STAGE 3: runtime ----------
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/generated ./generated
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
