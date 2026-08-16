import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { tokens } from "../../constants/theme";
import { P } from "../../constants/roles";
import {
  PAGE_PERMISSIONS,
  isPageAllowed,
  ADMIN_SUB_TAB_PERMISSIONS,
  ACCOUNTANT_SUB_TAB_PERMISSIONS,
  RECEPTIONIST_SUB_TAB_PERMISSIONS,
} from "../../constants/pageAccess";
import qeyadahLogo from "../../assets/qeyadah-logo.jpg";

import { CiSettings } from "react-icons/ci";
import { PiUsersThin } from "react-icons/pi";
import { TbReport } from "react-icons/tb";
import { FaCar, FaUserTie } from "react-icons/fa";
import { TbBus } from "react-icons/tb";
import { PiStudent } from "react-icons/pi";
import { FaChartLine, FaChartColumn, FaBellConcierge } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

// Permission for each item comes from the shared PAGE_PERMISSIONS map (constants/pageAccess.js)
// via item.page — that's the single source of truth also used by AdminDashboard_3.jsx's page
// guard, so the sidebar and the guard can never drift apart.
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
    id: "transport",
    label: "خدمة النقل",
    icon: <TbBus />,
    page: "Transport",
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
  },
  {
    id: "settings",
    label: "إعدادات النظام",
    icon: <CiSettings />,
    page: "Settings",
  },
];

const ADMIN_SUB_TABS = [
  { id: "permissions", label: "الصلاحيات" },
  { id: "pricing", label: "الأسعار و إعدادات النظام " },
];

