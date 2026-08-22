import Image from "next/image";
import type { GalleryImage } from "@/lib/content";

type Props = {
  images: GalleryImage[];
  /** วินาทีต่อรอบ — เลขมากคือวิ่งช้า */
  duration: number;
  /** คลาสความสูงของเกียรติบัตร ความกว้างคำนวณจากสัดส่วน A4 แนวนอนให้เอง */
  heightClass: string;
  label: string;
  /**
   * ลำดับเริ่มต้นของแถวนี้ในรายการรวมทุกแถว
   * ใช้บวกกับลำดับในแถว เพื่อบอกตัวแม่ว่าเป็นรูปที่เท่าไหร่ของทั้งหมด
   * ผู้ใช้จึงกดดูรูปเดียวแล้วเลื่อนดูได้ครบทุกแถว ไม่ติดอยู่แค่แถวที่กด
   */
  offset: number;
  onOpen: (indexInAll: number) => void;
};

/** สัดส่วนกระดาษ A4 แนวนอน (297 × 210 มม.) */
const A4_LANDSCAPE = "aspect-[297/210]";

/** จำนวนกล่องเปล่าที่แสดงตอนยังไม่มีไฟล์รูป */
const PLACEHOLDER_COUNT = 6;

export default function CertificateRow({
  images,
  duration,
  heightClass,
  label,
  offset,
  onOpen,
}: Props) {
  if (images.length === 0) {
    return (
      <div className="marquee" aria-hidden="true">
        <ul
          className="marquee-track"
          style={{ animationDuration: `${duration}s` }}
        >
          {Array.from({ length: PLACEHOLDER_COUNT * 2 }, (_, i) => (
            <li key={i} className="me-4 shrink-0 sm:me-5">
              <div
                className={`grad-placeholder flex items-center justify-center rounded-xl ${heightClass} ${A4_LANDSCAPE}`}
              >
                <span className="font-display text-[0.65rem] tracking-[0.22em] text-cyan uppercase">
                  certificate
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // วางซ้ำสองชุดเพื่อให้เลื่อนวนได้ต่อเนื่อง ชุดที่สองซ่อนจาก screen reader
  const loop = [...images, ...images];

  return (
    <div className="marquee">
        <ul
          className="marquee-track"
          style={{ animationDuration: `${duration}s` }}
          aria-label={label}
        >
          {loop.map((image, i) => {
            const index = i % images.length;
            const isClone = i >= images.length;
            return (
              <li
                key={i}
                className="me-4 shrink-0 sm:me-5"
                aria-hidden={isClone ? "true" : undefined}
              >
                <button
                  type="button"
                  onClick={() => onOpen(offset + index)}
                  tabIndex={isClone ? -1 : undefined}
                  aria-label={`ดูเกียรติบัตรขนาดเต็ม: ${image.alt}`}
                  className={`cert-card group/cert relative block cursor-zoom-in overflow-hidden rounded-xl border border-line bg-white shadow-card ${heightClass} ${A4_LANDSCAPE}`}
                >
                  <Image
                    src={image.src}
                    alt={isClone ? "" : image.alt}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 300px, 240px"
                    className="object-cover transition-transform duration-700 ease-out group-hover/cert:scale-[1.07]"
                  />

                  {/* ไอคอนขยายโผล่ตอนชี้ — บอกว่ากดแล้วดูเต็มจอได้
                      ไม่ใช้ backdrop-blur เพราะมี 34 ใบในแถวที่วิ่งตลอดเวลา
                      GPU มือถือแบกไม่ไหว และจอสัมผัสไม่มี hover ให้ใช้อยู่แล้ว */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center bg-ink/45 opacity-0 transition-opacity duration-300 group-hover/cert:opacity-100 group-focus-visible/cert:opacity-100"
                  >
                    <span className="flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-white/95 text-base text-ink shadow-lift transition-transform duration-300 group-hover/cert:scale-100 group-focus-visible/cert:scale-100">
                      ⤢
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
    </div>
  );
}
