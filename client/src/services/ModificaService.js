import http from "../http-common";

const getAll = () => {
  return http.get("/modificas");
};

const get = id => {
  return http.get(`/modificas/${id}`);
};

const create = data => {
  return http.post("/modificas", data);
};

export default {
  getAll,
  get,
  create
};
