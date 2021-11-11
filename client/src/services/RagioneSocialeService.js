import http from "../http-common";

const getAll = () => {
  return http.get("/ragioneSociales");
};

const get = id => {
  return http.get(`/ragioneSociales/${id}`);
};

const create = data => {
  return http.post("/ragioneSociales", data);
};

const update = (id, data) => {
  return http.put(`/ragioneSociales/${id}`, data);
};

const remove = id => {
  return http.delete(`/ragioneSociales/${id}`);
};

const removeAll = () => {
  return http.delete(`/ragioneSociales`);
};

const findByConditions = (denominazione) => {
  return http.get(`/ragioneSociales?denominazione=${denominazione}`);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByConditions
};
