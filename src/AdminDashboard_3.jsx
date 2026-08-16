import { useState, useEffect, Component } from "react";
import { todayStr, firstOfMonthStr } from "./utils/dateUtils";
import qeyadahLogo from "./assets/qeyadah-logo.jpg";
import AdminPro from "./AdminPro";
import AccountantPro from "./AccountantPro";
import ReceptionistPro from "./ReceptionistPro";
import VehicleReportDashboard from "./VehicleReportDashboard";
import InstructorReportDashboard from "./InstructorReportDashboard";
import BookingRevenueReportDashboard from "./BookingRevenueReportDashboard";
import EmployeeReportDashboard from "./EmployeeReportDashboard";
import GeneralExpensesReportDashboard from "./GeneralExpensesReportDashboard";
import GovCertificateReportDashboard from "./GovCertificateReportDashboard";
import { studentsService, instructorsService, vehiclesService, dashboardService, accountingService, settingsService } from "./api";
import { useAuth } from "./contexts/useAuth";
import { P } from "./constants/roles";
import { PAGE_PERMISSIONS } from "./constants/pageAccess";
import { CiSettings } from "react-icons/ci";
import { PiChartLineDown, PiChartLineUp, PiUsersThin } from "react-icons/pi";
import { TbReport } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import { TbBus, TbUserDollar } from "react-icons/tb";
import { FaCar } from "react-icons/fa";

import { FaUserTie } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
import { GrSchedules } from "react-icons/gr";
import { FaChartLine } from "react-icons/fa6";
import { FaChartColumn } from "react-icons/fa6";
import { FaBellConcierge } from "react-icons/fa6";

import { LuX, LuEye, LuEyeOff, LuPencil, LuBan, LuLockOpen, LuCalendarDays } from "react-icons/lu";

import { MdAdminPanelSettings } from "react-icons/md";
import { PiMedalFill } from "react-icons/pi";
import { BsHourglassSplit } from "react-icons/bs";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { TbReportMoney } from "react-icons/tb";
import { BsPaperclip } from "react-icons/bs";

import { TbCalendarCancel } from "react-icons/tb";
import { MdOutlineCancel } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa6";


// ═══════════════════════════════════════════════
// DESIGN TOKENS — النموذج الأخضر
// ═══════════════════════════════════════════════
const tokens = {
  light: {
    bgPage: "#f4f5f0", // خلفية الصفحة متناسقة مع لون السايدبار
    bgSurface: "#ffffff",
    bgElevated: "#e8e9e4", // لون للبطاقات بتدرج أفتح قليلاً

    // الألوان الجديدة للسايدبار كما طلبتِ
    bgSidebar: "#f4f5f0", // لون الخلفية المطلوبة
    bgSidebarActive: "#778a3b", // لون العنصر عند الوقوف عليه

    bgHeader: "#ffffff",
    text: "#2c3024", // نص أساسي غامق لضمان الوضوح
    textSec: "#5a6150",
    textMuted: "#796c2c",
    textSidebar: "#715317", // لون الخط في السايدبار
    textSidebarActive: "#FFFFFF", // لون النص عند تفعيل العنصر (أبيض ليتضح فوق #715317)

    border: "#d9ddd0",
    borderCard: "rgba(113,83,23,0.2)",

    accent: "#715317", // اللون الأساسي المعتمد في التصميم
    accentLight: "#e9e3d6",
    accentText: "#715317",
    accentGradient: "linear-gradient(135deg, #796c2c 0%, #715317 100%)",
    accentGradientSoft:
      "linear-gradient(135deg, rgba(113,83,23,0.1) 0%, rgba(244,245,240,0.9) 100%)",

    // الحالات التشغيلية (تم ضبطها لتتناغم مع الألوان الدافئة)
    confirmed: { bg: "rgba(113,83,23,0.1)", text: "#715317" },
    pending: { bg: "rgba(201,124,40,0.14)", text: "#c98a28" },
    cancelled: { bg: "rgba(199,72,72,0.12)", text: "#c74848" },
    submitted: { bg: "rgba(113,83,23,0.08)", text: "#796c2c" },
    completed: { bg: "rgba(80,90,50,0.14)", text: "#505a32" },
    expired: { bg: "rgba(160,165,155,0.16)", text: "#747a70" },
    noshow: { bg: "rgba(199,72,72,0.12)", text: "#c74848" },
    inprogress: { bg: "rgba(113,83,23,0.12)", text: "#715317" },
    pendingDeposit: { bg: "rgba(191,173,64,0.16)", text: "#8a7d1e" },
    nonRefundable: { bg: "rgba(214,110,120,0.14)", text: "#b8505f" },
    availableRebooking: { bg: "rgba(59,130,246,0.14)", text: "#2563eb" },
  },

  dark: {
    bgPage: "#18181b",
    bgSurface: "#27272a",
    bgElevated: "#2d2d32",
    bgSidebar: "#1f1f23",
    bgSidebarActive: "#778a3b",
    bgHeader: "#27272a",
    text: "#f4f4f5",
    textSec: "#d4d4d8",
    textMuted: "#a1a1aa",
    textSidebar: "#f4f4f5",
    textSidebarActive: "#FFFFFF",
    border: "rgba(255,255,255,0.08)",
    borderCard: "rgba(255,255,255,0.10)",
    accent: "#a3c45a",
    accentLight: "rgba(119,138,59,0.22)",
    accentText: "#d4edaa",
    accentGradient: "linear-gradient(135deg,#778a3b 0%,#5f702d 100%)",
    accentGradientSoft:
      "linear-gradient(135deg, rgba(119,138,59,0.22) 0%, rgba(95,112,45,0.12) 100%)",

    confirmed: { bg: "rgba(119,138,59,0.22)", text: "#d4edaa" },
    pending: { bg: "rgba(201,138,40,0.22)", text: "#f0cb8c" },
    cancelled: { bg: "rgba(199,72,72,0.22)", text: "#fca5a5" },
    submitted: { bg: "rgba(119,138,59,0.18)", text: "#d4edaa" },
    completed: { bg: "rgba(63,107,58,0.26)", text: "#86efac" },
    expired: { bg: "rgba(161,161,170,0.14)", text: "#a1a1aa" },
    noshow: { bg: "rgba(199,72,72,0.20)", text: "#fca5a5" },
    inprogress: { bg: "rgba(119,124,59,0.18)", text: "#eef2e4" },
    pendingDeposit: { bg: "rgba(217,199,110,0.22)", text: "#e8d178" },
    nonRefundable: { bg: "rgba(214,110,120,0.24)", text: "#f0a3ac" },
    availableRebooking: { bg: "rgba(59,130,246,0.24)", text: "#93c5fd" },
  },
};
// ═══════════════════════════════════════════════
// NAVIGATION STRUCTURE
// ═══════════════════════════════════════════════
const navItems = [
  { id: "dashboard", label: "لوحة التحكم", icon: "⊞", page: "Dashboard" },
  {
    id: "AdminPro",
    label: "إدارة الأدمن الاحترافية",
    icon: <MdAdminPanelSettings />,
    page: "AdminProPage",
  },
  {
    id: "Receptionist",
    label: "شاشة الاستقبال والمتابعة",
    icon: <FaBellConcierge />,
    page: "ReceptionistPage",
  },
  {
    id: "accounting",
    label: "المحاسبة التشغيلية",
    icon: <FaChartColumn />,
    page: "Accounting",
  },
  {
    id: "AccountantPro",
    label: "لوحة الحسابات المتقدمة",
    icon: <FaChartLine />,
    page: "AccountantProPage",
  },
  {
    id: "bookings",
    label: "الحجز والجدولة",
    icon: <GrSchedules />,
    page: "Bookings",
  },
  {
    id: "students",
    label: "إدارة الطلاب",
    icon: <PiStudent />,
    page: "Students",
  },
  {
    id: "instructors",
    label: "إدارة المدربين",
    icon: <FaUserTie />,
    page: "Instructors",
  },
  {
    id: "vehicles",
    label: "إدارة المركبات",
    icon: <FaCar />,
    page: "Vehicles",
  },
  { id: "transport", label: "خدمة النقل", icon: <TbBus />, page: "Transport" },
  { id: "reports", label: "التقارير", icon: <TbReport />, page: "Reports" },
  {
    id: "users",
    label: "المستخدمون",
    icon: <PiUsersThin />,
    page: "Users",
    permission: P.USERS_READ,
  },
  {
    id: "settings",
    label: "إعدادات النظام",
    icon: <CiSettings />,
    page: "Settings",
    permission: P.SETTINGS_READ,
  },

  // ➕ ضيفي الموديولات الثلاثة الجديدة هنا أسفل القائمة:
];


// ═══════════════════════════════════════════════
// BADGE COMPONENT
// ═══════════════════════════════════════════════
function Badge({ status, t, color }) {
  const map = {
    "مؤكد":            t.confirmed,
    "بانتظار العربون": t.pending,
    "ملغي":            t.cancelled,
    "تم الإثبات":      t.submitted,
    "مكتمل":           t.completed,
    "منتهي":           t.expired,
    "لم يحضر":         t.noshow,
    "جاري":            t.inprogress,
    "عادي":            t.confirmed,
    "أوتوماتيك":       t.submitted,
    "نشط":             t.confirmed,
    "غير نشط":         t.expired,
    "في إجازة":        t.pending,
    "متاحة":           t.confirmed,
    "متاح":            t.confirmed,
    "في الصيانة":      t.pending,
    "غير متاحة":       t.cancelled,
    "مقبول":           t.completed,
    "راسب":            t.cancelled,
    "قيد المتابعة":    t.pending,
    "مدفوع":           t.completed,
    "معلق":            t.pending,
    "داخلي":           t.confirmed,
    "خارجي":           t.submitted,
    "ذكر":             t.confirmed,
    "أنثى":            t.submitted,
  };
  const resolved = color || map[status] || t.expired;
  return (
    <span style={{
      background: resolved.bg, color: resolved.text,
      padding: "4px 12px", borderRadius: 20,
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
      display: "inline-block", lineHeight: 1.4,
    }}>{status}</span>
  );
}

