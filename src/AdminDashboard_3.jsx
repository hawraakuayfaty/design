import { useState } from "react";
import qeyadahLogo from "./assets/qeyadah-logo.jpg";
import AdminPro from "./AdminPro";
import AccountantPro from "./AccountantPro";
import ReceptionistPro from "./ReceptionistPro";
import { CiSettings } from "react-icons/ci";
import { PiChartLineDown, PiChartLineUp, PiUsersThin } from "react-icons/pi";
import { TbReport } from "react-icons/tb";
import { FaRegAddressCard } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import { TbBus } from "react-icons/tb";
import { FaCar } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";
import { GrSchedules } from "react-icons/gr";
import { FaChartLine } from "react-icons/fa6";
import { FaChartColumn } from "react-icons/fa6";
import { FaBellConcierge } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";

import { LuX } from "react-icons/lu";

import { MdAdminPanelSettings } from "react-icons/md";
import { PiMedalFill } from "react-icons/pi";
import { PiCertificateDuotone } from "react-icons/pi";
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
    bgPage: "#f8f9f5",
    bgSurface: "#ffffff",
    bgElevated: "#f2f5eb",
    bgSidebar: "linear-gradient(180deg, #778a3b 0%, #6c7d35 52%, #5f702d 100%)",
    bgSidebarActive: "#5f702d",
    bgHeader: "#ffffff",
    text: "#1c1f18",
    textSec: "#4f5548",
    textMuted: "#747a70",
    textSidebar: "#f8f9f5",
    textSidebarActive: "#FFFFFF",
    border: "#dde1d7",
    borderCard: "rgba(119,138,59,0.14)",
    accent: "#778a3b",
    accentLight: "#eef2e4",
    accentText: "#5f702d",
    accentGradient: "linear-gradient(135deg,#778a3b 0%,#5f702d 100%)",
    accentGradientSoft:
      "linear-gradient(135deg, rgba(119,138,59,0.12) 0%, rgba(238,242,228,0.90) 100%)",

    confirmed: { bg: "rgba(119,138,59,0.12)", text: "#5f702d" },
    pending: { bg: "rgba(201,138,40,0.14)", text: "#c98a28" },
    cancelled: { bg: "rgba(199,72,72,0.12)", text: "#c74848" },
    submitted: { bg: "rgba(119,138,59,0.10)", text: "#778a3b" },
    completed: { bg: "rgba(63,107,58,0.14)", text: "#3f6b3a" },
    expired: { bg: "rgba(183,189,178,0.16)", text: "#747a70" },
    noshow: { bg: "rgba(199,72,72,0.12)", text: "#c74848" },
    inprogress: { bg: "rgba(119,138,59,0.12)", text: "#778a3b" },
  },
  dark: {
    bgPage: "#20241d",
    bgSurface: "#2b3127",
    bgElevated: "#353d31",
    bgSidebar: "linear-gradient(180deg, #5f702d 0%, #4f5d28 52%, #3f4b22 100%)",
    bgSidebarActive: "#778a3b",
    bgHeader: "#2b3127",
    text: "#f4f5ef",
    textSec: "#dde1d7",
    textMuted: "#b7bdb2",
    textSidebar: "#f8f9f5",
    textSidebarActive: "#FFFFFF",
    border: "rgba(255,255,255,0.08)",
    borderCard: "rgba(221,225,215,0.12)",
    accent: "#778a3b",
    accentLight: "rgba(119, 138, 59, 0.18)",
    accentText: "#eef2e4",
    accentGradient: "linear-gradient(135deg,#778a3b 0%,#5f702d 100%)",
    accentGradientSoft:
      "linear-gradient(135deg, rgba(119,138,59,0.20) 0%, rgba(95,112,45,0.12) 100%)",

    confirmed: { bg: "rgba(119,138,59,0.20)", text: "#eef2e4" },
    pending: { bg: "rgba(201,138,40,0.20)", text: "#f0cb8c" },
    cancelled: { bg: "rgba(199,72,72,0.20)", text: "#f2b1b1" },
    submitted: { bg: "rgba(119,138,59,0.18)", text: "#eef2e4" },
    completed: { bg: "rgba(63,107,58,0.24)", text: "#b8d4b5" },
    expired: { bg: "rgba(183,189,178,0.14)", text: "#d0d5cb" },
    noshow: { bg: "rgba(199,72,72,0.18)", text: "#f0b0b0" },
    inprogress: { bg: "rgba(119,138,59,0.18)", text: "#eef2e4" },
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
  {
    id: "certificate",
    label: "الشهادة الحكومية",
    icon: <FaRegAddressCard />,
    page: "Certificate",
  },
  { id: "transport", label: "خدمة النقل", icon: <TbBus />, page: "Transport" },
  {
    id: "payments",
    label: "الدفعات والعربون",
    icon: <CiCreditCard1 />,
    page: "Payments",
  },

  { id: "reports", label: "التقارير", icon: <TbReport />, page: "Reports" },
  {
    id: "users",
    label: "المستخدمون",
    icon: <PiUsersThin />,
    page: "Users",
    adminOnly: true,
  },
  {
    id: "settings",
    label: "إعدادات النظام",
    icon: <CiSettings />,
    page: "Settings",
    adminOnly: true,
  },

  // ➕ ضيفي الموديولات الثلاثة الجديدة هنا أسفل القائمة:
];


// ═══════════════════════════════════════════════
// BADGE COMPONENT
// ═══════════════════════════════════════════════
function Badge({ status, t }) {
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
  const color = map[status] || t.expired;
  return (
    <span style={{
      background: color.bg, color: color.text,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
      display: "inline-block",
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
      <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: t.textMuted }}>{label}</div>
    </div>
  );
}

