import Image from "next/image";
import Reveal from "./Reveal";
import { framework } from "@/lib/content";
import { findImageIn } from "@/lib/images";

/** การ์ด 4 ขั้นของ D-D-D-I — ไอคอนอ่านจาก public/images/icon/<ชื่อขั้น> */
export default function FrameworkCards() {
  return (
    // มือถือ 2 ใบต่อแถว จอใหญ่เรียง 4 ใบในแถวเดียว
    <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {framework.steps.map((step, i) => {
        const icon = findImageIn("icon", step.name);

        return (
          <li key={step.name}>
            <Reveal delay={i * 80} className="h-full">
              <div
                className="h-full rounded-2xl border border-line p-3 shadow-card sm:rounded-3xl sm:p-4"
                style={{
                  background: `linear-gradient(to bottom, #ffffff 42%, ${step.tint} 100%)`,
                }}
              >
                {/* แถบไล่สีพร้อมไอคอนวงกลมคร่อมขอบซ้าย
                    ใช้ min-h แทนความสูงตายตัว และให้ข้อความย่อขนาดตามความกว้างการ์ด
                    ไม่งั้นชื่อขั้นจะล้นออกนอกแถบสีตอนการ์ดแคบ */}
                <div
                  className="relative flex min-h-11 items-center rounded-xl py-1.5 pr-2 pl-12 sm:min-h-13 sm:rounded-2xl sm:pr-3 sm:pl-16"
                  style={{
                    background: `linear-gradient(100deg, ${step.color} 0%, ${step.colorLight} 100%)`,
                  }}
                >
                  <span
                    className="absolute top-1/2 -left-1.5 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_4px_14px_-4px_rgba(1,0,62,0.35)] sm:-left-2 sm:h-14 sm:w-14"
                    style={{ outline: `2px solid ${step.color}` }}
                  >
                    {icon ? (
                      <span className="relative h-6 w-6 sm:h-8 sm:w-8">
                        <Image
                          src={icon}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="32px"
                          className="object-contain"
                        />
                      </span>
                    ) : (
                      <span
                        className="font-display text-lg font-extrabold sm:text-xl"
                        style={{ color: step.color }}
                      >
                        {step.name.charAt(0)}
                      </span>
                    )}
                  </span>

                  {/* flex-1 + text-center ทำให้ชื่อขั้นอยู่กึ่งกลางของพื้นที่ที่เหลือ
                      หลังหักส่วนที่ไอคอนกินไป ระยะซ้าย-ขวาจึงเท่ากันทุกใบ
                      ไม่ว่าชื่อจะสั้นยาวต่างกันแค่ไหน */}
                  <span className="font-display min-w-0 flex-1 text-center text-[0.9rem] leading-tight font-extrabold text-white sm:text-lg lg:text-xl">
                    {step.name}
                  </span>
                </div>

                <p
                  className="font-display mt-3 text-center text-base font-bold sm:mt-4 sm:text-xl"
                  style={{ color: step.color }}
                >
                  {step.tagline}
                </p>

                <p className="mt-2 text-center text-[0.8rem] leading-relaxed text-slate sm:text-[0.9rem]">
                  {step.detail}
                </p>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
