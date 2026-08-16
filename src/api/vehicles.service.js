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

  archive(id, archived) {
    return client.put(`/vehicles/${id}/archive`, { archived });
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

  returnFromMaintenance(vehicleId, data) {
    return client.post(`/vehicles/${vehicleId}/return-from-maintenance`, data);
  },

  getReport(vehicleId, params) {
    return client.get(`/vehicles/${vehicleId}/report`, { params });
  },

  getExpenses(vehicleId, params) {
    return client.get(`/vehicles/${vehicleId}/expenses`, { params });
  },

  getExpensesSummary(params) {
    return client.get("/vehicles/expenses/summary", { params });
  },

  addExpense(vehicleId, data) {
    return client.post(`/vehicles/${vehicleId}/expenses`, data);
  },

  deleteExpense(vehicleId, expenseId) {
    return client.delete(`/vehicles/${vehicleId}/expenses/${expenseId}`);
  },
};

export default vehiclesService;
