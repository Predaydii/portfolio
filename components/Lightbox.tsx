"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/content";

type Props = {
  images: GalleryImage[];
  /** ลำดับรูปที่เปิดอยู่ */
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
};

/** ความยาวของ animation ตอนปิด ต้องตรงกับ .lb-closing ใน globals.css */
const CLOSE_MS = 220;

/** ระยะนิ้วขั้นต่ำที่นับว่าเป็นการปัดเปลี่ยนรูป ไม่ใช่การแตะพลาด */
const SWIPE_PX = 45;

const ARROW_BASE =
  "flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-lg text-white transition-colors hover:border-cyan hover:text-cyan";

/**
 * ดูรูปเต็มจอ
 * ใช้ <dialog> + showModal() จึงได้ top layer (ไม่โดน overflow/transform ของ
 * element แม่บัง), focus trap, และปิดด้วย Esc มาให้ในตัว ไม่ต้องเขียนเอง
 * ปิดได้ด้วยการแตะที่ไหนก็ได้ ยกเว้นปุ่มลูกศร
 */
export default function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const [closing, setClosing] = useState(false);

  const current = images[index];
  const many = images.length > 1;

  /* สถานะ "โหลดเสร็จหรือยัง" ของรูปที่กำลังดู ใช้ตัดสินว่าจะโชว์ตัวหมุนไหม
     ผูก event กับ element ตรง ๆ แทนการใช้ prop onLoad เพราะรูปที่อยู่ใน cache
     จะโหลดเสร็จก่อน React ผูก handler ทัน ตัวหมุนจะค้างอยู่ตลอดไป
     จึงต้องเช็ค .complete ตอนเริ่มด้วย ไม่ใช่รอแต่ event */
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    if (el.complete) {
      setLoaded(true);
      return;
    }

    setLoaded(false);
    const done = () => setLoaded(true);
    el.addEventListener("load", done);
    el.addEventListener("error", done);
    return () => {
      el.removeEventListener("load", done);
      el.removeEventListener("error", done);
    };
  }, [index]);

  // รูปก่อนหน้าและถัดไป — วนรอบ และตัดตัวซ้ำออกเผื่อมีอยู่แค่สองรูป
  const neighbours = many
    ? [
        ...new Set([
          images[(index + 1) % images.length]?.src,
          images[(index - 1 + images.length) % images.length]?.src,
        ]),
      ].filter((src): src is string => Boolean(src) && src !== current?.src)
    : [];

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // เล่น animation ปิดให้จบก่อน แล้วค่อยปิด dialog และแจ้งตัวแม่ให้ถอดออกจาก DOM
  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(() => {
      dialogRef.current?.close();
      onCloseRef.current();
    }, CLOSE_MS);
  }, []);

  // ล็อกไม่ให้หน้าเลื่อนตลอดอายุของ lightbox
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();

    // event "cancel" (กด Esc) ของ <dialog> ไม่ bubble React จึงรับผ่าน prop ไม่ได้
    // ต้องผูก listener กับตัว element เอง
    const handleCancel = (e: Event) => {
      e.preventDefault();
      requestClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [requestClose]);

  const step = (delta: number) => {
    if (!many) return;
    onIndexChange((index + delta + images.length) % images.length);
  };

  /** ปุ่มลูกศรต้องไม่ปิดหน้าต่าง จึงกันไม่ให้ click ลอยขึ้นไปถึง <dialog> */
  const arrow = (delta: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    step(delta);
  };

  /* ── ปัดนิ้วเปลี่ยนรูปบนมือถือ ──
     บนจอสัมผัส ปุ่มลูกศรเล็กและอยู่ไกลนิ้ว การปัดเป็นท่าที่คนคาดหวังอยู่แล้ว
     จำตำแหน่งตอนแตะไว้ แล้ววัดระยะตอนปล่อย ถ้าเกิน SWIPE_PX จึงนับเป็นการปัด
     แนวตั้งที่ขยับมากกว่าแนวนอนไม่นับ กันไม่ให้การเลื่อนจอกลายเป็นการเปลี่ยนรูป */
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    const t = e.changedTouches[0];
    touchStart.current = null;
    if (!start || !t || !many) return;

    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) <= Math.abs(dy)) return;

    // ปัดซ้าย = ดูรูปถัดไป (เนื้อหาเลื่อนตามนิ้ว)
    e.stopPropagation();
    step(dx < 0 ? 1 : -1);
  };

  if (!current) return null;

  return (
    <dialog
      ref={dialogRef}
      className={`lightbox ${closing ? "lb-closing" : ""}`}
      aria-label="ดูรูปภาพขนาดเต็ม"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") step(1);
        if (e.key === "ArrowLeft") step(-1);
      }}
      // แตะที่ไหนก็ได้เพื่อปิด (ปุ่มลูกศรกัน event ไว้เอง)
      onClick={requestClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-8">
        {/* ปุ่มปิดที่มองเห็นได้ — แตะพื้นหลังก็ปิดได้เหมือนเดิม แต่ต้องมีปุ่มจริง
            ให้เห็น ไม่งั้นผู้ใช้ครั้งแรกไม่มีทางรู้ว่าออกยังไง */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            requestClose();
          }}
          aria-label="ปิดหน้าต่างรูปภาพ"
          className={`${ARROW_BASE} lb-controls absolute top-2 right-2 z-10 sm:top-4 sm:right-4`}
        >
          <span aria-hidden="true">✕</span>
        </button>

        <figure className="lb-figure relative min-h-0 w-full flex-1">
          {/* วงกลมหมุนใต้รูป — เห็นเฉพาะช่วงที่ไฟล์ยังมาไม่ถึง
              ไม่งั้นผู้ใช้จะเจอจอดำเปล่า ๆ แล้วนึกว่ากดพลาด */}
          {!loaded && (
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-2 border-white/25 border-t-white/80"
            />
          )}

          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            /* ต้นฉบับกว้างราว 1700px การขอ 1920 จึงเป็นการขยายภาพขึ้นเปล่า ๆ
               จำกัดไว้ที่ 1200 ไฟล์เล็กลงมากโดยตายังแยกไม่ออกบนจอทั่วไป */
            sizes="(min-width: 1280px) 1200px, 92vw"
            className="object-contain"
            priority
            ref={imgRef}
          />

          {/* โหลดรูปติดกันไว้ล่วงหน้า กดลูกศรหรือปัดแล้วภาพมาทันที
              ต้องอยู่ในเลย์เอาต์จริง (ไม่ใช่ display:none) ด้วยสองเหตุผล —
              เบราว์เซอร์ไม่ดาวน์โหลดรูปที่ display:none และถ้าไม่มีขนาดให้คำนวณ
              มันจะเลือกไฟล์ใหญ่สุดจาก srcset แทนที่จะเลือกตาม sizes
              จึงซ่อนด้วย opacity แทน แล้วกันไม่ให้รับเมาส์หรือถูกอ่านออกเสียง */}
          {neighbours.map((src) => (
            <Image
              key={src}
              src={src}
              alt=""
              aria-hidden="true"
              fill
              /* eager เพราะเป็นการโหลดล่วงหน้าโดยตั้งใจ
                 ถ้าปล่อยเป็น lazy เบราว์เซอร์จะรอจนกว่าจะ "เห็น" ซึ่งไม่มีวันเกิด
                 เพราะรูปโปร่งใสอยู่ใต้รูปหลักตลอด */
              loading="eager"
              sizes="(min-width: 1280px) 1200px, 92vw"
              className="pointer-events-none object-contain opacity-0"
            />
          ))}
        </figure>

        {many && (
          <>
            {/* จอใหญ่: ลูกศรลอยอยู่สองข้างของรูป */}
            <button
              type="button"
              onClick={arrow(-1)}
              aria-label="รูปก่อนหน้า"
              className={`${ARROW_BASE} absolute top-1/2 left-2 hidden -translate-y-1/2 sm:flex lg:left-6`}
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={arrow(1)}
              aria-label="รูปถัดไป"
              className={`${ARROW_BASE} absolute top-1/2 right-2 hidden -translate-y-1/2 sm:flex lg:right-6`}
            >
              <span aria-hidden="true">→</span>
            </button>

            {/* มือถือ: ลูกศรและตัวนับอยู่ใต้รูป */}
            <div
              className="lb-controls flex shrink-0 items-center gap-5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={arrow(-1)}
                aria-label="รูปก่อนหน้า"
                className={`${ARROW_BASE} sm:hidden`}
              >
                <span aria-hidden="true">←</span>
              </button>

              <p className="font-display min-w-16 text-center text-sm text-white/80">
                {index + 1} / {images.length}
              </p>

              <button
                type="button"
                onClick={arrow(1)}
                aria-label="รูปถัดไป"
                className={`${ARROW_BASE} sm:hidden`}
              >
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
