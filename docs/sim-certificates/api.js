/* eslint-disable */
/* =============================================================================
 * أداة المحاكاة — عملية API · هوية · ساعة · سجل
 * =============================================================================
 * الهدف: أداة وضع للتجربة — لا تسجيل دخول يدوي، لا نسخ توكنات، لا انتظار أمام.
 * كل ما يشرح «لماذا صُنّي هكذا» يعيش خلف «وضع الشرح» — لأن الشاشة أداة عمل،
 * والشرح يُقيد مرونة الفريق في كل مرة بعدها.
 * ========================================================================== */

const API_BASE = localStorage.getItem('sim.apiBase') || 'http://20.250.144.221:3000/api/v1';
const SIM_CLOCK_OFFSET_KEY = 'sim.clock.offsetMs';
const EXPLAIN_KEY = 'sim.explain';

/** حسابات البذور. كلمة المرور موحدة عدا المدير. */
const IDENTITIES = {
  manager:   { label: 'المدير',           phone: '0999111222', password: 'Admin@12345', kind: 'staff' },
  reception: { label: 'موظف الاستقبال',   phone: '0999200001', password: 'Test@12345',  kind: 'staff' },
  s1: { label: 'طالب ١', phone: '0999400001', password: 'Test@12345', kind: 'student' },
  s2: { label: 'طالب ٢', phone: '0999400002', password: 'Test@12345', kind: 'student' },
  s3: { label: 'طالب ٣', phone: '0999400003', password: 'Test@12345', kind: 'student' },
  s4: { label: 'طالب ٤', phone: '0999400004', password: 'Test@12345', kind: 'student' },
  s5: { label: 'طالب ٥', phone: '0999400005', password: 'Test@12345', kind: 'student' },
  s6: { label: 'طالب ٦', phone: '0999400006', password: 'Test@12345', kind: 'student' },
  s7: { label: 'طالب ٧', phone: '0999400007', password: 'Test@12345', kind: 'student' },
  s8: { label: 'طالب ٨', phone: '0999400008', password: 'Test@12345', kind: 'student' },
  s9: { label: 'طالب ٩', phone: '0999400009', password: 'Test@12345', kind: 'student' },
};

const tokenKey = (id) => `sim.token.${id}`;

/* ─── ساعة المحاكاة ──────────────────────────────────────────────────────── */

function getClockOffsetMs() {
  const raw = Number(localStorage.getItem(SIM_CLOCK_OFFSET_KEY) || '0');
  return Number.isFinite(raw) ? raw : 0;
}
function setClockOffsetMs(ms) {
  localStorage.setItem(SIM_CLOCK_OFFSET_KEY, String(Math.round(Number.isFinite(ms) ? ms : 0)));
}
function shiftClockHours(h) { setClockOffsetMs(getClockOffsetMs() + h * 3600000); }
function simNow() { return new Date(Date.now() + getClockOffsetMs()); }
function clockOffsetHours() { return Math.round((getClockOffsetMs() / 3600000) * 100) / 100; }

function offsetLabel() {
  const h = clockOffsetHours();
  if (h === 0) return 'الوقت الحقيقي';
  const abs = Math.abs(h);
  const d = Math.floor(abs / 24);
  const r = Math.round((abs % 24) * 10) / 10;
  const parts = [];
  if (d) parts.push(`${d} يوم`);
  if (r) parts.push(`${r} ساعة`);
  return `${h > 0 ? 'بعد' : 'قبل'} ${parts.join(' و')}`;
}

function formatSimNow(d) {
  return d.toLocaleString('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

function formatSchoolTime(iso) {
  const d = new Date(new Date(iso).getTime() + 3 * 3600000);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

/* ─── الدخول والهويات ────────────────────────────────────────────────────── */

async function login(identityId) {
  const who = IDENTITIES[identityId];
  if (!who) throw new Error(`هوية غير معروفة: ${identityId}`);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: who.phone, password: who.password, deviceName: 'محاكاة الشهادات' }),
  });
  const body = await res.json();
  if (!res.ok) throw new ApiError(res.status, body);

  localStorage.setItem(tokenKey(identityId), body.data.accessToken);
  localStorage.setItem(`sim.user.${identityId}`, JSON.stringify(body.data.user));
  return body.data.accessToken;
}

