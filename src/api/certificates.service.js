import client from "./client";

const certificatesService = {
  /* ── Individual certificates ──────────────────────────────────────── */
  getAll(params)        { return client.get("/reception/certificates", { params }); },
  getById(id)           { return client.get(`/reception/certificates/${id}`); },
  update(id, data)      { return client.patch(`/reception/certificates/${id}`, data); },
  uploadDocuments(id, fd){ return client.patch(`/reception/certificates/${id}/documents`, fd, { headers: { "Content-Type": "multipart/form-data" } }); },
  requestReexam(id)     { return client.post(`/reception/certificates/${id}/reexam`, {}); },
  recordExamResult(id, data){ return client.post(`/reception/certificates/${id}/exam-results`, data); },
  exportPreview(data)   { return client.post("/reception/certificates/export-preview", data, { responseType: "blob" }); },

  /* ── Certificate courses ──────────────────────────────────────────── */
  getCourses(params)          { return client.get("/reception/certificate-courses", { params }); },
  getCourseById(id)           { return client.get(`/reception/certificate-courses/${id}`); },
  createCourse(data)          { return client.post("/reception/certificate-courses", data); },
  updateSessions(id, data)    { return client.put(`/reception/certificate-courses/${id}/sessions`, data); },
  updateExamSchedule(id, data){ return client.put(`/reception/certificate-courses/${id}/exam-schedule`, data); },
  getCourseRoster(id)         { return client.get(`/reception/certificate-courses/${id}/roster`); },
  submitResults(id, data)     { return client.post(`/reception/certificate-courses/${id}/results`, data); },
  exportCourse(id, data={})   { return client.post(`/reception/certificate-courses/${id}/export`, data, { responseType: "blob" }); },

  /* ── Revenue ──────────────────────────────────────────────────────── */
  getRevenueSummary()    { return client.get("/certificates/revenue/summary"); },
  getRevenueDaily(days)  { return client.get("/certificates/revenue/daily", { params: { days } }); },

  /* ── Revenue (report dashboard — from/to & date per front-end-GUI-GUIDE §5) ── */
  getRevenueSummaryByRange(params) { return client.get("/certificates/revenue/summary", { params }); },
  getRevenueDailyByDate(params)    { return client.get("/certificates/revenue/daily", { params }); },

  /* ── Legacy (kept for any remaining callers) ──────────────────────── */
  cancel(id, data)            { return client.post(`/reception/certificates/${id}/cancel`, data); },
  exportFile(data)            { return client.post("/reception/certificates/export", data, { responseType: "blob" }); },
  importPreview(fd)           { return client.post("/reception/certificates/import/preview", fd); },
  assignCourseNumber(data)    { return client.put("/reception/certificates/course/batch", data); },
  setTrainingSessions(id, d)  { return client.put(`/reception/certificates/${id}/training-sessions`, d); },
  setTrainingSessionsBatch(d) { return client.put("/reception/certificates/training-sessions/batch", d); },
  setExamSchedule(id, d)      { return client.put(`/reception/certificates/${id}/exam-schedule`, d); },
  notifyTrainingSessions(d)   { return client.post("/reception/certificates/notify-training-sessions", d); },
};

export default certificatesService;
