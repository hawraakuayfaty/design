import client from "./client";

const dashboardService = {
  getTodaySummary() {
    return client.get("/reception/dashboard/today-summary");
  },

  getAlerts() {
    return client.get("/reception/dashboard/alerts");
  },

  getTodayLessons(params) {
    return client.get("/reception/dashboard/today-lessons", { params });
  },

  getPendingPayments() {
    return client.get("/reception/dashboard/pending-payments");
  },

  getFleetStatus() {
    return client.get("/reception/dashboard/fleet-status");
  },
};

export default dashboardService;
