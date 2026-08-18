import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

// ฟอนต์เนื้อความ — รองรับทั้งไทยและอังกฤษในตัวเดียว
// เป็นฟอนต์ static จึงต้องระบุน้ำหนัก โหลดเฉพาะ 4 น้ำหนักที่เว็บนี้ใช้จริง
const body = IBM_Plex_Sans_Thai({
  variable: "--font-body",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// ฟอนต์หัวข้อ — ใช้กับตัวอังกฤษ ตัวไทยจะตกไปใช้ IBM Plex Sans Thai อัตโนมัติ
// ต้องมีตัวเอียงด้วย เพราะบรรทัดบนของหน้าแรกใช้ตัวเอียงเป็นจุดเด่น
const head = Plus_Jakarta_Sans({
  variable: "--font-head",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  // canonical บอก Google ว่าโดเมนไหนคือตัวจริง กันไม่ให้ dday.design
  // ถูกนับเป็นเนื้อหาซ้ำ และกันอันดับกระจายไปสองโดเมน
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: site.title,
    title: site.title,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${body.variable} ${head.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* ถ้าปิด JavaScript ให้เนื้อหาที่รอ scroll-reveal แสดงผลทันที */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          ข้ามไปยังเนื้อหาหลัก
        </a>

        {children}
      </body>
    </html>
  );
}
