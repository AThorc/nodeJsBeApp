import React, { Component } from "react";

import { Switch, Route, Link } from "react-router-dom";
import UserService from "../services/user.service";
import "bootstrap/dist/css/bootstrap.min.css";


import AddVisita from "./AddVisita";
import Visita from "./Visita";
import VisitasList from "./VisitasList";

export default class BoardUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  /*
  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
      </div>
    );
  }*/

  render(){
    return (
      <div>
      <nav className="navbar navbar-expand navbar-dark orange nav-fit-content">
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/visitas"} className="nav-link">
              Visite
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/add"} className="nav-link">
              Add
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/visitas"]} component={VisitasList} />
          <Route exact path="/add" component={AddVisita} />
          <Route path="/visitas/:id" component={Visita} />
        </Switch>
      </div>
    </div>
    )
  }


}