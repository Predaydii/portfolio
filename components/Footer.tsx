import BrandIcon from "./BrandIcon";
import Reveal from "./Reveal";
import { footer } from "@/lib/content";

/**
 * Footer ทำหน้าที่เป็นส่วน Contact ไปในตัว
 * id="contact" จึงอยู่ที่นี่ เมนู Contact บน navbar ชี้มาที่ footer โดยตรง
 */
export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 bg-ink text-white/70">
      <div className="mx-auto w-full max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* ── ตัวตน ── */}
          <div>
            <Reveal>
              <p className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                {footer.name}
                <span aria-hidden="true" className="ml-1 text-cyan">
                  .
                </span>
              </p>

              <p className="font-display mt-3 text-base font-semibold text-white/80 sm:text-lg">
                {footer.role}
              </p>

              <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                {footer.skills.map((skill, i) => (
                  <li key={skill} className="flex items-center gap-3">
                    {i > 0 && (
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 rounded-full bg-cyan"
                      />
                    )}
                    <span className="font-display text-sm font-semibold tracking-wide text-white/70">
                      {skill}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ── ช่องทางติดต่อ ── */}
          <Reveal delay={120}>
            <section aria-labelledby="footer-contact">
              <h2 id="footer-contact" className="t-eyebrow text-cyan">
                {footer.contactHeading}
              </h2>

              {/* ปุ่มลิงก์ไปยังแพลตฟอร์มต่าง ๆ */}
              <ul className="mt-5 flex flex-wrap gap-3">
                {footer.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      aria-label={link.label}
                      title={link.label}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="hero-magnet flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/75 hover:border-cyan hover:text-cyan"
                    >
                      <BrandIcon name={link.icon} className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>

              {/* อีเมลและเบอร์โทร กดโทร/ส่งเมลได้ทันทีบนมือถือ */}
              <dl className="mt-7 space-y-3">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <dt className="font-display w-16 text-xs tracking-[0.18em] text-white/45 uppercase">
                    Email
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${footer.email}`}
                      className="font-display inline-block py-1.5 text-base font-semibold text-white transition-colors hover:text-cyan sm:text-lg"
                    >
                      {footer.email}
                    </a>
                  </dd>
                </div>

                <div className="flex flex-wrap items-baseline gap-x-3">
                  <dt className="font-display w-16 text-xs tracking-[0.18em] text-white/45 uppercase">
                    Phone
                  </dt>
                  <dd>
                    <a
                      href={`tel:${footer.phone.replace(/-/g, "")}`}
                      className="font-display inline-block py-1.5 text-base font-semibold text-white transition-colors hover:text-cyan sm:text-lg"
                    >
                      {footer.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </section>
          </Reveal>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-[1200px] px-5 py-5 text-xs text-white/60 sm:px-8 lg:px-12">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
