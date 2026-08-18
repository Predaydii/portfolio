import BrandIcon from "./BrandIcon";
import Reveal from "./Reveal";
import { footer } from "@/lib/content";

/**
 * Footer ทำหน้าที่เป็นส่วน Contact ไปในตัว
 * id="contact" จึงอยู่ที่นี่ เมนู Contact บน navbar ชี้มาที่ footer โดยตรง
 */
export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-10 overflow-hidden bg-ink text-white/70"
    >
      {/* เส้นฟ้าบาง ๆ บนสุด — ทำให้ขอบขาว→ดำอ่านเป็น "เส้นแบ่งที่ตั้งใจ"
          ไม่ใช่รอยต่อที่ดูเหมือนภาพแตก */}
      <span
        aria-hidden="true"
        className="grad-brand absolute inset-x-0 top-0 h-px"
      />
      {/* แสงจาง ๆ จากมุมบนขวา ให้พื้นดำมีมิติ ไม่แบนตัน */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-[-10%] h-80 w-80 rounded-full bg-cyan/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        {/* คอลัมน์ซ้ายกว้างกว่าเล็กน้อย ชื่อจึงได้พื้นที่หายใจ
            เส้นคั่นแนวตั้งบนจอใหญ่ทำให้สองฝั่งแยกกันชัดโดยไม่ต้องเว้นห่างมาก */}
        <div className="grid gap-12 lg:grid-cols-[1fr_auto_20rem] lg:gap-14">
          {/* ── ตัวตน ── */}
          <div>
            <Reveal>
              <p className="t-eyebrow text-cyan">Portfolio</p>

              <p className="font-display mt-4 text-[clamp(1.9rem,4.2vw,2.75rem)] leading-[1.15] font-extrabold tracking-tight text-white">
                {footer.name}
              </p>

              <p className="font-display mt-3 max-w-[34ch] text-base leading-relaxed font-semibold text-white/75">
                {footer.role}
              </p>

              {/* ความถนัด — ทำเป็นชิปมีกรอบ อ่านง่ายกว่าข้อความคั่นจุด */}
              <ul className="mt-6 flex flex-wrap gap-2">
                {footer.skills.map((skill) => (
                  <li
                    key={skill}
                    className="font-display rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white/70"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* เส้นคั่นแนวตั้ง เฉพาะจอที่กว้างพอให้สองคอลัมน์อยู่ข้างกัน */}
          <span
            aria-hidden="true"
            className="hidden w-px bg-gradient-to-b from-transparent via-white/15 to-transparent lg:block"
          />

          {/* ── ช่องทางติดต่อ ── */}
          <Reveal delay={120}>
            <section aria-labelledby="footer-contact">
              <h2 id="footer-contact" className="t-eyebrow text-cyan">
                {footer.contactHeading}
              </h2>

              {/* อีเมลและเบอร์โทร — ป้ายกำกับตัวเล็กวางบนค่า ทำให้สแกนตาลงมาได้ตรง ๆ
                  กดโทร/ส่งเมลได้ทันทีบนมือถือ */}
              <dl className="mt-5 space-y-4">
                {[
                  {
                    label: "Email",
                    value: footer.email,
                    href: `mailto:${footer.email}`,
                  },
                  {
                    label: "Phone",
                    value: footer.phone,
                    href: `tel:${footer.phone.replace(/-/g, "")}`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
                  >
                    <dt className="font-display text-[0.65rem] tracking-[0.2em] text-white/40 uppercase">
                      {item.label}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={item.href}
                        className="font-display inline-block max-w-full truncate text-[0.95rem] font-semibold text-white transition-colors hover:text-cyan sm:text-base"
                      >
                        {item.value}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>

              {/* ปุ่มลิงก์ไปยังแพลตฟอร์มต่าง ๆ */}
              <ul className="mt-7 flex flex-wrap gap-2.5">
                {footer.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      aria-label={link.label}
                      title={link.label}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="hero-magnet flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/75 hover:border-cyan hover:text-cyan"
                    >
                      <BrandIcon name={link.icon} className="h-[1.15rem] w-[1.15rem]" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        {/* ปุ่มกลับขึ้นบนแบบลอย (ScrollTop) ทำหน้าที่นี้อยู่แล้ว จึงไม่ต้องมีลิงก์ซ้ำ */}
        <div className="mx-auto w-full max-w-[1200px] px-5 py-5 sm:px-8 lg:px-12">
          <p className="text-xs text-white/50">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
