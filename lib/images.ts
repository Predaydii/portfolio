import fs from "node:fs";
import path from "node:path";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  หารูปจากโฟลเดอร์ public/images/ ตามชื่อไฟล์ — ไม่ต้องมาแก้ lib/content.ts
 *  แค่วางไฟล์ลงไปให้ถูกชื่อ เว็บก็หยิบไปแสดงเอง
 *
 *    public/images/landing.jpg        → รูปในหน้า Landing  (สัดส่วน 4:5 แนวตั้ง)
 *    public/images/contact.jpg        → รูปในส่วน Contact  (สัดส่วน 4:5 แนวตั้ง)
 *                                       ถ้าไม่มี contact จะใช้ landing แทน
 *
 *    public/images/certificate1/1.jpg → เกียรติบัตรใบที่ 1 ของแถวบน (A4 แนวนอน)
 *    public/images/certificate2/1.jpg → เกียรติบัตรใบที่ 1 ของแถวล่าง
 *                                       ใส่กี่ใบก็ได้ 1, 2, 3, ... ไปเรื่อย ๆ
 *
 *    public/images/project/1.jpg      → รูปหลักของการ์ดโปรเจกต์ที่ 1 (มี 6 การ์ด)
 *    public/images/project/1-1.jpg    → ภาพรองของการ์ดที่ 1 (เห็นตอนกดดูเต็มจอ)
 *
 *  นามสกุลที่รองรับ: .jpg .jpeg .png .webp .avif (พิมพ์เล็กหรือใหญ่ก็ได้)
 *
 *  ฟังก์ชันเหล่านี้อ่านไฟล์จริงจากดิสก์ จึงเรียกได้เฉพาะใน Server Component
 * ─────────────────────────────────────────────────────────────────────────
 */

const IMAGE_DIR = path.join(process.cwd(), "public", "images");
const EXTENSION = /\.(jpe?g|png|webp|avif)$/i;

function listFiles(dir: string): string[] {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((item) => item.isFile())
      .map((item) => item.name);
  } catch {
    // ยังไม่มีโฟลเดอร์ก็ไม่ถือเป็นข้อผิดพลาด — ให้แสดง placeholder ไปก่อน
    return [];
  }
}

/** ชื่อไฟล์ภาษาไทยหรือมีช่องว่าง ต้อง encode ก่อนเอาไปใส่ src */
function toUrl(base: string, file: string): string {
  return `${base}${encodeURIComponent(file)}`;
}

/**
 * หาไฟล์สำหรับ "ดาวน์โหลด" ตามชื่อ เช่น findDownload("document")
 * รองรับนามสกุลกว้างกว่ารูปภาพ เพราะเอกสารมักเป็น .pdf
 * แยกจาก EXTENSION เพื่อไม่ให้ไฟล์เอกสารหลุดเข้าไปในแกลเลอรีรูป
 */
const DOWNLOAD_EXTENSION = /\.(jpe?g|png|webp|avif|pdf)$/i;

export function findDownload(name: string): string | null {
  const target = name.toLowerCase();
  const file = listFiles(IMAGE_DIR).find(
    (f) =>
      DOWNLOAD_EXTENSION.test(f) &&
      f.replace(DOWNLOAD_EXTENSION, "").toLowerCase() === target,
  );
  return file ? toUrl("/images/", file) : null;
}

/** หาไฟล์ที่ชื่อ (ไม่รวมนามสกุล) ตรงกับที่ระบุ เช่น findImage("landing") */
export function findImage(name: string): string | null {
  const target = name.toLowerCase();
  const file = listFiles(IMAGE_DIR).find(
    (f) =>
      EXTENSION.test(f) && f.replace(EXTENSION, "").toLowerCase() === target,
  );
  return file ? toUrl("/images/", file) : null;
}

/**
 * หาไฟล์ตามชื่อในโฟลเดอร์ย่อย เช่น findImageIn("icon", "Discover")
 * เทียบชื่อแบบไม่สนตัวพิมพ์เล็ก-ใหญ่
 */
export function findImageIn(folder: string, name: string): string | null {
  const target = name.toLowerCase();
  const file = listFiles(path.join(IMAGE_DIR, folder)).find(
    (f) =>
      EXTENSION.test(f) && f.replace(EXTENSION, "").toLowerCase() === target,
  );
  return file ? toUrl(`/images/${folder}/`, file) : null;
}

