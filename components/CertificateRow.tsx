"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "./Lightbox";
import type { GalleryImage } from "@/lib/content";

type Props = {
  images: GalleryImage[];
  /** วินาทีต่อรอบ — เลขมากคือวิ่งช้า */
  duration: number;
  /** คลาสความสูงของเกียรติบัตร ความกว้างคำนวณจากสัดส่วน A4 แนวนอนให้เอง */
  heightClass: string;
  label: string;
};

/** สัดส่วนกระดาษ A4 แนวนอน (297 × 210 มม.) */
const A4_LANDSCAPE = "aspect-[297/210]";

/** จำนวนกล่องเปล่าที่แสดงตอนยังไม่มีไฟล์รูป */
const PLACEHOLDER_COUNT = 6;

export default function CertificateRow({
  images,
  duration,
  heightClass,
  label,
}: Props) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="marquee" aria-hidden="true">
        <ul
          className="marquee-track"
          style={{ animationDuration: `${duration}s` }}
        >
          {Array.from({ length: PLACEHOLDER_COUNT * 2 }, (_, i) => (
            <li key={i} className="me-4 shrink-0 sm:me-5">
              <div
                className={`grad-placeholder flex items-center justify-center rounded-xl ${heightClass} ${A4_LANDSCAPE}`}
              >
                <span className="font-display text-[0.65rem] tracking-[0.22em] text-cyan uppercase">
                  certificate
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // วางซ้ำสองชุดเพื่อให้เลื่อนวนได้ต่อเนื่อง ชุดที่สองซ่อนจาก screen reader
  const loop = [...images, ...images];

  return (
    <>
      <div className="marquee">
        <ul
          className="marquee-track"
          style={{ animationDuration: `${duration}s` }}
          aria-label={label}
        >
          {loop.map((image, i) => {
            const index = i % images.length;
            const isClone = i >= images.length;
            return (
              <li
                key={i}
                className="me-4 shrink-0 sm:me-5"
                aria-hidden={isClone ? "true" : undefined}
              >
                <button
                  type="button"
                  onClick={() => setOpenAt(index)}
                  tabIndex={isClone ? -1 : undefined}
                  aria-label={`ดูเกียรติบัตรขนาดเต็ม: ${image.alt}`}
                  className={`group/cert relative block cursor-zoom-in overflow-hidden rounded-xl border border-line bg-white shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift ${heightClass} ${A4_LANDSCAPE}`}
                >
                  <Image
                    src={image.src}
                    alt={isClone ? "" : image.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 300px, 240px"
                    className="object-cover transition-transform duration-500 group-hover/cert:scale-[1.04]"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {openAt !== null && (
        <Lightbox
          images={images}
          index={openAt}
          onIndexChange={setOpenAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </>
  );
}
