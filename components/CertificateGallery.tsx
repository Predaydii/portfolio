"use client";

import { useState } from "react";
import CertificateRow from "./CertificateRow";
import Lightbox from "./Lightbox";
import type { GalleryImage } from "@/lib/content";

type Props = {
  top: GalleryImage[];
  bottom: GalleryImage[];
  topSpeed: number;
  bottomSpeed: number;
};

const ROW_HEIGHT = "h-36 sm:h-44 lg:h-52";

/**
 * สองแถวเกียรติบัตร + หน้าต่างดูรูปเต็มจอที่ใช้ร่วมกัน
 *
 * Lightbox ถือรายการ "รวมทุกแถว" ไว้ตัวเดียว แถวจึงเป็นแค่ตัวแสดงผล
 * กดใบไหนก็เลื่อนดูต่อได้จนครบทุกใบ ไม่ติดอยู่แค่แถวที่กด
 * — แถวล่างถูกวางต่อท้ายแถวบน ลำดับที่เห็นจึงตรงกับที่อ่านจากซ้ายไปขวา บนลงล่าง
 */
export default function CertificateGallery({
  top,
  bottom,
  topSpeed,
  bottomSpeed,
}: Props) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const all = [...top, ...bottom];

  return (
    <>
      <div className="marquee-group relative z-10 mt-12 space-y-4 sm:mt-16 sm:space-y-5">
        <CertificateRow
          images={top}
          duration={topSpeed}
          heightClass={ROW_HEIGHT}
          label="เกียรติบัตรแถวบน"
          offset={0}
          onOpen={setOpenAt}
        />
        <CertificateRow
          images={bottom}
          duration={bottomSpeed}
          heightClass={ROW_HEIGHT}
          label="เกียรติบัตรแถวล่าง"
          offset={top.length}
          onOpen={setOpenAt}
        />
      </div>

      {openAt !== null && (
        <Lightbox
          images={all}
          index={openAt}
          onIndexChange={setOpenAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </>
  );
}
