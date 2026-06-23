import { useState } from "react";
import MainLayout from "./components/layout/MainLayout";
import AdminDashboard from "./AdminDashboard_3.jsx";

export default function DashboardShell() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [adminSubPage, setAdminSubPage] = useState("dash");
  const [accountantSubPage, setAccountantSubPage] = useState("dash");
  const [receptionistSubPage, setReceptionistSubPage] = useState("students");

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
    >
      <AdminDashboard
        embeddedMode
        activePage={activePage}
        onPageChange={setActivePage}
        adminSubPage={adminSubPage}
        accountantSubPage={accountantSubPage}
        receptionistSubPage={receptionistSubPage}
      />
    </MainLayout>
  );
}
