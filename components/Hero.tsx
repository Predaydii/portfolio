import Image from "next/image";
import HeroStage from "./HeroStage";
import BrandIcon from "./BrandIcon";
import { footer, profile } from "@/lib/content";
import { findImage } from "@/lib/images";

/** รูปทรงโครงลวดที่หมุนอยู่หลังรูป — เส้นหนา มุมมน คล้ายกรอบวาดมือ */
const WIRE_PATH =
  "M210 26 L370 130 L392 344 L232 454 L58 372 L28 150 Z";

/** จุดดาวกะพริบกระจายทั่วฉากหลัง — ตำแหน่งคงที่ ไม่สุ่ม เพื่อไม่ให้ SSR/CSR ต่างกัน */
const STARS = [
  { top: "14%", left: "12%", size: 5, time: "3.6s", delay: "0s" },
  { top: "28%", left: "31%", size: 3, time: "4.8s", delay: "0.7s" },
  { top: "9%", left: "58%", size: 4, time: "4.2s", delay: "1.4s" },
  { top: "22%", left: "88%", size: 3, time: "5.4s", delay: "0.3s" },
  { top: "46%", left: "5%", size: 4, time: "4.4s", delay: "1.1s" },
  { top: "62%", left: "24%", size: 3, time: "5.1s", delay: "2s" },
  { top: "74%", left: "68%", size: 5, time: "3.9s", delay: "0.9s" },
  { top: "84%", left: "42%", size: 3, time: "4.7s", delay: "1.7s" },
  { top: "58%", left: "94%", size: 4, time: "5.6s", delay: "0.5s" },
  { top: "38%", left: "76%", size: 3, time: "4.1s", delay: "2.3s" },
];


