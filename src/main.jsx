import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./guards/ProtectedRoute";
import LogIn from "./LogIn.jsx";
import DashboardShell from "./DashboardShell.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardShell />
              </ProtectedRoute>
            }
          />
          {/* Legacy route redirect */}
          <Route
            path="/DashBoard/Home"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  </StrictMode>,
);
