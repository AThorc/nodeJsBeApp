import axios from "axios";

export default axios.create({
  baseURL: process.env.HEROKU_URL + "api",
  headers: {
    "Content-type": "application/json"
  }
});
