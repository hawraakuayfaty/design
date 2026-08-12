import { useState, useEffect, useMemo } from "react";
import { generalExpensesService } from "./api";
import { todayStr, firstOfMonthStr } from "./utils/dateUtils";
import { StatCard } from "./components/ui";
import {
  TbArrowRight, TbReportMoney, TbReceipt2, TbDroplet, TbBolt, TbWifi,
  TbToolsKitchen2, TbNotebook, TbDotsCircleHorizontal, TbChevronRight, TbChevronLeft, TbFilter,
} from "react-icons/tb";

// ═══════════════════════════════════════════════
// LOCAL CONSTANTS & MAPS
// ═══════════════════════════════════════════════
const PAYMENT_METHOD_LABELS = { CASH: "نقداً", SHAM_CASH: "شام كاش" };
const PAYMENT_METHOD_FILTER_OPTIONS = [
  { value: "", label: "كل طرق الدفع" },
  { value: "CASH", label: "نقداً" },
  { value: "SHAM_CASH", label: "شام كاش" },
];

// نفس لوحة الألوان الستّ CVD-safe المعتمدة في VehicleReportDashboard (EXPENSE_REASON_META) —
// معاد استخدامها هنا لأنواع المصاريف العامة الست، دون إعادة تحقق من التباين (نفس السطح: بطاقات فاتحة/غامقة)
const GENERAL_EXPENSE_TYPE_META = {
  WATER: { label: "مياه", Icon: TbDroplet, colorLight: "#2a78d6", colorDark: "#3987e5" },
  ELECTRICITY: { label: "كهرباء", Icon: TbBolt, colorLight: "#eda100", colorDark: "#c98500" },
  INTERNET: { label: "إنترنت", Icon: TbWifi, colorLight: "#1baf7a", colorDark: "#199e70" },
  KITCHEN: { label: "مطبخ", Icon: TbToolsKitchen2, colorLight: "#e87ba4", colorDark: "#d55181" },
  SUPPLIES: { label: "قرطاسية ولوازم", Icon: TbNotebook, colorLight: "#008300", colorDark: "#008300" },
  OTHER: { label: "غير ذلك", Icon: TbDotsCircleHorizontal, colorLight: "#eb6834", colorDark: "#d95926" },
};
const EXPENSE_TYPE_FILTER_OPTIONS = [
  { value: "", label: "كل الأنواع" },
  ...Object.entries(GENERAL_EXPENSE_TYPE_META).map(([value, meta]) => ({ value, label: meta.label })),
];

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

function isDarkTheme(t) {
  return t.bgSurface === "#27272a";
}

function typeColor(type, dark) {
  const meta = GENERAL_EXPENSE_TYPE_META[type];
  if (!meta) return "#9aa08c";
  return dark ? meta.colorDark : meta.colorLight;
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

function pageBtnStyle(t, disabled) {
  return {
    width: 32, height: 32, borderRadius: 8, border: `1px solid ${t.border}`,
    background: t.bgElevated, color: disabled ? t.textMuted : t.text,
    display: "grid", placeItems: "center", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
  };
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

function TypeBadge({ type, dark, t }) {
  const meta = GENERAL_EXPENSE_TYPE_META[type];
  const Icon = meta?.Icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: typeColor(type, dark), flexShrink: 0 }} />
      {Icon && <Icon size={14} color={t.textSec} />}
      {meta?.label || type}
    </span>
  );
}

function PaymentMethodBadge({ method, t }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
      background: method === "CASH" ? t.completed.bg : t.confirmed.bg,
      color: method === "CASH" ? t.completed.text : t.confirmed.text,
    }}>{PAYMENT_METHOD_LABELS[method] || method}</span>
  );
}

function SkeletonLine({ t, w = "100%", h = 14 }) {
  return <div className="skeleton-pulse" style={skeletonStyle(t, { width: w, height: h })} />;
}