/**
 * หารูปที่ตั้งชื่อเป็นตัวเลขล้วนในโฟลเดอร์ย่อย โดยกำหนดจำนวนช่องไว้ล่วงหน้า
 *   public/images/project/1.jpg, 2.jpg, 3.jpg ...
 * คืนอาร์เรย์ยาวเท่ากับ `count` เสมอ ช่องที่ยังไม่มีไฟล์จะเป็น null (แสดง placeholder)
 */
export function findNumberedImages(
  folder: string,
  count: number,
): (string | null)[] {
  const files = listFiles(path.join(IMAGE_DIR, folder));

  return Array.from({ length: count }, (_, i) => {
    const target = String(i + 1);
    const file = files.find(
      (f) => EXTENSION.test(f) && f.replace(EXTENSION, "") === target,
    );
    return file ? toUrl(`/images/${folder}/`, file) : null;
  });
}

/**
 * หารูปทั้งหมดที่ตั้งชื่อเป็นตัวเลขล้วนในโฟลเดอร์ย่อย โดยไม่จำกัดจำนวน
 *   public/images/certificate1/1.jpg, 2.jpg, 3.jpg ...
 * เรียงตามตัวเลขจริง (10 อยู่หลัง 9) — มีกี่ไฟล์ก็หยิบมาหมด
 */
export function findAllNumbered(folder: string): string[] {
  return listFiles(path.join(IMAGE_DIR, folder))
    .filter((f) => EXTENSION.test(f) && /^\d+$/.test(f.replace(EXTENSION, "")))
    .map((file) => ({ file, order: Number(file.replace(EXTENSION, "")) }))
    .sort((a, b) => a.order - b.order)
    .map((entry) => toUrl(`/images/${folder}/`, entry.file));
}

/**
 * รูปทั้งหมดของการ์ดโปรเจกต์ลำดับที่ `position` (เริ่มนับจาก 1)
 * รูปหลัก `<position>.jpg` มาก่อน แล้วตามด้วยภาพรอง `<position>-1.jpg`, `<position>-2.jpg` ...
 * ที่จะเห็นตอนกดเข้าไปดูเต็มจอ
 */
export function findProjectImages(position: number): string[] {
  const files = listFiles(path.join(IMAGE_DIR, "project"));
  const main = files.find(
    (f) => EXTENSION.test(f) && f.replace(EXTENSION, "") === String(position),
  );

  const extras = files
    .filter((f) => EXTENSION.test(f))
    .map((file) => ({
      file,
      match: file.replace(EXTENSION, "").match(/^(\d+)-(\d+)$/),
    }))
    .filter((entry) => entry.match?.[1] === String(position))
    .map((entry) => ({ file: entry.file, order: Number(entry.match![2]) }))
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.file);

  return [...(main ? [main] : []), ...extras].map((file) =>
    toUrl("/images/project/", file),
  );
}

/**
 * ไฟล์รูปในโฟลเดอร์ที่ตั้งชื่อไม่ใช่ตัวเลขล้วน จึงยังไม่ถูกนำไปแสดง
 * ใช้เตือนตอน dev จะได้ไม่งงว่าทำไมรูปไม่ขึ้น
 */
export function findUnnumberedImages(folder: string): string[] {
  return listFiles(path.join(IMAGE_DIR, folder)).filter(
    (f) => EXTENSION.test(f) && !/^\d+$/.test(f.replace(EXTENSION, "")),
  );
}

/**
 * ไฟล์ที่ใช้เลขเดียวกันแต่คนละนามสกุล เช่น 5.jpg กับ 5.png
 * ทั้งคู่จะถูกนำไปแสดงพร้อมกัน ซึ่งมักไม่ใช่สิ่งที่ตั้งใจ — ใช้เตือนตอน dev
 */
export function findDuplicateNumbers(folder: string): string[][] {
  const byNumber = new Map<string, string[]>();

  for (const file of listFiles(path.join(IMAGE_DIR, folder))) {
    if (!EXTENSION.test(file)) continue;
    const key = file.replace(EXTENSION, "");
    if (!/^\d+$/.test(key)) continue;
    byNumber.set(key, [...(byNumber.get(key) ?? []), file]);
  }

  return [...byNumber.values()].filter((files) => files.length > 1);
}
