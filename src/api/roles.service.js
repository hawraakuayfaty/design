import client from "./client";

const rolesService = {
  getAll() {
    return client.get("/roles");
  },

  getCatalog() {
    return client.get("/roles/permissions-catalog");
  },

  getById(id) {
    return client.get(`/roles/${id}`);
  },

  updatePermissions(id, permissionCodes) {
    return client.put(`/roles/${id}/permissions`, { permissionCodes });
  },
};

export default rolesService;
