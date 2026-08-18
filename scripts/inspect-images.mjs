import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const root = "public/images";
const walk = (d) =>
  fs
    .readdirSync(d, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)],
    );

const files = walk(root).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const rows = [];
for (const f of files) {
  try {
    const m = await sharp(f).metadata();
    rows.push({
      kb: fs.statSync(f).size / 1024,
      w: m.width,
      h: m.height,
      alpha: !!m.hasAlpha,
      f: f.split(path.sep).join("/"),
    });
  } catch {
    rows.push({ kb: 0, w: 0, h: 0, alpha: false, f: `${f} (ERR)` });
  }
}
rows.sort((a, b) => b.kb - a.kb);
for (const r of rows) {
  console.log(
    `${String(Math.round(r.kb)).padStart(6)} KB  ${String(r.w).padStart(5)}x${String(r.h).padEnd(5)} alpha=${r.alpha ? "Y" : "N"}  ${r.f}`,
  );
}
console.log(
  "รวม",
  Math.round(rows.reduce((s, r) => s + r.kb, 0) / 1024),
  "MB จาก",
  rows.length,
  "ไฟล์",
);
