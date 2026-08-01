import client from "./client";

const generalExpensesService = {
  getAll(params) {
    return client.get("/general-expenses", { params });
  },

  getSummary(params) {
    return client.get("/general-expenses/summary", { params });
  },

  create(data) {
    return client.post("/general-expenses", data);
  },

  delete(expenseId) {
    return client.delete(`/general-expenses/${expenseId}`);
  },
};

export default generalExpensesService;
