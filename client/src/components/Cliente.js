import React, { useState, useEffect } from "react";
import ClienteDataService from "../services/ClienteService";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";

import MacroservizioDataService from "../services/MacroservizioService";
import LegameDataService from "../services/LegameService";
import PartnerDataService from "../services/PartnerService";

import {BsPlusLg} from "react-icons/bs"

import { Link, useHistory } from "react-router-dom";

import moment from 'moment';

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

  const [partnersFatturatoLegame, setPartnersFatturatoLegame] = useState([]);

  const history = useHistory();

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
          console.log('FATTURATO PARTNET');
          console.log(response.data.id + '-' + response.data.fatturatoPartner);
          addPartnerFatturatoLegame(response.data.id + '-' + response.data.fatturatoPartner);   
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  const addPartnerLegame = (newPartnerLegame) => setPartnersLegame(state => [...state, newPartnerLegame]);
  const addPartnerFatturatoLegame = (newPartnerFatturatoLegame) => setPartnersFatturatoLegame(state => [...state, newPartnerFatturatoLegame]);
  
  const retrieveLegami = (servizioid, clienteid) => {
    if(user){
      setPartnersLegame([]);
      setPartnersFatturatoLegame([]);
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

  const initCap = (text) => {
    return text.toLowerCase().charAt(0).toUpperCase()+(text.slice(1).toLowerCase());
  }

  function handleInserisciServizioClick(macroservizio,cliente, index) {
    setActiveMacroservizio(macroservizio, index);
    history.push("/inserisciServizio/"+macroservizio.id+"/"+cliente.id);
  }


  const renderTableHeader = () => {
    var header = Object.keys(currentListaLegameMacroservizio[0])
    header =  header.map((key, index) => {
       if(['clienteid', 'partnerid', 'tipo'].includes(key))
        return <th key={index}>{initCap(key).replace('id','')}</th>
    })
    header.push(<th key={4}>Data inizio</th>);
    header.push(<th key={5}>Fatturato Partner</th>);
    header.push(<th key={6}>Fatturato Società</th>);
    return header;
 };

  const renderTableData = () => {
    return currentListaLegameMacroservizio.map((legame, index) => {
      const { clienteid, createdAt, id, partnerid, servizioid, tipo, updatedAt, fatturatoPartner, fatturatoSocieta } = legame //destructuring
      return (
          <tr key={id}>
            <td>{currentCliente.ragioneSociale}</td>         
            <td>{partnersLegame.filter(partner => partner.includes(legame.partnerid)).toString().substring(partnersLegame.filter(partner => partner.includes(legame.partnerid)).toString().indexOf('-')+1)}</td>
            <td>{tipo}</td>
            <td>{moment(currentMacroservizio.dataInizio).format('YYYY-MM-DD')}</td>            
            <td>{fatturatoPartner}</td>
            <td>{fatturatoSocieta}</td>
          </tr>
      )
    })
  };

  if(user){
    return (
      <div>
        {currentCliente ? (
          <div className="edit-anagrafica-form">
            <h4>Lista macroservizi {currentCliente.ragioneSociale}</h4>           
            <div className="margin-top-2">
              <div className="half1">
        
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
                        <button 
                          className="margin-left-px btn btn-primary"
                          onClick={() => handleInserisciServizioClick(macroservizio, currentCliente, index)}
                        >
                          <BsPlusLg />
                        </button>                       
                      </li>
                      
                    ))}
                </ul>                                                        
              </div>              

              {currentListaLegameMacroservizio && currentListaLegameMacroservizio.length > 0 ? (
                <div className="half2 table-responsive text-nowrap">
                  <table id='servizi' className="table w-auto">
                    <tbody>
                        <tr>{renderTableHeader()}</tr>
                        {renderTableData()}
                    </tbody>
                  </table>
                </div> ):(<div>
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
