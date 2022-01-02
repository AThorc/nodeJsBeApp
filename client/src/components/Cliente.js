import React, { useState, useEffect } from "react";
import ClienteDataService from "../services/ClienteService";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";

import MacroservizioDataService from "../services/MacroservizioService";
import LegameDataService from "../services/LegameService";
import PartnerDataService from "../services/PartnerService";

import moment from 'moment'

const Cliente = props => {
  const initialClienteState = {
    id: null,
    codiceFiscale: "",
    partitaIVA: "",
    legaleRappresentate: "",
    telefono: "",
    cellulare: "",
    mail: "",
    pec: "",
    sede: "",
    localita: "",
    cap: "",
    ragioneSociale: "",
    dataCostituzione: "",
    inizioAttivita: "",
    tipo: "",
    dimensione: "",
    attIstatAteco2007: "",
    settore: ""
  };
  const [currentCliente, setCurrentCliente] = useState(initialClienteState);
  const [message, setMessage] = useState("");

  const user = AuthService.getCurrentUser();

  const [macroservizi, setMacroservizi] = useState([]);
  const [currentMacroservizio, setCurrentMacroservizio] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [partnersLegame, setPartnersLegame] = useState([]);
  const [currentListaLegameMacroservizio, setCurrentListaLegameMacroservizio] = useState(null);

  var partnersExecuted = [];


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

  const setActiveMacroservizio = (macroservizio, index) => {
    setCurrentMacroservizio(macroservizio);
    setCurrentIndex(index);
    retrieveLegami(macroservizio.id, currentCliente.id);
  };

  const getCliente = id => {
    if(user){
      ClienteDataService.get(id)
      .then(response => {
        setCurrentCliente(response.data);
        console.log(response.data);
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

  const addPartnerLegame = (newPartnerLegame) => setPartnersLegame(state => [...state, newPartnerLegame]);
  
  const retrieveLegami = (servizioid, clienteid) => {
    if(user){
      setPartnersLegame([]);
      LegameDataService.findByServizioIdClienteId(servizioid, clienteid)
      .then(response => {
        setCurrentListaLegameMacroservizio(response.data);
        console.log(response.data);
        for(const i in response.data){
          var legame = response.data[i];
          getPartner(legame.partnerid);
        }            
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  useEffect(() => {
    getCliente(props.match.params.id);
    retrieveMacroservizi();
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentCliente({ ...currentCliente, [name]: value });
  };  

  const updateCliente = () => {
    if(user){
      ClienteDataService.update(currentCliente.id, currentCliente)
      .then(response => {
        console.log(response.data);
        setMessage("The cliente was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
    }
   
  };

  const deleteCliente = () => {
    if(user){
      ClienteDataService.remove(currentCliente.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/anagrafica");
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  if(user){
    return (
      <div>
        {currentCliente ? (
          <div className="edit-anagrafica-form">
            <h4>Cliente</h4>
            <form>
              <div className="table-responsive text-nowrap">
                <table className="table w-auto">
                  <thead>
                    <tr>
                      <th scope="col">Ragione sociale</th>
                      <th scope="col">Codice fiscale</th>
                      <th scope="col">Partita IVA</th>
                      <th scope="col">Legale Rappresentate</th>
                      <th scope="col">Telefono</th>
                      <th scope="col">Cellulare</th>
                      <th scope="col">Mail</th>
                      <th scope="col">Pec</th>
                      <th scope="col">Sede</th>
                      <th scope="col">Località</th>
                      <th scope="col">Cap</th>
                      <th scope="col">Data costituzione</th>
                      <th scope="col">Inizio Attività</th>
                      <th scope="col">Tipo</th>
                      <th scope="col">Dimensione</th>
                      <th scope="col">Att. Istat Ateco 2007</th>
                      <th scope="col">Settore</th>					  
                    </tr>
                  </thead>
                  <tbody>
                    <tr>                    
                      <td> 
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="ragioneSociale"
                          required
                          value={currentCliente.ragioneSociale}
                          onChange={handleInputChange}
                          name="ragioneSociale"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="codiceFiscale"
                          required
                          value={currentCliente.codiceFiscale}
                          onChange={handleInputChange}
                          name="codiceFiscale"
                          maxLength="27" size="27"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="partitaIVA"
                          required
                          value={currentCliente.partitaIVA}
                          onChange={handleInputChange}
                          name="partitaIVA"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="legaleRappresentate"                
                          value={currentCliente.legaleRappresentate}
                          onChange={handleInputChange}
                          name="legaleRappresentate"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="telefono"                
                          value={currentCliente.telefono}
                          onChange={handleInputChange}
                          name="telefono"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="cellulare"                
                          value={currentCliente.cellulare}
                          onChange={handleInputChange}
                          name="cellulare"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="mail"                
                          value={currentCliente.mail}
                          onChange={handleInputChange}
                          name="mail"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="pec"                
                          value={currentCliente.pec}
                          onChange={handleInputChange}
                          name="pec"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="sede"                
                          value={currentCliente.sede}
                          onChange={handleInputChange}
                          name="sede"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="localita"                
                          value={currentCliente.localita}
                          onChange={handleInputChange}
                          name="localita"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="cap"                
                          value={currentCliente.cap}
                          onChange={handleInputChange}
                          name="cap"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control fit-content"
                          id="dataCostituzione"                
                          value={moment(currentCliente.dataCostituzione).format('YYYY-MM-DD')}                
                          onChange={handleInputChange}
                          name="dataCostituzione"
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control fit-content"
                          id="inizioAttivita"                
                          value={moment(currentCliente.inizioAttivita).format('YYYY-MM-DD')}                
                          onChange={handleInputChange}
                          name="inizioAttivita"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="tipo"
                          required
                          value={currentCliente.tipo}
                          onChange={handleInputChange}
                          name="tipo"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="dimensione"
                          required
                          value={currentCliente.dimensione}
                          onChange={handleInputChange}
                          name="dimensione"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="attIstatAteco2007"
                          required
                          value={currentCliente.attIstatAteco2007}
                          onChange={handleInputChange}
                          name="attIstatAteco2007"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control fit-content"
                          id="settore"
                          required
                          value={currentCliente.settore}
                          onChange={handleInputChange}
                          name="settore"
                        />
                      </td>
                    </tr>                   
                  </tbody>
                </table>
              </div>
            </form>    

            <br></br>      
  
            <ConfirmDialog 
              title= 'Cancella'
              message= 'Sei sicuro di voler cancellare il cliente?'
              onClickYes= {deleteCliente}
              className="btn btn-danger"
            />

            <button className="badge badge-danger mr-2 d-none" onClick={deleteCliente}>
              Cancella
            </button>
  
            <button
              type="submit"
              className="btn btn-primary"
              onClick={updateCliente}
            >
              Aggiorna
            </button>
            <p>{message}</p>

            <br></br>
            <div>
              <div className="half1">
                <h4>Lista macroservizi</h4>
        
                <ul className="list-group percent-max-content">
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
              </div>   

              {currentListaLegameMacroservizio && currentListaLegameMacroservizio.length > 0 ? (
                  <div className="half2">            
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
                                {currentCliente.ragioneSociale}             
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
                          
                  </div>
                ):(<div>
              </div>
            )}


            </div>
            

          </div>
        ) : (
          <div>
            <br />
            <p>Seleziona un cliente...</p>
          </div>
        )}
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

export default Cliente;
