import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// استيراد المكونات الحالية
import LogIn from "./LogIn.jsx"; // تأكدي أن مسار اسم ملف تسجيل الدخول صحيح عندكِ
import AdminDashboard from "./AdminDashboard_3.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* المسار الأول: صفحة تسجيل الدخول عند فتح الموقع */}
        <Route path="/" element={<LogIn />} />

        {/* المسار الثاني: لوحة التحكم الإدارية التي سينتقل إليها المستخدم بعد تسجيل الدخول */}
        <Route path="/DashBoard/Home" element={<AdminDashboard />} />
      </Routes>
    </Router>
  </StrictMode>,
);
