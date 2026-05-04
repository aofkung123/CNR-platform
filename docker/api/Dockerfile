# ─── Stage 1: Builder ────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
ENV COREPACK_ENABLE=0
ENV NEXT_PACKAGE_MANAGER=npm

# 1. ก๊อปปี้ package.json ของ Root และของทุก Workspace เข้าไปก่อน
COPY package*.json ./
COPY packages/database/package*.json ./packages/database/
COPY apps/api/package*.json ./apps/api/

# 2. รัน install จาก Root เพื่อให้ระบบ Workspace เชื่อมต่อกัน
RUN npm install

# 3. ก๊อปปี้ Source Code ทั้งหมดตามเข้าไป
COPY packages/database ./packages/database
COPY apps/api ./apps/api
COPY turbo.json ./
COPY tsconfig.json ./

# 4. รัน Build
RUN npm run db:generate
RUN npm run build --workspace=@cnr/database
RUN npm run build --workspace=@cnr/api

# ─── Stage 3: Runner ─────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/database/prisma ./prisma

EXPOSE 3000

# Run db push then start the app
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/index.js"]
