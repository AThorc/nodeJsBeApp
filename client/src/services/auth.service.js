import axios from "axios";

const API_URL = process.env.REACT_APP_HEROKU_URL + "/api/auth/";

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
          //console.log('.env var: '+ process.env.REACT_APP_HEROKU_URL);
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password
    });
  }

  changePsw(password) {
    var userid = this.getCurrentUser().id;
    return axios.post(API_URL + "update", {
      userid,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();