function SkeletonStatsGrid({ t, cols = 2 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))`, gap: 14 }}>
      {Array.from({ length: cols }).map((_, i) => (
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
            <SkeletonLine key={ci} t={t} w={ci === 0 ? "16%" : "18%"} h={14} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════
export default function GeneralExpensesReportDashboard({ t, onBack }) {
  const dark = isDarkTheme(t);

  const [summaryFrom, setSummaryFrom] = useState(firstOfMonthStr());
  const [summaryTo, setSummaryTo] = useState(todayStr());
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [filterType, setFilterType] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [page, setPage] = useState(1);

  const [tableRows, setTableRows] = useState([]);
  const [tableTotals, setTableTotals] = useState({ totalAmount: 0, totalCash: 0, totalShamCash: 0 });
  const [tableMeta, setTableMeta] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [tableLoading, setTableLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSummaryLoading(true);
      try {
        const { data } = await generalExpensesService.getSummary({ from: summaryFrom, to: summaryTo });
        if (!cancelled) setSummary(data?.data ?? data);
      } catch {
        if (!cancelled) setSummary(null);
      } finally {
        if (!cancelled) setSummaryLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [summaryFrom, summaryTo]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setTableLoading(true);
      try {
        const params = { page, limit: 20 };
        if (filterType) params.type = filterType;
        if (filterPaymentMethod) params.paymentMethod = filterPaymentMethod;
        if (filterFrom) params.from = filterFrom;
        if (filterTo) params.to = filterTo;
        const { data } = await generalExpensesService.getAll(params);
        const payload = data?.data ?? data;
        if (!cancelled) {
          setTableRows(payload?.data || []);
          setTableTotals(payload?.totals || { totalAmount: 0, totalCash: 0, totalShamCash: 0 });
          setTableMeta(payload?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 });
        }
      } catch {
        if (!cancelled) {
          setTableRows([]);
          setTableTotals({ totalAmount: 0, totalCash: 0, totalShamCash: 0 });
          setTableMeta({ total: 0, page: 1, limit: 20, totalPages: 0 });
        }
      } finally {
        if (!cancelled) setTableLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [filterType, filterPaymentMethod, filterFrom, filterTo, page]);

  const byTypeBreakdown = useMemo(() => {
    const byType = summary?.byType;
    if (!byType) return [];
    const list = Object.keys(GENERAL_EXPENSE_TYPE_META)
      .map((type) => ({ type, ...byType[type.toLowerCase()] }))
      .filter((r) => r.total > 0);
    const total = list.reduce((sum, r) => sum + r.total, 0);
    if (!total) return [];
    return list.map((r) => ({ ...r, pct: Math.round((r.total / total) * 1000) / 10 }));
  }, [summary]);

  const clearTableFilters = () => {
    setFilterType(""); setFilterPaymentMethod(""); setFilterFrom(""); setFilterTo(""); setPage(1);
  };

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
              <TbReportMoney />
            </div>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: t.text }}>تقرير المصاريف العامة</h2>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: t.textSec }}>
            عرض وتحليل فقط — مياه، كهرباء، إنترنت، مطبخ، قرطاسية، وغير ذلك
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted }}>من</label>
          <input type="date" value={summaryFrom} onChange={(ev) => setSummaryFrom(ev.target.value)} style={{
            padding: "9px 12px", borderRadius: 10, border: `1px solid ${t.border}`,
            background: t.bgSurface, color: t.text, fontSize: 13, fontWeight: 600, colorScheme: dark ? "dark" : "light",
          }} />
          <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted }}>إلى</label>
          <input type="date" value={summaryTo} onChange={(ev) => setSummaryTo(ev.target.value)} style={{
            padding: "9px 12px", borderRadius: 10, border: `1px solid ${t.border}`,
            background: t.bgSurface, color: t.text, fontSize: 13, fontWeight: 600, colorScheme: dark ? "dark" : "light",
          }} />
        </div>
      </div>

      <div className="dashboard-stack">
        {summaryLoading ? <SkeletonStatsGrid t={t} cols={2} /> : !summary ? (
          <div style={{ ...cardStyle(t), height: "auto" }}>
            <div style={emptyStateStyle(t)}>تعذر تحميل ملخص المصاريف العامة لهذه الفترة</div>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 14 }}>
              <StatCardEx
                label="إجمالي المصاريف"
                value={formatMoney(summary.totalAmount)}
                sub={`نقداً: ${formatMoney(summary.cash)} — شام كاش: ${formatMoney(summary.shamCash)}`}
                color={t.accent}
                icon={<TbReportMoney size={22} />}
                t={t}
              />
              <StatCard label="إجمالي عدد الفواتير" value={String(summary.totalCount ?? 0)} color={t.text} icon={<TbReceipt2 size={22} />} t={t} />
            </div>

            {byTypeBreakdown.length > 0 && (
              <div style={{ ...cardStyle(t), height: "auto" }}>
                <div style={cardTitleStyle(t)}><TbFilter size={16} /> توزيع المصاريف حسب النوع</div>
                <div style={{ display: "flex", height: 10, borderRadius: 6, overflow: "hidden", background: t.bgElevated }}>
                  {byTypeBreakdown.map((r, i) => (
                    <div key={r.type} title={`${GENERAL_EXPENSE_TYPE_META[r.type]?.label}: ${formatMoney(r.total)}`} style={{
                      width: `${r.pct}%`, background: typeColor(r.type, dark),
                      marginInlineEnd: i < byTypeBreakdown.length - 1 ? 2 : 0,
                    }} />
                  ))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
                  {byTypeBreakdown.map((r) => (
                    <div key={r.type} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.textSec }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: typeColor(r.type, dark), display: "inline-block" }} />
                      {GENERAL_EXPENSE_TYPE_META[r.type]?.label} ({r.count})
                      <span style={{ fontWeight: 700, color: t.text }}>{formatMoney(r.total)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div style={{ ...cardStyle(t), height: "auto" }}>
          <div style={cardTitleStyle(t)}><TbReceipt2 size={16} /> كشف المصاريف العامة</div>

          <div className="vrd-filter-bar" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: t.textMuted, fontSize: 12, fontWeight: 700 }}>
              <TbFilter size={14} /> تصفية:
            </div>
            <select value={filterType} onChange={(ev) => { setFilterType(ev.target.value); setPage(1); }} style={filterInputStyle(t)}>
              {EXPENSE_TYPE_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={filterPaymentMethod} onChange={(ev) => { setFilterPaymentMethod(ev.target.value); setPage(1); }} style={filterInputStyle(t)}>
              {PAYMENT_METHOD_FILTER_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <input type="date" value={filterFrom} title="من تاريخ" onChange={(ev) => { setFilterFrom(ev.target.value); setPage(1); }} style={{ ...filterInputStyle(t), colorScheme: dark ? "dark" : "light" }} />
            <span style={{ color: t.textMuted, fontSize: 12 }}>إلى</span>
            <input type="date" value={filterTo} title="إلى تاريخ" onChange={(ev) => { setFilterTo(ev.target.value); setPage(1); }} style={{ ...filterInputStyle(t), colorScheme: dark ? "dark" : "light" }} />
            {(filterType || filterPaymentMethod || filterFrom || filterTo) && (
              <button onClick={clearTableFilters} style={{ background: "none", border: "none", color: t.cancelled.text, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>مسح الفلاتر</button>
            )}
          </div>

          {tableLoading ? (
            <SkeletonRows t={t} rows={5} cols={5} />
          ) : (
            <>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center",
                background: t.accentLight, borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, fontWeight: 700, color: t.accentText,
              }}>
                <span>الإجمالي: {formatMoney(tableTotals.totalAmount)}</span>
                <span style={{ fontWeight: 600 }}>نقداً: {formatMoney(tableTotals.totalCash)}</span>
                <span style={{ fontWeight: 600 }}>شام كاش: {formatMoney(tableTotals.totalShamCash)}</span>
              </div>

              {!tableRows.length ? (
                <div style={emptyStateStyle(t)}>لا توجد مصاريف مطابقة لهذه الفلاتر</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 620 }}>
                    <thead>
                      <tr style={{ background: t.bgElevated }}>
                        {["التاريخ", "النوع", "المبلغ", "طريقة الدفع", "ملاحظات"].map((h) => (
                          <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: t.textMuted, fontWeight: 600, fontSize: 12, borderBottom: `0.5px solid ${t.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, i) => (
                        <tr key={row.expenseId} style={{ background: i % 2 === 0 ? t.bgSurface : t.bgPage, borderBottom: `0.5px solid ${t.border}` }}>
                          <td style={{ padding: "10px 12px", color: t.text }}>{formatDateOnly(row.expenseDate)}</td>
                          <td style={{ padding: "10px 12px", color: t.text }}><TypeBadge type={row.type} dark={dark} t={t} /></td>
                          <td style={{ padding: "10px 12px", color: t.text, fontWeight: 700 }}>{formatMoney(row.amount)}</td>
                          <td style={{ padding: "10px 12px" }}><PaymentMethodBadge method={row.paymentMethod} t={t} /></td>
                          <td style={{ padding: "10px 12px", color: t.textSec }}>{row.note || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tableMeta.totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
                  <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={pageBtnStyle(t, page <= 1)}>
                    <TbChevronRight size={16} />
                  </button>
                  <span style={{ fontSize: 13, color: t.textSec, fontWeight: 600 }}>صفحة {tableMeta.page} من {tableMeta.totalPages}</span>
                  <button disabled={page >= tableMeta.totalPages} onClick={() => setPage((p) => Math.min(tableMeta.totalPages, p + 1))} style={pageBtnStyle(t, page >= tableMeta.totalPages)}>
                    <TbChevronLeft size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
