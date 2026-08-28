import { useEffect, useState } from "react";

const LINKS = [
  { id: "about", label: "About", index: "01" },
  { id: "programs", label: "Programs", index: "02" },
  { id: "gallery", label: "Gallery", index: "03" },
  { id: "admissions", label: "Admissions", index: "04" },
  { id: "ambassador", label: "Ambassadors", index: "05" },
  { id: "testimonials", label: "Voices", index: "06" },
  { id: "contact", label: "Contact", index: "07" },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(`#${id}`, { offset: -64, duration: 1.3 });
  else el.scrollIntoView({ behavior: "auto", block: "start" });
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 30);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, y / max) : 0);
        let current = "";
        for (const l of LINKS) {
          const el = document.getElementById(l.id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = l.id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (lenis) (open ? lenis.stop() : lenis.start());
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToId(id), open ? 250 : 0);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[300] transition-all duration-500 ${
          scrolled ? "border-b border-gold/10 bg-navy-3/80 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="absolute left-0 top-0 h-[2.5px] w-full bg-transparent" aria-hidden="true">
          <div
            className="h-full bg-gradient-to-r from-gold to-amber transition-[width] duration-150 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <nav className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-4 sm:px-8" aria-label="Primary">
          <a href="#top" onClick={go("top")} className="group flex items-center gap-3" aria-label="Star Primary & Nursery School Namasuba — back to top">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-gold transition-transform duration-500 group-hover:rotate-[144deg]" aria-hidden="true">
              <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
            </svg>
            <span className="leading-none">
              <span className="font-display block text-[15px] font-bold tracking-wide text-cream">
                Star <span className="italic text-gold">Schools</span>
              </span>
              <span className="mono-label mt-1 block text-[8.5px] text-cream/55">Namasuba • Wakiso</span>
            </span>
          </a>

          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  className={`nav-link text-cream/80 ${active === l.id ? "text-gold" : ""}`}
                  aria-current={active === l.id ? "true" : undefined}
                >
                  <span className="mr-1 text-gold/70">{l.index}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a href="#ambassador" onClick={go("ambassador")} className="btn btn-gold hidden !px-5 !py-2.5 text-[10px] sm:inline-flex">
              Join as Ambassador
            </a>
            <button
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 flex-col items-center justify-center gap-[6px] rounded-full border border-cream/25 transition hover:border-gold lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <span className="h-[2px] w-5 bg-cream" />
              <span className="h-[2px] w-3.5 bg-gold" style={{ marginRight: "6px" }} />
              <span className="h-[2px] w-5 bg-cream" />
            </button>
          </div>
        </nav>
      </header>

      {/* full-screen mobile menu */}
      <div
        className={`fixed inset-0 z-[320] flex flex-col bg-navy-3 transition-all duration-500 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <div className="beams-soft absolute inset-0" aria-hidden="true" />
        <div className="relative flex items-center justify-between px-5 py-4 sm:px-8">
          <span className="eyebrow text-gold">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 transition hover:border-gold hover:text-gold"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <ul className="relative flex flex-1 flex-col justify-center gap-1 px-8">
          {LINKS.map((l, i) => (
            <li
              key={l.id}
              className="overflow-hidden"
              style={{
                transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1), opacity 0.6s",
                transitionDelay: open ? `${0.08 + i * 0.06}s` : "0s",
                transform: open ? "translateY(0)" : "translateY(110%)",
                opacity: open ? 1 : 0,
              }}
            >
              <a href={`#${l.id}`} onClick={go(l.id)} className="group flex items-baseline gap-4 py-2.5" tabIndex={open ? 0 : -1}>
                <span className="mono-label text-[10px] text-gold/70">{l.index}</span>
                <span className="font-display text-4xl font-bold text-cream transition group-hover:italic group-hover:text-gold sm:text-5xl">
                  {l.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="relative px-8 pb-10" style={{ transition: "opacity 0.5s 0.4s", opacity: open ? 1 : 0 }}>
          <a href="#ambassador" onClick={go("ambassador")} className="btn btn-gold w-full justify-center">
            Join as Ambassador ★
          </a>
          <p className="mono-label mt-6 text-center text-[10px] text-cream/40">Education is Light • 0759 443 714</p>
        </div>
      </div>
    </>
  );
}
