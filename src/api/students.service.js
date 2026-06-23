import client from "./client";

const studentsService = {
  getAll(params) {
    return client.get("/students", { params });
  },

  getById(id) {
    return client.get(`/students/${id}`);
  },

  create(data) {
    return client.post("/users/students", data);
  },

  getCharges(studentId, params) {
    return client.get(`/students/${studentId}/charges`, { params });
  },

  getBookings(studentId, params) {
    return client.get(`/students/${studentId}/bookings`, { params });
  },

  getCertificates(studentId) {
    return client.get(`/students/${studentId}/certificates`);
  },
};

export default studentsService;
