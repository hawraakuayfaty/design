import { useState } from "react";
import MainLayout from "./components/layout/MainLayout";
import AdminDashboard from "./AdminDashboard_3.jsx";

export default function DashboardShell() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [adminSubPage, setAdminSubPage] = useState("permissions");
  const [accountantSubPage, setAccountantSubPage] = useState("general-expenses");
  const [receptionistSubPage, setReceptionistSubPage] = useState("students");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <MainLayout
      activePage={activePage}
      onPageChange={setActivePage}
      adminSubPage={adminSubPage}
      onAdminSubPageChange={setAdminSubPage}
      accountantSubPage={accountantSubPage}
      onAccountantSubPageChange={setAccountantSubPage}
      receptionistSubPage={receptionistSubPage}
      onReceptionistSubPageChange={setReceptionistSubPage}
      darkMode={darkMode}
      onDarkModeToggle={() => setDarkMode(v => !v)}
    >
      <AdminDashboard
        embeddedMode
        activePage={activePage}
        onPageChange={setActivePage}
        adminSubPage={adminSubPage}
        accountantSubPage={accountantSubPage}
        receptionistSubPage={receptionistSubPage}
        darkMode={darkMode}
      />
    </MainLayout>
  );
}
