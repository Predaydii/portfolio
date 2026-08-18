"use client";

import { useId, useState, type ReactNode } from "react";

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

/** ค่าสูงพอจะครอบเนื้อหาทั้งหมด ต้องเป็นตัวเลขไม่ใช่ none เพื่อให้ transition ทำงาน */
const EXPANDED = "max-h-[600rem]";

/**
 * ย่อเนื้อหาไว้ก่อน แล้วให้กดกางอ่านฉบับเต็มได้
 * กางแล้วไม่ย่อกลับ ปุ่มจึงหายไปหลังกด (หรือถูกแทนที่ด้วย expandedAction)
 */
export default function Collapsible({
  children,
  collapsed = "max-h-[34rem]",
  fade = "from-white via-white/85",
  label = "อ่านต่อ",
  expandedAction,
}: Props) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <>
      <div
        id={regionId}
        className={`relative overflow-hidden transition-[max-height] duration-700 ease-out ${
          open ? EXPANDED : collapsed
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
            onClick={() => setOpen(true)}
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
