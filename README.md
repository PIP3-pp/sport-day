# Sports Day — เว็บไซต์กีฬาสีโรงเรียน

ศูนย์รวมข้อมูลงานกีฬาสี: คะแนนรวม ผลการแข่งขัน ตารางแข่ง ข้อมูลทีมสี ข่าวสาร และลิงก์ภาพกิจกรรม
พร้อมหลังบ้านสำหรับผู้ดูแล

- **เว็บสาธารณะ** — `/`, `/practice` (ตารางซ้อม), `/schedule`, `/results`, `/teams`, `/teams/[slug]`, `/gallery`
- **ผู้ดูแล** — `/admin` (Dashboard, ตารางซ้อม, Matches, Results, Teams, Sports, Highlights, Announcements, Activity, หน้าเว็บ, Settings)

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Motion ·
Prisma Postgres + Drizzle ORM · Better Auth · Zod · Vercel Blob

## เริ่มใช้งาน

```bash
npm install
cp .env.example .env.local   # แล้วกรอกค่าตามด้านล่าง
npm run db:migrate           # สร้างตาราง
npm run db:seed              # 4 ทีมสี + ค่าตั้งต้นของงาน
npm run admin:create         # สร้างบัญชีผู้ดูแลจาก ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev
```

### Environment variables

ทุกตัวเป็น **server-only** ไม่มีค่าใดถูกส่งไปที่ browser

| ตัวแปร | ใช้ทำอะไร |
|---|---|
| `DATABASE_URL` | Connection string ของ Prisma Postgres ([console.prisma.io](https://console.prisma.io) หรือ Vercel Marketplace) |
| `BETTER_AUTH_SECRET` | คีย์เข้ารหัส session — สร้างด้วย `npx @better-auth/cli secret` |
| `BETTER_AUTH_URL` | Origin ของเว็บ (`http://localhost:3000` หรือโดเมนจริง) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob สำหรับอัปโหลดโลโก้/รูป Highlight/รูปปก (ไม่ใส่ก็ใช้งานส่วนอื่นได้) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | ใช้ครั้งเดียวตอน `npm run admin:create` (รหัสผ่านอย่างน้อย 10 ตัวอักษร) |

### ข้อมูลเดโม

`npm run db:seed-demo` ใส่กีฬา การแข่งขัน ผล และประกาศตัวอย่างสำหรับพัฒนา/พรีวิว
**ห้ามรันกับฐานข้อมูลจริง** (สคริปต์ปฏิเสธเมื่อ `NODE_ENV=production` และเมื่อมีการแข่งขันอยู่แล้ว)

## ขั้นตอนการใช้งานของผู้ดูแล

1. **Sports** — เพิ่มชนิดกีฬา
1. **ตารางซ้อม** — เพิ่มวัน เวลา และสถานที่ซ้อมของแต่ละสีในแต่ละกีฬา (สีหนึ่งมีได้หลายช่วงเวลา)
   หน้าเว็บแสดงที่ `/practice` แยกตามกีฬา กรองตามสีได้
2. **Teams** — แก้ชื่อ สโลแกน คำอธิบาย โลโก้ของ 4 สี
3. **Matches** — สร้างการแข่งขัน เลือกรูปแบบ *แข่งเป็นคู่* หรือ *ทุกสีแข่งพร้อมกัน* (เช่น กรีฑา)
4. **Results** — กด "เริ่มแข่ง" เมื่อเริ่มแข่ง (หน้าเว็บจะขึ้นสถานะ "กำลังแข่งขัน") แล้วเมื่อแข่งจบ
   กรอกสกอร์/อันดับ และคะแนนสะสมที่แต่ละสีได้ ระบบจะตั้งสถานะเป็น "เสร็จสิ้น" และอัปเดตคะแนนรวมทันที
   (ถ้าตั้ง "คะแนนสะสมตามอันดับ" ใน Settings ช่องคะแนนจะถูกเติมให้เมื่อเลือกอันดับ)
5. **Highlights** — เลือก Highlight of the Day (วันละ 1 รายการ)
6. **Activity** — ดูว่าใครแก้ไขอะไรเมื่อไร (100 รายการล่าสุด)
7. **Announcements / Settings** — ข่าวสาร ชื่องาน ปี สโลแกน ลิงก์ Google Drive
8. **หน้าเว็บ** — เปลี่ยนรูปปกหน้าแรก (PNG, JPEG, GIF, SVG, WebP, MOV, MP4 ไม่เกิน 50 MB
   อัปโหลดจาก browser ตรงไป Vercel Blob) และสวิตช์เปิด/ปิดแต่ละส่วนของหน้าแรกและแต่ละหน้าในเมนู
   หน้าที่ปิดจะหายจากเมนูและตอบ 404 — ค่าเริ่มต้นปิด **ตารางการแข่งขัน** ไว้ (ระบบยังอยู่ครบ เปิดกลับได้ทุกเมื่อ)

## หลักการสำคัญ

- **คะแนนรวมไม่มีการเก็บตรงๆ** — คำนวณจาก `SUM(score_points.points) GROUP BY team` เสมอ
  ([lib/queries/standings.ts](lib/queries/standings.ts))
- **บันทึกผลเป็น transaction เดียว** และกันการบันทึกซ้ำทั้งในโค้ดและด้วย unique index
  ([lib/actions/results.ts](lib/actions/results.ts))
- **คะแนนเท่ากัน** — จัดอันดับด้วยคะแนนรวมก่อน ถ้าเท่ากันดูจำนวนครั้งที่ได้อันดับ 1
  ถ้ายังเท่ากันจึงใช้อันดับร่วมกัน
- **อัปเดตอัตโนมัติ** — หน้าเว็บสาธารณะรีเฟรชข้อมูลเองทุก 45 วินาทีขณะเปิดหน้าไว้
- **ความปลอดภัย** — browser ไม่ต่อฐานข้อมูลโดยตรง ทุก server action ตรวจ session ผู้ดูแล
  และตรวจ input ด้วย Zod ฝั่ง server ปิดการสมัครสมาชิกสาธารณะ
- **ประสิทธิภาพ** — query ฝั่งสาธารณะถูก cache แบบมี tag และถูกล้างเมื่อผู้ดูแลบันทึกข้อมูล
  ([lib/queries/cache.ts](lib/queries/cache.ts))

## คำสั่ง

| คำสั่ง | |
|---|---|
| `npm run dev` / `build` / `start` | รันเว็บ |
| `npm run lint` / `typecheck` / `test` | ตรวจโค้ดและรัน unit test |
| `npm run db:generate` | สร้างไฟล์ migration หลังแก้ [db/schema.ts](db/schema.ts) |
| `npm run db:migrate` | apply migration (ต้องรันเองกับฐานข้อมูล production ก่อน deploy โค้ดที่เปลี่ยน schema) |

## Deploy (Vercel)

1. Push ขึ้น GitHub แล้ว import โปรเจกต์ใน Vercel
2. ใส่ environment variables ตามตารางด้านบน (`BETTER_AUTH_URL` = โดเมนจริง)
3. รัน `npm run db:migrate`, `npm run db:seed`, `npm run admin:create` กับฐานข้อมูล production หนึ่งครั้ง
   (ทุกครั้งที่มี migration ใหม่ ต้องรัน `npm run db:migrate` เองก่อน push ขึ้น main)
