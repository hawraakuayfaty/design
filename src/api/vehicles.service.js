import client from "./client";

const vehiclesService = {
  getAll(params) {
    return client.get("/vehicles", { params });
  },

  getById(id) {
    return client.get(`/vehicles/${id}`);
  },

  create(data) {
    return client.post("/vehicles", data);
  },

  update(id, data) {
    return client.patch(`/vehicles/${id}`, data);
  },

  updateStatus(id, status) {
    return client.patch(`/vehicles/${id}/status`, { status });
  },

  getUnavailablePeriods(vehicleId, params) {
    return client.get(`/vehicles/${vehicleId}/unavailable-periods`, { params });
  },

  createUnavailablePeriod(vehicleId, data) {
    return client.post(`/vehicles/${vehicleId}/unavailable-periods`, data);
  },

  deleteUnavailablePeriod(vehicleId, periodId) {
    return client.delete(
      `/vehicles/${vehicleId}/unavailable-periods/${periodId}`
    );
  },
};

export default vehiclesService;
