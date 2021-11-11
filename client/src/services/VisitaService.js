import http from "../http-common";

/*
const getAll = () => {
  return http.get("/visitas");
};
*/

const getAllByUserId = userid => {
  return http.get(`/visitas?userid=${userid}`);
};

const get = id => {
  return http.get(`/visitas/${id}`);
};

const create = data => {
  return http.post("/visitas", data);
};

const update = (id, data) => {
  return http.put(`/visitas/${id}`, data);
};

const remove = id => {
  return http.delete(`/visitas/${id}`);
};

/*
const removeAll = () => {
  return http.delete(`/visitas`);
};
*/

const findByLuogo = (userid, luogo) => {
  return http.get(`/visitas?userid=${userid}&luogo=${luogo}`);
};

export default {
  //getAll,
  getAllByUserId,
  get,
  create,
  update,
  remove,
  //removeAll,
  //findByTitle
  findByLuogo
};
