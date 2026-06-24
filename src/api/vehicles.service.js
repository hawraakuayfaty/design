import client from "./client";

const vehiclesService = {
  getAll(params) {
    const url = "/vehicles";
    const method = "GET";
    console.log(`[API Request] ${method} ${url}`, { params });
    return client
      .get(url, { params })
      .then((res) => {
        console.log(`[API Response] ${method} ${url}`, {
          status: res.status,
          data: res.data,
        });
        return res;
      })
      .catch((err) => {
        console.error(`[API Error] ${method} ${url}`, {
          status: err.response?.status,
          error: err.response?.data || err.message,
        });
        throw err;
      });
  },

  getById(id) {
    const url = `/vehicles/${id}`;
    const method = "GET";
    console.log(`[API Request] ${method} ${url}`);
    return client
      .get(url)
      .then((res) => {
        console.log(`[API Response] ${method} ${url}`, {
          status: res.status,
          data: res.data,
        });
        return res;
      })
      .catch((err) => {
        console.error(`[API Error] ${method} ${url}`, {
          status: err.response?.status,
          error: err.response?.data || err.message,
        });
        throw err;
      });
  },

  create(data) {
    const url = "/vehicles";
    const method = "POST";
    console.log(`[API Request] ${method} ${url}`, { body: data });
    return client
      .post(url, data)
      .then((res) => {
        console.log(`[API Response] ${method} ${url}`, {
          status: res.status,
          data: res.data,
        });
        return res;
      })
      .catch((err) => {
        console.error(`[API Error] ${method} ${url}`, {
          status: err.response?.status,
          error: err.response?.data || err.message,
        });
        throw err;
      });
  },

  update(id, data) {
    const url = `/vehicles/${id}`;
    const method = "PUT";
    console.log(`[API Request] ${method} ${url}`, { body: data });
    return client
      .put(url, data)
      .then((res) => {
        console.log(`[API Response] ${method} ${url}`, {
          status: res.status,
          data: res.data,
        });
        return res;
      })
      .catch((err) => {
        console.error(`[API Error] ${method} ${url}`, {
          status: err.response?.status,
          error: err.response?.data || err.message,
        });
        throw err;
      });
  },

  addFuel(id, data) {
    const url = `/vehicles/${id}/fuel`;
    const method = "POST";
    console.log(`[API Request] ${method} ${url}`, { body: data });
    return client
      .post(url, data)
      .then((res) => {
        console.log(`[API Response] ${method} ${url}`, {
          status: res.status,
          data: res.data,
        });
        return res;
      })
      .catch((err) => {
        console.error(`[API Error] ${method} ${url}`, {
          status: err.response?.status,
          error: err.response?.data || err.message,
        });
        throw err;
      });
  },

  sendToMaintenance(id) {
    const url = `/vehicles/${id}/maintenance`;
    const method = "POST";
    console.log(`[API Request] ${method} ${url}`);
    return client
      .post(url)
      .then((res) => {
        console.log(`[API Response] ${method} ${url}`, {
          status: res.status,
          data: res.data,
        });
        return res;
      })
      .catch((err) => {
        console.error(`[API Error] ${method} ${url}`, {
          status: err.response?.status,
          error: err.response?.data || err.message,
        });
        throw err;
      });
  },

  returnFromMaintenance(id, data) {
    const url = `/vehicles/${id}/return-from-maintenance`;
    const method = "POST";
    console.log(`[API Request] ${method} ${url}`, { body: data });
    return client
      .post(url, data)
      .then((res) => {
        console.log(`[API Response] ${method} ${url}`, {
          status: res.status,
          data: res.data,
        });
        return res;
      })
      .catch((err) => {
        console.error(`[API Error] ${method} ${url}`, {
          status: err.response?.status,
          error: err.response?.data || err.message,
        });
        throw err;
      });
  },

  archive(id) {
    const url = `/vehicles/${id}/archive`;
    const method = "POST";
    console.log(`[API Request] ${method} ${url}`);
    return client
      .post(url)
      .then((res) => {
        console.log(`[API Response] ${method} ${url}`, {
          status: res.status,
          data: res.data,
        });
        return res;
      })
      .catch((err) => {
        console.error(`[API Error] ${method} ${url}`, {
          status: err.response?.status,
          error: err.response?.data || err.message,
        });
        throw err;
      });
  },
};

export default vehiclesService;
