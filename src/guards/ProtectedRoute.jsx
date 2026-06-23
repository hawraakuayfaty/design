import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function ProtectedRoute({ children, allowedRoles, requiredPermission }) {
  const { isAuthenticated, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
