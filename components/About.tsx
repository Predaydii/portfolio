import Section from "./Section";
import Reveal from "./Reveal";
import Collapsible from "./Collapsible";
import { purpose } from "@/lib/content";

export default function About() {
  return (
    // ขอบบนมนและเงาด้านบน ทำให้เห็นชัดว่าส่วนนี้กำลังเลื่อนขึ้นมาทับ Landing
    <Section
      id="about"
      className="rounded-t-[2rem] bg-white shadow-[0_-24px_60px_-30px_rgba(1,0,62,0.45)] sm:rounded-t-[2.5rem]"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,15rem)_1fr] lg:gap-20">
        {/* คอลัมน์ซ้าย: ป้ายกำกับที่ค้างอยู่ระหว่างเลื่อนอ่าน */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <p className="t-eyebrow">{purpose.eyebrow}</p>
            <span className="grad-rail mt-4 block h-16 w-0.5 rounded-full max-lg:hidden" />
          </Reveal>
        </div>

        {/* คอลัมน์ขวา: เนื้อความ — ย่อไว้ก่อน กดกางอ่านฉบับเต็มได้ */}
        <div>
          <Reveal>
            <h2 className="t-section max-w-[22ch]">{purpose.heading}</h2>
          </Reveal>

          <Collapsible collapsed="max-h-[30rem]" fade="from-white via-white/85">
            <div className="prose-story mt-8 space-y-6">
              {purpose.paragraphs.map((text, i) => (
                <Reveal key={i} delay={i * 60}>
                  <p
                    className={
                      i === 0
                        ? "text-lg leading-[1.85] text-ink sm:text-xl"
                        : "text-slate"
                    }
                  >
                    {text}
                  </p>
                </Reveal>
              ))}
            </div>
          </Collapsible>
        </div>
      </div>
    </Section>
  );
}
