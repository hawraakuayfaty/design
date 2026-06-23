import client from "./client";

const transportService = {
  getTrips(params) {
    return client.get("/transport/trips", { params });
  },

  getTripById(id) {
    return client.get(`/transport/trips/${id}`);
  },

  createTrip(data) {
    return client.post("/transport/trips", data);
  },

  updateTrip(id, data) {
    return client.patch(`/transport/trips/${id}`, data);
  },

  getRegistrations(params) {
    return client.get("/transport/registrations", { params });
  },

  createRegistration(data) {
    return client.post("/transport/registrations", data);
  },

  updateRegistration(id, data) {
    return client.patch(`/transport/registrations/${id}`, data);
  },

  getAttendance(tripId) {
    return client.get(`/transport/trips/${tripId}/attendance`);
  },

  markAttendance(tripId, registrationId, data) {
    return client.patch(
      `/transport/trips/${tripId}/attendance/${registrationId}`,
      data
    );
  },
};

export default transportService;
