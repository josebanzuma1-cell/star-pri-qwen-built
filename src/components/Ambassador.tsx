import { useCallback, useEffect, useState, type FormEvent } from "react";
import QRCode from "qrcode";
import { createAmbassador, createLead, getStats } from "../services/api";
import {
  CLASS_OPTIONS,
  burst,
  copyText,
  smartLink,
  toast,
  waLink,
  waShareMessage,
} from "../lib/helpers";
import { Magnetic, Reveal, StarSparkles, Tilt } from "./ui";

type Ambassador = {
  id: string;
  code: string;
  name: string;
  phone: string;
  child: string;
  klass: string;
};

const PHONE_RE = /^(\+?256|0)7\d{8}$/;

const METHODS = [
  { letter: "A", title: "Special code", copy: "New parents type it in at registration — e.g. STAR-7K2M9." },
  { letter: "B", title: "Smart link", copy: "One tap opens our form with your code already filled in." },
  { letter: "C", title: "QR + WhatsApp", copy: "Auto-generated QR poster and one-tap WhatsApp share." },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        const ok = await copyText(text);
        if (ok) {
          setCopied(true);
          toast("Copied to clipboard ✓");
          window.setTimeout(() => setCopied(false), 1800);
        } else toast("Could not copy — please copy manually");
      }}
      className="mono-label inline-flex items-center gap-2 rounded-full border border-gold/35 px-4 py-2 text-[9.5px] text-gold transition-all duration-300 hover:bg-gold hover:text-navy"
      aria-label={label}
    >
      {copied ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6">
          <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ---------------- ambassador signup / dashboard ---------------- */
export function AmbassadorPanel({ idPrefix = "" }: { idPrefix?: string }) {
  /* A second copy of this panel renders inside the join modal. Ids must be
     unique per instance or labels and aria-describedby point at the wrong
     instance's fields. */
  const fid = (n: string) => idPrefix + n;
  const [amb, setAmb] = useState<Ambassador | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", child: "", klass: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stats, setStats] = useState({ opens: 0, registrations: 0, enrollments: 0 });
  const [qr, setQr] = useState("");

  useEffect(() => {
    const hydrate = () => {
      try {
        const id = sessionStorage.getItem("star:ambassador:id");
        if (!id) return setAmb(null);
        const raw = localStorage.getItem("star:ambassadors");
        const all = raw ? JSON.parse(raw) : [];
        const found = all.find((a: Ambassador) => a.id === id);
        if (found) setAmb(found);
      } catch {
        /* ignore */
      }
    };
    hydrate();
    /* The modal renders a second copy of this panel; keep both in step. */
    window.addEventListener("star:data-changed", hydrate);
    return () => window.removeEventListener("star:data-changed", hydrate);
  }, []);

  const refreshStats = useCallback(async (code: string) => {
    setStats(await getStats(code));
  }, []);

  useEffect(() => {
    if (!amb) return;
    refreshStats(amb.code);
    QRCode.toDataURL(smartLink(amb.code), {
      width: 480,
      margin: 2,
      color: { dark: "#171E48", light: "#EFECFA" },
    }).then(setQr).catch(() => setQr(""));
    const onChange = () => refreshStats(amb.code);
    window.addEventListener("star:data-changed", onChange);
    return () => window.removeEventListener("star:data-changed", onChange);
  }, [amb, refreshStats]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your full name.";
    if (!PHONE_RE.test(form.phone.replace(/\s/g, ""))) errs.phone = "Enter a valid WhatsApp number, e.g. 0759 443 714.";
    if (form.child.trim().length < 2) errs.child = "Please enter your child's name.";
    if (!form.klass) errs.klass = "Choose your child's class.";
    if (!form.consent) errs.consent = "We need your consent to create your code.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    const res = await createAmbassador({ ...form, phone: form.phone.replace(/\s/g, "") });
    setBusy(false);
    sessionStorage.setItem("star:ambassador:id", res.id);
    setAmb(res);
    window.dispatchEvent(new Event("star:data-changed"));
    burst(0.3, 0.4);
    toast(res.existing ? `Welcome back! Your code is ${res.code}` : `⭐ Your ambassador code is ready: ${res.code}`);
  };

  const shareMsg = amb ? waShareMessage(smartLink(amb.code)) : "";

  return (
    <Tilt className="glass relative overflow-hidden rounded-2xl p-7 shadow-[0_30px_80px_-30px_rgba(9,12,40,0.8)] sm:p-9">
      <div className="beams-soft absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <span className="eyebrow text-gold">{amb ? "Your dashboard" : "Become an ambassador"}</span>
          {amb && (
            <button
              onClick={() => {
                sessionStorage.removeItem("star:ambassador:id");
                setAmb(null);
                window.dispatchEvent(new Event("star:data-changed"));
                toast("Signed out — demo only, your code stays saved on this device.");
              }}
              className="mono-label rounded-full border border-cream/20 px-3 py-1.5 text-[9px] text-cream/60 transition hover:border-gold hover:text-gold"
            >
              Switch parent (demo)
            </button>
          )}
        </div>

        {!amb ? (
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <p className="text-sm leading-relaxed text-cream/70">
              Verified Star parents earn a <strong className="text-gold">tuition credit</strong> for
              every family they bring to the hill. Three ways to share — all set up in a minute.
            </p>
            <div>
              <label htmlFor={fid("amb-name")} className="mono-label mb-1.5 block text-[9.5px] text-cream/70">Your full name</label>
              <input id={fid("amb-name")} className={`field field-dark ${errors.name ? "field-error" : ""}`} placeholder="e.g. Amina Nansubuga" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!errors.name} aria-describedby={errors.name ? fid("amb-name-err") : undefined} />
              {errors.name && <p id={fid("amb-name-err")} className="mt-1.5 text-xs text-[#ff9d9d]">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor={fid("amb-phone")} className="mono-label mb-1.5 block text-[9.5px] text-cream/70">WhatsApp number</label>
              <input id={fid("amb-phone")} type="tel" className={`field field-dark ${errors.phone ? "field-error" : ""}`} placeholder="07XX XXX XXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? fid("amb-phone-err") : undefined} />
              {errors.phone && <p id={fid("amb-phone-err")} className="mt-1.5 text-xs text-[#ff9d9d]">{errors.phone}</p>}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={fid("amb-child")} className="mono-label mb-1.5 block text-[9.5px] text-cream/70">Child's name</label>
                <input id={fid("amb-child")} className={`field field-dark ${errors.child ? "field-error" : ""}`} placeholder="e.g. Kirabo" value={form.child} onChange={(e) => setForm({ ...form, child: e.target.value })} aria-invalid={!!errors.child} aria-describedby={errors.child ? fid("amb-child-err") : undefined} />
                {errors.child && <p id={fid("amb-child-err")} className="mt-1.5 text-xs text-[#ff9d9d]">{errors.child}</p>}
              </div>
              <div>
                <label htmlFor={fid("amb-klass")} className="mono-label mb-1.5 block text-[9.5px] text-cream/70">Class</label>
                <select id={fid("amb-klass")} className={`field field-dark ${errors.klass ? "field-error" : ""}`} value={form.klass} onChange={(e) => setForm({ ...form, klass: e.target.value })} aria-invalid={!!errors.klass} aria-describedby={errors.klass ? fid("amb-klass-err") : undefined}>
                  <option value="" disabled>Select class…</option>
                  {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.klass && <p id={fid("amb-klass-err")} className="mt-1.5 text-xs text-[#ff9d9d]">{errors.klass}</p>}
              </div>
            </div>
            <div>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-cream/75">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-[#FFC93C]" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} aria-describedby={errors.consent ? fid("amb-consent-err") : undefined} />
                <span>I'm a current Star parent and I agree to the referral terms below.</span>
              </label>
              {errors.consent && <p id={fid("amb-consent-err")} className="mt-1.5 text-xs text-[#ff9d9d]">{errors.consent}</p>}
            </div>
            <Magnetic className="w-full">
              <button type="submit" disabled={busy} className="btn btn-gold w-full justify-center disabled:opacity-60">
                {busy ? "Creating your code…" : "Generate my referral code ★"}
              </button>
            </Magnetic>
          </form>
        ) : (
          <div className="pop-in mt-6">
            <p className="font-display text-2xl font-bold text-cream">
              Webale, <em className="italic text-gold">{amb.name.split(" ")[0]}!</em>
            </p>
            <p className="mt-1.5 text-sm text-cream/65">
              {amb.child} • {amb.klass} — your light is ready to travel.
            </p>

            <div className="mt-6 rounded-xl border border-gold/30 bg-navy-3/60 p-5">
              <p className="mono-label text-[9px] text-cream/55">A — Your special code</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <span className="font-grotesk text-3xl font-bold tracking-[0.14em] text-gold sm:text-4xl" style={{ fontFamily: "var(--font-grotesk)" }}>
                  {amb.code}
                </span>
                <CopyButton text={amb.code} label={`Copy referral code ${amb.code}`} />
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-cream/12 bg-navy-3/40 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="mono-label text-[9px] text-cream/55">B — Code-free smart link</p>
                <CopyButton text={smartLink(amb.code)} label="Copy smart link" />
              </div>
              <p className="mt-2 break-all font-mono text-[11px] leading-relaxed text-cream/60">{smartLink(amb.code)}</p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
              <div className="rounded-xl border border-cream/12 bg-cream p-3">
                {qr ? (
                  <img src={qr} alt={`QR code opening the Star Schools registration form with code ${amb.code}`} width={132} height={132} className="h-[132px] w-[132px]" />
                ) : (
                  <div className="flex h-[132px] w-[132px] items-center justify-center text-xs text-navy/50">QR…</div>
                )}
              </div>
              <div className="flex flex-col justify-between gap-3 rounded-xl border border-cream/12 bg-navy-3/40 p-5">
                <div>
                  <p className="mono-label text-[9px] text-cream/55">C — One-tap share</p>
                  <p className="mt-2 text-sm leading-relaxed text-cream/70">
                    Send your link on WhatsApp with a ready message, or print the QR for the school noticeboard.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <a href={waLink(null, shareMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-gold !px-4 !py-2.5 text-[9.5px]" aria-label="Share your referral link on WhatsApp">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.5-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.3-.4.2-.4.5-1 .1-.2 0-.4 0-.5l-.7-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.2 2.1-.7 3.3.7 1.7 2 3.2 3.6 4.1 2 1.1 3.4 1.3 4.6 1 .7-.2 1.4-.8 1.6-1.5.2-.5.2-1 .1-1.1l-1.1-.6Z" />
                    </svg>
                    WhatsApp
                  </a>
                  <button
                    onClick={async () => {
                      const nav = navigator as Navigator & { share?: (d: object) => Promise<void> };
                      if (nav.share) {
                        try {
                          await nav.share({ title: "Star Schools Namasuba", text: "Join our family at Star Primary & Nursery School Namasuba ⭐", url: smartLink(amb.code) });
                          return;
                        } catch {
                          /* cancelled — fall through to copy */
                        }
                      }
                      (await copyText(smartLink(amb.code))) && toast("Link copied — share it anywhere ✓");
                    }}
                    className="btn btn-ghost !px-4 !py-2.5 text-[9.5px]"
                    aria-label="Share referral link"
                  >
                    Share link
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { v: stats.opens, label: "Link opens" },
                { v: stats.registrations, label: "Registrations" },
                { v: stats.enrollments, label: "Enrolments" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-cream/12 bg-navy-3/40 p-4 text-center transition-colors hover:border-gold/35">
                  <p className="font-display text-3xl font-extrabold text-gold">{s.v}</p>
                  <p className="mono-label mt-1.5 text-[8.5px] text-cream/60">{s.label}</p>
                </div>
              ))}
            </div>

            <p className="mt-5 text-[11px] leading-relaxed text-cream/40">
              New families only • Tuition credit issued after enrolment &amp; confirmed fees payment •
              Credit, not cash • The school may amend the programme terms.
            </p>
          </div>
        )}
      </div>
    </Tilt>
  );
}

