import React, { useState, useEffect } from "react";
import ClienteDataService from "../services/ClienteService";
import ServizioDataService from "../services/ServizioService";
import { Link, useHistory } from "react-router-dom";

import AuthService from "../services/auth.service";

import moment from 'moment';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchRagioneSociale, setSearchRagioneSociale] = useState("");

  const [servizios, setServizios] = useState([]);
  const [currentServizio, setCurrentServizio] = useState(null);
  const [currentServizioIndex, setCurrentServizioIndex] = useState(-1);

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

  const setActiveServizio = (servizio, index) => {
    setCurrentServizio(servizio);
    setCurrentServizioIndex(index);
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


  const removeAllServizios = () => {
    if(user){
      ServizioDataService.removeAll()
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


  function handleAggiungiMacroservizioClick() {
    history.push("/addMacroservizio");
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
                Cerca
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
            <div className="anagrafica-cliente-container">
              <h4>Cliente</h4>
              <div className="anagrafica-cliente-container">
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Ragione sociale:</strong>
                  </label>{" "}
                  <Link
                    to={"/clientes/" + currentCliente.id}
                    className="badge badge-warning"
                  >
                    {currentCliente.ragioneSociale}
                  </Link>                
                </div>          
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Codice fiscale:</strong>
                  </label>{" "}
                  {currentCliente.codiceFiscale}
                </div>
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Partita IVA:</strong>
                  </label>{" "}
                  {currentCliente.partitaIVA}
                </div>                
              </div>

              <div className="anagrafica-cliente-container">
              <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Legale rappresentante:</strong>
                  </label>{" "}
                  {currentCliente.legaleRappresentate}
                </div>                
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Telefono:</strong>
                  </label>{" "}
                    {currentCliente.telefono}
                </div>          
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Cellulare:</strong>
                  </label>{" "}
                  {currentCliente.cellulare}
                </div>
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Mail:</strong>
                  </label>{" "}
                  {currentCliente.mail}
                </div>               
              </div>    

              <div className="anagrafica-cliente-container">
              <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Pec:</strong>
                  </label>{" "}
                  {currentCliente.pec}
                </div>       
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Sede:</strong>
                  </label>{" "}
                  {currentCliente.sede}
                </div>
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Località:</strong>
                  </label>{" "}
                  {currentCliente.localita}
                </div>
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Cap:</strong>
                  </label>{" "}
                  {currentCliente.cap}
                </div>
              </div>      

              <div className="anagrafica-cliente-container">
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Data costituzione:</strong>
                  </label>{" "}
                  {moment(currentCliente.dataCostituzione).format('YYYY-MM-DD')} 
                </div>          
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Inizio attività:</strong>
                  </label>{" "}                  
                  {moment(currentCliente.inizioAttivita).format('YYYY-MM-DD')} 
                </div>
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Tipo:</strong>
                  </label>{" "}
                  {currentCliente.tipo}
                </div>
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Dimensione:</strong>
                  </label>{" "}
                  {currentCliente.dimensione}
                </div>
              </div>   

              
              <div className="anagrafica-cliente-container">
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Att Istat Ateco 2007:</strong>
                  </label>{" "}
                  {currentCliente.attIstatAteco2007} 
                </div>          
                <div className="attribute-anagrafica-cliente">
                  <label>
                    <strong>Settore:</strong>
                  </label>{" "}                  
                  {currentCliente.settore} 
                </div>               
              </div>                      

            </div>            

          ) : (
            <div>
              <br />
              <p>Seleziona un Cliente...</p>
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
