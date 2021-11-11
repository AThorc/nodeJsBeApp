import axios from "axios";
require('dotenv').config();

export default axios.create({
  baseURL: process.env.HEROKU_URL + "api",
  headers: {
    "Content-type": "application/json"
  }
});
