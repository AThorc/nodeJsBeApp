import axios from "axios";

const baseURL = process.env.HEROKU_URL + "/api";

export default axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json"
  }
});
