import { CountUp, Reveal, SmartImg, StarSparkles } from "./ui";

/* Demo figures — edit freely with the school's real numbers. */
const STATS = [
  { value: 480, suffix: "+", label: "Pupils on the hill" },
  { value: 32, suffix: "", label: "Teachers & carers" },
  { value: 14, suffix: "", label: "Classes, Baby → P7" },
  { value: 91, suffix: "%", label: "PLE Div 1 & 2 (demo)" },
];

const FACTS = [
  { title: "Our motto", body: "“Education is Light” — the idea that carries everything we do on this hill." },
  { title: "Where we are", body: "Top of Ndikutamadda Hill, opposite SOGEA, Namasuba — Makindye-Ssabagabo Municipality, Wakiso District, in the heart of the Buganda region." },
  { title: "Levels", body: "Nursery: Baby, Middle & Top Class. Primary 1–7 with dedicated PLE preparation." },
  { title: "Admissions", body: "Registration is open now. Tours any school day — interviews are carried out immediately." },
];

export default function About() {
  return (
    <section id="about" className="beams relative overflow-hidden bg-navy" aria-label="About the school">
      <StarSparkles count={10} />
      <span className="text-outline pointer-events-none absolute right-0 top-10 select-none font-display text-[15vw] font-extrabold leading-none opacity-40" aria-hidden="true">
        01
      </span>

      <div className="section-pad relative mx-auto grid max-w-[1440px] grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-12">
        {/* sticky left column */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <div className="flex items-center gap-4">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="#FFC93C" />
                </svg>
                <span className="eyebrow text-gold">01 / About</span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-xl mt-6 text-cream">
                A school with a <em className="italic text-gold">light on a hill.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.14}>
              <p className="font-display mt-6 text-2xl italic text-cream/80">“Education is Light”</p>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <div className="relative h-72 overflow-hidden rounded-2xl">
                <div className="kenburns h-full">
                  <SmartImg
                    src="images/learning.jpg"
                    alt="A teacher guiding Star Primary pupils at their desks in a bright classroom"
                    width={640}
                    height={480}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mono-label absolute bottom-3 left-3 rounded-full bg-navy/80 px-3 py-1.5 text-[9px] text-cream backdrop-blur">
                  Guided, not rushed
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* scrolling right column */}
        <div className="space-y-12 lg:col-span-7">
          <Reveal>
            <p className="max-w-2xl text-lg leading-relaxed text-cream/80 sm:text-xl">
              Star Primary &amp; Nursery School Namasuba sits where the air is clearest — at the
              <strong className="text-cream"> top of Ndikutamadda Hill, opposite SOGEA</strong> — in the
              semi-urban, fast-growing neighbourhood of Namasuba, Makindye-Ssabagabo Municipality,
              Wakiso District.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="max-w-2xl leading-relaxed text-cream/65">
              We are a family school in the Buganda region: children walk up the hill from Namasuba,
              Buziga and the Makindye side each morning, and by assembly time the compound is loud
              with song. From Baby Class to Primary 7, classes stay small enough for every teacher
              to know every child — and every parent to know every teacher.
            </p>
          </Reveal>

          {/* fact cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FACTS.map((f, i) => (
              <Reveal key={f.title} delay={0.05 + i * 0.06}>
                <div className="glass group h-full rounded-xl p-6 transition-all duration-400 hover:border-gold/45 hover:bg-navy-2/50">
                  <p className="mono-label flex items-center gap-2 text-[10px] text-gold">
                    <span className="inline-block h-px w-5 bg-gold transition-all duration-300 group-hover:w-8" />
                    {f.title}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-cream/70">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* counters */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-2xl border border-gold/15 bg-navy-2 p-8 sm:p-10">
              <svg viewBox="0 0 24 24" className="absolute -right-8 -top-8 h-40 w-40 text-gold/8" aria-hidden="true">
                <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
              </svg>
              <p className="mono-label text-[9.5px] text-cream/45">The hill in numbers — demo figures, edit in code</p>
              <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <p className="font-display text-4xl font-extrabold text-gold sm:text-5xl">
                      <CountUp to={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mono-label mt-2 text-[9px] leading-relaxed text-cream/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
