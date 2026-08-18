"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "./Lightbox";
import type { GalleryImage, ProjectCard as CardContent } from "@/lib/content";

type Props = {
  card: CardContent;
  /** รูปหลักอยู่ลำดับแรก ที่เหลือเป็นภาพรองที่เห็นตอนกดเข้าไป */
  images: GalleryImage[];
};

export default function ProjectCard({ card, images }: Props) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const main = images[0];
  const extras = images.length - 1;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-lift has-[button:focus-visible]:-translate-y-1.5 has-[button:focus-visible]:shadow-lift">
      {/* ── รูป 16:9 ── มุมบนถูกตัดตามรัศมีของการ์ดด้วย overflow-hidden ของ <article> */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-mist">
        {main ? (
          <>
            <Image
              src={main.src}
              alt={main.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 352px, (min-width: 640px) 45vw, 90vw"
              className="card-img-fade object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            {/* สำเนาที่เบลอ โผล่แค่ช่วงที่รูปกำลังละลาย ทำให้ขอบล่างนุ่มขึ้น */}
            <Image
              src={main.src}
              alt=""
              aria-hidden="true"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 352px, (min-width: 640px) 45vw, 90vw"
              className="card-img-blur object-cover"
            />
          </>
        ) : (
          <div
            className="grad-placeholder flex h-full w-full items-center justify-center"
            role="img"
            aria-label={`ยังไม่มีรูปสำหรับ ${card.title}`}
          >
            <span className="font-display text-[0.65rem] tracking-[0.22em] text-cyan uppercase">
              no image yet
            </span>
          </div>
        )}

        {/* นับเฉพาะภาพ "เพิ่มเติม" ไม่รวมรูปหลักที่เห็นอยู่บนการ์ดแล้ว
            บอกสิ่งที่จะได้เพิ่มเมื่อกด ตรงกว่าการบอกจำนวนรวมทั้งหมด */}
        {main && extras > 0 && (
          <span className="font-display absolute top-3 left-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur-sm">
            {extras} ภาพเพิ่มเติม
          </span>
        )}

        {/* ปุ่มลูกศรโผล่ขึ้นตอนชี้เมาส์ */}
        {main && (
          <span
            aria-hidden="true"
            className="absolute top-3 right-3 flex h-9 w-9 scale-90 items-center justify-center rounded-full bg-ink/75 text-white opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-300 group-hover:scale-100 group-hover:opacity-100"
          >
            ↗
          </span>
        )}
      </div>

      {/* pt เผื่อระยะไว้ ไม่ให้หัวข้อไปชนขอบล่างของรูปที่กำลังไล่จาง */}
      <div className="flex flex-1 flex-col px-5 pt-5 pb-5 sm:px-6 sm:pt-6 sm:pb-6">
        <h3 className="t-card transition-colors duration-300 group-hover:text-cyan-deep">
          {card.title}
        </h3>
        <p className="mt-2 text-[0.95rem] text-slate">{card.description}</p>
      </div>

      {/* กดที่ไหนของการ์ดก็เปิดดูรูปได้ — ปุ่มโปร่งใสคลุมทั้งใบ
          ใช้ปุ่มซ้อนแทนการครอบ <button> รอบทั้งการ์ด เพราะ <button> ห้ามมี <h3> ข้างใน */}
      {main && (
        <button
          type="button"
          onClick={() => setOpenAt(0)}
          aria-label={
            extras > 0
              ? `ดูรูปของ ${card.title} ทั้งหมด ${images.length} รูป`
              : `ดูรูปของ ${card.title} ขนาดเต็ม`
          }
          className="absolute inset-0 z-10 cursor-zoom-in rounded-2xl"
        />
      )}

      {openAt !== null && (
        <Lightbox
          images={images}
          index={openAt}
          onIndexChange={setOpenAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </article>
  );
}