async function tokenFor(identityId) {
  return localStorage.getItem(tokenKey(identityId)) || (await login(identityId));
}

class ApiError extends Error {
  constructor(status, body) {
    const m = body && body.message;
    super(Array.isArray(m) ? m.join(' · ') : String(m || `HTTP ${status}`));
    this.status = status;
    this.body = body;
  }
}

async function apiCall(identityId, method, path, { json, form, raw } = {}, _retried = false) {
  console.log(`[API ▶] ${method} ${path}`, { identityId, body: json ?? (form ? '<FormData>' : null) });
  const token = await tokenFor(identityId);
  const headers = {
    Authorization: `Bearer ${token}`,
    'X-Simulated-Now': simNow().toISOString(),
  };
  let body;

  if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(json);
  } else if (form) {
    body = form;
  }

  const res = await fetch(`${API_BASE}${path}`, { method, headers, body });
  console.log(`[API ◁] ${method} ${path} → HTTP ${res.status}`);

  if (res.status === 401 && !_retried) {
    console.warn(`[API] 401 — clearing token for "${identityId}", retrying once`);
    localStorage.removeItem(tokenKey(identityId));
    return apiCall(identityId, method, path, { json, form, raw }, true);
  }

  if (raw) {
    if (!res.ok) throw new ApiError(res.status, await res.json().catch(() => null));
    return res.blob();
  }

  const parsed = await res.json().catch(() => null);
  console.log(`[API ◀] ${method} ${path} — full envelope:`, parsed,
    '\n        → returning parsed.data:', parsed?.data);
  if (!res.ok) throw new ApiError(res.status, parsed);
  return parsed ? parsed.data : null;
}

/* ─── مساعدات العرض ──────────────────────────────────────────────────────── */

const STATUS_AR = {
  WAITING_FOR_TRAINING_SCHEDULE: 'بانتظار جدولة التدريب',
  IN_GOVERNMENT_TRAINING:        'في التدريب الحكومي',
  WAITING_FOR_THEORETICAL_EXAM:  'بانتظار الامتحان النظري',
  WAITING_FOR_PRACTICAL_EXAM:    'بانتظار الامتحان العملي',
  COMPLETED:                     'حصل على الرخصة',
  FAILED:                        'راسب نهائياً',
  CANCELLED:                     'ملغى',
  SUBMITTED_TO_GOV:              'أرسلت للحكومة',
  EXAM_SCHEDULED:                'موعد الامتحان محدد',
  CLOSED:                        'مغلقة',
};

const STATUS_KIND = {
  COMPLETED: 'ok',
  FAILED:    'err',
  CANCELLED: 'mute',
  CLOSED:    'ok',
};

const CHARGE_AR = {
  CERTIFICATE_FEE:  'رسم الشهادة',
  REEXAM_THEORY:    'إعادة النظري',
  REEXAM_PRACTICAL: 'إعادة العملي',
};

const CHARGE_STATUS_AR = { PAID: 'مدفوع', UNPAID: 'غير مدفوع', PARTIALLY_PAID: 'مدفوع جزئياً' };
const RESULT_AR        = { PASS: 'ناجح',  FAIL: 'راسب',        ABSENT: 'لم يحضر' };
const EXAM_AR          = { THEORY: 'النظري', PRACTICAL: 'العملي' };
const TRANSMISSION_AR  = { MANUAL: 'عادي (B)', AUTOMATIC: 'أوتوماتيك (B1)' };

const money  = (v) => Number(v).toLocaleString('en-US');
const esc    = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const statusPill = (s) => `<span class="pill pill--${STATUS_KIND[s] || ''}">${STATUS_AR[s] || esc(s)}</span>`;

