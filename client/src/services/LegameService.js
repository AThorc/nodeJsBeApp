import http from "../http-common";

const getAll = () => {
  return http.get("/legames");
};

const get = id => {
  return http.get(`/legames/${id}`);
};

const create = data => {
  return http.post("/legames", data);
};

const update = (id, data) => {
  return http.put(`/legames/${id}`, data);
};

const remove = id => {
  return http.delete(`/legames/${id}`);
};

const removeAll = () => {
  return http.delete(`/legames`);
};

const findByServizioId = (servizioId) => {
  return http.get(`/legames?servizioid=${servizioId}`);
};
const findByServizioIdClienteId = (servizioId,clientId) => {
  return http.get(`/legames?servizioid=${servizioId}&clienteid=${clientId}`);
};

const findByPartnerId = (partnerId) => {
  return http.get(`/legames?partnerid=${partnerId}`);
};

const findByClienteId = (clienteId) => {
  return http.get(`/legames?clienteid=${clienteId}`);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByServizioId,
  findByServizioIdClienteId,
  findByPartnerId,
  findByClienteId
};
