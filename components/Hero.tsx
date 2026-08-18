import Image from "next/image";
import HeroStage from "./HeroStage";
import BrandIcon from "./BrandIcon";
import { footer, profile } from "@/lib/content";
import { findImage } from "@/lib/images";

/** รูปทรงโครงลวดที่หมุนอยู่หลังรูป — เส้นหนา มุมมน คล้ายกรอบวาดมือ */
const WIRE_PATH =
  "M210 26 L370 130 L392 344 L232 454 L58 372 L28 150 Z";

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
      id="home"
      className="tech-canvas sticky top-0 z-0 flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-14"
    >
      {/* ── ฉากหลังธีมเทคโนโลยี ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* พื้นตารางมุมมองลึกไหลเข้าหาคนดู */}
        <div className="tech-floor absolute inset-x-0 bottom-0 h-[46%]" />

        {/* ไฟสปอตไลต์ตามเมาส์ */}
        <div className="hero-spotlight absolute inset-0" />

        {/* เส้นสแกนกวาดลงมา */}
        <div className="tech-scan absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ink/25 to-transparent" />

        {/* ก้อนแสงลอยช้า ๆ */}
        <div className="anim-drift-a absolute -top-28 -right-24 h-[30rem] w-[30rem] rounded-full bg-cyan/25 blur-3xl" />
        <div className="anim-drift-b absolute -bottom-32 -left-24 h-[26rem] w-[26rem] rounded-full bg-ink/12 blur-3xl" />

        {/* รูปทรงโครงลวดลอยมุมจอ */}
        <svg
          viewBox="0 0 120 120"
          className="anim-wire hero-parallax absolute top-[18%] left-[6%] h-16 w-16 text-ink/15 sm:h-24 sm:w-24"
          style={{ "--wire-time": "52s" } as React.CSSProperties}
          fill="none"
        >
          <polygon
            points="60,8 112,38 112,82 60,112 8,82 8,38"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        <svg
          viewBox="0 0 120 120"
          className="anim-wire anim-wire-reverse hero-parallax absolute right-[8%] bottom-[16%] h-14 w-14 text-cyan-deep/30 sm:h-20 sm:w-20"
          style={{ "--wire-time": "38s" } as React.CSSProperties}
          fill="none"
        >
          <rect
            x="14"
            y="14"
            width="92"
            height="92"
            rx="18"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="relative mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-12">
        <div className="grid items-center gap-9 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          {/* ── ข้อความฝั่งซ้าย ── จอเล็กลงมาอยู่ใต้รูปและจัดกึ่งกลาง */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            {/* แยก anim-rise ไว้ชั้นนอก เพราะทั้งสองคลาสตั้งค่า animation
                ถ้าใส่รวมกัน ตัวที่มาทีหลังใน stylesheet จะทับเอฟเฟกต์ไล่สีทิ้ง */}
            <div className="anim-rise" style={{ animationDelay: "100ms" }}>
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
              className="anim-rise font-display mt-4 text-lg font-bold text-ink sm:text-xl"
              style={{ animationDelay: "620ms" }}
            >
              {profile.fullName}
              <span aria-hidden="true" className="mx-2 text-cyan-deep">
                ·
              </span>
              <span className="font-semibold text-slate">{profile.school}</span>
            </p>

            <div
              className="anim-rise mt-5 max-w-[46ch] max-lg:mx-auto"
              style={{ animationDelay: "700ms" }}
            >
              <p className="font-display text-lg leading-snug font-bold text-ink sm:text-xl">
                {profile.motto}
              </p>
              <p className="mt-2 text-base leading-relaxed text-slate">
                {profile.mottoEn}
              </p>
            </div>

            <nav
              aria-label="ช่องทางติดต่อ"
              className="anim-rise mt-7"
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
            <div className="relative mx-auto w-56 sm:w-72 lg:mr-0 lg:ml-auto lg:w-[24rem]">
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
                      sizes="(min-width: 1024px) 24rem, (min-width: 640px) 18rem, 14rem"
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
