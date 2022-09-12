import React, { useState, useEffect } from "react";
import ClienteDataService from "../services/ClienteService";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";

import MacroservizioDataService from "../services/MacroservizioService";
import LegameDataService from "../services/LegameService";
import PartnerDataService from "../services/PartnerService";

import {BsPlusLg} from "react-icons/bs"
import {BsFillPencilFill} from "react-icons/bs"
import {BsXLg} from "react-icons/bs"
import {BsChatLeftTextFill} from "react-icons/bs"


import { Link, useHistory } from "react-router-dom";

import moment from 'moment';

import ModificaDataService from "../services/ModificaService";

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

  const tipologiaServizi = {
    "CONSULENZA AZIENDALE": ['Contabilità', 'Business Plan', 'Fiscale/Tributaria', 'Consulenza'],
    "CONSULENZA FINANZIARIA": ['Finanza Agevolata', 'Consulenza'],
    "CONSULENZA DEL LAVORO": ['Buste Paga', 'Consulenza'],
    "CONSULENZA LEGALE": ['Anatocismo', 'Controversie Commerciali', 'Consulenza'],
    "CONSULENZA DIREZIONALE": ['Anticorruzione/Antiriciclaggio', 'Certificazione di Qualità', 'Sicurezza sul lavoro', 'Privacy', 'Consulenza'],
  };

  const statoPraticaList = [ "In lavorazione",  "Erogata",  "Rifiutata"] ;

  const initialLegameState = {
    id: null,
    tipo: "",
    fatturatoPartner: undefined,
    fatturatoSocieta: undefined,
    dataInizio: undefined,
    note: "",
    acconto: undefined,
    saldo: undefined,
    totalePratica: undefined,
    incassato: undefined,
    compensoPartner: undefined,
    statoPratica: undefined

  };
  const [currentCliente, setCurrentCliente] = useState(initialClienteState);

  const [message, setMessage] = useState("");

  const user = AuthService.getCurrentUser();
  const showAdminBoard = user.roles.includes("ROLE_ADMIN");

  const [macroservizi, setMacroservizi] = useState([]);
  const [currentMacroservizio, setCurrentMacroservizio] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [partnersLegame, setPartnersLegame] = useState([]);
  const [currentListaLegameMacroservizio, setCurrentListaLegameMacroservizio] = useState(null);

  const [newTipoLegame, setNewTipoLegame] = useState(null);

  const [selectedStatoPratica, setSelectedStatoPratica] = useState(null);

  const [partnersFatturatoLegame, setPartnersFatturatoLegame] = useState([]);

  const [partners, setPartners] = useState([]);
  const [partner, setPartner] = useState({});

  const history = useHistory();

  var partnersExecuted = [];

  const [visualizzaNote, setVisualizzaNote] = useState(false);

  const [currentLegameNote, setCurrentLegameNote] = useState(initialLegameState);
  


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

  function getPartnersSelectBox(partners){
    var partnersOptions = [];
    for(const i in partners){
      var partner = partners[i];
      var partnerOption = { value: partner.id, label: partner.denominazione };
      partnersOptions.push(partnerOption);
    }
    return partnersOptions;
  };

  const retrievePartners = () => {
    if(user){
      PartnerDataService.getAll()
      .then(response => {
        var partnersOptions = getPartnersSelectBox(response.data);
        setPartners(partnersOptions);
        console.log(response.data);
        console.log(partnersOptions);
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
    setVisualizzaNote(false);
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
    retrievePartners();
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentCliente({ ...currentCliente, [name]: value });
  };

  const handleInputLegameNoteChange = event => {
    const { name, value } = event.target;
    setCurrentLegameNote({ ...currentLegameNote, [name]: value });
  };

  const handleInputLegameTipoChange = event => {
    const { name, value } = event.target;
    setNewTipoLegame(value);
  };


  const handleInputStatoPraticaChange = event => {
    const { name, value } = event.target;
    setSelectedStatoPratica(value);
  };

  const handleInputLegameChange = (event, index) => {
    const { name, value } = event.target;
    console.log('handleInputLegameChange');
    console.log(name);
    console.log(value);
    const newLegame = [ ...currentListaLegameMacroservizio];
    newLegame[index][name] = value;    
    setCurrentListaLegameMacroservizio(newLegame);    
  };

  const _handlePartnerChange = event => {
    const { value,} = event.target;
    console.log('PARTNER');
    console.log(value);
    //console.log(id);
    setPartner(value); 
  }; 

  const updateCliente = () => {
    if(user && showAdminBoard){
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
    if(user && showAdminBoard){
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
       //if(['clienteid', 'partnerid', 'tipo'].includes(key))
       if(['partnerid', 'tipo'].includes(key))
        return <th key={index}>{initCap(key).replace('id','')}</th>
    })
    header.push(<th key={3}>Stato Pratica</th>);
    header.push(<th key={4}>Data inizio</th>);
    header.push(<th key={5}>Totale Pratica</th>);
    header.push(<th key={6}>Incassato</th>);
    header.push(<th key={7}>Da Incassare</th>);
    header.push(<th key={8}>Compenso Partner</th>);
    header.push(<th key={9}>Netto</th>);
    // header.push(<th key={5}>Fatturato Partner</th>);
    // header.push(<th key={6}>Fatturato Multifinance</th>);
    // header.push(<th key={7}>Acconto</th>);
    // header.push(<th key={8}>Saldo</th>);
    header.push(<th key={10}>Azioni</th>);
    return header;
 };

 const renderTableNoteHeader = () => {
   var header = [];
   header.push(<th key={1}>Note</th>);
   return header;
 };

 const renderTableNoteData = () => {
  return (
    <tr key={1}>
      <td className="note-wrapper">
            <input
                    type="text"
                    className="form-control"
                    id="note"
                    required
                    value={currentLegameNote.note}
                    onChange={handleInputLegameNoteChange}
                    name="note"
                    disabled={!showAdminBoard}
                />
            </td>
    </tr>
  )
 };


 const getDenominazionePartner = partnerId =>{
   return partnersLegame.filter(partner => partner.includes(partnerId)).toString().substring(partnersLegame.filter(partner => partner.includes(partnerId)).toString().indexOf('-')+1)
 };

 

  const renderTableData = () => {
    return currentListaLegameMacroservizio.map((legame, index) => {
      //const { clienteid, createdAt, id, partnerid, servizioid, tipo, updatedAt, fatturatoPartner, fatturatoSocieta } = legame //destructuring
      return (          
          <tr key={legame.id}>                    
            <td>
                <select className="form-control" disabled={!showAdminBoard} defaultValue={legame.partnerid} onClick={_handlePartnerChange} onChange={_handlePartnerChange}>
                  <option value={legame.partnerid} disabled >{getDenominazionePartner(legame.partnerid)}</option>    
                    {partners &&
                      partners.map((partner, index) => (                  
                        
                          <option value={partner.value} key={index} >{partner.label}</option>                    
                      ))}
                </select>
            </td>
            {/* <td>
            <input
                    type="text"
                    className="form-control min-text-form-control"
                    id="tipo"
                    required
                    value={legame.tipo}
                    key={index}
                    onChange={(e) => handleInputLegameChange(e, index)}
                    name="tipo"
                    disabled={!showAdminBoard}
                />
            </td> */}

            <td>
                <select disabled={!showAdminBoard} className="form-control" defaultValue={legame.tipo} key={index} onClick={(e) => handleInputLegameTipoChange(e, index)} onChange={(e) => handleInputLegameTipoChange(e, index)}>
                  <option value={legame.tipo} disabled>{legame.tipo}</option>
                    {tipologiaServizi[currentMacroservizio.servizi] &&
                      tipologiaServizi[currentMacroservizio.servizi].map((tipo, index) => {
                          if(legame.tipo != tipo){
                            return(                  
                          
                              <option value={tipo} key={index} >{tipo}</option>                    
                            )
                          }                        
                        }
                      )}
                </select>
            </td>

{/* 
            <div className="form-group box">
              <label htmlFor="title">Tip. servizi</label>
              <select value={legame.tipo} defaultValue={'DEFAULT'} onClick={handleInputLegameChange} onChange={handleInputLegameChange}>
                <option value="" disabled value="DEFAULT">Seleziona un tipo</option>    
                {tipologiaServizi &&
                  tipologiaServizi.map((tipo, index) => (                  
                    
                      <option value={tipo} key={index} >{tipo}</option>                    
                  ))}
                </select>
            </div> */}

            <td>
              <select disabled={!showAdminBoard} className="form-control" defaultValue={legame.statoPratica?legame.statoPratica:''} key={index} onClick={(e) => handleInputStatoPraticaChange(e, index)} onChange={(e) => handleInputStatoPraticaChange(e, index)}>
                    <option value={legame.statoPratica?legame.statoPratica:''} disabled>{legame.statoPratica?legame.statoPratica:''}</option>
                      {statoPraticaList &&
                        statoPraticaList.map((stato, index) => {
                            if(legame.statoPratica != stato){
                              return(                  
                            
                                <option value={stato} key={index} >{stato}</option>                    
                              )
                            }                        
                          }
                        )}
                </select>
            </td> 
            <td>
              <input
                      type="date"
                      className="form-control"
                      id="dataInizio"
                      required
                      value={moment(legame.dataInizio).format('YYYY-MM-DD')} 
                      key={index}
                      onChange={(e) => handleInputLegameChange(e, index)}
                      name="dataInizio"
                      disabled={!showAdminBoard}
                  />
            </td>
            <td>
              <input
                      type="number"
                      className="form-control"
                      id="totalePratica"
                      required
                      value={legame.totalePratica}
                      key={index}
                      onChange={(e) => handleInputLegameChange(e, index)}
                      name="totalePratica"
                      maxLength="9"
                      disabled={!showAdminBoard}
                />
            </td>
            <td>
              <input
                      type="number"
                      className="form-control"
                      id="incassato"
                      required
                      value={legame.incassato}
                      key={index}
                      onChange={(e) => handleInputLegameChange(e, index)}
                      name="incassato"
                      maxLength="9"
                      disabled={!showAdminBoard}
                />
            </td>
            <td>
              <input
                      type="number"
                      className="form-control"
                      id="daIncassare"
                      required
                      value={legame.totalePratica - legame.incassato}
                      key={index}
                      onChange={(e) => handleInputLegameChange(e, index)}
                      name="daIncassare"
                      maxLength="9"
                      disabled="true"
                />
            </td>

            <td>
              <input
                      type="number"
                      className="form-control"
                      id="compensoPartner"
                      required
                      value={legame.compensoPartner}
                      key={index}
                      onChange={(e) => handleInputLegameChange(e, index)}
                      name="compensoPartner"
                      maxLength="9"
                      disabled={!showAdminBoard}
                />
            </td>
            <td>
              <input
                      type="number"
                      className="form-control"
                      id="netto"
                      required
                      value={legame.totalePratica - legame.compensoPartner}
                      key={index}
                      onChange={(e) => handleInputLegameChange(e, index)}
                      name="netto"
                      maxLength="9"
                      disabled="true"
                />
            </td>  

            {/* <td>
              <input
                    type="number"
                    className="form-control"
                    id="fatturatoPartner"
                    required
                    value={legame.fatturatoPartner}
                    key={index}
                    onChange={(e) => handleInputLegameChange(e, index)}
                    maxLength="9"
                    name="fatturatoPartner"
                    disabled={!showAdminBoard}
                />
            </td>
            <td>
              <input
                      type="number"
                      className="form-control"
                      id="fatturatoSocieta"
                      required
                      value={legame.fatturatoSocieta}
                      key={index}
                      onChange={(e) => handleInputLegameChange(e, index)}
                      name="fatturatoSocieta"
                      maxLength="9"
                      disabled={!showAdminBoard}
                />
            </td>
            <td>
              <input
                      type="number"
                      className="form-control"
                      id="acconto"
                      required
                      value={legame.acconto}
                      key={index}
                      onChange={(e) => handleInputLegameChange(e, index)}
                      name="acconto"
                      maxLength="9"
                      disabled={!showAdminBoard}
                />
            </td>
            <td>
              <input
                      type="number"
                      className="form-control"
                      id="saldo"
                      required
                      value={legame.saldo}
                      key={index}
                      onChange={(e) => handleInputLegameChange(e, index)}
                      name="saldo"
                      maxLength="9"
                      disabled={!showAdminBoard}
                />
            </td> */}
            <td>
              <ConfirmDialog 
                title= {<BsXLg />}
                message= 'Sei sicuro di voler cancellare il servizio?'
                onClickYes= {()=> deleteLegame(legame.id)}
                className={"btn btn-danger " + (!showAdminBoard ? "d-none" : "")}
              /> 

              <ConfirmDialog 
                title= {<BsFillPencilFill />}
                message= 'Sei sicuro di voler aggiornare il servizio?'
                //onClickYes= {() => updateLegame(legame.id, {clientid: legame.clienteid, partnerid: partner.length>0?partner:legame.partnerid, tipo: newTipoLegame?newTipoLegame:legame.tipo, dataInizio: legame.dataInizio, fatturatoPartner: legame.fatturatoPartner, fatturatoSocieta: legame.fatturatoSocieta, acconto: legame.acconto, saldo: legame.saldo})}
                onClickYes= {() => updateLegame(legame.id, {clientid: legame.clienteid, partnerid: partner.length>0?partner:legame.partnerid, tipo: newTipoLegame?newTipoLegame:legame.tipo, dataInizio: legame.dataInizio, totalePratica: legame.totalePratica, incassato: legame.incassato, compensoPartner: legame.compensoPartner, statoPratica: selectedStatoPratica ? selectedStatoPratica: legame.statoPratica})}
                className={"btn btn-primary " + (!showAdminBoard ? "d-none" : "")}
              />

              <button onClick={() => renderNote(legame)}
                        className="btn btn-warning"
                        className={` btn ${legame.note && legame.note.length > 0 ? "btn-success" : "btn-warning"}`}
              >
                  {<BsChatLeftTextFill />}
              </button>	
            </td>
          </tr>         
      )
    })
  };

  const renderNote = (legame) => {   
    var note= document.getElementById('note');
    if(note != null && legame.note != note.value){
      note.value = "";
    }

    setCurrentLegameNote(legame);

    setVisualizzaNote(true);

  };

  const refreshList = () => {
    retrieveLegami(currentMacroservizio.id, currentCliente.id);    
    setCurrentIndex(-1);
    setVisualizzaNote(false);
  };

  const refreshSearchedList = () => {    
    setCurrentCliente(null);
    setCurrentIndex(-1);
  };

  const deleteLegame = legameid => {
    if(user && showAdminBoard){
      LegameDataService.remove(legameid)
      .then(response => {
        // console.log(response.data);
        // refreshList();

        var modifica = {        
          data: new Date(),          
          userid: user.id,
          username: user.username,
        };
        //Creo il record di modifica
        ModificaDataService.create(modifica).then(response => {        
          props.history.push("/clientes/"+ currentCliente.id);
          window.location.reload();
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });


      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  const updateLegame = (legameid, data) => {
    // console.log('UPDATELEGAME');
    // console.log(partner);
    if(user && showAdminBoard){
      data.userid = user.id;
      data.username = user.username;
      LegameDataService.update(legameid, data)
      .then(response => {
        console.log(response.data);
        // refreshList();
        window.location.reload();
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  const updateNoteLegame = (legameid, data) => {
    if(user && showAdminBoard){
      data.userid = user.id;
      data.username = user.username;
      LegameDataService.update(legameid, data)
      .then(response => {
        console.log(response.data);
        // refreshList();
        window.location.reload();
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
            <h4>Lista macroservizi {currentCliente.ragioneSociale}</h4>           
            <div className="lista-macroservizi-wrapper">
              {/* <div className="half1"> */}
        
                <ul className="list-group-servizi percent-max-content">
                  {macroservizi &&
                    macroservizi.map((macroservizio, index) => (
                      <li
                        className={
                          "list-group-item-custom marginLeft1 " + (index === currentIndex ? "customActive" : "")
                        }
                        onClick={() => setActiveMacroservizio(macroservizio, index)}
                        key={index}
                      >
                        {macroservizio.servizi}
                        <button 
                          className={"margin-left-px btn btn-primary " + (!showAdminBoard ? "d-none" : "")}
                          onClick={() => handleInserisciServizioClick(macroservizio, currentCliente, index)}
                        >
                          <BsPlusLg />
                        </button>                    
                      </li>
                      
                    ))}
                </ul>                                                        
              {/* </div>               */}
              <br></br><br></br>
              {currentListaLegameMacroservizio && currentListaLegameMacroservizio.length > 0 ? (
                <div className="table-responsive text-nowrap width1400">
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
        
        {visualizzaNote ? (
          <div className="note-wrapper">
          <table id='noteTable'>
            <tbody >
                <tr>{renderTableNoteHeader()}</tr>
                {renderTableNoteData()}
            </tbody>
          </table>          
          <ConfirmDialog 
                title= "Aggiorna note"
                message= 'Sei sicuro di voler aggiornare le note del servizio?'
                onClickYes= {() => updateNoteLegame(currentLegameNote.id, {note: currentLegameNote.note})}
                className={"note-button-margin-top btn btn-primary " + (!showAdminBoard ? "d-none" : "")}
                
              /> 
          </div>  
          ) :(
            <div></div>
          )
        }

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
