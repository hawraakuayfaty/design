import { useState, useEffect } from "react";
import { todayStr, firstOfMonthStr, currentYearMonth } from "./utils/dateUtils";
import { generalExpensesService, employeesService, employeeAccountingService } from "./api";
import { useAuth } from "./contexts/useAuth";
import { P } from "./constants/roles";
import { FiTrash2 } from "react-icons/fi";
import { LuEye, LuEyeOff, LuPencil, LuBan, LuLockOpen, LuBanknote, LuFileText } from "react-icons/lu";

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
    pending:   { bg: "rgba(201,138,40,0.14)", text: "#C98A28", dot: "#C98A28" },
    completed: { bg: "rgba(63,107,58,0.14)",  text: "#3F6B3A", dot: "#3F6B3A" },
    cancelled: { bg: "rgba(199,72,72,0.12)",  text: "#C74848", dot: "#C74848" },
    confirmed: { bg: "rgba(119,124,59,0.12)", text: "#5F702D", dot: "#778A3B" },
    expired:   { bg: "rgba(183,189,178,0.16)",text: "#747A70", dot: "#B7BDB2" },
    admin:     { bg: "rgba(119,124,59,0.10)", text: "#5F702D", dot: "#778A3B" },
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
    pending:   { bg: "rgba(201,138,40,0.22)", text: "#F0CB8C", dot: "#F0CB8C" },
    completed: { bg: "rgba(63,107,58,0.26)",  text: "#86EFAC", dot: "#86EFAC" },
    cancelled: { bg: "rgba(199,72,72,0.22)",  text: "#FCA5A5", dot: "#FCA5A5" },
    confirmed: { bg: "rgba(119,138,59,0.22)", text: "#D4EDAA", dot: "#D4EDAA" },
    expired:   { bg: "rgba(161,161,170,0.14)",text: "#A1A1AA", dot: "#A1A1AA" },
    admin:     { bg: "rgba(119,138,59,0.20)", text: "#D4EDAA", dot: "#D4EDAA" },
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

function ExpTypeBadge({ type }) {
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
      const res = await generalExpensesService.create({
        type: form.type,
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
        ...(form.expenseDate && { expenseDate: form.expenseDate }),
        ...(form.note.trim() && { note: form.note.trim() }),
      });
      const expense = res.data?.data?.expense ?? res.data?.expense;
      const by = expense?.disbursedBy ?? expense?.enteredBy;
      setAddOpen(false);
      setForm(emptyForm);
      setFErr({});
      showToast(by?.name ? `تمت إضافة المصروف بنجاح — سُجّلت باسم: ${by.name}` : "تمت إضافة المصروف بنجاح");
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
                  <th style={thSt}>أدخلها</th>
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
                    <td style={{ ...tdSt, color: t.textSec, fontSize: 12 }}>{row.disbursedBy?.name ?? row.enteredBy?.name ?? "—"}</td>
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

// ─── EMPLOYEE COMPONENTS (moved from AdminPro) ───────────────────────────────

function Badge({s,t}){const m={"نشط":t.completed,"غير نشط":t.expired,"مدير":t.admin,"موظف إداري":t.confirmed,"محاسب":t.pending,"مدرب":{bg:"#FFF7ED",text:"#C2410C",dot:"#F97316"},"موقوف":t.cancelled,"فعّال":t.completed};const c=m[s]||t.expired;return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:c.bg,color:c.text,padding:"2px 9px",borderRadius:20,fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}><span style={{width:6,height:6,borderRadius:"50%",background:c.dot,flexShrink:0}}/>{s}</span>;}