const ACCOUNTANT_SUB_TABS = [
  { id: "general-expenses", label: "المصاريف العامة" },
  { id: "employees", label: "الموظفون" },
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
  accountantSubPage,
  onAccountantSubPageChange,
  receptionistSubPage,
  onReceptionistSubPageChange,
  darkMode = false,
  onDarkModeToggle,
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.innerWidth < 1280);

  useEffect(() => {
    const onResize = () => setSidebarCollapsed(window.innerWidth < 1280);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, hasPermission, logout } = useAuth();
  const navigate = useNavigate();

  const t = tokens[darkMode ? "dark" : "light"];
  const sidebarWidth = sidebarCollapsed ? 84 : 324;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const visibleNav = navItems.filter((item) => isPageAllowed(hasPermission, PAGE_PERMISSIONS[item.page]));

  // Same "hop to the first authorized view" rule as the sub-tab effects below, one level up:
  // if the current top-level page requires a permission the user no longer has (revoked mid-
  // session, or simply the hardcoded "Dashboard" default not being valid for this role), switch
  // to the first page still visible in the sidebar instead of leaving them on a dead/blocked tab.
  useEffect(() => {
    if (!onPageChange) return;
    if (isPageAllowed(hasPermission, PAGE_PERMISSIONS[activePage])) return;
    if (visibleNav.length && visibleNav[0].page !== activePage) onPageChange(visibleNav[0].page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, hasPermission]);

  const canOpenSubTab = (subTabPermissions, tabId) => {
    const perm = subTabPermissions[tabId];
    return !perm || hasPermission(perm);
  };
  const visibleAdminSubTabs = ADMIN_SUB_TABS.filter((tab) => canOpenSubTab(ADMIN_SUB_TAB_PERMISSIONS, tab.id));
  const visibleAccountantSubTabs = ACCOUNTANT_SUB_TABS.filter((tab) => canOpenSubTab(ACCOUNTANT_SUB_TAB_PERMISSIONS, tab.id));
  const visibleReceptionistSubTabs = RECEPTIONIST_SUB_TABS.filter((tab) => canOpenSubTab(RECEPTIONIST_SUB_TAB_PERMISSIONS, tab.id));

  // If permissions change (or the active sub-tab was never valid for this user) while a sub-tab
  // that's no longer visible is selected, hop to the first one still open instead of leaving the
  // topbar pointing at a hidden tab — mirrors the "auto-redirect to first authorized view" rule.
  useEffect(() => {
    if (activePage !== "AdminProPage" || !onAdminSubPageChange) return;
    if (canOpenSubTab(ADMIN_SUB_TAB_PERMISSIONS, adminSubPage)) return;
    const first = ADMIN_SUB_TABS.find((tab) => canOpenSubTab(ADMIN_SUB_TAB_PERMISSIONS, tab.id));
    if (first) onAdminSubPageChange(first.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, adminSubPage, hasPermission]);

  useEffect(() => {
    if (activePage !== "AccountantProPage" || !onAccountantSubPageChange) return;
    if (canOpenSubTab(ACCOUNTANT_SUB_TAB_PERMISSIONS, accountantSubPage)) return;
    const first = ACCOUNTANT_SUB_TABS.find((tab) => canOpenSubTab(ACCOUNTANT_SUB_TAB_PERMISSIONS, tab.id));
    if (first) onAccountantSubPageChange(first.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, accountantSubPage, hasPermission]);

  useEffect(() => {
    if (activePage !== "ReceptionistPage" || !onReceptionistSubPageChange) return;
    if (canOpenSubTab(RECEPTIONIST_SUB_TAB_PERMISSIONS, receptionistSubPage)) return;
    const first = RECEPTIONIST_SUB_TABS.find((tab) => canOpenSubTab(RECEPTIONIST_SUB_TAB_PERMISSIONS, tab.id));
    if (first) onReceptionistSubPageChange(first.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage, receptionistSubPage, hasPermission]);

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
      <div style={{ width: sidebarWidth, flexShrink: 0, transition: "width 0.2s ease" }} />

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
            justifyContent: sidebarCollapsed ? "center" : "flex-start",
            gap: 10,
            transition: "all 0.2s ease",
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
                title={sidebarCollapsed ? displayLabel(item) : undefined}
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
            onClick={() => setShowLogoutConfirm(true)}
            title={sidebarCollapsed ? "تسجيل الخروج" : undefined}
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
            title={sidebarCollapsed ? "توسيع الشريط الجانبي" : "تصغير الشريط الجانبي"}
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
              {visibleAdminSubTabs.map((tab) => (
                <button key={tab.id} onClick={() => onAdminSubPageChange(tab.id)} style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: adminSubPage === tab.id ? t.bgSidebarActive : "transparent",
                  color: adminSubPage === tab.id ? t.textSidebarActive : t.textMuted,
                  fontWeight: adminSubPage === tab.id ? 700 : 600, fontSize: 13,
                }}>{tab.label}</button>
              ))}
            </div>
          ) : activePage === "AccountantProPage" && onAccountantSubPageChange ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {visibleAccountantSubTabs.map((tab) => (
                <button key={tab.id} onClick={() => onAccountantSubPageChange(tab.id)} style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: accountantSubPage === tab.id ? t.bgSidebarActive : "transparent",
                  color: accountantSubPage === tab.id ? t.textSidebarActive : t.textMuted,
                  fontWeight: accountantSubPage === tab.id ? 700 : 600, fontSize: 13,
                }}>{tab.label}</button>
              ))}
            </div>
          ) : activePage === "ReceptionistPage" && onReceptionistSubPageChange ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {visibleReceptionistSubTabs.map((tab) => (
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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          onClick={() => setShowLogoutConfirm(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: t.bgSurface, borderRadius: 16, padding: "28px 28px 22px",
              width: 320, boxShadow: "0 20px 48px rgba(0,0,0,0.22)",
              border: `1px solid ${t.borderCard}`, textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>
              <FiLogOut color="#c74848" />
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 6 }}>
              تسجيل الخروج
            </div>
            <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 22 }}>
              هل أنت متأكد أنك تريد تسجيل الخروج من النظام؟
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10, border: "none",
                  background: "#c74848", color: "#fff", fontSize: 14,
                  fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                تسجيل الخروج
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                  background: t.bgElevated, color: t.textSec, fontSize: 14,
                  fontWeight: 600, border: `1px solid ${t.border}`, fontFamily: "inherit",
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
