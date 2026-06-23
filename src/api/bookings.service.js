import client from "./client";

const bookingsService = {
  getAll(params) {
    return client.get("/bookings", { params });
  },

  getById(id) {
    return client.get(`/bookings/${id}`);
  },

  create(data) {
    return client.post("/bookings", data);
  },

  cancel(id, data) {
    return client.post(`/bookings/${id}/cancel`, data);
  },

  complete(id) {
    return client.post(`/bookings/${id}/complete`);
  },

  markNoShow(id) {
    return client.post(`/bookings/${id}/no-show`);
  },

  getAvailableSlots(params) {
    return client.get("/bookings/available-slots", { params });
  },

  getCancellation(bookingId) {
    return client.get(`/bookings/${bookingId}/cancellation`);
  },

  getLessonPrices(params) {
    return client.get("/lesson-prices", { params });
  },

  createLessonPrice(data) {
    return client.post("/lesson-prices", data);
  },
};

export default bookingsService;
