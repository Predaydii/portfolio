"use client";

import { useId, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** ความสูงตอนย่อ (คลาส max-h-* ของ Tailwind) */
  collapsed?: string;
  /** สีของแถบไล่สีที่บังท้ายตอนย่อ ต้องตรงกับพื้นหลังของ section นั้น */
  fade?: string;
  label?: string;
  /**
   * สิ่งที่จะแสดงแทนปุ่ม "อ่านต่อ" หลังกางแล้ว
   * ไม่ส่งมาก็ได้ — ปุ่มจะหายไปเฉย ๆ เหมือนเดิม
   */
  expandedAction?: ReactNode;
};

/**
 * ย่อเนื้อหาไว้ก่อน แล้วให้กดกางอ่านฉบับเต็มได้
 * กางแล้วไม่ย่อกลับ ปุ่มจึงหายไปหลังกด (หรือถูกแทนที่ด้วย expandedAction)
 *
 * ความสูงปลายทางถูกวัดจากเนื้อหาจริงตอนกด ไม่ใช่ค่าคงที่สูง ๆ
 * ถ้าใช้ค่าคงที่ (เช่น max-h 600rem) เส้นโค้ง easing จะถูกใช้ไปกับระยะที่
 * ไม่มีอยู่จริงเกือบทั้งหมด เนื้อหาเลยกระโดดเต็มความสูงในเสี้ยวแรกแล้วนิ่ง
 * ซึ่งเป็นเหตุผลที่มันรู้สึก "กระตุก" แทนที่จะไหล
 */
export default function Collapsible({
  children,
  collapsed = "max-h-[34rem]",
  fade = "from-white via-white/85",
  label = "อ่านต่อ",
  expandedAction,
}: Props) {
  const [open, setOpen] = useState(false);
  // ความสูงเป้าหมายเป็น px ระหว่างที่ยังเล่น transition อยู่
  // พอเล่นจบให้ปลดเป็น none เนื้อหาที่สูงขึ้นทีหลัง (เช่นรูปโหลดเสร็จ) จะได้ไม่ถูกตัด
  const [height, setHeight] = useState<string>();
  const boxRef = useRef<HTMLDivElement>(null);
  const regionId = useId();

  const expand = () => {
    const el = boxRef.current;
    if (el) setHeight(`${el.scrollHeight}px`);
    setOpen(true);
  };

  return (
    <>
      <div
        ref={boxRef}
        id={regionId}
        style={open ? { maxHeight: height } : undefined}
        onTransitionEnd={(e) => {
          if (open && e.propertyName === "max-height") setHeight("none");
        }}
        className={`relative overflow-hidden transition-[max-height] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "" : collapsed
        }`}
      >
        {children}

        {!open && (
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t to-transparent ${fade}`}
          />
        )}
      </div>

      {!open ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={expand}
            aria-expanded={false}
            aria-controls={regionId}
            className="btn btn-primary grad-brand hero-magnet btn-attract"
          >
            {label}
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      ) : (
        expandedAction && (
          <div className="mt-8 flex justify-center">{expandedAction}</div>
        )
      )}
    </>
  );
}
