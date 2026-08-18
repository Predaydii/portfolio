"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** หน่วงเวลาก่อนเริ่ม animation (มิลลิวินาที) — ใช้ทำ stagger */
  delay?: number;
  className?: string;
};

/**
 * ห่อเนื้อหาให้ค่อย ๆ ปรากฏตอนเลื่อนเข้ามาในจอ
 * สั่งงานครั้งเดียวแล้ว unobserve — ไม่ทำงานซ้ำตอน scroll ขึ้น
 * ถ้าผู้ใช้ตั้ง prefers-reduced-motion ไว้ CSS ใน globals.css จะยกเลิกเอฟเฟกต์ให้เอง
 */
export default function Reveal({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
