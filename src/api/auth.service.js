import client from "./client";

const authService = {
  login(phone, password) {
    return client.post("/auth/login", { phone, password });
  },

  loginWithOtp(phone, code) {
    return client.post("/auth/otp/verify", { phone, code });
  },

  requestOtp(phone, purpose) {
    return client.post("/auth/otp/request", { phone, purpose });
  },

  refreshToken(refreshToken) {
    return client.post("/auth/refresh", { refreshToken });
  },

  logout() {
    const refreshToken = localStorage.getItem("refreshToken");
    return client.post("/auth/logout", { refreshToken }).finally(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    });
  },

  changePassword(currentPassword, newPassword) {
    return client.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },

  getProfile() {
    return client.get("/auth/me");
  },

  getMyPermissions() {
    return client.get("/auth/me/permissions");
  },

  logoutAll() {
    return client.post("/auth/logout-all").finally(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    });
  },
};

export default authService;
