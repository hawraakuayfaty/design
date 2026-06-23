import client from "./client";

const usersService = {
  getAll(params) {
    return client.get("/users", { params });
  },

  getById(id) {
    return client.get(`/users/${id}`);
  },

  create(data) {
    return client.post("/users", data);
  },

  update(id, data) {
    return client.patch(`/users/${id}`, data);
  },

  updateStatus(id, accountStatus) {
    return client.patch(`/users/${id}/status`, { accountStatus });
  },

  getRoles(userId) {
    return client.get(`/users/${userId}/roles`);
  },

  assignRole(userId, roleId) {
    return client.post(`/users/${userId}/roles`, { roleId });
  },

  removeRole(userId, roleId) {
    return client.delete(`/users/${userId}/roles/${roleId}`);
  },
};

export default usersService;
