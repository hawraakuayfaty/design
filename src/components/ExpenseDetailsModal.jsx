import { useEffect, useState } from "react";
import { expensesService } from "../api";

const CATEGORY_LABELS = { VEHICLE: "سيارة", INSTRUCTOR: "مدرب", EMPLOYEE: "موظف", GENERAL: "عام" };
const STATUS_LABELS = { PAID: "مدفوعة", UNPAID: "قيد الانتظار" };
const PAYMENT_METHOD_LABELS = { CASH: "نقداً", SHAM_CASH: "شام كاش" };
const VEHICLE_REASON_LABELS = { GAS: "وقود", MAINTENANCE: "صيانة", WASH: "غسيل", FINE: "مخالفة", INSURANCE: "تأمين", OTHER: "أخرى" };
const EMPLOYEE_TYPE_LABELS = { SALARY: "راتب شهري", BONUS: "مكافأة", OTHER: "سلفة / مصروف آخر" };
const GENERAL_TYPE_LABELS = { WATER: "ماء", ELECTRICITY: "كهرباء", INTERNET: "إنترنت", KITCHEN: "ضيافة ومطبخ", SUPPLIES: "مستلزمات ومواد", OTHER: "أخرى" };
const INSTRUCTOR_KIND_LABELS = { LESSON: "درس", BONUS: "مكافأة" };
const BOOKING_STATUS_LABELS = { COMPLETED: "مكتمل", BOOKED: "محجوز", CANCELLED: "ملغي", NO_SHOW: "لم يحضر", PENDING_PAYMENT: "بانتظار الدفع" };
const ROLE_LABELS_AR = { ACCOUNTANT: "محاسب", RECEPTIONIST: "موظف استقبال" };

const fmtMoney = (n) => (n != null && n !== "" ? `${Number(n).toLocaleString("en")} ل.س` : "—");
const fmtDate = (d) => d || "—";
const fmtDateTime = (iso) => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString("ar-SY", { dateStyle: "medium", timeStyle: "short" }); }
  catch { return iso; }
};
const fmtMonth = (m) => {
  if (!m) return "—";
  try { return new Date(`${m}T00:00:00`).toLocaleDateString("ar-SY", { month: "long", year: "numeric" }); }
  catch { return m; }
};

function Row({ label, value, t }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0", borderBottom: `1px solid ${t.border}`, fontSize: 13 }}>
      <span style={{ color: t.textMuted, flexShrink: 0 }}>{label}</span>
      <span style={{ color: t.text, fontWeight: 600, textAlign: "left" }}>{value}</span>
    </div>
  );
}

