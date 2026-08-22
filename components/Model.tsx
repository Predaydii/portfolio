import Image from "next/image";
import Section from "./Section";
import Reveal from "./Reveal";
import FrameworkCards from "./FrameworkCards";
import Collapsible from "./Collapsible";
import TimelineRail from "./TimelineRail";
import { model } from "@/lib/content";
import { findDownload, findImageIn } from "@/lib/images";

export default function Model() {
  // โลโก้แนวยาว อ่านจาก public/images/model/logo.<png|jpg|webp|avif>
  const logo = findImageIn("model", "logo");

  // ปุ่มดาวน์โหลดที่มาแทนปุ่ม "อ่านต่อ" หลังกางเนื้อหาครบแล้ว
  // ไม่มีไฟล์ก็ไม่แสดงปุ่ม ผู้อ่านจึงไม่เจอปุ่มที่กดแล้วได้ 404
  const doc = findDownload(model.document.file);

  if (process.env.NODE_ENV === "development" && !doc) {
    console.warn(
      `[model] ปุ่ม "${model.document.label}" ถูกซ่อนไว้ เพราะยังไม่มีไฟล์ ` +
        `public/images/${model.document.file}.<jpg|png|webp|avif|pdf>`,
    );
  }

  const downloadButton = doc ? (
    <a
      href={doc}
      download=""
      className="btn btn-primary grad-brand hero-magnet btn-attract"
    >
      {model.document.label}
      <span aria-hidden="true">↓</span>
    </a>
  ) : null;

  return (
    // seam: ไล่สีจากขาวของ About ลงมาหา mist ไม่ให้เห็นเป็นเส้นคมพาดขวางจอ
    <Section id="framework" aura="cyan" className="seam seam-from-white bg-mist">
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
        <Collapsible
          collapsed="max-h-[34rem]"
          fade="from-mist via-mist/85"
          expandedAction={downloadButton}
        >
          <ol className="relative mx-auto max-w-[64rem]">
        {/* เส้นแกนของเรื่อง — ถูกวาดลงมาตามระยะที่ผู้อ่านเลื่อนผ่าน */}
        <TimelineRail />

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

              </li>
            ))}
          </ol>
        </Collapsible>
      </div>
    </Section>
  );
}
