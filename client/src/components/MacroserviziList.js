import React, { useState, useEffect } from "react";
import MacroservizioDataService from "../services/MacroservizioService";
import ClienteDataService from "../services/ClienteService";
import { Link, useHistory } from "react-router-dom";

import moment from 'moment'

import AuthService from "../services/auth.service";

const MacroserviziList = () => {
  const [macroservizi, setMacroservizi] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [currentMacroservizio, setCurrentMacroservizio] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchDenominazione, setSearchDenominazione] = useState("");

  //var ragioneSociale = [];


  const user = AuthService.getCurrentUser();
  const history = useHistory();

  useEffect(() => {
    if(user){
      retrieveMacroservizi();
    }    
  }, []);


  const onChangeSearchDenominazione = e => {
    if(user){
      const searchDenominazione = e.target.value;
      setSearchDenominazione(searchDenominazione);
    }
  };

  const retrieveMacroservizi = () => {
    if(user){
      MacroservizioDataService.getAll()
      .then(response => {
        setMacroservizi(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const refreshList = () => {
    retrieveMacroservizi();
    refreshSearchedList();
  };

  const refreshSearchedList = () => {    
    setCurrentMacroservizio(null);
    setCurrentIndex(-1);
  };

  const setActiveMacroservizio = (macroservizio, index) => {
    setCurrentMacroservizio(macroservizio);
    setCurrentIndex(index);
   
    //Sbianco i clienti dal macroservizio
    //setClientes([]);

    //Riempio i clienti
    //findClientesByMacroservizioId(macroservizio.id);
    /*for(const id in macroservizio.clientes){
      findRsById(macroservizio.clientes[id]);
    }*/
  };

  const removeAllMacroservizi = () => {
    if(user){
      MacroservizioDataService.removeAll()
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const findByDen = () => {
    if(user){
      MacroservizioDataService.findByDen(searchDenominazione)
      .then(response => {
        setMacroservizi(response.data);
        console.log(response.data);
        refreshSearchedList();
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };


  /*
  const findClientesByMacroservizioId = (macroservizioId) => {
    if(user){
      ClienteDataService.findByMacroservizi(macroservizioId)
      .then(response => {        
        setClientes(response.data);
        console.log('**');
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  */

  /*
  function setRagioneSociale(id, ragioneSociale){
    if(!ragioneSocialeById.hasOwnProperty(id)){
      ragioneSociale[id] = ragioneSociale;
    } 
  }
  */

  /*
  function setRsById(id, ragioneSociale){
    if(!rsById.hasOwnProperty(id)){
      rsById[id] = ragioneSociale;
    }    
  }*/

  
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
              placeholder="Cerca per denominazione"
              value={searchDenominazione}
              onChange={onChangeSearchDenominazione}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByDen}
              >
                Search
              </button>
              <button
              className="btn btn-success float-right"
              type="button"
              onClick={handleAggiungiMacroservizioClick}
            >
              Aggiungi macroservizio
            </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Lista macroservizi</h4>
  
          <ul className="list-group">
            {macroservizi &&
              macroservizi.map((macroservizio, index) => (
                <li
                  className={
                    "list-group-item " + (index === currentIndex ? "active" : "")
                  }
                  onClick={() => setActiveMacroservizio(macroservizio, index)}
                  key={index}
                >
                  {macroservizio.servizi}
                </li>
              ))}
          </ul>
          
          <button
            className="m-3 btn btn-sm btn-danger d-none"
            onClick={removeAllMacroservizi}
          >
            Remove All
          </button>          
        </div>
        <div className="col-md-6">
          {currentMacroservizio ? (
            <div>
              <h4>Macroservizio</h4>
              <div>
                <label>
                  <strong>Servizi:</strong>
                </label>{" "}
                <Link
                  to={"/macroservizios/" + currentMacroservizio.id}
                  className="badge badge-warning"
                >
                  {currentMacroservizio.servizi}
                </Link>                
              </div>

              <div>
                <label>
                  <strong>Data inizio:</strong>
                </label>{" "}
                {moment(currentMacroservizio.dataInizio).format('YYYY-MM-DD')}
              </div>
              <div>
                <label>
                  <strong>Fatturato macroservizio:</strong>
                </label>{" "}
                {currentMacroservizio.fatturato}
              </div>                    

            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Macroservizio...</p>
            </div>
          )}
        </div>
      </div>
    );
  }else{
    return(
      <div>
        <br />
          <p>Effettua il login per vedere i macroservizi...</p>
      </div>
    );
  }
  
};

export default MacroserviziList;
