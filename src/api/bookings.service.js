import client from "./client";

const bookingsService = {
  getAll(params) {
    return client.get("/reception/bookings", { params });
  },

  getById(id) {
    return client.get(`/reception/bookings/${id}`);
  },

  create(data) {
    return client.post("/reception/bookings", data);
  },

  cancel(id, data) {
    return client.post(`/reception/bookings/${id}/cancel`, data);
  },

  payRemainder(id) {
    return client.post(`/reception/bookings/${id}/pay-remainder`);
  },

  getAvailableSlots(params) {
    return client.get("/reception/bookings/available-slots", { params });
  },

  creditCheck(studentId) {
    return client.get(`/students/${studentId}/credit-check`);
  },
};

export default bookingsService;