const STATUS_LABEL={ACTIVE:"نشط",BLOCKED:"موقوف",ARCHIVED:"مؤرشف"};
const EMP_EXP_TYPES=[{v:"SALARY",lbl:"راتب شهري"},{v:"BONUS",lbl:"مكافأة"},{v:"OTHER",lbl:"سلفة / مصروف آخر"}];
const EMP_EXP_LABEL={SALARY:"راتب شهري",BONUS:"مكافأة",OTHER:"سلفة / مصروف آخر"};
const EMP_PAY_LABEL={CASH:"نقداً",SHAM_CASH:"شام كاش"};
const _eToday=todayStr;
const _eYM=currentYearMonth;
const _eFom=firstOfMonthStr;
const fmtM=n=>(n!=null&&n!=="")?(Number(n).toLocaleString("en")):"—";
const empFldSt=(t,err)=>({width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${err?"#c74848":t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",outline:"none"});
const empActionBtnStyle=(bg,color,border)=>({display:"inline-flex",alignItems:"center",gap:4,padding:"4px 11px",borderRadius:8,background:bg,color,border:border||"none",fontSize:12,fontWeight:600,fontFamily:"inherit",cursor:"pointer",whiteSpace:"nowrap"});

function AddEmployeeModal({t,onClose,onSuccess}){
  const [form,setForm]=useState({name:"",phone:"",password:"",role:"",monthlySalary:"",hireDate:""});
  const [submitting,setSubmitting]=useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const [errors,setErrors]=useState({});
  const [serverError,setServerError]=useState("");
  const set=(field,value)=>{setForm(prev=>({...prev,[field]:value}));setErrors(prev=>({...prev,[field]:undefined}));};
  const validate=()=>{const e={};if(!form.name.trim())e.name="الاسم مطلوب";if(!form.phone.trim())e.phone="رقم الهاتف مطلوب";else if(!/^09\d{8}$/.test(form.phone.trim()))e.phone="رقم هاتف غير صالح";if(!form.password)e.password="كلمة المرور مطلوبة";else if(form.password.length<4)e.password="٤ أحرف على الأقل";if(!form.role)e.role="يجب اختيار الدور";if(!form.monthlySalary&&form.monthlySalary!==0)e.monthlySalary="الراتب الشهري مطلوب";else if(isNaN(Number(form.monthlySalary)))e.monthlySalary="يجب أن يكون رقم";else if(Number(form.monthlySalary)<=0)e.monthlySalary="يجب أن يكون أكبر من صفر";return e;};
  const handleSubmit=async(e)=>{e.preventDefault();setServerError("");const v=validate();setErrors(v);if(Object.keys(v).length)return;const payload={name:form.name.trim(),phone:form.phone.trim(),password:form.password,role:form.role,monthlySalary:Number(form.monthlySalary),hireDate:form.hireDate||new Date().toISOString().split("T")[0]};setSubmitting(true);try{const response=await employeesService.create(payload);const body=response.data?.data||response.data;const hasError=body?.error||body?.statusCode>=400;const errorMsg=body?.message;if(hasError){setServerError(Array.isArray(errorMsg)?errorMsg.join("، "):errorMsg||"فشل حفظ الموظف في قاعدة البيانات");return;}onSuccess();}catch(err){const data=err.response?.data?.data||err.response?.data;const msg=data?.message||err.response?.data?.message||err.message;setServerError(Array.isArray(msg)?msg.join("، "):msg||"حدث خطأ أثناء الإضافة");}finally{setSubmitting(false);}};
  const fieldStyle=(field)=>({width:"100%",padding:"10px 12px",borderRadius:9,border:`1.5px solid ${errors[field]?"#c74848":t.border}`,background:t.bgElevated,color:t.text,fontSize:13,fontFamily:"inherit",boxSizing:"border-box",outline:"none"});
  const chipStyle=(value)=>({flex:1,padding:"10px 8px",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,textAlign:"center",background:form.role===value?"#778a3b":t.bgElevated,color:form.role===value?"#fff":t.textSec,outline:form.role===value?"none":`1.5px solid ${errors.role?"#c74848":t.border}`});
  return(
    <Modal title="إضافة موظف جديد" onClose={onClose} t={t} width={480}>
      {serverError&&<div style={{background:"rgba(199,72,72,0.1)",border:"1px solid rgba(199,72,72,0.3)",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#c74848"}}>{serverError}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          <div><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>الاسم الكامل</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="محمد أحمد..." style={fieldStyle("name")}/>{errors.name&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{errors.name}</div>}</div>
          <div><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>رقم الهاتف</label><input value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="0991234567" dir="ltr" style={{...fieldStyle("phone"),textAlign:"left"}}/>{errors.phone&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{errors.phone}</div>}</div>
          <div><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>كلمة المرور</label><div style={{position:"relative"}}><input type={showPassword?"text":"password"} value={form.password} onChange={e=>set("password",e.target.value)} placeholder="كلمة مرور الحساب" style={{...fieldStyle("password"),paddingLeft:36}}/><button type="button" onClick={()=>setShowPassword(v=>!v)} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:t.textMuted,display:"flex",alignItems:"center",padding:0,fontSize:16}}>{showPassword?<LuEyeOff/>:<LuEye/>}</button></div>{errors.password&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{errors.password}</div>}</div>
          <div><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>الراتب الشهري</label><input type="number" value={form.monthlySalary} onChange={e=>set("monthlySalary",e.target.value)} placeholder="100000" dir="ltr" style={{...fieldStyle("monthlySalary"),textAlign:"left"}}/>{errors.monthlySalary&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{errors.monthlySalary}</div>}</div>
        </div>
        <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:6}}>تاريخ التعيين (اختياري)</label><input type="date" value={form.hireDate} onChange={e=>set("hireDate",e.target.value)} style={{...fieldStyle("hireDate"),width:"100%"}}/></div>
        <div style={{marginBottom:16}}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:6}}>الدور الوظيفي</label><div style={{display:"flex",gap:8}}><button type="button" onClick={()=>set("role","RECEPTIONIST")} style={chipStyle("RECEPTIONIST")}>موظف إداري</button><button type="button" onClick={()=>set("role","ACCOUNTANT")} style={chipStyle("ACCOUNTANT")}>محاسب</button></div>{errors.role&&<div style={{fontSize:11,color:"#c74848",marginTop:4}}>{errors.role}</div>}</div>
        <div style={{display:"flex",gap:8}}><button type="submit" disabled={submitting} style={{flex:1,padding:"11px",borderRadius:10,border:"none",cursor:submitting?"not-allowed":"pointer",background:submitting?t.textMuted:t.grad,color:"#fff",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>{submitting?"جارٍ الحفظ...":"إنشاء الحساب"}</button><Btn label="إلغاء" onClick={onClose} t={t} v="ghost"/></div>
      </form>
    </Modal>
  );
}

function IssueExpenseModal({t,employee,onClose,onSuccess}){
  const empId=employee.employeeId;
  const empName=employee.user?.name||employee.name||"الموظف";
  const [form,setForm]=useState({type:"SALARY",month:_eYM(),amount:"",paymentMethod:"CASH",expenseDate:_eToday(),note:""});
  const [errors,setErrors]=useState({});
  const [submitting,setSubmitting]=useState(false);
  const [serverError,setServerError]=useState("");
  const set=(k,v)=>{setForm(p=>({...p,[k]:v}));setErrors(p=>({...p,[k]:undefined}));};
  const validate=()=>{const e={};if(!form.type)e.type="النوع مطلوب";if(form.type==="SALARY"&&!form.month)e.month="الشهر مطلوب";if((form.type==="BONUS"||form.type==="OTHER")&&(!form.amount||isNaN(Number(form.amount))||Number(form.amount)<=0))e.amount="المبلغ مطلوب وأكبر من صفر";return e;};
  const handleSubmit=async()=>{setServerError("");const v=validate();setErrors(v);if(Object.keys(v).length)return;const payload={type:form.type,paymentMethod:form.paymentMethod};if(form.type==="SALARY"){payload.month=form.month;}else{payload.amount=Number(form.amount);}if(form.expenseDate)payload.expenseDate=form.expenseDate;if(form.note.trim())payload.note=form.note.trim();setSubmitting(true);try{await employeeAccountingService.issueExpense(empId,payload);onSuccess();}catch(err){const msg=err.response?.data?.message||err.message||"حدث خطأ";setServerError(Array.isArray(msg)?msg.join("، "):msg);}finally{setSubmitting(false);};};
  return(
    <Modal title={`إصدار فاتورة — ${empName}`} onClose={()=>{if(!submitting)onClose();}} t={t} width={460}>
      {serverError&&<div style={{background:"rgba(199,72,72,0.1)",border:"1px solid rgba(199,72,72,0.3)",borderRadius:9,padding:"9px 14px",marginBottom:12,fontSize:13,color:"#c74848"}}>{serverError}</div>}
      <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:6}}>نوع الصرف <span style={{color:"#c74848"}}>*</span></label><div style={{display:"flex",gap:6}}>{EMP_EXP_TYPES.map(x=>(<button key={x.v} type="button" onClick={()=>set("type",x.v)} style={{flex:1,padding:"8px 6px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:form.type===x.v?t.grad:t.bgElevated,color:form.type===x.v?"#fff":t.textSec,outline:form.type===x.v?"none":`1.5px solid ${t.border}`,transition:"all 0.15s"}}>{x.lbl}</button>))}</div>{errors.type&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{errors.type}</div>}</div>
      {form.type==="SALARY"&&(<><div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>الشهر <span style={{color:"#c74848"}}>*</span></label><input type="month" value={form.month} onChange={e=>set("month",e.target.value)} style={empFldSt(t,errors.month)}/>{errors.month&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{errors.month}</div>}</div>{employee.monthlySalary&&(<div style={{padding:"9px 14px",borderRadius:9,background:t.accentLight,color:t.accentText,fontSize:13,fontWeight:600,marginBottom:12}}>سيُصرف الراتب المسجل: <strong>{fmtM(employee.monthlySalary)} ل.س</strong></div>)}</>)}
      {(form.type==="BONUS"||form.type==="OTHER")&&(<div style={{marginBottom:12}}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>المبلغ (ل.س) <span style={{color:"#c74848"}}>*</span></label><input type="number" min="1" value={form.amount} onChange={e=>set("amount",e.target.value)} placeholder="50000" dir="ltr" style={{...empFldSt(t,errors.amount),textAlign:"left"}}/>{errors.amount&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{errors.amount}</div>}</div>)}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}><div><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>طريقة الدفع</label><select value={form.paymentMethod} onChange={e=>set("paymentMethod",e.target.value)} style={{...empFldSt(t,false),appearance:"auto"}}><option value="CASH">نقداً</option><option value="SHAM_CASH">شام كاش</option></select></div><div><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>تاريخ الصرف</label><input type="date" value={form.expenseDate} onChange={e=>set("expenseDate",e.target.value)} style={empFldSt(t,false)}/></div></div>
      <div style={{marginBottom:14}}><label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>ملاحظات (اختياري)</label><input value={form.note} onChange={e=>set("note",e.target.value)} placeholder="عيدية / الراتب الشهري..." style={empFldSt(t,false)}/></div>
      <div style={{display:"flex",gap:8}}><button onClick={handleSubmit} disabled={submitting} style={{flex:1,padding:"11px",borderRadius:10,border:"none",cursor:submitting?"not-allowed":"pointer",background:submitting?t.textMuted:t.grad,color:"#fff",fontSize:14,fontWeight:700,fontFamily:"inherit",transition:"background 0.15s"}}>{submitting?"جارٍ الإصدار...":"إصدار الفاتورة"}</button><Btn label="إلغاء" onClick={()=>{if(!submitting)onClose();}} t={t} v="ghost"/></div>
    </Modal>
  );
}

function EmployeeStatementModal({t,employee,onClose}){
  const empId=employee.employeeId;
  const empName=employee.user?.name||employee.name||"الموظف";
  const [rows,setRows]=useState([]);
  const [empInfo,setEmpInfo]=useState(null);
  const [totals,setTotals]=useState(null);
  const [meta,setMeta]=useState(null);
  const [loading,setLoading]=useState(true);
  const [pg,setPg]=useState(1);
  const [fType,setFType]=useState("");
  const [fFrom,setFFrom]=useState("");
  const [fTo,setFTo]=useState("");
  const [delTarget,setDelTarget]=useState(null);
  const [deleting,setDeleting]=useState(false);
  const [notice,setNotice]=useState(null);
  const [refreshKey,setRefreshKey]=useState(0);
  const showNotice=(msg,err=false)=>{setNotice({msg,err});setTimeout(()=>setNotice(null),3000);};
  useEffect(()=>{let cancelled=false;(async()=>{setLoading(true);try{const params={page:pg,limit:10};if(fType)params.type=fType;if(fFrom)params.from=fFrom;if(fTo)params.to=fTo;const res=await employeeAccountingService.getExpenses(empId,params);const body=res.data?.data??res.data;if(!cancelled){setEmpInfo(body?.employee||null);setRows(Array.isArray(body?.data)?body.data:[]);setTotals(body?.totals||null);setMeta(body?.meta||null);}}catch(err){if(!cancelled)showNotice(err.response?.data?.message||"فشل تحميل الكشف",true);}finally{if(!cancelled)setLoading(false);}})();return()=>{cancelled=true;};},[empId,pg,fType,fFrom,fTo,refreshKey]);
  const handleDelete=async()=>{if(!delTarget||deleting)return;setDeleting(true);try{await employeeAccountingService.deleteExpense(empId,delTarget.expenseId);setRows(prev=>prev.filter(r=>r.expenseId!==delTarget.expenseId));setDelTarget(null);showNotice("تم حذف السجل بنجاح");setRefreshKey(k=>k+1);}catch(err){showNotice(err.response?.data?.message||"فشل الحذف",true);}finally{setDeleting(false);};};
  const thS={padding:"9px 12px",fontSize:11,fontWeight:700,color:t.textSec,textAlign:"right",background:t.bgElevated,borderBottom:`1px solid ${t.border}`,whiteSpace:"nowrap"};
  const tdS={padding:"10px 12px",fontSize:12,color:t.text,borderBottom:`1px solid ${t.border}`,verticalAlign:"middle"};
  const selSt={padding:"7px 10px",borderRadius:8,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:12,fontFamily:"inherit",outline:"none"};
  return(
    <Modal title={`كشف فواتير — ${empName}`} onClose={onClose} t={t} width={740}>
      {notice&&<div style={{padding:"8px 14px",borderRadius:8,background:notice.err?"rgba(199,72,72,0.1)":"rgba(63,107,58,0.1)",border:`1px solid ${notice.err?"rgba(199,72,72,0.3)":"rgba(63,107,58,0.3)"}`,fontSize:12,color:notice.err?"#c74848":"#3F6B3A",marginBottom:12}}>{notice.msg}</div>}
      <div style={{display:"flex",gap:16,flexWrap:"wrap",padding:"10px 14px",borderRadius:9,background:t.bgElevated,marginBottom:14}}><span style={{fontSize:13,color:t.text}}><span style={{color:t.textMuted,fontSize:11}}>الموظف: </span><strong>{empInfo?.name||empName}</strong></span>{empInfo?.monthlySalary&&(<span style={{fontSize:13,color:t.text}}><span style={{color:t.textMuted,fontSize:11}}>الراتب الشهري: </span><strong style={{color:t.accent}}>{fmtM(empInfo.monthlySalary)} ل.س</strong></span>)}</div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}><input type="date" value={fFrom} onChange={e=>{setFFrom(e.target.value);setPg(1);}} style={selSt} title="من تاريخ"/><input type="date" value={fTo} onChange={e=>{setFTo(e.target.value);setPg(1);}} style={selSt} title="إلى تاريخ"/><select value={fType} onChange={e=>{setFType(e.target.value);setPg(1);}} style={selSt}><option value="">كل الأنواع</option>{EMP_EXP_TYPES.map(x=><option key={x.v} value={x.v}>{x.lbl}</option>)}</select>{(fFrom||fTo||fType)&&<Btn label="مسح" onClick={()=>{setFFrom("");setFTo("");setFType("");setPg(1);}} t={t} v="ghost" sz="sm"/>}</div>
      {loading?(<div style={{textAlign:"center",padding:"28px",color:t.textMuted,fontSize:13}}>جارٍ التحميل...</div>):rows.length===0?(<div style={{textAlign:"center",padding:"28px",color:t.textMuted,fontSize:13}}>لا توجد سجلات بهذه المعايير</div>):(<div style={{overflowX:"auto",borderRadius:9,border:`1px solid ${t.border}`,marginBottom:12}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["#","النوع","المبلغ","طريقة الدفع","الشهر","التاريخ","ملاحظات","حذف"].map((h,i)=>(<th key={i} style={{...thS,...(i===7&&{textAlign:"center"})}}>{h}</th>))}</tr></thead><tbody>{rows.map(row=>(<tr key={row.expenseId} onMouseEnter={e=>e.currentTarget.style.background=t.bgElevated} onMouseLeave={e=>e.currentTarget.style.background=""}><td style={{...tdS,color:t.textMuted,fontSize:10}}>{row.expenseId}</td><td style={tdS}><span style={{padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:600,background:t.accentLight,color:t.accentText}}>{EMP_EXP_LABEL[row.type]||row.type}</span></td><td style={{...tdS,fontWeight:700,color:t.accent}}>{fmtM(row.amount)} ل.س</td><td style={tdS}>{EMP_PAY_LABEL[row.paymentMethod]||row.paymentMethod||"—"}</td><td style={{...tdS,color:t.textSec}}>{row.month||"—"}</td><td style={{...tdS,color:t.textSec}}>{row.expenseDate||row.paidAt?.split("T")[0]||"—"}</td><td style={{...tdS,color:t.textMuted,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.note||"—"}</td><td style={{...tdS,textAlign:"center"}}><button onClick={()=>setDelTarget(row)} style={{background:"none",border:"none",cursor:"pointer",color:"#C74848",padding:"3px 5px",borderRadius:6,display:"inline-flex",alignItems:"center"}}><FiTrash2 size={14}/></button></td></tr>))}</tbody></table></div>)}
      {totals&&(<div style={{display:"flex",gap:14,flexWrap:"wrap",padding:"9px 14px",borderRadius:9,background:t.bgElevated,marginBottom:12,fontSize:13}}><span style={{fontWeight:700,color:t.text}}>الإجمالي: <span style={{color:t.accent}}>{fmtM(totals.totalAmount)} ل.س</span></span><span style={{color:t.textSec}}>نقداً: <strong>{fmtM(totals.totalCash)}</strong></span><span style={{color:t.textSec}}>شام كاش: <strong>{fmtM(totals.totalShamCash)}</strong></span></div>)}
      {meta&&meta.totalPages>1&&(<div style={{display:"flex",gap:6,alignItems:"center",justifyContent:"center",marginBottom:8}}><button onClick={()=>setPg(p=>Math.max(1,p-1))} disabled={pg===1} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${t.border}`,background:"transparent",color:pg===1?t.textMuted:t.text,cursor:pg===1?"default":"pointer",fontSize:12,fontFamily:"inherit"}}>السابق</button><span style={{fontSize:12,color:t.textSec}}>صفحة {pg} من {meta.totalPages}</span><button onClick={()=>setPg(p=>Math.min(meta.totalPages,p+1))} disabled={pg===meta.totalPages} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${t.border}`,background:"transparent",color:pg===meta.totalPages?t.textMuted:t.text,cursor:pg===meta.totalPages?"default":"pointer",fontSize:12,fontFamily:"inherit"}}>التالي</button></div>)}
      {delTarget&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1100}} onClick={()=>{if(!deleting)setDelTarget(null);}}><div onClick={e=>e.stopPropagation()} style={{background:t.bgSurface,borderRadius:14,padding:"24px 20px",maxWidth:340,width:"90%",boxShadow:t.shadowLg}}><div style={{textAlign:"center",marginBottom:4,color:"#C74848",display:"flex",justifyContent:"center"}}><FiTrash2 size={32}/></div><div style={{fontSize:15,fontWeight:700,color:t.text,marginBottom:8,textAlign:"center"}}>تأكيد الحذف</div><div style={{fontSize:13,color:t.textSec,marginBottom:14,textAlign:"center",lineHeight:1.6}}><strong>{EMP_EXP_LABEL[delTarget.type]||delTarget.type}</strong><br/>{fmtM(delTarget.amount)} ل.س{delTarget.note&&<><br/><span style={{fontSize:12,color:t.textMuted}}>{delTarget.note}</span></>}</div><div style={{padding:"8px 12px",borderRadius:8,background:"#FFF1F2",fontSize:11,color:"#9F1239",textAlign:"center",marginBottom:14}}>هذا الإجراء لا يمكن التراجع عنه</div><div style={{display:"flex",gap:8}}><button onClick={handleDelete} disabled={deleting} style={{flex:1,padding:"9px",borderRadius:9,border:"none",cursor:deleting?"not-allowed":"pointer",background:deleting?t.textMuted:"#9F1239",color:"#fff",fontSize:13,fontWeight:700,fontFamily:"inherit"}}>{deleting?"جارٍ الحذف...":"تأكيد الحذف"}</button><Btn label="إلغاء" onClick={()=>{if(!deleting)setDelTarget(null);}} t={t} v="ghost"/></div></div></div>)}
    </Modal>
  );
}

