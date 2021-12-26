import http from "../http-common";

const getAll = () => {
  return http.get("/segnalatores");
};

const get = id => {
  return http.get(`/segnalatores/${id}`);
};

const create = data => {
  return http.post("/segnalatores", data);
};

const update = (id, data) => {
  return http.put(`/segnalatores/${id}`, data);
};

const remove = id => {
  return http.delete(`/segnalatores/${id}`);
};

const removeAll = () => {
  return http.delete(`/segnalatores`);
};

const findByDen = (denominazione) => {
  return http.get(`/segnalatores?denominazione=${denominazione}`);
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
