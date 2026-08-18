"use client";

import { useEffect, useRef, useState } from "react";

/**
 * เส้นแกนของเรื่องที่ค่อย ๆ ถูก "วาด" ลงมาตามระยะที่ผู้อ่านเลื่อนผ่าน
 *
 * เส้นจางเป็นราง แล้วมีเส้นสีทึบทับลงมาตามความคืบหน้า ผู้อ่านจึงเห็นว่า
 * ตัวเองอ่านมาถึงไหนของเรื่องแล้ว โดยไม่ต้องมีตัวเลขบอก
 *
 * ความคืบหน้าวัดจาก "จุดกึ่งกลางจอ" เทียบกับกล่องของเรื่องทั้งหมด
 * ไม่ใช่ขอบบนจอ ไม่งั้นเส้นจะเต็มตั้งแต่ยังอ่านไม่จบ
 */
export default function TimelineRail() {
  const ref = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    // กล่องที่ต้องวัดคือ <ol> ซึ่งเป็นพ่อของเส้นนี้
    const track = el?.parentElement;
    if (!el || !track) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const probe = window.innerHeight * 0.5;
      // 0 = จุดกึ่งกลางจอเพิ่งถึงหัวเรื่อง, 1 = ถึงท้ายเรื่องแล้ว
      const ratio = (probe - rect.top) / rect.height;
      setProgress(Math.min(1, Math.max(0, ratio)));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="absolute top-2 bottom-2 left-[15px] w-0.5 rounded-full bg-line sm:left-[23px]"
    >
      {/* เส้นสีที่ยืดลงมาตามความคืบหน้า — ใช้ scaleY จึงไม่ทำให้ layout ถูกคำนวณใหม่
          หัวเส้นมีจุดเรืองแสงบอกตำแหน่งที่กำลังอ่านอยู่ */}
      <span
        className="grad-rail absolute inset-0 origin-top rounded-full transition-transform duration-150 ease-out"
        style={{ transform: `scaleY(${progress})` }}
      />
      <span
        className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_0_4px_rgba(8,218,255,0.25)] transition-[top,opacity] duration-150 ease-out"
        style={{ top: `${progress * 100}%`, opacity: progress > 0.01 ? 1 : 0 }}
      />
    </span>
  );
}
