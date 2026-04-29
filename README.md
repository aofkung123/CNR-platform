# 🚀 CNR Platform

## ติดตั้ง Dependencies

```bash
npm install
```


## การจัดการฐานข้อมูล

โปรเจกต์นี้ใช้ Prisma เป็น ORM ในการจัดการฐานข้อมูล (MariaDB)

### 1. สั่งรัน Database ผ่าน Docker
```bash
docker-compose up -d db
```

### 2. Setup Database Schema
รันคำสั่งเพื่อสร้างตารางในฐานข้อมูล:
```bash
npm run db:generate
npm run db:migrate
```

---

## วิธีการรันโปรเจกต์ ### รันผ่าน Docker
```bash 
docker-compose up --build
 ```

---
## โครงสร้างโปรเจกต์

- `apps/web`: Next.js Application (Frontend)
- `apps/api`: Express API (Backend)
- `packages/`: แพ็กเกจที่ใช้ร่วมกันในระบบ
- `docker/`: ไฟล์สำหรับตั้งค่า Docker ของแต่ละ Service


