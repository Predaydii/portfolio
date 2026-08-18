import type { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
  className?: string;
  /**
   * คลาสระยะห่างแนวตั้ง — ส่งมาเพื่อ "แทนที่" ค่าเริ่มต้น ไม่ใช่ต่อท้าย
   * เพราะถ้าใส่ py-12 ต่อท้าย py-20 ใน className ตัวที่ชนะคือตัวที่มาทีหลัง
   * ใน stylesheet ของ Tailwind ไม่ใช่ตัวที่มาทีหลังใน attribute
   */
  padding?: string;
};

/**
 * โครง <section> มาตรฐาน — คุมระยะห่างและความกว้าง container ให้เหมือนกันทั้งเว็บ
 * ระยะเผื่อ navbar ตอนกดลิงก์จัดการที่ scroll-padding-top ของ html ใน globals.css
 */
export default function Section({
  id,
  children,
  className = "",
  padding = "py-20 sm:py-28 lg:py-36",
}: Props) {
  return (
    <section id={id} className={`${padding} ${className}`}>
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
        {children}
      </div>
    </section>
  );
}
