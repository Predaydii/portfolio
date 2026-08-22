import Reveal from "./Reveal";
import CertificateGallery from "./CertificateGallery";
import SectionAura from "./SectionAura";
import { certificate } from "@/lib/content";
import {
  findAllNumbered,
  findDuplicateNumbers,
  findUnnumberedImages,
} from "@/lib/images";

/** สร้างรายการรูปพร้อมคำอธิบายสำหรับ screen reader (ไม่แสดงเป็นข้อความบนจอ) */
function toGallery(folder: string, rowLabel: string) {
  return findAllNumbered(folder).map((src, i) => ({
    src,
    alt: `เกียรติบัตร ${rowLabel} ใบที่ ${i + 1}`,
  }));
}

export default function Certificates() {
  const top = toGallery("certificate1", "แถวบน");
  const bottom = toGallery("certificate2", "แถวล่าง");

  // เตือนตอน dev ถ้ามีไฟล์ที่ตั้งชื่อไม่ใช่ตัวเลขล้วน จะได้ไม่งงว่าทำไมรูปไม่ขึ้น
  if (process.env.NODE_ENV === "development") {
    for (const folder of ["certificate1", "certificate2"]) {
      const skipped = findUnnumberedImages(folder);
      if (skipped.length > 0) {
        console.warn(
          `[certificate] รูปใน public/images/${folder}/ ที่ยังไม่ถูกนำไปแสดง ` +
            "เพราะชื่อไฟล์ไม่ใช่ตัวเลขล้วน (ต้องเป็น 1.jpg, 2.jpg, ...):\n  " +
            skipped.join("\n  "),
        );
      }

      for (const group of findDuplicateNumbers(folder)) {
        console.warn(
          `[certificate] public/images/${folder}/ มีไฟล์ที่ใช้เลขซ้ำกัน ` +
            `จะถูกนำไปแสดงทั้งคู่: ${group.join(" , ")}`,
        );
      }
    }
  }

  return (
    // ไม่ใช้ Section เพราะแถวเกียรติบัตรต้องกินเต็มความกว้างจอ ไม่ติด container
    <section
      id="certificate"
      className="relative overflow-hidden bg-mist py-20 sm:py-28"
    >
      <SectionAura tone="ink" />

      <header className="relative z-10 mx-auto max-w-2xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="t-eyebrow">{certificate.eyebrow}</p>
          <h2 className="t-section mt-4">{certificate.heading}</h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-slate">
            {certificate.intro}
          </p>

          {/* บอกวิธีใช้ให้ชัด — แถวที่วิ่งอยู่เองไม่ได้สื่อว่ากดได้ */}
          <p className="font-display mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[0.8rem] text-slate shadow-card">
            <span aria-hidden="true" className="text-cyan-deep">
              ⤢
            </span>
            กดที่เกียรติบัตรเพื่อดูขนาดเต็ม
          </p>
        </Reveal>
      </header>

      {/* สองแถววิ่งไปทางซ้าย แถวบนช้ากว่าแถวล่าง
          กดใบไหนก็เปิดรายการรวมของทั้งสองแถว ผู้ใช้จึงเลื่อนดูได้ครบ
          ไม่ต้องปิดแล้วไปกดอีกแถวเพื่อดูที่เหลือ */}
      <CertificateGallery
        top={top}
        bottom={bottom}
        topSpeed={certificate.topSpeed}
        bottomSpeed={certificate.bottomSpeed}
      />
    </section>
  );
}