// ═══════════════════════════════════════════════
// STAT CARD
// ═══════════════════════════════════════════════
function StatCard({ label, value, color, icon, t }) {
  return (
    <div style={{
      background: t.bgSurface,
      borderRadius: 18,
      border: `1px solid ${t.borderCard}`,
      padding: "18px 18px 16px",
      display: "flex",
      flexDirection: "column", gap: 8,
      boxShadow: darkShadow(t),
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        display: "grid",
        placeItems: "center",
        background: t.accentGradientSoft,
        color: t.accent,
        fontSize: 20,
        lineHeight: 1,
      }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</div>
      <div style={{ fontSize: 13, color: t.textMuted }}>{label}</div>
    </div>
  );
}

function darkShadow(t) {
  return t.bgPage === "#020817"
    ? "0 18px 40px rgba(2, 8, 23, 0.34)"
    : "0 18px 24px rgba(15, 23, 42, 0.08)";
}

// ═══════════════════════════════════════════════
// TABLE WRAPPER
// ═══════════════════════════════════════════════
function Table({ headers, rows, t, minColWidths }) {
  // minColWidths sets a floor on total table width (auto layout, per-cell content still
  // decides each column's share) so badges/names get room to breathe instead of being
  // squeezed — the wrapper scrolls horizontally rather than clipping when space runs out.
  const tableMinWidth = minColWidths ? minColWidths.reduce((a, b) => a + b, 0) : undefined;
  return (
    <div style={{ borderRadius: 10, border: `0.5px solid ${t.border}`, overflowX: "auto", overflowY: "hidden" }}>
      <table style={{
        width: "100%", minWidth: tableMinWidth, borderCollapse: "collapse", fontSize: 14,
      }}>
        <thead>
          <tr style={{ background: t.bgElevated }}>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: "12px 16px", textAlign: "right",
                color: t.textMuted, fontWeight: 700,
                fontSize: 12, borderBottom: `0.5px solid ${t.border}`,
                whiteSpace: "nowrap",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{
              background: ri % 2 === 0 ? t.bgSurface : t.bgPage,
              borderBottom: `0.5px solid ${t.border}`,
            }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: "12px 16px", color: t.text, fontSize: 14,
                  lineHeight: 1.6, verticalAlign: "middle",
                }}>
                  {typeof cell === "string" && [
                    "مؤكد","بانتظار العربون","ملغي","تم الإثبات","مكتمل",
                    "منتهي","لم يحضر","جاري","نشط","غير نشط","في إجازة",
                    "متاحة","متاح","في الصيانة","غير متاحة","مقبول","راسب",
                    "قيد المتابعة","مدفوع","معلق","داخلي","خارجي",
                    "عادي","أوتوماتيك","ذكر","أنثى",
                  ].includes(cell)
                    ? <Badge status={cell} t={t} />
                    : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════
// SECTION HEADER
// ═══════════════════════════════════════════════
function SectionHeader({ title, subtitle, action, onAction, t }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: t.text, letterSpacing: "-0.02em" }}>
          {title}
        </h2>
        {subtitle && <p style={{ margin: "6px 0 0", fontSize: 14, color: t.textSec }}>{subtitle}</p>}
      </div>
      {action && (
        <button
          onClick={onAction}
          style={{
            background: "#778a3b",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 18px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: darkShadow(t),
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// ALERT BOX
// ═══════════════════════════════════════════════
function AlertBox({ items, t }) {
  if (!items.length) return null;
  return (
    <div style={{
      background: t.pending.bg, border: `0.5px solid ${t.pending.text}30`,
      borderRadius: 10, padding: "12px 16px", marginBottom: 20,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: t.pending.text, marginBottom: 8 }}>
        تنبيهات تحتاج متابعة
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ fontSize: 13, color: t.text, padding: "3px 0", display: "flex", gap: 8 }}>
          <span style={{ color: t.pending.text }}>•</span> {item}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: DASHBOARD
// ═══════════════════════════════════════════════
const DASHBOARD_TRAINING_TYPE_MAP = { MANUAL: "عادي", AUTOMATIC: "أوتوماتيك" };

// bookingStatus — enum مغلق موثق في reception-dashboard-api.md
const DASHBOARD_STATUS_META = {
  PENDING_PAYMENT: { label: "بانتظار الدفع",     color: (t) => t.pending },
  BOOKED:          { label: "مؤكد",              color: (t) => t.confirmed },
  COMPLETED:       { label: "مكتمل",             color: (t) => t.completed },
  NO_SHOW:         { label: "غائب",              color: (t) => t.noshow },
  CANCELLED:       { label: "ملغى",              color: (t) => t.cancelled },
  EXPIRED:         { label: "منتهي الصلاحية",    color: (t) => t.expired },
};

// paymentStatus — enum مغلق موثق في reception-dashboard-api.md
const DASHBOARD_PAYMENT_STATUS_META = {
  PENDING_DEPOSIT:                 { label: "بانتظار العربون",           color: (t) => t.pendingDeposit },
  DEPOSIT_PAID:                    { label: "العربون مدفوع",             color: (t) => t.pending },
  FULLY_PAID:                      { label: "مدفوع بالكامل",             color: (t) => t.completed },
  DEPOSIT_NON_REFUNDABLE:          { label: "العربون غير مسترد",         color: (t) => t.nonRefundable },
  DEPOSIT_AVAILABLE_FOR_REBOOKING: { label: "العربون متاح لإعادة الحجز", color: (t) => t.availableRebooking },
  DEPOSIT_USED_IN_REBOOKING:       { label: "العربون استُخدم للحجز",     color: (t) => t.expired },
};

const DASHBOARD_VEHICLE_STATUS_META = {
  AVAILABLE:      { label: "متاحة",      color: (t) => t.confirmed },
  IN_MAINTENANCE: { label: "في الصيانة", color: (t) => t.pending },
  INACTIVE:       { label: "متوقفة",     color: (t) => t.cancelled },
};

const DASHBOARD_INSTRUCTOR_TYPE_META = {
  MANUAL:    { label: "عادي",              color: (t) => t.confirmed },
  AUTOMATIC: { label: "أوتوماتيك",         color: (t) => t.submitted },
  BOTH:      { label: "عادي + أوتوماتيك", color: (t) => t.inprogress },
};

const DASHBOARD_INSTRUCTOR_AVAILABILITY_META = {
  AVAILABLE: { label: "متاح",           color: (t) => t.confirmed },
  ON_LEAVE:  { label: "في إجازة اليوم", color: (t) => t.pending },
};

// يحوّل أي قيمة enum قادمة من الـ API إلى Badge ملوّن — لا يسمح بتسرب نص إنجليزي خام أبداً،
// حتى لو وصلت قيمة غير موثقة (fallback رمادي محايد بدل النص الخام).
function metaBadge(meta, key, t) {
  const entry = meta[key];
  const label = entry?.label || key || "—";
  const color = entry?.color ? entry.color(t) : t.expired;
  return <Badge status={label} color={color} t={t} />;
}

function formatMoney(v) {
  if (v == null || v === "") return "—";
  const n = Number(v);
  return isNaN(n) ? String(v) : `${n.toLocaleString("en")} ل.س`;
}

function formatArabicDate(date) {
  return new Intl.DateTimeFormat("ar", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    numberingSystem: "latn",
  }).format(date);
}

function lessonVehicleLabel(lesson) {
  if (lesson.vehicleSource === "STUDENT_CAR") return "سيارة الطالب";
  return lesson.vehiclePlate || "سيارة المدرسة";
}

// leaves[] موثّق بحد أقصى فترة واحدة فعليًا لكل يوم — نعرض الأولى فقط
function instructorLeaveDetail(instructor) {
  if (instructor.availabilityToday !== "ON_LEAVE") return null;
  const leave = instructor.leaves?.[0];
  if (!leave) return null;
  return leave.isFullDay
    ? "إجازة يوم كامل"
    : `إجازة (من ${leave.fromTime} إلى ${leave.toTime})`;
}

function InstructorAvailabilityCell({ instructor, t }) {
  const detail = instructorLeaveDetail(instructor);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-start" }}>
      {metaBadge(DASHBOARD_INSTRUCTOR_AVAILABILITY_META, instructor.availabilityToday, t)}
      {detail && <Badge status={detail} color={t.pendingDeposit} t={t} />}
    </div>
  );
}

function MinutesLeftBadge({ minutesLeft, t }) {
  if (minutesLeft == null) return "—";
  const critical = minutesLeft <= 10;
  const warning = minutesLeft <= 30;
  const color = critical ? t.cancelled : warning ? t.pending : t.confirmed;
  return (
    <span style={{
      background: color.bg, color: color.text,
      padding: "4px 12px", borderRadius: 20,
      fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
      display: "inline-block", lineHeight: 1.4,
    }}>
      {minutesLeft} دقيقة {critical ? "⚠" : ""}
    </span>
  );
}

function PageDashboard({ t }) {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [fleet, setFleet] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [scope, setScope] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const [summaryRes, alertsRes, pendingRes, fleetRes] = await Promise.allSettled([
          dashboardService.getTodaySummary(),
          dashboardService.getAlerts(),
          dashboardService.getPendingPayments(),
          dashboardService.getFleetStatus(),
        ]);
        if (cancelled) return;

        setSummary(summaryRes.status === "fulfilled" ? (summaryRes.value.data?.data ?? summaryRes.value.data) : null);
        setAlerts(alertsRes.status === "fulfilled" ? (alertsRes.value.data?.data ?? alertsRes.value.data) : null);
        setFleet(fleetRes.status === "fulfilled" ? (fleetRes.value.data?.data ?? fleetRes.value.data) : null);

        const pendingBody = pendingRes.status === "fulfilled" ? (pendingRes.value.data?.data ?? pendingRes.value.data) : [];
        setPendingPayments(Array.isArray(pendingBody) ? pendingBody : []);

        if ([summaryRes, alertsRes, pendingRes, fleetRes].every((r) => r.status === "rejected")) {
          setLoadError("تعذر تحميل بيانات لوحة التحكم");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLessonsLoading(true);
      try {
        const { data } = await dashboardService.getTodayLessons({ scope });
        const body = data?.data ?? data;
        if (!cancelled) setLessons(Array.isArray(body) ? body : []);
      } catch {
        if (!cancelled) setLessons([]);
      } finally {
        if (!cancelled) setLessonsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [scope]);

  const alertItems = [];
  if (alerts) {
    if (alerts.pendingPaymentCount > 0) alertItems.push(`${alerts.pendingPaymentCount} إثباتات دفع بانتظار التحقق`);
    if (alerts.expiringHoldsCount > 0) alertItems.push(`${alerts.expiringHoldsCount} حجوزات مؤقتة على وشك الانتهاء`);
    if (alerts.vehiclesInMaintenanceCount > 0) alertItems.push(`${alerts.vehiclesInMaintenanceCount} مركبة في الصيانة`);
    if (alerts.instructorsOnLeaveTodayCount > 0) alertItems.push(`${alerts.instructorsOnLeaveTodayCount} مدرب في إجازة اليوم`);
  }

  const collectionDiff = summary ? (summary.todayCollection || 0) - (summary.yesterdayCollection || 0) : 0;
  const collectionTrendText = !summary
    ? "—"
    : collectionDiff > 0
    ? `ارتفاع ${formatMoney(collectionDiff)} عن أمس`
    : collectionDiff < 0
    ? `انخفاض ${formatMoney(Math.abs(collectionDiff))} عن أمس`
    : "بدون تغيير عن أمس";

  const heroPills = [
    `نسبة الإشغال ${summary?.occupancyRate != null ? `${summary.occupancyRate}%` : "—"}`,
    `${alerts?.pendingPaymentCount ?? 0} مدفوعات تنتظر تحقق`,
    `${alerts?.vehiclesInMaintenanceCount ?? 0} مركبة في الصيانة`,
  ];

  const statCards = [
    { label: "حجوزات اليوم", value: summary?.todayBookings ?? 0, color: t.accent, icon: <RiCalendarScheduleLine size={24} /> },
    { label: "مؤكدة", value: summary?.confirmed ?? 0, color: t.accent, icon: <FaRegCalendarCheck size={24} /> },
    { label: "بانتظار الدفع", value: summary?.pendingPayment ?? 0, color: "#c2410c", icon: <BsHourglassSplit size={24} /> },
    { label: "إثباتات معلقة", value: alerts?.pendingPaymentCount ?? 0, color: t.accent, icon: <BsPaperclip size={24} /> },
    { label: "دروس مكتملة", value: summary?.completed ?? 0, color: t.accent, icon: <PiMedalFill size={24} /> },
    { label: "لم يحضر", value: summary?.noShow ?? 0, color: t.accent, icon: <MdOutlineCancel size={24} /> },
    { label: "ملغية", value: summary?.cancelled ?? 0, color: "#b91c1c", icon: <TbCalendarCancel size={24} /> },
    { label: "إيرادات اليوم", value: formatMoney(summary?.todayCollection ?? 0), color: t.accent, icon: <TbReportMoney size={24} /> },
  ];

  const lessonRows = lessons.map((l) => [
    l.studentName || "—",
    l.instructorName || "—",
    `${l.startTime || "—"} — ${l.endTime || "—"}`,
    DASHBOARD_TRAINING_TYPE_MAP[l.trainingType] || l.trainingType || "—",
    lessonVehicleLabel(l),
    metaBadge(DASHBOARD_STATUS_META, l.bookingStatus, t),
    metaBadge(DASHBOARD_PAYMENT_STATUS_META, l.paymentStatus, t),
  ]);

  const pendingRows = pendingPayments.map((p) => [
    p.studentName || "—",
    formatMoney(p.amountDue),
    `${p.expiresDate || "—"} ${p.expiresTime || ""}`.trim(),
    <MinutesLeftBadge minutesLeft={p.minutesLeft} t={t} />,
  ]);

  const vehicleRows = (fleet?.vehicles || []).map((v) => [
    v.plateNumber || "—",
    DASHBOARD_TRAINING_TYPE_MAP[v.type] || v.type || "—",
    metaBadge(DASHBOARD_VEHICLE_STATUS_META, v.status, t),
  ]);

  const instructorRows = (fleet?.instructors || []).map((i) => [
    i.name || "—",
    metaBadge(DASHBOARD_INSTRUCTOR_TYPE_META, i.instructorType, t),
    <InstructorAvailabilityCell instructor={i} t={t} />,
  ]);

  return (
    <div className="dashboard-stack">
      <SectionHeader
        title="لوحة التحكم"
        subtitle={`${formatArabicDate(new Date())}${loading ? " • جارٍ التحميل..." : ""}`}
        t={t}
      />
      {loadError && (
        <div style={{
          background: t.cancelled.bg, border: `0.5px solid ${t.cancelled.text}30`,
          borderRadius: 10, padding: "12px 16px", marginBottom: 20,
          fontSize: 13, color: t.cancelled.text, fontWeight: 600,
        }}>
          {loadError}
        </div>
      )}
      <AlertBox t={t} items={alertItems} />

      <div className="dashboard-hero">
        <div
          className="dashboard-hero-card"
          style={{
            background: "#778a3b",
            borderRadius: 24,
            padding: 24,
            color: "#fff",
            boxShadow: darkShadow(t),
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.78, marginBottom: 12 }}>
            ملخص تشغيل اليوم
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 10,
            }}
          >
            نظرة تنفيذية سريعة على الأداء والحجوزات والتحصيل
          </div>
          <div
            style={{
              fontSize: 14,
              opacity: 0.88,
              maxWidth: 560,
              marginBottom: 20,
            }}
          >
            الواجهة الآن تبرز الأولويات مباشرة: ضغط الحجوزات، الطلبات المعلقة،
            والمركبات أو المدربين الذين يحتاجون متابعة فورية.
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {heroPills.map((item) => (
              <div
                key={item}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.16)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          <div
            className="dashboard-mini-card"
            style={{
              background: t.bgSurface,
              borderRadius: 20,
              border: `1px solid ${t.borderCard}`,
              padding: 20,
              boxShadow: darkShadow(t),
            }}
          >
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 8 }}>
              التحصيل
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: t.text,
                marginBottom: 6,
              }}
            >
              {formatMoney(summary?.todayCollection ?? 0)}
            </div>
            <div style={{ fontSize: 13, color: t.textSec }}>
              {collectionTrendText}
            </div>
          </div>
          <div
            className="dashboard-mini-card"
            style={{
              background: t.bgSurface,
              borderRadius: 20,
              border: `1px solid ${t.borderCard}`,
              padding: 20,
              boxShadow: darkShadow(t),
            }}
          >
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 8 }}>
              جاهزية التشغيل
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: t.text }}>
                  {summary?.completed ?? 0}
                </div>
                <div style={{ fontSize: 12, color: t.textSec }}>
                  دروس مكتملة
                </div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: t.text }}>
                  {summary?.noShow ?? 0}
                </div>
                <div style={{ fontSize: 12, color: t.textSec }}>حالة غياب</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        {statCards.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} color={s.color} icon={s.icon} t={t} />
        ))}
      </div>

      <div
        className="dashboard-panel"
        style={{
          background: t.bgSurface,
          borderRadius: 20,
          border: `1px solid ${t.borderCard}`,
          padding: 18,
          boxShadow: darkShadow(t),
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: t.text }}>
              الدروس القادمة اليوم
            </div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>
              ترتيب زمني مع إشارة سريعة إلى الدفع والحالة
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 4, background: t.bgElevated, borderRadius: 999, padding: 4 }}>
              {[
                { key: "upcoming", label: "القادمة" },
                { key: "all", label: "الكل" },
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setScope(opt.key)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    background: scope === opt.key ? t.accent : "transparent",
                    color: scope === opt.key ? "#fff" : t.textSec,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div
              style={{
                padding: "7px 12px",
                borderRadius: 999,
                background: t.accentLight,
                color: t.accentText,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {lessonsLoading ? "جارٍ التحميل..." : `${lessons.length} حصة مجدولة`}
            </div>
          </div>
        </div>
        <Table
          t={t}
          headers={[
            "الطالب",
            "المدرب",
            "الوقت",
            "النوع",
            "المركبة",
            "الحالة",
            "حالة الدفع",
          ]}
          rows={lessonRows}
          minColWidths={[170, 150, 110, 100, 140, 120, 200]}
        />
      </div>

      <div className="dashboard-panels-grid">
        <div
          className="dashboard-panel"
          style={{
            background: t.bgSurface,
            borderRadius: 20,
            border: `1px solid ${t.borderCard}`,
            padding: 18,
            boxShadow: darkShadow(t),
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: t.text,
              marginBottom: 12,
            }}
          >
            المركبات والمدربون
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 8 }}>
            المركبات
          </div>
          <Table
            t={t}
            headers={["المركبة", "النوع", "الحالة"]}
            rows={vehicleRows}
            minColWidths={[140, 120, 130]}
          />
          <div style={{ fontSize: 12, color: t.textMuted, margin: "14px 0 8px" }}>
            المدربون
          </div>
          <Table
            t={t}
            headers={["المدرب", "النوع", "الحالة اليوم"]}
            rows={instructorRows}
            minColWidths={[140, 160, 230]}
          />
        </div>
        <div
          className="dashboard-panel"
          style={{
            background: t.bgSurface,
            borderRadius: 20,
            border: `1px solid ${t.borderCard}`,
            padding: 18,
            boxShadow: darkShadow(t),
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: t.text,
              marginBottom: 12,
            }}
          >
            دفعات معلقة بانتظار الانتهاء
          </div>
          <Table
            t={t}
            headers={["الطالب", "المبلغ المستحق", "ينتهي في", "الوقت المتبقي"]}
            rows={pendingRows}
            minColWidths={[150, 140, 130, 140]}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: BOOKINGS
// ═══════════════════════════════════════════════
function PageBookings({ t }) {
  // removed unused view state
  return (
    <div>
      <SectionHeader title="الحجز والجدولة" subtitle="إدارة جميع الحجوزات من مكان واحد" action="+ حجز جديد" t={t} />

      {/* Filters */}
      <div style={{
        background: t.bgSurface, borderRadius: 10,
        border: `0.5px solid ${t.borderCard}`,
        padding: "14px 16px", marginBottom: 16,
        display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
      }}>
        <div style={{ fontSize: 12, color: t.textMuted, marginLeft: "auto" }}>فلتر:</div>
        {["نوع التدريب", "المدرب", "الحالة", "التاريخ"].map(f => (
          <select key={f} style={{
            padding: "6px 12px", borderRadius: 7,
            border: `0.5px solid ${t.border}`,
            background: t.bgElevated, color: t.text,
            fontSize: 12, cursor: "pointer",
          }}>
            <option>{f}</option>
          </select>
        ))}
        <button style={{
          padding: "6px 14px", borderRadius: 7,
          background: t.accentLight, color: t.accentText,
          border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
        }}>تطبيق</button>
      </div>

      {/* Booking States Legend */}
      <div style={{
        display: "flex", gap: 8, flexWrap: "wrap",
        marginBottom: 16,
      }}>
        {[
          ["مؤكد","confirmed"],["بانتظار العربون","pending"],
          ["تم الإثبات","submitted"],["مكتمل","completed"],
          ["ملغي","cancelled"],["منتهي","expired"],["لم يحضر","noshow"],
        ].map(([label]) => (
          <Badge key={label} status={label} t={t} />
        ))}
      </div>

      <Table t={t}
        headers={["#", "الطالب", "المدرب", "المركبة", "التاريخ", "الوقت", "النوع", "المصدر", "الحالة الحجز", "الدفع"]}
        rows={[
          ["#١٢٤٥", "أحمد محمد الحسن", "خالد عمر", "أ ب ج 101", "٤ يونيو", "09:00—10:30", "عادي", "إدارة", "مؤكد", "مكتمل"],
          ["#١٢٤٦", "سارة خالد يوسف", "ليلى سعد", "أ ب ج 202", "٤ يونيو", "10:30—12:00", "أوتوماتيك", "تطبيق", "بانتظار العربون", "معلق"],
          ["#١٢٤٧", "علي حسن محمود", "خالد عمر", "سيارة الطالب", "٤ يونيو", "12:00—13:30", "عادي", "مكالمة", "تم الإثبات", "معلق"],
          ["#١٢٤٨", "منى العلي سالم", "ليلى سعد", "أ ب ج 202", "٤ يونيو", "14:00—15:30", "أوتوماتيك", "تطبيق", "مؤكد", "مدفوع"],
          ["#١٢٤٩", "محمود سالم", "أحمد الزيد", "أ ب ج 101", "٤ يونيو", "15:30—17:00", "عادي", "إدارة", "مؤكد", "مدفوع"],
          ["#١٢٤٠", "نورا الأحمد", "خالد عمر", "أ ب ج 101", "٣ يونيو", "09:00—10:30", "عادي", "تطبيق", "مكتمل", "مدفوع"],
          ["#١٢٣٩", "كريم عبدو", "ليلى سعد", "أ ب ج 202", "٣ يونيو", "11:00—12:30", "أوتوماتيك", "مكالمة", "ملغي", "معلق"],
          ["#١٢٣٨", "هناء الصالح", "أحمد الزيد", "أ ب ج 101", "٣ يونيو", "14:00—15:30", "عادي", "إدارة", "لم يحضر", "معلق"],
        ]}
      />

      {/* New Booking Form hint */}
      <div style={{
        marginTop: 20, padding: "16px 20px",
        background: t.accentLight, borderRadius: 10,
        border: `0.5px solid ${t.accentText}30`,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.accentText, marginBottom: 8 }}>
          شاشة إنشاء حجز جديد — خطوات الفلتر
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["١. اختيار الطالب", "٢. نوع التدريب", "٣. مصدر المركبة", "٤. جنس المدرب", "٥. المدرب (اختياري)", "٦. الأوقات المتاحة", "٧. تأكيد + عربون"].map((s, i) => (
            <div key={i} style={{
              padding: "5px 12px", borderRadius: 6,
              background: t.bgSurface, color: t.text,
              fontSize: 12, border: `0.5px solid ${t.border}`,
            }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: STUDENTS
// ═══════════════════════════════════════════════
const STUDENT_STATUS_MAP = {
  IN_TRAINING: "قيد التدريب",
  PASSED: "مكتمل",
  FAILED: "راسب",
  CERTIFICATE_SEEKER: "طلب شهادة",
};

const STUDENT_FILTER_OPTIONS = [
  { value: "", label: "كل الحالات" },
  { value: "IN_TRAINING", label: "قيد التدريب" },
  { value: "PASSED", label: "مكتمل" },
  { value: "FAILED", label: "راسب" },
  { value: "CERTIFICATE_SEEKER", label: "طلب شهادة" },
];

// certificateStatus (GET /students) — null يعني لم يتقدّم لطلب شهادة أبداً
const CERTIFICATE_STATUS_MAP = {
  WAITING_FOR_TRAINING_SCHEDULE: "بانتظار جدولة تدريب",
  IN_GOVERNMENT_TRAINING: "ضمن دورة تدريب",
  WAITING_FOR_THEORETICAL_EXAM: "بانتظار الامتحان النظري",
  WAITING_FOR_PRACTICAL_EXAM: "بانتظار الامتحان العملي",
  COMPLETED: "نال الرخصة",
  FAILED: "راسب بالشهادة",
  CANCELLED: "طلب ملغى",
};

// تواريخ خام "YYYY-MM-DD" (lastCompletedBookingDate) — تُبنى محلياً بدل new Date(iso)
// لتفادي انزياح يوم كامل عند مستخدمين غرب UTC (لا يوجد توقيت مرفق بها أصلاً)
function formatDateOnly(dateStr) {
  if (!dateStr) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(dateStr));
  if (!m) return String(dateStr);
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return new Intl.DateTimeFormat("ar", { day: "numeric", month: "long", year: "numeric", numberingSystem: "latn" }).format(d);
}

function AddStudentModal({ t, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^09\d{8}$/.test(form.phone.trim())) e.phone = "رقم الهاتف غير صالح (مثال: 0991234567)";
    if (!form.password) e.password = "كلمة المرور مطلوبة";
    else if (form.password.length < 4) e.password = "كلمة المرور قصيرة جداً";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    try {
      await studentsService.create({
        name: form.name.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء الإضافة");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 14,
    outline: "none", transition: "border-color 0.2s",
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 440, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>إضافة طالب جديد</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>

        {serverError && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#c74848",
          }}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>الاسم الكامل</label>
            <input value={form.name} onChange={(ev) => { setForm({ ...form, name: ev.target.value }); setErrors({ ...errors, name: undefined }); }}
              placeholder="مثال: أحمد محمد الحسن" style={fieldStyle("name")} />
            {errors.name && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.name}</div>}
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>رقم الهاتف</label>
            <input value={form.phone} onChange={(ev) => { setForm({ ...form, phone: ev.target.value }); setErrors({ ...errors, phone: undefined }); }}
              placeholder="0991234567" dir="ltr" style={{ ...fieldStyle("phone"), textAlign: "left" }} />
            {errors.phone && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.phone}</div>}
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>كلمة المرور</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(ev) => { setForm({ ...form, password: ev.target.value }); setErrors({ ...errors, password: undefined }); }}
                placeholder="كلمة مرور الحساب" style={{ ...fieldStyle("password"), paddingLeft: 36 }} />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: t.textMuted, display: "flex", alignItems: "center", padding: 0, fontSize: 16 }}>
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            {errors.password && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.password}</div>}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: "12px", borderRadius: 12,
              background: submitting ? t.textMuted : "#778a3b",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}>{submitting ? "جارٍ الحفظ..." : "حفظ الطالب"}</button>
            <button type="button" onClick={onClose} style={{
              padding: "12px 20px", borderRadius: 12,
              background: t.bgElevated, color: t.textSec,
              border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600,
              cursor: "pointer",
            }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditStudentModal({ t, student, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: student.user?.name || student.name || "",
    phone: student.user?.phone || student.phone || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^09\d{8}$/.test(form.phone.trim())) e.phone = "رقم الهاتف غير صالح (مثال: 0991234567)";
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
      await studentsService.update(student.studentId ?? student.id, {
        name: form.name.trim(),
        phone: form.phone.trim(),
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء تعديل بيانات الطالب");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 14,
    outline: "none", transition: "border-color 0.2s",
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 440, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>تعديل معلومات الطالب</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>

        {serverError && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#c74848",
          }}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>الاسم الكامل</label>
            <input value={form.name} onChange={(ev) => { setForm({ ...form, name: ev.target.value }); setErrors({ ...errors, name: undefined }); }}
              style={fieldStyle("name")} />
            {errors.name && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.name}</div>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>رقم الهاتف</label>
            <input value={form.phone} onChange={(ev) => { setForm({ ...form, phone: ev.target.value }); setErrors({ ...errors, phone: undefined }); }}
              dir="ltr" style={{ ...fieldStyle("phone"), textAlign: "left" }} />
            {errors.phone && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.phone}</div>}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: "12px", borderRadius: 12,
              background: submitting ? t.textMuted : "#778a3b",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
            }}>{submitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}</button>
            <button type="button" onClick={onClose} style={{
              padding: "12px 20px", borderRadius: 12,
              background: t.bgElevated, color: t.textSec,
              border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600,
              cursor: "pointer",
            }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BlockStudentConfirm({ t, student, onClose, onSuccess }) {
  const isBlocked = (student.user?.accountStatus || student.accountStatus) === "BLOCKED";
  const name = student.user?.name || student.name || "الطالب";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");
    setSubmitting(true);
    try {
      await studentsService.setBlocked(student.studentId ?? student.id, !isBlocked);
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join("، ") : msg || `حدث خطأ أثناء ${isBlocked ? "إلغاء حظر" : "حظر"} الطالب`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 400, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text }}>{isBlocked ? "إلغاء حظر الطالب" : "حظر الطالب"}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>
        <div style={{
          padding: "10px 12px", borderRadius: 9, background: t.cancelled.bg,
          marginBottom: 16, fontSize: 13, color: t.cancelled.text,
        }}>
          {isBlocked
            ? `هل أنت متأكد من إلغاء حظر الطالب ${name}؟ سيعود الحساب نشطاً.`
            : `هل أنت متأكد من حظر الطالب ${name}؟ لن يتمكن من الحجز أو تسجيل الدخول.`}
        </div>
        {error && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#c74848",
          }}>{error}</div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleConfirm} disabled={submitting} style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: submitting ? t.textMuted : "#c74848",
            color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
            cursor: submitting ? "not-allowed" : "pointer",
          }}>{submitting ? "جارٍ التنفيذ..." : (isBlocked ? "تأكيد إلغاء الحظر" : "تأكيد الحظر")}</button>
          <button onClick={onClose} style={{
            padding: "12px 20px", borderRadius: 12,
            background: t.bgElevated, color: t.textSec,
            border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// GET /students قد يرجّع مصفوفة مباشرة، أو { data: [...] }، أو { data: { data: [...], meta } } (شكل مُصفَّح) —
// نطبّع الشكل دائماً لمصفوفة لتفادي "students.map is not a function" أياً كان شكل غلاف الاستجابة.
function extractStudentList(raw) {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.data?.data)) return raw.data.data;
  return [];
}

