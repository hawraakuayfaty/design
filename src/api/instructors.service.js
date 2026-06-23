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

  getWeeklyAvailabilities(instructorId) {
    return client.get(`/instructors/${instructorId}/availabilities`);
  },

  setWeeklyAvailability(instructorId, data) {
    return client.post(`/instructors/${instructorId}/availabilities`, data);
  },

  deleteWeeklyAvailability(instructorId, availabilityId) {
    return client.delete(
      `/instructors/${instructorId}/availabilities/${availabilityId}`
    );
  },

  getUnavailablePeriods(instructorId, params) {
    return client.get(`/instructors/${instructorId}/unavailable-periods`, {
      params,
    });
  },

  createUnavailablePeriod(instructorId, data) {
    return client.post(
      `/instructors/${instructorId}/unavailable-periods`,
      data
    );
  },

  deleteUnavailablePeriod(instructorId, periodId) {
    return client.delete(
      `/instructors/${instructorId}/unavailable-periods/${periodId}`
    );
  },
};

export default instructorsService;
