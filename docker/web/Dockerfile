# --- Stage 1: Builder ---
FROM node:20-alpine AS builder

# ติดตั้ง libc6-compat สำหรับบาง library ที่ต้องใช้ใน alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 1. ก๊อปปี้ไฟล์โครงสร้างพื้นฐาน (Caching layer)
COPY package*.json ./
COPY turbo.json ./
COPY tsconfig.json ./
COPY packages/database/package*.json ./packages/database/
COPY apps/web/package*.json ./apps/web/

# 2. ติดตั้ง Dependencies ทั้งหมด
RUN npm install

# 3. ก๊อปปี้ Source Code
COPY packages/database ./packages/database
COPY apps/web ./apps/web

# 4. สร้าง Prisma Client
RUN npx prisma generate --schema=./packages/database/prisma/schema.prisma

# 5. ตั้งค่า Build Args สำหรับ Next.js
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# 6. Build Web app (Next.js Standalone)
RUN npx turbo run build --filter=@cnr/web...

# --- Stage 2: Production ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# ก๊อปปี้ไฟล์จาก standalone build
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# ตั้งค่าสิทธิ์ให้ user nextjs สามารถเขียนไฟล์ในโฟลเดอร์ cache ได้
RUN mkdir -p apps/web/.next/cache && chown -R nextjs:nodejs apps/web/.next/cache

USER nextjs
EXPOSE 3000

# รัน Next.js server.js ที่สร้างจาก standalone output
CMD ["node", "apps/web/server.js"]