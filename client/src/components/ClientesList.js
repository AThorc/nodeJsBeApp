import React, { useState, useEffect } from "react";
import ClienteDataService from "../services/ClienteService";
import RagioneSocialeDataService from "../services/RagioneSocialeService";
import { Link } from "react-router-dom";

import AuthService from "../services/auth.service";

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchCodiceFiscale, setSearchCodiceFiscale] = useState("");
  const [searchDenominazioneRS, setSearchDenominazioneRS] = useState("");

  const user = AuthService.getCurrentUser();

  useEffect(() => {
    if(user){
      retrieveClientes();
    }    
  }, []);

  const onChangeSearchCodiceFiscale = e => {
    if(user){
      const searchCodiceFiscale = e.target.value;
      setSearchCodiceFiscale(searchCodiceFiscale);
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

  const retrieveDenominazioneRS = (rsId) => {
    if(user){
      RagioneSocialeDataService.get(rsId)
      .then(response => {        
        setSearchDenominazioneRS(response.data.denominazione);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
  };

  const refreshList = () => {
    retrieveClientes();
    setCurrentCliente(null);
    setCurrentIndex(-1);
  };

  const setActiveCliente = (cliente, index) => {
    setCurrentCliente(cliente);
    setCurrentIndex(index);
    retrieveDenominazioneRS(cliente.ragioneSocialeid);
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

  const findByCodiceFiscale = () => {
    if(user){
      ClienteDataService.findByCodiceFiscale(searchCodiceFiscale)
      .then(response => {
        setClientes(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  if(user){
    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by codice fiscale"
              value={searchCodiceFiscale}
              onChange={onChangeSearchCodiceFiscale}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByCodiceFiscale}
              >
                Search
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
            className="m-3 btn btn-sm btn-danger"
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
                {searchDenominazioneRS}
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