const randomTxnId = () => String(Math.floor(100000000 + Math.random() * 899999999));

function dayOffset(n) {
  const d = simNow();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/* ─── الشريط العلوي الموحد ───────────────────────────────────────────────── */

function mountTopbar(el, { title, page, identityKind, onIdentity, onClock } = {}) {
  const explainOn = localStorage.getItem(EXPLAIN_KEY) === '1';
  document.body.classList.toggle('explain-on', explainOn);

  const nav = [
    ['index.html',   'الرئيسية'],
    ['staff.html',   '🖥️ شاشة الموظف'],
    ['student.html', '📱 تطبيق الطالب'],
  ];

  const idOptions = identityKind
    ? Object.entries(IDENTITIES).filter(([, v]) => v.kind === identityKind)
    : [];
  const storageKey = `sim.identity.${identityKind}`;
  const savedId = identityKind
    ? (localStorage.getItem(storageKey) || idOptions[0]?.[0])
    : null;

  el.innerHTML = `
    <div class="topbar__main">
      <h1>${esc(title)}</h1>
      <nav>${nav.map(([h, t]) => `<a href="${h}" class="${h === page ? 'on' : ''}">${t}</a>`).join('')}</nav>
    </div>
    <div class="topbar__sub">
      ${identityKind ? `
        <span style="display:inline-flex;align-items:center;gap:7px">
          <span style="color:#a9c8e9">الهوية</span>
          <select id="tbIdentity">${idOptions.map(([k, v]) =>
            `<option value="${k}" ${k === savedId ? 'selected' : ''}>${v.label} — ${v.phone}</option>`).join('')}</select>
          <button class="btn btn--ghost btn--sm" id="tbRelogin" title="مسح التوكن وإعادة الدخول">تجديد الجلسة</button>
        </span>` : ''}

      <span style="display:inline-flex;align-items:center;gap:7px">
        <span style="color:#a9c8e9">⏱ الوقت</span>
        <strong id="tbNow" style="direction:ltr;font-variant-numeric:tabular-nums"></strong>
        <span id="tbOffset" class="pill pill--mute" style="font-size:11px"></span>
        <button class="btn btn--ghost btn--sm" data-shift="1">+ساعة</button>
        <button class="btn btn--ghost btn--sm" data-shift="24">+يوم</button>
        <button class="btn btn--ghost btn--sm" data-shift="168">+أسبوع</button>
        <button class="btn btn--ghost btn--sm" data-shift="-24">−يوم</button>
        <button class="btn btn--ghost btn--sm" id="tbClockReset">الآن</button>
      </span>

      <label class="check" style="margin-inline-start:auto;color:#c6dcf4">
        <input type="checkbox" id="tbExplain" ${explainOn ? 'checked' : ''}> وضع الشرح
      </label>
    </div>`;

  const nowEl = el.querySelector('#tbNow');
  const offEl = el.querySelector('#tbOffset');
  const paintClock = () => {
    nowEl.textContent = formatSimNow(simNow());
    offEl.textContent = offsetLabel();
    offEl.className = `pill ${clockOffsetHours() === 0 ? 'pill--mute' : 'pill--warn'}`;
  };
  paintClock();

  el.querySelectorAll('[data-shift]').forEach((b) => {
    b.onclick = () => { shiftClockHours(Number(b.dataset.shift)); paintClock(); if (onClock) onClock(); };
  });
  el.querySelector('#tbClockReset').onclick = () => {
    setClockOffsetMs(0); paintClock(); if (onClock) onClock();
  };
  el.querySelector('#tbExplain').onchange = (ev) => {
    localStorage.setItem(EXPLAIN_KEY, ev.target.checked ? '1' : '0');
    document.body.classList.toggle('explain-on', ev.target.checked);
  };

  if (!identityKind) return () => null;

  const sel = el.querySelector('#tbIdentity');
  sel.onchange = () => { localStorage.setItem(storageKey, sel.value); if (onIdentity) onIdentity(sel.value); };
  el.querySelector('#tbRelogin').onclick = () => {
    localStorage.removeItem(tokenKey(sel.value));
    toast('ستنشأ جلسة جديدة عند النداء التالي');
    if (onIdentity) onIdentity(sel.value);
  };
  return () => sel.value;
}

/* ─── درج السجل ──────────────────────────────────────────────────────────── */

function mountLogDrawer(host) {
  const d = document.createElement('details');
  d.className = 'drawer';
  d.innerHTML = `
    <summary>سجل نداءات API <span class="pill pill--mute" id="logCount">0</span></summary>
    <div class="drawer__body">
      <div class="row" style="margin-bottom:10px">
        <button class="btn btn--ghost btn--sm" id="logClear">مسح</button>
        <span style="font-size:12px;color:var(--muted)">اضغط أي سطر لترى الاستجابة كاملة.</span>
      </div>
      <div class="logbox" id="logBox"></div>
    </div>`;
  host.appendChild(d);
  log.mount(d.querySelector('#logBox'), d.querySelector('#logCount'));
  d.querySelector('#logClear').onclick = (e) => { e.preventDefault(); log.clear(); };
}

/* ─── سجل النداءات ────────────────────────────────────────────────────────── */

const log = {
  el: null, countEl: null, n: 0,
  mount(el, countEl) { this.el = el; this.countEl = countEl; },
  add(method, path, status, ms, detail) {
    if (!this.el) return;
    this.n++;
    if (this.countEl) this.countEl.textContent = this.n;
    const ok = status >= 200 && status < 300;
    const row = document.createElement('div');
    row.className = `logrow ${ok ? 'logrow--ok' : 'logrow--err'}`;
    row.innerHTML =
      `<span class="logrow__m">${method}</span>` +
      `<span class="logrow__p">${esc(path)}</span>` +
      `<span class="logrow__s">${status}</span>` +
      `<span class="logrow__ms">${ms}ms</span>`;
    if (detail) {
      const pre = document.createElement('pre');
      pre.textContent = typeof detail === 'string' ? detail : JSON.stringify(detail, null, 2);
      pre.hidden = true;
      row.addEventListener('click', () => { pre.hidden = !pre.hidden; });
      row.appendChild(pre);
    }
    this.el.prepend(row);
  },
  clear() { if (this.el) this.el.innerHTML = ''; this.n = 0; if (this.countEl) this.countEl.textContent = '0'; },
};

/** غلاف مسجل لكل نداء تلقائياً. استعمل بدل `apiCall` مباشرةً. */
async function call(identityId, method, path, opts) {
  const t0 = performance.now();
  try {
    const data = await apiCall(identityId, method, path, opts);
    log.add(method, path, 200, Math.round(performance.now() - t0), data);
    return data;
  } catch (e) {
    log.add(method, path, e.status || 0, Math.round(performance.now() - t0), e.body || e.message);
    throw e;
  }
}

function toast(message, kind = 'ok') {
  let host = document.querySelector('.toasts');
  if (!host) {
    host = document.createElement('div');
    host.className = 'toasts';
    document.body.appendChild(host);
  }
  const t = document.createElement('div');
  t.className = `toast toast--${kind}`;
  t.textContent = message;
  host.appendChild(t);
  setTimeout(() => t.remove(), 5200);
}

function guard(fn) {
  return async (...args) => {
    try { await fn(...args); }
    catch (e) {
      console.error('[guard] ⚠ uncaught error:', e.message, e);
      toast(e.message || 'خطأ غير متوقع', 'err');
    }
  };
}

function fakeImageBlob(text) {
  const c = document.createElement('canvas');
  c.width = 320; c.height = 200;
  const g = c.getContext('2d');
  g.fillStyle = '#dbe6f5'; g.fillRect(0, 0, 320, 200);
  g.fillStyle = '#1f3b63'; g.font = 'bold 20px sans-serif';
  g.textAlign = 'center'; g.fillText(text, 160, 105);
  return new Promise((r) => c.toBlob(r, 'image/jpeg', 0.8));
}
