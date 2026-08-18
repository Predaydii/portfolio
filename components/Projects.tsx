import Section from "./Section";
import Reveal from "./Reveal";
import ProjectCard from "./ProjectCard";
import { project } from "@/lib/content";
import { findAllNumbered, findProjectImages } from "@/lib/images";

export default function Projects() {
  // เตือนตอน dev ถ้ามีรูปหลักมากกว่าจำนวนการ์ด รูปส่วนเกินจะไม่ถูกนำไปแสดง
  if (process.env.NODE_ENV === "development") {
    const extra = findAllNumbered("project").length - project.cards.length;
    if (extra > 0) {
      console.warn(
        `[project] public/images/project/ มีรูปหลักเกินมา ${extra} รูป ` +
          `แต่มีการ์ดแค่ ${project.cards.length} ใบ รูปที่เกินจะไม่ถูกนำไปแสดง ` +
          "— เพิ่มการ์ดใน project.cards ของ lib/content.ts หรือลบไฟล์ที่เกินออก",
      );
    }
  }

  return (
    // seam: ไล่สีจาก mist ของ Certificates ลงมาหาขาว
    <Section id="project" className="seam seam-from-mist bg-white">
      <header className="mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="t-eyebrow">{project.eyebrow}</p>
          <h2 className="t-section mt-4">{project.heading}</h2>
          <p className="mx-auto mt-5 max-w-[52ch] text-slate">{project.intro}</p>
        </Reveal>
      </header>

      {/* 9 การ์ด = 3 คอลัมน์ 3 แถวพอดีบนจอใหญ่ ไม่มีช่องโหว่ท้ายแถว */}
      <ul className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {project.cards.map((card, i) => {
          // การ์ดใบที่ i ใช้รูป project/<i+1>.jpg และภาพรอง <i+1>-1.jpg, <i+1>-2.jpg ...
          const images = findProjectImages(i + 1).map((src, n) => ({
            src,
            alt: n === 0 ? card.title : `${card.title} — รูปที่ ${n + 1}`,
          }));

          return (
            <li key={card.title}>
              <Reveal delay={Math.min(i, 3) * 70} className="h-full">
                <ProjectCard card={card} images={images} />
              </Reveal>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
