import http from "../http-common";

const getAll = () => {
  return http.get("/modificas");
};

const get = id => {
  return http.get(`/modificas/${id}`);
};

export default {
  getAll,
  get,
};
