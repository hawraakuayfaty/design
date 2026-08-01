import client from "./client";

const employeeAccountingService = {
  issueExpense(employeeId, data) {
    return client.post(`/employees/${employeeId}/expenses`, data);
  },

  getExpenses(employeeId, params) {
    return client.get(`/employees/${employeeId}/expenses`, { params });
  },

  getSummary(params) {
    return client.get("/employees/expenses/summary", { params });
  },

  deleteExpense(employeeId, expenseId) {
    return client.delete(`/employees/${employeeId}/expenses/${expenseId}`);
  },
};

export default employeeAccountingService;
