import client from "./client";

const certificatesService = {
  getAll(params) {
    return client.get("/reception/certificates", { params });
  },

  getById(id) {
    return client.get(`/reception/certificates/${id}`);
  },

  update(id, data) {
    return client.patch(`/reception/certificates/${id}`, data);
  },

  cancel(id, data) {
    return client.post(`/reception/certificates/${id}/cancel`, data);
  },

  exportFile(data) {
    return client.post("/reception/certificates/export", data, { responseType: "blob" });
  },

  importPreview(formData) {
    return client.post("/reception/certificates/import/preview", formData);
  },

  assignCourseNumber(data) {
    return client.put("/reception/certificates/course/batch", data);
  },

  setTrainingSessions(id, data) {
    return client.put(`/reception/certificates/${id}/training-sessions`, data);
  },

  setTrainingSessionsBatch(data) {
    return client.put("/reception/certificates/training-sessions/batch", data);
  },

  setExamSchedule(id, data) {
    return client.put(`/reception/certificates/${id}/exam-schedule`, data);
  },

  setExamScheduleBatch(data) {
    return client.put("/reception/certificates/exam-schedule/batch", data);
  },

  recordExamResult(id, data) {
    return client.post(`/reception/certificates/${id}/exam-results`, data);
  },

  notifyTrainingSessions(data) {
    return client.post("/reception/certificates/notify-training-sessions", data);
  },
};

export default certificatesService;
