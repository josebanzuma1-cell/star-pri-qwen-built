import { useEffect, useRef, useState } from "react";

const MOTTO = "EDUCATION IS LIGHT";
const GLYPHS = "★✶✦ETLGHCISODN0147";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState("");
  const [lifting, setLifting] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setText(MOTTO);
      const t = setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onDone();
        }
      }, 350);
      return () => clearTimeout(t);
    }

    let frame = 0;
    const interval = window.setInterval(() => {
      frame += 1;
      const resolved = Math.floor(frame / 2.4);
      setText(
        MOTTO.split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < resolved) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      if (resolved >= MOTTO.length) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setLifting(true);
          if (!doneRef.current) {
            doneRef.current = true;
            onDone();
          }
        }, 420);
      }
    }, 42);

    return () => window.clearInterval(interval);
  }, [onDone]);

  return (
    <div
      className={`preloader ${lifting ? "lift" : ""}`}
      role="status"
      aria-label="Loading Star Primary & Nursery School Namasuba"
    >
      <svg viewBox="0 0 100 100" className="h-20 w-20 drop-shadow-[0_0_18px_rgba(255,201,60,0.5)]" aria-hidden="true">
        <path
          d="M50 6 L61.2 38.4 L95.4 38.4 L67.8 58.6 L78.4 91 L50 70.8 L21.6 91 L32.2 58.6 L4.6 38.4 L38.8 38.4 Z"
          fill="none"
          stroke="#FFC93C"
          strokeWidth="2.5"
          strokeLinejoin="round"
          pathLength={1}
          className="star-draw"
        />
      </svg>
      <p
        className="mono-label text-xs text-gold sm:text-sm"
        style={{ minHeight: "1.5em", letterSpacing: "0.42em" }}
      >
        {text || "\u00A0"}
      </p>
      <p className="mono-label text-[10px] text-cream/40">Star Schools · Namasuba</p>
    </div>
  );
}