function StatePill({ label, tone, t }) {
  const map = { good: t.completed, warn: t.pending, muted: t.expired };
  const c = map[tone] || t.expired;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: c.bg, color: c.text, padding: "3px 11px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

export default function ExpenseDetailsModal({ expenseId, onClose, t }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (expenseId == null) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await expensesService.getById(expenseId);
        const body = res.data?.data ?? res.data;
        if (!cancelled) setData(body);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || err.message || "فشل تحميل تفاصيل المصروف");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [expenseId]);

  const disbState = data?.disbursement?.state;
  const detail = data?.detail || {};

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(2px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: t.bgSurface, borderRadius: 16, width: 460, maxWidth: "calc(100vw - 40px)", maxHeight: "85vh", overflow: "hidden", boxShadow: "0 20px 48px rgba(0,0,0,0.28)", display: "flex", flexDirection: "column" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: t.text }}>
            تفاصيل المصروف {data?.expenseId != null ? `#${data.expenseId}` : expenseId != null ? `#${expenseId}` : ""}
          </div>
          <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 7, border: "none", background: t.bgElevated, cursor: "pointer", fontSize: 16, color: t.textMuted }}>✕</button>
        </div>

        <div style={{ padding: "18px 20px", overflowY: "auto" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 30, color: t.textMuted, fontSize: 13 }}>جارٍ التحميل...</div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: 20, color: "#c74848", fontSize: 13, fontWeight: 600 }}>{error}</div>
          ) : !data ? (
            <div style={{ textAlign: "center", padding: 20, color: t.textMuted, fontSize: 13 }}>لا توجد بيانات</div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <span style={{ padding: "3px 11px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: t.accentLight, color: t.accentText }}>
                  {CATEGORY_LABELS[data.category] || data.category}
                </span>
                <StatePill label={STATUS_LABELS[data.status] || data.status} tone={data.status === "PAID" ? "good" : "warn"} t={t} />
              </div>

              <div style={{ background: t.bgElevated, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                <Row label="المبلغ" value={fmtMoney(data.amount)} t={t} />
                <Row label="تاريخ المصروف" value={fmtDate(data.expenseDate)} t={t} />
                {disbState === "DISBURSED" && <Row label="صُرفت في" value={fmtDateTime(data.paidAt)} t={t} />}
                <Row label="تاريخ التسجيل" value={fmtDateTime(data.createdAt)} t={t} />
                {data.note && <Row label="ملاحظة" value={data.note} t={t} />}
              </div>

              <div style={{ borderRadius: 12, border: `1px solid ${t.borderCard}`, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, marginBottom: 8 }}>الصرف</div>
                {disbState === "DISBURSED" ? (
                  <>
                    <Row
                      label="صرفها"
                      value={`${data.disbursedBy?.name || "—"}${data.disbursedBy?.role ? ` — ${ROLE_LABELS_AR[data.disbursedBy.role] || data.disbursedBy.role}` : ""}`}
                      t={t}
                    />
                    {data.paymentMethod && <Row label="طريقة الدفع" value={PAYMENT_METHOD_LABELS[data.paymentMethod] || data.paymentMethod} t={t} />}
                  </>
                ) : disbState === "NOT_DISBURSED_YET" ? (
                  <StatePill label="قيد الانتظار — لم تُصرف بعد" tone="warn" t={t} />
                ) : (
                  <StatePill label="غير مسجَّل" tone="muted" t={t} />
                )}
              </div>

              <div style={{ borderRadius: 12, border: `1px solid ${t.borderCard}`, padding: "12px 14px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.textSec, marginBottom: 8 }}>تفاصيل إضافية</div>
                {data.category === "VEHICLE" && (
                  <>
                    <Row label="السبب" value={VEHICLE_REASON_LABELS[detail.reason] || detail.reason || "—"} t={t} />
                    {detail.reason === "GAS" && <Row label="اللترات" value={detail.liters != null ? `${detail.liters} لتر` : "—"} t={t} />}
                    <Row label="السيارة" value={detail.vehicle ? `${detail.vehicle.plateNumber || "—"} — ${detail.vehicle.model || ""}`.trim() : "—"} t={t} />
                  </>
                )}
                {data.category === "INSTRUCTOR" && (
                  <>
                    <Row label="النوع" value={INSTRUCTOR_KIND_LABELS[detail.kind] || detail.kind || "—"} t={t} />
                    <Row label="المدرب" value={detail.instructor?.name || "—"} t={t} />
                    {detail.kind === "LESSON" && detail.booking && (
                      <>
                        <Row label="رقم الحجز" value={`#${detail.booking.bookingId}`} t={t} />
                        <Row label="بداية الجلسة" value={fmtDateTime(detail.booking.startAt)} t={t} />
                        <Row label="نهاية الجلسة" value={fmtDateTime(detail.booking.endAt)} t={t} />
                        <Row label="حالة الحجز" value={BOOKING_STATUS_LABELS[detail.booking.bookingStatus] || detail.booking.bookingStatus || "—"} t={t} />
                      </>
                    )}
                  </>
                )}
                {data.category === "EMPLOYEE" && (
                  <>
                    <Row label="النوع" value={EMPLOYEE_TYPE_LABELS[detail.type] || detail.type || "—"} t={t} />
                    <Row label="صُرفت لـ" value={detail.employee?.name || "—"} t={t} />
                    {detail.type === "SALARY" && <Row label="الشهر" value={fmtMonth(detail.month)} t={t} />}
                    {detail.baseSalary != null && <Row label="الراتب المرجعي" value={fmtMoney(detail.baseSalary)} t={t} />}
                  </>
                )}
                {data.category === "GENERAL" && (
                  <Row label="النوع" value={GENERAL_TYPE_LABELS[detail.type] || detail.type || "—"} t={t} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
