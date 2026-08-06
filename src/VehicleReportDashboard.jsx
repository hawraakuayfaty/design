import { useState, useEffect, useMemo } from "react";
import { todayStr, currentYearMonth } from "./utils/dateUtils";
import { vehiclesService } from "./api";
import { useAuth } from "./contexts/useAuth";
import { P } from "./constants/roles";
import { Badge, StatCard } from "./components/ui";
import { LuX } from "react-icons/lu";
import {
  TbArrowRight, TbTool, TbGasStation, TbShieldCheck, TbDroplet, TbAlertTriangle,
  TbDotsCircleHorizontal, TbPrinter, TbPlus, TbChevronRight, TbChevronLeft,
  TbFilter, TbReceipt, TbReportMoney, TbCoins, TbWallet, TbCalendarStats,
  TbCar, TbId, TbClipboardList,
} from "react-icons/tb";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

// ═══════════════════════════════════════════════
// LOCAL CONSTANTS & MAPS
// ═══════════════════════════════════════════════
// status is only ever ACTIVE | ARCHIVED — "في الصيانة" is derived separately from
// inMaintenanceNow (GET /vehicles/:id), never from this map (see vehicles-api.md §1)
const VEHICLE_STATUS_LABELS = { ACTIVE: "متاحة", ARCHIVED: "غير متاحة" };
const VEHICLE_TYPE_LABELS = { MANUAL: "عادي", AUTOMATIC: "أوتوماتيك" };

const DAY_LABELS_AR = { SAT: "سبت", SUN: "أحد", MON: "اثنين", TUE: "ثلاثاء", WED: "أربعاء", THU: "خميس", FRI: "جمعة" };

const ARABIC_MONTHS_SHORT = ["ينا", "فبر", "مار", "أبر", "ماي", "يون", "يول", "أغس", "سبت", "أكت", "نوف", "ديس"];

// six-slot categorical order, validated CVD-safe (protan/deutan/tritan) against both
// the app's light (#ffffff) and dark (#27272a) card surfaces — see dataviz skill validator
const EXPENSE_REASON_META = {
  MAINTENANCE: { label: "صيانة", Icon: TbTool, colorLight: "#2a78d6", colorDark: "#3987e5" },
  GAS: { label: "وقود", Icon: TbGasStation, colorLight: "#008300", colorDark: "#008300" },
  INSURANCE: { label: "تأمين", Icon: TbShieldCheck, colorLight: "#e87ba4", colorDark: "#d55181" },
  WASH: { label: "غسيل", Icon: TbDroplet, colorLight: "#eda100", colorDark: "#c98500" },
  FINE: { label: "مخالفة", Icon: TbAlertTriangle, colorLight: "#1baf7a", colorDark: "#199e70" },
  OTHER: { label: "أخرى", Icon: TbDotsCircleHorizontal, colorLight: "#eb6834", colorDark: "#d95926" },
};

const REASON_FORM_OPTIONS = Object.entries(EXPENSE_REASON_META).map(([value, meta]) => ({ value, label: meta.label }));
const REASON_OPTIONS = [{ value: "", label: "كل البنود" }, ...REASON_FORM_OPTIONS];

const PAYMENT_METHOD_LABELS = { CASH: "نقداً", SHAM_CASH: "شام كاش" };
const PAYMENT_METHOD_OPTIONS = [
  { value: "", label: "كل طرق الدفع" },
  { value: "CASH", label: "نقداً" },
  { value: "SHAM_CASH", label: "شام كاش" },
];
const PAYMENT_METHOD_FORM_OPTIONS = [["CASH", "نقداً"], ["SHAM_CASH", "شام كاش"]];

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function formatMoney(v) {
  if (v == null || v === "") return "—";
  const n = Number(v);
  // "en" هنا يضبط شكل الأرقام (١٬٢٣٤ → 1,234) فقط — النص المحيط "ل.س" يبقى عربياً
  return isNaN(n) ? String(v) : `${n.toLocaleString("en")} ل.س`;
}

function formatDateOnly(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("ar", { day: "numeric", month: "long", year: "numeric", numberingSystem: "latn" }).format(d);
}

function formatShortDate(dateStr) {
  if (!dateStr) return "—";
  const [, m, d] = String(dateStr).split("-");
  return d && m ? `${Number(d)}/${Number(m)}` : dateStr;
}

