import { useEffect, useRef, useState } from "react";

const MOTTO = "EDUCATION IS LIGHT";
const GLYPHS = "★✶✦ETLGHCISODN0147";

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [text, setText] = useState("");
  const [lifting, setLifting] = useState(false);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setLifting(true);
      onDoneRef.current();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setText(MOTTO);
      const t = window.setTimeout(finish, 350);
      return () => window.clearTimeout(t);
    }

    /* Drive the decode from the wall clock, not from a frame counter. A
       background tab throttles setInterval to roughly 1Hz, and counting ticks
       meant the intro could take a minute or never finish — leaving the whole
       site stranded behind the curtain. Elapsed time always advances.       */
    const DECODE_MS = 1850;
    const t0 = performance.now();

    const interval = window.setInterval(() => {
      const progress = (performance.now() - t0) / DECODE_MS;
      const resolved = Math.floor(progress * MOTTO.length);
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
        setText(MOTTO);
        window.setTimeout(finish, 420);
      }
    }, 42);

    /* Belt and braces: nothing gates the site for more than this, whatever
       the browser does to our timers. */
    const failsafe = window.setTimeout(finish, DECODE_MS + 1600);

    /* An intro nobody can see is not worth waiting for. */
    const onVisibility = () => {
      if (document.hidden) finish();
    };
    document.addEventListener("visibilitychange", onVisibility);
    if (document.hidden) finish();

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(failsafe);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      className={`preloader ${lifting ? "lift" : ""}`}
    >
      <p className="sr-only" role="status">
        Loading Star Primary &amp; Nursery School Namasuba
      </p>
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
        aria-hidden="true"
      >
        {text || "\u00A0"}
      </p>
      <p className="mono-label text-[10px] text-cream/40" aria-hidden="true">Star Schools · Namasuba</p>
    </div>
  );
}
