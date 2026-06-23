import client from "./client";

const settingsService = {
  getAll() {
    return client.get("/settings");
  },

  getByKey(key) {
    return client.get(`/settings/${key}`);
  },

  update(key, value) {
    return client.patch(`/settings/${key}`, { value });
  },

  getActivityLog(params) {
    return client.get("/activity-log", { params });
  },
};

export default settingsService;
