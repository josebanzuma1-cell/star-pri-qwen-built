import { useEffect, useState, type FormEvent } from "react";
import {
  getAllAmbassadors,
  getAllLeads,
  updateLeadStatus,
  LEAD_STATUSES,
  type LeadRecord,
  type AmbassadorRecord,
} from "../services/api";
import { downloadCsv, formatDate } from "../lib/helpers";

const PASSCODE = "starlight"; // demo only — replace with real auth server-side

export default function Admin({ onBack }: { onBack: () => void }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("star:admin") === "1");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [ambs, setAmbs] = useState<AmbassadorRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [l, a] = await Promise.all([getAllLeads(), getAllAmbassadors()]);
    setLeads(l);
    setAmbs(a);
    setLoading(false);
  };

  useEffect(() => {
    if (authed) void load();
    const onChange = () => void load();
    window.addEventListener("star:data-changed", onChange);
    return () => window.removeEventListener("star:data-changed", onChange);
  }, [authed]);

  const login = (e: FormEvent) => {
    e.preventDefault();
    if (pass.trim().toLowerCase() === PASSCODE) {
      sessionStorage.setItem("star:admin", "1");
      setAuthed(true);
      setErr("");
    } else {
      setErr("Wrong passcode. Hint for the demo: think of the motto.");
    }
  };

  const setStatus = async (id: string, status: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await updateLeadStatus(id, status);
    window.dispatchEvent(new Event("star:data-changed"));
  };

  if (!authed) {
    return (
      <main className="beams flex min-h-svh items-center justify-center bg-navy-3 px-5">
        <form onSubmit={login} className="glass w-full max-w-sm rounded-2xl p-8 text-center">
          <svg viewBox="0 0 24 24" className="mx-auto h-10 w-10 text-gold" aria-hidden="true">
            <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
          </svg>
          <h1 className="font-display mt-4 text-2xl font-bold text-cream">Staff console</h1>
          <p className="mt-2 text-sm text-cream/60">Demo gate — passcode: <code className="rounded bg-navy-2 px-1.5 py-0.5 text-gold">starlight</code></p>
          <label htmlFor="pass" className="mono-label mb-1.5 mt-6 block text-left text-[9.5px] text-cream/70">
            Passcode
          </label>
          <input
            id="pass"
            type="password"
            className={`field field-dark ${err ? "field-error" : ""}`}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
            autoFocus
          />
          {err && <p className="mt-2 text-left text-xs text-[#ff9d9d]">{err}</p>}
          <button type="submit" className="btn btn-gold mt-5 w-full justify-center">Unlock</button>
          <a href="#top" onClick={(e) => { e.preventDefault(); onBack(); }} className="mono-label mt-4 inline-block text-[9.5px] text-cream/50 transition hover:text-gold">
            ← Back to the site
          </a>
        </form>
      </main>
    );
  }

  const tiles = [
    { label: "Leads", value: leads.length },
    { label: "Ambassadors", value: ambs.length },
    { label: "Referred leads", value: leads.filter((l) => l.code).length },
    { label: "Enrolled +", value: leads.filter((l) => ["enrolled", "paid", "reward_issued"].includes(l.status)).length },
  ];

  return (
    <main className="beams min-h-svh bg-navy-3 pb-24">
      <header className="sticky top-0 z-40 border-b border-gold/10 bg-navy-3/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-gold" aria-hidden="true">
              <path d="M12 1.8 L14.6 9.4 L22.2 12 L14.6 14.6 L12 22.2 L9.4 14.6 L1.8 12 L9.4 9.4 Z" fill="currentColor" />
            </svg>
            <div>
              <p className="font-display text-sm font-bold text-cream">Referral console</p>
              <p className="mono-label text-[8.5px] text-cream/45">Star Schools Namasuba • demo mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => downloadCsv(`star-leads-${Date.now()}.csv`, leads.map(({ id, ...r }) => r))}
              className="mono-label rounded-full border border-gold/35 px-3.5 py-2 text-[9px] text-gold transition hover:bg-gold hover:text-navy"
            >
              Export leads CSV
            </button>
            <button
              onClick={() => downloadCsv(`star-ambassadors-${Date.now()}.csv`, ambs.map(({ id, ...r }) => r))}
              className="mono-label hidden rounded-full border border-gold/35 px-3.5 py-2 text-[9px] text-gold transition hover:bg-gold hover:text-navy sm:inline-block"
            >
              Export ambassadors CSV
            </button>
            <a href="#top" onClick={(e) => { e.preventDefault(); onBack(); }} className="btn btn-ghost !px-4 !py-2 text-[9px]">
              Site
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 pt-10 sm:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="glass rounded-xl p-5">
              <p className="font-display text-3xl font-extrabold text-gold">{t.value}</p>
              <p className="mono-label mt-1.5 text-[9px] text-cream/60">{t.label}</p>
            </div>
          ))}
        </div>

        {/* leads pipeline */}
        <section aria-label="Leads pipeline" className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="h-lg text-cream">Leads pipeline</h2>
            <button onClick={() => void load()} className="mono-label text-[9.5px] text-cream/50 transition hover:text-gold">
              ↻ Refresh
            </button>
          </div>
          <p className="mono-label mt-2 text-[9px] text-cream/40">
            new → contacted → tour → applied → admitted → enrolled → paid → reward_issued
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border border-cream/12">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="mono-label bg-navy-2/60 text-[9px] text-cream/60">
                  <th className="px-4 py-3.5">Parent</th>
                  <th className="px-4 py-3.5">Child</th>
                  <th className="px-4 py-3.5">Class</th>
                  <th className="px-4 py-3.5">Phone</th>
                  <th className="px-4 py-3.5">Referral code</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-cream/40">Loading…</td></tr>
                )}
                {!loading && leads.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-cream/40">No leads yet — share a smart link to get the first one.</td></tr>
                )}
                {leads.map((l) => (
                  <tr key={l.id} className="border-t border-cream/8 transition-colors hover:bg-navy-2/30">
                    <td className="px-4 py-3.5 font-medium text-cream">
                      {l.parent}
                      {l.demo && <span className="mono-label ml-2 rounded bg-leaf/20 px-1.5 py-0.5 text-[8px] text-leaf">demo</span>}
                    </td>
                    <td className="px-4 py-3.5 text-cream/75">{l.child}</td>
                    <td className="px-4 py-3.5 text-cream/75">{l.klass}</td>
                    <td className="px-4 py-3.5 text-cream/75">{l.phone}</td>
                    <td className="px-4 py-3.5">
                      {l.code ? (
                        <span className="mono-label rounded bg-gold/12 px-2 py-1 text-[9.5px] text-gold">{l.code}</span>
                      ) : (
                        <span className="text-cream/35">— direct</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-cream/55">{formatDate(l.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <select
                        value={l.status}
                        onChange={(e) => void setStatus(l.id, e.target.value)}
                        className="field field-dark !w-auto !px-3 !py-2 !text-xs"
                        aria-label={`Status for lead ${l.parent}`}
                      >
                        {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ambassadors */}
        <section aria-label="Ambassadors" className="mt-12">
          <h2 className="h-lg text-cream">Ambassadors</h2>
          <div className="mt-5 overflow-x-auto rounded-xl border border-cream/12">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="mono-label bg-navy-2/60 text-[9px] text-cream/60">
                  <th className="px-4 py-3.5">Parent</th>
                  <th className="px-4 py-3.5">Code</th>
                  <th className="px-4 py-3.5">Child / class</th>
                  <th className="px-4 py-3.5">WhatsApp</th>
                  <th className="px-4 py-3.5">Joined</th>
                </tr>
              </thead>
              <tbody>
                {ambs.map((a) => (
                  <tr key={a.id} className="border-t border-cream/8 transition-colors hover:bg-navy-2/30">
                    <td className="px-4 py-3.5 font-medium text-cream">
                      {a.name}
                      {a.demo && <span className="mono-label ml-2 rounded bg-leaf/20 px-1.5 py-0.5 text-[8px] text-leaf">demo</span>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="mono-label rounded bg-gold/12 px-2 py-1 text-[9.5px] text-gold">{a.code}</span>
                    </td>
                    <td className="px-4 py-3.5 text-cream/75">{a.child} • {a.klass}</td>
                    <td className="px-4 py-3.5 text-cream/75">{a.phone}</td>
                    <td className="px-4 py-3.5 text-cream/55">{formatDate(a.createdAt)}</td>
                  </tr>
                ))}
                {ambs.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-cream/40">No ambassadors yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-xs text-cream/35">
            Demo data lives in this browser's localStorage. Connect a backend via <code className="rounded bg-navy-2 px-1.5 py-0.5 text-cream/60">VITE_API_BASE</code> — see README.
          </p>
        </section>
      </div>
    </main>
  );
}
