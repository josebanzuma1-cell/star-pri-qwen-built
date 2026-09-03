import { SCHOOL_PHONES } from "../lib/helpers";
import Logo from "./Logo";

const QUICK_LINKS = [
  { id: "about", label: "About the school" },
  { id: "programs", label: "Programs" },
  { id: "gallery", label: "Gallery" },
  { id: "admissions", label: "Admissions" },
  { id: "ambassador", label: "Parent Ambassadors" },
  { id: "register", label: "Register your child" },
  { id: "contact", label: "Contact & map" },
];

export default function Footer() {
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(`#${id}`, { offset: -64 });
    else el.scrollIntoView({ behavior: "auto" });
  };

  return (
    <footer className="relative overflow-hidden bg-navy-3 border-t border-cream/8" aria-label="Footer">
      {/* giant outline wordmark marquee */}
      <div className="marquee marquee-slow border-b border-cream/6 py-5" aria-hidden="true">
        <div className="marquee-track items-center">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center">
              {["Star School", "Education is Light", "Star School", "Namasuba"].map((w, i) => (
                <span key={i} className="flex items-center">
                  <span
                    className="font-display whitespace-nowrap px-8 text-[8vw] font-extrabold leading-none"
                    style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,201,60,0.22)" }}
                  >
                    {w}
                  </span>
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold/40" aria-hidden="true">
                    <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 py-16 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <a href="#top" onClick={go("top")} className="flex items-center gap-3" aria-label="Back to top">
            <Logo className="h-16 w-16 shrink-0" title="" />
            <span className="leading-none">
              <span className="font-display block text-lg font-bold leading-tight text-cream">
                Star <span className="italic text-gold">Nursery &amp; Primary</span> School
              </span>
              <span className="mono-label mt-1 block text-[9px] text-cream/50">Namasuba • Wakiso</span>
            </span>
          </a>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-cream/60">
            Star Primary &amp; Nursery School Namasuba — a family school at the top of
            Ndikutamadda Hill, opposite SOGEA. Nursery through Primary 7, with PLE excellence and
            a light that follows every child home.
          </p>
          <p className="font-display mt-6 text-xl italic text-gold/90">“Education is Light”</p>
        </div>

        <nav className="md:col-span-3" aria-label="Footer">
          <p className="mono-label text-[10px] text-gold">Explore</p>
          <ul className="mt-5 space-y-3">
            {QUICK_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={go(l.id)} className="group inline-flex items-center gap-2 text-sm text-cream/65 transition-colors hover:text-gold">
                  <span className="h-px w-3 bg-gold/40 transition-all duration-300 group-hover:w-5 group-hover:bg-gold" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="mono-label text-[10px] text-gold">Talk to us</p>
          <ul className="mt-5 space-y-2.5">
            {SCHOOL_PHONES.map((p) => (
              <li key={p.tel}>
                <a href={`tel:${p.tel}`} className="text-sm text-cream/65 transition-colors hover:text-gold">
                  {p.value} <span className="mono-label text-[8.5px] text-cream/35">— {p.label}</span>
                </a>
              </li>
            ))}
            <li>
              <a href="mailto:starschoolsnamasuba@gmail.com" className="text-sm text-cream/65 transition-colors hover:text-gold">
                starschoolsnamasuba@gmail.com
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/starugadmin/" target="_blank" rel="noopener noreferrer" className="text-sm text-cream/65 transition-colors hover:text-gold">
                facebook.com/starugadmin
              </a>
            </li>
          </ul>
          <a href="#/admin" className="mono-label mt-7 inline-flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2.5 text-[9.5px] text-cream/60 transition hover:border-gold hover:text-gold">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Staff login
          </a>
        </div>
      </div>

      <div className="border-t border-cream/8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-5 py-6 sm:flex-row sm:px-8">
          <p className="mono-label text-[9px] text-cream/40">
            © {new Date().getFullYear()} Star Primary &amp; Nursery School Namasuba • Wakiso District, Uganda
          </p>
          <p className="mono-label flex items-center gap-2 text-[9px] text-cream/40">
            <svg viewBox="0 0 24 24" className="h-3 w-3 text-gold" aria-hidden="true">
              <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
            </svg>
            Built with light in Namasuba
          </p>
        </div>
      </div>
    </footer>
  );
}
