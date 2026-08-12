import { useState, useEffect } from "react";
import { todayStr, firstOfMonthStr } from "./utils/dateUtils";
import { generalExpensesService } from "./api";
import { FiTrash2 } from "react-icons/fi";

const T = {
  light: {
    bgApp: "#F8F9F5",
    bgSurface: "#FFFFFF",
    bgElevated: "#EEF2E4",
    bgList: "#F5F7F0",
    bgSidebarActive: "#5F702D",
    text: "#1C1F18",
    textSec: "#4F5548",
    textMuted: "#747A70",
    border: "#DDE1D7",
    borderCard: "rgba(119,138,59,0.14)",
    accent: "#715317",
    accentLight: "#EEF2E4",
    accentText: "#715317",
    grad: "linear-gradient(135deg,#778A3B 0%,#5F702D 100%)",
    pending: { bg: "rgba(201,138,40,0.14)", text: "#C98A28" },
    shadow: "0 12px 28px rgba(119,138,59,0.10)",
    shadowLg: "0 20px 48px rgba(119,138,59,0.16)",
  },
  dark: {
    bgApp: "#18181b",
    bgSurface: "#27272a",
    bgElevated: "#2d2d32",
    bgList: "#27272a",
    bgSidebarActive: "#778A3B",
    text: "#F4F4F5",
    textSec: "#D4D4D8",
    textMuted: "#A1A1AA",
    border: "rgba(255,255,255,0.08)",
    borderCard: "rgba(255,255,255,0.10)",
    accent: "#A3C45A",
    accentLight: "rgba(119,138,59,0.22)",
    accentText: "#D4EDAA",
    grad: "linear-gradient(135deg,#778A3B 0%,#5F702D 100%)",
    pending: { bg: "rgba(201,138,40,0.22)", text: "#F0CB8C" },
    shadow: "0 12px 28px rgba(0,0,0,0.40)",
    shadowLg: "0 20px 48px rgba(0,0,0,0.50)",
  },
};

function Card({ children, t, p = 16, mb = 10, style = {} }) {
  return (
    <div style={{ background: t.bgSurface, borderRadius: 12, border: `1px solid ${t.borderCard}`, padding: p, marginBottom: mb, boxShadow: t.shadow, ...style }}>
      {children}
    </div>
  );
}

