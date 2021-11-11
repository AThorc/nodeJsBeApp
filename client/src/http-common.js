import axios from "axios";

const baseURL = "/api";

export default axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json"
  }
});
