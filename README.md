# Portfolio — One Page Web App

เว็บพอร์ตโฟลิโอหน้าเดียว มี Navigation bar และรองรับทุกขนาดหน้าจอ
สร้างด้วย Next.js 16 (App Router) + TypeScript + Tailwind CSS v4

## เริ่มใช้งาน

```bash
npm run dev
```

เปิด http://localhost:3000

คำสั่งอื่น:

```bash
npm run build
```

```bash
npm run lint
```

---

## แก้เนื้อหาได้ที่ไฟล์เดียว

เนื้อหาทั้งหมด — ชื่อ คติประจำใจ คำแนะนำตัว ช่วงเวลาใน Timeline ลิงก์ติดต่อ — อยู่ใน
[`lib/content.ts`](lib/content.ts) ไม่ต้องแก้ไฟล์ component เลย

| ส่วนของเว็บ | ตัวแปรใน `lib/content.ts` |
| --- | --- |
| แท็บเบราว์เซอร์ / SEO | `site` |
| เมนูบน Navbar | `navItems` |
| Landing (รูป ชื่อ คติประจำใจ) | `profile` |
| Statement of Purpose | `purpose` |
| Certificate (หัวข้อ + ความเร็ววิ่ง) | `certificate` |
| Project (หัวข้อ + การ์ด 6 ใบ) | `project` |
| Framework (D-D-D-I) | `model` · `framework` |
| Closing (ข้อความปิดท้าย ถัดจาก Project) | `closing` |
| Footer | `footer` |

### ใส่รูปภาพ — แค่วางไฟล์ให้ถูกชื่อ

**ไม่ต้องแก้โค้ดเลย** วางไฟล์ลงใน `public/images/` ให้ชื่อตรงตามนี้ เว็บจะหยิบไปแสดงเอง

| ชื่อไฟล์ | ใช้ที่ไหน | สัดส่วน / ขนาดแนะนำ |
| --- | --- | --- |
| `landing.png` | รูปในหน้าแรก | **4:5 แนวตั้ง** · 1000 × 1250 px |
| `contact.png` | รูปในส่วนติดต่อ (ไม่มี = ใช้ `landing`) | **4:5 แนวตั้ง** · 1000 × 1250 px |
| `certificate1/1.jpg` `2.jpg` … | เกียรติบัตร **แถวบน** (วิ่งช้า) | **A4 แนวนอน 297:210** · 1754 × 1240 px |
| `certificate2/1.jpg` `2.jpg` … | เกียรติบัตร **แถวล่าง** (วิ่งเร็วกว่า) | " |
| `project/1.jpg` … `6.jpg` | รูปหลักของการ์ดโปรเจกต์ทั้ง 6 ใบ | สัดส่วนอิสระ |
| `project/1-1.jpg` `1-2.jpg` … | ภาพรองของการ์ดที่ 1 (เห็นตอนกดเข้าไป) | สัดส่วนอิสระ |
| `document.pdf` | ไฟล์ที่ปุ่ม **ดาวน์โหลดเอกสาร** ท้ายส่วน Model จะให้โหลด | รองรับ `.pdf` เพิ่มจากนามสกุลรูป |

> ปุ่มดาวน์โหลดเอกสารจะ **ไม่แสดงเลย** ถ้ายังไม่มีไฟล์ `document.*`
> ผู้อ่านจึงไม่เจอปุ่มที่กดแล้วได้ 404 — ตอน `npm run dev` จะมีคำเตือนใน terminal บอกด้วย
> เปลี่ยนชื่อไฟล์/ข้อความบนปุ่มได้ที่ `model.chapters[].cta` ใน `lib/content.ts`

รูปหน้าแรกและส่วนติดต่อแสดงแบบ **ไม่มีพื้นหลังและไม่มีกรอบ** ใช้ `object-contain`
ภาพจึงไม่ถูกครอบตัด — แนะนำไฟล์ PNG ที่ตัดพื้นหลังออกแล้ว

