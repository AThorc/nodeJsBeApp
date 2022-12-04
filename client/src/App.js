import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import svg from "./images/multifinance-svg.svg"

import moment from 'moment'

/*
import AddTutorial from "./components/AddTutorial";
import Tutorial from "./components/Tutorial";
import TutorialsList from "./components/TutorialsList";
*/

import AuthService from "./services/auth.service";

import Login from "./components/login.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import Profile from "./components/profile.component";
import ChangePsw from "./components/changePsw.component";
//import BoardUser from "./components/board-user.component";
//import BoardUser from "./components/VisitasList";
import BoardUser from "./components/ClientesList";
import BoardModerator from "./components/board-moderator.component";
import BoardAdmin from "./components/board-admin.component";

import AddCliente from "./components/AddCliente";
import Cliente from "./components/Cliente";


import PartnerList from "./components/PartnersList";
import AddPartner from "./components/AddPartner";
import Partner from "./components/Partner";


import MacroserviziList from "./components/MacroserviziList";
import AddMacroservizio from "./components/AddMacroservizio";
import Macroservizio from "./components/Macroservizio";


import AddVisita from "./components/AddVisita";
import Visita from "./components/Visita";
import AssociaServizio from "./components/AssociaServizio";

import InserisciServizio from "./components/InserisciServizio";

import ApexChart from "./components/Statistiche";

import ModificaDataService from "./services/ModificaService";

import Scadenziario from "./components/Scadenziario";

require('dotenv').config();

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
      modifiche: [],
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    ModificaDataService.getAll().then(response => {
      this.setState({
        modifiche: response.data.sort((a,b) => {
            return new Date(a.data).getTime() - 
                new Date(b.data).getTime()
        }).reverse(),
      });
    })
    .catch(e => {
      console.log(e);
    });

    if (user) {
      this.setState({
        currentUser: user,
        showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
        showAdminBoard: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard,  modifiche} = this.state;
    console.log('modifiche');
    console.log(modifiche);

    return (
      <div>
        <nav className="navbar navbar-expand-md navbar-dark orange">
          <Link to={"/"} className="navbar-brand">
          <img src={svg} className="img-fluid" alt="Metodo Multifinance"/>
          </Link>

         
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navCollaps">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navCollaps">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to={"/home"} className="nav-link">
                  Home
                </Link>
              </li>

              {/* {showModeratorBoard && (
                <li className="nav-item">
                  <Link to={"/mod"} className="nav-link">
                    Moderator Board
                  </Link>
                </li>
              )} */}

              {/* {showAdminBoard && (
                <li className="nav-item ">
                  <Link to={"/admin"} className="nav-link">
                    Admin Board
                  </Link>
                </li>
              )} */}

              {currentUser && (
                <li className="nav-item ">
                  <Link to={"/anagrafica"} className="nav-link">
                    Anagrafica
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item">
                  <Link to={"/listaPartner"} className="nav-link">
                    Partners
                  </Link>
                </li>
              )}

              {currentUser && (
                <li className="nav-item ">
                  <Link to={"/listaMacroservizi"} className="nav-link">
                    Macroservizi
                  </Link>
                </li>
              )}
                

            {currentUser && (
                <li className="nav-item ">
                  <Link to={"/statistiche"} className="nav-link">
                    Statistiche
                  </Link>
                </li>
              )}

            {currentUser && (
                <li className="nav-item ">
                  <Link to={"/scadenziario"} className="nav-link">
                    Scadenziario
                  </Link>
                </li>
              )}

            </ul>  

            {currentUser ? (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  {/* <Link to={"/profile"} className="nav-link">
                    {currentUser.username}
                  </Link> */}
                  <div className="nav-link name-user">{currentUser.username}</div>
                </li>
                <li className="nav-item">
                  <Link to={"/changePsw"} className="nav-link">
                    Cambia password
                  </Link>
                </li>
                <li className="nav-item">
                  <a href="/login" className="nav-link" onClick={this.logOut}>
                    LogOut
                  </a>
                </li>
              </div>
            ) : (
              <div className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </div>
            )}
          </div>
          
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />            
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />            
            <Route path="/anagrafica" component={BoardUser} />
            <Route path="/anagrafica/:clienteid" component={BoardUser} />
            <Route path="/mod" component={BoardModerator} />
            <Route path="/admin" component={BoardAdmin} />
            <Route exact path="/addVisita" component={AddVisita} />
            <Route path="/visitas/:id" component={Visita} />
            <Route exact path="/addCliente" component={AddCliente} />
            <Route path="/clientes/:id" component={Cliente} />
            <Route path="/listaPartner" component={PartnerList} />
            <Route exact path="/addPartner" component={AddPartner} />
            <Route path="/partners/:id" component={Partner} />
            <Route path="/listaMacroservizi" component={MacroserviziList} />
            <Route exact path="/addMacroservizio" component={AddMacroservizio} />
            <Route path="/macroservizios/:id" component={Macroservizio} />
            <Route exact path="/associaServizio/:id" component={AssociaServizio} />
            <Route exact path="/inserisciServizio/:id/:clienteid" component={InserisciServizio} />
            <Route exact path="/statistiche" component={ApexChart} />
            <Route exact path="/scadenziario" component={Scadenziario} />

          </Switch>
        </div>
        <div className="container mt-3 center-login">
          <Route exact path="/login" component={Login} />
          <Route exact path="/changePsw" component={ChangePsw} />
        </div>
        <div className="right-corner">
          {currentUser && modifiche && modifiche.length > 0 && (
              <h6>Ultima modifica di: {modifiche[0].username}, in data: {moment(modifiche[0].data).format('YYYY-MM-DD HH:mm:ss')} </h6>
          )}
        </div>

      </div>
    );
  }
}

export default App;
