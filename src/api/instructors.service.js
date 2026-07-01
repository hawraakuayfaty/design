import client from "./client";

const instructorsService = {
  getAll(params) {
    return client.get("/instructors", { params });
  },

  getById(id) {
    return client.get(`/instructors/${id}`);
  },

  create(data) {
    return client.post("/users/instructors", data);
  },

  getProfile(id) {
    return client.get(`/instructors/${id}/profile`);
  },

  getStats(id) {
    return client.get(`/instructors/${id}/stats`);
  },

  getBookings(id, params) {
    return client.get(`/instructors/${id}/bookings`, { params });
  },

  getSchedule(id) {
    return client.get(`/instructors/${id}/schedule`);
  },

  updateSchedule(id, data) {
    return client.put(`/instructors/${id}/schedule`, data);
  },

  getLeaves(id) {
    return client.get(`/instructors/${id}/leaves`);
  },

  requestLeave(id, data) {
    return client.post(`/instructors/${id}/leaves`, data);
  },

  updateLeave(id, leaveId, data) {
    return client.put(`/instructors/${id}/leaves/${leaveId}`, data);
  },

  deleteLeave(id, leaveId) {
    return client.delete(`/instructors/${id}/leaves/${leaveId}`);
  },
};

export default instructorsService;