/* ---------------- registration form (referred parents) ---------------- */
export function RegisterPanel({ refCode, idPrefix = "" }: { refCode: string; idPrefix?: string }) {
  const fid = (n: string) => idPrefix + n;
  const [form, setForm] = useState({ parent: "", phone: "", child: "", klass: "", code: refCode, consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | { duplicate: boolean; unknownCode: boolean }>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.parent.trim().length < 2) errs.parent = "Please enter your name.";
    if (!PHONE_RE.test(form.phone.replace(/\s/g, ""))) errs.phone = "Enter a valid WhatsApp number, e.g. 0757 543 772.";
    if (form.child.trim().length < 2) errs.child = "Please enter your child's name.";
    if (!form.klass) errs.klass = "Choose the class your child is joining.";
    if (!form.consent) errs.consent = "Please tick so we may contact you.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    const res = await createLead({ ...form, phone: form.phone.replace(/\s/g, "") });
    setBusy(false);
    setDone({ duplicate: !!res.duplicate, unknownCode: !!res.unknownCode });
    window.dispatchEvent(new Event("star:data-changed"));
    if (res.duplicate) toast("This number is already registered — our team will call you.", "plain");
    else if (res.unknownCode)
      toast("Registered ⭐ — but we did not recognise that referral code, so no credit was applied.", "plain");
    else toast("Registration received! Expect our call for an immediate interview ⭐", "green");
  };

  const reset = () => {
    setDone(null);
    setForm({ parent: "", phone: "", child: "", klass: "", code: refCode, consent: false });
  };

  return (
    <div id={fid("register")} className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-cream/14 bg-cream p-7 text-ink shadow-[0_30px_80px_-30px_rgba(9,12,40,0.8)] sm:p-9">
      <svg viewBox="0 0 24 24" className="absolute -right-8 -top-8 h-32 w-32 text-navy/6" aria-hidden="true">
        <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
      </svg>
      <span className="eyebrow text-navy/60">New family? Register here</span>
      <h3 className="h-lg mt-3 text-navy">
        Begin your child's <em className="italic text-amber">light.</em>
      </h3>

      {form.code && !done && (
        <p className="mono-label mt-4 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-[9.5px] text-gold">
          <svg viewBox="0 0 24 24" className="h-3 w-3" aria-hidden="true">
            <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
          </svg>
          Referred by {form.code} — credit applies after enrolment
        </p>
      )}

      {!done ? (
        <form onSubmit={submit} className="relative mt-6 space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={fid("reg-parent")} className="mono-label mb-1.5 block text-[9.5px] text-navy/60">Parent's name</label>
              <input id={fid("reg-parent")} className={`field ${errors.parent ? "field-error" : ""}`} placeholder="e.g. Joseph Mugisha" value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} aria-invalid={!!errors.parent} aria-describedby={errors.parent ? fid("reg-parent-err") : undefined} />
              {errors.parent && <p id={fid("reg-parent-err")} className="mt-1.5 text-xs text-[#b33232]">{errors.parent}</p>}
            </div>
            <div>
              <label htmlFor={fid("reg-phone")} className="mono-label mb-1.5 block text-[9.5px] text-navy/60">WhatsApp number</label>
              <input id={fid("reg-phone")} type="tel" className={`field ${errors.phone ? "field-error" : ""}`} placeholder="07XX XXX XXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? fid("reg-phone-err") : undefined} />
              {errors.phone && <p id={fid("reg-phone-err")} className="mt-1.5 text-xs text-[#b33232]">{errors.phone}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={fid("reg-child")} className="mono-label mb-1.5 block text-[9.5px] text-navy/60">Child's name</label>
              <input id={fid("reg-child")} className={`field ${errors.child ? "field-error" : ""}`} placeholder="e.g. Amani" value={form.child} onChange={(e) => setForm({ ...form, child: e.target.value })} aria-invalid={!!errors.child} aria-describedby={errors.child ? fid("reg-child-err") : undefined} />
              {errors.child && <p id={fid("reg-child-err")} className="mt-1.5 text-xs text-[#b33232]">{errors.child}</p>}
            </div>
            <div>
              <label htmlFor={fid("reg-klass")} className="mono-label mb-1.5 block text-[9.5px] text-navy/60">Joining class</label>
              <select id={fid("reg-klass")} className={`field ${errors.klass ? "field-error" : ""}`} value={form.klass} onChange={(e) => setForm({ ...form, klass: e.target.value })} aria-invalid={!!errors.klass} aria-describedby={errors.klass ? fid("reg-klass-err") : undefined}>
                <option value="" disabled>Select class…</option>
                {CLASS_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.klass && <p id={fid("reg-klass-err")} className="mt-1.5 text-xs text-[#b33232]">{errors.klass}</p>}
            </div>
          </div>
          <div>
            <label htmlFor={fid("reg-code")} className="mono-label mb-1.5 block text-[9.5px] text-navy/60">
              Referral code <span className="normal-case tracking-normal">(optional — auto-filled from a family link)</span>
            </label>
            <input id={fid("reg-code")} className="field uppercase tracking-[0.18em]" style={{ fontFamily: "var(--font-grotesk)" }} placeholder="STAR-XXXXX" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-ink/75">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[#171E48]" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} aria-describedby={errors.consent ? fid("reg-consent-err") : undefined} />
              <span>Star Schools may contact me on WhatsApp/call about admission &amp; the interview.</span>
            </label>
            {errors.consent && <p id={fid("reg-consent-err")} className="mt-1.5 text-xs text-[#b33232]">{errors.consent}</p>}
          </div>
          <Magnetic className="w-full">
            <button type="submit" disabled={busy} className="btn w-full justify-center bg-navy text-gold transition hover:bg-navy-2 disabled:opacity-60" style={{ boxShadow: "0 12px 34px -12px rgba(23,30,72,0.6)" }}>
              {busy ? "Sending…" : "Register & book my interview ★"}
            </button>
          </Magnetic>
          <p className="text-center text-[11px] text-ink/45">
            Interviews are carried out immediately • 0759 443 714
          </p>
        </form>
      ) : (
        <div className="pop-in relative mt-8 text-center">
          <svg viewBox="0 0 52 52" className="mx-auto h-20 w-20" aria-hidden="true">
            <circle cx="26" cy="26" r="24" fill="none" stroke="#8F85D9" strokeWidth="2.5" opacity="0.35" />
            <circle cx="26" cy="26" r="24" fill="none" stroke="#8F85D9" strokeWidth="2.5" pathLength={1} className="star-draw" />
            <path d="M15 27l8 8 14-16" fill="none" stroke="#171E48" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="check-draw" />
          </svg>
          <p className="font-display mt-5 text-2xl font-bold text-navy">
            {done.duplicate ? "You're already on our list!" : "Webale! Registration received."}
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink/65">
            {done.duplicate
              ? "This number registered before — our admissions team will call you to arrange the tour and immediate interview."
              : "Our admissions team will call you on WhatsApp shortly to arrange your tour — remember, interviews happen immediately."}
          </p>
          {done.unknownCode && (
            <p className="mx-auto mt-4 max-w-sm rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 text-xs leading-relaxed text-ink/70">
              We could not match that referral code to a Star family, so no tuition credit was
              attached. Your registration is safe — please check the code with whoever shared it
              and mention it when we call.
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={waLink("256759443714", "Hello Star Schools! I just registered online and would like to book our tour + interview.")} target="_blank" rel="noopener noreferrer" className="btn btn-gold !py-2.5 text-[10px]">
              WhatsApp admissions
            </a>
            <button onClick={reset} className="btn btn-ghost-dark !py-2.5 text-[10px]">
              Register another child
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- section ---------------- */
export default function Ambassador({ refCode = "" }: { refCode?: string }) {
  return (
    <section id="ambassador" className="beams relative overflow-hidden bg-navy" aria-label="Parent Ambassador referral programme">
      <StarSparkles count={14} />
      <span className="text-outline pointer-events-none absolute -left-3 top-8 select-none font-display text-[15vw] font-extrabold leading-none opacity-50" aria-hidden="true">
        05
      </span>

      <div className="section-pad relative mx-auto max-w-[1440px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-4">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="#FFC93C" />
                </svg>
                <span className="eyebrow text-gold">05 / Parent Ambassadors</span>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="h-xl mt-6 text-cream">
                Parents, carry
                <br />
                the <em className="italic text-gold">light.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-md leading-relaxed text-cream/70">
                You already know what this hill does for children. Become a verified{" "}
                <strong className="text-cream">Parent Ambassador</strong>, share one code three
                ways, and earn a tuition credit for every family that enrolls through you.
              </p>
            </Reveal>

            <div className="mt-9 space-y-3.5">
              {METHODS.map((m, i) => (
                <Reveal key={m.letter} delay={0.1 + i * 0.08}>
                  <div className="glass group flex items-start gap-4 rounded-xl transition-all duration-400 hover:border-gold/45 hover:bg-navy-2/50" style={{ padding: "1.1rem 1.25rem" }}>
                    <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-lg font-extrabold text-navy transition-transform duration-400 group-hover:rotate-[72deg]">
                      {m.letter}
                    </span>
                    <div>
                      <p className="mono-label text-[10.5px] text-gold">{m.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-cream/65">{m.copy}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <p className="mt-7 max-w-md text-xs leading-relaxed text-cream/40">
                Demo notice: this engine runs entirely in your browser (localStorage) so you can
                test every flow — no data leaves your device until the school connects its backend.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:col-span-7 xl:grid-cols-2">
            <Reveal delay={0.1} y={50}>
              <AmbassadorPanel />
            </Reveal>
            <Reveal delay={0.2} y={50}>
              <RegisterPanel refCode={refCode} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
