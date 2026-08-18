"use client";

import { useCallback, useEffect, useState } from "react";
import { navItems, site } from "@/lib/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(navItems[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  // ── สถานะ scroll: พื้นหลัง navbar, section ที่กำลังอ่าน, แถบความคืบหน้า ──
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);

      const scrollable = document.body.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, Math.max(0, y / scrollable)) : 0);

      // จุดอ้างอิงอยู่ใต้ navbar ลงมาเล็กน้อย
      const probe = y + window.innerHeight * 0.35;
      let current = navItems[0]?.id ?? "";

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + y;
        if (top <= probe) current = item.id;
      }

      // ถ้าเลื่อนถึงท้ายหน้าแล้ว ให้ไฮไลต์เมนูสุดท้ายเสมอ
      if (y + window.innerHeight >= document.body.scrollHeight - 8) {
        current = navItems[navItems.length - 1]?.id ?? current;
      }

      setActive(current);
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

  // ── เมนูมือถือ: ปิดด้วย Esc และล็อกไม่ให้หน้าเลื่อนตอนเปิด ──
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled || open
            ? "border-b border-line bg-white/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="เมนูหลัก"
          className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 sm:h-20 sm:px-8 lg:px-12"
        >
          <a
            href="#home"
            onClick={close}
            className="font-display py-3 text-base font-bold tracking-tight text-ink sm:text-lg"
          >
            {site.wordmark}
            <span className="text-cyan-deep">.</span>
          </a>

          {/* เมนู desktop */}
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block px-4 py-2 font-display text-sm font-semibold transition-colors ${
                      isActive ? "text-ink" : "text-slate hover:text-ink"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`grad-rail absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          {/* ปุ่มแฮมเบอร์เกอร์ (เฉพาะมือถือ) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/70 md:hidden"
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-ink transition-transform duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute top-1/2 left-0 block h-0.5 w-5 -translate-y-1/2 rounded-full bg-ink transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-ink transition-transform duration-300 ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </nav>

        {/* แถบความคืบหน้าการอ่าน */}
        <span
          aria-hidden="true"
          className="grad-rail absolute inset-x-0 bottom-0 h-0.5 origin-left"
          style={{ transform: `scaleX(${progress})` }}
        />
      </header>

      {/* ── เมนูมือถือ ──
          เป็นแผงแบบ dropdown สูงเท่าเนื้อหา ไม่บังทั้งหน้าจอ
          ต้องอยู่ "นอก" <header> เพราะ backdrop-filter บน header ทำให้ header
          กลายเป็น containing block ของลูกที่เป็น position:fixed
          ใช้ inert แทนการถอดออกจาก DOM เพื่อให้มี animation ทั้งตอนเปิดและปิด */}
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-30 bg-ink/25 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-x-4 top-[4.25rem] z-40 origin-top overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-lift transition-[opacity,transform] duration-300 ease-out md:hidden ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <ul className="divide-y divide-line">
          {navItems.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={close}
                className={`flex items-baseline gap-3 rounded-xl px-4 py-3.5 font-display text-lg font-bold transition-colors ${
                  active === item.id ? "text-ink" : "text-slate"
                }`}
              >
                <span className="t-eyebrow text-[0.65rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
