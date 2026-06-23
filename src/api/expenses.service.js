import client from "./client";

const expensesService = {
  getAll(params) {
    return client.get("/expenses", { params });
  },

  getById(id) {
    return client.get(`/expenses/${id}`);
  },

  create(data) {
    return client.post("/expenses", data);
  },

  update(id, data) {
    return client.patch(`/expenses/${id}`, data);
  },

  getInstructorPrices(params) {
    return client.get("/instructor-prices", { params });
  },

  createInstructorPrice(data) {
    return client.post("/instructor-prices", data);
  },
};

export default expensesService;
