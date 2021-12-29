import React, { useState, useEffect } from "react";
import MacroservizioDataService from "../services/MacroservizioService";
import ClienteDataService from "../services/ClienteService";
import LegameDataService from "../services/LegameService";
import PartnerDataService from "../services/PartnerService";

import { Link, useHistory } from "react-router-dom";

import moment from 'moment'

import AuthService from "../services/auth.service";

const MacroserviziList = () => {
  const [macroservizi, setMacroservizi] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [currentMacroservizio, setCurrentMacroservizio] = useState(null);
  const [currentListaLegameMacroservizio, setCurrentListaLegameMacroservizio] = useState(null);

  const [clientesLegame, setClientesLegame] = useState([]);
  const [partnersLegame, setPartnersLegame] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchDenominazione, setSearchDenominazione] = useState("");

  //var ragioneSociale = [];


  const user = AuthService.getCurrentUser();
  const history = useHistory();


  var clientesExecuted = [];
  var partnersExecuted = [];

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
    setCurrentListaLegameMacroservizio(null);
  };

  const addClienteLegame = (newClienteLegame) => setClientesLegame(state => [...state, newClienteLegame]);
  const addPartnerLegame = (newPartnerLegame) => setPartnersLegame(state => [...state, newPartnerLegame]);
  //const addClienteExecuted = (newClienteExecuted) => setClientesExecuted(state => [...state, newClienteExecuted]);

  const getCliente = id => {
    console.log('exec');
    console.log(clientesExecuted);
    if(user && !clientesExecuted.includes(id)){
      clientesExecuted.push(id);
      ClienteDataService.get(id)
      .then(response => {
        addClienteLegame(response.data.id + '-' + response.data.ragioneSociale);
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  const getPartner = id => {
    if(user && !partnersExecuted.includes(id)){
      partnersExecuted.push(id);
      PartnerDataService.get(id)
      .then(response => {
        if(!partnersLegame.includes(response.data.id + '-' + response.data.denominazione))
          addPartnerLegame(response.data.id + '-' + response.data.denominazione);       
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };


  const retrieveLegami = servizioid => {
    if(user){
      LegameDataService.findByServizioId(servizioid)
      .then(response => {
        setCurrentListaLegameMacroservizio(response.data);
        console.log(response.data);
        for(const i in response.data){
          var legame = response.data[i];
          getCliente(legame.clienteid);
          getPartner(legame.partnerid);
        }            
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const setActiveMacroservizio = (macroservizio, index) => {
    setCurrentMacroservizio(macroservizio);
    setCurrentIndex(index);
    
    setCurrentListaLegameMacroservizio(null);
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
  function rsReturned(input){
    console.log(input);
    var index = input.indexOf('-');
    console.log(index);
    return input.substr(index);
  }
  */
  


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

  function handleAssociaServizioClick(macroservizio) {
    history.push("/associaServizio/"+macroservizio.id);
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
              <div>
                <h4 className="macroservizio-label">Macroservizio 
                  <button
                  className="btn btn-success float-right"
                  type="button"
                  onClick={() => handleAssociaServizioClick(currentMacroservizio)}
                  >
                  Associa servizio
                  </button>
                  <button
                  className="btn btn-warning float-right"
                  type="button"
                  onClick={() => retrieveLegami(currentMacroservizio.id)}
                  >
                  Lista legami servizi
                  </button>
                </h4>                
              </div>
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

        {currentListaLegameMacroservizio ? (
          <div className="input-group mb-3">
            <div className="col-md-12">
              <h4>Lista legami servizi</h4>
      
              <ul className="list-group">
                {currentListaLegameMacroservizio &&
                  currentListaLegameMacroservizio.map((legame, index) => (
                    <li key={index}>
                      <div>
                        <label className="inline-block">
                          <strong>Tipologia servizio:</strong>
                        </label>{" "}
                        {legame.tipo}
                      </div>
                      <div>
                          <label className="inline-block">
                            <strong>Cliente:</strong>
                          </label>{" "}
                          {clientesLegame.filter(cliente => cliente.includes(legame.clienteid)).toString().substring(clientesLegame.filter(cliente => cliente.includes(legame.clienteid)).toString().indexOf('-')+1)}             
                      </div>
                      <div>
                          <label className="inline-block">
                            <strong>Partner:</strong>
                          </label>{" "}
                          {partnersLegame.filter(partner => partner.includes(legame.partnerid)).toString().substring(partnersLegame.filter(partner => partner.includes(legame.partnerid)).toString().indexOf('-')+1)}             
                      </div>
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
          </div>
          ):(<div>
        </div>
        )}

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
