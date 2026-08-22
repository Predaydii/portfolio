/**
 * ฉากหลังจาง ๆ ของ section เนื้อหา — ก้อนแสงลอยช้า ๆ ทับด้วยลายจุด
 *
 * ทั้งหมดเป็นของตกแต่ง จึงเป็น aria-hidden และรับเมาส์ไม่ได้
 * ก้อนแสงขยับด้วย transform อย่างเดียว (ไม่ใช่ background-position และไม่มี
 * filter: blur) เพื่อให้เบราว์เซอร์ยกขึ้น GPU layer ได้ ไม่ต้องวาดพื้นใหม่ทุกเฟรม
 *
 * ต้องวางไว้ใน element ที่ position ไม่ใช่ static และตัดขอบไว้ — Section.tsx
 * จัดการให้แล้วเมื่อส่ง prop `aura`
 */
export default function SectionAura({ tone = "cyan" }: { tone?: "cyan" | "ink" }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <div
        className={`sec-aura absolute inset-[-12%] ${
          tone === "ink" ? "sec-aura-ink" : ""
        }`}
      />
      <div className="sec-dots absolute inset-0" />
    </div>
  );
}