function formatMonthLabel(monthStr) {
  if (!monthStr) return "—";
  const [y, m] = monthStr.split("-");
  const idx = Number(m) - 1;
  return ARABIC_MONTHS_SHORT[idx] ? `${ARABIC_MONTHS_SHORT[idx]} ${y}` : monthStr;
}

const currentMonthStr = currentYearMonth;
const currentDateStr  = todayStr;

function isDarkTheme(t) {
  return t.bgSurface === "#27272a";
}

function reasonColor(reason, dark) {
  const meta = EXPENSE_REASON_META[reason];
  if (!meta) return "#9aa08c";
  return dark ? meta.colorDark : meta.colorLight;
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ═══════════════════════════════════════════════
// STYLE HELPERS
// ═══════════════════════════════════════════════
function cardStyle(t) {
  const shadow = isDarkTheme(t) ? "0 18px 40px rgba(2,8,23,0.3)" : "0 18px 24px rgba(15,23,42,0.08)";
  return { background: t.bgSurface, borderRadius: 18, border: `1px solid ${t.borderCard}`, padding: 18, boxShadow: shadow, height: "100%" };
}

function cardTitleStyle(t) {
  return { display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 14 };
}

function emptyStateStyle(t) {
  return { padding: 32, textAlign: "center", color: t.textMuted, fontSize: 13 };
}

function filterInputStyle(t) {
  return { padding: "8px 12px", borderRadius: 8, border: `0.5px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 12 };
}

function secondaryBtnStyle(t) {
  return {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10,
    background: t.bgElevated, color: t.text, border: `1px solid ${t.border}`, fontSize: 13, fontWeight: 700, cursor: "pointer",
  };
}

function pageBtnStyle(t, disabled) {
  return {
    width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.border}`,
    background: t.bgElevated, color: disabled ? t.textMuted : t.text,
    display: "grid", placeItems: "center", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
  };
}

const primaryBtnStyle = {
  display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10,
  background: "#778a3b", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer",
};

// ═══════════════════════════════════════════════
// SMALL SHARED PIECES
// ═══════════════════════════════════════════════
function InfoRow({ k, v, t, last }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: last ? "none" : `1px solid ${t.border}`, fontSize: 13 }}>
      <span style={{ color: t.textMuted }}>{k}</span>
      <span style={{ fontWeight: 600, color: t.text }}>{v}</span>
    </div>
  );
}

