import http from "../http-common";

const getAll = () => {
  return http.get("/servizios");
};

const get = id => {
  return http.get(`/servizios/${id}`);
};

const create = data => {
  return http.post("/servizios", data);
};

const update = (id, data) => {
  return http.put(`/servizios/${id}`, data);
};

const remove = id => {
  return http.delete(`/servizios/${id}`);
};

const removeAll = () => {
  return http.delete(`/servizios`);
};


export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll
};
