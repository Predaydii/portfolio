import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import { closing } from "@/lib/content";
import { findImage } from "@/lib/images";

/**
 * ส่วนปิดท้ายก่อนถึง Footer — รูปสี่เหลี่ยมฝั่งซ้าย ข้อความฝั่งขวา
 * ไม่มีใน navbar โดยตั้งใจ เป็นบทส่งท้ายที่ผู้อ่านจะเจอเองตอนเลื่อนมาถึง
 */
export default function Closing() {
  // ใช้ contact ก่อน ถ้าไม่มีค่อยใช้รูปหน้าแรกแทน
  const photo = findImage("contact") ?? findImage("landing");

  return (
    // overflow-x-clip กันของตกแต่งที่ยื่นออกด้านข้างไม่ให้ดันหน้าจนเลื่อนไปทางขวาได้
    // ใช้ clip ไม่ใช่ hidden เพราะ hidden จะทำให้ section กลายเป็น scroll container
    <Section
      id="closing"
      className="seam seam-from-white overflow-x-clip bg-mist"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_1fr] lg:gap-16">
        {/* ── รูปสี่เหลี่ยมจัตุรัสฝั่งซ้าย ── */}
        <Reveal>
          {/* บนมือถือรูปกว้างเกือบเต็มคอนเทนเนอร์ ต้องหุบเข้ามาเปิดที่ให้วงแหวน
              (-7%) กับลายวงจร (-1.5rem) ยื่นออกมาได้ ไม่งั้นมันล้นขอบจอ
              แล้วทำให้ทั้งหน้าเลื่อนไปทางขวาได้ */}
          <div className="px-7 sm:px-0">
            <div className="group relative mx-auto w-full max-w-[26rem] lg:mx-0">
            {/* กรอบเส้นประหมุนช้า ๆ อยู่หลังรูป */}
            <span
              aria-hidden="true"
              className="hero-orbit absolute inset-[-7%] rounded-[2.5rem]"
              style={{ "--orbit-time": "88s" } as React.CSSProperties}
            />

            {/* กรอบทึบเยื้องออกไปด้านหลัง — ขยับเข้าหารูปเมื่อชี้เมาส์ */}
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-cyan/45 transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:translate-y-2"
            />

            {/* แสงฟ้าเต้นอยู่หลังรูป */}
            <span
              aria-hidden="true"
              className="anim-glow absolute inset-[8%] -z-10 rounded-full bg-cyan/30 blur-3xl"
            />

            {/* ลายวงจรเส้นประวิ่ง โผล่พ้นมุมล่างซ้ายของรูป */}
            <svg
              viewBox="0 0 300 200"
              aria-hidden="true"
              className="absolute -bottom-6 -left-6 h-20 w-28 text-cyan-deep/45 sm:h-24 sm:w-36"
              fill="none"
            >
              <path
                className="anim-trace"
                style={{ "--trace-time": "13s" } as React.CSSProperties}
                d="M8 150 H80 L110 120 H190 L220 90 H292"
                stroke="currentColor"
                strokeWidth="3"
              />
              <circle cx="80" cy="150" r="5" fill="currentColor" />
              <circle cx="190" cy="120" r="5" fill="currentColor" />
            </svg>

            {/* ตัวรูป — สี่เหลี่ยมจัตุรัส ยกขึ้นเล็กน้อยตอนชี้เมาส์ */}
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-line bg-white shadow-card transition-[transform,box-shadow] duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-lift">
              {photo ? (
                <Image
                  src={photo}
                  alt={closing.photoAlt}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 26rem, 90vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
              ) : (
                <div
                  className="grad-placeholder flex h-full w-full items-center justify-center"
                  role="img"
                  aria-label={closing.photoAlt}
                >
                  <span className="font-display text-[0.65rem] tracking-[0.22em] text-cyan uppercase">
                    contact photo
                  </span>
                </div>
              )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── ข้อความฝั่งขวา ── */}
        <div className="text-center lg:text-left">
          <Reveal>
            <p className="t-eyebrow">{closing.eyebrow}</p>
            {/* leading กว้างกว่าหัวข้ออังกฤษ เพราะไทยซ้อนสระบน-ล่างได้หลายชั้น */}
            <h2 className="grad-text font-display mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.45] font-extrabold tracking-tight">
              {closing.heading}
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <p className="mx-auto mt-8 max-w-[46ch] text-[1.05rem] leading-[1.95] text-slate lg:mx-0">
              {closing.body}
            </p>
          </Reveal>

          {/* ข้อความทิ้งท้าย — มีเส้นฟ้านำหน้าให้แยกจากเนื้อความด้านบนชัด ๆ */}
          <Reveal delay={380}>
            <div className="mt-9 lg:border-l-[3px] lg:border-cyan lg:pl-6">
              <p className="font-display text-xl leading-snug font-bold text-ink sm:text-2xl">
                {closing.signoff}
              </p>
              <p className="mt-2 text-base text-slate">{closing.signoffSub}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
