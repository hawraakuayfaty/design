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
    return client.put(`/vehicles/${id}`, data);
  },

  addFuel(id, data) {
    return client.post(`/vehicles/${id}/fuel`, data);
  },

  archive(id) {
    return client.post(`/vehicles/${id}/archive`);
  },

  sendVehicleToMaintenance(vehicleId, data) {
    return client.post(`/vehicles/${vehicleId}/maintenance`, data);
  },

  getAllMaintenancePeriods(vehicleId) {
    return client.get(`/vehicles/${vehicleId}/maintenance`);
  },

  updateMaintenancePeriod(vehicleId, periodId, data) {
    return client.put(`/vehicles/${vehicleId}/maintenance/${periodId}`, data);
  },

  deleteMaintenancePeriod(vehicleId, periodId) {
    return client.delete(`/vehicles/${vehicleId}/maintenance/${periodId}`);
  },

  // The API path shape is /vehicles/:id/return-from-maintenance, but :id is actually
  // the maintenance periodId, not the vehicleId — confirmed in reception-dashboard-api
  // reference. Pass the period's id here, not vehicle.id.
  returnFromMaintenance(periodId, data) {
    return client.post(`/vehicles/${periodId}/return-from-maintenance`, data);
  },
};

export default vehiclesService;
