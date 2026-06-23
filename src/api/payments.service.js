import client from "./client";

const paymentsService = {
  getCharges(params) {
    return client.get("/student-charges", { params });
  },

  getChargeById(id) {
    return client.get(`/student-charges/${id}`);
  },

  createCharge(data) {
    return client.post("/student-charges", data);
  },

  cancelCharge(id) {
    return client.post(`/student-charges/${id}/cancel`);
  },

  getPayments(params) {
    return client.get("/student-payments", { params });
  },

  createPayment(data) {
    return client.post("/student-payments", data);
  },

  verifyShamcash(data) {
    return client.post("/shamcash/verify", data);
  },

  getShamcashTransaction(paymentId) {
    return client.get(`/shamcash/transactions/${paymentId}`);
  },
};

export default paymentsService;
