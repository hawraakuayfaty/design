import client from "./client";

const employeesService = {
  getAll(params) {
    return client.get("/employees", { params });
  },

  getById(id) {
    return client.get(`/employees/${id}`);
  },

  create(data) {
    return client.post("/users/employees", data);
  },

  update(id, data) {
    return client.patch(`/employees/${id}`, data);
  },

  updateRole(id, role) {
    return client.put(`/employees/${id}/role`, { role });
  },

  archive(id, archived) {
    return client.put(`/employees/${id}/archive`, { archived });
  },
};

export default employeesService;
