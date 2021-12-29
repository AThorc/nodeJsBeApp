import React, { useState, useEffect } from "react";
import MacroservizioDataService from "../services/MacroservizioService";
import LegameDataService from "../services/LegameService";
import ClienteDataService from "../services/ClienteService";
import PartnerDataService from "../services/PartnerService";

import ConfirmDialog from "./confirmDialog.component";

import AuthService from "../services/auth.service";

import moment from 'moment'

const AssociaServizio = props => {
  const initialMacroservizioState = {
    id: null,
    servizi: "",
    dataInizio: "",
    fatturato: ""

  };

  const initialLegameState = {
    id: null,
    tipo: ""

  };

  const [macroservizio, setMacroservizio] = useState(initialMacroservizioState);
  const [clienti, setClienti] = useState([]);
  const [cliente, setCliente] = useState({});
  const [partner, setPartner] = useState({});
  const [partners, setPartners] = useState([]);
  const [segnalatore, setSegnalatore] = useState({});
  const [legame, setLegame] = useState(initialLegameState);

  const [submitted, setSubmitted] = useState(false);

  const user = AuthService.getCurrentUser();

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMacroservizio({ ...macroservizio, [name]: value });
  };

  const handleInputLegameChange = event => {
    const { name, value } = event.target;
    setLegame({ ...legame, [name]: value });
  };

  const saveLegame = () => {
    if(user){
      var data = {
        servizioid: macroservizio.id,
        clienteid: cliente,
        partnerid: partner,
        segnalatoreid: segnalatore.value,  
        tipo: legame.tipo
      };

      LegameDataService.create(data)
      .then(response => {
        setLegame({
          id: response.data.id,
          servizioid: response.data.servizioid,
          clienteid: response.data.clienteid,
          partnerid: response.data.partnerid,
          tipo: response.data.tipo
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }   
  };


  const getMacroservizio = id => {
    if(user){
      MacroservizioDataService.get(id)
      .then(response => {
        setMacroservizio(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  useEffect(() => {
    getMacroservizio(props.match.params.id);
    retrieveClientes();
    retrievePartners();
  }, [props.match.params.id]);


  const newMacroservizio = () => {
    setMacroservizio(initialMacroservizioState);
    setSubmitted(false);
  };



  const _handleClienteChange = event => {
    const { value} = event.target;
    console.log(value);
    //console.log(id);
    setCliente(value);
  };

  const _handlePartnerChange = event => {
    const { value,} = event.target;
    console.log(value);
    //console.log(id);
    setPartner(value);
  };


  const retrieveClientes = () => {
    if(user){
      ClienteDataService.getAll()
      .then(response => {
        var clientiOptions = getClientiSelectBox(response.data);
        setClienti(clientiOptions);
        console.log(response.data);
        console.log(clientiOptions);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  function getClientiSelectBox(clienti){
    var clientiOptions = [];
    for(const i in clienti){
      var cliente = clienti[i];
      var clienteOption = { value: cliente.id, label: cliente.ragioneSociale };
      clientiOptions.push(clienteOption);
    }
    return clientiOptions;
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

  function getPartnersSelectBox(partners){
    var partnersOptions = [];
    for(const i in partners){
      var partner = partners[i];
      var partnerOption = { value: partner.id, label: partner.denominazione };
      partnersOptions.push(partnerOption);
    }
    return partnersOptions;
  };


  const deleteLegame = () => {
    if(user){
      LegameDataService.remove(legame.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/listaMacroservizi");
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };


  if(user){
    return (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button className="btn btn-success" onClick={newMacroservizio}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <h4>Associa il servizio</h4>
            <div className="form-group">
              <label htmlFor="title">Servizi</label>
              <input
                type="text"
                className="form-control"
                id="servizi"                
                value={macroservizio.servizi}
                onChange={handleInputChange}
                name="servizi"
                readOnly="readonly"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="title">Data inizio</label>
              <input
                type="date"
                className="form-control"
                id="dataInizio"                
                value={moment(macroservizio.dataInizio).format('YYYY-MM-DD')}  
                onChange={handleInputChange}
                name="dataInizio"
                readOnly="readonly"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="title">Fatturato macroservizio</label>
              <input
                type="number"
                className="form-control"
                id="fatturato"                
                value={macroservizio.fatturato}
                onChange={handleInputChange}
                name="fatturato"
                readOnly="readonly"
              />
            </div>   

            <div className="form-group">
              <label htmlFor="title">Tip. servizi</label>
              <input
                type="text"
                className="form-control"
                id="tipo"  
                required                
                value={legame.tipo}
                onChange={handleInputLegameChange}
                name="tipo"                           
              />
            </div>      

            <div className="form-group box">
              <label htmlFor="title">Cliente</label>
              <select value={cliente.value}  onClick={_handleClienteChange}>
                <option value="" disabled selected>Seleziona un cliente</option>    
                {clienti &&
                  clienti.map((cliente, index) => (                  
                    
                      <option  value={cliente.value} key={index}>{cliente.label}</option>                    
                  ))}
                </select>
            </div>

            <div className="form-group box">
              <label htmlFor="title">Partner</label>
              <select value={partner.value} onClick={_handlePartnerChange}>
                <option value="" disabled selected>Seleziona un partner</option>    
                {partners &&
                  partners.map((partner, index) => (                  
                    
                      <option value={partner.value} key={index} >{partner.label}</option>                    
                  ))}
                </select>
            </div>
  

            <ConfirmDialog 
              title= 'Associa'
              message= 'Sei sicuro di voler associare il legame?'
              onClickYes= {saveLegame}
              className="btn btn-warning btn-associa"
            />         
              
          </div>
        )}
      </div>
    );
  }else{
    return(
      <div>
        <br />
          <p>Effettua il login per vedere i macroservizios...</p>
      </div>
    );
  }
  
};

export default AssociaServizio;