function Modal({ title, onClose, children, t, width = 500 }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(2px)" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: t.bgSurface, borderRadius: 16, width, maxWidth: "calc(100vw - 40px)", maxHeight: "85vh", overflow: "hidden", boxShadow: t.shadowLg, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>{title}</div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: "none", background: t.bgElevated, cursor: "pointer", fontSize: 16, color: t.textMuted }}>✕</button>
        </div>
        <div style={{ padding: "18px 20px", overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

function Btn({ label, onClick, v = "primary", sz = "md", t, style = {} }) {
  const base = { padding: sz === "sm" ? "4px 11px" : "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: sz === "sm" ? 12 : 14, fontWeight: 600, transition: "all 0.15s" };
  const vs = {
    primary: { background: t.grad, color: "#fff" },
    secondary: { background: t.accentLight, color: t.accentText, border: `1px solid ${t.accent}30` },
    danger: { background: "#FFF1F2", color: "#9F1239", border: "1px solid #FECDD3" },
    ghost: { background: "transparent", color: t.textSec, border: `1px solid ${t.border}` },
  };
  return <button onClick={onClick} style={{ ...base, ...vs[v], ...style }}>{label}</button>;
}

// ─── GENERAL EXPENSES ───

const EXP_TYPE_LIST = [
  { v: "WATER",       lbl: "ماء",            clr: "#2563EB" },
  { v: "ELECTRICITY", lbl: "كهرباء",         clr: "#D97706" },
  { v: "INTERNET",    lbl: "إنترنت",         clr: "#7C3AED" },
  { v: "KITCHEN",     lbl: "ضيافة ومطبخ",    clr: "#059669" },
  { v: "SUPPLIES",    lbl: "مستلزمات ومواد", clr: "#B45309" },
  { v: "OTHER",       lbl: "أخرى",           clr: "#6B7280" },
];
const EXP_TYPE_MAP = Object.fromEntries(EXP_TYPE_LIST.map(x => [x.v, x]));
const SUM_KEYS = ["water", "electricity", "internet", "kitchen", "supplies", "other"];
const SUM_META = {
  water:       { lbl: "ماء",            clr: "#2563EB" },
  electricity: { lbl: "كهرباء",         clr: "#D97706" },
  internet:    { lbl: "إنترنت",         clr: "#7C3AED" },
  kitchen:     { lbl: "ضيافة ومطبخ",    clr: "#059669" },
  supplies:    { lbl: "مستلزمات ومواد", clr: "#B45309" },
  other:       { lbl: "أخرى",           clr: "#6B7280" },
};
const PAY_LABEL = { CASH: "نقداً", SHAM_CASH: "شام كاش" };
const _today = todayStr;
const _fom   = firstOfMonthStr;
const fmtAmt = n => (n != null && n !== "") ? Number(n).toLocaleString("en") : "—";

const inputSt = (t, err) => ({
  padding: "9px 12px", borderRadius: 9, border: `1.5px solid ${err ? "#c74848" : t.border}`,
  background: t.bgElevated, color: t.text, fontSize: 13, fontFamily: "inherit",
  boxSizing: "border-box", outline: "none", width: "100%",
});
const selectSt = t => ({
  padding: "8px 12px", borderRadius: 9, border: `1.5px solid ${t.border}`,
  background: t.bgElevated, color: t.text, fontSize: 13, fontFamily: "inherit",
  boxSizing: "border-box", outline: "none",
});

function ExpTypeBadge({ type, t }) {
  const m = EXP_TYPE_MAP[type] || { lbl: type, clr: "#6B7280" };
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, background: `${m.clr}18`, color: m.clr, fontSize: 12, fontWeight: 600 }}>
      {m.lbl}
    </span>
  );
}

function PgGeneralExpenses({ t }) {
  const [summary, setSummary]       = useState(null);
  const [sumLoading, setSumLoading] = useState(true);
  const [sumFrom, setSumFrom]       = useState(_fom());
  const [sumTo, setSumTo]           = useState(_today());

  const [rows, setRows]             = useState([]);
  const [meta, setMeta]             = useState(null);
  const [totals, setTotals]         = useState(null);
  const [listLoading, setListLoading] = useState(true);
  const [page, setPage]             = useState(1);
  const LIMIT = 15;

  const [fType, setFType]     = useState("");
  const [fMethod, setFMethod] = useState("");
  const [fFrom, setFFrom]     = useState("");
  const [fTo, setFTo]         = useState("");

  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey(k => k + 1);

  const emptyForm = { type: "", amount: "", paymentMethod: "CASH", expenseDate: _today(), note: "" };
  const [addOpen, setAddOpen]       = useState(false);
  const [form, setForm]             = useState(emptyForm);
  const [fErr, setFErr]             = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [delTarget, setDelTarget] = useState(null);
  const [deleting, setDeleting]   = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (msg, err = false) => { setToast({ msg, err }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSumLoading(true);
      try {
        const res = await generalExpensesService.getSummary({ from: sumFrom, to: sumTo });
        const body = res.data?.data ?? res.data;
        if (!cancelled) setSummary(body);
      } catch (e) {
        if (!cancelled) showToast(e.response?.data?.message || "فشل تحميل الملخص", true);
      } finally {
        if (!cancelled) setSumLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [sumFrom, sumTo, refreshKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListLoading(true);
      try {
        const params = { page, limit: LIMIT };
        if (fType)   params.type = fType;
        if (fMethod) params.paymentMethod = fMethod;
        if (fFrom)   params.from = fFrom;
        if (fTo)     params.to = fTo;
        const res = await generalExpensesService.getAll(params);
        const body = res.data?.data ?? res.data;
        if (!cancelled) {
          setRows(Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : []);
          setMeta(body?.meta || null);
          setTotals(body?.totals || null);
        }
      } catch (e) {
        if (!cancelled) showToast(e.response?.data?.message || "فشل تحميل المصاريف", true);
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [page, fType, fMethod, fFrom, fTo, refreshKey]);

  const handleAdd = async () => {
    const errs = {};
    if (!form.type) errs.type = "النوع مطلوب";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errs.amount = "المبلغ مطلوب وأكبر من صفر";
    setFErr(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      await generalExpensesService.create({
        type: form.type,
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
        ...(form.expenseDate && { expenseDate: form.expenseDate }),
        ...(form.note.trim() && { note: form.note.trim() }),
      });
      setAddOpen(false);
      setForm(emptyForm);
      setFErr({});
      showToast("تمت إضافة المصروف بنجاح");
      refresh();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "حدث خطأ";
      showToast(Array.isArray(msg) ? msg.join("، ") : msg, true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    setDeleting(true);
    try {
      await generalExpensesService.delete(delTarget.expenseId);
      setRows(prev => prev.filter(r => r.expenseId !== delTarget.expenseId));
      setDelTarget(null);
      showToast("تم حذف المصروف بنجاح");
      refresh();
    } catch (e) {
      showToast(e.response?.data?.message || "فشل الحذف", true);
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => { setFType(""); setFMethod(""); setFFrom(""); setFTo(""); setPage(1); };
  const hasFilters = fType || fMethod || fFrom || fTo;

  const thSt = { padding: "10px 14px", fontSize: 12, fontWeight: 700, color: t.textSec, textAlign: "right", background: t.bgElevated, borderBottom: `1px solid ${t.border}`, whiteSpace: "nowrap" };
  const tdSt = { padding: "11px 14px", fontSize: 13, color: t.text, borderBottom: `1px solid ${t.border}`, verticalAlign: "middle" };

  return (
    <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1, position: "relative" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 22, left: "50%", transform: "translateX(-50%)", zIndex: 3000, background: toast.err ? "#9F1239" : "#3F6B3A", color: "#fff", padding: "11px 26px", borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: "0 8px 28px rgba(0,0,0,0.22)", whiteSpace: "nowrap", pointerEvents: "none" }}>
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: t.text, marginBottom: 2 }}>المصاريف العامة</div>
          <div style={{ fontSize: 13, color: t.textMuted }}>تتبع وإدارة مصاريف المدرسة العامة</div>
        </div>
        <Btn label="+ إضافة مصروف جديد" onClick={() => { setForm(emptyForm); setFErr({}); setAddOpen(true); }} t={t} />
      </div>

      {/* Summary */}
      <div style={{ background: t.bgSurface, borderRadius: 12, border: `1px solid ${t.borderCard}`, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>ملخص الفترة</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: t.textMuted }}>من</span>
            <input type="date" value={sumFrom} onChange={e => setSumFrom(e.target.value)} style={{ ...selectSt(t), width: "auto", fontSize: 12, padding: "5px 8px" }} />
            <span style={{ fontSize: 12, color: t.textMuted }}>إلى</span>
            <input type="date" value={sumTo} onChange={e => setSumTo(e.target.value)} style={{ ...selectSt(t), width: "auto", fontSize: 12, padding: "5px 8px" }} />
          </div>
        </div>
        {sumLoading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 80, gap: 10 }}>
            <style>{`@keyframes acSpin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ width: 26, height: 26, borderRadius: "50%", border: `3px solid ${t.border}`, borderTopColor: t.accent, animation: "acSpin 0.85s linear infinite" }} />
            <span style={{ fontSize: 12, color: t.textMuted }}>جارٍ التحميل...</span>
          </div>
        ) : summary && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 12 }}>
              {[
                { lbl: "إجمالي المصاريف", val: summary.totalAmount, sub: `${summary.totalCount || 0} مصروف`, clr: "#b91c1c" },
                { lbl: "نقداً",            val: summary.cash,        sub: "", clr: "#374151" },
                { lbl: "شام كاش",          val: summary.shamCash,    sub: "", clr: "#7C3AED" },
              ].map(c => (
                <div key={c.lbl} style={{ background: t.bgElevated, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: c.clr, lineHeight: 1, marginBottom: 3 }}>{fmtAmt(c.val)} <span style={{ fontSize: 12, fontWeight: 500 }}>ل.س</span></div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{c.lbl}</div>
                  {c.sub && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{c.sub}</div>}
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
              {SUM_KEYS.map(k => {
                const m = SUM_META[k];
                const d = summary.byType?.[k] || { amount: 0, count: 0 };
                const amount = typeof d === "object" ? d.amount : d;
                const count  = typeof d === "object" ? d.count  : 0;
                return (
                  <div key={k} style={{ background: t.bgSurface, borderRadius: 9, border: `1px solid ${t.borderCard}`, padding: "10px 10px 8px" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: m.clr, marginBottom: 5, letterSpacing: 0.3 }}>{m.lbl}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{fmtAmt(amount)}</div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{count} مصروف</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <input type="date" value={fFrom} onChange={e => { setFFrom(e.target.value); setPage(1); }} style={{ ...selectSt(t), width: "auto", fontSize: 12, padding: "7px 10px" }} title="من تاريخ" />
        <input type="date" value={fTo}   onChange={e => { setFTo(e.target.value);   setPage(1); }} style={{ ...selectSt(t), width: "auto", fontSize: 12, padding: "7px 10px" }} title="إلى تاريخ" />
        <select value={fType}   onChange={e => { setFType(e.target.value);   setPage(1); }} style={{ ...selectSt(t), width: "auto" }}>
          <option value="">كل الأنواع</option>
          {EXP_TYPE_LIST.map(x => <option key={x.v} value={x.v}>{x.lbl}</option>)}
        </select>
        <select value={fMethod} onChange={e => { setFMethod(e.target.value); setPage(1); }} style={{ ...selectSt(t), width: "auto" }}>
          <option value="">كل طرق الدفع</option>
          <option value="CASH">نقداً</option>
          <option value="SHAM_CASH">شام كاش</option>
        </select>
        {hasFilters && <Btn label="مسح الفلاتر" onClick={clearFilters} t={t} v="ghost" sz="sm" />}
      </div>

      {/* Filtered totals */}
      {totals && hasFilters && (
        <div style={{ display: "flex", gap: 16, padding: "9px 14px", borderRadius: 9, background: t.accentLight, marginBottom: 12, fontSize: 13, flexWrap: "wrap" }}>
          <span style={{ color: t.text, fontWeight: 600 }}>إجمالي الفلتر:</span>
          <span style={{ color: "#b91c1c", fontWeight: 700 }}>{fmtAmt(totals.totalAmount)} ل.س</span>
          <span style={{ color: t.textSec }}>نقداً: <strong>{fmtAmt(totals.totalCash)}</strong></span>
          <span style={{ color: t.textSec }}>شام كاش: <strong>{fmtAmt(totals.totalShamCash)}</strong></span>
        </div>
      )}

      {/* Table */}
      <Card t={t} p={0} mb={12} style={{ overflow: "hidden" }}>
        {listLoading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 120, gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", border: `3px solid ${t.border}`, borderTopColor: t.accent, animation: "acSpin 0.85s linear infinite" }} />
            <span style={{ fontSize: 12, color: t.textMuted }}>جارٍ تحميل المصاريف...</span>
          </div>
        ) : rows.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: t.textMuted, fontSize: 13 }}>لا توجد مصاريف بهذه المعايير</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thSt}>#</th>
                  <th style={thSt}>النوع</th>
                  <th style={thSt}>المبلغ</th>
                  <th style={thSt}>طريقة الدفع</th>
                  <th style={thSt}>التاريخ</th>
                  <th style={thSt}>ملاحظات</th>
                  <th style={{ ...thSt, textAlign: "center" }}>حذف</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.expenseId} style={{ transition: "background 0.1s" }} onMouseEnter={e => e.currentTarget.style.background = t.bgElevated} onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ ...tdSt, color: t.textMuted, fontSize: 11 }}>{row.expenseId}</td>
                    <td style={tdSt}><ExpTypeBadge type={row.type} t={t} /></td>
                    <td style={{ ...tdSt, fontWeight: 700, color: "#b91c1c" }}>{fmtAmt(row.amount)} ل.س</td>
                    <td style={tdSt}>{PAY_LABEL[row.paymentMethod] || row.paymentMethod}</td>
                    <td style={{ ...tdSt, color: t.textSec }}>{row.expenseDate || row.paidAt?.split("T")[0] || "—"}</td>
                    <td style={{ ...tdSt, color: t.textMuted, maxWidth: 180 }}>{row.note || "—"}</td>
                    <td style={{ ...tdSt, textAlign: "center" }}>
                      <button onClick={() => setDelTarget(row)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C74848", padding: "4px 6px", borderRadius: 6, display: "flex", alignItems: "center" }}>
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 12, flexWrap: "wrap" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: page === 1 ? t.bgElevated : "transparent", color: page === 1 ? t.textMuted : t.text, cursor: page === 1 ? "default" : "pointer", fontSize: 13, fontFamily: "inherit" }}>السابق</button>
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === meta.totalPages || Math.abs(p - page) <= 2).map((p, idx, arr) => (
            <span key={p}>
              {idx > 0 && arr[idx - 1] !== p - 1 && <span style={{ padding: "6px 4px", color: t.textMuted }}>…</span>}
              <button onClick={() => setPage(p)} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${page === p ? t.accent : t.border}`, background: page === p ? t.grad : "transparent", color: page === p ? "#fff" : t.text, cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: page === p ? 700 : 400 }}>{p}</button>
            </span>
          ))}
          <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: page === meta.totalPages ? t.bgElevated : "transparent", color: page === meta.totalPages ? t.textMuted : t.text, cursor: page === meta.totalPages ? "default" : "pointer", fontSize: 13, fontFamily: "inherit" }}>التالي</button>
        </div>
      )}

      {/* Add Modal */}
      {addOpen && (
        <Modal title="إضافة مصروف جديد" onClose={() => { if (!submitting) { setAddOpen(false); setFErr({}); } }} t={t} width={460}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 4 }}>نوع المصروف <span style={{ color: "#c74848" }}>*</span></label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...inputSt(t, fErr.type), appearance: "auto" }}>
                <option value="">اختر النوع...</option>
                {EXP_TYPE_LIST.map(x => <option key={x.v} value={x.v}>{x.lbl}</option>)}
              </select>
              {fErr.type && <div style={{ fontSize: 11, color: "#c74848", marginTop: 3 }}>{fErr.type}</div>}
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 4 }}>المبلغ (ل.س) <span style={{ color: "#c74848" }}>*</span></label>
              <input type="number" min="1" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="120000" dir="ltr" style={{ ...inputSt(t, fErr.amount), textAlign: "left" }} />
              {fErr.amount && <div style={{ fontSize: 11, color: "#c74848", marginTop: 3 }}>{fErr.amount}</div>}
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 4 }}>تاريخ المصروف</label>
              <input type="date" value={form.expenseDate} onChange={e => setForm(f => ({ ...f, expenseDate: e.target.value }))} style={inputSt(t, false)} />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 6 }}>طريقة الدفع</label>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ v: "CASH", lbl: "نقداً" }, { v: "SHAM_CASH", lbl: "شام كاش" }].map(m => (
                  <button key={m.v} type="button" onClick={() => setForm(f => ({ ...f, paymentMethod: m.v }))}
                    style={{ flex: 1, padding: "9px 8px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: form.paymentMethod === m.v ? t.grad : t.bgElevated, color: form.paymentMethod === m.v ? "#fff" : t.textSec, outline: form.paymentMethod === m.v ? "none" : `1.5px solid ${t.border}`, transition: "all 0.15s" }}>
                    {m.lbl}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: t.textSec, display: "block", marginBottom: 4 }}>ملاحظات (اختياري)</label>
              <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="فاتورة تموز..." rows={2} style={{ ...inputSt(t, false), resize: "vertical", lineHeight: 1.5 }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleAdd} disabled={submitting} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", cursor: submitting ? "not-allowed" : "pointer", background: submitting ? t.textMuted : t.grad, color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "inherit", transition: "background 0.15s" }}>
              {submitting ? "جارٍ الحفظ..." : "حفظ المصروف"}
            </button>
            <Btn label="إلغاء" onClick={() => { if (!submitting) { setAddOpen(false); setFErr({}); } }} t={t} v="ghost" />
          </div>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {delTarget && (
        <Modal title="تأكيد الحذف" onClose={() => { if (!deleting) setDelTarget(null); }} t={t} width={360}>
          <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
            <div style={{ marginBottom: 10, color: "#C74848", display: "flex", justifyContent: "center" }}><FiTrash2 size={38} /></div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 6 }}>هل تريد حذف هذا المصروف؟</div>
            <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 4 }}><ExpTypeBadge type={delTarget.type} t={t} /></div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#b91c1c", marginBottom: 4 }}>{fmtAmt(delTarget.amount)} ل.س</div>
            {delTarget.note && <div style={{ fontSize: 12, color: t.textMuted }}>{delTarget.note}</div>}
          </div>
          <div style={{ padding: "9px 12px", borderRadius: 9, background: "#FFF1F2", fontSize: 12, color: "#9F1239", marginBottom: 14, textAlign: "center" }}>
            هذا الإجراء لا يمكن التراجع عنه
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleDelete} disabled={deleting} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", cursor: deleting ? "not-allowed" : "pointer", background: deleting ? t.textMuted : "#9F1239", color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>
              {deleting ? "جارٍ الحذف..." : "تأكيد الحذف"}
            </button>
            <Btn label="إلغاء" onClick={() => { if (!deleting) setDelTarget(null); }} t={t} v="ghost" />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function AccountantPro({ embedded = false, darkMode }) {
  const [localDark, setLocalDark] = useState(false);
  const dark = (embedded && typeof darkMode !== "undefined") ? darkMode : localDark;
  const t = T[dark ? "dark" : "light"];

  return (
    <div dir="rtl" style={{ display: "flex", height: embedded ? "100%" : "100vh", overflow: "hidden", background: t.bgApp, fontFamily: "var(--font-body)" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {!embedded && (
          <div style={{ height: 50, background: t.bgSurface, borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 10, flexShrink: 0, boxShadow: t.shadow }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>المصاريف العامة</div>
            <div style={{ flex: 1 }} />
            <button onClick={() => setLocalDark(d => !d)} style={{ padding: "5px 13px", borderRadius: 7, background: t.accentLight, color: t.accentText, border: "none", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
              {dark ? "☀️ نهاري" : "🌙 ليلي"}
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <PgGeneralExpenses t={t} />
        </div>
      </div>
    </div>
  );
}
