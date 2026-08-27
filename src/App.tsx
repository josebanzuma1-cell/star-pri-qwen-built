import { useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reducedMotion } from "./lib/gsap";
import { logClick } from "./services/api";
import { toast } from "./lib/helpers";

import Preloader from "./components/Preloader";
import Toaster from "./components/Toaster";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Programs from "./components/Programs";
import Gallery from "./components/Gallery";
import Admissions from "./components/Admissions";
import Ambassador from "./components/Ambassador";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Admin from "./components/Admin";

export default function App() {
  const reduced = reducedMotion();
  const [ready, setReady] = useState(reduced);
  const [preloaderGone, setPreloaderGone] = useState(reduced);
  const [admin, setAdmin] = useState(() => window.location.hash === "#/admin");

  /* hash route: #/admin → staff console */
  useEffect(() => {
    const onHash = () => setAdmin(window.location.hash === "#/admin");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /* smart-link attribution: /?ref=STAR-XXXXX */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      const code = ref.trim().toUpperCase();
      sessionStorage.setItem("star_ref", code);
      void logClick(code, window.location.pathname + window.location.search);
      toast(`⭐ You were referred by a current Star family — code ${code} is pre-filled below.`);
      window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    }
  }, []);

  /* Lenis smooth scroll wired into GSAP ScrollTrigger */
  useEffect(() => {
    if (reduced || admin) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    (window as unknown as { __lenis: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(tick);
      lenis.destroy();
      (window as unknown as { __lenis?: null }).__lenis = null;
    };
  }, [reduced, admin]);

  return (
    <div className="grain">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:font-bold focus:text-navy"
      >
        Skip to content
      </a>

      {!preloaderGone && (
        <Preloader
          onDone={() => {
            setReady(true);
            window.setTimeout(() => setPreloaderGone(true), 1050);
          }}
        />
      )}
      <Toaster />

      {admin ? (
        <Admin
          onBack={() => {
            window.location.hash = "";
            setAdmin(false);
          }}
        />
      ) : (
        <>
          <Nav />
          <main id="main">
            <Hero ready={ready} />
            <div className="relative z-20 -rotate-[1.1deg] scale-[1.03] shadow-[0_10px_40px_rgba(9,12,40,0.45)]">
              <Marquee />
            </div>
            <About />
            <Programs />
            <Gallery />
            <Admissions />
            <Ambassador />
            <Testimonials />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
