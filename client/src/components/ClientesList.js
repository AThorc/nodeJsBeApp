import React, { useState, useEffect } from "react";
import ClienteDataService from "../services/ClienteService";
import { Link, useHistory } from "react-router-dom";

import AuthService from "../services/auth.service";

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchRagioneSociale, setSearchRagioneSociale] = useState("");

  const user = AuthService.getCurrentUser();
  const history = useHistory();

  useEffect(() => {
    if(user){
      retrieveClientes();
    }    
  }, []);


  const onChangeSearchRagioneSociale = e => {
    if(user){
      const searchRagioneSociale = e.target.value;
      setSearchRagioneSociale(searchRagioneSociale);
    }
  };

  const retrieveClientes = () => {
    if(user){
      ClienteDataService.getAll()
      .then(response => {
        setClientes(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const refreshList = () => {
    retrieveClientes();
    retrieveClientes();
    refreshSearchedList();
  };

  const refreshSearchedList = () => {    
    setCurrentCliente(null);
    setCurrentIndex(-1);
  };

  const setActiveCliente = (cliente, index) => {
    setCurrentCliente(cliente);
    setCurrentIndex(index);
  };

  const removeAllClientes = () => {
    if(user){
      ClienteDataService.removeAll()
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const findByRs = () => {
    if(user){
      ClienteDataService.findByRs(searchRagioneSociale)
      .then(response => {
        setClientes(response.data);
        console.log(response.data);
        refreshSearchedList();
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  
  function handleAggiungiClienteClick() {
    history.push("/addCliente");
  }


  if(user){
    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Cerca per ragione sociale"
              value={searchRagioneSociale}
              onChange={onChangeSearchRagioneSociale}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByRs}
              >
                Search
              </button>
              <button
              className="btn btn-success float-right"
              type="button"
              onClick={handleAggiungiClienteClick}
            >
              Aggiungi cliente
            </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Lista clienti</h4>
  
          <ul className="list-group">
            {clientes &&
              clientes.map((cliente, index) => (
                <li
                  className={
                    "list-group-item " + (index === currentIndex ? "active" : "")
                  }
                  onClick={() => setActiveCliente(cliente, index)}
                  key={index}
                >
                  {cliente.codiceFiscale}
                </li>
              ))}
          </ul>
          
          <button
            className="m-3 btn btn-sm btn-danger d-none"
            onClick={removeAllClientes}
          >
            Remove All
          </button>          
        </div>
        <div className="col-md-6">
          {currentCliente ? (
            <div>
              <h4>Cliente</h4>
              <div>
                <label>
                  <strong>Ragione sociale:</strong>
                </label>{" "}
                {currentCliente.ragioneSociale}
              </div>          
              <div>
                <label>
                  <strong>Codice fiscale:</strong>
                </label>{" "}
                {currentCliente.codiceFiscale}
              </div>
              <div>
                <label>
                  <strong>Partita IVA:</strong>
                </label>{" "}
                {currentCliente.partitaIVA}
              </div>           
  
              <Link
                to={"/clientes/" + currentCliente.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Cliente...</p>
            </div>
          )}
        </div>
      </div>
    );
  }else{
    return(
      <div>
        <br />
          <p>Effettua il login per vedere i clienti...</p>
      </div>
    );
  }
  
};

export default ClientesList;
