import React, { useState, useEffect } from "react";
import MacroservizioDataService from "../services/MacroservizioService";
import LegameDataService from "../services/LegameService";
import ClienteDataService from "../services/ClienteService";
import PartnerDataService from "../services/PartnerService";

import ConfirmDialog from "./confirmDialog.component";

import AuthService from "../services/auth.service";

import moment from 'moment';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const InserisciServizio = props => {
  const initialMacroservizioState = {
    id: null,
    servizi: "",
    dataInizio: "",
    fatturato: ""

  };

  const initialLegameState = {
    id: null,
    tipo: "",
    fatturatoPartner: undefined,
    fatturatoSocieta: undefined,
    dataInizio: '',
    note: undefined

  };

  const tipologiaServizi = {
    "CONSULENZA AZIENDALE": ['Contabilità', 'Business Plan', 'Fiscale/Tributaria', 'Consulenza'],
    "CONSULENZA FINANZIARIA": ['Finanza Agevolata', 'Consulenza'],
    "CONSULENZA DEL LAVORO": ['Buste Paga', 'Consulenza'],
    "CONSULENZA LEGALE": ['Anatocismo', 'Controversie Commerciali', 'Consulenza'],
    "CONSULENZA DIREZIONALE": ['Anticorruzione/Antiriciclaggio', 'Certificazione di Qualità', 'Sicurezza sul lavoro', 'Privacy', 'Consulenza'],
  };

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
    settore: "",
    ateco12: "",
    ateco34: "",
    ateco56: ""
  };

  const [macroservizio, setMacroservizio] = useState(initialMacroservizioState);
  const [currentCliente, setCurrentCliente] = useState(initialClienteState);

  const [clienti, setClienti] = useState([]);
  const [cliente, setCliente] = useState({});
  const [partner, setPartner] = useState({});
  const [partners, setPartners] = useState([]);
  const [segnalatore, setSegnalatore] = useState({});
  const [legame, setLegame] = useState(initialLegameState);

  const [submitted, setSubmitted] = useState(false);

  const user = AuthService.getCurrentUser();

  const [newTipoLegame, setNewTipoLegame] = useState(null);

  const [percentualePartner, setPercentualePartner] = useState(null);

  const [compensoPartner, setCompensoPartner] = useState(null);

  
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const handleCloseAlert = () => {
    setShowAlertDialog(false);
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMacroservizio({ ...macroservizio, [name]: value });
  };

  const handleInputLegameChange = event => {
    const { name, value } = event.target;
    setLegame({ ...legame, [name]: value });
  };

  const handleInputPercentualeChange = event => {
    const { value} = event.target;
    setPercentualePartner(value);
  };

  const handleInputCompensoPartnerChange = event => {
    const { value} = event.target;
    setCompensoPartner(value);
  };

  const saveLegame = () => {
    if(user){

      //Logica controllo valorizzazione dati obbligatori: data inizio
      if(legame.dataInizio == undefined || legame.dataInizio == ''){
        setShowAlertDialog(true);
        return;
      }


      console.log('LEGAME');
      console.log(legame);
      var data = {
        servizioid: macroservizio.id,
        clienteid: currentCliente.id,
        partnerid: partner,
        segnalatoreid: segnalatore.value,  
        tipo: newTipoLegame,
        dataInizio: legame.dataInizio,
        // fatturatoPartner: legame.fatturatoPartner,
        // fatturatoSocieta: legame.fatturatoSocieta,
        userid: user.id,
        username: user.username,
        // acconto: legame.acconto,
        // saldo: legame.saldo
        totalePratica: legame.totalePratica,
        incassato: legame.incassato,
        compensoPartner: compensoPartner,
      };

      LegameDataService.create(data)
      .then(response => {
        setLegame({
          id: response.data.id,
          servizioid: response.data.servizioid,
          clienteid: response.data.clienteid,
          partnerid: response.data.partnerid,
          tipo: response.data.tipo,
          dataInizio: response.data.dataInizio,
          // fatturatoPartner: response.data.fatturatoPartner,
          // fatturatoSocieta: response.data.fatturatoSocieta,
          // acconto: response.data.acconto,
          // saldo: response.data.saldo
          totalePratica: response.data.totalePratica,
          incassato: response.data.incassato,
          compensoPartner: response.data.compensoPartner,
        });
        setSubmitted(true);
         // console.log(response.data);
         props.history.push("/clientes/"+currentCliente.id);
         window.location.reload();
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

  useEffect(() => {
    getMacroservizio(props.match.params.id);
    //retrieveClientes();
    getCliente(props.match.params.clienteid);
    retrievePartners();
  }, [props.match.params.id, props.match.params.clienteid]);


  const newLegame = () => {
    setLegame(initialLegameState);
    setSubmitted(false);
  };



  const _handleClienteChange = event => {
    const { value} = event.target;
    console.log(value);
    //console.log(id);
    setCliente(value);
  };

  const _handlePartnerChange = event => {
    const { value} = event.target;
    console.log(value);
    //console.log(id);
    setPartner(value);

    for(var i in partners){
      var currPart = partners[i];
      console.log('CURR PART');
      console.log(currPart);
      if(currPart.value == value){
        setPercentualePartner(currPart.percentuale);
      }
    }    
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


  const calcolaCompensoPartner = () => {
    console.log('calcolaComp');
    console.log(legame);
    console.log(percentualePartner);
    setCompensoPartner((legame.totalePratica * percentualePartner) / 100);

  }

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
      var partnerOption = { value: partner.id, label: partner.denominazione, percentuale: partner.percentuale };
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

  const handleInputLegameTipoChange = event => {
    const { name, value } = event.target;
    setNewTipoLegame(value);
  };


  if(user){
    return (
      <div className="">
        {submitted ? (
          <div>
            <h4>Servizio inserito correttamente!</h4>
            <button className="btn btn-success" onClick={newLegame}>
              Aggiungi
            </button>
          </div>
        ) : (
          <div>
            <h4>Inserisci il servizio</h4>

            <div >
              <table id='inserisciServizioIdDiv' className="table">
                
              <tbody>       
                <tr key={1}>
                  <td>
                    <label htmlFor="title">Servizi</label>
                    <input
                          type="text"
                          className="form-control fit-content"
                          id="servizi"                          
                          value={macroservizio.servizi}
                          onChange={handleInputChange}
                          name="servizi"
                          readOnly="readonly"
                      />
                  </td>
                  <td>
                    <label htmlFor="title">Cliente</label>
                    <input
                      type="text"
                      className="form-control fit-content"
                      id="cliente"           
                      value={currentCliente.ragioneSociale}
                      onChange={handleInputLegameChange}
                      name="cliente"
                      readOnly="readonly"                        
                    />
                  </td>
                  <td>
                    <label htmlFor="title">Data inizio</label>
                    <input
                      type="date"
                      className="form-control fit-content"
                      id="dataInizio"                
                      value={legame.dataInizio}  
                      onChange={handleInputLegameChange}
                      name="dataInizio"
                    />
                  </td>

                </tr>

                <tr key={2}>
                  <td>
                    <label htmlFor="title">Tip. servizi</label>
                    <div className="form-group box">
                      <select defaultValue={'DEFAULT'} onClick={(e) => handleInputLegameTipoChange(e)} onChange={(e) => handleInputLegameTipoChange(e)}>
                        <option value="" disabled value="DEFAULT">Seleziona un tipo</option>    
                        {tipologiaServizi[macroservizio.servizi] &&
                              tipologiaServizi[macroservizio.servizi].map((tipo, index) => (                  
                            
                              <option value={tipo} key={index} >{tipo}</option>                    
                          ))}
                        </select>
                      </div>
                  </td>
                  <td>
                    <label htmlFor="title">Partner</label>
                    <div className="form-group box">
                      <select value={partner.value} defaultValue={'DEFAULT'} onClick={_handlePartnerChange} onChange={_handlePartnerChange}>
                        <option value="" disabled value="DEFAULT">Seleziona un partner</option>    
                        {partners &&
                          partners.map((partner, index) => (                  
                            
                              <option value={partner.value} key={index} >{partner.label}</option>                    
                          ))}
                        </select>
                      </div>
                  </td>                  

                </tr>

                <tr key={3}>
                  <td>
                    <label htmlFor="title">Totale Pratica</label>
                    <input
                          type="text"
                          className="form-control fit-content"
                          id="totalePratica"                          
                          value={legame.totalePratica}
                          onChange={handleInputLegameChange}
                          name="totalePratica"
                      />
                  </td>
                  <td>
                    <label htmlFor="title">Incassato</label>
                    <input
                          type="text"
                          className="form-control fit-content"
                          id="incassato"                          
                          value={legame.incassato}
                          onChange={handleInputLegameChange}
                          name="incassato"
                      />
                  </td>
                  <td>
                    <label htmlFor="title">Da Incassare</label>
                    <input
                          type="text"
                          className="form-control fit-content"
                          id="daIncassare"                          
                          value={legame.totalePratica - legame.incassato}
                          onChange={handleInputLegameChange}
                          name="daIncassare"
                          readOnly="readonly"
                      />
                  </td>
                </tr>

                <tr key={4}>
                  <td>
                    <label htmlFor="title">Compenso Partner</label><br></br>                    
                    <div className="percentualeDiv">
                      <label htmlFor="title">Percentuale</label>
                      <input
                            type="text"
                            className="form-control fit-content max50pxWidth marginLeft7"
                            id="percentuale"                          
                            value={percentualePartner}
                            onChange={handleInputPercentualeChange}
                            name="percentuale"
                        />                        
                        <button className="btn btn-warning marginLeft7" onClick={calcolaCompensoPartner}>
                          Calcola
                        </button> 

                    </div>
                   
                      <input
                          type="text"
                          className="form-control fit-content"
                          id="compensoPartner"                          
                          value={compensoPartner}
                          onChange={handleInputCompensoPartnerChange}
                          name="compensoPartner"
                      />
                  </td>                 
                </tr>
                <tr key={5}>
                  <td>
                      <label htmlFor="title">Netto</label>
                      <input
                            type="text"
                            className="form-control fit-content"
                            id="netto"                          
                            value={legame.totalePratica - compensoPartner}
                            onChange={handleInputLegameChange}
                            name="netto"
                            readOnly="readonly"
                        />
                    </td>
                </tr>


              </tbody>    

              </table> 
            </div> 


            {/* <div className="form-group">
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
            </div>       */}

            

            {/* <div className="form-group">
                <label htmlFor="title">Fatturato partner</label>
                <input
                  type="number"
                  className="form-control"
                  id="fatturatoPartner"
                  required
                  value={legame.fatturatoPartner}
                  onChange={handleInputLegameChange}
                  name="fatturatoPartner"
                />
              </div>

              <div className="form-group">
                <label htmlFor="title">Fatturato Multifinance</label>
                <input
                  type="number"
                  className="form-control"
                  id="fatturatoSocieta"
                  required
                  value={legame.fatturatoSocieta}
                  onChange={handleInputLegameChange}
                  name="fatturatoSocieta"
                />
              </div>     

              <div className="form-group">
                <label htmlFor="title">Acconto</label>
                <input
                  type="number"
                  className="form-control"
                  id="acconto"
                  required
                  value={legame.acconto}
                  onChange={handleInputLegameChange}
                  name="acconto"
                />
              </div> 

              <div className="form-group">
                <label htmlFor="title">Saldo</label>
                <input
                  type="number"
                  className="form-control"
                  id="saldo"
                  required
                  value={legame.saldo}
                  onChange={handleInputLegameChange}
                  name="saldo"
                />
              </div>           */}
  

            <ConfirmDialog 
              title= 'Inserisci'
              message= 'Sei sicuro di voler inserire il servizio?'
              onClickYes= {saveLegame}
              className="btn btn-warning btn-associa"
            />         
              
          </div>
        )}

        <Dialog
          open={showAlertDialog}
          onClose={handleCloseAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="alert-error"
        >                    
          <DialogTitle id="alert-dialog-title">
            {"Warning"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Attenzione inserire dati obbligatori: data inizio!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAlert}>Chiudi</Button>                    
          </DialogActions>
        </Dialog>

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

export default InserisciServizio;