function darkShadow(t) {
  return t.bgPage === "#020817"
    ? "0 18px 40px rgba(2, 8, 23, 0.34)"
    : "0 18px 38px rgba(15, 23, 42, 0.08)";
}

// ═══════════════════════════════════════════════
// TABLE WRAPPER
// ═══════════════════════════════════════════════
function Table({ headers, rows, t }) {
  return (
    <div style={{ borderRadius: 10, border: `0.5px solid ${t.border}`, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: t.bgElevated }}>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: "10px 14px", textAlign: "right",
                color: t.textMuted, fontWeight: 600,
                fontSize: 12, borderBottom: `0.5px solid ${t.border}`,
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
                <td key={ci} style={{ padding: "10px 14px", color: t.text, fontSize: 14 }}>
                  {typeof cell === "string" && [
                    "مؤكد","بانتظار العربون","ملغي","تم الإثبات","مكتمل",
                    "منتهي","لم يحضر","جاري","نشط","غير نشط","في إجازة",
                    "متاحة","في الصيانة","غير متاحة","مقبول","راسب",
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: t.text, letterSpacing: "-0.02em" }}>{title}</h2>
        {subtitle && <p style={{ margin: "6px 0 0", fontSize: 14, color: t.textSec }}>{subtitle}</p>}
      </div>
      {action && (
        <button onClick={onAction} style={{
          background: t.accentGradient, color: "#fff",
          border: "none", borderRadius: 12,
          padding: "10px 18px", fontSize: 14, fontWeight: 700,
          cursor: "pointer",
          boxShadow: darkShadow(t),
        }}>{action}</button>
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
function PageDashboard({ t }) {
  return (
    <div className="dashboard-stack">
      <SectionHeader
        title="لوحة التحكم"
        subtitle="الخميس، 4 يونيو 2026"
        t={t}
      />
      <AlertBox
        t={t}
        items={[
          "3 إثباتات دفع بانتظار التحقق",
          "مركبة رقم (أ ب ج 123) في الصيانة",
          "مدرب خالد عمر في إجازة اليوم",
          "حجزان مؤقتان على وشك الانتهاء",
        ]}
      />

      <div className="dashboard-hero">
        <div
          className="dashboard-hero-card"
          style={{
            background: t.accentGradient,
            borderRadius: 24,
            padding: 24,
            color: "#fff",
            boxShadow: darkShadow(t),
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.78, marginBottom: 12 }}>ملخص تشغيل اليوم</div>
          <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>
            نظرة تنفيذية سريعة على الأداء والحجوزات والتحصيل
          </div>
          <div style={{ fontSize: 14, opacity: 0.88, maxWidth: 560, marginBottom: 20 }}>
            الواجهة الآن تبرز الأولويات مباشرة: ضغط الحجوزات، الطلبات المعلقة، والمركبات أو المدربين الذين يحتاجون متابعة فورية.
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              "نسبة الإشغال 78%",
              "3 مدفوعات تنتظر تحقق",
              "مركبة واحدة في الصيانة",
            ].map((item) => (
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
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 8 }}>التحصيل</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: t.text, marginBottom: 6 }}>٤٥٠٠ ل.س</div>
            <div style={{ fontSize: 13, color: t.textSec }}>ارتفاع طفيف عن أمس مع 3 إثباتات بانتظار المطابقة.</div>
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
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 8 }}>جاهزية التشغيل</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: t.text }}>6</div>
                <div style={{ fontSize: 12, color: t.textSec }}>دروس مكتملة</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: t.text }}>1</div>
                <div style={{ fontSize: 12, color: t.textSec }}>حالة غياب</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard
          label="حجوزات اليوم"
          value="14"
          color={t.accent}
          icon={<RiCalendarScheduleLine size={24} />}
          t={t}
        />
        <StatCard
          label="مؤكدة"
          value="9"
          color="#0f766e"
          icon={<FaRegCalendarCheck size={24} />}
          t={t}
        />
        <StatCard
          label="بانتظار الدفع"
          value="3"
          color="#c2410c"
          icon={<BsHourglassSplit size={24} />}
          t={t}
        />
        <StatCard
          label="إثباتات معلقة"
          value="3"
          color={t.accent}
          icon={<BsPaperclip size={24} />}
          t={t}
        />
        <StatCard
          label="دروس مكتملة"
          value="6"
          color="#15803d"
          icon={<PiMedalFill size={24} />}
          t={t}
        />
        <StatCard
          label="لم يحضر"
          value="1"
          color="#be185d"
          icon={<MdOutlineCancel size={24} />}
          t={t}
        />
        <StatCard
          label="ملغية"
          value="1"
          color="#b91c1c"
          icon={<TbCalendarCancel size={24} />}
          t={t}
        />
        <StatCard
          label="إيرادات اليوم"
          value="٤٥٠٠ ل.س"
          color={t.accent}
          icon={<TbReportMoney size={24} />}
          t={t}
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
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: t.text }}>الدروس القادمة اليوم</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>ترتيب زمني مع إشارة سريعة إلى الدفع والحالة</div>
            </div>
            <div style={{ padding: "7px 12px", borderRadius: 999, background: t.accentLight, color: t.accentText, fontSize: 12, fontWeight: 700 }}>
              5 حصص مجدولة
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
              "الدفع المتبقي",
            ]}
            rows={[
              [
                "أحمد محمد الحسن",
                "خالد عمر",
                "09:00 — 10:30",
                "عادي",
                "أ ب ج 101",
                "مؤكد",
                "نعم",
              ],
              [
                "سارة خالد",
                "ليلى سعد",
                "10:30 — 12:00",
                "أوتوماتيك",
                "أ ب ج 202",
                "مؤكد",
                "نعم",
              ],
              [
                "علي حسن",
                "خالد عمر",
                "12:00 — 13:30",
                "عادي",
                "سيارة الطالب",
                "بانتظار العربون",
                "—",
              ],
              [
                "منى العلي",
                "ليلى سعد",
                "14:00 — 15:30",
                "أوتوماتيك",
                "أ ب ج 202",
                "تم الإثبات",
                "نعم",
              ],
              [
                "محمود سالم",
                "أحمد الزيد",
                "15:30 — 17:00",
                "عادي",
                "أ ب ج 101",
                "مؤكد",
                "نعم",
              ],
            ]}
          />
        </div>

        <div className="dashboard-side-stack">
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
            إثباتات دفع بانتظار التحقق
          </div>
          <Table
            t={t}
            headers={["الطالب", "المبلغ", "الطريقة", "الحالة"]}
            rows={[
              ["أحمد الناصر", "١٥٠٠ ل.س", "شام كاش", "تم الإثبات"],
              ["نورا سالم", "١٥٠٠ ل.س", "شام كاش", "تم الإثبات"],
              ["كريم عبدو", "١٥٠٠ ل.س", "شام كاش", "تم الإثبات"],
            ]}
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
            المركبات والمدربون
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 8 }}>
            المركبات
          </div>
          <Table
            t={t}
            headers={["المركبة", "النوع", "الحالة"]}
            rows={[
              ["أ ب ج 101", "عادي", "متاحة"],
              ["أ ب ج 102", "عادي", "في الصيانة"],
              ["أ ب ج 201", "أوتوماتيك", "متاحة"],
              ["أ ب ج 202", "أوتوماتيك", "متاحة"],
            ]}
          />
        </div>
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
function PageStudents({ t, userRole }) {
  return (
    <div>
      <SectionHeader title={userRole === "accountant" ? "الطلاب" : "إدارة الطلاب"} subtitle="١٢٤ طالب مسجل" action={userRole === "accountant" ? null : "+ إضافة طالب"} t={t} />
      <div style={{
        background: t.bgSurface, borderRadius: 10, border: `0.5px solid ${t.borderCard}`,
        padding: "12px 16px", marginBottom: 16,
        display: "flex", gap: 10, alignItems: "center",
      }}>
        <input placeholder="بحث بالاسم أو رقم الهاتف..." style={{
          flex: 1, padding: "8px 12px", borderRadius: 7,
          border: `0.5px solid ${t.border}`, background: t.bgElevated,
          color: t.text, fontSize: 13,
        }} />
        <select style={{ padding: "8px 12px", borderRadius: 7, border: `0.5px solid ${t.border}`, background: t.bgElevated, color: t.text, fontSize: 12 }}>
          <option>كل الحالات</option>
          <option>جديد</option><option>نشط</option><option>قيد التدريب</option>
          <option>أنهى التدريب</option><option>طلب شهادة</option><option>مؤرشف</option>
        </select>
      </div>
      <Table t={t}
        headers={["الاسم الكامل", "رقم الهاتف", "الحالة", "رقم الهوية", "الحجوزات", "آخر درس", "الشهادة"]}
        rows={[
          ["أحمد محمد الحسن", "0991234567", "نشط", "١٢٣٤٥٦٧", "٥", "٣ يونيو", "لا"],
          ["سارة خالد يوسف", "0997654321", "نشط", "٧٦٥٤٣٢١", "٣", "٢ يونيو", "لا"],
          ["علي حسن محمود", "0994444444", "قيد التدريب", "٤٤٤٤٤٤٤", "٨", "٤ يونيو", "لا"],
          ["منى العلي سالم", "0993333333", "قيد التدريب", "٣٣٣٣٣٣٣", "٦", "٤ يونيو", "لا"],
          ["محمود سالم الزين", "0992222222", "نشط", "٢٢٢٢٢٢٢", "٢", "١ يونيو", "لا"],
          ["نورا الأحمد", "0995555555", "أنهى التدريب", "٥٥٥٥٥٥٥", "١٢", "٢٨ مايو", "قيد المتابعة"],
          ["كريم عبدو نصر", "0996666666", "طلب شهادة", "٦٦٦٦٦٦٦", "١٠", "٢٠ مايو", "قيد المتابعة"],
          ["هناء الصالح خير", "0997777777", "نشط", "٧٧٧٧٧٧٧", "٤", "٣٠ مايو", "لا"],
        ]}
      />

      {/* Student states explanation */}
      <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["جديد","نشط","قيد التدريب","أنهى التدريب","طلب شهادة","مؤرشف"].map(s => (
          <div key={s} style={{
            padding: "4px 12px", borderRadius: 20,
            background: t.bgSurface, color: t.textSec,
            fontSize: 12, border: `0.5px solid ${t.border}`,
          }}>{s}</div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: INSTRUCTORS
// ═══════════════════════════════════════════════
function PageInstructors({ t, userRole }) {
  return (
    <div>
      <SectionHeader title={userRole === "accountant" ? "المدربين" : "إدارة المدربين"} subtitle="٦ مدربين مسجلين" action={userRole === "accountant" ? null : "+ إضافة مدرب"} t={t} />
      <Table t={t}
        headers={["الاسم", "النوع", "الجنس", "القدرات", "أجر الجلسة", "الحالة", "دروس اليوم", "مستحقات اليوم"]}
        rows={[
          ["خالد عمر الزيد", "داخلي", "ذكر", "عادي + أوتوماتيك", "٥٠٠ ل.س", "نشط", "٣", "١٥٠٠ ل.س"],
          ["ليلى سعد حمود", "داخلي", "أنثى", "أوتوماتيك", "٥٠٠ ل.س", "نشط", "٣", "١٥٠٠ ل.س"],
          ["أحمد الزيد محمد", "خارجي", "ذكر", "عادي", "٤٥٠ ل.س", "نشط", "٢", "٩٠٠ ل.س"],
          ["سمر يوسف", "داخلي", "أنثى", "عادي + أوتوماتيك", "٥٠٠ ل.س", "في إجازة", "٠", "٠"],
          ["ماهر العلي", "خارجي", "ذكر", "عادي", "٤٥٠ ل.س", "نشط", "١", "٤٥٠ ل.س"],
          ["ريم الحسن", "داخلي", "أنثى", "أوتوماتيك", "٥٠٠ ل.س", "غير نشط", "٠", "٠"],
        ]}
      />

      {/* Instructor availability section */}
      <div style={{ marginTop: 20, background: t.bgSurface, borderRadius: 12, border: `0.5px solid ${t.borderCard}`, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 12 }}>إدارة أوقات التوفر الأسبوعية</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"].map((day, i) => (
            <div key={day} style={{
              padding: "8px 4px", borderRadius: 8, textAlign: "center",
              background: i < 5 ? t.accentLight : t.bgElevated,
              border: `0.5px solid ${i < 5 ? t.accentText + "40" : t.border}`,
              fontSize: 11, color: i < 5 ? t.accentText : t.textMuted,
              fontWeight: i < 5 ? 600 : 400,
            }}>
              <div>{day}</div>
              {i < 5 && <div style={{ fontSize: 10, marginTop: 4 }}>08:00—17:00</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: VEHICLES
// ═══════════════════════════════════════════════
function PageVehicles({ t }) {
  return (
    <div>
      <SectionHeader title="إدارة المركبات" subtitle="٤ مركبات — مدرسة القيادة" action="+ إضافة مركبة" t={t} />
      <Table t={t}
        headers={["رقم اللوحة", "الموديل", "النوع", "اللون", "الحالة", "حجوزات اليوم", "ملاحظات"]}
        rows={[
          ["أ ب ج 101", "تويوتا كورولا 2020", "عادي", "أبيض", "متاحة", "٣", "—"],
          ["أ ب ج 102", "تويوتا كورولا 2019", "عادي", "رمادي", "في الصيانة", "٠", "تغيير زيت"],
          ["أ ب ج 201", "هيونداي إلنترا 2021", "أوتوماتيك", "أسود", "متاحة", "٢", "—"],
          ["أ ب ج 202", "هيونداي إلنترا 2022", "أوتوماتيك", "أبيض", "متاحة", "٣", "—"],
        ]}
      />
      <div style={{ marginTop: 16, padding: "12px 16px", background: t.pending.bg, borderRadius: 10, border: `0.5px solid ${t.pending.text}30` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.pending.text }}>
          تنبيه: مركبة أ ب ج 102 في الصيانة — لن تظهر في أوقات الحجز المتاحة
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: CERTIFICATE (Government)
// ═══════════════════════════════════════════════
function PageCertificate({ t }) {
  return (
    <div>
      <SectionHeader
        title="خدمة الشهادة الحكومية"
        subtitle="متابعة طلبات رخصة القيادة"
        action="+ طلب جديد"
        t={t}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatCard
          label="طلبات نشطة"
          value="٨"
          color={t.accent}
          icon={<TbReport size={38} color="#10B981" />}
          t={t}
        />
        <StatCard
          label="قيد المتابعة"
          value="٥"
          color="#BA7517"
          icon={<BsHourglassSplit size={38} color="#10B981" />}
          t={t}
        />
        <StatCard
          label="فحص قادم"
          value="٢"
          color={t.accent}
          icon={<RiCalendarScheduleLine size={38} color="#10B981" />}
          t={t}
        />
        <StatCard
          label="ناجح هذا الشهر"
          value="١١"
          color="#1D9E75"
          icon={<PiCertificateDuotone size={38} color="#10B981" />}
          t={t}
        />
      </div>

      <Table
        t={t}
        headers={[
          "الطالب",
          "تاريخ الطلب",
          "الوثائق",
          "الفحص النظري",
          "الفحص العملي",
          "النتيجة",
          "النقل",
          "الحالة",
        ]}
        rows={[
          [
            "نورا الأحمد",
            "١ مايو",
            "مكتملة",
            "١٥ يونيو",
            "—",
            "—",
            "مسجل",
            "قيد المتابعة",
          ],
          [
            "كريم عبدو",
            "٥ مايو",
            "مكتملة",
            "١٥ يونيو",
            "—",
            "—",
            "مسجل",
            "قيد المتابعة",
          ],
          [
            "هناء الصالح",
            "١٠ مايو",
            "ناقصة",
            "—",
            "—",
            "—",
            "لا",
            "قيد المتابعة",
          ],
          [
            "سعيد المحمد",
            "١٢ مايو",
            "مكتملة",
            "٢٠ يونيو",
            "٢٥ يونيو",
            "—",
            "مسجل",
            "قيد المتابعة",
          ],
          [
            "لمى الزعبي",
            "٢٠ مايو",
            "مكتملة",
            "٢٠ يونيو",
            "—",
            "—",
            "لا",
            "قيد المتابعة",
          ],
          [
            "باسل الخطيب",
            "٢٥ مايو",
            "مكتملة",
            "١ يونيو",
            "٤ يونيو",
            "مقبول",
            "مسجل",
            "مقبول",
          ],
          [
            "رنا سليمان",
            "٢ أبريل",
            "مكتملة",
            "١٠ مايو",
            "١٥ مايو",
            "راسب",
            "مسجل",
            "قيد المتابعة",
          ],
        ]}
      />

      {/* Ministry Excel Upload */}
      <div
        style={{
          marginTop: 20,
          background: t.bgSurface,
          borderRadius: 12,
          border: `0.5px solid ${t.borderCard}`,
          padding: 20,
        }}
      >
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: t.text,
            marginBottom: 6,
          }}
        >
          رفع ملف الوزارة — Excel
        </div>
        <div style={{ fontSize: 12, color: t.textSec, marginBottom: 16 }}>
          ارفع الملف القادم من الوزارة لمطابقة الطلاب ومواعيد امتحاناتهم
          تلقائياً
        </div>
        <div
          style={{
            border: `2px dashed ${t.border}`,
            borderRadius: 10,
            padding: "30px 20px",
            textAlign: "center",
            background: t.bgElevated,
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
          <div style={{ fontSize: 13, color: t.textSec, marginBottom: 12 }}>
            اسحب ملف Excel هنا أو اضغط للاختيار
          </div>
          <button
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              background: t.accent,
              color: "#fff",
              border: "none",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            اختيار ملف
          </button>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: t.textMuted }}>
          بعد الرفع: يطابق النظام برقم الهوية أولاً، ثم يعرض قائمة "تحتاج مراجعة
          يدوية" للأسماء المتشابهة.
        </div>
      </div>
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
// PAGE: PAYMENTS
// ═══════════════════════════════════════════════import { TbReportMoney } from "react-icons/tb";

function PagePayments({ t }) {
  return (
    <div>
      <SectionHeader
        title="الدفعات والعربون"
        subtitle="متابعة جميع الدفعات وإثباتات الدفع"
        t={t}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatCard
          label="إيرادات اليوم"
          value="٤٥٠٠ ل.س"
          color={t.accent}
          icon={<TbReportMoney size={38} color="#10B981" />}
          t={t}
        />
        <StatCard
          label="عربونات مؤكدة"
          value="٩"
          color="#1D9E75"
          icon={<FaRegCheckCircle size={38} color="#10B981" />}
          t={t}
        />
        <StatCard
          label="بانتظار التحقق"
          value="٣"
          color="#BA7517"
          icon={<BsHourglassSplit size={38} color="#10B981" />}
          t={t}
        />

        <StatCard
          label="عربونات منتهية"
          value="١"
          color="#E24B4A"
          icon={<LuX size={38} color="#10B981" />}
          t={t}
        />
      </div>
      <Table
        t={t}
        headers={[
          "#",
          "الطالب",
          "الحجز",
          "نوع الدفع",
          "المبلغ",
          "الطريقة",
          "الحالة",
          "الموظف",
          "التاريخ",
        ]}
        rows={[
          [
            "#٥٠١",
            "أحمد محمد",
            "#١٢٤٥",
            "عربون",
            "١٥٠٠ ل.س",
            "نقدي",
            "مدفوع",
            "أم كمال",
            "٤ يونيو",
          ],
          [
            "#٥٠٢",
            "سارة خالد",
            "#١٢٤٦",
            "عربون",
            "١٥٠٠ ل.س",
            "شام كاش",
            "تم الإثبات",
            "—",
            "٤ يونيو",
          ],
          [
            "#٥٠٣",
            "علي حسن",
            "#١٢٤٧",
            "عربون",
            "١٥٠٠ ل.س",
            "شام كاش",
            "تم الإثبات",
            "—",
            "٤ يونيو",
          ],
          [
            "#٥٠٤",
            "منى العلي",
            "#١٢٤٨",
            "عربون",
            "١٥٠٠ ل.س",
            "نقدي",
            "مدفوع",
            "أم كمال",
            "٤ يونيو",
          ],
          [
            "#٥٠٥",
            "منى العلي",
            "#١٢٤٨",
            "باقي الدرس",
            "١٥٠٠ ل.س",
            "نقدي",
            "مدفوع",
            "أم كمال",
            "٤ يونيو",
          ],
          [
            "#٥٠٦",
            "نورا الأحمد",
            "#—",
            "شهادة حكومية",
            "٥٠٠٠ ل.س",
            "نقدي",
            "مدفوع",
            "أم كمال",
            "١ مايو",
          ],
          [
            "#٥٠٧",
            "نورا الأحمد",
            "#—",
            "رسوم نقل",
            "٢٠٠٠ ل.س",
            "نقدي",
            "مدفوع",
            "أم كمال",
            "١٠ يونيو",
          ],
        ]}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: ACCOUNTING
// ═══════════════════════════════════════════════
function PageAccounting({ t }) {
  return (
    <div>
      <SectionHeader
        title="المحاسبة التشغيلية"
        subtitle="إيرادات ومصاريف ومستحقات المدربين"
        t={t}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <StatCard
          label="إيرادات الشهر"
          value="١٢٠,٠٠٠ ل.س"
          color={t.accent}
          icon={<PiChartLineUp />}
          t={t}
        />
        <StatCard
          label="مصاريف الشهر"
          value="٣٥,٠٠٠ ل.س"
          color="#E24B4A"
          icon={<PiChartLineDown />}
          t={t}
        />
        <StatCard
          label="صافي الشهر"
          value="٨٥,٠٠٠ ل.س"
          color="#1D9E75"
          icon={<FaChartLine />}
          t={t}
        />
        <StatCard
          label="مستحقات مدربين"
          value="١٨,٠٠٠ ل.س"
          color="#BA7517"
          icon={<FaUserTie />}
          t={t}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Revenues */}
        <div
          style={{
            background: t.bgSurface,
            borderRadius: 12,
            border: `0.5px solid ${t.borderCard}`,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: t.text,
              marginBottom: 12,
            }}
          >
            الإيرادات حسب النوع
          </div>
          <Table
            t={t}
            headers={["النوع", "هذا الشهر", "اليوم"]}
            rows={[
              ["عربونات دروس", "٤٥,٠٠٠ ل.س", "٤,٥٠٠ ل.س"],
              ["باقي مبالغ دروس", "٤٨,٠٠٠ ل.س", "٣,٠٠٠ ل.س"],
              ["رسوم شهادة حكومية", "١٥,٠٠٠ ل.س", "—"],
              ["رسوم نقل", "٨,٠٠٠ ل.س", "—"],
              ["رسوم إعادة فحص", "٤,٠٠٠ ل.س", "—"],
            ]}
          />
        </div>
        {/* Expenses */}
        <div
          style={{
            background: t.bgSurface,
            borderRadius: 12,
            border: `0.5px solid ${t.borderCard}`,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: t.text,
              marginBottom: 12,
            }}
          >
            المصاريف حسب النوع
          </div>
          <Table
            t={t}
            headers={["النوع", "هذا الشهر", "اليوم"]}
            rows={[
              ["مستحقات مدربين", "١٨,٠٠٠ ل.س", "٤,٣٥٠ ل.س"],
              ["وقود مركبات", "٦,٠٠٠ ل.س", "—"],
              ["صيانة مركبات", "٤,٠٠٠ ل.س", "—"],
              ["إيجار وكهرباء", "٥,٠٠٠ ل.س", "—"],
              ["رواتب موظفين", "٢,٠٠٠ ل.س", "—"],
            ]}
          />
        </div>
      </div>

      {/* Instructor dues */}
      <div
        style={{
          marginTop: 16,
          background: t.bgSurface,
          borderRadius: 12,
          border: `0.5px solid ${t.borderCard}`,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: t.text,
            marginBottom: 12,
          }}
        >
          مستحقات المدربين اليومية
        </div>
        <Table
          t={t}
          headers={[
            "المدرب",
            "جلسات مكتملة",
            "أجر الجلسة",
            "المستحق اليوم",
            "الحالة",
          ]}
          rows={[
            ["خالد عمر", "٣", "٥٠٠ ل.س", "١,٥٠٠ ل.س", "معلق"],
            ["ليلى سعد", "٣", "٥٠٠ ل.س", "١,٥٠٠ ل.س", "معلق"],
            ["أحمد الزيد", "٢", "٤٥٠ ل.س", "٩٠٠ ل.س", "معلق"],
            ["ماهر العلي", "١", "٤٥٠ ل.س", "٤٥٠ ل.س", "معلق"],
          ]}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PAGE: REPORTS
// ═══════════════════════════════════════════════
function PageReports({ t }) {
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
            title: "تقرير الحجوزات",
            desc: "إجمالي، مؤكد، مكتمل، ملغي، لم يحضر",
            icon: <RiCalendarScheduleLine size={38} color="#10B981" />,
          },
          {
            title: "تقرير الطلاب",
            desc: "جدد، نشطون، قيد التدريب، أنهوا، طلبوا شهادة",
            icon: <PiStudent size={38} color="#10B981" />,
          },
          {
            title: "تقرير المدربين",
            desc: "جلسات مكتملة، ملغية، مستحقات",
            icon: <FaUserTie size={38} color="#10B981" />,
          },
          {
            title: "تقرير المركبات",
            desc: "استخدام كل مركبة، صيانة، توقف",
            icon: <FaCar size={38} color="#10B981" />,
          },
          {
            title: "تقرير الشهادة الحكومية",
            desc: "طلبات، فحوص، نجاح، رسوب، إعادة",
            icon: <FaRegAddressCard size={38} color="#10B981" />,
          },
          { title: "تقرير خدمة النقل", desc: "رحلات، حضور، دفعات", icon:<TbBus size={38} color="#10B981" /> },
          {
            title: "التقرير المالي المختصر",
            desc: "إيرادات، مصاريف، صافي، مستحقات",
            icon: <TbReportMoney size={38} color="#10B981" />,
          },
        ].map((r) => (
          <div
            key={r.title}
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
            <div style={{ fontSize: 12, color: t.textSec, marginBottom: 14 }}>
              {r.desc}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["يومي", "أسبوعي", "شهري"].map((p) => (
                <button
                  key={p}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    background: t.accentLight,
                    color: t.accentText,
                    border: "none",
                    fontSize: 11,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {p}
                </button>
              ))}
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
  return (
    <div>
      <SectionHeader title="إدارة المستخدمين والصلاحيات" subtitle="للمدير فقط" action="+ إضافة مستخدم" t={t} />
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
// PAGE: SETTINGS
// ═══════════════════════════════════════════════
function PageSettings({ t }) {
  return (
    <div>
      <SectionHeader title="إعدادات النظام" subtitle="للمدير فقط — التعديلات تطبق على العمليات الجديدة فقط" t={t} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { title: "أسعار الدروس", fields: [
            { label: "سعر درس السيارة العادية", value: "٣٠٠٠ ل.س" },
            { label: "سعر درس السيارة الأوتوماتيك", value: "٣٥٠٠ ل.س" },
            { label: "سعر درس سيارة الطالب الخاصة", value: "٢٥٠٠ ل.س" },
          ]},
          { title: "العربون والحجز", fields: [
            { label: "نسبة العربون من سعر الدرس", value: "٥٠٪" },
            { label: "مدة الحجز المؤقت (دقيقة)", value: "١٥ دقيقة" },
            { label: "الحد الأدنى للحجز قبل الدرس", value: "ساعتان" },
          ]},
          { title: "الجدولة", fields: [
            { label: "مدة الدرس", value: "٩٠ دقيقة" },
            { label: "نافذة عرض الأوقات المتاحة", value: "اليوم + ٤ أيام" },
            { label: "وقت إرسال جدول الغد للمدربين", value: "٩:٠٠ مساءً" },
          ]},
          { title: "رسوم الشهادة الحكومية", fields: [
            { label: "رسوم خدمة الشهادة الحكومية", value: "٥٠٠٠ ل.س" },
            { label: "رسوم النقل للمحاضرات ٣ أيام", value: "٢٠٠٠ ل.س" },
            { label: "رسوم النقل ليوم الامتحان", value: "٨٠٠ ل.س" },
            { label: "رسوم إعادة الفحص النظري", value: "١٥٠٠ ل.س" },
            { label: "رسوم إعادة الفحص العملي", value: "٢٠٠٠ ل.س" },
          ]},
        ].map(group => (
          <div key={group.title} style={{ background: t.bgSurface, borderRadius: 12, border: `0.5px solid ${t.borderCard}`, padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 12 }}>{group.title}</div>
            {group.fields.map(field => (
              <div key={field.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `0.5px solid ${t.border}` }}>
                <div style={{ fontSize: 12, color: t.textSec }}>{field.label}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{field.value}</span>
                  <button style={{ padding: "3px 10px", borderRadius: 6, background: t.accentLight, color: t.accentText, border: "none", fontSize: 11, cursor: "pointer" }}>تعديل</button>
                </div>
              </div>
            ))}
          </div>
        ))}
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

// ═══════════════════════════════════════════════
// MAIN APP SHELL
// ═══════════════════════════════════════════════
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminSubPage, setAdminSubPage] = useState("dash");
  const [accountantSubPage, setAccountantSubPage] = useState("dash");
  const [receptionistSubPage, setReceptionistSubPage] = useState("students");
  const [userRole, setUserRole] = useState("manager"); // "manager" | "admin" (موظف إداري) | "accountant"

  const t = tokens[darkMode ? "dark" : "light"];
  const sidebarWidth = sidebarCollapsed ? 84 : 324;

  const pageComponents = {
    Dashboard: <PageDashboard t={t} />,
    Bookings: <PageBookings t={t} />,
    Students: <PageStudents t={t} userRole={userRole} />,
    Instructors: <PageInstructors t={t} userRole={userRole} />,
    Vehicles: <PageVehicles t={t} />,
    Certificate: <PageCertificate t={t} />,
    Transport: <PageTransport t={t} />,
    Payments: <PagePayments t={t} />,
    Accounting: <PageAccounting t={t} />,
    Reports: <PageReports t={t} />,
    Users: <PageUsers t={t} />,
    Settings: <PageSettings t={t} />,
    AdminProPage: <AdminPro embedded={true} page={adminSubPage} darkMode={darkMode} />,
    AccountantProPage: <AccountantPro embedded={true} page={accountantSubPage} darkMode={darkMode} />,
    ReceptionistPage: <ReceptionistPro embedded={true} page={receptionistSubPage} darkMode={darkMode} />,
  };

  return (
    <div dir="rtl" className="app-shell" style={{
      display: "flex", minHeight: "100svh", overflow: "hidden", width: "100%",
      background: t.bgPage, fontFamily: "var(--font-body)",
      direction: "rtl",
    }}>

      {/* ─── SIDEBAR ─── */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} />
      <div style={{
        width: sidebarWidth,
        height: "100svh",
        minHeight: "100svh",
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 40,
        background: t.bgSidebar,
        display: "flex", flexDirection: "column",
        transition: "width 0.2s ease",
        overflow: "hidden",
        borderLeft: `1px solid ${t.borderCard}`,
      }}>
        {/* Logo */}
        <div style={{
          padding: "24px 18px 18px",
          borderBottom: `1px solid ${t.borderCard}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            overflow: "hidden", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img src={qeyadahLogo} alt="qeyadah" style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}} />
          </div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff7d4", lineHeight: 1.2 }}>مدرسة القيادة</div>
              <div style={{ fontSize: 12, color: t.textSidebar, marginTop: 3 }}>نظام الإدارة</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "12px 10px" }}>
          {navItems
            .filter(item => {
              // adminOnly pages only visible to manager (المدير)
              if (item.adminOnly && userRole !== "manager") return false;
              // hide specific items per role
              const hiddenByRole = {
                admin: ["AdminPro", "accounting", "AccountantPro"],
                accountant: ["AdminPro", "Receptionist", "bookings", "vehicles"],
                manager: [],
              };
              const hidden = hiddenByRole[userRole] || [];
              if (hidden.includes(item.id)) return false;
              return true;
            })
            .map(item => {
              const isActive = activePage === item.page;
              const displayLabel = (userRole === "accountant" && item.id === "students") ? "عرض الطلاب"
                : (userRole === "accountant" && item.id === "instructors") ? "عرض المدربين"
                : item.label;
              return (
                <button key={item.id} onClick={() => setActivePage(item.page)} style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: 12, padding: sidebarCollapsed ? "14px 10px" : "14px 16px",
                  borderRadius: 14, border: "none", cursor: "pointer",
                  background: isActive ? t.bgSidebarActive : "transparent",
                  color: isActive ? t.textSidebarActive : t.textSidebar,
                  fontSize: 16, fontWeight: isActive ? 700 : 500,
                  marginBottom: 6, textAlign: "right",
                  justifyContent: sidebarCollapsed ? "center" : "flex-start",
                  transition: "all 0.15s",
                  boxShadow: isActive ? "0 10px 24px rgba(0,0,0,0.18)" : "none",
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                  {!sidebarCollapsed && <span>{displayLabel}</span>}
                </button>
              );
            })}
        </div>

        {/* Sidebar Footer */}
        <div style={{
          padding: "14px 10px",
          borderTop: `1px solid ${t.borderCard}`,
        }}>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
            width: "100%", padding: "12px", borderRadius: 12,
            background: t.accentLight, border: "none",
            color: t.accentText, cursor: "pointer", fontSize: 18, fontWeight: 700,
          }}>{sidebarCollapsed ? "→" : "←"}</button>
        </div>
      </div>

      {/* ─── MAIN AREA ─── */}
      <div className="app-main" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* TOPBAR */}
        <div style={{
          height: 56, background: t.bgHeader,
          borderBottom: `0.5px solid ${t.border}`,
          display: "flex", alignItems: "center",
          padding: "0 20px", gap: 14, flexShrink: 0,
        }}>
          {/* Embedded navigation for admin/accountant/receptionist */}
          {activePage === "AdminProPage" ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[{id:'dash',label:'لوحة التحكم'},{id:'employees',label:'الموظفون'},{id:'permissions',label:'الصلاحيات'},{id:'pricing',label:'الأسعار والرسوم'}].map(a=>{
                const isActive = adminSubPage===a.id;
                return (
                  <button key={a.id} onClick={()=>setAdminSubPage(a.id)} style={{
                    padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: isActive ? t.bgSidebarActive : "transparent",
                    color: isActive ? t.textSidebarActive : t.textMuted, fontWeight: isActive?700:600
                  }}>{a.label}</button>
                );
              })}
            </div>
          ) : activePage === "AccountantProPage" ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[{id:'dash',label:'لوحة الحسابات'},{id:'payments',label:'الدفعات'},{id:'invoices',label:'الفواتير'},{id:'payroll',label:'الرواتب'},{id:'revenues',label:'الإيرادات'},{id:'pricing',label:'الأسعار'}].map(a=>{
                const isActive = accountantSubPage===a.id;
                return (
                  <button key={a.id} onClick={()=>setAccountantSubPage(a.id)} style={{
                    padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: isActive ? t.bgSidebarActive : "transparent",
                    color: isActive ? t.textSidebarActive : t.textMuted, fontWeight: isActive?700:600
                  }}>{a.label}</button>
                );
              })}
            </div>
          ) : activePage === "ReceptionistPage" ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[{id:'students',label:'الطلاب'},{id:'bookings',label:'الحجوزات'},{id:'instructors',label:'المدربون'},{id:'certificate',label:'الشهادة'},{id:'transport',label:'النقل'}].map(a=>{
                const isActive = receptionistSubPage===a.id;
                return (
                  <button key={a.id} onClick={()=>setReceptionistSubPage(a.id)} style={{
                    padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                    background: isActive ? t.bgSidebarActive : "transparent",
                    color: isActive ? t.textSidebarActive : t.textMuted, fontWeight: isActive?700:600
                  }}>{a.label}</button>
                );
              })}
            </div>
          ) : (
            /* Breadcrumb */
            <div style={{ fontSize: 13, color: t.textMuted }}>
              {(() => {
                const nav = navItems.find(n => n.page === activePage);
                if (!nav) return "—";
                if (userRole === "accountant" && nav.id === "students") return "عرض الطلاب";
                if (userRole === "accountant" && nav.id === "instructors") return "عرض المدربين";
                return nav.label;
              })()}
            </div>
          )}

          <div style={{ flex: 1 }} />

            {/* Role Switcher (demo) */}
            <div style={{ fontSize: 11, color: t.textMuted }}>دور:</div>
            <select value={userRole} onChange={(e) => {
              const next = e.target.value;
              setUserRole(next);
              // if current active page will be hidden for the new role, reset to dashboard
              const hiddenByRole = {
                admin: ["AdminPro", "accounting", "AccountantPro"],
                accountant: ["AdminPro", "Receptionist", "bookings", "vehicles"],
                manager: [],
              };
              const hiddenIds = hiddenByRole[next] || [];
              const activeNav = navItems.find(n => n.page === activePage);
              if (activeNav && hiddenIds.includes(activeNav.id)) setActivePage("Dashboard");
            }} style={{
              padding: "5px 10px", borderRadius: 6, fontSize: 12,
              border: `0.5px solid ${t.border}`, background: t.bgElevated, color: t.text,
            }}>
              <option value="manager">مدير</option>
              <option value="admin">موظف إداري</option>
              <option value="accountant">محاسب</option>
            </select>

          {/* Dark mode */}
          <button onClick={() => setDarkMode(!darkMode)} style={{
            padding: "6px 14px", borderRadius: 7,
            background: t.accentLight, color: t.accentText,
            border: "none", fontSize: 12, cursor: "pointer", fontWeight: 600,
          }}>{darkMode ? "☀️ نهاري" : "🌙 ليلي"}</button>

          {/* User avatar */}
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: t.accentLight, color: t.accentText,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>م</div>
        </div>

        {/* PAGE CONTENT */}
        <div className="hide-scrollbar app-page">
          {pageComponents[activePage] || <PlaceholderPage title={activePage} t={t} />}
        </div>
      </div>
    </div>
  );
}
