import React, { Component } from "react";

import UserService from "../services/user.service";
import logo from "../images/multifinance-logo.jpeg"


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response && error.response.data) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    return (
      <div className="container">
        <img src={logo} class="img-fluid" alt="Logo" />
      </div>
    );
  }
}