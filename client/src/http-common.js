import axios from "axios";

const baseURL = process.env.REACT_APP_HEROKU_URL + "/api";

export default axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json"
  }
});
