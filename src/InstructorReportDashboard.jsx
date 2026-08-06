import { useState, useEffect, useMemo } from "react";
import { instructorsService } from "./api";
import { useAuth } from "./contexts/useAuth";
import { P } from "./constants/roles";
import { Badge, StatCard, SectionHeader } from "./components/ui";
import { LuX, LuEye } from "react-icons/lu";
import {
  TbArrowRight, TbUser, TbReceipt, TbPlus, TbChevronRight, TbChevronLeft,
  TbHourglass, TbCoin, TbCircleCheck, TbCircleX, TbGift, TbCalendarWeek,
  TbArrowBackUp, TbTrash,
} from "react-icons/tb";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

// ═══════════════════════════════════════════════
// LOCAL CONSTANTS & MAPS
// ═══════════════════════════════════════════════
const GENDER_MAP = { MALE: "ذكر", FEMALE: "أنثى" };
const GENDER_FILTER_OPTIONS = [
  { value: "", label: "كل الجنسيات" },
  { value: "MALE", label: "ذكر" },
  { value: "FEMALE", label: "أنثى" },
];

const INSTRUCTOR_TYPE_MAP = { MANUAL: "عادي", AUTOMATIC: "أوتوماتيك", BOTH: "عادي + أوتوماتيك" };
const INSTRUCTOR_TYPE_FILTER_OPTIONS = [
  { value: "", label: "كل الأنواع" },
  { value: "MANUAL", label: "عادي" },
  { value: "AUTOMATIC", label: "أوتوماتيك" },
  { value: "BOTH", label: "كلاهما" },
];

const VEHICLE_SOURCE_LABELS = { SCHOOL_CAR: "سيارة المدرسة", STUDENT_CAR: "سيارة الطالب" };

const PAYMENT_METHOD_LABELS = { CASH: "نقداً", SHAM_CASH: "شام كاش" };
const PAYMENT_METHOD_FORM_OPTIONS = [["CASH", "نقداً"], ["SHAM_CASH", "شام كاش"]];

const INVOICE_TYPE_LABELS = { LESSONS: "دروس", BONUS: "مكافأة" };

const LEAVE_STATUS_DETAIL = { FULL_DAY_LEAVE: "إجازة يوم كامل", PARTIAL_LEAVE: "إجازة جزئية" };

// statusBreakdown من راوت التقرير #18 — مقتصرة على COMPLETED/NO_SHOW/CANCELLED (بدون EXPIRED)
const STATUS_SEGMENTS = [
  { key: "completed", pctKey: "completedPct", label: "مكتملة", tone: "completed" },
  { key: "noShow", pctKey: "noShowPct", label: "لم يحضر", tone: "noshow" },
  { key: "cancelled", pctKey: "cancelledPct", label: "ملغاة", tone: "cancelled" },
];

const ARABIC_MONTHS_FULL = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function formatMoney(v) {
  if (v == null || v === "") return "—";
  const n = Number(v);
  // en-US هنا يضبط شكل الأرقام (١٬٢٣٤ → 1,234) فقط — النص المحيط "ل.س" يبقى عربياً
  return isNaN(n) ? String(v) : `${n.toLocaleString("en-US")} ل.س`;
}

// تنسيق 24 ساعة صريح (hour12: false) — يمنع أي التباس AM/PM في وقت الصرف
function formatDateTime24(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const datePart = new Intl.DateTimeFormat("ar", { day: "numeric", month: "short", year: "numeric", numberingSystem: "latn" }).format(d);
  const timePart = new Intl.DateTimeFormat("ar", { hour: "2-digit", minute: "2-digit", hour12: false, numberingSystem: "latn" }).format(d);
  return `${datePart} — ${timePart}`;
}

function formatTime24(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("ar", { hour: "2-digit", minute: "2-digit", hour12: false, numberingSystem: "latn" }).format(d);
}

function formatMonthLabel(monthStr) {
  if (!monthStr) return "—";
  const [y, m] = monthStr.split("-");
  const idx = Number(m) - 1;
  return ARABIC_MONTHS_FULL[idx] ? `${ARABIC_MONTHS_FULL[idx]} ${y}` : monthStr;
}

function currentMonthStr() {
  return new Date().toISOString().slice(0, 7);
}

function currentDateStr() {
  return new Date().toISOString().slice(0, 10);
}

function firstDayOfMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function isDarkTheme(t) {
  return t.bgSurface === "#27272a";
}

// leaveStatus (من GET .../profile) لا يكون غير null إلا أثناء إجازة سارية فعلياً
function instructorStatusLabel(entity) {
  if (entity?.leaveStatus) return "في إجازة";
  const acct = entity?.accountStatus;
  if (acct === "BLOCKED" || acct === "ARCHIVED") return "غير نشط";
  return "نشط";
}

