import client from "./client";

const certificatesService = {
  getAll(params) {
    return client.get("/certificates", { params });
  },

  getById(id) {
    return client.get(`/certificates/${id}`);
  },

  create(data) {
    return client.post("/certificates", data);
  },

  updateStatus(id, requestStatus) {
    return client.patch(`/certificates/${id}/status`, { requestStatus });
  },

  getTrainingSessions(certificateId) {
    return client.get(`/certificates/${certificateId}/training-sessions`);
  },

  updateTrainingSession(certificateId, sessionId, data) {
    return client.patch(
      `/certificates/${certificateId}/training-sessions/${sessionId}`,
      data
    );
  },

  getExamResults(certificateId) {
    return client.get(`/certificates/${certificateId}/exam-results`);
  },

  createExamResult(certificateId, data) {
    return client.post(`/certificates/${certificateId}/exam-results`, data);
  },

  updateExamResult(certificateId, resultId, data) {
    return client.patch(
      `/certificates/${certificateId}/exam-results/${resultId}`,
      data
    );
  },
};

export default certificatesService;