const STUDENT_TABLE_HEADERS = ["الاسم الكامل", "رقم الهاتف", "الحالة", "حالة الحساب", "الدروس المكتملة", "آخر درس مكتمل", "حالة الشهادة", "إجراءات"];
const STUDENT_TABLE_ALIGN = ["right", "right", "center", "center", "center", "right", "center", "center"];

// نمط موحّد لأزرار عمود الإجراءات بجدول الطلاب — نفس القياسات لثلاثتها (Flex Row صغير الحجم)
function studentActionBtnStyle(bg, color, border) {
  return {
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "5px 11px", borderRadius: 7,
    background: bg, color, border: border || "none",
    fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
    whiteSpace: "nowrap",
  };
}

const STUDENT_BOOKING_STATUS_OPTIONS = [
  { value: "", label: "كل الحالات" },
  { value: "PENDING_PAYMENT", label: "بانتظار الدفع" },
  { value: "BOOKED", label: "مؤكد" },
  { value: "COMPLETED", label: "مكتمل" },
  { value: "NO_SHOW", label: "غائب" },
  { value: "CANCELLED", label: "ملغى" },
  { value: "EXPIRED", label: "منتهي الصلاحية" },
];

// GET /students/:studentId/bookings — ملاحظة: studentId هون، مش user id (نفس تحذير القائمة الرئيسية)
function StudentBookingsModal({ t, student, onClose }) {
  const studentId = student.studentId ?? student.id;
  const studentName = student.user?.name || student.name || "الطالب";

  const [bookings, setBookings] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [bookingStatus, setBookingStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payNotice, setPayNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const params = { page, limit: 20 };
        if (bookingStatus) params.bookingStatus = bookingStatus;
        const { data } = await studentsService.getBookings(studentId, params);
        const body = data?.data ?? data;
        if (!cancelled) {
          setBookings(Array.isArray(body?.data) ? body.data : []);
          setMeta(body?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 });
        }
      } catch (err) {
        if (!cancelled) {
          setBookings([]);
          const msg = err.response?.data?.message;
          setError(Array.isArray(msg) ? msg.join("، ") : msg || "تعذر تحميل حجوزات الطالب");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [studentId, page, bookingStatus]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgPage, borderRadius: 20, width: "100%", maxWidth: 920,
        border: `1px solid ${t.borderCard}`, boxShadow: "0 24px 48px rgba(0,0,0,0.25)",
        padding: "26px 24px 30px", maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>حجوزات الطالب</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: t.textSec }}>{studentName}</p>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <select value={bookingStatus} onChange={(e) => { setBookingStatus(e.target.value); setPage(1); }} style={{
            padding: "8px 12px", borderRadius: 7, border: `0.5px solid ${t.border}`,
            background: t.bgElevated, color: t.text, fontSize: 12,
          }}>
            {STUDENT_BOOKING_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {payNotice && (
          <div style={{
            background: t.accentLight, border: `0.5px solid ${t.accentText}40`,
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: t.accentText }}>{payNotice}</span>
            <button onClick={() => setPayNotice("")} style={{ background: "none", border: "none", cursor: "pointer", color: t.accentText, lineHeight: 1 }}><LuX size={14} /></button>
          </div>
        )}

        {error && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#c74848",
          }}>{error}</div>
        )}

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>جارٍ التحميل...</div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>لا توجد حجوزات لهذا الطالب</div>
        ) : (
          <>
            <Table
              t={t}
              headers={["المدرب", "التاريخ", "الوقت", "النوع", "المركبة", "حالة الحجز", "حالة الدفع", "المتبقي"]}
              rows={bookings.map((b) => [
                b.instructorName || "—",
                formatDateOnly(b.date),
                `${b.startTime || "—"} — ${b.endTime || "—"}`,
                DASHBOARD_TRAINING_TYPE_MAP[b.trainingType] || b.trainingType || "—",
                lessonVehicleLabel(b),
                metaBadge(DASHBOARD_STATUS_META, b.bookingStatus, t),
                metaBadge(DASHBOARD_PAYMENT_STATUS_META, b.paymentStatus, t),
                b.remainingAmount != null ? (
                  <button onClick={() => setPayNotice(`يتم تحصيل المبلغ المتبقي (${Number(b.remainingAmount).toLocaleString("en")} ل.س) من شاشة الاستقبال`)} style={{
                    padding: "5px 12px", borderRadius: 7, background: t.pending.bg, color: t.pending.text,
                    border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                  }}>تحصيل الباقي — {Number(b.remainingAmount).toLocaleString("en")} ل.س</button>
                ) : "—",
              ])}
              minColWidths={[140, 130, 110, 100, 140, 120, 140, 170]}
            />
            {meta.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 14 }}>
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} style={{
                  padding: "5px 12px", borderRadius: 7, border: `1px solid ${t.border}`, background: t.bgElevated,
                  color: page <= 1 ? t.textMuted : t.text, fontSize: 12, cursor: page <= 1 ? "not-allowed" : "pointer",
                }}>السابق</button>
                <span style={{ fontSize: 12, color: t.textMuted }}>{page} / {meta.totalPages}</span>
                <button disabled={page >= meta.totalPages} onClick={() => setPage((p) => p + 1)} style={{
                  padding: "5px 12px", borderRadius: 7, border: `1px solid ${t.border}`, background: t.bgElevated,
                  color: page >= meta.totalPages ? t.textMuted : t.text, fontSize: 12, cursor: page >= meta.totalPages ? "not-allowed" : "pointer",
                }}>التالي</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PageStudents({ t }) {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission(P.STUDENTS_CREATE);
  const canUpdate = hasPermission(P.STUDENTS_UPDATE);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [blockTarget, setBlockTarget] = useState(null);
  const [bookingsStudent, setBookingsStudent] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      const { data } = await studentsService.getAll(params);
      setStudents(extractStudentList(data));
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (statusFilter) params.status = statusFilter;
        const { data } = await studentsService.getAll(params);
        if (!cancelled) setStudents(extractStudentList(data));
      } catch {
        if (!cancelled) setStudents([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [search, statusFilter]);

  const isBlocked = (student) => (student.user?.accountStatus || student.accountStatus) === "BLOCKED";

  return (
    <div>
      <SectionHeader
        title={canCreate ? "إدارة الطلاب" : "الطلاب"}
        subtitle={loading ? "جارٍ التحميل..." : `${students.length} طالب مسجل`}
        action={canCreate ? "+ إضافة طالب" : null}
        onAction={() => setShowModal(true)}
        t={t}
      />

      <div style={{
        background: t.bgSurface, borderRadius: 10, border: `0.5px solid ${t.borderCard}`,
        padding: "12px 16px", marginBottom: 16,
        display: "flex", gap: 10, alignItems: "center",
      }}>
        <input
          placeholder="بحث بالاسم أو رقم الهاتف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, padding: "8px 12px", borderRadius: 7,
            border: `0.5px solid ${t.border}`, background: t.bgElevated,
            color: t.text, fontSize: 13,
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "8px 12px", borderRadius: 7,
            border: `0.5px solid ${t.border}`, background: t.bgElevated,
            color: t.text, fontSize: 12,
          }}
        >
          {STUDENT_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>
          جارٍ تحميل بيانات الطلاب...
        </div>
      ) : students.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>
          لا توجد نتائج
        </div>
      ) : (
        <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden", borderRadius: 10, border: `0.5px solid ${t.border}` }}>
          <table style={{ width: "100%", minWidth: 1050, borderCollapse: "collapse", fontSize: 14, tableLayout: "auto" }}>
            <thead>
              <tr style={{ background: t.bgElevated }}>
                {STUDENT_TABLE_HEADERS.map((h, i) => (
                  <th key={i} style={{
                    padding: "12px 10px", textAlign: STUDENT_TABLE_ALIGN[i],
                    color: t.textMuted, fontWeight: 700,
                    fontSize: 12, borderBottom: `0.5px solid ${t.border}`,
                    whiteSpace: "nowrap",
                    ...(i === 7 ? { minWidth: 280 } : {}),
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(students) ? students : []).map((s, ri) => {
                const blocked = isBlocked(s);
                return (
                <tr key={s.studentId ?? s.id ?? ri} style={{
                  background: ri % 2 === 0 ? t.bgSurface : t.bgPage,
                  borderBottom: `0.5px solid ${t.border}`,
                }}>
                  <td style={{ padding: "12px 10px", color: t.text, fontSize: 14, fontWeight: 600, verticalAlign: "middle", whiteSpace: "nowrap" }}>{s.user?.name || s.name || "—"}</td>
                  <td style={{ padding: "12px 10px", color: t.textSec, fontSize: 13, verticalAlign: "middle", whiteSpace: "nowrap" }} dir="ltr">{s.user?.phone || s.phone || "—"}</td>
                  <td style={{ padding: "12px 10px", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}><Badge status={STUDENT_STATUS_MAP[s.studentStatus] || s.studentStatus || "—"} t={t} /></td>
                  <td style={{ padding: "12px 10px", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}>
                    <Badge status={blocked ? "محظور" : "نشط"} t={t} color={blocked ? t.cancelled : t.confirmed} />
                  </td>
                  <td style={{ padding: "12px 10px", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{(s.completedBookingsCount ?? 0).toLocaleString("en")}</span>
                  </td>
                  <td style={{ padding: "12px 10px", color: t.textMuted, fontSize: 13, verticalAlign: "middle", whiteSpace: "nowrap" }}>{formatDateOnly(s.lastCompletedBookingDate)}</td>
                  <td style={{ padding: "12px 10px", verticalAlign: "middle", textAlign: "center", whiteSpace: "nowrap" }}>
                    {s.certificateStatus
                      ? <Badge status={CERTIFICATE_STATUS_MAP[s.certificateStatus] || s.certificateStatus} t={t} />
                      : <span style={{ color: t.textMuted, fontSize: 13 }}>لم يتقدّم</span>}
                  </td>
                  <td style={{ padding: "12px 10px", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center", flexWrap: "nowrap", whiteSpace: "nowrap" }}>
                      <button onClick={() => setBookingsStudent(s)} style={studentActionBtnStyle(t.bgElevated, t.text, `1px solid ${t.border}`)}>
                        <LuCalendarDays size={12} /> الحجوزات
                      </button>
                      {canUpdate && (
                        <>
                          <button onClick={() => setEditStudent(s)} style={studentActionBtnStyle(t.accentLight, t.accentText)}>
                            <LuPencil size={12} /> تعديل
                          </button>
                          <button onClick={() => setBlockTarget(s)} style={studentActionBtnStyle(
                            blocked ? t.confirmed.bg : "#FEF2F2",
                            blocked ? t.confirmed.text : "#DC2626",
                            blocked ? "none" : "1px solid #FECACA"
                          )}>
                            {blocked ? <LuLockOpen size={12} /> : <LuBan size={12} />}
                            {blocked ? "إلغاء الحظر" : "حظر"}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {STUDENT_FILTER_OPTIONS.filter((o) => o.value).map((s) => (
          <div key={s.value} style={{
            padding: "4px 12px", borderRadius: 20,
            background: t.bgSurface, color: t.textSec,
            fontSize: 12, border: `0.5px solid ${t.border}`,
          }}>{s.label}</div>
        ))}
      </div>

      {showModal && (
        <AddStudentModal
          t={t}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchStudents(); }}
        />
      )}

      {editStudent && (
        <EditStudentModal
          t={t}
          student={editStudent}
          onClose={() => setEditStudent(null)}
          onSuccess={() => { setEditStudent(null); fetchStudents(); }}
        />
      )}

      {blockTarget && (
        <BlockStudentConfirm
          t={t}
          student={blockTarget}
          onClose={() => setBlockTarget(null)}
          onSuccess={() => { setBlockTarget(null); fetchStudents(); }}
        />
      )}

      {bookingsStudent && (
        <StudentBookingsModal
          t={t}
          student={bookingsStudent}
          onClose={() => setBookingsStudent(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: INSTRUCTORS
// ═══════════════════════════════════════════════
const INSTRUCTOR_TYPE_MAP = {
  MANUAL: "عادي",
  AUTOMATIC: "أوتوماتيك",
  BOTH: "عادي + أوتوماتيك",
};

const GENDER_MAP = { MALE: "ذكر", FEMALE: "أنثى" };

const INSTRUCTOR_TYPE_OPTIONS = [
  { value: "", label: "كل الأنواع" },
  { value: "MANUAL", label: "عادي" },
  { value: "AUTOMATIC", label: "أوتوماتيك" },
  { value: "BOTH", label: "الكل" },
];

const GENDER_FILTER_OPTIONS = [
  { value: "", label: "كل الجنسيات" },
  { value: "MALE", label: "ذكر" },
  { value: "FEMALE", label: "أنثى" },
];

function AddInstructorModal({ t, onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", phone: "", password: "", gender: "", instructorType: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^09\d{8}$/.test(form.phone.trim())) e.phone = "رقم الهاتف غير صالح (مثال: 0991234567)";
    if (!form.password) e.password = "كلمة المرور مطلوبة";
    else if (form.password.length < 4) e.password = "كلمة المرور قصيرة جداً";
    if (!form.gender) e.gender = "الجنس مطلوب";
    if (!form.instructorType) e.instructorType = "نوع التدريب مطلوب";
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
      await instructorsService.create({
        name: form.name.trim(),
        phone: form.phone.trim(),
        password: form.password,
        gender: form.gender,
        instructorType: form.instructorType,
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء الإضافة");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 14,
    outline: "none", transition: "border-color 0.2s",
  });

  const selectChipStyle = (field, value) => ({
    flex: 1, padding: "10px 8px", borderRadius: 10, border: "none",
    cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center",
    transition: "all 0.15s",
    background: form[field] === value ? "#778a3b" : t.bgElevated,
    color: form[field] === value ? "#fff" : t.textSec,
    outline: form[field] === value ? "none" : `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 480, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>إضافة مدرب جديد</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>

        {serverError && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#c74848",
          }}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>الاسم الكامل</label>
            <input value={form.name} onChange={(ev) => { setForm({ ...form, name: ev.target.value }); setErrors({ ...errors, name: undefined }); }}
              placeholder="مثال: خالد عمر الزيد" style={fieldStyle("name")} />
            {errors.name && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.name}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>رقم الهاتف</label>
            <input value={form.phone} onChange={(ev) => { setForm({ ...form, phone: ev.target.value }); setErrors({ ...errors, phone: undefined }); }}
              placeholder="0991234567" dir="ltr" style={{ ...fieldStyle("phone"), textAlign: "left" }} />
            {errors.phone && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.phone}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>كلمة المرور</label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(ev) => { setForm({ ...form, password: ev.target.value }); setErrors({ ...errors, password: undefined }); }}
                placeholder="كلمة مرور الحساب" style={{ ...fieldStyle("password"), paddingLeft: 36 }} />
              <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: t.textMuted, display: "flex", alignItems: "center", padding: 0, fontSize: 16 }}>
                {showPassword ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
            {errors.password && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.password}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 8 }}>الجنس</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => { setForm({ ...form, gender: "MALE" }); setErrors({ ...errors, gender: undefined }); }} style={selectChipStyle("gender", "MALE")}>ذكر</button>
              <button type="button" onClick={() => { setForm({ ...form, gender: "FEMALE" }); setErrors({ ...errors, gender: undefined }); }} style={selectChipStyle("gender", "FEMALE")}>أنثى</button>
            </div>
            {errors.gender && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.gender}</div>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 8 }}>نوع التدريب</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => { setForm({ ...form, instructorType: "MANUAL" }); setErrors({ ...errors, instructorType: undefined }); }} style={selectChipStyle("instructorType", "MANUAL")}>عادي</button>
              <button type="button" onClick={() => { setForm({ ...form, instructorType: "AUTOMATIC" }); setErrors({ ...errors, instructorType: undefined }); }} style={selectChipStyle("instructorType", "AUTOMATIC")}>أوتوماتيك</button>
              <button type="button" onClick={() => { setForm({ ...form, instructorType: "BOTH" }); setErrors({ ...errors, instructorType: undefined }); }} style={selectChipStyle("instructorType", "BOTH")}>كلاهما</button>
            </div>
            {errors.instructorType && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.instructorType}</div>}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: "12px", borderRadius: 12,
              background: submitting ? t.textMuted : "#778a3b",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}>{submitting ? "جارٍ الحفظ..." : "حفظ المدرب"}</button>
            <button type="button" onClick={onClose} style={{
              padding: "12px 20px", borderRadius: 12,
              background: t.bgElevated, color: t.textSec,
              border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600,
              cursor: "pointer",
            }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditInstructorModal({ t, instructor, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: instructor.user?.name || instructor.name || "",
    phone: instructor.user?.phone || instructor.phone || "",
    gender: instructor.gender || "",
    instructorType: instructor.instructorType || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^09\d{8}$/.test(form.phone.trim())) e.phone = "رقم الهاتف غير صالح (مثال: 0991234567)";
    if (!form.gender) e.gender = "الجنس مطلوب";
    if (!form.instructorType) e.instructorType = "نوع التدريب مطلوب";
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
      await instructorsService.update(instructor.instructorId, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        gender: form.gender,
        instructorType: form.instructorType,
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء تعديل بيانات المدرب");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 14,
    outline: "none", transition: "border-color 0.2s",
  });

  const selectChipStyle = (field, value) => ({
    flex: 1, padding: "10px 8px", borderRadius: 10, border: "none",
    cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center",
    transition: "all 0.15s",
    background: form[field] === value ? "#778a3b" : t.bgElevated,
    color: form[field] === value ? "#fff" : t.textSec,
    outline: form[field] === value ? "none" : `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 480, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>تعديل معلومات المدرب</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>

        {serverError && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#c74848",
          }}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>الاسم الكامل</label>
            <input value={form.name} onChange={(ev) => { setForm({ ...form, name: ev.target.value }); setErrors({ ...errors, name: undefined }); }}
              style={fieldStyle("name")} />
            {errors.name && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.name}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>رقم الهاتف</label>
            <input value={form.phone} onChange={(ev) => { setForm({ ...form, phone: ev.target.value }); setErrors({ ...errors, phone: undefined }); }}
              dir="ltr" style={{ ...fieldStyle("phone"), textAlign: "left" }} />
            {errors.phone && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.phone}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 8 }}>الجنس</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => { setForm({ ...form, gender: "MALE" }); setErrors({ ...errors, gender: undefined }); }} style={selectChipStyle("gender", "MALE")}>ذكر</button>
              <button type="button" onClick={() => { setForm({ ...form, gender: "FEMALE" }); setErrors({ ...errors, gender: undefined }); }} style={selectChipStyle("gender", "FEMALE")}>أنثى</button>
            </div>
            {errors.gender && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.gender}</div>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 8 }}>نوع التدريب</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => { setForm({ ...form, instructorType: "MANUAL" }); setErrors({ ...errors, instructorType: undefined }); }} style={selectChipStyle("instructorType", "MANUAL")}>عادي</button>
              <button type="button" onClick={() => { setForm({ ...form, instructorType: "AUTOMATIC" }); setErrors({ ...errors, instructorType: undefined }); }} style={selectChipStyle("instructorType", "AUTOMATIC")}>أوتوماتيك</button>
              <button type="button" onClick={() => { setForm({ ...form, instructorType: "BOTH" }); setErrors({ ...errors, instructorType: undefined }); }} style={selectChipStyle("instructorType", "BOTH")}>كلاهما</button>
            </div>
            {errors.instructorType && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.instructorType}</div>}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: "12px", borderRadius: 12,
              background: submitting ? t.textMuted : "#778a3b",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}>{submitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}</button>
            <button type="button" onClick={onClose} style={{
              padding: "12px 20px", borderRadius: 12,
              background: t.bgElevated, color: t.textSec,
              border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600,
              cursor: "pointer",
            }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ArchiveInstructorConfirm({ t, instructor, onClose, onSuccess }) {
  const isArchived = (instructor.user?.accountStatus || instructor.accountStatus) === "ARCHIVED";
  const name = instructor.user?.name || instructor.name || "المدرب";
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [upcomingCount, setUpcomingCount] = useState(null);
  const [loadingCount, setLoadingCount] = useState(!isArchived);

  useEffect(() => {
    if (isArchived) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await instructorsService.getBookings(instructor.instructorId, { bookingStatus: "BOOKED", limit: 1 });
        const body = res.data?.data ?? res.data;
        if (!cancelled) {
          setUpcomingCount(body?.meta?.total ?? (Array.isArray(body?.data) ? body.data.length : Array.isArray(body) ? body.length : 0));
        }
      } catch {
        if (!cancelled) setUpcomingCount(0);
      } finally {
        if (!cancelled) setLoadingCount(false);
      }
    })();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirm = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await instructorsService.archive(instructor.instructorId, !isArchived);
      const body = res.data?.data ?? res.data;
      const cancelledCount = body?.cancelledBookingsCount ?? 0;
      onSuccess({ cancelledCount, unarchived: isArchived });
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join("، ") : msg || `حدث خطأ أثناء ${isArchived ? "إلغاء أرشفة" : "أرشفة"} المدرب`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 430, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text }}>{isArchived ? "إلغاء أرشفة المدرب" : "أرشفة المدرب"}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>
        <div style={{
          padding: "12px 14px", borderRadius: 9,
          background: isArchived ? t.confirmed.bg : t.cancelled.bg,
          marginBottom: 16, fontSize: 13,
          color: isArchived ? t.confirmed.text : t.cancelled.text,
          lineHeight: 1.7,
        }}>
          {isArchived ? (
            <>
              هل أنت متأكد من إلغاء أرشفة المدرب <strong>{name}</strong>؟ سيعود الحساب نشطاً ومتاحاً للحجوزات الجديدة.
              <div style={{ marginTop: 8, fontSize: 12, fontStyle: "italic", opacity: 0.85 }}>
                ملاحظة: الدروس التي أُلغيت عند الأرشفة لن تُستعاد تلقائياً.
              </div>
            </>
          ) : loadingCount ? (
            <span style={{ color: t.textMuted }}>جارٍ حساب الدروس القادمة...</span>
          ) : (
            <>
              سيتم إلغاء <strong>{upcomingCount ?? 0}</strong> درساً قادماً لهذا المدرب، وإشعار طلابهم بحفظ عرابينهم. هل تتابع؟
            </>
          )}
        </div>
        {error && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#c74848",
          }}>{error}</div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleConfirm} disabled={submitting || loadingCount} style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: submitting || loadingCount ? t.textMuted : (isArchived ? "#778a3b" : "#c74848"),
            color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
            cursor: submitting || loadingCount ? "not-allowed" : "pointer",
          }}>{submitting ? "جارٍ التنفيذ..." : (isArchived ? "تأكيد إلغاء الأرشفة" : "تأكيد الأرشفة")}</button>
          <button onClick={onClose} style={{
            padding: "12px 20px", borderRadius: 12,
            background: t.bgElevated, color: t.textSec,
            border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// INSTRUCTOR PROFILE MODAL — helpers
// ═══════════════════════════════════════════════
const INSTRUCTOR_LEAVE_STATUS_LABEL = { FULL_DAY_LEAVE: "إجازة يوم كامل", PARTIAL_LEAVE: "إجازة جزئية" };

function formatNum(v) {
  if (v == null || v === "") return "—";
  const n = Number(v);
  return isNaN(n) ? String(v) : n.toLocaleString("en");
}

function ProfileInfoRow({ k, v, t, last }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "9px 0", borderBottom: last ? "none" : `1px solid ${t.border}`, fontSize: 13,
    }}>
      <span style={{ color: t.textMuted }}>{k}</span>
      <span style={{ fontWeight: 600, color: t.text, textAlign: "left" }}>{v}</span>
    </div>
  );
}

function InstructorProfileModal({ t, instructorId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

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
  }, [instructorId]);

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
  }, [instructorId]);

  const cardBox = {
    background: t.bgSurface, borderRadius: 16, border: `1px solid ${t.borderCard}`,
    padding: 18, marginBottom: 16,
  };
  const cardTitle = { fontSize: 14, fontWeight: 800, color: t.text, marginBottom: 14 };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.5)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgPage, borderRadius: 20, width: "100%", maxWidth: 520,
        border: `1px solid ${t.borderCard}`, boxShadow: "0 24px 48px rgba(0,0,0,0.25)",
        padding: "26px 24px 30px", maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>بروفايل المدرب</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: t.textSec }}>
              {profileLoading ? "جارٍ التحميل..." : (profile?.name || "—")}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>

        {/* بطاقة البيانات الشخصية */}
        <div style={cardBox}>
          <div style={cardTitle}>البيانات الشخصية</div>
          {profileLoading ? (
            <div style={{ fontSize: 13, color: t.textMuted }}>جارٍ التحميل...</div>
          ) : !profile ? (
            <div style={{ fontSize: 13, color: t.textMuted }}>تعذر تحميل بيانات المدرب</div>
          ) : (
            <>
              <ProfileInfoRow t={t} k="الاسم" v={profile.name || "—"} />
              <ProfileInfoRow t={t} k="الهاتف" v={<span dir="ltr">{profile.phone || "—"}</span>} />
              <ProfileInfoRow t={t} k="الجنس" v={GENDER_MAP[profile.gender] || profile.gender || "—"} />
              <ProfileInfoRow t={t} k="القدرات" v={INSTRUCTOR_TYPE_MAP[profile.instructorType] || profile.instructorType || "—"} />
              <ProfileInfoRow t={t} k="أجر الجلسة الحالي" v={formatMoney(profile.sessionWage)} />
              <ProfileInfoRow t={t} k="جلسات اليوم" v={formatNum(profile.todayLessonsCount ?? 0)} />
              <ProfileInfoRow t={t} k="حالة الإجازة اليوم" v={profile.leaveStatus ? (INSTRUCTOR_LEAVE_STATUS_LABEL[profile.leaveStatus] || profile.leaveStatus) : "لا يوجد"} last />
            </>
          )}
        </div>

        {/* الإحصائيات */}
        <div style={{ ...cardBox, marginBottom: 0 }}>
          <div style={cardTitle}>الإحصائيات</div>
          {statsLoading ? (
            <div style={{ fontSize: 13, color: t.textMuted }}>جارٍ التحميل...</div>
          ) : !stats ? (
            <div style={{ fontSize: 13, color: t.textMuted }}>تعذر تحميل الإحصائيات</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
              <StatCard t={t} label="جلسات هذا الشهر" value={formatNum(stats.sessionsThisMonth ?? 0)} color={t.accent} icon={<RiCalendarScheduleLine size={20} />} />
              <StatCard t={t} label="غياب هذا الشهر" value={formatNum(stats.noShowsThisMonth ?? 0)} color={t.cancelled.text} icon={<MdOutlineCancel size={20} />} />
              <StatCard t={t} label="نسبة الإكمال" value={stats.completionRate != null ? `${stats.completionRate}%` : "—"} color={t.completed.text} icon={<PiMedalFill size={20} />} />
              <StatCard t={t} label="مستحق اليوم" value={formatMoney(stats.dueToday)} color={t.pending.text} icon={<BsHourglassSplit size={20} />} />
              <StatCard t={t} label="إجمالي المستحقات" value={formatMoney(stats.totalOutstanding)} color={t.accent} icon={<TbReportMoney size={20} />} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PageInstructors({ t }) {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission(P.INSTRUCTORS_CREATE);
  const canUpdate = hasPermission(P.INSTRUCTORS_UPDATE);
  const canArchive = hasPermission(P.INSTRUCTORS_ARCHIVE);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editInstructor, setEditInstructor] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [archiveResult, setArchiveResult] = useState(null);
  const [profileInstructorId, setProfileInstructorId] = useState(null);

  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (typeFilter) params.instructorType = typeFilter;
      if (genderFilter) params.gender = genderFilter;
      const { data } = await instructorsService.getAll(params);
      setInstructors(Array.isArray(data) ? data : data.data || []);
    } catch {
      setInstructors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        if (typeFilter) params.instructorType = typeFilter;
        if (genderFilter) params.gender = genderFilter;
        const { data } = await instructorsService.getAll(params);
        if (!cancelled) setInstructors(Array.isArray(data) ? data : data.data || []);
      } catch {
        if (!cancelled) setInstructors([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [search, typeFilter, genderFilter]);

  const statusLabel = (instructor) => {
    const acctStatus = instructor.user?.accountStatus || instructor.accountStatus;
    if (acctStatus === "BLOCKED") return "غير نشط";
    if (acctStatus === "ARCHIVED") return "غير نشط";
    return "نشط";
  };

  const isArchived = (instructor) => (instructor.user?.accountStatus || instructor.accountStatus) === "ARCHIVED";

  return (
    <div>
      <SectionHeader
        title={canCreate ? "إدارة المدربين" : "المدربين"}
        subtitle={loading ? "جارٍ التحميل..." : `${instructors.length} مدرب مسجل`}
        action={canCreate ? "+ إضافة مدرب" : null}
        onAction={() => setShowModal(true)}
        t={t}
      />

      <div style={{
        background: t.bgSurface, borderRadius: 10, border: `0.5px solid ${t.borderCard}`,
        padding: "12px 16px", marginBottom: 16,
        display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
      }}>
        <input
          placeholder="بحث بالاسم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 160, padding: "8px 12px", borderRadius: 7,
            border: `0.5px solid ${t.border}`, background: t.bgElevated,
            color: t.text, fontSize: 13,
          }}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 7, border: `0.5px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 12 }}>
          {INSTRUCTOR_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 7, border: `0.5px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 12 }}>
          {GENDER_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>
          جارٍ تحميل بيانات المدربين...
        </div>
      ) : instructors.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>
          لا توجد نتائج
        </div>
      ) : (
        <div style={{ borderRadius: 10, border: `0.5px solid ${t.border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: t.bgElevated }}>
                {["الاسم", "الجنس", "القدرات", "رقم الهاتف", "الحالة", "إجراءات"].map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 14px", textAlign: "right",
                    color: t.textMuted, fontWeight: 600,
                    fontSize: 12, borderBottom: `0.5px solid ${t.border}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {instructors.map((ins, ri) => (
                <tr key={ins.instructorId ?? ri} style={{
                  background: ri % 2 === 0 ? t.bgSurface : t.bgPage,
                  borderBottom: `0.5px solid ${t.border}`,
                }}>
                  <td style={{ padding: "10px 14px", color: t.text, fontSize: 14 }}>{ins.user?.name || ins.name || "—"}</td>
                  <td style={{ padding: "10px 14px" }}><Badge status={GENDER_MAP[ins.gender] || ins.gender || "—"} t={t} /></td>
                  <td style={{ padding: "10px 14px" }}><Badge status={INSTRUCTOR_TYPE_MAP[ins.instructorType] || ins.instructorType || "—"} t={t} /></td>
                  <td style={{ padding: "10px 14px", color: t.text, fontSize: 14 }} dir="ltr">{ins.user?.phone || ins.phone || "—"}</td>
                  <td style={{ padding: "10px 14px" }}><Badge status={statusLabel(ins)} t={t} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <button onClick={() => setProfileInstructorId(ins.instructorId)} style={{
                        padding: "4px 10px", borderRadius: 6, background: t.bgElevated,
                        color: t.text, border: `1px solid ${t.border}`, fontSize: 11, cursor: "pointer", fontWeight: 600,
                        display: "flex", alignItems: "center", gap: 4,
                      }}><LuEye size={13} />البروفايل</button>
                      {canUpdate && (
                        <button onClick={() => setEditInstructor(ins)} style={{
                          padding: "4px 10px", borderRadius: 6, background: t.accentLight,
                          color: t.accentText, border: "none", fontSize: 11, cursor: "pointer", fontWeight: 600,
                        }}>تعديل المعلومات</button>
                      )}
                      {canArchive && (
                        <button onClick={() => setArchiveTarget(ins)} style={{
                          padding: "4px 10px", borderRadius: 6,
                          background: isArchived(ins) ? t.confirmed.bg : t.cancelled.bg,
                          color: isArchived(ins) ? t.confirmed.text : t.cancelled.text,
                          border: "none", fontSize: 11, cursor: "pointer", fontWeight: 600,
                        }}>{isArchived(ins) ? "إلغاء الأرشفة" : "أرشفة"}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <AddInstructorModal
          t={t}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchInstructors(); }}
        />
      )}

      {editInstructor && (
        <EditInstructorModal
          t={t}
          instructor={editInstructor}
          onClose={() => setEditInstructor(null)}
          onSuccess={() => { setEditInstructor(null); fetchInstructors(); }}
        />
      )}

      {archiveResult && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          zIndex: 2000, background: t.bgSurface, border: `1px solid ${t.border}`,
          borderRadius: 10, padding: "12px 20px", fontSize: 13, fontWeight: 600,
          color: t.text, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", whiteSpace: "nowrap",
        }}>{archiveResult}</div>
      )}
      {archiveTarget && (
        <ArchiveInstructorConfirm
          t={t}
          instructor={archiveTarget}
          onClose={() => setArchiveTarget(null)}
          onSuccess={({ cancelledCount, unarchived }) => {
            setArchiveTarget(null);
            fetchInstructors();
            if (unarchived) {
              setArchiveResult("تم إلغاء أرشفة المدرب بنجاح — الحساب نشط الآن.");
            } else if (cancelledCount > 0) {
              setArchiveResult(`تم أرشفة المدرب — تم إلغاء ${cancelledCount} درساً قادماً وإشعار الطلاب بحفظ عرابينهم.`);
            } else {
              setArchiveResult("تم أرشفة المدرب بنجاح — لا توجد دروس قادمة متأثرة.");
            }
            setTimeout(() => setArchiveResult(null), 5000);
          }}
        />
      )}

      {profileInstructorId && (
        <InstructorProfileModal
          t={t}
          instructorId={profileInstructorId}
          onClose={() => setProfileInstructorId(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: VEHICLES
// ═══════════════════════════════════════════════
// status الفعلية القادمة من الباك اند هي ACTIVE | ARCHIVED فقط — "في الصيانة" حالة
// مشتقة من inMaintenanceNow (GET /vehicles/:id)، وليست قيمة status (راجع vehicles-api.md §1)
const VEHICLE_STATUS_MAP = {
  ACTIVE: "متاحة",
  ARCHIVED: "غير متاحة",
};

const VEHICLE_TYPE_MAP = {
  MANUAL: "عادي",
  AUTOMATIC: "أوتوماتيك",
};

const VEHICLE_STATUS_OPTIONS = [
  { value: "", label: "كل الحالات" },
  { value: "ACTIVE", label: "متاحة" },
  { value: "ARCHIVED", label: "مؤرشفة" },
];

const VEHICLE_TYPE_OPTIONS = [
  { value: "", label: "كل الأنواع" },
  { value: "MANUAL", label: "عادي" },
  { value: "AUTOMATIC", label: "أوتوماتيك" },
];

// المواعيد القادمة من الـ API محلية بالفعل (server-local، بلا منطقة زمنية) — تُعرض كما هي
// بدون تمريرها عبر new Date(...) تفادياً لأي إعادة تفسير للمنطقة الزمنية من المتصفح.
function formatMaintDateTime(s) {
  if (!s) return "—";
  const [datePart, timePart] = s.split("T");
  return timePart ? `${datePart} ${timePart.slice(0, 5)}` : datePart;
}

// "date time" هو نص من رمزين مفصولين بمسافة — داخل حاوية RTL بدون عزل اتجاه صريح
// يقلب المتصفح ترتيبهما بصرياً (تعرض "time date" بدل "date time")، رغم أن القيمة
// المخزّنة والمرسلة للخادم صحيحة دائماً. dir="ltr" هون منع فعلي لهاي المشكلة البصرية.
function MaintRange({ start, end }) {
  return <span dir="ltr">{formatMaintDateTime(start)} — {formatMaintDateTime(end)}</span>;
}

const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES_60 = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

// بديل عن <input type="datetime-local"> الأصلي لحقول مواعيد الصيانة: عرض/إدخال الوقت
// بأداة المتصفح المدمجة بيتبع لغة نظام تشغيل/متصفح المستخدم نفسه (ممكن يطلع 12 ساعة
// AM/PM) وهاد مش قابل للتحكم من الصفحة إطلاقاً. هون منولّد قيمة YYYY-MM-DDTHH:mm يدوياً
// من تاريخ + select ساعة/دقيقة نصهم ثابت (مش مترجم من المتصفح) فتضمن 24 ساعة دايماً.
function DateTime24Field({ t, value, onChange, style }) {
  const [datePart, timePart] = value ? value.split("T") : ["", ""];
  const [hh, mm] = timePart ? timePart.split(":") : ["", ""];

  const commit = (d, h, m) => {
    if (!d) { onChange(""); return; }
    onChange(`${d}T${h || "00"}:${m || "00"}`);
  };

  const selectStyle = { ...style, flex: "0 0 60px", textAlign: "center", padding: "10px 2px" };

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <input type="date" dir="ltr" value={datePart || ""} onChange={(ev) => commit(ev.target.value, hh, mm)} style={{ ...style, flex: 1, minWidth: 0 }} />
      <select value={hh || ""} onChange={(ev) => commit(datePart, ev.target.value, mm)} disabled={!datePart} style={selectStyle}>
        <option value="">−−</option>
        {HOURS_24.map((h) => <option key={h} value={h}>{h}</option>)}
      </select>
      <span style={{ color: t.textMuted, fontWeight: 700 }}>:</span>
      <select value={mm || ""} onChange={(ev) => commit(datePart, hh, ev.target.value)} disabled={!datePart} style={selectStyle}>
        <option value="">−−</option>
        {MINUTES_60.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
    </div>
  );
}

function ActionResultBanner({ t, result, onDismiss }) {
  if (!result) return null;
  const reassigned = result.reassignedBookings ?? 0;
  const cancelled = result.cancelledBookings ?? 0;
  return (
    <div style={{
      background: t.completed.bg, border: `0.5px solid ${t.completed.text}30`,
      borderRadius: 10, padding: "12px 14px", marginBottom: 16,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.completed.text }}>{result.message}</div>
        <button onClick={onDismiss} style={{
          background: "none", border: "none", cursor: "pointer",
          color: t.completed.text, fontSize: 16, lineHeight: 1, padding: 0,
        }}><LuX size={14} /></button>
      </div>
      {(reassigned > 0 || cancelled > 0) && (
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {reassigned > 0 && (
            <span style={{ fontSize: 12, fontWeight: 600, color: t.pending.text, background: t.pending.bg, padding: "3px 10px", borderRadius: 20 }}>
              {reassigned} حجز أُعيد جدولته
            </span>
          )}
          {cancelled > 0 && (
            <span style={{ fontSize: 12, fontWeight: 600, color: t.cancelled.text, background: t.cancelled.bg, padding: "3px 10px", borderRadius: 20 }}>
              {cancelled} حجز أُلغي
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function AddVehicleModal({ t, onClose, onSuccess }) {
  const [form, setForm] = useState({ plateNumber: "", model: "", color: "", type: "", adminNotes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.plateNumber.trim()) e.plateNumber = "رقم اللوحة مطلوب";
    if (!form.type) e.type = "نوع المركبة مطلوب";
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
      await vehiclesService.create({
        plateNumber: form.plateNumber.trim(),
        model: form.model.trim() || null,
        color: form.color.trim() || null,
        type: form.type,
        adminNotes: form.adminNotes.trim() || null,
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء الإضافة");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 14,
    outline: "none", transition: "border-color 0.2s",
  });

  const selectChipStyle = (value) => ({
    flex: 1, padding: "10px 8px", borderRadius: 10, border: "none",
    cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center",
    transition: "all 0.15s",
    background: form.type === value ? "#778a3b" : t.bgElevated,
    color: form.type === value ? "#fff" : t.textSec,
    outline: form.type === value ? "none" : `1.5px solid ${errors.type ? "#c74848" : t.border}`,
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 480, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>إضافة مركبة جديدة</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>

        {serverError && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#c74848",
          }}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>رقم اللوحة</label>
            <input value={form.plateNumber} onChange={(ev) => { setForm({ ...form, plateNumber: ev.target.value }); setErrors({ ...errors, plateNumber: undefined }); }}
              placeholder="مثال: أ ب ج 101" style={fieldStyle("plateNumber")} />
            {errors.plateNumber && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.plateNumber}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>الموديل (اختياري)</label>
            <input value={form.model} onChange={(ev) => setForm({ ...form, model: ev.target.value })}
              placeholder="مثال: تويوتا كورولا 2020" style={fieldStyle("model")} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>اللون (اختياري)</label>
            <input value={form.color} onChange={(ev) => setForm({ ...form, color: ev.target.value })}
              placeholder="مثال: أبيض" style={fieldStyle("color")} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 8 }}>نوع المركبة</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => { setForm({ ...form, type: "MANUAL" }); setErrors({ ...errors, type: undefined }); }} style={selectChipStyle("MANUAL")}>عادي</button>
              <button type="button" onClick={() => { setForm({ ...form, type: "AUTOMATIC" }); setErrors({ ...errors, type: undefined }); }} style={selectChipStyle("AUTOMATIC")}>أوتوماتيك</button>
            </div>
            {errors.type && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.type}</div>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>ملاحظات (اختياري)</label>
            <input value={form.adminNotes} onChange={(ev) => setForm({ ...form, adminNotes: ev.target.value })}
              placeholder="ملاحظات إدارية" style={fieldStyle("adminNotes")} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: "12px", borderRadius: 12,
              background: submitting ? t.textMuted : "#778a3b",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}>{submitting ? "جارٍ الحفظ..." : "حفظ المركبة"}</button>
            <button type="button" onClick={onClose} style={{
              padding: "12px 20px", borderRadius: 12,
              background: t.bgElevated, color: t.textSec,
              border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600,
              cursor: "pointer",
            }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditVehicleModal({ t, vehicle, onClose, onSuccess }) {
  const [form, setForm] = useState({
    plateNumber: vehicle.plateNumber || "",
    model: vehicle.model || "",
    color: vehicle.color || "",
    type: vehicle.type || "",
    adminNotes: vehicle.adminNotes || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.plateNumber.trim()) e.plateNumber = "رقم اللوحة مطلوب";
    if (!form.type) e.type = "نوع المركبة مطلوب";
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
      await vehiclesService.update(vehicle.id, {
        plateNumber: form.plateNumber.trim(),
        model: form.model.trim() || null,
        color: form.color.trim() || null,
        type: form.type,
        adminNotes: form.adminNotes.trim() || null,
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء التعديل");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 14,
    outline: "none", transition: "border-color 0.2s",
  });

  const selectChipStyle = (value) => ({
    flex: 1, padding: "10px 8px", borderRadius: 10, border: "none",
    cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center",
    transition: "all 0.15s",
    background: form.type === value ? "#778a3b" : t.bgElevated,
    color: form.type === value ? "#fff" : t.textSec,
    outline: form.type === value ? "none" : `1.5px solid ${errors.type ? "#c74848" : t.border}`,
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 480, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>تعديل بيانات المركبة</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>

        {serverError && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#c74848",
          }}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>رقم اللوحة</label>
            <input value={form.plateNumber} onChange={(ev) => { setForm({ ...form, plateNumber: ev.target.value }); setErrors({ ...errors, plateNumber: undefined }); }}
              style={fieldStyle("plateNumber")} />
            {errors.plateNumber && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.plateNumber}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>الموديل</label>
            <input value={form.model} onChange={(ev) => setForm({ ...form, model: ev.target.value })}
              style={fieldStyle("model")} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>اللون</label>
            <input value={form.color} onChange={(ev) => setForm({ ...form, color: ev.target.value })}
              style={fieldStyle("color")} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 8 }}>نوع المركبة</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={() => { setForm({ ...form, type: "MANUAL" }); setErrors({ ...errors, type: undefined }); }} style={selectChipStyle("MANUAL")}>عادي</button>
              <button type="button" onClick={() => { setForm({ ...form, type: "AUTOMATIC" }); setErrors({ ...errors, type: undefined }); }} style={selectChipStyle("AUTOMATIC")}>أوتوماتيك</button>
            </div>
            {errors.type && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.type}</div>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>ملاحظات</label>
            <input value={form.adminNotes} onChange={(ev) => setForm({ ...form, adminNotes: ev.target.value })}
              style={fieldStyle("adminNotes")} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: "12px", borderRadius: 12,
              background: submitting ? t.textMuted : "#778a3b",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}>{submitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}</button>
            <button type="button" onClick={onClose} style={{
              padding: "12px 20px", borderRadius: 12,
              background: t.bgElevated, color: t.textSec,
              border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600,
              cursor: "pointer",
            }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FuelModal({ t, vehicle, onClose, onSuccess }) {
  const [form, setForm] = useState({ liters: "", pricePerLiter: "", paymentMethod: "CASH", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.liters || isNaN(form.liters) || Number(form.liters) <= 0) e.liters = "عدد اللترات مطلوب";
    if (!form.pricePerLiter || isNaN(form.pricePerLiter) || Number(form.pricePerLiter) <= 0) e.pricePerLiter = "سعر اللتر مطلوب";
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
      await vehiclesService.addFuel(vehicle.id, {
        liters: Number(form.liters),
        pricePerLiter: Number(form.pricePerLiter),
        paymentMethod: form.paymentMethod,
        note: form.note.trim() || null,
      });
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message;
      setServerError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء تسجيل الوقود");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldStyle = (field) => ({
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${errors[field] ? "#c74848" : t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 14,
    outline: "none", transition: "border-color 0.2s",
  });

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 440, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>تعبئة وقود — {vehicle.plateNumber}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>

        {serverError && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#c74848",
          }}>{serverError}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>عدد اللترات</label>
            <input type="number" step="0.1" value={form.liters} onChange={(ev) => { setForm({ ...form, liters: ev.target.value }); setErrors({ ...errors, liters: undefined }); }}
              placeholder="مثال: 14" dir="ltr" style={{ ...fieldStyle("liters"), textAlign: "left" }} />
            {errors.liters && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.liters}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>سعر اللتر</label>
            <input type="number" step="0.1" value={form.pricePerLiter} onChange={(ev) => { setForm({ ...form, pricePerLiter: ev.target.value }); setErrors({ ...errors, pricePerLiter: undefined }); }}
              placeholder="مثال: 15.2" dir="ltr" style={{ ...fieldStyle("pricePerLiter"), textAlign: "left" }} />
            {errors.pricePerLiter && <div style={{ fontSize: 12, color: "#c74848", marginTop: 4 }}>{errors.pricePerLiter}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 8 }}>طريقة الدفع</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[["CASH", "نقدي"], ["SHAM_CASH", "شام كاش"]].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setForm({ ...form, paymentMethod: value })} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 10, border: "none",
                  cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "center",
                  background: form.paymentMethod === value ? "#778a3b" : t.bgElevated,
                  color: form.paymentMethod === value ? "#fff" : t.textSec,
                  outline: form.paymentMethod === value ? "none" : `1.5px solid ${t.border}`,
                }}>{label}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.textSec, marginBottom: 6 }}>ملاحظة (اختياري)</label>
            <input value={form.note} onChange={(ev) => setForm({ ...form, note: ev.target.value })}
              placeholder="ملاحظة عن التعبئة" style={fieldStyle("note")} />
          </div>

          {form.liters && form.pricePerLiter && !isNaN(form.liters) && !isNaN(form.pricePerLiter) && (
            <div style={{
              padding: "10px 14px", borderRadius: 10,
              background: t.accentLight, marginBottom: 16,
              fontSize: 13, fontWeight: 600, color: t.accentText,
            }}>
              الإجمالي: {(Number(form.liters) * Number(form.pricePerLiter)).toFixed(1)}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting} style={{
              flex: 1, padding: "12px", borderRadius: 12,
              background: submitting ? t.textMuted : "#778a3b",
              color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}>{submitting ? "جارٍ الحفظ..." : "تسجيل الوقود"}</button>
            <button type="button" onClick={onClose} style={{
              padding: "12px 20px", borderRadius: 12,
              background: t.bgElevated, color: t.textSec,
              border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600,
              cursor: "pointer",
            }}>إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// مركز إدارة صيانة مركبة واحدة: يعرض current/upcoming/past ديناميكياً من
// getAllMaintenancePeriods، ويحوّل بين أربع "شاشات فرعية" ضمن نفس النافذة بدل فتح
// نوافذ منفصلة فوق بعضها: فتح نافذة جديدة، تعديل فترة قادمة، إلغاء فترة قادمة، إرجاع من الصيانة الحالية.
function extractErrorMessage(err, fallback) {
  const msg = err.response?.data?.message ?? err.message;
  if (Array.isArray(msg)) return msg.join("، ");
  return msg || fallback;
}

// صف فترة صيانة قادمة واحدة. يملك حالة التعديل/تأكيد الإلغاء الخاصة به محلياً بدل الاعتماد
// على "view mode" عام مشترك مع بقية النافذة — كل صف مستقل تماماً عن الصفوف الأخرى وعن
// نموذجَي الجدولة/الإرجاع، فلا يمكن لأي منها أن يتشابك مع حالة الآخر.
function UpcomingPeriodRow({ t, vehicleId, period, onChanged, onError }) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [endAt, setEndAt] = useState(period.endAt ? period.endAt.slice(0, 16) : "");
  const [notes, setNotes] = useState(period.notes || "");
  const [busy, setBusy] = useState(false);

  const smallFieldStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: `1.5px solid ${t.border}`, background: t.bgElevated,
    color: t.text, fontSize: 13, outline: "none",
  };

  const handleUpdate = async (ev) => {
    ev.preventDefault();
    onError("");
    setBusy(true);
    try {
      const { data } = await vehiclesService.updateMaintenancePeriod(vehicleId, period.id, {
        endAt: endAt || null,
        notes: notes.trim() || null,
      });
      setEditing(false);
      onChanged(data?.data ?? data);
    } catch (err) {
      onError(extractErrorMessage(err, "حدث خطأ أثناء تعديل فترة الصيانة"));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    onError("");
    setBusy(true);
    try {
      const { data } = await vehiclesService.deleteMaintenancePeriod(vehicleId, period.id);
      onChanged(data?.data ?? data);
    } catch (err) {
      onError(extractErrorMessage(err, "حدث خطأ أثناء إلغاء فترة الصيانة"));
      setBusy(false);
      setConfirmingDelete(false);
    }
  };

  if (confirmingDelete) {
    return (
      <div style={{
        padding: "10px 12px", borderRadius: 10, border: `0.5px solid ${t.cancelled.text}40`,
        background: t.cancelled.bg, marginBottom: 8,
      }}>
        <div style={{ fontSize: 12, color: t.cancelled.text, marginBottom: 10 }}>
          هل أنت متأكد من إلغاء فترة الصيانة <MaintRange start={period.startAt} end={period.endAt} />؟
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleDelete} disabled={busy} style={{
            padding: "6px 14px", borderRadius: 8, background: busy ? t.textMuted : "#c74848",
            color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer",
          }}>{busy ? "جارٍ الإلغاء..." : "تأكيد الإلغاء"}</button>
          <button onClick={() => setConfirmingDelete(false)} disabled={busy} style={{
            padding: "6px 14px", borderRadius: 8, background: t.bgElevated, color: t.textSec,
            border: `1px solid ${t.border}`, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>تراجع</button>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <form onSubmit={handleUpdate} style={{ padding: "10px 12px", borderRadius: 10, border: `0.5px solid ${t.border}`, marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 8 }}>
          تعديل فترة الصيانة — تبدأ <span dir="ltr">{formatMaintDateTime(period.startAt)}</span>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: t.textSec, marginBottom: 4 }}>نهاية الصيانة</label>
          <DateTime24Field t={t} value={endAt} onChange={setEndAt} style={smallFieldStyle} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: t.textSec, marginBottom: 4 }}>ملاحظات</label>
          <input value={notes} onChange={(ev) => setNotes(ev.target.value)} style={smallFieldStyle} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={busy} style={{
            padding: "6px 14px", borderRadius: 8, background: busy ? t.textMuted : "#778a3b",
            color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: busy ? "not-allowed" : "pointer",
          }}>{busy ? "جارٍ الحفظ..." : "حفظ"}</button>
          <button type="button" onClick={() => setEditing(false)} disabled={busy} style={{
            padding: "6px 14px", borderRadius: 8, background: t.bgElevated, color: t.textSec,
            border: `1px solid ${t.border}`, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>تراجع</button>
        </div>
      </form>
    );
  }

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 12px", borderRadius: 10, border: `0.5px solid ${t.border}`, marginBottom: 8, gap: 10,
    }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}><MaintRange start={period.startAt} end={period.endAt} /></div>
        {period.notes && <div style={{ fontSize: 12, color: t.textMuted }}>{period.notes}</div>}
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button onClick={() => setEditing(true)} style={{
          padding: "4px 10px", borderRadius: 6, background: t.accentLight,
          color: t.accentText, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
        }}>تعديل</button>
        <button onClick={() => setConfirmingDelete(true)} style={{
          padding: "4px 10px", borderRadius: 6, background: t.cancelled.bg,
          color: t.cancelled.text, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
        }}>إلغاء</button>
      </div>
    </div>
  );
}

// مركز إدارة صيانة مركبة واحدة. لا يوجد "view mode" عام: كل قسم (الوضع الحالي/جدولة
// جديدة/القادمة/السابقة) يُرسم مباشرة من بيانات getAllMaintenancePeriods المجلوبة، فلا
// يمكن لزر أو نموذج أن "يتذكر" فترة قديمة بعد تغيّر البيانات الفعلية.
function MaintenanceModal({ t, vehicle, onClose, onVehicleChanged }) {
  const [periods, setPeriods] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [result, setResult] = useState(null);
  const [actionError, setActionError] = useState("");

  const [scheduleForm, setScheduleForm] = useState({ startAt: "", endAt: "", notes: "" });
  const [scheduling, setScheduling] = useState(false);

  const [returnNotes, setReturnNotes] = useState("");
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const { data } = await vehiclesService.getAllMaintenancePeriods(vehicle.id);
        if (!cancelled) setPeriods(data?.data ?? data);
      } catch (err) {
        if (!cancelled) setLoadError(extractErrorMessage(err, "حدث خطأ أثناء تحميل فترات الصيانة"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [vehicle.id]);

  const fetchPeriods = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const { data } = await vehiclesService.getAllMaintenancePeriods(vehicle.id);
      setPeriods(data?.data ?? data);
    } catch (err) {
      setLoadError(extractErrorMessage(err, "حدث خطأ أثناء تحميل فترات الصيانة"));
    } finally {
      setLoading(false);
    }
  };

  // ينفَّذ بعد أي عملية ناجحة (جدولة/تعديل/إلغاء/إرجاع): يمسح الأخطاء، يعرض نتيجة العملية،
  // ويعيد جلب الفترات فوراً من الخادم بدل الاعتماد على تحديث محلي متفائل.
  const handleSuccess = (resultData) => {
    setActionError("");
    setResult(resultData);
    fetchPeriods();
    onVehicleChanged?.();
  };

  const handleSchedule = async (ev) => {
    ev.preventDefault();
    setActionError("");
    // startAt وendAt كلاهما اختياري حسب التوثيق: إغفال endAt = صيانة مفتوحة النهاية
    // (حالة عطل مفاجئ لا نعرف متى تنتهي)، وإغفال startAt = تبدأ الآن.
    if (scheduleForm.startAt && scheduleForm.endAt && scheduleForm.endAt <= scheduleForm.startAt) {
      setActionError("يجب أن يكون تاريخ النهاية بعد تاريخ البداية");
      return;
    }
    if (scheduleForm.startAt && new Date(scheduleForm.startAt).getTime() < Date.now()) {
      setActionError("لا يمكن أن يبدأ موعد الصيانة في الماضي — اختر الآن أو وقتاً مستقبلياً");
      return;
    }
    setScheduling(true);
    try {
      const { data } = await vehiclesService.sendVehicleToMaintenance(vehicle.id, {
        ...(scheduleForm.startAt ? { startAt: scheduleForm.startAt } : {}),
        ...(scheduleForm.endAt ? { endAt: scheduleForm.endAt } : {}),
        notes: scheduleForm.notes.trim() || null,
      });
      setScheduleForm({ startAt: "", endAt: "", notes: "" });
      handleSuccess(data?.data ?? data);
    } catch (err) {
      setActionError(extractErrorMessage(err, "حدث خطأ أثناء فتح نافذة الصيانة"));
    } finally {
      setScheduling(false);
    }
  };

  const handleReturn = async (ev) => {
    ev.preventDefault();
    setActionError("");
    // نتحقق من periods.current مباشرة عند الإرسال — وليس من أي حالة محفوظة مسبقاً —
    // فإن لم توجد فترة حالية فعلية الآن، نرفض الإرسال بدل مناداة الخادم بلا داعٍ.
    if (!periods?.current) { setActionError("لا توجد فترة صيانة حالية لإرجاع المركبة منها"); return; }
    setReturning(true);
    try {
      const { data } = await vehiclesService.returnFromMaintenance(vehicle.id, {
        notes: returnNotes.trim() || null,
      });
      setReturnNotes("");
      handleSuccess(data?.data ?? data);
    } catch (err) {
      setActionError(extractErrorMessage(err, "حدث خطأ أثناء إرجاع المركبة من الصيانة"));
    } finally {
      setReturning(false);
    }
  };

  const fieldStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10,
    border: `1.5px solid ${t.border}`,
    background: t.bgElevated, color: t.text, fontSize: 14,
    outline: "none",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 520, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>صيانة المركبة — {vehicle.plateNumber}</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>

        <ActionResultBanner t={t} result={result} onDismiss={() => setResult(null)} />

        {actionError && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#c74848",
          }}>{actionError}</div>
        )}

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>جارٍ تحميل فترات الصيانة...</div>
        ) : loadError ? (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "14px 16px", fontSize: 13, color: "#c74848",
          }}>{loadError}</div>
        ) : (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.textSec, marginBottom: 8 }}>الوضع الحالي</div>
              {periods?.current ? (
                <div style={{ padding: 14, borderRadius: 10, background: t.pending.bg, border: `0.5px solid ${t.pending.text}30` }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.pending.text, marginBottom: 4 }}>
                    المركبة في الصيانة الآن: <MaintRange start={periods.current.startAt} end={periods.current.endAt} />
                  </div>
                  {periods.current.notes && <div style={{ fontSize: 12, color: t.textSec, marginBottom: 10 }}>{periods.current.notes}</div>}
                  <form onSubmit={handleReturn}>
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.textSec, marginBottom: 4 }}>ملاحظات الإرجاع (اختياري)</label>
                      <input value={returnNotes} onChange={(ev) => setReturnNotes(ev.target.value)} placeholder="ملاحظات"
                        style={{ ...fieldStyle, padding: "8px 12px", fontSize: 13 }} />
                    </div>
                    <button type="submit" disabled={returning} style={{
                      padding: "8px 16px", borderRadius: 8, background: returning ? t.textMuted : "#778a3b",
                      color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: returning ? "not-allowed" : "pointer",
                    }}>{returning ? "جارٍ الإرجاع..." : "إرجاع المركبة للعمل"}</button>
                  </form>
                </div>
              ) : (
                <form onSubmit={handleSchedule} style={{ padding: 14, borderRadius: 10, border: `0.5px solid ${t.border}` }}>
                  <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 12 }}>لا توجد صيانة حالية — جدولة نافذة صيانة جديدة</div>
                  <div style={{ display: "flex", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.textSec, marginBottom: 4 }}>البداية (اختياري — الافتراضي الآن)</label>
                      <DateTime24Field t={t} value={scheduleForm.startAt} onChange={(v) => setScheduleForm({ ...scheduleForm, startAt: v })} style={fieldStyle} />
                    </div>
                    <div style={{ flex: 1, minWidth: 220 }}>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.textSec, marginBottom: 4 }}>النهاية (اختياري)</label>
                      <DateTime24Field t={t} value={scheduleForm.endAt} onChange={(v) => setScheduleForm({ ...scheduleForm, endAt: v })} style={fieldStyle} />
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 12 }}>
                    اترك النهاية فارغة لعطل مفاجئ لا تعرف متى ينتهي — أرجع المركبة للعمل من هنا نفسه لما تجهز.
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: t.textSec, marginBottom: 4 }}>ملاحظات (اختياري)</label>
                    <input value={scheduleForm.notes} onChange={(ev) => setScheduleForm({ ...scheduleForm, notes: ev.target.value })} style={fieldStyle} />
                  </div>
                  <button type="submit" disabled={scheduling} style={{
                    padding: "10px 18px", borderRadius: 10, background: scheduling ? t.textMuted : "#778a3b",
                    color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: scheduling ? "not-allowed" : "pointer",
                  }}>{scheduling ? "جارٍ الحفظ..." : "جدولة الصيانة"}</button>
                </form>
              )}
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.textSec, marginBottom: 8 }}>الفترات القادمة</div>
              {periods?.upcoming?.length ? periods.upcoming.map((p) => (
                <UpcomingPeriodRow
                  key={p.id}
                  t={t}
                  vehicleId={vehicle.id}
                  period={p}
                  onChanged={handleSuccess}
                  onError={setActionError}
                />
              )) : <div style={{ fontSize: 13, color: t.textMuted }}>لا توجد فترات قادمة</div>}
            </div>

            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.textSec, marginBottom: 8 }}>الفترات السابقة</div>
              {periods?.past?.length ? periods.past.map((p) => (
                <div key={p.id} style={{ padding: "10px 12px", borderRadius: 10, background: t.bgElevated, marginBottom: 6 }}>
                  <div style={{ fontSize: 13, color: t.text }}><MaintRange start={p.startAt} end={p.endAt} /></div>
                  {p.notes && <div style={{ fontSize: 12, color: t.textMuted }}>{p.notes}</div>}
                </div>
              )) : <div style={{ fontSize: 13, color: t.textMuted }}>لا توجد فترات سابقة</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VehicleDetailsModal({ t, vehicleId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await vehiclesService.getById(vehicleId);
        if (!cancelled) setDetails(data.data || data);
      } catch {
        if (!cancelled) setError("حدث خطأ أثناء تحميل بيانات المركبة");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [vehicleId]);

  const detailRow = (label, value) => (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 0", borderBottom: `1px solid ${t.border}`,
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: t.textSec }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 500, color: t.text, textAlign: "left", maxWidth: "60%" }}>{value || "—"}</span>
    </div>
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 480, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: t.text }}>تفاصيل المركبة</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>
            جارٍ تحميل البيانات...
          </div>
        ) : error ? (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "14px 16px", fontSize: 13, color: "#c74848",
          }}>{error}</div>
        ) : details ? (
          <div>
            {detailRow("رقم اللوحة", details.plateNumber)}
            {detailRow("الموديل", details.model)}
            {detailRow("اللون", details.color)}
            {detailRow("النوع", VEHICLE_TYPE_MAP[details.type] || details.type)}
            {detailRow("الحالة",
              details.status === "ARCHIVED"
                ? VEHICLE_STATUS_MAP.ARCHIVED
                : details.inMaintenanceNow
                  ? "في الصيانة"
                  : (VEHICLE_STATUS_MAP[details.status] || details.status)
            )}
            {detailRow("ملاحظات الإدارة", details.adminNotes)}
            {detailRow("تاريخ الإنشاء", details.createdAt ? new Date(details.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, numberingSystem: "latn" }) : null)}
            {details.currentMaintenancePeriod && detailRow(
              "الفترة الحالية",
              <MaintRange start={details.currentMaintenancePeriod.startAt} end={details.currentMaintenancePeriod.endAt} />
            )}
            {details.upcomingMaintenancePeriods?.length > 0 && detailRow("فترات صيانة قادمة", `${details.upcomingMaintenancePeriods.length}`)}
          </div>
        ) : null}

        <div style={{ marginTop: 24 }}>
          <button onClick={onClose} style={{
            width: "100%", padding: "12px", borderRadius: 12,
            background: t.bgElevated, color: t.textSec,
            border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}>إغلاق</button>
        </div>
      </div>
    </div>
  );
}