export default function Hero() {
  // อ่านจาก public/images/landing.<jpg|png|webp|avif> — ไม่มีไฟล์ก็ขึ้น placeholder
  const photo = findImage("landing");

  // คำใหญ่แยกเป็นคำ ๆ เพื่อให้ตัดขึ้นบรรทัดใหม่ได้เอง (ภายในคำห้ามตัด)
  // แล้วย่อขนาดตาม "คำที่ยาวที่สุด" ตัวอักษรจึงยังใหญ่เต็มที่แม้ headline จะยาว
  const headlineWords = profile.headline.split(/\s+/).filter(Boolean);
  const longestWord = Math.max(...headlineWords.map((w) => w.length), 1);
  const megaScale = Math.min(1, 10 / longestWord);

  return (
    /* sticky ตรึง Landing ไว้ แล้วปล่อยให้ Statement of Purpose เลื่อนขึ้นมาทับตอน scroll
       HeroStage เป็น client component ที่คอยส่งตำแหน่งเมาส์ให้ชั้นต่าง ๆ ใช้ */
    <HeroStage
      id="hero"
      /* max-h คู่กับ min-h: Hero เป็น sticky จึงต้องไม่สูงเกิน 1 หน้าจอเด็ดขาด
         ไม่งั้นเนื้อหาส่วนล่างจะถูก About เลื่อนขึ้นมาทับจนไม่มีวันเห็น */
      className="tech-canvas sticky top-0 z-0 flex h-[100svh] max-h-[100svh] flex-col justify-center overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20"
    >
      {/* ── ฉากหลังธีมเทคโนโลยี ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* ชั้นแสงหลากเฉดที่ลอยไปมา — กินพื้นที่เกินขอบไว้ให้ transform มีที่ขยับ
            โดยไม่เผยขอบว่างที่มุมจอ */}
        <div className="tech-aura absolute inset-[-10%]" />

        {/* พื้นตารางมุมมองลึกไหลเข้าหาคนดู */}
        <div className="tech-floor absolute inset-x-0 bottom-0 h-[46%]" />

        {/* ไฟสปอตไลต์ตามเมาส์ */}
        <div className="hero-spotlight absolute inset-0" />

        {/* เส้นสแกนกวาดลงมา */}
        <div className="tech-scan absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/25 to-transparent" />

        {/* ก้อนแสงลอยช้า ๆ */}
        <div className="anim-drift-a absolute -top-28 -right-24 h-[30rem] w-[30rem] rounded-full bg-cyan/25 blur-3xl" />
        <div className="anim-drift-b absolute -bottom-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-ink/12 blur-3xl" />

        {/* แถบแสงเฉียงกวาดผ่านทั้งฉาก */}
        <div className="hero-beam anim-aurora absolute -inset-x-1/4 top-[22%] h-64 -rotate-6" />

        {/* จุดดาวกะพริบกระจายทั่วฉาก */}
        {STARS.map((star, i) => (
          <span
            key={i}
            className="anim-twinkle hero-parallax absolute rounded-full bg-cyan-deep"
            style={
              {
                top: star.top,
                left: star.left,
                height: star.size,
                width: star.size,
                "--twinkle-time": star.time,
                "--twinkle-delay": star.delay,
              } as React.CSSProperties
            }
          />
        ))}

        {/* ลายวงจรเส้นประวิ่ง — แสดงทุกขนาดจอ รวมมือถือ */}
        <svg
          viewBox="0 0 300 200"
          className="absolute bottom-[10%] left-[3%] h-24 w-36 text-cyan-deep/40 sm:h-32 sm:w-48"
          fill="none"
        >
          <path
            className="anim-trace"
            style={{ "--trace-time": "14s" } as React.CSSProperties}
            d="M8 150 H80 L110 120 H190 L220 90 H292"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            className="anim-trace"
            style={{ "--trace-time": "18s" } as React.CSSProperties}
            d="M8 96 H60 L92 64 H176"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="80" cy="150" r="4" fill="currentColor" />
          <circle cx="190" cy="120" r="4" fill="currentColor" />
          <circle cx="60" cy="96" r="4" fill="currentColor" />
        </svg>

        {/* ลายวงจรอีกชุดฝั่งขวาบน — ให้ฉากสมดุลหลังเอารูปทรงเรขาคณิตออก */}
        <svg
          viewBox="0 0 300 200"
          className="absolute top-[16%] right-[3%] h-24 w-36 rotate-180 text-cyan-deep/30 sm:h-32 sm:w-48"
          fill="none"
        >
          <path
            className="anim-trace"
            style={{ "--trace-time": "16s" } as React.CSSProperties}
            d="M8 150 H74 L104 120 H184 L214 92 H292"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="74" cy="150" r="4" fill="currentColor" />
          <circle cx="184" cy="120" r="4" fill="currentColor" />
        </svg>

      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* ── ข้อความฝั่งซ้าย ── จอเล็กลงมาอยู่ใต้รูปและจัดกึ่งกลาง
              z-20 ยกทั้งคอลัมน์ขึ้นชั้นหน้า "I'm Day" จึงทับรูปได้เวลาล้นไปทางขวา */}
          <div className="relative z-20 order-2 text-center lg:order-1 lg:text-left">
            {/* แยก anim-rise ไว้ชั้นนอก เพราะทั้งสองคลาสตั้งค่า animation
                ถ้าใส่รวมกัน ตัวที่มาทีหลังใน stylesheet จะทับเอฟเฟกต์ไล่สีทิ้ง
                จอใหญ่ปล่อยให้ล้นออกไปทางขวาได้ (w-max) ตัวอักษรจึงพาดทับรูป */}
            <div
              className="anim-rise lg:w-max"
              style={{ animationDelay: "100ms" }}
            >
              <p className="hero-lead">
                {profile.greeting} {profile.name}
              </p>
            </div>

            <h1
              className="hero-mega mt-2"
              style={{ "--mega-scale": megaScale } as React.CSSProperties}
            >
              {headlineWords.map((word, wordIndex) => {
                // นับตัวอักษรสะสมจากคำก่อนหน้า เพื่อให้จังหวะ stagger ต่อเนื่องทั้งประโยค
                const before = headlineWords
                  .slice(0, wordIndex)
                  .reduce((sum, w) => sum + w.length, 0);

                return (
                  <span
                    key={wordIndex}
                    className="inline-block whitespace-nowrap"
                  >
                    {[...word].map((letter, i) => (
                      <span
                        key={i}
                        className="anim-letter"
                        style={{
                          animationDelay: `${260 + (before + i) * 45}ms`,
                        }}
                      >
                        {letter}
                      </span>
                    ))}{" "}
                  </span>
                );
              })}
            </h1>

            <p
              className="anim-rise font-display mt-3 text-base font-bold text-ink sm:text-lg lg:text-xl"
              style={{ animationDelay: "620ms" }}
            >
              {profile.fullName}
              <span aria-hidden="true" className="mx-2 text-cyan-deep">
                ·
              </span>
              <span className="font-semibold text-slate">{profile.school}</span>
            </p>

            <div
              className="anim-rise mt-4 max-w-[46ch] max-lg:mx-auto"
              style={{ animationDelay: "700ms" }}
            >
              <p className="font-display text-base leading-snug font-bold text-ink sm:text-lg lg:text-xl">
                {profile.motto}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate sm:text-base">
                {profile.mottoEn}
              </p>
            </div>

            <nav
              aria-label="ช่องทางติดต่อ"
              className="anim-rise mt-5"
              style={{ animationDelay: "780ms" }}
            >
              <ul className="flex items-center justify-center gap-2.5 lg:justify-start">
                {footer.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      aria-label={link.label}
                      title={link.label}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="hero-magnet flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/70 text-slate backdrop-blur-sm hover:border-cyan hover:text-cyan-deep"
                    >
                      <BrandIcon name={link.icon} className="h-[1.15rem] w-[1.15rem]" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ── รูปฝั่งขวา พร้อมโครงลวดหมุนอยู่ด้านหลัง ── */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto w-44 sm:w-60 lg:mr-0 lg:ml-auto lg:w-[21rem]">
              {/* วงแหวนประหมุนสวนทางกัน — ให้รูปรู้สึกเป็นศูนย์กลางของฉาก */}
              <span
                aria-hidden="true"
                className="hero-orbit absolute inset-[-16%]"
                style={{ "--orbit-time": "78s" } as React.CSSProperties}
              />
              <span
                aria-hidden="true"
                className="hero-orbit hero-orbit-reverse absolute inset-[-28%]"
                style={{ "--orbit-time": "96s" } as React.CSSProperties}
              />

              {/* โครงลวดสองชั้นหมุนสวนทางกัน */}
              <svg
                viewBox="0 0 420 480"
                aria-hidden="true"
                className="anim-wire absolute inset-[-11%] h-[122%] w-[122%] text-ink/70"
                style={{ "--wire-time": "46s" } as React.CSSProperties}
                fill="none"
              >
                <path
                  d={WIRE_PATH}
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                viewBox="0 0 420 480"
                aria-hidden="true"
                className="anim-wire anim-wire-reverse absolute inset-[-15%] h-[130%] w-[130%] text-cyan-deep/60"
                style={{ "--wire-time": "62s" } as React.CSSProperties}
                fill="none"
              >
                <path
                  d={WIRE_PATH}
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>

              <div className="anim-clip-up hero-tilt relative">
                <div className="anim-float relative aspect-4/5 w-full">
                  <span
                    aria-hidden="true"
                    className="anim-glow absolute inset-x-[10%] top-[16%] bottom-[6%] -z-10 rounded-full bg-cyan/28 blur-3xl"
                  />

                  {photo ? (
                    <Image
                      src={photo}
                      alt={profile.photoAlt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 21rem, (min-width: 640px) 15rem, 11rem"
                      className="object-contain"
                    />
                  ) : (
                    <div
                      className="grad-placeholder flex h-full w-full flex-col items-center justify-center gap-2 rounded-[2rem] text-white"
                      role="img"
                      aria-label={profile.photoAlt}
                    >
                      <span className="font-display text-6xl font-bold tracking-tight">
                        {profile.initials}
                      </span>
                      <span className="text-xs tracking-[0.2em] text-cyan uppercase">
                        your photo here
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </HeroStage>
  );
}
