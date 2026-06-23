import { createContext, useState, useCallback, useEffect } from "react";
import { authService } from "../api";

const AuthContext = createContext(null);

function parseStoredUser() {
  try {
    const stored = localStorage.getItem("user");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed && Array.isArray(parsed.permissions)) return parsed;
    return null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(parseStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;

  const persistUser = useCallback((userData, accessToken, refreshToken) => {
    localStorage.setItem("token", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (phone, password) => {
    setLoading(true);
    try {
      const response = await authService.login(phone, password);

      // Backend may wrap payload in { data: { ... } } (NestJS interceptor)
      const body = response.data?.data || response.data;

      const accessToken = body.accessToken || body.token;
      if (!accessToken) {
        throw new Error("لم يتم استلام رمز الدخول من السيرفر");
      }

      const refreshToken = body.refreshToken || null;

      const rawUser = body.user || body;
      const permissions = Array.isArray(rawUser.permissions)
        ? rawUser.permissions
        : [];
      const roles = Array.isArray(rawUser.roles)
        ? rawUser.roles.map((r) =>
            typeof r === "string" ? r.toUpperCase() : (r.title || r.name || "").toUpperCase()
          )
        : [];

      const userData = {
        id: rawUser.id,
        name: rawUser.name,
        phone: rawUser.phone,
        roles,
        permissions,
      };

      persistUser(userData, accessToken, refreshToken);
      return userData;
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  const devLogin = useCallback((role) => {
    const mockUsers = {
      MANAGER: {
        id: 1, name: "مدير النظام", phone: "0999999999",
        roles: ["MANAGER"],
        permissions: [
          "students.read", "students.create", "students.update",
          "instructors.read", "instructors.create", "instructors.update",
          "employees.read", "employees.create",
          "bookings.read", "bookings.create", "bookings.cancel",
          "vehicles.read", "vehicles.create", "vehicles.update",
          "payments.read", "payments.create", "payments.verify",
          "certificates.read", "certificates.create", "certificates.update",
          "transport.read", "reports.read",
          "users.read", "users.create", "users.update",
          "settings.read", "settings.update",
          "expenses.read", "expenses.create",
        ],
      },
      RECEPTIONIST: {
        id: 2, name: "موظف الاستقبال", phone: "0988888888",
        roles: ["RECEPTIONIST"],
        permissions: [
          "students.read", "students.create",
          "instructors.read",
          "bookings.read", "bookings.create", "bookings.cancel",
          "vehicles.read",
          "payments.read", "payments.verify",
          "certificates.read", "certificates.update",
          "transport.read",
        ],
      },
      ACCOUNTANT: {
        id: 3, name: "المحاسب", phone: "0977777777",
        roles: ["ACCOUNTANT"],
        permissions: [
          "students.read", "instructors.read",
          "payments.read", "payments.verify",
          "expenses.read", "expenses.create",
          "reports.read",
        ],
      },
    };
    const userData = mockUsers[role] || mockUsers.MANAGER;
    persistUser(userData, "dev-token-" + Date.now(), null);
    return userData;
  }, [persistUser]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // clear local state regardless
    }
    clearAuth();
  }, [clearAuth]);

  const hasRole = useCallback(
    (role) => {
      if (!user?.roles?.length) return false;
      const upperRoles = user.roles.map((r) => r.toUpperCase());
      if (Array.isArray(role)) return role.some((r) => upperRoles.includes(r.toUpperCase()));
      return upperRoles.includes(role.toUpperCase());
    },
    [user]
  );

  const hasPermission = useCallback(
    (permission) => {
      if (!user?.permissions?.length) return false;
      if (Array.isArray(permission)) {
        return permission.some((p) => user.permissions.includes(p));
      }
      return user.permissions.includes(permission);
    },
    [user]
  );

  const primaryRole = user?.roles?.[0] || null;

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" && !e.newValue) {
        setToken(null);
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        primaryRole,
        login,
        devLogin,
        logout,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
