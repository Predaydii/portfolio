import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Model from "@/components/Model";
import Certificates from "@/components/Certificates";
import Projects from "@/components/Projects";
import Closing from "@/components/Closing";
import Footer from "@/components/Footer";
import ScrollTop from "@/components/ScrollTop";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1">
        {/* จุดยึดของเมนู Home — ต้องเป็น element ธรรมดาที่ไม่ sticky
            ถ้าใส่ id="home" ไว้ที่ Hero (ซึ่ง sticky ค้างบนจอตลอด) เบราว์เซอร์
            จะเห็นว่ามันอยู่ในตำแหน่งแล้วและไม่ยอมเลื่อนกลับขึ้นบนสุดให้ */}
        <span id="home" aria-hidden="true" className="block" />

        {/* Hero ถูกตรึงด้วย sticky อยู่ชั้นล่างสุด (z-0)
            ส่วนที่เหลือทั้งหมดอยู่ชั้นบน (z-10) และมีพื้นหลังทึบ
            เวลาเลื่อนลง About จึงเลื่อนขึ้นมา "ทับ" Hero แทนที่จะดันมันขึ้นไป */}
        <Hero />
        <div className="relative z-10">
          <About />
          <Model />
          <Certificates />
          <Projects />
          {/* บทส่งท้าย — ไม่มีใน navbar โดยตั้งใจ ให้ผู้อ่านเจอเองตอนเลื่อนมาถึง */}
          <Closing />
        </div>
      </main>
      {/* Footer ทำหน้าที่เป็นส่วน Contact ไปในตัว */}
      <Footer />

      {/* ปุ่มลอยกลับขึ้นบน — หน้ายาวมาก จึงต้องมีทางลัดกลับ */}
      <ScrollTop />
    </>
  );
}
