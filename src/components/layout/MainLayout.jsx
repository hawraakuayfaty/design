import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { tokens } from "../../constants/theme";
import { P } from "../../constants/roles";
import qeyadahLogo from "../../assets/qeyadah-logo.jpg";

import { CiSettings } from "react-icons/ci";
import { PiUsersThin } from "react-icons/pi";
import { TbReport } from "react-icons/tb";
import { FaRegAddressCard, FaCar, FaUserTie } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import { TbBus } from "react-icons/tb";
import { PiStudent } from "react-icons/pi";
import { FaChartLine, FaChartColumn, FaBellConcierge } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

const navItems = [
  { id: "dashboard", label: "لوحة التحكم", icon: "⊞", page: "Dashboard" },
  {
    id: "AdminPro",
    label: "إدارة الأدمن الاحترافية",
    icon: <MdAdminPanelSettings />,
    page: "AdminProPage",
    permission: P.EMPLOYEES_READ,
  },
  {
    id: "Receptionist",
    label: "شاشة الاستقبال والمتابعة",
    icon: <FaBellConcierge />,
    page: "ReceptionistPage",
    permission: P.BOOKINGS_READ,
  },
  {
    id: "accounting",
    label: "المحاسبة التشغيلية",
    icon: <FaChartColumn />,
    page: "Accounting",
    permission: P.PAYMENTS_READ,
  },
  {
    id: "AccountantPro",
    label: "لوحة الحسابات المتقدمة",
    icon: <FaChartLine />,
    page: "AccountantProPage",
    permission: P.PAYMENTS_READ,
  },
  {
    id: "students",
    label: "إدارة الطلاب",
    icon: <PiStudent />,
    page: "Students",
    permission: P.STUDENTS_READ,
  },
  {
    id: "instructors",
    label: "إدارة المدربين",
    icon: <FaUserTie />,
    page: "Instructors",
    permission: P.INSTRUCTORS_READ,
  },
  {
    id: "vehicles",
    label: "إدارة المركبات",
    icon: <FaCar />,
    page: "Vehicles",
    permission: P.VEHICLES_READ,
  },
  {
    id: "certificate",
    label: "الشهادة الحكومية",
    icon: <FaRegAddressCard />,
    page: "Certificate",
    permission: P.CERTIFICATES_READ,
  },
  {
    id: "transport",
    label: "خدمة النقل",
    icon: <TbBus />,
    page: "Transport",
    permission: P.TRANSPORT_READ,
  },
  {
    id: "payments",
    label: "الدفعات والعربون",
    icon: <CiCreditCard1 />,
    page: "Payments",
    permission: P.PAYMENTS_READ,
  },
  {
    id: "reports",
    label: "التقارير",
    icon: <TbReport />,
    page: "Reports",
  },
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
];

const ADMIN_SUB_TABS = [
  { id: "employees", label: "الموظفون" },
  { id: "permissions", label: "الصلاحيات" },
  { id: "pricing", label: "الأسعار و إعدادات النظام " },
];


const RECEPTIONIST_SUB_TABS = [
  { id: "students", label: "الطلاب" },
  { id: "bookings", label: "الحجوزات" },
  { id: "instructors", label: "المدربون" },
  { id: "certificate", label: "الشهادة" },
  { id: "transport", label: "النقل" },
];

export default function MainLayout({
  children,
  activePage,
  onPageChange,
  adminSubPage,
  onAdminSubPageChange,
  receptionistSubPage,
  onReceptionistSubPageChange,
  darkMode = false,
  onDarkModeToggle,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, hasPermission, logout } = useAuth();
  const navigate = useNavigate();

  const t = tokens[darkMode ? "dark" : "light"];
  const sidebarWidth = sidebarCollapsed ? 84 : 324;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const visibleNav = navItems.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const displayLabel = (item) => {
    if (item.id === "students" && !hasPermission(P.STUDENTS_CREATE)) return "عرض الطلاب";
    if (item.id === "instructors" && !hasPermission(P.INSTRUCTORS_CREATE)) return "عرض المدربين";
    return item.label;
  };

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
      {/* Sidebar spacer */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }} />

      {/* Sidebar */}
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
                  color: "#2c2c2a",
                  lineHeight: 1.2,
                }}
              >
                مدرسة القيادة
              </div>
              <div
                style={{ fontSize: 12, color: t.textSidebar, marginTop: 3 }}
              >
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
          {visibleNav.map((item) => {
            const isActive = activePage === item.page;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.page)}
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
                <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
                {!sidebarCollapsed && <span>{displayLabel(item)}</span>}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div
          style={{
            padding: "14px 10px",
            borderTop: `1px solid ${t.borderCard}`,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 12,
              background: "rgba(199,72,72,0.1)",
              border: "none",
              color: "#c74848",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <FiLogOut />
            {!sidebarCollapsed && <span>تسجيل الخروج</span>}
          </button>
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

      {/* Main Area */}
      <div
        className="app-main"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Topbar */}
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
          {/* Sub-tabs or breadcrumb */}
          {activePage === "AdminProPage" && onAdminSubPageChange ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {ADMIN_SUB_TABS.map((tab) => (
                <button key={tab.id} onClick={() => onAdminSubPageChange(tab.id)} style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: adminSubPage === tab.id ? t.bgSidebarActive : "transparent",
                  color: adminSubPage === tab.id ? t.textSidebarActive : t.textMuted,
                  fontWeight: adminSubPage === tab.id ? 700 : 600, fontSize: 13,
                }}>{tab.label}</button>
              ))}
            </div>
          ) : activePage === "ReceptionistPage" && onReceptionistSubPageChange ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {RECEPTIONIST_SUB_TABS.map((tab) => (
                <button key={tab.id} onClick={() => onReceptionistSubPageChange(tab.id)} style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: receptionistSubPage === tab.id ? t.bgSidebarActive : "transparent",
                  color: receptionistSubPage === tab.id ? t.textSidebarActive : t.textMuted,
                  fontWeight: receptionistSubPage === tab.id ? 700 : 600, fontSize: 13,
                }}>{tab.label}</button>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: t.textMuted }}>
              {navItems.find((n) => n.page === activePage)?.label || activePage}
            </div>
          )}

          <div style={{ flex: 1 }} />

          {/* User name */}
          <div
            style={{
              padding: "4px 12px",
              borderRadius: 8,
              background: t.accentLight,
              color: t.accentText,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {user?.name || "—"}
          </div>

          {/* Dark mode */}
          <button
            onClick={onDarkModeToggle}
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
            {darkMode ? "نهاري" : "ليلي"}
          </button>

          {/* User avatar */}
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
            {user?.name?.charAt(0) || "م"}
          </div>
        </div>

        {/* Page Content */}
        <div className="hide-scrollbar app-page">{children}</div>
      </div>
    </div>
  );
}
