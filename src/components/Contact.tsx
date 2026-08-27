import { Reveal, SectionHead, StarSparkles } from "./ui";
import { SCHOOL_PHONES, waLink } from "../lib/helpers";

export default function Contact() {
  return (
    <section id="contact" className="beams relative overflow-hidden bg-navy-3" aria-label="Contact and location">
      <StarSparkles count={10} />
      <div className="section-pad relative mx-auto max-w-[1440px] px-5 sm:px-8">
        <SectionHead
          index="07"
          label="Contact"
          title={
            <>
              Come &amp; <em className="italic text-gold">see us.</em>
            </>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
            <Reveal>
              <div className="glass h-full rounded-xl p-6 transition-all duration-400 hover:border-gold/45 hover:bg-navy-2/50">
                <p className="mono-label text-[9.5px] text-gold">Find us</p>
                <p className="mt-3 text-sm leading-relaxed text-cream/75">
                  Top of Ndikutamadda Hill, opposite SOGEA, Namasuba — Makindye-Ssabagabo
                  Municipality, Wakiso District, Uganda.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="glass h-full rounded-xl p-6 transition-all duration-400 hover:border-gold/45 hover:bg-navy-2/50">
                <p className="mono-label text-[9.5px] text-gold">Call us</p>
                <ul className="mt-3 space-y-1.5">
                  {SCHOOL_PHONES.map((p) => (
                    <li key={p.tel}>
                      <a href={`tel:${p.tel}`} className="text-sm text-cream/75 underline-offset-4 transition hover:text-gold hover:underline">
                        {p.value}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="glass h-full rounded-xl p-6 transition-all duration-400 hover:border-gold/45 hover:bg-navy-2/50">
                <p className="mono-label text-[9.5px] text-gold">Write to us</p>
                <a href="mailto:starschoolsnamasuba@gmail.com" className="mt-3 block text-sm text-cream/75 underline-offset-4 transition hover:text-gold hover:underline">
                  starschoolsnamasuba@gmail.com
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="glass h-full rounded-xl p-6 transition-all duration-400 hover:border-gold/45 hover:bg-navy-2/50">
                <p className="mono-label text-[9.5px] text-gold">Follow us</p>
                <a
                  href="https://www.facebook.com/starugadmin/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2.5 text-sm text-cream/75 transition hover:text-gold"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M13.5 21v-7h2.6l.4-3h-3V9.1c0-.9.3-1.5 1.6-1.5h1.5V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.7v7h2.8Z" />
                  </svg>
                  facebook.com/starugadmin
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.22} className="sm:col-span-2">
              <a
                href={waLink("256759443714", "Hello Star Schools Namasuba! We'd like to know more about admission.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold w-full justify-center"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.5-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.3-.4.2-.4.5-1 .1-.2 0-.4 0-.5l-.7-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.2 2.1-.7 3.3.7 1.7 2 3.2 3.6 4.1 2 1.1 3.4 1.3 4.6 1 .7-.2 1.4-.8 1.6-1.5.2-.5.2-1 .1-1.1l-1.1-.6Z" />
                </svg>
                WhatsApp 0759 443 714
              </a>
            </Reveal>
          </div>

          {/* map */}
          <Reveal delay={0.1} y={50} className="lg:col-span-7">
            <div className="relative h-[420px] overflow-hidden rounded-2xl border border-cream/12 shadow-[0_30px_80px_-30px_rgba(9,12,40,0.8)] lg:h-full lg:min-h-[460px]">
              <iframe
                title="Map — Star Primary & Nursery School Namasuba, Wakiso District, Uganda"
                src="https://www.google.com/maps?q=Namasuba,+Makindye-Ssabagabo,+Wakiso,+Uganda&output=embed"
                className="h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <span className="mono-label absolute left-4 top-4 flex items-center gap-2 rounded-full bg-navy-3/85 px-4 py-2 text-[9px] text-gold backdrop-blur">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
                  <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" />
                </svg>
                Namasuba • Wakiso
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
