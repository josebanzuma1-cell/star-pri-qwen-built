/**
 * Star Schools Namasuba — Referral Engine data layer.
 *
 * DEMO MODE: everything persists in localStorage so the whole engine
 * (ambassadors, click attribution, leads, pipeline, stats) works with
 * zero backend.
 *
 * PRODUCTION: each function contains a ready-to-enable fetch() call to a
 * /api/* endpoint. Point VITE_API_BASE at your backend, uncomment the
 * fetch block, and the UI keeps working untouched.
 *
 * Attribution rules:
 *  - First code wins: a phone number can only ever be attributed to the
 *    first referral code it arrived with.
 *  - Duplicate detection by normalised phone number.
 *  - Every smart-link open is stored with timestamp + code.
 */

const KEYS = {
  ambassadors: "star:ambassadors",
  leads: "star:leads",
  clicks: "star:clicks",
  seeded: "star:seeded:v1",
};

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) || "";

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "tour",
  "applied",
  "admitted",
  "enrolled",
  "paid",
  "reward_issued",
];

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function generateCode() {
  let body = "";
  for (let i = 0; i < 5; i++) {
    body += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return `STAR-${body}`;
}

/**
 * Mint a code no existing ambassador already holds. generateCode() on its
 * own can hand the same code to two parents, silently merging their
 * referral stats under one identity.
 */
function uniqueCode(ambassadors) {
  const taken = new Set(ambassadors.map((a) => a.code));
  for (let i = 0; i < 50; i++) {
    const code = generateCode();
    if (!taken.has(code)) return code;
  }
  /* 32^5 combinations make 50 straight collisions effectively impossible,
     but never hand back a duplicate - suffix it until it is free. */
  const base = generateCode();
  let n = 2;
  while (taken.has(base + '-' + n)) n++;
  return base + '-' + n;
}

export const normalizePhone = (p) => String(p || "").replace(/[^\d+]/g, "");

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Seed a small, clearly-labelled demo dataset so /admin has life on first run. */
function seedIfNeeded() {
  if (localStorage.getItem(KEYS.seeded)) return;
  const now = Date.now();
  const day = 86400000;
  write(KEYS.ambassadors, [
    {
      id: "amb-demo-1",
      code: "STAR-KWENA",
      name: "Amina Nansubuga",
      phone: "+256759000111",
      child: "Kirabo Nansubuga",
      klass: "Primary 3",
      consent: true,
      createdAt: now - 12 * day,
      demo: true,
    },
  ]);
  write(KEYS.leads, [
    { id: "lead-demo-1", parent: "Joseph Mugisha", phone: "+256700111222", child: "Amani Mugisha", klass: "Primary 1", code: "STAR-KWENA", status: "tour", createdAt: now - 6 * day, demo: true },
    { id: "lead-demo-2", parent: "Grace Atim", phone: "+256772333444", child: "Okello Atim", klass: "Baby Class", code: "STAR-KWENA", status: "enrolled", createdAt: now - 9 * day, demo: true },
    { id: "lead-demo-3", parent: "Peter Ssebunya", phone: "+256758555666", child: "Nakato Ssebunya", klass: "Top Class", code: "", status: "contacted", createdAt: now - 2 * day, demo: true },
  ]);
  write(KEYS.clicks, [
    { code: "STAR-KWENA", ts: now - 6 * day, path: "/?ref=STAR-KWENA" },
    { code: "STAR-KWENA", ts: now - 9 * day, path: "/?ref=STAR-KWENA" },
    { code: "STAR-KWENA", ts: now - 9 * day - 3600000, path: "/?ref=STAR-KWENA" },
    { code: "STAR-KWENA", ts: now - 1 * day, path: "/?ref=STAR-KWENA" },
  ]);
  localStorage.setItem(KEYS.seeded, "1");
}
seedIfNeeded();

/* ------------------------------------------------------------------ */
/* createAmbassador — register a current parent, mint a unique code.   */
/* ------------------------------------------------------------------ */
export async function createAmbassador({ name, phone, child, klass, consent }) {
  /* PRODUCTION:
  const res = await fetch(`${API_BASE}/api/ambassadors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, child, klass, consent }),
  });
  return res.json(); // -> { id, code, name, ... , existing?: boolean }
  */
  await new Promise((r) => setTimeout(r, 420));
  const ambassadors = read(KEYS.ambassadors, []);
  const existing = ambassadors.find((a) => normalizePhone(a.phone) === normalizePhone(phone));
  if (existing) return { ...existing, existing: true };
  const ambassador = {
    id: uid(),
    code: uniqueCode(ambassadors),
    name: name.trim(),
    phone: phone.trim(),
    child: child.trim(),
    klass,
    consent: !!consent,
    createdAt: Date.now(),
  };
  write(KEYS.ambassadors, [ambassador, ...ambassadors]);
  return ambassador;
}

/* ------------------------------------------------------------------ */
/* logClick — called whenever a smart link (?ref=CODE) is opened.      */
/* ------------------------------------------------------------------ */
export async function logClick(code, path) {
  /* PRODUCTION:
  await fetch(`${API_BASE}/api/clicks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, path }),
  });
  */
  await new Promise((r) => setTimeout(r, 120));
  const clicks = read(KEYS.clicks, []);
  clicks.push({ code: String(code).toUpperCase(), ts: Date.now(), path });
  write(KEYS.clicks, clicks);
  return clicks.length;
}

/* ------------------------------------------------------------------ */
/* createLead — referred (or direct) family registers interest.        */
/* Duplicate phones keep the FIRST code (first-code-wins).             */
/* ------------------------------------------------------------------ */
export async function createLead({ parent, phone, child, klass, code, consent }) {
  /* PRODUCTION:
  const res = await fetch(`${API_BASE}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ parent, phone, child, klass, code, consent }),
  });
  return res.json(); // -> { lead, duplicate?: boolean, unknownCode?: boolean }
  */
  await new Promise((r) => setTimeout(r, 480));
  const leads = read(KEYS.leads, []);
  const dup = leads.find((l) => normalizePhone(l.phone) === normalizePhone(phone));
  if (dup) return { lead: dup, duplicate: true, unknownCode: false };

  /* A code only attributes if an ambassador actually holds it. A mistyped
     code is dropped rather than stored, so it can never become an orphan
     credit nobody can claim - the registration itself is still kept, and
     the caller is told so it can ask the family to check the code. */
  const entered = String(code || '').trim().toUpperCase();
  const known = !entered || read(KEYS.ambassadors, []).some((a) => a.code === entered);

  const lead = {
    id: uid(),
    parent: parent.trim(),
    phone: phone.trim(),
    child: child.trim(),
    klass,
    code: known ? entered : "",
    consent: !!consent,
    status: "new",
    createdAt: Date.now(),
  };
  write(KEYS.leads, [lead, ...leads]);
  return { lead, duplicate: false, unknownCode: !!entered && !known };
}

/* ------------------------------------------------------------------ */
/* getStats — per-ambassador counters for the dashboard.               */
/* ------------------------------------------------------------------ */
export async function getStats(code) {
  /* PRODUCTION:
  const res = await fetch(`${API_BASE}/api/ambassadors/stats?code=${encodeURIComponent(code)}`);
  return res.json();
  */
  await new Promise((r) => setTimeout(r, 150));
  const c = String(code || "").toUpperCase();
  const clicks = read(KEYS.clicks, []).filter((x) => x.code === c);
  const leads = read(KEYS.leads, []).filter((l) => l.code === c);
  const enrolledStatuses = ["enrolled", "paid", "reward_issued"];
  return {
    opens: clicks.length,
    registrations: leads.length,
    enrollments: leads.filter((l) => enrolledStatuses.includes(l.status)).length,
  };
}

/* ------------------------------------------------------------------ */
/* Admin helpers                                                       */
/* ------------------------------------------------------------------ */
export async function getAllLeads() {
  /* PRODUCTION: return (await fetch(`${API_BASE}/api/leads`)).json(); */
  await new Promise((r) => setTimeout(r, 200));
  return read(KEYS.leads, []).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getAllAmbassadors() {
  /* PRODUCTION: return (await fetch(`${API_BASE}/api/ambassadors`)).json(); */
  await new Promise((r) => setTimeout(r, 200));
  return read(KEYS.ambassadors, []).sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateLeadStatus(id, status) {
  /* PRODUCTION:
  await fetch(`${API_BASE}/api/leads/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  */
  await new Promise((r) => setTimeout(r, 160));
  const leads = read(KEYS.leads, []).map((l) => (l.id === id ? { ...l, status } : l));
  write(KEYS.leads, leads);
  return leads.find((l) => l.id === id);
}