ชื่อไฟล์ในโฟลเดอร์ย่อยต้องเป็น **ตัวเลขล้วน** เรียงตามตัวเลขจริง (`10` อยู่หลัง `9`)
เกียรติบัตรใส่กี่ใบก็ได้ ไม่จำกัดจำนวน · นามสกุลที่รองรับ `.jpg` `.jpeg` `.png` `.webp` `.avif`

ตอนรัน `npm run dev` จะมีคำเตือนใน terminal ถ้ามีไฟล์ที่ตั้งชื่อผิดรูปแบบ
หรือมีไฟล์ที่ใช้เลขซ้ำกัน (เช่น `5.jpg` กับ `5.png` — ทั้งคู่จะถูกนำไปแสดง)

ยังไม่มีไฟล์ก็เปิดดูเว็บได้ตามปกติ — ช่องที่ยังไม่มีรูปจะขึ้นกล่อง gradient placeholder

**เกียรติบัตร** วิ่งไปทางซ้ายอัตโนมัติสองแถว แถวบนช้ากว่าแถวล่าง
ปรับความเร็วได้ที่ `certificate.topSpeed` / `certificate.bottomSpeed` (วินาทีต่อรอบ เลขมาก = ช้า)
แถววิ่งต่อเนื่องไม่หยุดตอนชี้เมาส์ — ใบที่ชี้จะยกขึ้นและเรืองขอบฟ้า ส่วนใบอื่นจางลง
(จะหยุดเฉพาะตอน tab ด้วยคีย์บอร์ด ไม่งั้นจะเล็งปุ่มที่กำลังวิ่งไม่ได้)

**การ์ดโปรเจกต์** รูปหลักใช้ `object-contain` รูปทุกสัดส่วนจึงแสดงครบไม่ถูกครอบตัด
กดที่รูปเพื่อดูเต็มจอ ถ้ามีภาพรอง (`1-1.jpg`, `1-2.jpg` …) จะเลื่อนดูต่อได้ในหน้าต่างเดียวกัน

**หน้าต่างดูรูปเต็มจอ** — แตะที่ไหนก็ได้เพื่อปิด (หรือกด Esc)
จอใหญ่ลูกศรอยู่สองข้างของรูป จอมือถือลูกศรอยู่ใต้รูป

> การอ่านชื่อไฟล์เกิดขึ้น**ตอน build** (ดูโค้ดที่ [`lib/images.ts`](lib/images.ts))
> ตอน `npm run dev` แค่ refresh หน้าก็เห็นรูปใหม่ แต่ถ้า deploy แล้วเพิ่มรูปต้อง build ใหม่

### ลิงก์ติดต่อใน Footer

แต่ละลิงก์แสดงเป็นไอคอนของแอปนั้น ๆ ฟิลด์ `icon` รับได้ 5 ค่า:
`email` · `instagram` · `facebook` · `github` · `discord`
ตัวไอคอนอยู่ใน [`components/BrandIcon.tsx`](components/BrandIcon.tsx) — ถ้าจะเพิ่มแอปอื่น
ให้เพิ่ม path ในไฟล์นั้นและเพิ่มชื่อใน type `IconName` ของ `lib/content.ts`

### ก่อน deploy

- แก้ `site.url` ใน `lib/content.ts` ให้เป็นโดเมนจริง (มีผลกับลิงก์ preview ตอนแชร์)
- แก้อีเมลและ URL ทั้ง 5 ช่องทางใน `footer.links`
- ไอคอนเว็บอยู่ที่ `app/icon.png` — สร้างใหม่จากต้นฉบับได้ด้วย `node scripts/make-favicon.mjs`
  (ต้นฉบับเก็บไว้ที่ `assets/iconweb.png` นอก `public/` เพราะของใน `public/` ถูกเปิดให้โหลดได้ทุกไฟล์)
- ย่อรูปก่อน deploy ด้วย `node scripts/optimize-images.mjs` — ต้นฉบับถูกสำรองไปที่ `../dday-images-original` ให้เอง

---

## โครงสร้างโปรเจกต์

