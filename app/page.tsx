import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Model from "@/components/Model";
import Certificates from "@/components/Certificates";
import Projects from "@/components/Projects";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1">
        {/* Hero ถูกตรึงด้วย sticky อยู่ชั้นล่างสุด (z-0)
            ส่วนที่เหลือทั้งหมดอยู่ชั้นบน (z-10) และมีพื้นหลังทึบ
            เวลาเลื่อนลง About จึงเลื่อนขึ้นมา "ทับ" Hero แทนที่จะดันมันขึ้นไป */}
        <Hero />
        <div className="relative z-10">
          <About />
          <Model />
          <Certificates />
          <Projects />
        </div>
      </main>
      {/* Footer ทำหน้าที่เป็นส่วน Contact ไปในตัว */}
      <Footer />
    </>
  );
}
