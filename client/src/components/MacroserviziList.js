import React, { useState, useEffect } from "react";
import MacroservizioDataService from "../services/MacroservizioService";
import ClienteDataService from "../services/ClienteService";
import LegameDataService from "../services/LegameService";
import PartnerDataService from "../services/PartnerService";

import { Link, useHistory } from "react-router-dom";

import moment from 'moment'

import AuthService from "../services/auth.service";

import exportFromJSON from 'export-from-json';

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
  const showAdminBoard = user.roles.includes("ROLE_ADMIN");
  const history = useHistory();


  var clientesExecuted = [];
  var partnersExecuted = [];

  var clientiMacroservizio = [];

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
          addPartnerLegame(response.data.id + '-' + response.data.denominazione);       
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };


  const retrieveLegami = servizioid => {
    if(user){
      setClientesLegame([]);
      setPartnersLegame([]);
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
    if(user && showAdminBoard){
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

  function handleAggiungiMacroservizioClick() {
    history.push("/addMacroservizio");
  }

  function handleAssociaServizioClick(macroservizio) {
    history.push("/associaServizio/"+macroservizio.id);
  }


  function getMacroservizioName(macroservizioid){
    for(var i in macroservizi){
      var m = macroservizi[i];
      if(macroservizioid == macroservizi[i].id){
        return m.servizi;
      }
    }
  }


  function retrieveLegamiByMacroServizioForExcel(macroservizioid, promises, ultimoMacroservizio){
    var promise = new Promise( (resolve, reject) => {
      LegameDataService.findByServizioId(macroservizioid)
      .then(response => {
        console.log('LEGAMI PER macroservizio:');
        console.log(response.data);
        //geClientiByLegameExcel(this, partnerid, response.data, promises);

        //SE NON CI SONO LEGAMI PER QUEL PARTNER VADO AVANTI E RISOLVO LA PROMISE
        if(response.data.length == 0){
          resolve("Promise retrieveLegamiByMacroServizioForExcel resolved successfully, 0 legami found");  
        }

        for(const i in response.data){
          var legame = response.data[i];
          //promises.push(getClienteExcel(promise, partnerid, legame.clienteid));

          ClienteDataService.get(legame.clienteid)
          .then(response => {
            console.log(response.data);
            if(!clientiMacroservizio.hasOwnProperty(macroservizioid)){
              clientiMacroservizio[macroservizioid] = [];
              clientiMacroservizio[macroservizioid].push(response.data);
              console.log('CLIENTI PER macroservizio PRIMO IF:');
              console.log(clientiMacroservizio);
            }else{
              var clienteExists = clientiMacroservizio[macroservizioid].some(cliente => cliente.codiceFiscale === response.data.codiceFiscale);
              if(!clienteExists) {
                clientiMacroservizio[macroservizioid].push(response.data);
                console.log('CLIENTI PER macroservizio ELSE:');
                console.log(clientiMacroservizio);       
              }
      
            }
            //SONO ALL'ULTIMO FOR DEL LEGAME dell'ultimo partner
            if(ultimoMacroservizio && !response.data[i+1])
            resolve("Promise retrieveLegamiByMacroServizioForExcel resolved successfully");            
          })
          .catch(e => {
            console.log(e);
            reject(Error("Promise rejected"));
          });
              
        }




        ////resolve("Promise findByPartnerId resolved successfully");
      })
      .catch(e => {
        console.log(e);
        reject(Error("Promise rejected"));
      });

    });
    //promise.then(result => console.log('LegameDataService.findByPartnerId then method'));
    promises.push(promise);
    console.log('PROMISES:');
    console.log(promises);

  };



  //FORMATTA PER LISTA CLIENTI PER MACRO SERVIZIO
  function handleEsportaClientiPerMacroServizioClick(){    
    var promises = [];
    for(var i in macroservizi){
      var macroservizio = macroservizi[i];
      var ultimoMacroServizio = !macroservizio[i+1]?true:false;
      retrieveLegamiByMacroServizioForExcel(macroservizio.id, promises, ultimoMacroServizio);
    }
    Promise.all(promises).then((values) => {
      var data =[];
      console.log('DENTRO LA VALORIZZAZIONE promises');
      console.log(promises);
      console.log(clientiMacroservizio);
      console.log(values);
      console.log('FINE VALORIZZAZIONE promises');
      for(var mid in clientiMacroservizio){
        var mName = getMacroservizioName(mid);
        for(var j in clientiMacroservizio[mid]){
          var cliente = clientiMacroservizio[mid][j];
          var record = Object.assign({}, cliente);

          // ADD IN CERTAIN POSITION
          var keyValues = Object.entries(record); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
          keyValues.splice(0,0, ["MacroServizioName", mName]); // insert key value at the index you want like 1.
          var newRecord = Object.fromEntries(keyValues) // convert key values to obj {key1: "value1", newKey: "newValue", key2: "value2"}

          delete newRecord.ragioneSocialeid;
          delete newRecord.createdAt;
          delete newRecord.updatedAt;
          delete newRecord.partners;
          delete newRecord.userid;
          delete newRecord.username;
          delete newRecord.username;
          delete newRecord.id;
          newRecord.dataCostituzione = new Date(newRecord.dataCostituzione).toLocaleDateString("en-GB");
          newRecord.inizioAttivita = new Date(newRecord.inizioAttivita).toLocaleDateString("en-GB");


          data.push(newRecord);
          console.log('DENTRO LA VALORIZZAZIONE DATA');
          console.log(data);

        }        
      }
      const fileName = 'listaClientiPerMacroservizio';
      const exportType =  exportFromJSON.types.xls;
      exportFromJSON({ data, fileName, exportType });

    });
  }



  if(user){
    return (
      <div className="list row">
        <div>
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
                Cerca
              </button>
              <button
              className={"btn btn-success float-right " + (!showAdminBoard ? "d-none" : "")}
              type="button"
              onClick={handleAggiungiMacroservizioClick}
            >
              Aggiungi macroservizio
            </button>
            <button
              className={"btn btn-primary float-right "}
              type="button"
              onClick={handleEsportaClientiPerMacroServizioClick}
            >
              Esporta lista clienti macroservizi
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
                <h4 className="macroservizio-label">Macroservizio</h4>              
              </div>

              <div>
                <label>
                  <strong>Servizi:</strong>
                </label>{" "}
                {showAdminBoard ? (
                  <Link
                    to={"/macroservizios/" + currentMacroservizio.id}
                    className="badge badge-warning"
                  >
                    {currentMacroservizio.servizi}
                  </Link> 
                  ) : (
                    currentMacroservizio.servizi
                  )
                }               
              </div>
                           
            </div>
          ) : (
            <div>
              <br />
              <p>Seleziona un Macroservizio...</p>
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
