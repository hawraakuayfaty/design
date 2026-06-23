import client from "./client";

const notificationsService = {
  getAll(params) {
    return client.get("/notifications", { params });
  },

  getById(id) {
    return client.get(`/notifications/${id}`);
  },

  markAsRead(id) {
    return client.patch(`/notifications/${id}/read`);
  },

  markAllAsRead() {
    return client.post("/notifications/read-all");
  },

  getUnreadCount() {
    return client.get("/notifications/unread-count");
  },
};

export default notificationsService;
