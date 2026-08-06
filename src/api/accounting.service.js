import client from "./client";

const accountingService = {
  getOverview({ from, to } = {}) {
    return client.get("/accounting/overview", { params: { from, to } });
  },
};

export default accountingService;
