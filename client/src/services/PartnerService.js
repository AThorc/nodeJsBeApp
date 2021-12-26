import http from "../http-common";

const getAll = () => {
  return http.get("/partners");
};

const get = id => {
  return http.get(`/partners/${id}`);
};

const create = data => {
  return http.post("/partners", data);
};

const update = (id, data) => {
  return http.put(`/partners/${id}`, data);
};

const remove = id => {
  return http.delete(`/partners/${id}`);
};

const removeAll = () => {
  return http.delete(`/partners`);
};

const findByDen = (denominazione) => {
  return http.get(`/partners?denominazione=${denominazione}`);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByDen
};
