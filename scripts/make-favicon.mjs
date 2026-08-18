/**
 * สร้างไอคอนเว็บจาก assets/iconweb.png
 *   node scripts/make-favicon.mjs
 *
 * Next.js App Router จะหยิบ app/icon.png ไปใส่ <link rel="icon"> ให้เอง
 *
 * ไฟล์ต้นฉบับอยู่นอก public/ โดยตั้งใจ — ของใน public/ ถูกอัปขึ้นเซิร์ฟเวอร์
 * และเปิดให้ดาวน์โหลดได้ทุกไฟล์ ต้นฉบับ 5 MB จึงไม่ควรอยู่ที่นั่น
 * ทั้งที่ไม่มีหน้าไหนเรียกใช้
 */
import sharp from "sharp";
import fs from "node:fs";

const SOURCE = "assets/iconweb.png";
if (!fs.existsSync(SOURCE)) {
  console.error("ไม่พบไฟล์", SOURCE);
  process.exit(1);
}

const original = fs.statSync(SOURCE).size;
const buffer = fs.readFileSync(SOURCE);

// ไอคอนที่เบราว์เซอร์ใช้จริง
await sharp(buffer).resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile("app/icon.png");

// แทนที่ไฟล์ต้นฉบับด้วยขนาดที่เหมาะกับเว็บ
await sharp(buffer).resize(1024, 1024, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(SOURCE + ".tmp");
fs.renameSync(SOURCE + ".tmp", SOURCE);

const kb = (n) => (n / 1024).toFixed(0);
console.log(`app/icon.png            512x512   ${kb(fs.statSync("app/icon.png").size)} KB`);
console.log(`${SOURCE}  1024x1024  ${kb(original)} KB → ${kb(fs.statSync(SOURCE).size)} KB`);
