"use client";

import { useEffect, useState } from "react";

/**
 * ปุ่มกลับขึ้นบนสุด — โผล่มาเมื่อเลื่อนพ้นหน้าแรกไปแล้ว
 * หน้านี้ยาวมาก การเลื่อนกลับขึ้นเองจึงเป็นภาระ
 *
 * ใช้ inert ตอนซ่อน แทนการถอดออกจาก DOM เพื่อให้ยังมี transition ตอนหายไป
 * และไม่ให้ปุ่มที่มองไม่เห็นถูก tab ไปโดน
 */
export default function ScrollTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setShown(window.scrollY > window.innerHeight * 1.2);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      inert={!shown}
      aria-label="กลับขึ้นด้านบนสุด"
      title="กลับขึ้นด้านบน"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      className={`to-top fixed right-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white/90 text-lg text-ink shadow-lift backdrop-blur-md hover:border-cyan hover:text-cyan-deep sm:right-6 sm:bottom-6 ${
        shown ? "" : "to-top-hidden"
      }`}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