```
app/
  layout.tsx      ฟอนต์, metadata/SEO, skip link
  page.tsx        ประกอบทุก section เรียงกันเป็นหน้าเดียว
  globals.css     design tokens, typography scale, gradient, reduced-motion
components/
  Navbar.tsx      sticky + scrollspy + แถบความคืบหน้า + เมนูมือถือ  (client)
  Hero.tsx        Landing (ถูกตรึงด้วย sticky ให้ About เลื่อนขึ้นมาทับ)
  About.tsx       Statement of Purpose
  Certificates.tsx  ส่วนเกียรติบัตร — สองแถววิ่งคนละความเร็ว
  CertificateRow.tsx  แถววิ่ง 1 แถว + เปิดดูเต็มจอ  (client)
  Projects.tsx    ส่วนโปรเจกต์ — อ่านรูปแล้วส่งให้การ์ด
  ProjectCard.tsx การ์ด 1 ใบ + เปิดดูภาพรองเต็มจอ  (client)
  Lightbox.tsx    ดูรูปเต็มจอด้วย <dialog> showModal  (client)
  Closing.tsx     Contact / ข้อความปิดท้าย (รูปซ้าย ข้อความขวา)
  BrandIcon.tsx   ไอคอนของแต่ละแอปใน Footer
  Footer.tsx
  Reveal.tsx      เอฟเฟกต์ค่อย ๆ ปรากฏตอนเลื่อน  (client)
  Collapsible.tsx ย่อ/กางเนื้อหายาว — กางแล้วปุ่มหายหรือถูกแทนที่  (client)
  TimelineRail.tsx เส้นแกนเรื่องที่ถูกวาดตามระยะเลื่อน (ใช้ใน Model)  (client)
  ScrollTop.tsx   ปุ่มลอยกลับขึ้นบนสุด  (client)
  CopyButton.tsx  ปุ่มคัดลอกอีเมล/เบอร์โทรใน Footer  (client)
  Section.tsx     โครง section มาตรฐาน
lib/
  content.ts      ⭐ ข้อความทั้งหมด
  images.ts       หารูปจาก public/images/ ตามชื่อไฟล์
public/images/    ⭐ รูปภาพทั้งหมด (ตั้งชื่อตามตารางด้านบน)
```

## หมายเหตุด้านการออกแบบ

**สี** — กำหนดเป็น token ใน `app/globals.css` (บล็อก `@theme`)
ใช้ผ่าน Tailwind ได้ตรง ๆ เช่น `text-ink`, `bg-mist`, `border-line`

| Token | ค่า |
| --- | --- |
| `ink` | `#01003e` |
| `cyan` | `#08daff` |
| `cyan-deep` | `#04708f` |
| `slate` | `#5b6076` |
| `mist` / `line` | `#f4f6fa` / `#e3e8f1` |

> `#08daff` บนพื้นขาวมี contrast แค่ ~1.6:1 ซึ่งต่ำกว่าเกณฑ์ WCAG มาก
> ในเว็บนี้จึงใช้เป็น **accent / เส้น / จุด / พื้นหลัง / gradient เท่านั้น**
> ถ้าต้องการข้อความสีฟ้าให้ใช้ `text-cyan-deep` (`#04708f`, ~5.7:1) แทน

**Animation** — ใช้ CSS + IntersectionObserver ล้วน ไม่มี library เพิ่ม
และปิดเอฟเฟกต์ทั้งหมดอัตโนมัติเมื่อผู้ใช้ตั้งค่า `prefers-reduced-motion: reduce`
ทุก keyframe ถูกออกแบบให้ "เฟรมสุดท้าย = สถานะปกติ" เสมอ หน้าเว็บจึงยังถูกต้องเมื่อถูก freeze

**Breakpoints** — การ์ดโปรเจกต์เรียง 1 / 2 / 3 คอลัมน์ที่ 0 / 640 / 1024px
การ์ดลอยข้างรูปและแถบคำวิ่งในหน้าแรกแสดงเฉพาะ ≥1024px
เมนูมือถือ (แผง dropdown) แสดงต่ำกว่า 768px
