import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import FrameworkCards from "./FrameworkCards";
import Collapsible from "./Collapsible";
import { model } from "@/lib/content";
import { findImageIn } from "@/lib/images";

export default function Model() {
  // โลโก้แนวยาว อ่านจาก public/images/model/logo.<png|jpg|webp|avif>
  const logo = findImageIn("model", "logo");

  return (
    <Section id="model" className="bg-mist">
      {/* ── โลโก้แนวยาวเปิดหัวเรื่อง ── */}
      <header className="text-center">
        <Reveal>
          <p className="t-eyebrow">{model.eyebrow}</p>
          <h2 className="sr-only">{model.title}</h2>

          {logo ? (
            // ลบระยะขอบของ container ออกด้วย margin ติดลบ โลโก้จึงยาวเต็มความกว้างสุดของหน้า
            <div className="relative mt-6 h-16 sm:-mx-8 sm:h-32 lg:-mx-12 lg:h-44">
              <Image
                src={logo}
                alt={model.title}
                fill
                loading="lazy"
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-contain"
              />
            </div>
          ) : (
            <p className="t-section mt-4" aria-hidden="true">
              {model.title}
            </p>
          )}
        </Reveal>
      </header>

      {/* ── บทต่าง ๆ เรียงลงมาเป็นเรื่องเล่า มีเส้นแกนร้อยไว้ทางซ้าย ──
          ย่อไว้ก่อน ให้ผู้อ่านเลือกเองว่าจะกางอ่านต่อ หรือข้ามไปดูเกียรติบัตร */}
      <div className="mt-16 sm:mt-20">
        <Collapsible collapsed="max-h-[34rem]" fade="from-mist via-mist/85">
          <ol className="relative mx-auto max-w-[64rem]">
        {/* เส้นแกนของเรื่อง */}
        <span
          aria-hidden="true"
          className="grad-rail absolute top-2 bottom-2 left-[15px] w-0.5 rounded-full opacity-40 sm:left-[23px]"
        />

        {model.chapters.map((chapter) => (
          <li key={chapter.no} className="relative pb-14 pl-12 last:pb-0 sm:pl-20">
            {/* เลขบท — ต้องอยู่นอก <Reveal> เพราะ .reveal มี transform
                ซึ่งทำให้มันกลายเป็น containing block ของลูกที่เป็น absolute
                แล้วเลขจะเลื่อนตามระยะ padding ของ <li> จนหลุดจากเส้นแกน */}
            <span
              aria-hidden="true"
              className="font-display absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[0.7rem] font-bold text-white sm:h-12 sm:w-12 sm:text-sm"
            >
              {chapter.no}
            </span>

            <Reveal>
              <h3 className="t-card">{chapter.title}</h3>
            </Reveal>

            {chapter.quote && (
              <Reveal delay={70}>
                <blockquote className="mt-5 border-l-[3px] border-cyan pl-5">
                  <p className="font-display text-xl leading-relaxed font-semibold text-ink sm:text-2xl">
                    “{chapter.quote}”
                  </p>
                </blockquote>
              </Reveal>
            )}

            {chapter.highlight && (
              <Reveal delay={70}>
                <p className="grad-rainbow font-display mt-4 text-[clamp(1.15rem,2.2vw,1.65rem)] leading-[1.45] font-extrabold tracking-tight">
                  {chapter.highlight}
                </p>
              </Reveal>
            )}

            {chapter.body?.map((text, n) => (
              <Reveal key={n} delay={90 + n * 70}>
                <p className="prose-story mt-4 text-slate">{text}</p>
              </Reveal>
            ))}

            {chapter.bullets && (
              <ul className="mt-5 space-y-3">
                {chapter.bullets.map((text, n) => (
                  <li key={n}>
                    <Reveal delay={90 + n * 60}>
                      <div className="flex gap-3 rounded-2xl border border-line bg-white p-4">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-deep"
                        />
                        <p className="text-[0.95rem] leading-relaxed text-slate">
                          {text}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}

            {chapter.steps && <FrameworkCards />}

            {chapter.cta && (
              <Reveal delay={120}>
                <a
                  href={chapter.cta.href}
                  className="btn btn-primary grad-brand mt-6"
                >
                  {chapter.cta.label}
                  <span aria-hidden="true">→</span>
                </a>
              </Reveal>
            )}
              </li>
            ))}
          </ol>
        </Collapsible>
      </div>
    </Section>
  );
}
