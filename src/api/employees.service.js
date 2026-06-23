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
};

export default employeesService;