function EditEmployeeModal({t,employee,onClose,onSuccess}){
  const empId=employee.employeeId;
  const empName=employee.user?.name||employee.name||"الموظف";
  const [form,setForm]=useState({
    monthlySalary: employee.monthlySalary!=null?String(employee.monthlySalary):"",
    hireDate: employee.hireDate||"",
    resignDate: employee.resignDate||"",
  });
  const [errors,setErrors]=useState({});
  const [submitting,setSubmitting]=useState(false);
  const [serverError,setServerError]=useState("");
  const set=(k,v)=>{setForm(p=>({...p,[k]:v}));setErrors(p=>({...p,[k]:undefined}));};
  const validate=()=>{const e={};if(form.monthlySalary!==""&&(isNaN(Number(form.monthlySalary))||Number(form.monthlySalary)<=0))e.monthlySalary="يجب أن يكون رقماً أكبر من صفر";return e;};
  const handleSubmit=async(ev)=>{
    ev.preventDefault();setServerError("");
    const v=validate();setErrors(v);if(Object.keys(v).length)return;
    const payload={};
    if(form.monthlySalary!=="")payload.monthlySalary=Number(form.monthlySalary);
    if(form.hireDate)payload.hireDate=form.hireDate;
    if(form.resignDate)payload.resignDate=form.resignDate;
    setSubmitting(true);
    try{
      await employeesService.update(empId,payload);
      onSuccess();
    }catch(err){
      const msg=err.response?.data?.message||err.message||"حدث خطأ أثناء تعديل بيانات الموظف";
      setServerError(Array.isArray(msg)?msg.join("، "):msg);
    }finally{
      setSubmitting(false);
    }
  };
  return(
    <Modal title={`تعديل بيانات — ${empName}`} onClose={()=>{if(!submitting)onClose();}} t={t} width={420}>
      {serverError&&<div style={{background:"rgba(199,72,72,0.1)",border:"1px solid rgba(199,72,72,0.3)",borderRadius:9,padding:"9px 14px",marginBottom:12,fontSize:13,color:"#c74848"}}>{serverError}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>الراتب الشهري</label>
          <input type="number" min="1" value={form.monthlySalary} onChange={e=>set("monthlySalary",e.target.value)} placeholder="100000" dir="ltr" style={{...empFldSt(t,errors.monthlySalary),textAlign:"left"}}/>
          {errors.monthlySalary&&<div style={{fontSize:11,color:"#c74848",marginTop:3}}>{errors.monthlySalary}</div>}
        </div>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>تاريخ التعيين</label>
          <input type="date" value={form.hireDate} onChange={e=>set("hireDate",e.target.value)} style={empFldSt(t,false)}/>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:11,fontWeight:600,color:t.textSec,display:"block",marginBottom:4}}>تاريخ الاستقالة (اختياري)</label>
          <input type="date" value={form.resignDate} onChange={e=>set("resignDate",e.target.value)} style={empFldSt(t,false)}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button type="submit" disabled={submitting} style={{flex:1,padding:"11px",borderRadius:10,border:"none",cursor:submitting?"not-allowed":"pointer",background:submitting?t.textMuted:t.grad,color:"#fff",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>{submitting?"جارٍ الحفظ...":"حفظ التعديلات"}</button>
          <Btn label="إلغاء" onClick={()=>{if(!submitting)onClose();}} t={t} v="ghost"/>
        </div>
      </form>
    </Modal>
  );
}

function ArchiveEmployeeConfirm({t,employee,onClose,onSuccess}){
  const empId=employee.employeeId;
  const empName=employee.user?.name||employee.name||"الموظف";
  const isArchived=(employee.user?.accountStatus||employee.accountStatus)==="ARCHIVED";
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState("");
  const handleConfirm=async()=>{
    setError("");setSubmitting(true);
    try{
      await employeesService.archive(empId,!isArchived);
      onSuccess();
    }catch(err){
      const msg=err.response?.data?.message||err.message||`حدث خطأ أثناء ${isArchived?"إلغاء أرشفة":"أرشفة"} الموظف`;
      setError(Array.isArray(msg)?msg.join("، "):msg);
    }finally{
      setSubmitting(false);
    }
  };
  return(
    <Modal title={isArchived?"إلغاء أرشفة الموظف":"أرشفة الموظف"} onClose={()=>{if(!submitting)onClose();}} t={t} width={400}>
      <div style={{padding:"10px 12px",borderRadius:9,background:t.cancelled.bg,marginBottom:14,fontSize:13,color:t.cancelled.text}}>
        {isArchived
          ? `هل أنت متأكد من إلغاء أرشفة الموظف ${empName}؟ سيعود الحساب نشطاً.`
          : `هل أنت متأكد من أرشفة الموظف ${empName}؟ لن يستطيع الدخول إلى النظام.`}
      </div>
      {error&&<div style={{background:"rgba(199,72,72,0.1)",border:"1px solid rgba(199,72,72,0.3)",borderRadius:9,padding:"9px 14px",marginBottom:14,fontSize:13,color:"#c74848"}}>{error}</div>}
      <div style={{display:"flex",gap:8}}>
        <button onClick={handleConfirm} disabled={submitting} style={{flex:1,padding:"11px",borderRadius:10,border:"none",cursor:submitting?"not-allowed":"pointer",background:submitting?t.textMuted:"#c74848",color:"#fff",fontSize:14,fontWeight:700,fontFamily:"inherit"}}>{submitting?"جارٍ التنفيذ...":(isArchived?"تأكيد إلغاء الأرشفة":"تأكيد الأرشفة")}</button>
        <Btn label="إلغاء" onClick={()=>{if(!submitting)onClose();}} t={t} v="ghost"/>
      </div>
    </Modal>
  );
}

function PgEmployees({t}){
  const {hasPermission}=useAuth();
  const canCreate=hasPermission(P.EMPLOYEES_CREATE);
  const canUpdate=hasPermission(P.EMPLOYEES_UPDATE);
  const canArchive=hasPermission(P.EMPLOYEES_ARCHIVE);
  const canManageRoles=hasPermission(P.ROLES_MANAGE);
  const [employees,setEmployees]=useState([]);
  const [loading,setLoading]=useState(true);
  const [addModal,setAddModal]=useState(false);
  const [issueModal,setIssueModal]=useState(null);
  const [statementModal,setStatementModal]=useState(null);
  const [editEmployee,setEditEmployee]=useState(null);
  const [archiveTarget,setArchiveTarget]=useState(null);
  const [roleUpdating,setRoleUpdating]=useState(null);
  const [summary,setSummary]=useState(null);
  const [sumLoading,setSumLoading]=useState(true);
  const [toast,setToast]=useState(null);
  const [empRefresh,setEmpRefresh]=useState(0);
  const showToast=(msg,err=false)=>{setToast({msg,err});setTimeout(()=>setToast(null),3500);};
  useEffect(()=>{let cancelled=false;(async()=>{setLoading(true);try{const response=await employeesService.getAll();const body=response.data?.data||response.data;if(!cancelled)setEmployees(Array.isArray(body)?body:[]);}catch{if(!cancelled)setEmployees([]);}finally{if(!cancelled)setLoading(false);}})();return()=>{cancelled=true;};},[empRefresh]);
  useEffect(()=>{let cancelled=false;(async()=>{setSumLoading(true);try{const res=await employeeAccountingService.getSummary({from:_eFom(),to:_eToday()});const body=res.data?.data??res.data;if(!cancelled)setSummary(body);}catch{/* silent */}finally{if(!cancelled)setSumLoading(false);}})();return()=>{cancelled=true;};},[empRefresh]);
  const mapStatus=(emp)=>{const s=emp.user?.accountStatus||emp.accountStatus||"ACTIVE";return STATUS_LABEL[s.toUpperCase()]||s;};
  const isArchived=(emp)=>(emp.user?.accountStatus||emp.accountStatus)==="ARCHIVED";
  const handleRoleChange=async(emp,newRole)=>{
    if(!newRole||newRole===emp.role||roleUpdating)return;
    setRoleUpdating(emp.employeeId);
    try{
      await employeesService.updateRole(emp.employeeId,newRole);
      showToast("تم تغيير دور الموظف بنجاح");
      setEmpRefresh(k=>k+1);
    }catch(err){
      const msg=err.response?.data?.message||err.message||"حدث خطأ أثناء تغيير الدور";
      showToast(Array.isArray(msg)?msg.join("، "):msg,true);
    }finally{
      setRoleUpdating(null);
    }
  };
  const sumTypes=summary?.byType||{};
  return(
    <div style={{padding:"20px 24px",overflowY:"auto",flex:1,position:"relative"}}>
      {toast&&<div style={{position:"fixed",top:22,left:"50%",transform:"translateX(-50%)",zIndex:3000,background:toast.err?"#9F1239":"#3F6B3A",color:"#fff",padding:"11px 26px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:"0 8px 28px rgba(0,0,0,0.22)",whiteSpace:"nowrap",pointerEvents:"none"}}>{toast.msg}</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div><div style={{fontSize:20,fontWeight:700,color:t.text}}>الموظفون والمستخدمون</div><div style={{fontSize:13,color:t.textSec,marginTop:2}}>{loading?"جارٍ التحميل...":`${employees.length} موظف مسجل`}</div></div>
        {canCreate&&<Btn label="+ إضافة موظف" onClick={()=>setAddModal(true)} t={t}/>}
      </div>
      {!sumLoading&&summary&&(
        <div style={{marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:t.textMuted,marginBottom:8,paddingRight:4,borderRight:`3px solid ${t.accent}`}}>إحصائيات مالية الموظفين — الشهر الحالي</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
            {[{lbl:"إجمالي المصروف",val:summary.totalAmount,clr:t.accent,sub:`${summary.totalCount||0} عملية`},{lbl:"نقداً",val:summary.cash,clr:"#374151",sub:""},{lbl:"شام كاش",val:summary.shamCash,clr:"#7C3AED",sub:""},{lbl:"رواتب",val:Number(sumTypes.salary?.total||0),clr:"#059669",sub:`${sumTypes.salary?.count||0} صرفة`},{lbl:"مكافآت وأخرى",val:Number(sumTypes.bonus?.total||0)+Number(sumTypes.other?.total||0),clr:"#D97706",sub:""}].map(c=>(
              <div key={c.lbl} style={{background:t.bgSurface,borderRadius:10,border:`1px solid ${t.borderCard}`,padding:"11px 13px",boxShadow:t.shadow}}><div style={{fontSize:15,fontWeight:700,color:c.clr,lineHeight:1,marginBottom:3}}>{fmtM(c.val)} <span style={{fontSize:10,fontWeight:500}}>ل.س</span></div><div style={{fontSize:11,fontWeight:600,color:t.text}}>{c.lbl}</div>{c.sub&&<div style={{fontSize:10,color:t.textMuted,marginTop:2}}>{c.sub}</div>}</div>
            ))}
          </div>
        </div>
      )}
      {loading?(<div style={{padding:40,textAlign:"center",color:t.textMuted,fontSize:14}}>جارٍ تحميل بيانات الموظفين...</div>):employees.length===0?(<div style={{padding:40,textAlign:"center",color:t.textMuted,fontSize:14}}>لا يوجد موظفون مسجلون بعد</div>):(
        <div style={{borderRadius:11,border:`1px solid ${t.border}`,overflowX:"auto",overflowY:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{background:t.bgElevated}}>{["الاسم","رقم الهاتف","الدور","الحالة","الراتب","تاريخ التعيين","الإجراءات"].map((h,i)=>(<th key={i} style={{padding:"10px 14px",textAlign:"right",color:t.textMuted,fontWeight:600,fontSize:11,borderBottom:`1px solid ${t.border}`,whiteSpace:"nowrap",...(i===6&&{minWidth:320,textAlign:"center"})}}>{h}</th>))}</tr></thead>
            <tbody>{employees.map((emp,i)=>{const status=mapStatus(emp);const archived=isArchived(emp);return(<tr key={emp.employeeId??emp.id??i} style={{background:i%2===0?t.bgSurface:t.bgElevated,borderBottom:`1px solid ${t.border}`}}><td style={{padding:"11px 14px",fontWeight:600,color:t.text}}>{emp.user?.name||emp.name||"—"}</td><td style={{padding:"11px 14px",color:t.textSec,fontSize:12,direction:"ltr",textAlign:"right"}}>{emp.user?.phone||emp.phone||"—"}</td><td style={{padding:"11px 14px"}}>{canManageRoles?<select value={emp.role||""} disabled={roleUpdating===emp.employeeId} onChange={e=>handleRoleChange(emp,e.target.value)} style={{padding:"5px 8px",borderRadius:7,border:`1px solid ${t.border}`,background:t.bgElevated,color:t.text,fontSize:11,fontFamily:"inherit",cursor:roleUpdating===emp.employeeId?"not-allowed":"pointer"}}><option value="RECEPTIONIST">موظف إداري</option><option value="ACCOUNTANT">محاسب</option></select>:<span style={{fontSize:12,color:t.textSec}}>{emp.role==="RECEPTIONIST"?"موظف إداري":emp.role==="ACCOUNTANT"?"محاسب":"—"}</span>}</td><td style={{padding:"11px 14px"}}><Badge s={status} t={t}/></td><td style={{padding:"11px 14px",color:t.textSec,fontSize:12}}>{emp.monthlySalary?`${Number(emp.monthlySalary).toLocaleString("en")} ل.س`:"—"}</td><td style={{padding:"11px 14px",color:t.textMuted,fontSize:12}}>{emp.hireDate||"—"}</td><td style={{padding:"8px 14px"}}><div style={{display:"flex",flexWrap:"nowrap",alignItems:"center",justifyContent:"center",gap:6}}><button onClick={()=>setIssueModal(emp)} style={empActionBtnStyle(t.grad,"#fff")}><LuBanknote size={12}/>صرف دفعة</button><button onClick={()=>setStatementModal(emp)} style={empActionBtnStyle(t.accentLight,t.accentText)}><LuFileText size={12}/>كشف الحساب</button>{canUpdate&&<button onClick={()=>setEditEmployee(emp)} style={empActionBtnStyle(t.accentLight,t.accentText)}><LuPencil size={12}/>تعديل</button>}{canArchive&&<button onClick={()=>setArchiveTarget(emp)} style={empActionBtnStyle(archived?t.confirmed.bg:"#FEF2F2",archived?t.confirmed.text:"#DC2626",archived?"none":"1px solid #FECACA")}>{archived?<LuLockOpen size={12}/>:<LuBan size={12}/>}{archived?"إلغاء الأرشفة":"أرشفة"}</button>}</div></td></tr>);})}</tbody>
          </table>
        </div>
      )}
      {addModal&&<AddEmployeeModal t={t} onClose={()=>setAddModal(false)} onSuccess={()=>{setAddModal(false);setEmpRefresh(k=>k+1);}}/>}
      {issueModal&&<IssueExpenseModal t={t} employee={issueModal} onClose={()=>setIssueModal(null)} onSuccess={()=>{setIssueModal(null);setEmpRefresh(k=>k+1);showToast("تم إصدار الفاتورة بنجاح");}}/>}
      {statementModal&&<EmployeeStatementModal t={t} employee={statementModal} onClose={()=>setStatementModal(null)}/>}
      {editEmployee&&<EditEmployeeModal t={t} employee={editEmployee} onClose={()=>setEditEmployee(null)} onSuccess={()=>{setEditEmployee(null);setEmpRefresh(k=>k+1);showToast("تم تعديل بيانات الموظف بنجاح");}}/>}
      {archiveTarget&&<ArchiveEmployeeConfirm t={t} employee={archiveTarget} onClose={()=>setArchiveTarget(null)} onSuccess={()=>{const wasArchived=isArchived(archiveTarget);setArchiveTarget(null);setEmpRefresh(k=>k+1);showToast(wasArchived?"تم إلغاء أرشفة الموظف بنجاح":"تم أرشفة الموظف بنجاح");}}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const ACCOUNTANT_TABS = [
  { id: "general-expenses", label: "المصاريف العامة" },
  { id: "employees",        label: "الموظفون" },
];

export default function AccountantPro({ embedded = false, darkMode, page: forcedPage }) {
  const [localDark, setLocalDark]     = useState(false);
  const [internalPage, setInternalPage] = useState("general-expenses");
  const dark = (embedded && typeof darkMode !== "undefined") ? darkMode : localDark;
  const t    = T[dark ? "dark" : "light"];
  // When embedded, the parent (MainLayout topbar) drives the active tab via forcedPage
  const activePage = forcedPage ?? internalPage;

  return (
    <div dir="rtl" style={{ display: "flex", height: embedded ? "100%" : "100vh", overflow: "hidden", background: t.bgApp, fontFamily: "var(--font-body)" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Standalone topbar with inline tab switcher */}
        {!embedded && (
          <div style={{ height: 50, background: t.bgSurface, borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", padding: "0 18px", gap: 6, flexShrink: 0, boxShadow: t.shadow }}>
            {ACCOUNTANT_TABS.map(tab => (
              <button key={tab.id} onClick={() => setInternalPage(tab.id)} style={{
                padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                background: activePage === tab.id ? t.grad : "transparent",
                color: activePage === tab.id ? "#fff" : t.textMuted,
                fontWeight: activePage === tab.id ? 700 : 600, fontSize: 13, fontFamily: "inherit",
              }}>{tab.label}</button>
            ))}
            <div style={{ flex: 1 }} />
            <button onClick={() => setLocalDark(d => !d)} style={{ padding: "5px 13px", borderRadius: 7, background: t.accentLight, color: t.accentText, border: "none", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
              {dark ? "☀️ نهاري" : "🌙 ليلي"}
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {activePage === "general-expenses" && <PgGeneralExpenses t={t} />}
          {activePage === "employees"        && <PgEmployees t={t} />}
        </div>
      </div>
    </div>
  );
}
