"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  id: string;
  className?: string;
  children: ReactNode;
};

/**
 * ห่อหน้าแรกไว้เพื่อรับตำแหน่งเมาส์ แล้วส่งต่อเป็น CSS variable ให้ชั้นต่าง ๆ ใช้
 *   --tilt-x / --tilt-y องศาที่รูปเอียงตามเมาส์
 *   --shift            ระยะที่ชั้นตกแต่งขยับสวนทางเมาส์ (parallax)
 *
 * ทำงานเฉพาะอุปกรณ์ที่มีเมาส์จริง — จอสัมผัสข้ามไปเลยเพื่อไม่ให้เปลืองพลังงาน
 */
export default function HeroStage({ id, className = "", children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calmMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || calmMotion.matches) return;

    let frame = 0;
    let x = 50;
    let y = 38;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--tilt-y", `${(x - 50) * 0.1}deg`);
      el.style.setProperty("--tilt-x", `${(38 - y) * 0.08}deg`);
      el.style.setProperty("--shift", `${(x - 50) * 0.22}px`);
    };

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x = ((e.clientX - rect.left) / rect.width) * 100;
      y = ((e.clientY - rect.top) / rect.height) * 100;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    // เมาส์ออกนอกจอแล้วค่อย ๆ กลับสู่ตำแหน่งกลาง
    const onLeave = () => {
      x = 50;
      y = 38;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