function ArchiveVehicleConfirm({ t, vehicle, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");
    setSubmitting(true);
    try {
      const { data } = await vehiclesService.archive(vehicle.id);
      onSuccess(data?.data ?? data);
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join("، ") : msg || "حدث خطأ أثناء أرشفة المركبة");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)", display: "flex",
      alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={(ev) => ev.stopPropagation()} style={{
        background: t.bgSurface, borderRadius: 20, padding: "32px 28px",
        width: "100%", maxWidth: 400, border: `1px solid ${t.borderCard}`,
        boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: t.text }}>أرشفة المركبة</h3>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: t.textMuted, fontSize: 22, padding: 4, lineHeight: 1,
          }}><LuX /></button>
        </div>
        <div style={{
          padding: "10px 12px", borderRadius: 9, background: t.cancelled.bg,
          marginBottom: 16, fontSize: 13, color: t.cancelled.text,
        }}>
          هل أنت متأكد من أرشفة المركبة {vehicle.plateNumber}؟ قد يتم إلغاء أو إعادة جدولة حجوزاتها المستقبلية.
        </div>
        {error && (
          <div style={{
            background: "rgba(199,72,72,0.1)", border: "1px solid rgba(199,72,72,0.3)",
            borderRadius: 10, padding: "10px 14px", marginBottom: 16,
            fontSize: 13, color: "#c74848",
          }}>{error}</div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleConfirm} disabled={submitting} style={{
            flex: 1, padding: "12px", borderRadius: 12,
            background: submitting ? t.textMuted : "#c74848",
            color: "#fff", border: "none", fontSize: 15, fontWeight: 700,
            cursor: submitting ? "not-allowed" : "pointer",
          }}>{submitting ? "جارٍ الأرشفة..." : "تأكيد الأرشفة"}</button>
          <button onClick={onClose} style={{
            padding: "12px 20px", borderRadius: 12,
            background: t.bgElevated, color: t.textSec,
            border: `1px solid ${t.border}`, fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

function PageVehicles({ t }) {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission(P.VEHICLES_CREATE);
  const canUpdate = hasPermission(P.VEHICLES_UPDATE);
  const canFuel = hasPermission(P.VEHICLES_FUEL);
  const canMaintenance = hasPermission(P.VEHICLES_MAINTENANCE);
  const canArchive = hasPermission(P.VEHICLES_ARCHIVE);

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [fuelVehicle, setFuelVehicle] = useState(null);
  const [maintenanceVehicle, setMaintenanceVehicle] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [detailsVehicleId, setDetailsVehicleId] = useState(null);
  const [vehicleResult, setVehicleResult] = useState(null);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      if (search.trim()) params.search = search.trim();
      const { data } = await vehiclesService.getAll(params);
      setVehicles(Array.isArray(data) ? data : data.data || []);
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        if (typeFilter) params.type = typeFilter;
        if (search.trim()) params.search = search.trim();
        const { data } = await vehiclesService.getAll(params);
        if (!cancelled) setVehicles(Array.isArray(data) ? data : data.data || []);
      } catch {
        if (!cancelled) setVehicles([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [search, statusFilter, typeFilter]);

  const tableRows = vehicles.map((v) => [
    v.plateNumber || "—",
    v.model || "—",
    VEHICLE_TYPE_MAP[v.type] || v.type || "—",
    v.color || "—",
    VEHICLE_STATUS_MAP[v.status] || v.status || "—",
    v,
  ]);

  return (
    <div>
      <SectionHeader
        title="إدارة المركبات"
        subtitle={loading ? "جارٍ التحميل..." : `${vehicles.length} مركبات — مدرسة القيادة`}
        action={canCreate ? "+ إضافة مركبة" : null}
        onAction={() => setShowAddModal(true)}
        t={t}
      />

      <ActionResultBanner t={t} result={vehicleResult} onDismiss={() => setVehicleResult(null)} />

      <div style={{
        background: t.bgSurface, borderRadius: 10, border: `0.5px solid ${t.borderCard}`,
        padding: "12px 16px", marginBottom: 16,
        display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
      }}>
        <input
          placeholder="بحث برقم اللوحة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 160, padding: "8px 12px", borderRadius: 7,
            border: `0.5px solid ${t.border}`, background: t.bgElevated,
            color: t.text, fontSize: 13,
          }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 7, border: `0.5px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 12 }}>
          {VEHICLE_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 7, border: `0.5px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 12 }}>
          {VEHICLE_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>
          جارٍ تحميل بيانات المركبات...
        </div>
      ) : vehicles.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>
          لا توجد مركبات
        </div>
      ) : (
        <div style={{ borderRadius: 10, border: `0.5px solid ${t.border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: t.bgElevated }}>
                {["رقم اللوحة", "الموديل", "النوع", "اللون", "الحالة", "إجراءات"].map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 14px", textAlign: "right",
                    color: t.textMuted, fontWeight: 600,
                    fontSize: 12, borderBottom: `0.5px solid ${t.border}`,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => {
                const vehicle = row[5];
                return (
                <tr key={ri} style={{
                  background: ri % 2 === 0 ? t.bgSurface : t.bgPage,
                  borderBottom: `0.5px solid ${t.border}`,
                }}>
                  {row.slice(0, 5).map((cell, ci) => (
                    <td key={ci} style={{ padding: "10px 14px", color: t.text, fontSize: 14 }}>
                      {typeof cell === "string" && ["متاحة", "في الصيانة", "غير متاحة", "عادي", "أوتوماتيك"].includes(cell)
                        ? <Badge status={cell} t={t} />
                        : cell}
                    </td>
                  ))}
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <button onClick={() => setDetailsVehicleId(vehicle?.id)} style={{
                        padding: "4px 10px", borderRadius: 6, background: t.bgElevated,
                        color: t.text, border: `1px solid ${t.border}`, fontSize: 11, cursor: "pointer", fontWeight: 600,
                        display: "flex", alignItems: "center", gap: 4,
                      }}><LuEye size={13} />تفاصيل</button>
                      {canUpdate && (
                        <button onClick={() => setEditVehicle(vehicle)} style={{
                          padding: "4px 10px", borderRadius: 6, background: t.accentLight,
                          color: t.accentText, border: "none", fontSize: 11, cursor: "pointer", fontWeight: 600,
                        }}>تعديل</button>
                      )}
                      {canFuel && (
                        <button onClick={() => setFuelVehicle(vehicle)} style={{
                          padding: "4px 10px", borderRadius: 6, background: t.accentLight,
                          color: t.accentText, border: "none", fontSize: 11, cursor: "pointer", fontWeight: 600,
                        }}>وقود</button>
                      )}
                      {canMaintenance && vehicle?.status !== "ARCHIVED" && (
                        <button onClick={() => setMaintenanceVehicle(vehicle)} style={{
                          padding: "4px 10px", borderRadius: 6, background: t.pending.bg,
                          color: t.pending.text, border: "none", fontSize: 11, cursor: "pointer", fontWeight: 600,
                        }}>الصيانة</button>
                      )}
                      {canArchive && vehicle?.status !== "ARCHIVED" && (
                        <button onClick={() => setArchiveTarget(vehicle)} style={{
                          padding: "4px 10px", borderRadius: 6, background: t.cancelled.bg,
                          color: t.cancelled.text, border: "none", fontSize: 11, cursor: "pointer", fontWeight: 600,
                        }}>أرشفة</button>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <AddVehicleModal
          t={t}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); fetchVehicles(); }}
        />
      )}

      {editVehicle && (
        <EditVehicleModal
          t={t}
          vehicle={editVehicle}
          onClose={() => setEditVehicle(null)}
          onSuccess={() => { setEditVehicle(null); fetchVehicles(); }}
        />
      )}

      {fuelVehicle && (
        <FuelModal
          t={t}
          vehicle={fuelVehicle}
          onClose={() => setFuelVehicle(null)}
          onSuccess={() => { setFuelVehicle(null); fetchVehicles(); }}
        />
      )}

      {maintenanceVehicle && (
        <MaintenanceModal
          t={t}
          vehicle={maintenanceVehicle}
          onClose={() => setMaintenanceVehicle(null)}
          onVehicleChanged={fetchVehicles}
        />
      )}

      {archiveTarget && (
        <ArchiveVehicleConfirm
          t={t}
          vehicle={archiveTarget}
          onClose={() => setArchiveTarget(null)}
          onSuccess={(result) => { setArchiveTarget(null); setVehicleResult(result); fetchVehicles(); }}
        />
      )}

      {detailsVehicleId && (
        <VehicleDetailsModal
          t={t}
          vehicleId={detailsVehicleId}
          onClose={() => setDetailsVehicleId(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: TRANSPORT SERVICE — خدمة النقل
// ═══════════════════════════════════════════════
function PageTransport({ t }) {
  return (
    <div>
      <SectionHeader title="خدمة النقل الجماعي" subtitle="نقل الطلاب للمحاضرات النظرية ويوم الامتحان" action="+ رحلة جديدة" t={t} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

        {/* Lecture Transport */}
        <div style={{ background: t.bgSurface, borderRadius: 12, border: `0.5px solid ${t.borderCard}`, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>رحلات المحاضرات النظرية</div>
            <Badge status="قيد المتابعة" t={t} />
          </div>
          <div style={{ fontSize: 12, color: t.textSec, marginBottom: 12 }}>
            ٣ أيام متتالية — دفع واحد من أول يوم
          </div>
          <Table t={t}
            headers={["الطالب", "اليوم ١", "اليوم ٢", "اليوم ٣", "الدفع"]}
            rows={[
              ["نورا الأحمد", "حضر", "حضر", "—", "مدفوع"],
              ["كريم عبدو", "حضر", "حضر", "—", "مدفوع"],
              ["سعيد المحمد", "حضر", "—", "—", "مدفوع"],
              ["لمى الزعبي", "لم يحضر", "—", "—", "مدفوع"],
            ]}
          />
          <div style={{ marginTop: 10, padding: "8px 12px", background: t.accentLight, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: t.accentText }}>
              مواعيد الرحلة: الأحد ١٥ يونيو — الاثنين ١٦ يونيو — الثلاثاء ١٧ يونيو
            </div>
            <div style={{ fontSize: 11, color: t.accentText, marginTop: 2 }}>
              موعد التجمع: ٧:٣٠ صباحاً أمام المدرسة
            </div>
          </div>
        </div>

        {/* Exam Day Transport */}
        <div style={{ background: t.bgSurface, borderRadius: 12, border: `0.5px solid ${t.borderCard}`, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>رحلة يوم الامتحان</div>
            <Badge status="قيد المتابعة" t={t} />
          </div>
          <div style={{ fontSize: 12, color: t.textSec, marginBottom: 12 }}>
            يوم واحد فقط — اختياري — دفع منفصل
          </div>
          <Table t={t}
            headers={["الطالب", "موعد الامتحان", "التسجيل", "الدفع"]}
            rows={[
              ["باسل الخطيب", "٤ يونيو — ٩:٠٠", "مسجل", "مدفوع"],
              ["رنا سليمان", "٤ يونيو — ١٠:٠٠", "مسجل", "مدفوع"],
              ["سعيد المحمد", "٢٥ يونيو", "غير مسجل", "—"],
            ]}
          />
          <div style={{ marginTop: 10, padding: "8px 12px", background: t.accentLight, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: t.accentText }}>
              الطالب يتلقى إشعاراً بموعد امتحانه ورابط تسجيل خدمة النقل
            </div>
          </div>
        </div>
      </div>

      {/* Transport flow explanation */}
      <div style={{ background: t.bgSurface, borderRadius: 12, border: `0.5px solid ${t.borderCard}`, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 12 }}>آلية خدمة النقل</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            "١. قبول طلب الشهادة",
            "٢. إرسال إشعار للطالب بالمحاضرات",
            "٣. الطالب يسجل في خدمة النقل",
            "٤. دفع رسوم النقل من المدرسة",
            "٥. تسجيل الحضور ٣ أيام",
            "٦. إرسال موعد الامتحان",
            "٧. خدمة نقل يوم الامتحان (اختياري)",
          ].map((s, i) => (
            <div key={i} style={{
              padding: "6px 14px", borderRadius: 8,
              background: t.accentLight, color: t.accentText,
              fontSize: 12, fontWeight: 600,
              border: `0.5px solid ${t.accentText}30`,
            }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: ACCOUNTING
// ═══════════════════════════════════════════════
function PageAccounting({ t }) {
  const [from, setFrom] = useState(firstOfMonthStr());
  const [to,   setTo]   = useState(todayStr());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await accountingService.getOverview({ from, to });
        if (!cancelled) setData(res.data?.data ?? res.data ?? null);
      } catch {
        if (!cancelled) setError("تعذّر تحميل البيانات. تحقق من الاتصال وأعد المحاولة.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [from, to]);

  const fmt$ = (v) => {
    if (v == null) return "—";
    const n = Number(v);
    return n < 0
      ? `${Math.abs(n).toLocaleString("en")}- ل.س`
      : `${n.toLocaleString("en")} ل.س`;
  };

  const net      = data?.net      ?? {};
  const expenses = data?.expenses ?? {};
  const revenue  = data?.revenue  ?? {};
  const gov      = data?.governmentHoldings ?? {};

  const resultColor = (v) =>
    v == null ? t.textMuted : v >= 0 ? "#16a34a" : "#dc2626";

  const cardStyle = {
    background: t.bgSurface,
    borderRadius: 12,
    border: `0.5px solid ${t.borderCard}`,
    padding: 16,
  };
  const sectionTitle = (text) => (
    <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 12 }}>
      {text}
    </div>
  );

  return (
    <div>
      <SectionHeader
        title="المحاسبة التشغيلية"
        subtitle="إيرادات ومصاريف النتيجة التشغيلية"
        t={t}
      />

      {/* Date range picker */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 12, color: t.textSec, fontWeight: 600 }}>من</label>
          <input
            type="date" value={from} onChange={e => setFrom(e.target.value)}
            style={{
              padding: "7px 10px", borderRadius: 8, border: `1px solid ${t.border}`,
              background: t.bgElevated, color: t.text, fontSize: 13, fontFamily: "inherit",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 12, color: t.textSec, fontWeight: 600 }}>إلى</label>
          <input
            type="date" value={to} onChange={e => setTo(e.target.value)}
            style={{
              padding: "7px 10px", borderRadius: 8, border: `1px solid ${t.border}`,
              background: t.bgElevated, color: t.text, fontSize: 13, fontFamily: "inherit",
            }}
          />
        </div>
        {loading && (
          <span style={{ fontSize: 12, color: t.textMuted }}>جارٍ التحميل...</span>
        )}
        {error && (
          <span style={{ fontSize: 12, color: "#dc2626" }}>{error}</span>
        )}
      </div>

      {/* ─── Summary Cards ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 20 }}>
        <StatCard
          label="دخل المدرسة الصافي"
          value={fmt$(net.schoolIncome)}
          color={t.accent}
          icon={<PiChartLineUp />}
          t={t}
        />
        <StatCard
          label="إجمالي المصاريف"
          value={fmt$(net.totalExpenses)}
          color={t.accent}
          icon={<PiChartLineDown />}
          t={t}
        />
        <StatCard
          label="صافي الربح التشغيلي"
          value={fmt$(net.operatingResult)}
          color={resultColor(net.operatingResult)}
          icon={<FaChartLine />}
          t={t}
        />
        <StatCard
          label="صافي التدفق النقدي"
          value={fmt$(net.operatingResultCash)}
          color={resultColor(net.operatingResultCash)}
          icon={<FaChartColumn />}
          t={t}
        />
      </div>

      {/* ─── Expenses & Revenue tables side by side ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

        {/* Expenses breakdown */}
        <div style={cardStyle}>
          {sectionTitle("المصاريف حسب النوع")}
          <Table
            t={t}
            headers={["النوع", "الإجمالي", "التفاصيل"]}
            rows={[
              [
                "وقود ومركبات",
                fmt$(expenses.vehicles?.total),
                <div key="v"><div>نقدي {fmt$(expenses.vehicles?.cash)}</div><div>شام {fmt$(expenses.vehicles?.shamCash)}</div></div>,
              ],
              [
                "مستحقات المدربين",
                fmt$(expenses.instructors?.total),
                <div key="i"><div>مدفوع {fmt$(expenses.instructors?.paid)}</div><div>متبقي {fmt$(expenses.instructors?.unpaid)}</div></div>,
              ],
              [
                "رواتب الموظفين",
                fmt$(expenses.employees?.total),
                <div key="e">نقدي {fmt$(expenses.employees?.cash)}</div>,
              ],
              [
                "المصاريف العامة",
                fmt$(expenses.general?.total),
                <div key="g"><div>نقدي {fmt$(expenses.general?.cash)}</div><div>شام {fmt$(expenses.general?.shamCash)}</div></div>,
              ],
              [
                "الإجمالي الكلي",
                fmt$(expenses.grandTotal?.total),
                <div key="gt"><div>مدفوع {fmt$(expenses.grandTotal?.paid)}</div><div>متبقي {fmt$(expenses.grandTotal?.unpaid)}</div></div>,
              ],
            ]}
          />
        </div>

        {/* Revenue breakdown */}
        <div style={cardStyle}>
          {sectionTitle("الإيرادات حسب النوع")}
          <Table
            t={t}
            headers={["النوع", "الإجمالي", "التفاصيل"]}
            rows={[
              [
                "إيرادات الدروس",
                fmt$(revenue.lessons?.total),
                <div key="l"><div>نقدي {fmt$(revenue.lessons?.cash)}</div><div>شام {fmt$(revenue.lessons?.shamCash)}</div></div>,
              ],
              [
                "رسوم الشهادة الحكومية",
                fmt$(revenue.certificates?.total),
                <div key="c"><div>حصة الحكومة {fmt$(revenue.certificates?.governmentShare)}</div><div>حصة المدرسة {fmt$(revenue.certificates?.schoolShare)}</div></div>,
              ],
              [
                "إجمالي إيرادات المدرسة الصافية",
                fmt$(revenue.schoolNetRevenue?.total),
                <div key="n"><div>دروس {fmt$(revenue.schoolNetRevenue?.lessons)}</div><div>شهادات {fmt$(revenue.schoolNetRevenue?.certificatesSchoolShare)}</div></div>,
              ],
            ]}
          />
        </div>
      </div>

      {/* ─── Government Holdings ─── */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        {sectionTitle("مستحقات الحكومة (محصَّل لحسابها)")}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 14 }}>
          {[
            { label: "المبلغ المحصَّل", value: fmt$(gov.collected) },
            { label: "المبلغ المُسلَّم", value: fmt$(gov.remitted) },
            { label: "الرصيد القائم",   value: fmt$(gov.outstanding) },
          ].map(({ label, value }) => (
            <div key={label} style={{
              background: t.bgElevated, borderRadius: 9,
              padding: "12px 14px", textAlign: "center",
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: t.accent, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 12, color: t.textMuted }}>{label}</div>
            </div>
          ))}
        </div>
        {gov.note && (
          <div style={{
            padding: "10px 13px", borderRadius: 8, fontSize: 12, lineHeight: 1.7,
            background: t.bgPage, color: t.textSec,
            border: `1px solid ${t.border}`,
          }}>
            ℹ {gov.note}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: REPORTS
// ═══════════════════════════════════════════════
function VehicleReportPicker({ t, onSelect }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const params = {};
        if (search.trim()) params.search = search.trim();
        const { data } = await vehiclesService.getAll(params);
        if (!cancelled) setVehicles(Array.isArray(data) ? data : data.data || []);
      } catch {
        if (!cancelled) setVehicles([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [search]);

  return (
    <div>
      <input
        placeholder="بحث برقم اللوحة..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%", maxWidth: 320, padding: "8px 12px", borderRadius: 7,
          border: `0.5px solid ${t.border}`, background: t.bgElevated, color: t.text,
          fontSize: 13, marginBottom: 14,
        }}
      />
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>جارٍ تحميل المركبات...</div>
      ) : vehicles.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>لا توجد مركبات</div>
      ) : (
        <div style={{ borderRadius: 10, border: `0.5px solid ${t.border}`, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: t.bgElevated }}>
                {["رقم اللوحة", "الموديل", "اللون", "الحالة", ""].map((h, i) => (
                  <th key={i} style={{ padding: "10px 14px", textAlign: "right", color: t.textMuted, fontWeight: 600, fontSize: 12, borderBottom: `0.5px solid ${t.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v, ri) => (
                <tr key={v.id} style={{ background: ri % 2 === 0 ? t.bgSurface : t.bgPage, borderBottom: `0.5px solid ${t.border}` }}>
                  <td style={{ padding: "10px 14px", color: t.text }}>{v.plateNumber || "—"}</td>
                  <td style={{ padding: "10px 14px", color: t.text }}>{v.model || "—"}</td>
                  <td style={{ padding: "10px 14px", color: t.text }}>{v.color || "—"}</td>
                  <td style={{ padding: "10px 14px" }}><Badge status={VEHICLE_STATUS_MAP[v.status] || v.status || "—"} t={t} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    <button onClick={() => onSelect(v.id)} style={{
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

function PageReports({ t }) {
  const [vehicleReportOpen, setVehicleReportOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [instructorReportOpen, setInstructorReportOpen] = useState(false);
  const [bookingRevenueReportOpen, setBookingRevenueReportOpen] = useState(false);
  const [employeeReportOpen, setEmployeeReportOpen] = useState(false);
  const [generalExpensesReportOpen, setGeneralExpensesReportOpen] = useState(false);
  const [govCertificateReportOpen, setGovCertificateReportOpen] = useState(false);

  if (selectedVehicleId) {
    return <VehicleReportDashboard t={t} vehicleId={selectedVehicleId} onBack={() => setSelectedVehicleId(null)} />;
  }

  if (instructorReportOpen) {
    return <InstructorReportDashboard t={t} onBack={() => setInstructorReportOpen(false)} />;
  }

  if (bookingRevenueReportOpen) {
    return <BookingRevenueReportDashboard t={t} onBack={() => setBookingRevenueReportOpen(false)} />;
  }

  if (employeeReportOpen) {
    return <EmployeeReportDashboard t={t} onBack={() => setEmployeeReportOpen(false)} />;
  }

  if (generalExpensesReportOpen) {
    return <GeneralExpensesReportDashboard t={t} onBack={() => setGeneralExpensesReportOpen(false)} />;
  }

  if (govCertificateReportOpen) {
    return <GovCertificateReportDashboard t={t} onBack={() => setGovCertificateReportOpen(false)} />;
  }

  if (vehicleReportOpen) {
    return (
      <div>
        <button onClick={() => setVehicleReportOpen(false)} style={{
          display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none",
          color: t.accentText, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: 0, marginBottom: 16,
        }}>→ رجوع للتقارير</button>
        <SectionHeader title="تقرير المركبات" subtitle="اختر مركبة لعرض تقرير الأداء والمصاريف التفصيلي" t={t} />
        <div style={{ marginTop: 16 }}>
          <VehicleReportPicker t={t} onSelect={(id) => setSelectedVehicleId(id)} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="التقارير الإدارية"
        subtitle="تقارير يومية وأسبوعية وشهرية وسنوية"
        t={t}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {[
          {
            key: "instructors",
            title: "تقرير المدربين",
            desc: "جلسات مكتملة، ملغية، مستحقات",
            icon: <FaUserTie size={24} color="t.accent" />,
            onOpen: () => setInstructorReportOpen(true),
          },
          {
            key: "vehicles",
            title: "تقرير المركبات",
            desc: "استخدام كل مركبة، صيانة، توقف",
            icon: <FaCar size={24} color="t.accent" />,
            onOpen: () => setVehicleReportOpen(true),
          },
          {
            key: "bookingRevenue",
            title: "تقرير الحجوزات والإيرادات",
            desc: "إيرادات مقبوضة، مستحقات قادمة، تفصيل يومي للدفعات",
            icon: <RiCalendarScheduleLine size={24} color="t.accent" />,
            onOpen: () => setBookingRevenueReportOpen(true),
          },
          {
            key: "employeeExpenses",
            title: "تقرير مصاريف الموظفين",
            desc: "رواتب، مكافآت، مصاريف أخرى — استقبال ومحاسبة",
            icon: <TbUserDollar size={24} color="t.accent" />,
            onOpen: () => setEmployeeReportOpen(true),
          },
          {
            key: "generalExpenses",
            title: "تقرير المصاريف العامة",
            desc: "مياه، كهرباء، إنترنت، مطبخ، قرطاسية، وغير ذلك",
            icon: <TbReportMoney size={24} color="t.accent" />,
            onOpen: () => setGeneralExpensesReportOpen(true),
          },
          {
            key: "govCertificate",
            title: "تقرير الشهادة الحكومية والإيرادات",
            desc: "رسوم الشهادة، إعادة الامتحان، حصة المدرسة والحكومة",
            icon: <FaRegAddressCard size={24} color="t.accent" />,
            onOpen: () => setGovCertificateReportOpen(true),
          },
        ].map((r) => (
          <div
            key={r.key}
            onClick={r.onOpen}
            style={{
              background: t.bgSurface,
              borderRadius: 12,
              border: `0.5px solid ${t.borderCard}`,
              padding: 20,
              cursor: "pointer",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{r.icon}</div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: t.text,
                marginBottom: 6,
              }}
            >
              {r.title}
            </div>
            <div style={{ fontSize: 12, color: t.textSec }}>
              {r.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: USERS & PERMISSIONS
// ═══════════════════════════════════════════════
function PageUsers({ t }) {
  const { hasPermission } = useAuth();
  return (
    <div>
      <SectionHeader title="إدارة المستخدمين والصلاحيات" subtitle="للمدير فقط" action={hasPermission(P.USERS_CREATE) ? "+ إضافة مستخدم" : null} t={t} />
      <Table t={t}
        headers={["الاسم", "اسم المستخدم", "الدور", "الحالة", "آخر دخول", "ملاحظة"]}
        rows={[
          ["محمد هاشم", "mhashm", "مدير", "نشط", "الآن", "—"],
          ["أم كمال", "umkamal", "موظف إداري + محاسب", "نشط", "منذ ساعة", "صلاحيتان مدمجتان"],
          ["خالد عمر", "khalid.omar", "مدرب", "نشط", "أمس", "مرتبط بملف المدرب"],
          ["ليلى سعد", "layla.saad", "مدرب", "نشط", "أمس", "مرتبط بملف المدرب"],
          ["أحمد الناصر", "ahmad.n", "طالب", "نشط", "اليوم", "مرتبط بملف الطالب"],
          ["سعد القديمي", "saad.old", "موظف إداري", "غير نشط", "منذ ٦ أشهر", "موظف سابق"],
        ]}
      />
      <div style={{ marginTop: 16, background: t.bgSurface, borderRadius: 12, border: `0.5px solid ${t.borderCard}`, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 12 }}>مصفوفة الصلاحيات</div>
        <Table t={t}
          headers={["الموديول", "المدير", "الموظف الإداري", "المحاسب", "المدرب", "الطالب"]}
          rows={[
            ["لوحة التحكم", "✔ كامل", "✔ كامل", "✔ مالي", "✖", "✖"],
            ["إدارة الطلاب", "✔", "✔", "👁️ عرض", "✖", "👤 نفسه"],
            ["الحجز والجدولة", "✔", "✔", "👁️ عرض", "📅 جدوله", "✔ لنفسه"],
            ["الدفعات", "✔", "تسجيل نقدي", "✔ كامل", "✖", "رفع إثبات"],
            ["المحاسبة", "✔", "✖", "✔ كامل", "✖", "✖"],
            ["المستخدمون", "✔ حصراً", "✖", "✖", "✖", "✖"],
            ["الإعدادات", "✔ حصراً", "✖", "✖", "✖", "✖"],
          ]}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: SETTINGS — helpers (module-level)
// ═══════════════════════════════════════════════

// API returns arrays; find by key string
function sysVal(arr, key) {
  return arr?.find(i => i.key === key)?.value ?? null;
}

function fmtSettingVal(key, raw) {
  if (raw == null || raw === "") return "—";
  const n = Number(raw);
  const isNum = !isNaN(n) && String(raw).trim() !== "";
  if (/_fee$|_share$/.test(key) || /^(lesson_price|instructor_price)/.test(key))
    return isNum ? n.toLocaleString("en-US") + " ل.س" : raw;
  if (/_percentage$/.test(key))      return isNum ? n + "%" : raw;
  if (/_minutes$/.test(key))         return isNum ? n + " دقيقة" : raw;
  if (/_hours$/.test(key))           return isNum ? n + " ساعة" : raw;
  if (/_days$/.test(key))            return isNum ? n + " يوم" : raw;
  if (/_sessions_count$/.test(key))  return isNum ? n + " جلسة" : raw;
  if (/_course_window$/.test(key))   return isNum ? n + " دورة" : raw;
  return isNum ? n.toLocaleString("en-US") : raw;
}

const DEPOSIT_KEYS = [
  { key: "deposit_percentage",               label: "نسبة العربون" },
  { key: "booking_hold_minutes",             label: "مدة الحجز المعلق" },
  { key: "booking_completion_grace_minutes", label: "مهلة إتمام الدرس" },
  { key: "booking_window_days",              label: "نافذة الحجز" },
];
const SCHEDULING_KEYS = [
  { key: "lesson_duration_minutes", label: "مدة الحصة" },
  { key: "shamcash_receiver_name",  label: "اسم مستلم شام كاش" },
];
const CERT_FEE_KEYS = [
  { key: "certificate_service_fee",             label: "رسوم خدمة الشهادة" },
  { key: "certificate_reexam_fee",              label: "رسوم إعادة الفحص" },
  { key: "certificate_service_school_share",    label: "حصة المدرسة من رسم الشهادة" },
  { key: "certificate_reexam_school_share",     label: "حصة المدرسة من رسم الإعادة" },
  { key: "certificate_training_sessions_count", label: "عدد جلسات التدريب" },
  { key: "certificate_reexam_course_window",    label: "دورات لقبول الإعادة" },
  { key: "certificate_reexam_cutoff_hours",     label: "إغلاق التسجيل للإعادة" },
  { key: "certificate_course_min_size",         label: "الحد الأدنى لطلاب الدفعة" },
  { key: "certificate_course_start_number",     label: "رقم أول دورة" },
];

function splitValUnit(formatted) {
  if (!formatted || formatted === "—") return { num: formatted || "—", unit: "" };
  if (formatted.endsWith("%")) return { num: formatted.slice(0, -1), unit: "%" };
  const idx = formatted.indexOf(" ");
  if (idx === -1) return { num: formatted, unit: "" };
  return { num: formatted.slice(0, idx), unit: formatted.slice(idx + 1) };
}

function MiniSettingCard({ label, value, t }) {
  const { num, unit } = splitValUnit(value);
  // Only apply large-bold + small-unit treatment when num is actually numeric (or the dash placeholder)
  const isNumeric = num === "—" || !isNaN(Number(num.replace(/,/g, "")));
  return (
    <div style={{
      background: t.bgSurface,
      borderRadius: 12,
      border: `1px solid ${t.borderCard}`,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: 12,
      minHeight: 86,
      boxSizing: "border-box",
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: t.textSec, lineHeight: 1.5 }}>
        {label}
      </div>
      {isNumeric ? (
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: t.text, lineHeight: 1 }}>{num}</span>
          {unit && (
            <span style={{ fontSize: 11, fontWeight: 600, color: t.textMuted }}>{unit}</span>
          )}
        </div>
      ) : (
        <div style={{ fontSize: 14, fontWeight: 500, color: t.text, lineHeight: 1.4 }}>{value}</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: SETTINGS
// ═══════════════════════════════════════════════
function PageSettings({ t }) {
  const [raw, setRaw]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let alive = true;
    settingsService.getAll()
      .then(r => {
        if (!alive) return;
        // API: { statusCode, data: { system: [...], lessonPrices: [...], instructorWages: [...] } }
        setRaw(r.data?.data ?? r.data ?? {});
      })
      .catch(() => { if (alive) setError("تعذّر تحميل الإعدادات — تحقق من الاتصال بالخادم"); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 80, textAlign: "center", color: t.textMuted }}>
        <div style={{ fontSize: 36, marginBottom: 14, opacity: 0.4 }}>⚙️</div>
        <div style={{ fontSize: 14 }}>جاري تحميل الإعدادات...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#dc2626" }}>{error}</div>
      </div>
    );
  }

  // All three sections are arrays in the API response
  const sysArr   = Array.isArray(raw?.system)        ? raw.system        : [];
  const priceArr = Array.isArray(raw?.lessonPrices)  ? raw.lessonPrices  : [];
  const wageArr  = Array.isArray(raw?.instructorWages) ? raw.instructorWages : [];

  const section = {
    marginBottom: 22,
  };
  const sectionTitle = {
    fontSize: 13, fontWeight: 700, color: t.textSec,
    marginBottom: 10, paddingBottom: 8,
    borderBottom: `1px solid ${t.border}`,
    letterSpacing: "0.02em",
  };
  // auto-fill: gives 4 cols on wide screens, fewer on narrow; min 180px per card
  const miniGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: 12,
  };

  return (
    <div style={{ paddingBottom: 40 }}>
      <SectionHeader title="إعدادات النظام" t={t} />

      {/* العربون والحجز */}
      <div style={section}>
        <div style={sectionTitle}>العربون والحجز</div>
        <div style={miniGrid}>
          {DEPOSIT_KEYS.map(({ key, label }) => (
            <MiniSettingCard key={key} label={label} value={fmtSettingVal(key, sysVal(sysArr, key))} t={t} />
          ))}
        </div>
      </div>

      {/* الجدولة والنظام */}
      <div style={section}>
        <div style={sectionTitle}>الجدولة والنظام</div>
        <div style={miniGrid}>
          {SCHEDULING_KEYS.map(({ key, label }) => (
            <MiniSettingCard key={key} label={label} value={fmtSettingVal(key, sysVal(sysArr, key))} t={t} />
          ))}
        </div>
      </div>

      {/* رسوم الشهادة الحكومية */}
      <div style={section}>
        <div style={sectionTitle}>رسوم الشهادة الحكومية</div>
        <div style={miniGrid}>
          {CERT_FEE_KEYS.map(({ key, label }) => (
            <MiniSettingCard key={key} label={label} value={fmtSettingVal(key, sysVal(sysArr, key))} t={t} />
          ))}
        </div>
      </div>

      {/* أسعار الدروس — dynamic from lessonPrices array */}
      {priceArr.length > 0 && (
        <div style={section}>
          <div style={sectionTitle}>أسعار الدروس (ل.س)</div>
          <div style={miniGrid}>
            {priceArr.map(item => {
              const v = item.value != null && item.value !== ""
                ? Number(item.value).toLocaleString("en-US") + " ل.س" : "—";
              return (
                <MiniSettingCard key={item.key} label={item.description || item.key} value={v} t={t} />
              );
            })}
          </div>
        </div>
      )}

      {/* أجور المدربين */}
      <div style={section}>
        <div style={sectionTitle}>أجور المدربين (ل.س)</div>
        <div style={miniGrid}>
          {wageArr.length > 0
            ? wageArr.map(item => (
                <MiniSettingCard
                  key={item.key}
                  label={item.description || item.key}
                  value={fmtSettingVal(item.key, item.value)}
                  t={t}
                />
              ))
            : <div style={{ fontSize: 12, color: t.textMuted }}>لا توجد بيانات</div>
          }
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PLACEHOLDER PAGES
// ═══════════════════════════════════════════════
function PlaceholderPage({ title, t }) {
  return (
    <div>
      <SectionHeader title={title} t={t} />
      <div style={{ padding: 40, textAlign: "center", color: t.textMuted, fontSize: 14 }}>
        صفحة {title} — ستُبنى في الجولة القادمة
      </div>
    </div>
  );
}

function AccessDeniedPage({ t }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "90px 20px",
        textAlign: "center",
        height: "100%",
      }}
    >
      <div style={{ fontSize: 42, marginBottom: 14 }}>🔒</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 8 }}>
        غير مصرح لك بالوصول لهذه الصفحة
      </div>
      <div style={{ fontSize: 13, color: t.textMuted, maxWidth: 380, lineHeight: 1.8 }}>
        صلاحياتك الحالية لا تشمل عرض هذا القسم. إذا كنت تعتقد أن هذا خطأ، تواصل مع مدير النظام.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP SHELL
// ═══════════════════════════════════════════════

// يمنع انهيار كامل الواجهة (شاشة بيضاء) عند خطأ Render داخل صفحة واحدة —
// يعرض بدلاً منه رسالة الخطأ الفعلية (نص + stack بالـ console) بدل شاشة فارغة صامتة.
// key={activePage} بمكان الاستخدام يصفّر حالة الخطأ تلقائياً عند تبديل الصفحة.
class PageErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("[PageErrorBoundary] فشل عرض الصفحة:", error, info?.componentStack);
  }
  render() {
    if (this.state.error) {
      const t = this.props.t || {};
      const errColor = t.cancelled?.text || "#c74848";
      const errBg = t.cancelled?.bg || "rgba(199,72,72,0.08)";
      return (
        <div style={{
          margin: 20, padding: "28px 24px", borderRadius: 14,
          background: errBg, border: `1px solid ${errColor}40`,
          color: errColor, textAlign: "center",
        }}>
          <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 10 }}>تعذّر عرض هذه الصفحة</div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, direction: "ltr", fontFamily: "monospace" }}>
            {this.state.error.message}
          </div>
          <div style={{ fontSize: 12, opacity: 0.75 }}>افتح أدوات المطوّر (Console) بالمتصفح لمعرفة تفاصيل الخطأ الكاملة</div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App({
  embeddedMode,
  activePage: externalPage,
  onPageChange,
  adminSubPage: externalAdminSub,
  accountantSubPage: externalAccountantSub,
  receptionistSubPage: externalReceptionistSub,
  darkMode: externalDarkMode,
}) {
  const { hasPermission } = useAuth();
  const [internalDarkMode, setDarkMode] = useState(false);
  const darkMode = embeddedMode ? (externalDarkMode ?? false) : internalDarkMode;
  const [internalPage, setInternalPage] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [internalAdminSub, setInternalAdminSub] = useState("permissions");
  const [internalAccountantSub, setInternalAccountantSub] = useState("general-expenses");
  const [internalReceptionistSub, setInternalReceptionistSub] = useState("students");

  const activePage = embeddedMode ? externalPage : internalPage;
  const setActivePage = embeddedMode ? onPageChange : setInternalPage;
  const adminSubPage = embeddedMode ? (externalAdminSub || "permissions") : internalAdminSub;
  const accountantSubPage = embeddedMode ? (externalAccountantSub || "general-expenses") : internalAccountantSub;
  const receptionistSubPage = embeddedMode ? (externalReceptionistSub || "students") : internalReceptionistSub;

  const t = tokens[darkMode ? "dark" : "light"];
  const sidebarWidth = sidebarCollapsed ? 84 : 324;

  const pageComponents = {
    Dashboard: <PageDashboard t={t} />,
    Bookings: <PageBookings t={t} />,
    Students: <PageStudents t={t} />,
    Instructors: <PageInstructors t={t} />,
    Vehicles: <PageVehicles t={t} />,
    Transport: <PageTransport t={t} />,
    Accounting: <PageAccounting t={t} />,
    Reports: <PageReports t={t} />,
    Users: <PageUsers t={t} />,
    Settings: <PageSettings t={t} />,
    AdminProPage: <AdminPro embedded={true} page={adminSubPage} darkMode={darkMode} />,
    AccountantProPage: <AccountantPro embedded={true} page={accountantSubPage} darkMode={darkMode} />,
    ReceptionistPage: <ReceptionistPro embedded={true} page={receptionistSubPage} darkMode={darkMode} />,
  };

  // In embedded mode, render only the page content (layout is handled by MainLayout).
  // MainLayout's sidebar already hides nav buttons the user can't open, but activePage can in
  // principle end up on a restricted page some other way (stale state, a direct setActivePage
  // call, permissions changing mid-session) — this guard is the actual access boundary.
  if (embeddedMode) {
    const requiredPermission = PAGE_PERMISSIONS[activePage];
    const isAllowed = !requiredPermission || hasPermission(requiredPermission);
    return (
      <PageErrorBoundary key={activePage} t={t}>
        {isAllowed
          ? pageComponents[activePage] || <PlaceholderPage title={activePage} t={t} />
          : <AccessDeniedPage t={t} />}
      </PageErrorBoundary>
    );
  }

  // Standalone mode (legacy fallback)
  return (
    <div
      dir="rtl"
      className="app-shell"
      style={{
        display: "flex",
        minHeight: "100svh",
        overflow: "hidden",
        width: "100%",
        background: t.bgPage,
        fontFamily: "var(--font-body)",
        direction: "rtl",
      }}
    >
      {/* ─── SIDEBAR ─── */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} />
      <div
        style={{
          width: sidebarWidth,
          height: "100svh",
          minHeight: "100svh",
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 40,
          background: t.bgSidebar,
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease",
          overflow: "hidden",
          borderLeft: `1px solid ${t.borderCard}`,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "24px 18px 18px",
            borderBottom: `1px solid ${t.borderCard}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              overflow: "hidden",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={qeyadahLogo}
              alt="qeyadah"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#fff7d4",
                  lineHeight: 1.2,
                }}
              >
                مدرسة القيادة
              </div>
              <div style={{ fontSize: 12, color: t.textSidebar, marginTop: 3 }}>
                نظام الإدارة
              </div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: "12px 10px",
          }}
        >
          {navItems
            .filter((item) => {
              if (item.permission) return hasPermission(item.permission);
              return true;
            })
            .map((item) => {
              const isActive = activePage === item.page;
              const displayLabel = item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.page)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: sidebarCollapsed ? "14px 10px" : "14px 16px",
                    borderRadius: 14,
                    border: "none",
                    cursor: "pointer",
                    background: isActive ? t.bgSidebarActive : "transparent",
                    color: isActive ? t.textSidebarActive : t.textSidebar,
                    fontSize: 16,
                    fontWeight: isActive ? 700 : 500,
                    marginBottom: 6,
                    textAlign: "right",
                    justifyContent: sidebarCollapsed ? "center" : "flex-start",
                    transition: "all 0.15s",
                    boxShadow: isActive
                      ? "0 10px 24px rgba(0,0,0,0.18)"
                      : "none",
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span>{displayLabel}</span>}
                </button>
              );
            })}
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: "14px 10px",
            borderTop: `1px solid ${t.borderCard}`,
          }}
        >
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              background: t.accentLight,
              border: "none",
              color: t.accentText,
              cursor: "pointer",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>
      </div>

      {/* ─── MAIN AREA ─── */}
      <div
        className="app-main"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* TOPBAR */}
        <div
          style={{
            height: 56,
            background: t.bgHeader,
            borderBottom: `0.5px solid ${t.border}`,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 14,
            flexShrink: 0,
          }}
        >
          {activePage === "AdminProPage" ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[
                { id: "permissions", label: "الصلاحيات" },
                { id: "pricing", label: "الأسعار وإعدادات النظام" },
              ].map((a) => {
                const isActive = adminSubPage === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setInternalAdminSub(a.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: isActive ? t.bgSidebarActive : "transparent",
                      color: isActive ? t.textSidebarActive : t.textMuted,
                      fontWeight: isActive ? 700 : 600,
                    }}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          ) : activePage === "AccountantProPage" ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[
                { id: "general-expenses", label: "المصاريف العامة" },
                { id: "employees", label: "الموظفون" },
              ].map((a) => {
                const isActive = accountantSubPage === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setInternalAccountantSub(a.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: isActive ? t.bgSidebarActive : "transparent",
                      color: isActive ? t.textSidebarActive : t.textMuted,
                      fontWeight: isActive ? 700 : 600,
                    }}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          ) : activePage === "ReceptionistPage" ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[
                { id: "students", label: "الطلاب" },
                { id: "bookings", label: "الحجوزات" },
                { id: "instructors", label: "المدربون" },
                { id: "certificate", label: "الشهادة" },
                { id: "transport", label: "النقل" },
              ].map((a) => {
                const isActive = receptionistSubPage === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setInternalReceptionistSub(a.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      border: "none",
                      cursor: "pointer",
                      background: isActive ? t.bgSidebarActive : "transparent",
                      color: isActive ? t.textSidebarActive : t.textMuted,
                      fontWeight: isActive ? 700 : 600,
                    }}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: t.textMuted }}>
              {navItems.find((n) => n.page === activePage)?.label || "—"}
            </div>
          )}

          <div style={{ flex: 1 }} />

          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              background: t.accentLight,
              color: t.accentText,
              border: "none",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {darkMode ? "☀️ نهاري" : "🌙 ليلي"}
          </button>

          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: t.accentLight,
              color: t.accentText,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            م
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="hide-scrollbar app-page">
          <PageErrorBoundary key={activePage} t={t}>
            {pageComponents[activePage] || (
              <PlaceholderPage title={activePage} t={t} />
            )}
          </PageErrorBoundary>
        </div>
      </div>
    </div>
  );
}