function ChartTooltip({ active, payload, label, t, valueFormatter }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: t.bgSurface, border: `1px solid ${t.borderCard}`, borderRadius: 10,
      padding: "8px 12px", boxShadow: "0 12px 28px rgba(0,0,0,0.16)", fontSize: 12, minWidth: 110,
    }}>
      {label != null && <div style={{ color: t.textMuted, marginBottom: 4, fontWeight: 700 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: t.text, fontWeight: 700 }}>
          <span style={{ width: 8, height: 2, borderRadius: 2, background: p.color || p.stroke || p.fill, display: "inline-block" }} />
          <span>{valueFormatter ? valueFormatter(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

function WeeksGrid({ weeks, t }) {
  const max = Math.max(1, ...weeks.map((w) => w.count || 0));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {weeks.map((w) => (
        <div key={w.week} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 60, fontSize: 12, fontWeight: 700, color: t.textSec, flexShrink: 0 }}>الأسبوع {w.week}</div>
          <div style={{ flex: 1, height: 10, borderRadius: 6, background: t.bgElevated, overflow: "hidden" }}>
            <div style={{
              width: `${Math.round(((w.count || 0) / max) * 100)}%`, height: "100%",
              background: t.accent, borderRadius: 6, transition: "width 0.3s",
            }} />
          </div>
          <div style={{ width: 22, fontSize: 13, fontWeight: 800, color: t.text, textAlign: "left" }}>{w.count ?? 0}</div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// ADD EXPENSE MODAL
// ═══════════════════════════════════════════════
function AddExpenseModal({ t, vehicleId, onClose, onSuccess }) {
  const [form, setForm] = useState({ reason: "", amount: "", expenseDate: currentDateStr(), paymentMethod: "CASH", liters: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.reason) e.reason = "البند مطلوب";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "المبلغ مطلوب";
    if (!form.expenseDate) e.expenseDate = "التاريخ مطلوب";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      await vehiclesService.addExpense(vehicleId, {
        reason: form.reason,
        amount: Number(form.amount),
        expenseDate: form.expenseDate,
        paymentMethod: form.paymentMethod,
        // liters is rejected by the backend for any reason other than GAS
        ...(form.reason === "GAS" && form.liters !== "" ? { liters: Number(form.liters) } : {}),
        note: form.note.trim() || null,
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء إضافة المصروف");
    } finally {
      setSubmitting(false);
    }
  };

  const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 };
  const fieldStyle = (field) => ({
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 14,
    outline: "none", transition: "border-color 0.2s",
  });

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 460,
        border: `1px solid ${t.borderCard}`, boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>إضافة مصروف مركبة</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1 }}><LuX /></button>
        </div>

        {serverError && (
          <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#c74848" }}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>البند</label>
            <select value={form.reason} onChange={(ev) => { setForm({ ...form, reason: ev.target.value }); setErrors({ ...errors, reason: undefined }); }} style={fieldStyle("reason")}>
              <option value="">اختر البند</option>
              {REASON_FORM_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            {errors.reason && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.reason}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>المبلغ (ل.س)</label>
            <input type="number" step="0.01" dir="ltr" value={form.amount}
              onChange={(ev) => { setForm({ ...form, amount: ev.target.value }); setErrors({ ...errors, amount: undefined }); }}
              placeholder="مثال: 1000" style={{ ...fieldStyle("amount"), textAlign: "left" }} />
            {errors.amount && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.amount}</div>}
          </div>

          {form.reason === "GAS" && (
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>عدد اللترات (اختياري)</label>
              <input type="number" step="0.01" dir="ltr" value={form.liters}
                onChange={(ev) => setForm({ ...form, liters: ev.target.value })}
                placeholder="مثال: 30" style={{ ...fieldStyle("liters"), textAlign: "left" }} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>تاريخ المصروف</label>
            <input type="date" dir="ltr" value={form.expenseDate}
              onChange={(ev) => setForm({ ...form, expenseDate: ev.target.value })}
              style={{ ...fieldStyle("expenseDate"), textAlign: "left" }} />
            {errors.expenseDate && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.expenseDate}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>طريقة الدفع</label>
            <div style={{ display: "flex", gap: 8 }}>
              {PAYMENT_METHOD_FORM_OPTIONS.map(([value, label]) => (
                <button key={value} type="button" onClick={() => setForm({ ...form, paymentMethod: value })} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 600, textAlign: "center",
                  background: form.paymentMethod === value ? "#778a3b" : t.bgElevated,
                  color: form.paymentMethod === value ? "#fff" : t.textSec,
                  outline: form.paymentMethod === value ? "none" : `1.5px solid ${t.border}`,
                }}>{label}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>ملاحظات (اختياري)</label>
            <textarea rows={3} value={form.note} onChange={(ev) => setForm({ ...form, note: ev.target.value })}
              placeholder="ملاحظة عن المصروف" style={{ ...fieldStyle("note"), resize: "none" }} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: "12px", borderRadius: 12, background: submitting ? t.textMuted : "#778a3b",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
            }}>{submitting ? "جارٍ الحفظ..." : "حفظ المصروف"}</button>
            <button type="button" onClick={onClose} style={{
              padding: "12px 20px", borderRadius: 12, background: t.bgElevated, color: t.textSec,
              border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// DELETE EXPENSE CONFIRM MODAL
// ═══════════════════════════════════════════════
function DeleteExpenseModal({ t, vehicleId, expense, onClose, onSuccess }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setBusy(true);
    setError("");
    try {
      await vehiclesService.deleteExpense(vehicleId, expense.expenseId);
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء حذف المصروف");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "28px 24px", width: "100%", maxWidth: 400,
        border: `1px solid ${t.borderCard}`, boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
      }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: t.text }}>حذف المصروف</h3>

        <div style={{ background: t.cancelled.bg, border: `0.5px solid ${t.cancelled.text}40`, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: t.cancelled.text, marginBottom: 16 }}>
          هل أنت متأكد من حذف مصروف "{EXPENSE_REASON_META[expense.reason]?.label || expense.reason}" بمبلغ {formatMoney(expense.amount)}؟ لا يمكن التراجع عن هذا الإجراء.
        </div>

        {error && (
          <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#c74848" }}>{error}</div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleDelete} disabled={busy} style={{
            flex: 1, padding: "11px", borderRadius: 12, background: busy ? t.textMuted : "#c74848",
            color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer",
          }}>{busy ? "جارٍ الحذف..." : "تأكيد الحذف"}</button>
          <button type="button" onClick={onClose} disabled={busy} style={{
            padding: "11px 20px", borderRadius: 12, background: t.bgElevated, color: t.textSec,
            border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600, cursor: busy ? "not-allowed" : "pointer",
          }}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════
export default function VehicleReportDashboard({ t, vehicleId, onBack }) {
  const { hasPermission } = useAuth();
  const canAddExpense = hasPermission(P.EXPENSES_CREATE);
  const canDeleteExpense = hasPermission(P.EXPENSES_DELETE);
  const dark = isDarkTheme(t);

  const [month, setMonth] = useState(currentMonthStr());
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [inMaintenanceNow, setInMaintenanceNow] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [expensesTotals, setExpensesTotals] = useState({ totalAmount: 0, totalCash: 0, totalShamCash: 0 });
  const [expensesMeta, setExpensesMeta] = useState({ total: 0, page: 1, limit: 11, totalPages: 0 });
  const [expensesLoading, setExpensesLoading] = useState(true);

  const [filterReason, setFilterReason] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setReportLoading(true);
      try {
        const { data } = await vehiclesService.getReport(vehicleId, { month });
        if (!cancelled) setReport(data?.data ?? data);
      } catch {
        if (!cancelled) setReport(null);
      } finally {
        if (!cancelled) setReportLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [vehicleId, month, refreshKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await vehiclesService.getById(vehicleId);
        const payload = data?.data ?? data;
        if (!cancelled) setInMaintenanceNow(!!payload?.inMaintenanceNow);
      } catch {
        if (!cancelled) setInMaintenanceNow(false);
      }
    })();
    return () => { cancelled = true; };
  }, [vehicleId, refreshKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setExpensesLoading(true);
      try {
        const params = { page, limit: 11 };
        if (filterReason) params.reason = filterReason;
        if (filterPaymentMethod) params.paymentMethod = filterPaymentMethod;
        if (filterFrom) params.from = filterFrom;
        if (filterTo) params.to = filterTo;
        const { data } = await vehiclesService.getExpenses(vehicleId, params);
        const payload = data?.data ?? data;
        if (!cancelled) {
          setExpenses(payload?.data || []);
          setExpensesTotals(payload?.totals || { totalAmount: 0, totalCash: 0, totalShamCash: 0 });
          setExpensesMeta(payload?.meta || { total: 0, page: 1, limit: 11, totalPages: 0 });
        }
      } catch {
        if (!cancelled) {
          setExpenses([]);
          setExpensesTotals({ totalAmount: 0, totalCash: 0, totalShamCash: 0 });
          setExpensesMeta({ total: 0, page: 1, limit: 11, totalPages: 0 });
        }
      } finally {
        if (!cancelled) setExpensesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [vehicleId, filterReason, filterPaymentMethod, filterFrom, filterTo, page, refreshKey]);

  const vehicle = report?.vehicle || {};

  const fuelChartData = useMemo(() => {
    const list = report?.recentFuel || [];
    return [...list].sort((a, b) => new Date(a.date) - new Date(b.date)).map((f) => ({ label: formatShortDate(f.date), amount: f.amount, liters: f.liters }));
  }, [report]);

  const maintenanceData = useMemo(
    () => (report?.maintenanceByMonth || []).map((m) => ({ label: formatMonthLabel(m.month), amount: m.total })),
    [report]
  );

  const currentWeekData = useMemo(
    () => (report?.sessions?.currentWeek?.byDay || []).map((d) => ({ label: DAY_LABELS_AR[d.day] || d.day, count: d.count })),
    [report]
  );

  const weeksData = report?.sessions?.byWeekOfMonth || [];

  const maintenanceThisMonth = report?.expenses?.byReason?.find((r) => r.reason === "MAINTENANCE")?.total ?? 0;

  const reasonBreakdown = useMemo(() => {
    const list = (report?.expenses?.byReason || []).filter((r) => r.total > 0);
    const total = list.reduce((sum, r) => sum + (r.total || 0), 0);
    if (!total) return [];
    return list.map((r) => ({ ...r, pct: Math.round((r.total / total) * 1000) / 10 }));
  }, [report]);

  const clearFilters = () => {
    setFilterReason(""); setFilterPaymentMethod(""); setFilterFrom(""); setFilterTo(""); setPage(1);
  };

  const handleExport = () => {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;

    const rows = expenses.map((e) => `
      <tr>
        <td>${e.expenseId}</td>
        <td>${escapeHtml(e.expenseDate)}</td>
        <td>${escapeHtml(EXPENSE_REASON_META[e.reason]?.label || e.reason)}</td>
        <td>${escapeHtml(formatMoney(e.amount))}</td>
        <td>${escapeHtml(PAYMENT_METHOD_LABELS[e.paymentMethod] || e.paymentMethod)}</td>
        <td>${escapeHtml(e.note || "—")}</td>
      </tr>`).join("");

    const html = `<!doctype html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8" />
<title>كشف حساب — ${escapeHtml(vehicle.plateNumber || "")}</title>
<style>
  body { font-family: Tahoma, Arial, sans-serif; padding: 28px; color: #1c1f18; }
  h2 { margin: 0 0 4px; }
  .meta { color: #5a6150; font-size: 13px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { border: 1px solid #d9ddd0; padding: 8px 10px; text-align: right; }
  th { background: #f4f5f0; }
  tfoot td { font-weight: bold; background: #eef0e6; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <h2>كشف حساب مركبة — ${escapeHtml(vehicle.plateNumber || "—")}</h2>
  <div class="meta">
    الموديل: ${escapeHtml(vehicle.model || "—")}
    ${filterFrom || filterTo ? ` — الفترة: ${escapeHtml(filterFrom || "البداية")} إلى ${escapeHtml(filterTo || "اليوم")}` : ""}
  </div>
  <table>
    <thead><tr><th>#</th><th>التاريخ</th><th>البند</th><th>المبلغ</th><th>طريقة الدفع</th><th>ملاحظات</th></tr></thead>
    <tbody>${rows || `<tr><td colspan="6" style="text-align:center;color:#796c2c;">لا توجد بيانات</td></tr>`}</tbody>
    <tfoot>
      <tr><td colspan="3">الإجمالي</td><td>${escapeHtml(formatMoney(expensesTotals.totalAmount))}</td><td colspan="2">نقداً: ${escapeHtml(formatMoney(expensesTotals.totalCash))} — شام كاش: ${escapeHtml(formatMoney(expensesTotals.totalShamCash))}</td></tr>
    </tfoot>
  </table>
</body>
</html>`;

    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 300);
  };

  return (
    <div>
      <button onClick={onBack} style={{
        display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none",
        color: t.accentText, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, marginBottom: 14,
      }}>
        <TbArrowRight size={16} /> رجوع لتقارير المركبات
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: t.accentGradientSoft, color: t.accent, display: "grid", placeItems: "center", fontSize: 20 }}>
              <TbCar />
            </div>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: t.text }}>تقرير أداء المركبة الفردية</h2>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: t.textSec }}>
            المركبة: {vehicle.model || "—"} — رقم اللوحة: {vehicle.plateNumber || "—"}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted }}>الشهر</label>
          <input type="month" value={month} onChange={(ev) => setMonth(ev.target.value)} style={{
            padding: "9px 12px", borderRadius: 10, border: `1px solid ${t.border}`,
            background: t.bgSurface, color: t.text, fontSize: 13, fontWeight: 600, colorScheme: dark ? "dark" : "light",
          }} />
        </div>
      </div>

      {actionMessage && (
        <div style={{ background: t.completed.bg, border: `0.5px solid ${t.completed.text}30`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: t.completed.text }}>{actionMessage}</span>
          <button onClick={() => setActionMessage("")} style={{ background: "none", border: "none", cursor: "pointer", color: t.completed.text, lineHeight: 1 }}><LuX size={14} /></button>
        </div>
      )}

      {reportLoading && !report ? (
        <div style={{ padding: 60, textAlign: "center", color: t.textMuted, fontSize: 14 }}>جارٍ تحميل تقرير المركبة...</div>
      ) : !report ? (
        <div style={{ padding: 60, textAlign: "center", color: t.textMuted, fontSize: 14 }}>تعذر تحميل تقرير المركبة، حاول لاحقاً</div>
      ) : (
        <div className="dashboard-stack" style={{ opacity: reportLoading ? 0.6 : 1, transition: "opacity 0.2s" }}>

          <div className="dashboard-stats-grid">
            <StatCard label="إجمالي مصاريف الشهر" value={formatMoney(report.expenses?.monthTotal)} color={t.accent} icon={<TbReportMoney size={22} />} t={t} />
            <StatCard label="نقداً" value={formatMoney(report.expenses?.byPaymentMethod?.cash)} color={t.completed.text} icon={<TbCoins size={22} />} t={t} />
            <StatCard label="شام كاش" value={formatMoney(report.expenses?.byPaymentMethod?.shamCash)} color={t.confirmed.text} icon={<TbWallet size={22} />} t={t} />
            <StatCard label="جلسات الأسبوع الحالي" value={String(report.sessions?.currentWeek?.total ?? 0)} color={t.accent} icon={<TbCalendarStats size={22} />} t={t} />
          </div>

          <div className="vrd-top-grid">
            <div style={cardStyle(t)}>
              <div style={cardTitleStyle(t)}><TbId size={16} /> مواصفات وحالة المركبة</div>
              <InfoRow t={t} k="الطراز" v={vehicle.model || "—"} />
              <InfoRow t={t} k="رقم اللوحة" v={vehicle.plateNumber || "—"} />
              <InfoRow t={t} k="النوع" v={VEHICLE_TYPE_LABELS[vehicle.type] || vehicle.type || "—"} />
              <InfoRow t={t} k="اللون" v={vehicle.color || "—"} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${t.border}`, fontSize: 13 }}>
                <span style={{ color: t.textMuted }}>الحالة</span>
                <Badge status={
                  vehicle.status === "ARCHIVED"
                    ? VEHICLE_STATUS_LABELS.ARCHIVED
                    : inMaintenanceNow
                      ? "في الصيانة"
                      : (VEHICLE_STATUS_LABELS[vehicle.status] || vehicle.status || "—")
                } t={t} />
              </div>
              <InfoRow t={t} k="تاريخ الإضافة" v={formatDateOnly(vehicle.createdAt)} last />
            </div>

            <div style={cardStyle(t)}>
              <div style={cardTitleStyle(t)}><TbGasStation size={16} /> سجل الوقود الأخير</div>
              {!fuelChartData.length ? (
                <div style={emptyStateStyle(t)}>لا توجد تعبئات وقود مسجلة</div>
              ) : (
                <>
                  <div style={{ height: 160 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={fuelChartData} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke={t.border} />
                        <XAxis dataKey="label" tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={{ stroke: t.border }} tickLine={false} />
                        <YAxis tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                        <Tooltip content={<ChartTooltip t={t} valueFormatter={(v) => formatMoney(v)} />} />
                        <Area type="monotone" dataKey="amount" name="المبلغ" stroke={t.accent} strokeWidth={2}
                          fill={t.accent} fillOpacity={0.12} dot={{ r: 4, fill: t.accent, stroke: t.bgSurface, strokeWidth: 2 }} activeDot={{ r: 5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ marginTop: 12, maxHeight: 130, overflowY: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          {["التاريخ", "اللترات", "المبلغ"].map((h) => (
                            <th key={h} style={{ textAlign: "right", color: t.textMuted, fontWeight: 600, padding: "4px 6px", borderBottom: `1px solid ${t.border}` }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(report.recentFuel || []).map((f, i) => (
                          <tr key={i}>
                            <td style={{ padding: "5px 6px", color: t.text, borderBottom: `1px solid ${t.border}` }}>{formatShortDate(f.date)}</td>
                            <td style={{ padding: "5px 6px", color: t.text, borderBottom: `1px solid ${t.border}` }}>{f.liters ?? "—"}</td>
                            <td style={{ padding: "5px 6px", color: t.text, borderBottom: `1px solid ${t.border}`, fontWeight: 700 }}>{formatMoney(f.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            <div style={cardStyle(t)}>
              <div style={cardTitleStyle(t)}><TbTool size={16} /> تكاليف الصيانة الشهرية</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: t.text, marginBottom: 4 }}>{formatMoney(maintenanceThisMonth)}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 14 }}>إجمالي تكاليف الصيانة لهذا الشهر</div>
              {!maintenanceData.length ? (
                <div style={emptyStateStyle(t)}>لا توجد تكاليف صيانة مسجلة</div>
              ) : (
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={maintenanceData} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke={t.border} />
                      <XAxis dataKey="label" tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={{ stroke: t.border }} tickLine={false} />
                      <YAxis tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                      <Tooltip content={<ChartTooltip t={t} valueFormatter={(v) => formatMoney(v)} />} cursor={{ fill: t.bgElevated }} />
                      <Bar dataKey="amount" name="التكلفة" fill={t.accent} radius={[4, 4, 0, 0]} maxBarSize={26} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          <div className="vrd-sessions-grid">
            <div style={cardStyle(t)}>
              <div style={cardTitleStyle(t)}><TbCalendarStats size={16} /> جلسات الأسبوع الحالي</div>
              {!currentWeekData.length ? (
                <div style={emptyStateStyle(t)}>لا توجد جلسات هذا الأسبوع</div>
              ) : (
                <div style={{ height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentWeekData} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke={t.border} />
                      <XAxis dataKey="label" tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={{ stroke: t.border }} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
                      <Tooltip content={<ChartTooltip t={t} valueFormatter={(v) => `${v} جلسة`} />} cursor={{ fill: t.bgElevated }} />
                      <Bar dataKey="count" name="الجلسات" fill={t.accent} radius={[4, 4, 0, 0]} maxBarSize={26} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              <div style={{ marginTop: 10, fontSize: 12, color: t.textMuted, textAlign: "center" }}>
                إجمالي الأسبوع: {report.sessions?.currentWeek?.total ?? 0} جلسة
                {report.sessions?.currentWeek?.start && ` (${formatShortDate(report.sessions.currentWeek.start)} – ${formatShortDate(report.sessions.currentWeek.end)})`}
              </div>
            </div>

            <div style={cardStyle(t)}>
              <div style={cardTitleStyle(t)}><TbClipboardList size={16} /> جلسات الشهر</div>
              {!weeksData.length ? (
                <div style={emptyStateStyle(t)}>لا توجد بيانات لهذا الشهر</div>
              ) : (
                <WeeksGrid weeks={weeksData} t={t} />
              )}
              <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 10, background: t.accentLight, fontSize: 13, fontWeight: 700, color: t.accentText, textAlign: "center" }}>
                إجمالي الشهر: {report.sessions?.monthTotal ?? 0} جلسة
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle(t), height: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: t.text, display: "flex", alignItems: "center", gap: 8 }}>
                  <TbReceipt size={18} /> كشف مالي تفصيلي للمركبة — قسم المحاسبة
                </div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>
                  {expensesLoading ? "جارٍ التحميل..." : `${expensesMeta.total} حركة مالية`}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={handleExport} style={secondaryBtnStyle(t)}><TbPrinter size={15} /> تصدير كشف الحساب</button>
                {canAddExpense && (
                  <button onClick={() => setShowAddModal(true)} style={primaryBtnStyle}><TbPlus size={15} /> إضافة مصروف</button>
                )}
              </div>
            </div>

            {reasonBreakdown.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.textMuted, marginBottom: 8 }}>توزيع المصاريف حسب البند (هذا الشهر)</div>
                <div style={{ display: "flex", height: 10, borderRadius: 6, overflow: "hidden", background: t.bgElevated }}>
                  {reasonBreakdown.map((r, i) => (
                    <div key={r.reason} title={`${EXPENSE_REASON_META[r.reason]?.label || r.reason}: ${formatMoney(r.total)}`} style={{
                      width: `${r.pct}%`, background: reasonColor(r.reason, dark),
                      marginInlineEnd: i < reasonBreakdown.length - 1 ? 2 : 0,
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
                  {reasonBreakdown.map((r) => (
                    <div key={r.reason} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textSec }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: reasonColor(r.reason, dark), display: "inline-block" }} />
                      {EXPENSE_REASON_META[r.reason]?.label || r.reason}
                      <span style={{ fontWeight: 700, color: t.text }}>{formatMoney(r.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="vrd-filter-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: t.textMuted, fontSize: 12, fontWeight: 700 }}>
                <TbFilter size={14} /> تصفية:
              </div>
              <select value={filterReason} onChange={(ev) => { setFilterReason(ev.target.value); setPage(1); }} style={filterInputStyle(t)}>
                {REASON_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select value={filterPaymentMethod} onChange={(ev) => { setFilterPaymentMethod(ev.target.value); setPage(1); }} style={filterInputStyle(t)}>
                {PAYMENT_METHOD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <input type="date" value={filterFrom} title="من تاريخ" onChange={(ev) => { setFilterFrom(ev.target.value); setPage(1); }} style={{ ...filterInputStyle(t), colorScheme: dark ? "dark" : "light" }} />
              <span style={{ color: t.textMuted, fontSize: 12 }}>إلى</span>
              <input type="date" value={filterTo} title="إلى تاريخ" onChange={(ev) => { setFilterTo(ev.target.value); setPage(1); }} style={{ ...filterInputStyle(t), colorScheme: dark ? "dark" : "light" }} />
              {(filterReason || filterPaymentMethod || filterFrom || filterTo) && (
                <button onClick={clearFilters} style={{ background: "none", border: "none", color: t.cancelled.text, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>مسح الفلاتر</button>
              )}
            </div>

            <div className="vrd-ledger-table-wrap" style={{ marginTop: 14 }}>
              {expensesLoading ? (
                <div style={emptyStateStyle(t)}>جارٍ تحميل المصاريف...</div>
              ) : expenses.length === 0 ? (
                <div style={emptyStateStyle(t)}>لا توجد مصاريف مطابقة لهذه الفلاتر</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 640 }}>
                  <thead>
                    <tr style={{ background: t.bgElevated }}>
                      {["#", "التاريخ", "البند", "المبلغ", "طريقة الدفع", "ملاحظات", ...(canDeleteExpense ? ["إجراءات"] : [])].map((h) => (
                        <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: t.textMuted, fontWeight: 600, fontSize: 12, borderBottom: `0.5px solid ${t.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((e, i) => {
                      const meta = EXPENSE_REASON_META[e.reason];
                      const ReasonIcon = meta?.Icon;
                      return (
                        <tr key={e.expenseId} style={{ background: i % 2 === 0 ? t.bgSurface : t.bgPage, borderBottom: `0.5px solid ${t.border}` }}>
                          <td style={{ padding: "10px 12px", color: t.textMuted }}>{e.expenseId}</td>
                          <td style={{ padding: "10px 12px", color: t.text }}>{e.expenseDate}</td>
                          <td style={{ padding: "10px 12px", color: t.text }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: reasonColor(e.reason, dark), flexShrink: 0 }} />
                              {ReasonIcon && <ReasonIcon size={14} color={t.textSec} />}
                              {meta?.label || e.reason}
                            </span>
                          </td>
                          <td style={{ padding: "10px 12px", color: t.text, fontWeight: 700 }}>{formatMoney(e.amount)}</td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                              background: e.paymentMethod === "CASH" ? t.completed.bg : t.confirmed.bg,
                              color: e.paymentMethod === "CASH" ? t.completed.text : t.confirmed.text,
                            }}>{PAYMENT_METHOD_LABELS[e.paymentMethod] || e.paymentMethod}</span>
                          </td>
                          <td style={{ padding: "10px 12px", color: t.textSec }}>{e.note || "—"}</td>
                          {canDeleteExpense && (
                            <td style={{ padding: "10px 12px" }}>
                              <button onClick={() => setDeleteTarget(e)} style={{
                                padding: "4px 10px", borderRadius: 6, background: t.cancelled.bg,
                                color: t.cancelled.text, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
                              }}>حذف</button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: t.accentLight }}>
                      <td colSpan={3} style={{ padding: "10px 12px", fontWeight: 800, color: t.accentText, fontSize: 13 }}>الإجمالي</td>
                      <td style={{ padding: "10px 12px", fontWeight: 800, color: t.accentText, fontSize: 13 }}>{formatMoney(expensesTotals.totalAmount)}</td>
                      <td colSpan={2} style={{ padding: "10px 12px", fontWeight: 700, color: t.accentText, fontSize: 12 }}>
                        نقداً: {formatMoney(expensesTotals.totalCash)} · شام كاش: {formatMoney(expensesTotals.totalShamCash)}
                      </td>
                      {canDeleteExpense && <td />}
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>

            {expensesMeta.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
                <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={pageBtnStyle(t, page <= 1)}>
                  <TbChevronRight size={16} />
                </button>
                <span style={{ fontSize: 13, color: t.textSec, fontWeight: 600 }}>صفحة {expensesMeta.page} من {expensesMeta.totalPages}</span>
                <button disabled={page >= expensesMeta.totalPages} onClick={() => setPage((p) => Math.min(expensesMeta.totalPages, p + 1))} style={pageBtnStyle(t, page >= expensesMeta.totalPages)}>
                  <TbChevronLeft size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <AddExpenseModal
          t={t}
          vehicleId={vehicleId}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setActionMessage("تم إضافة المصروف بنجاح");
            setPage(1);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteExpenseModal
          t={t}
          vehicleId={vehicleId}
          expense={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onSuccess={() => {
            setDeleteTarget(null);
            setActionMessage("تم حذف المصروف بنجاح");
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
