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
const CLOSE_MS = 170;

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
    >
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 p-4 sm:p-8">
        <figure className="lb-figure relative min-h-0 w-full flex-1">
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="92vw"
            className="object-contain"
            priority
          />
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
