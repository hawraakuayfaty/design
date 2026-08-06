import { useState, useEffect, useMemo } from "react";
import { bookingRevenueService } from "./api";
import { StatCard } from "./components/ui";
import {
  TbArrowRight, TbCashBanknote, TbCoins, TbHourglass, TbTrendingUp,
  TbReceipt, TbChevronRight, TbChevronLeft,
} from "react-icons/tb";
import {
  ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

// ═══════════════════════════════════════════════
// LOCAL CONSTANTS & MAPS
// ═══════════════════════════════════════════════
const PAYMENT_METHOD_LABELS = { CASH: "نقداً", SHAM_CASH: "شام كاش" };
const PAYMENT_KIND_LABELS = { DEPOSIT: "عربون", REMAINDER: "تكملة" };

// ═══════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════
function formatMoney(v) {
  if (v == null || v === "") return "—";
  const n = Number(v);
  // en-US هنا يضبط شكل الأرقام (١٬٢٣٤ → 1,234) فقط — النص المحيط "ل.س" يبقى عربياً
  return isNaN(n) ? String(v) : `${n.toLocaleString("en-US")} ل.س`;
}

function formatShortDate(dateStr) {
  if (!dateStr) return "—";
  const [, m, d] = String(dateStr).split("-");
  return d && m ? `${Number(d)}/${Number(m)}` : dateStr;
}

// تنسيق 24 ساعة صريح (hour12: false) — يمنع أي التباس AM/PM في وقت القبض
function formatDateTime24(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const datePart = new Intl.DateTimeFormat("ar", { day: "numeric", month: "short", year: "numeric", numberingSystem: "latn" }).format(d);
  const timePart = new Intl.DateTimeFormat("ar", { hour: "2-digit", minute: "2-digit", hour12: false, numberingSystem: "latn" }).format(d);
  return `${datePart} — ${timePart}`;
}

function formatDateOnly(value) {
  if (!value) return "—";
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("ar", { weekday: "long", day: "numeric", month: "long", year: "numeric", numberingSystem: "latn" }).format(d);
}

function currentDateStr() {
  return new Date().toISOString().slice(0, 10);
}

function firstDayOfMonthStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function shiftDateStr(dateStr, deltaDays) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + deltaDays);
  return d.toISOString().slice(0, 10);
}

function daysBetweenInclusive(from, to) {
  const a = new Date(`${from}T00:00:00`);
  const b = new Date(`${to}T00:00:00`);
  const diff = Math.round((b - a) / 86400000) + 1;
  return diff > 0 ? diff : 1;
}

