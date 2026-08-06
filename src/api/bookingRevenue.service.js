import client from "./client";

const bookingRevenueService = {
  getSummary(params) {
    return client.get("/bookings/revenue/summary", { params });
  },

  getDaily(params) {
    return client.get("/bookings/revenue/daily", { params });
  },
};

export default bookingRevenueService;
