"use client";

import { useEffect, useState } from "react";

type Stat = { value: number; label: string };

/** ความยาวของการนับเลข (มิลลิวินาที) */
const COUNT_MS = 1400;
/** หน่วงก่อนเริ่มนับ ให้ตัวอักษรหน้าแรกขึ้นก่อน */
const START_DELAY_MS = 420;

/**
 * ตัวเลขสามช่องบนหน้าแรก — วิ่งขึ้นจาก 0 ตอนเปิดเว็บ
 *
 * ค่าเริ่มต้นที่ render จากเซิร์ฟเวอร์คือ "เลขจริง" ไม่ใช่ 0
 * คนที่ปิด JavaScript หรือใช้ screen reader จึงเห็นตัวเลขที่ถูกต้องเสมอ
 * การนับเริ่มที่เฟรมแรกของ animation ต่อเมื่อ JS ทำงานได้จริงเท่านั้น
 */
export default function HeroStats({ stats }: { stats: Stat[] }) {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start - START_DELAY_MS;

      // ระหว่างรอ ให้ค้างที่ 0 — ตั้งค่าในเฟรมของ animation ไม่ใช่ในตัว effect
      if (elapsed < 0) {
        setProgress(0);
        frame = requestAnimationFrame(step);
        return;
      }

      const t = Math.min(1, elapsed / COUNT_MS);
      // ชะลอตอนท้าย เลขจึงไม่ดูเหมือนหยุดกะทันหัน
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);

    // กันเหนียว: ถ้า requestAnimationFrame ไม่ทำงาน (แท็บพื้นหลัง, เบราว์เซอร์
    // throttle, หน้าไม่ได้ถูกวาด) ให้เด้งไปเลขจริงเมื่อครบเวลาที่ควรนับเสร็จ
    // ไม่งั้นผู้ใช้จะค้างเห็นเลข 0 ซึ่งผิดกว่าการไม่มีเอฟเฟกต์เสียอีก
    const safety = window.setTimeout(
      () => setProgress(1),
      START_DELAY_MS + COUNT_MS + 400,
    );

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(safety);
    };
  }, []);

  return (
    <dl
      className="anim-rise mt-4 hidden gap-8 lg:flex"
      style={{ animationDelay: "180ms" }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="border-l-2 border-cyan/60 pl-3.5">
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            {/* tabular-nums กันความกว้างตัวเลขขยับตอนนับ ไม่งั้นบรรทัดจะสั่น */}
            <span className="font-display block text-2xl leading-none font-extrabold text-ink tabular-nums">
              {Math.round(stat.value * progress)}
            </span>
            <span
              aria-hidden="true"
              className="mt-1.5 block max-w-[12ch] text-[0.7rem] leading-tight text-slate"
            >
              {stat.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