function isDarkTheme(t) {
  return t.bgSurface === "#27272a";
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

function skeletonStyle(t, extra) {
  return { borderRadius: 8, background: t.bgElevated, ...extra };
}

// ═══════════════════════════════════════════════
// SMALL SHARED PIECES
// ═══════════════════════════════════════════════
function StatCardEx({ label, value, sub, color, icon, t }) {
  const shadow = isDarkTheme(t) ? "0 18px 40px rgba(2,8,23,0.34)" : "0 18px 24px rgba(15,23,42,0.08)";
  return (
    <div style={{ background: t.bgSurface, borderRadius: 18, border: `1px solid ${t.borderCard}`, padding: "18px 18px 16px", display: "flex", flexDirection: "column", gap: 8, boxShadow: shadow }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, display: "grid", placeItems: "center", background: t.accentGradientSoft, color: t.accent, fontSize: 20, lineHeight: 1 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: t.textMuted }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: t.textSec, fontWeight: 700 }}>{sub}</div>}
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
// MAIN DASHBOARD
// ═══════════════════════════════════════════════
export default function BookingRevenueReportDashboard({ t, onBack }) {
  const dark = isDarkTheme(t);

  const [from, setFrom] = useState(firstDayOfMonthStr());
  const [to, setTo] = useState(currentDateStr());
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(currentDateStr());
  const [daily, setDaily] = useState(null);
  const [dailyLoading, setDailyLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSummaryLoading(true);
      try {
        const { data } = await bookingRevenueService.getSummary({ from, to });
        if (!cancelled) setSummary(data?.data ?? data);
      } catch {
        if (!cancelled) setSummary(null);
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [from, to]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setDailyLoading(true);
      try {
        const { data } = await bookingRevenueService.getDaily({ date: selectedDate });
        if (!cancelled) setDaily(data?.data ?? data);
      } catch {
        if (!cancelled) setDaily(null);
      } finally {
        if (!cancelled) setDailyLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [selectedDate]);

  const chartData = useMemo(() => (summary?.byDay || []).map((d) => ({
    date: d.date, label: formatShortDate(d.date), total: d.total ?? 0, count: d.count ?? 0,
  })), [summary]);

  const avgDaily = useMemo(() => {
    if (!summary?.collected) return null;
    return summary.collected.total / daysBetweenInclusive(from, to);
  }, [summary, from, to]);

  return (
    <div>
      {onBack && (
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: t.accentText, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, marginBottom: 14,
        }}>
          <TbArrowRight size={16} /> رجوع للتقارير
        </button>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: t.accentGradientSoft, color: t.accent, display: "grid", placeItems: "center", fontSize: 20 }}>
              <TbCashBanknote />
            </div>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: t.text }}>تقرير إيرادات الحجوزات والمحاسبة العامة</h2>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: t.textSec }}>
            إيرادات على أساس نقدي (Cash Basis) — دفعات الطلاب الفعلية المقبوضة خلال الفترة
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
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

      <div className="dashboard-stack">
        {summaryLoading ? <SkeletonStatsGrid t={t} /> : !summary ? (
          <div style={{ ...cardStyle(t), height: "auto" }}>
            <div style={emptyStateStyle(t)}>تعذر تحميل ملخص الإيرادات لهذه الفترة</div>
          </div>
        ) : (
          <div className="dashboard-stats-grid">
            <StatCardEx
              label="إجمالي المقبوض الفعلي"
              value={formatMoney(summary.collected?.total)}
              sub={`كاش: ${formatMoney(summary.collected?.cash)} — شام كاش: ${formatMoney(summary.collected?.shamCash)}`}
              color={t.accent}
              icon={<TbCashBanknote size={22} />}
              t={t}
            />
            <StatCard label="عدد الحركات النقدية" value={String(summary.collected?.count ?? 0)} color={t.completed.text} icon={<TbCoins size={22} />} t={t} />
            <StatCardEx
              label="المستحقات القادمة المتوقعة"
              value={formatMoney(summary.upcomingDues?.total)}
              sub={`${summary.upcomingDues?.bookingsCount ?? 0} حجز قادم`}
              color={t.pending.text}
              icon={<TbHourglass size={22} />}
              t={t}
            />
            <StatCard label="معدل الدخل اليومي" value={formatMoney(avgDaily)} color={t.confirmed.text} icon={<TbTrendingUp size={22} />} t={t} />
          </div>
        )}

        <div style={cardStyle(t)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
            <div style={cardTitleStyle(t)}><TbTrendingUp size={16} /> التوزيع اليومي للإيرادات</div>
            <div style={{ fontSize: 12, color: t.textMuted }}>اضغط على أي يوم لعرض تفاصيله بالأسفل</div>
          </div>
          {summaryLoading ? (
            <div style={{ height: 220 }}><SkeletonRows t={t} rows={5} cols={1} /></div>
          ) : !chartData.length ? (
            <div style={emptyStateStyle(t)}>لا توجد إيرادات مقبوضة خلال هذه الفترة</div>
          ) : (
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={t.border} />
                  <XAxis dataKey="label" tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={{ stroke: t.border }} tickLine={false} />
                  <YAxis tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip content={<ChartTooltip t={t} valueFormatter={(v) => formatMoney(v)} />} cursor={{ fill: t.bgElevated }} />
                  <Bar dataKey="total" name="المقبوض" radius={[4, 4, 0, 0]} maxBarSize={26} cursor="pointer"
                    onClick={(barItem) => { if (barItem.payload?.date) setSelectedDate(barItem.payload.date); }}>
                    {chartData.map((d) => (
                      <Cell key={d.date} fill={d.date === selectedDate ? t.accent : t.accentLight} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div style={{ ...cardStyle(t), height: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
            <div style={cardTitleStyle(t)}><TbReceipt size={16} /> كشف الدفعات التفصيلي — {formatDateOnly(selectedDate)}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => setSelectedDate((d) => shiftDateStr(d, -1))} style={{
                width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated,
                color: t.text, display: "grid", placeItems: "center", cursor: "pointer",
              }}><TbChevronRight size={16} /></button>
              <input type="date" value={selectedDate} onChange={(ev) => setSelectedDate(ev.target.value)} style={{
                padding: "8px 10px", borderRadius: 8, border: `0.5px solid ${t.border}`, background: t.bgElevated,
                color: t.text, fontSize: 12, fontWeight: 600, colorScheme: dark ? "dark" : "light",
              }} />
              <button onClick={() => setSelectedDate((d) => shiftDateStr(d, 1))} style={{
                width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.border}`, background: t.bgElevated,
                color: t.text, display: "grid", placeItems: "center", cursor: "pointer",
              }}><TbChevronLeft size={16} /></button>
            </div>
          </div>

          {dailyLoading ? (
            <>
              <SkeletonRows t={t} rows={1} cols={4} />
              <div style={{ height: 16 }} />
              <SkeletonRows t={t} rows={4} cols={6} />
            </>
          ) : !daily ? (
            <div style={emptyStateStyle(t)}>تعذر تحميل تفاصيل هذا اليوم</div>
          ) : (
            <>
              <div className="dashboard-stats-grid" style={{ marginBottom: 18 }}>
                <StatCard label="إجمالي مقبوض اليوم" value={formatMoney(daily.total)} color={t.accent} icon={<TbCashBanknote size={20} />} t={t} />
                <StatCard label="عدد الدفعات" value={String(daily.count ?? 0)} color={t.completed.text} icon={<TbCoins size={20} />} t={t} />
                <StatCard label="عرابين (DEPOSIT)" value={formatMoney(daily.deposit)} color={t.confirmed.text} icon={<TbHourglass size={20} />} t={t} />
                <StatCard label="تكملات (REMAINDER)" value={formatMoney(daily.remainder)} color={t.pending.text} icon={<TbReceipt size={20} />} t={t} />
              </div>

              {!daily.payments?.length ? (
                <div style={emptyStateStyle(t)}>لا توجد دفعات مقبوضة في هذا اليوم</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 720 }}>
                    <thead>
                      <tr style={{ background: t.bgElevated }}>
                        {["الطالب", "موعد الدرس", "نوع الدفعة", "طريقة الدفع", "وقت القبض", "المبلغ"].map((h) => (
                          <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: t.textMuted, fontWeight: 600, fontSize: 12, borderBottom: `0.5px solid ${t.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {daily.payments.map((p, i) => (
                        <tr key={p.paymentId} style={{ background: i % 2 === 0 ? t.bgSurface : t.bgPage, borderBottom: `0.5px solid ${t.border}` }}>
                          <td style={{ padding: "10px 12px", color: t.text, fontWeight: 600 }}>{p.studentName || "—"}</td>
                          <td style={{ padding: "10px 12px", color: t.textSec }}>{formatDateTime24(p.lessonAt)}</td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                              background: p.kind === "DEPOSIT" ? t.confirmed.bg : t.pending.bg,
                              color: p.kind === "DEPOSIT" ? t.confirmed.text : t.pending.text,
                            }}>{PAYMENT_KIND_LABELS[p.kind] || p.kind}</span>
                          </td>
                          <td style={{ padding: "10px 12px" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                              background: p.paymentMethod === "CASH" ? t.completed.bg : t.confirmed.bg,
                              color: p.paymentMethod === "CASH" ? t.completed.text : t.confirmed.text,
                            }}>{PAYMENT_METHOD_LABELS[p.paymentMethod] || p.paymentMethod}</span>
                          </td>
                          <td style={{ padding: "10px 12px", color: t.text }}>{formatDateTime24(p.receivedAt)}</td>
                          <td style={{ padding: "10px 12px", color: t.text, fontWeight: 700 }}>{formatMoney(p.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