function statusTone(t, tone) {
  return t[tone] || t.expired;
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

function skeletonStyle(t, extra) {
  return { borderRadius: 8, background: t.bgElevated, ...extra };
}

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

// شريط نسب متراكم + مفتاح ألوان — يعتمد ألوان الثيم الجاهزة (confirmed/completed/noshow/cancelled)
// بدل اختراع ألوان جديدة، لأن حالات الجلسات الثلاث مغطّاة أصلاً بمفاتيح الثيم
function ProportionBar({ segments, t }) {
  const visible = segments.filter((s) => s.value > 0);
  if (!visible.length) return null;
  return (
    <div>
      <div style={{ display: "flex", height: 10, borderRadius: 6, overflow: "hidden", background: t.bgElevated }}>
        {visible.map((s, i) => (
          <div key={s.key} title={`${s.label}: ${s.value}`} style={{
            width: `${s.pct}%`, background: s.color,
            marginInlineEnd: i < visible.length - 1 ? 2 : 0,
          }} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
        {visible.map((s) => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textSec }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, display: "inline-block" }} />
            {s.label}
            <span style={{ fontWeight: 700, color: t.text }}>{s.value} ({s.pct ?? 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonLine({ t, w = "100%", h = 14 }) {
  return <div className="skeleton-pulse" style={skeletonStyle(t, { width: w, height: h })} />;
}

function SkeletonStatsGrid({ t }) {
  return (
    <div className="dashboard-stats-grid">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={cardStyle(t)}>
          <div className="skeleton-pulse" style={skeletonStyle(t, { width: 44, height: 44, borderRadius: 14, marginBottom: 14 })} />
          <SkeletonLine t={t} w="55%" h={26} />
          <div style={{ height: 8 }} />
          <SkeletonLine t={t} w="75%" h={12} />
        </div>
      ))}
    </div>
  );
}

function SkeletonRows({ t, rows = 4, cols = 5 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "6px 0" }}>
      {Array.from({ length: rows }).map((_, ri) => (
        <div key={ri} style={{ display: "flex", gap: 10 }}>
          {Array.from({ length: cols }).map((__, ci) => (
            <SkeletonLine key={ci} t={t} w={ci === 0 ? "8%" : "18%"} h={14} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// ADD BONUS MODAL
// ═══════════════════════════════════════════════
function AddBonusModal({ t, instructorId, onClose, onSuccess }) {
  const [form, setForm] = useState({ amount: "", note: "", paymentMethod: "CASH" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "المبلغ مطلوب";
    if (!form.note.trim()) e.note = "الملاحظة مطلوبة";
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
      await instructorsService.createBonus(instructorId, {
        amount: Number(form.amount),
        note: form.note.trim(),
        paymentMethod: form.paymentMethod,
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء صرف المكافأة");
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
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 440,
        border: `1px solid ${t.borderCard}`, boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>صرف مكافأة للمدرب</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1 }}><LuX /></button>
        </div>

        {serverError && (
          <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#c74848" }}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>المبلغ (ل.س)</label>
            <input type="number" step="0.01" dir="ltr" value={form.amount}
              onChange={(ev) => { setForm({ ...form, amount: ev.target.value }); setErrors({ ...errors, amount: undefined }); }}
              placeholder="مثال: 50000" style={{ ...fieldStyle("amount"), textAlign: "left" }} />
            {errors.amount && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.amount}</div>}
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
            <label style={labelStyle}>ملاحظة (مطلوبة)</label>
            <textarea rows={3} value={form.note}
              onChange={(ev) => { setForm({ ...form, note: ev.target.value }); setErrors({ ...errors, note: undefined }); }}
              placeholder="سبب المكافأة" style={{ ...fieldStyle("note"), resize: "none" }} />
            {errors.note && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.note}</div>}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: "12px", borderRadius: 12, background: submitting ? t.textMuted : "#778a3b",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
            }}>{submitting ? "جارٍ الصرف..." : "تأكيد الصرف"}</button>
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
// SETTLE DUES MODAL
// ═══════════════════════════════════════════════
function SettleDuesModal({ t, instructorId, entries, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const total = entries.reduce((sum, e) => sum + (e.amount || 0), 0);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    setSubmitting(true);
    try {
      await instructorsService.settle(instructorId, {
        expenseIds: entries.map((e) => e.expenseId),
        paymentMethod,
        ...(note.trim() ? { note: note.trim() } : {}),
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء صرف المستحقات");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 13, outline: "none", resize: "none",
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "28px 24px", width: "100%", maxWidth: 480,
        border: `1px solid ${t.borderCard}`, boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text }}>صرف المستحقات المحددة</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1 }}><LuX /></button>
        </div>

        {serverError && (
          <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#c74848" }}>{serverError}</div>
        )}

        <div style={{ background: t.accentLight, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, fontWeight: 700, color: t.accentText }}>
          عدد البنود: {entries.length} — الإجمالي: {formatMoney(total)}
        </div>

        <div style={{ maxHeight: 160, overflowY: "auto", border: `1px solid ${t.border}`, borderRadius: 10, marginBottom: 18 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <tbody>
              {entries.map((e) => (
                <tr key={e.entryId} style={{ borderBottom: `1px solid ${t.border}` }}>
                  <td style={{ padding: "6px 10px", color: t.textMuted }}>{e.date}</td>
                  <td style={{ padding: "6px 10px", color: t.text }}>{e.studentName || "—"}</td>
                  <td style={{ padding: "6px 10px", color: t.text, fontWeight: 700, textAlign: "left" }}>{formatMoney(e.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>طريقة الدفع</label>
            <div style={{ display: "flex", gap: 8 }}>
              {PAYMENT_METHOD_FORM_OPTIONS.map(([value, label]) => (
                <button key={value} type="button" onClick={() => setPaymentMethod(value)} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 600, textAlign: "center",
                  background: paymentMethod === value ? "#778a3b" : t.bgElevated,
                  color: paymentMethod === value ? "#fff" : t.textSec,
                  outline: paymentMethod === value ? "none" : `1.5px solid ${t.border}`,
                }}>{label}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>ملاحظة (اختياري)</label>
            <textarea rows={2} value={note} onChange={(ev) => setNote(ev.target.value)} placeholder="ملاحظة عن الدفعة" style={fieldStyle} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: "11px", borderRadius: 12, background: submitting ? t.textMuted : "#778a3b",
              color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
            }}>{submitting ? "جارٍ الصرف..." : "تأكيد الصرف"}</button>
            <button type="button" onClick={onClose} disabled={submitting} style={{
              padding: "11px 20px", borderRadius: 12, background: t.bgElevated, color: t.textSec,
              border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// REVERSE SETTLEMENT MODAL
// ═══════════════════════════════════════════════
function ReverseSettlementModal({ t, instructorId, payment, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async () => {
    setServerError("");
    setSubmitting(true);
    try {
      await instructorsService.reverseSettlement(instructorId, {
        expenseIds: payment.expenseIds || [],
        ...(reason.trim() ? { reason: reason.trim() } : {}),
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء التراجع عن الصرف");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "28px 24px", width: "100%", maxWidth: 420,
        border: `1px solid ${t.borderCard}`, boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
      }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: t.text }}>التراجع عن الصرف</h3>

        <div style={{ background: t.pending.bg, border: `0.5px solid ${t.pending.text}40`, borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: t.pending.text }}>
          هل أنت متأكد من التراجع عن صرف {formatMoney(payment.amount)} ({payment.entryCount ?? payment.expenseIds?.length ?? 0} حركة) بتاريخ {formatDateTime24(payment.paidAt)}؟ ستعود البنود إلى حالة غير مدفوعة.
        </div>

        {serverError && (
          <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#c74848" }}>{serverError}</div>
        )}

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>سبب التراجع (اختياري — للإشعار فقط)</label>
          <textarea rows={2} value={reason} onChange={(ev) => setReason(ev.target.value)} placeholder="مثال: خطأ في الصرف" style={{
            width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${t.border}`,
            background: t.bgElevated, color: t.text, fontSize: 13, outline: "none", resize: "none",
          }} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleSubmit} disabled={submitting} style={{
            flex: 1, padding: "11px", borderRadius: 12, background: submitting ? t.textMuted : "#c98a28",
            color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
          }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><TbArrowBackUp size={15} />{submitting ? "جارٍ التراجع..." : "تأكيد التراجع"}</span></button>
          <button type="button" onClick={onClose} disabled={submitting} style={{
            padding: "11px 20px", borderRadius: 12, background: t.bgElevated, color: t.textSec,
            border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// DELETE BONUS MODAL
// ═══════════════════════════════════════════════
function DeleteBonusModal({ t, instructorId, payment, onClose, onSuccess }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const expenseId = payment.expenseIds?.[0];

  const handleDelete = async () => {
    setBusy(true);
    setError("");
    try {
      await instructorsService.deleteBonus(instructorId, expenseId);
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء حذف المكافأة");
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
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: t.text }}>حذف المكافأة</h3>

        <div style={{ background: t.cancelled.bg, border: `0.5px solid ${t.cancelled.text}40`, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: t.cancelled.text, marginBottom: 16 }}>
          هل أنت متأكد من حذف مكافأة بمبلغ {formatMoney(payment.amount)} بتاريخ {formatDateTime24(payment.paidAt)}؟ لا يمكن التراجع عن هذا الإجراء.
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
// LEVEL 1 — INSTRUCTOR SELECTOR TABLE
// ═══════════════════════════════════════════════
function InstructorReportPicker({ t, onSelect }) {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (genderFilter) params.gender = genderFilter;
        if (typeFilter) params.instructorType = typeFilter;
        const { data } = await instructorsService.getAll(params);
        const body = data?.data ?? data;
        if (!cancelled) setInstructors(Array.isArray(body) ? body : []);
      } catch {
        if (!cancelled) setInstructors([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [search, genderFilter, typeFilter]);

  return (
    <div>
      <div className="ird-filter-bar" style={{
        background: t.bgSurface, borderRadius: 10, border: `0.5px solid ${t.borderCard}`,
        padding: "12px 16px", marginBottom: 16,
      }}>
        <input
          placeholder="بحث بالاسم أو رقم الهاتف..."
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
          style={{
            flex: 1, minWidth: 180, padding: "8px 12px", borderRadius: 7,
            border: `0.5px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 13,
          }}
        />
        <select value={genderFilter} onChange={(ev) => setGenderFilter(ev.target.value)} style={filterInputStyle(t)}>
          {GENDER_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={typeFilter} onChange={(ev) => setTypeFilter(ev.target.value)} style={filterInputStyle(t)}>
          {INSTRUCTOR_TYPE_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ borderRadius: 10, border: `0.5px solid ${t.border}`, padding: 16 }}>
          <SkeletonRows t={t} rows={5} cols={6} />
        </div>
      ) : instructors.length === 0 ? (
        <div style={emptyStateStyle(t)}>لا يوجد مدربون مطابقون لهذا البحث</div>
      ) : (
        <div className="ird-table-wrap" style={{ borderRadius: 10, border: `0.5px solid ${t.border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 640 }}>
            <thead>
              <tr style={{ background: t.bgElevated }}>
                {["الاسم", "الهاتف", "الجنس", "القدرات", "الحالة", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "right", color: t.textMuted, fontWeight: 600, fontSize: 12, borderBottom: `0.5px solid ${t.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {instructors.map((ins, ri) => (
                <tr key={ins.instructorId} style={{ background: ri % 2 === 0 ? t.bgSurface : t.bgPage, borderBottom: `0.5px solid ${t.border}` }}>
                  <td style={{ padding: "10px 14px", color: t.text, fontWeight: 600 }}>{ins.name || "—"}</td>
                  <td style={{ padding: "10px 14px", color: t.text }} dir="ltr">{ins.phone || "—"}</td>
                  <td style={{ padding: "10px 14px" }}><Badge status={GENDER_MAP[ins.gender] || ins.gender || "—"} t={t} /></td>
                  <td style={{ padding: "10px 14px" }}><Badge status={INSTRUCTOR_TYPE_MAP[ins.instructorType] || ins.instructorType || "—"} t={t} /></td>
                  <td style={{ padding: "10px 14px" }}><Badge status={instructorStatusLabel(ins)} t={t} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    <button onClick={() => onSelect(ins.instructorId)} style={{
                      padding: "5px 12px", borderRadius: 6, background: t.accentLight, color: t.accentText,
                      border: "none", fontSize: 12, cursor: "pointer", fontWeight: 700,
                      display: "inline-flex", alignItems: "center", gap: 4,
                    }}><LuEye size={13} /> عرض التقرير</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// LEVEL 2 — DETAILED INSTRUCTOR REPORT
// ═══════════════════════════════════════════════
function InstructorDetailReport({ t, instructorId, onBack }) {
  const { hasPermission } = useAuth();
  const canCreateBonus = hasPermission(P.EXPENSES_CREATE);
  const canPay = hasPermission(P.EXPENSES_PAY);
  const canDeleteExpense = hasPermission(P.EXPENSES_DELETE);
  const canReadExpenses = hasPermission(P.EXPENSES_READ);
  const dark = isDarkTheme(t);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [from, setFrom] = useState(firstDayOfMonthStr());
  const [to, setTo] = useState(currentDateStr());
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(true);

  const [dues, setDues] = useState([]);
  const [duesTotal, setDuesTotal] = useState(0);
  const [duesLoading, setDuesLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(() => new Set());

  const [paymentsMonth, setPaymentsMonth] = useState(currentMonthStr());
  const [payments, setPayments] = useState([]);
  const [paymentsPeriodTotals, setPaymentsPeriodTotals] = useState({ totalReceived: 0, sessionCount: 0, invoiceCount: 0 });
  const [paymentsMeta, setPaymentsMeta] = useState({ total: 0, page: 1, limit: 50, totalPages: 0 });
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  const [showAddBonus, setShowAddBonus] = useState(false);
  const [settleTarget, setSettleTarget] = useState(null);
  const [reverseTarget, setReverseTarget] = useState(null);
  const [deleteBonusTarget, setDeleteBonusTarget] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setProfileLoading(true);
      try {
        const { data } = await instructorsService.getProfile(instructorId);
        if (!cancelled) setProfile(data?.data ?? data);
      } catch {
        if (!cancelled) setProfile(null);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [instructorId, refreshKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatsLoading(true);
      try {
        const { data } = await instructorsService.getStats(instructorId);
        if (!cancelled) setStats(data?.data ?? data);
      } catch {
        if (!cancelled) setStats(null);
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [instructorId, refreshKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setReportLoading(true);
      try {
        const { data } = await instructorsService.getReport(instructorId, { from, to });
        if (!cancelled) setReport(data?.data ?? data);
      } catch {
        if (!cancelled) setReport(null);
      } finally {
        if (!cancelled) setReportLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [instructorId, from, to, refreshKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setDuesLoading(true);
      try {
        const { data } = await instructorsService.getDues(instructorId);
        const body = data?.data ?? data;
        if (!cancelled) {
          setDues(body?.entries || []);
          setDuesTotal(body?.totalOutstanding ?? 0);
          setSelectedIds(new Set());
        }
      } catch {
        if (!cancelled) {
          setDues([]);
          setDuesTotal(0);
          setSelectedIds(new Set());
        }
      } finally {
        if (!cancelled) setDuesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [instructorId, refreshKey]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPaymentsLoading(true);
      try {
        const { data } = await instructorsService.getPayments(instructorId, { month: paymentsMonth, page: paymentsPage, limit: 50 });
        const body = data?.data ?? data;
        if (!cancelled) {
          setPayments(body?.data || []);
          setPaymentsPeriodTotals({
            totalReceived: body?.totalReceived ?? 0,
            sessionCount: body?.sessionCount ?? 0,
            invoiceCount: body?.invoiceCount ?? 0,
          });
          setPaymentsMeta(body?.meta || { total: 0, page: 1, limit: 50, totalPages: 0 });
        }
      } catch {
        if (!cancelled) {
          setPayments([]);
          setPaymentsPeriodTotals({ totalReceived: 0, sessionCount: 0, invoiceCount: 0 });
          setPaymentsMeta({ total: 0, page: 1, limit: 50, totalPages: 0 });
        }
      } finally {
        if (!cancelled) setPaymentsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [instructorId, paymentsMonth, paymentsPage, refreshKey]);

  const weeksChartData = useMemo(() => (report?.sessionsByWeek || []).map((w, i) => ({
    label: w.label ? w.label.replace("Week", "أسبوع") : `أسبوع ${i + 1}`,
    count: w.count ?? 0,
  })), [report]);

  const statusSegments = useMemo(() => {
    const sb = report?.statusBreakdown;
    if (!sb || !sb.total) return [];
    return STATUS_SEGMENTS.map((s) => ({
      key: s.key, label: s.label, value: sb[s.key] ?? 0, pct: sb[s.pctKey] ?? 0, color: statusTone(t, s.tone).text,
    }));
  }, [report, t]);

  const bonusSummary = useMemo(() => {
    const bonusRows = payments.filter((p) => p.type === "BONUS");
    return { amount: bonusRows.reduce((s, p) => s + (p.amount || 0), 0), count: bonusRows.length };
  }, [payments]);

  const totalOutstandingAllTime = report?.duesOverview?.totalOutstandingAllTime ?? stats?.totalOutstanding;

  const selectedEntries = dues.filter((d) => selectedIds.has(d.expenseId));
  const selectedTotal = selectedEntries.reduce((sum, d) => sum + (d.amount || 0), 0);

  const toggleSelectAll = () => {
    setSelectedIds((prev) => (prev.size === dues.length ? new Set() : new Set(dues.map((d) => d.expenseId))));
  };
  const toggleSelect = (expenseId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(expenseId)) next.delete(expenseId); else next.add(expenseId);
      return next;
    });
  };

  const bumpRefresh = () => setRefreshKey((k) => k + 1);

  return (
    <div>
      <button onClick={onBack} style={{
        display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none",
        color: t.accentText, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, marginBottom: 14,
      }}>
        <TbArrowRight size={16} /> رجوع لقائمة المدربين
      </button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: t.accentGradientSoft, color: t.accent, display: "grid", placeItems: "center", fontSize: 20 }}>
              <TbUser />
            </div>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: t.text }}>تقرير أداء المدرب الفردي</h2>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: t.textSec }}>
            {profileLoading ? "جارٍ التحميل..." : `${profile?.name || "—"} — ${profile?.phone || "—"}`}
          </p>
        </div>

        <div className="ird-filter-bar">
          <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted }}>من</label>
          <input type="date" value={from} onChange={(ev) => setFrom(ev.target.value)} style={{
            padding: "9px 12px", borderRadius: 10, border: `1px solid ${t.border}`,
            background: t.bgSurface, color: t.text, fontSize: 13, fontWeight: 600, colorScheme: dark ? "dark" : "light",
          }} />
          <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted }}>إلى</label>
          <input type="date" value={to} onChange={(ev) => setTo(ev.target.value)} style={{
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
      {actionError && (
        <div style={{ background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#c74848" }}>{actionError}</span>
          <button onClick={() => setActionError("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#c74848", lineHeight: 1 }}><LuX size={14} /></button>
        </div>
      )}

      <div className="dashboard-stack">
        {statsLoading || reportLoading ? <SkeletonStatsGrid t={t} /> : (
          <div className="dashboard-stats-grid">
            <StatCard label="المستحق اليوم" value={formatMoney(stats?.dueToday)} color={t.pending.text} icon={<TbHourglass size={22} />} t={t} />
            <StatCard label="إجمالي المستحقات (كل الوقت)" value={formatMoney(totalOutstandingAllTime)} color={t.accent} icon={<TbCoin size={22} />} t={t} />
            <StatCard label="نسبة الإكمال للفترة المحددة" value={report?.statusBreakdown?.completedPct != null ? `${report.statusBreakdown.completedPct}%` : "—"} color={t.completed.text} icon={<TbCircleCheck size={22} />} t={t} />
            <StatCard label="نسبة الغياب للفترة المحددة" value={report?.statusBreakdown?.noShowPct != null ? `${report.statusBreakdown.noShowPct}%` : "—"} color={t.cancelled.text} icon={<TbCircleX size={22} />} t={t} />
          </div>
        )}

        <div className="ird-top-grid">
          <div style={cardStyle(t)}>
            <div style={cardTitleStyle(t)}><TbUser size={16} /> بطاقة الملف الشخصي</div>
            {profileLoading ? <SkeletonRows t={t} rows={7} cols={2} /> : !profile ? (
              <div style={emptyStateStyle(t)}>تعذر تحميل بيانات المدرب</div>
            ) : (
              <>
                <InfoRow t={t} k="الاسم" v={profile.name || "—"} />
                <InfoRow t={t} k="الهاتف" v={<span dir="ltr">{profile.phone || "—"}</span>} />
                <InfoRow t={t} k="الجنس" v={<Badge status={GENDER_MAP[profile.gender] || profile.gender || "—"} t={t} />} />
                <InfoRow t={t} k="القدرات" v={<Badge status={INSTRUCTOR_TYPE_MAP[profile.instructorType] || profile.instructorType || "—"} t={t} />} />
                <InfoRow t={t} k="أجر الجلسة الحالي" v={formatMoney(profile.sessionWage)} />
                <InfoRow t={t} k="جلسات اليوم" v={String(profile.todayLessonsCount ?? 0)} />
                <InfoRow t={t} k="الحالة" v={<Badge status={instructorStatusLabel(profile)} t={t} />} last={!profile.leaveStatus} />
                {profile.leaveStatus && (
                  <InfoRow t={t} k="نوع الإجازة" v={LEAVE_STATUS_DETAIL[profile.leaveStatus] || profile.leaveStatus} last />
                )}
              </>
            )}
          </div>

          <div style={cardStyle(t)}>
            <div style={cardTitleStyle(t)}><TbCalendarWeek size={16} /> توزيع الجلسات حسب الأسبوع</div>
            {reportLoading ? (
              <div style={{ height: 200 }}><SkeletonRows t={t} rows={4} cols={1} /></div>
            ) : !weeksChartData.length ? (
              <div style={emptyStateStyle(t)}>لا توجد جلسات ضمن هذه الفترة</div>
            ) : (
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeksChartData} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
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
              إجمالي جلسات الفترة: {report?.statusBreakdown?.total ?? 0} جلسة
            </div>
          </div>

          <div style={cardStyle(t)}>
            <div style={cardTitleStyle(t)}><TbGift size={16} /> حالات الجلسات والمكافآت</div>
            {reportLoading ? <SkeletonRows t={t} rows={3} cols={1} /> : !statusSegments.length ? (
              <div style={emptyStateStyle(t)}>لا توجد بيانات لهذه الفترة</div>
            ) : (
              <ProportionBar segments={statusSegments} t={t} />
            )}
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${t.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, color: t.textMuted }}>مكافآت شهر {formatMonthLabel(paymentsMonth)}</div>
                  {paymentsLoading ? <SkeletonLine t={t} w={90} h={22} /> : (
                    <div style={{ fontSize: 18, fontWeight: 800, color: t.text }}>{formatMoney(bonusSummary.amount)}</div>
                  )}
                  <div style={{ fontSize: 11, color: t.textMuted }}>{bonusSummary.count} مكافأة</div>
                </div>
                {canCreateBonus && (
                  <button onClick={() => setShowAddBonus(true)} style={primaryBtnStyle}><TbPlus size={14} /> صرف مكافأة</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {canReadExpenses && (
          <div style={{ ...cardStyle(t), height: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: t.text, display: "flex", alignItems: "center", gap: 8 }}>
                <TbReceipt size={18} /> قسم المحاسبة — مستحقات ومدفوعات المدرب
              </div>
              {!canCreateBonus ? null : (
                <button onClick={() => setShowAddBonus(true)} style={secondaryBtnStyle(t)}><TbGift size={15} /> صرف مكافأة</button>
              )}
            </div>

            {/* ── مستحقات غير مدفوعة ── */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: t.text }}>مستحقات غير مدفوعة</div>
                <div style={{ fontSize: 12, color: t.textMuted }}>
                  {duesLoading ? "جارٍ التحميل..." : `${dues.length} بند — الإجمالي ${formatMoney(duesTotal)}`}
                </div>
              </div>

              {duesLoading ? (
                <SkeletonRows t={t} rows={4} cols={6} />
              ) : dues.length === 0 ? (
                <div style={emptyStateStyle(t)}>لا توجد مستحقات غير مدفوعة لهذا المدرب</div>
              ) : (
                <>
                  <div className="ird-table-wrap">
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 640 }}>
                      <thead>
                        <tr style={{ background: t.bgElevated }}>
                          <th style={{ padding: "10px 12px", borderBottom: `0.5px solid ${t.border}` }}>
                            <input type="checkbox" checked={selectedIds.size === dues.length} onChange={toggleSelectAll} />
                          </th>
                          {["التاريخ", "الوقت", "الطالب", "نوع التدريب", "المركبة", "المبلغ"].map((h) => (
                            <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: t.textMuted, fontWeight: 600, fontSize: 12, borderBottom: `0.5px solid ${t.border}` }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dues.map((d, i) => (
                          <tr key={d.entryId} style={{ background: i % 2 === 0 ? t.bgSurface : t.bgPage, borderBottom: `0.5px solid ${t.border}` }}>
                            <td style={{ padding: "10px 12px" }}>
                              <input type="checkbox" checked={selectedIds.has(d.expenseId)} onChange={() => toggleSelect(d.expenseId)} />
                            </td>
                            <td style={{ padding: "10px 12px", color: t.text }}>{d.date}</td>
                            <td style={{ padding: "10px 12px", color: t.text }} dir="ltr">{formatTime24(d.startAt)}</td>
                            <td style={{ padding: "10px 12px", color: t.text }}>{d.studentName || "—"}</td>
                            <td style={{ padding: "10px 12px", color: t.textSec }}>{INSTRUCTOR_TYPE_MAP[d.trainingType] || d.trainingType || "—"}</td>
                            <td style={{ padding: "10px 12px", color: t.textSec }}>{VEHICLE_SOURCE_LABELS[d.vehicleSource] || d.vehicleSource || "—"}</td>
                            <td style={{ padding: "10px 12px", color: t.text, fontWeight: 700 }}>{formatMoney(d.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: t.text }}>
                      المحدد: {selectedIds.size} بند — {formatMoney(selectedTotal)}
                    </span>
                    {canPay && (
                      <button
                        disabled={!selectedIds.size}
                        onClick={() => setSettleTarget(selectedEntries)}
                        style={{ ...primaryBtnStyle, opacity: selectedIds.size ? 1 : 0.5, cursor: selectedIds.size ? "pointer" : "not-allowed" }}
                      ><TbCoin size={15} /> صرف المحدد</button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* ── سجل الفواتير المصروفة ── */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: t.text }}>سجل الفواتير المصروفة</div>
                <div className="ird-filter-bar">
                  <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted }}>الشهر</label>
                  <input type="month" value={paymentsMonth} onChange={(ev) => { setPaymentsMonth(ev.target.value); setPaymentsPage(1); }} style={{
                    padding: "7px 10px", borderRadius: 8, border: `0.5px solid ${t.border}`,
                    background: t.bgElevated, color: t.text, fontSize: 12, fontWeight: 600, colorScheme: dark ? "dark" : "light",
                  }} />
                </div>
              </div>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 12 }}>
                {paymentsLoading ? "جارٍ التحميل..." : `مقبوض الفترة: ${formatMoney(paymentsPeriodTotals.totalReceived)} — ${paymentsPeriodTotals.sessionCount} جلسة — ${paymentsPeriodTotals.invoiceCount} فاتورة`}
              </div>

              {paymentsLoading ? (
                <SkeletonRows t={t} rows={4} cols={5} />
              ) : payments.length === 0 ? (
                <div style={emptyStateStyle(t)}>لا توجد فواتير مصروفة لهذا الشهر</div>
              ) : (
                <div className="ird-table-wrap">
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 640 }}>
                    <thead>
                      <tr style={{ background: t.bgElevated }}>
                        {["التاريخ والوقت", "النوع", "المبلغ", "عدد الحركات", "طريقة الدفع", "إجراءات"].map((h) => (
                          <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: t.textMuted, fontWeight: 600, fontSize: 12, borderBottom: `0.5px solid ${t.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p, i) => (
                        <tr key={`${p.paidAt}-${i}`} style={{ background: i % 2 === 0 ? t.bgSurface : t.bgPage, borderBottom: `0.5px solid ${t.border}` }}>
                          <td style={{ padding: "10px 12px", color: t.text }}>{formatDateTime24(p.paidAt)}</td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                              background: p.type === "BONUS" ? t.pending.bg : t.confirmed.bg,
                              color: p.type === "BONUS" ? t.pending.text : t.confirmed.text,
                            }}>{INVOICE_TYPE_LABELS[p.type] || p.type}</span>
                          </td>
                          <td style={{ padding: "10px 12px", color: t.text, fontWeight: 700 }}>{formatMoney(p.amount)}</td>
                          <td style={{ padding: "10px 12px", color: t.textSec }}>{p.entryCount ?? p.expenseIds?.length ?? "—"}</td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                              background: p.paymentMethod === "CASH" ? t.completed.bg : t.confirmed.bg,
                              color: p.paymentMethod === "CASH" ? t.completed.text : t.confirmed.text,
                            }}>{PAYMENT_METHOD_LABELS[p.paymentMethod] || p.paymentMethod}</span>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            {p.type === "LESSONS" && canPay && (
                              <button onClick={() => setReverseTarget(p)} style={{
                                padding: "4px 10px", borderRadius: 6, background: t.pending.bg,
                                color: t.pending.text, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
                                display: "inline-flex", alignItems: "center", gap: 4,
                              }}><TbArrowBackUp size={13} /> تراجع</button>
                            )}
                            {p.type === "BONUS" && canDeleteExpense && (
                              <button onClick={() => setDeleteBonusTarget(p)} style={{
                                padding: "4px 10px", borderRadius: 6, background: t.cancelled.bg,
                                color: t.cancelled.text, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
                                display: "inline-flex", alignItems: "center", gap: 4,
                              }}><TbTrash size={13} /> حذف</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {paymentsMeta.totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
                  <button disabled={paymentsPage <= 1} onClick={() => setPaymentsPage((p) => Math.max(1, p - 1))} style={pageBtnStyle(t, paymentsPage <= 1)}>
                    <TbChevronRight size={16} />
                  </button>
                  <span style={{ fontSize: 13, color: t.textSec, fontWeight: 600 }}>صفحة {paymentsMeta.page} من {paymentsMeta.totalPages}</span>
                  <button disabled={paymentsPage >= paymentsMeta.totalPages} onClick={() => setPaymentsPage((p) => Math.min(paymentsMeta.totalPages, p + 1))} style={pageBtnStyle(t, paymentsPage >= paymentsMeta.totalPages)}>
                    <TbChevronLeft size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showAddBonus && (
        <AddBonusModal
          t={t}
          instructorId={instructorId}
          onClose={() => setShowAddBonus(false)}
          onSuccess={() => {
            setShowAddBonus(false);
            setActionMessage("تم صرف المكافأة بنجاح");
            bumpRefresh();
          }}
        />
      )}

      {settleTarget && (
        <SettleDuesModal
          t={t}
          instructorId={instructorId}
          entries={settleTarget}
          onClose={() => setSettleTarget(null)}
          onSuccess={() => {
            setSettleTarget(null);
            setActionMessage("تم صرف المستحقات المحددة بنجاح");
            bumpRefresh();
          }}
        />
      )}

      {reverseTarget && (
        <ReverseSettlementModal
          t={t}
          instructorId={instructorId}
          payment={reverseTarget}
          onClose={() => setReverseTarget(null)}
          onSuccess={() => {
            setReverseTarget(null);
            setActionMessage("تم التراجع عن الصرف بنجاح");
            bumpRefresh();
          }}
        />
      )}

      {deleteBonusTarget && (
        <DeleteBonusModal
          t={t}
          instructorId={instructorId}
          payment={deleteBonusTarget}
          onClose={() => setDeleteBonusTarget(null)}
          onSuccess={() => {
            setDeleteBonusTarget(null);
            setActionMessage("تم حذف المكافأة بنجاح");
            bumpRefresh();
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN EXPORT — LEVEL SWITCHER
// ═══════════════════════════════════════════════
export default function InstructorReportDashboard({ t, onBack }) {
  const [selectedInstructorId, setSelectedInstructorId] = useState(null);

  if (selectedInstructorId) {
    return <InstructorDetailReport t={t} instructorId={selectedInstructorId} onBack={() => setSelectedInstructorId(null)} />;
  }

  return (
    <div>
      {onBack && (
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: t.accentText, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, marginBottom: 16,
        }}><TbArrowRight size={16} /> رجوع للتقارير</button>
      )}
      <SectionHeader title="تقرير المدربين" subtitle="اختر مدرباً لعرض تقرير الأداء والمستحقات التفصيلي" t={t} />
      <div style={{ marginTop: 16 }}>
        <InstructorReportPicker t={t} onSelect={(id) => setSelectedInstructorId(id)} />
      </div>
    </div>
  );
}
