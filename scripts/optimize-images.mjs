/**
 * ย่อและแปลงรูปใน public/images ให้เหมาะกับเว็บ
 *
 *   node scripts/optimize-images.mjs
 *
 * ไฟล์ต้นฉบับถูกย้ายไปเก็บไว้ที่ ../dday-images-original ก่อนเสมอ
 * (อยู่นอกโปรเจกต์ จึงไม่ถูกอัปโหลดตอน deploy และไม่เข้า git)
 *
 * แปลงเป็น WebP เพราะเล็กกว่า JPEG ราว 30% ที่คุณภาพเท่ากัน
 * และยังเก็บพื้นหลังโปร่งใสได้ ต่างจาก JPEG
 * โค้ดใน lib/images.ts รองรับ .webp อยู่แล้ว จึงไม่ต้องแก้อะไรเพิ่ม
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const IMAGES = "public/images";
const BACKUP = path.join("..", "dday-images-original");

/** ความกว้างสูงสุดของแต่ละกลุ่ม เลือกจากขนาดที่ใหญ่ที่สุดที่หน้าเว็บใช้จริง */
const RULES = [
  { match: /^project\//, width: 1920, quality: 80 },
  { match: /^certificate\d\//, width: 1800, quality: 82 },
  { match: /^landing\./, width: 1400, quality: 88 },
  { match: /^sop\./, width: 1920, quality: 82 },
];

const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );

const mb = (bytes) => (bytes / 1048576).toFixed(2);

let before = 0;
let after = 0;
let converted = 0;

for (const file of walk(IMAGES)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;

  // Windows คืน path แบบ \ ต้องแปลงเป็น / ก่อน ไม่งั้น regex ไม่ตรง
  const rel = path.relative(IMAGES, file).split(path.sep).join('/');
  const rule = RULES.find((r) => r.match.test(rel));
  if (!rule) continue;

  const size = fs.statSync(file).size;
  const meta = await sharp(file).metadata();

  // เก็บต้นฉบับไว้ก่อนแตะต้องอะไร
  const backupPath = path.join(BACKUP, rel);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.copyFileSync(file, backupPath);

  const target = file.replace(/\.(png|jpe?g)$/i, ".webp");
  await sharp(file)
    .resize({ width: Math.min(rule.width, meta.width), withoutEnlargement: true })
    .webp({ quality: rule.quality, effort: 6 })
    .toFile(target + ".tmp");

  fs.renameSync(target + ".tmp", target);
  if (path.resolve(target) !== path.resolve(file)) fs.unlinkSync(file);

  const newSize = fs.statSync(target).size;
  before += size;
  after += newSize;
  converted += 1;

  console.log(
    `${rel.padEnd(28)} ${mb(size).padStart(7)} MB → ${mb(newSize).padStart(6)} MB   ${meta.width}px → ${Math.min(rule.width, meta.width)}px`,
  );
}

console.log("\n──────────────────────────────────────────────");
console.log(`แปลง ${converted} ไฟล์`);
console.log(`ก่อน ${mb(before)} MB → หลัง ${mb(after)} MB`);
console.log(`ลดลง ${(100 - (after / before) * 100).toFixed(1)}%`);
console.log(`ต้นฉบับเก็บไว้ที่ ${path.resolve(BACKUP)}`);
