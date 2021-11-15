import React, { useState, useEffect } from "react";
import ClienteDataService from "../services/ClienteService";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";

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
    getCliente(props.match.params.id);
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
          <div className="edit-form">
            <h4>Cliente</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Ragione sociale</label>
                <input
                  type="text"
                  className="form-control"
                  id="ragioneSociale"
                  required
                  value={currentCliente.ragioneSociale}
                  onChange={handleInputChange}
                  name="ragioneSociale"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Codice fiscale</label>
                <input
                  type="text"
                  className="form-control"
                  id="codiceFiscale"
                  required
                  value={currentCliente.codiceFiscale}
                  onChange={handleInputChange}
                  name="codiceFiscale"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Partita IVA</label>
                <input
                  type="text"
                  className="form-control"
                  id="partitaIVA"
                  required
                  value={currentCliente.partitaIVA}
                  onChange={handleInputChange}
                  name="partitaIVA"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Legale Rappresentate</label>
                <input
                  type="text"
                  className="form-control"
                  id="legaleRappresentate"                
                  value={currentCliente.legaleRappresentate}
                  onChange={handleInputChange}
                  name="legaleRappresentate"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Telefono</label>
                <input
                  type="text"
                  className="form-control"
                  id="telefono"                
                  value={currentCliente.telefono}
                  onChange={handleInputChange}
                  name="telefono"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Cellulare</label>
                <input
                  type="text"
                  className="form-control"
                  id="cellulare"                
                  value={currentCliente.cellulare}
                  onChange={handleInputChange}
                  name="cellulare"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Mail</label>
                <input
                  type="text"
                  className="form-control"
                  id="mail"                
                  value={currentCliente.mail}
                  onChange={handleInputChange}
                  name="mail"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Pec</label>
                <input
                  type="text"
                  className="form-control"
                  id="pec"                
                  value={currentCliente.pec}
                  onChange={handleInputChange}
                  name="pec"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Sede</label>
                <input
                  type="text"
                  className="form-control"
                  id="sede"                
                  value={currentCliente.sede}
                  onChange={handleInputChange}
                  name="sede"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Localita</label>
                <input
                  type="text"
                  className="form-control"
                  id="localita"                
                  value={currentCliente.localita}
                  onChange={handleInputChange}
                  name="localita"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Cap</label>
                <input
                  type="text"
                  className="form-control"
                  id="cap"                
                  value={currentCliente.cap}
                  onChange={handleInputChange}
                  name="cap"
                />
              </div>            
  
  
              <div className="form-group">
                <label htmlFor="description">Data costituzione</label>
                <input
                  type="date"
                  className="form-control"
                  id="dataCostituzione"                
                  value={moment(currentCliente.dataCostituzione).format('YYYY-MM-DD')}                
                  onChange={handleInputChange}
                  name="dataCostituzione"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Inizio Attivita</label>
                <input
                  type="date"
                  className="form-control"
                  id="inizioAttivita"                
                  value={moment(currentCliente.inizioAttivita).format('YYYY-MM-DD')}                
                  onChange={handleInputChange}
                  name="inizioAttivita"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="title">Tipo</label>
                <input
                  type="text"
                  className="form-control"
                  id="tipo"
                  required
                  value={currentCliente.tipo}
                  onChange={handleInputChange}
                  name="tipo"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Dimensione</label>
                <input
                  type="text"
                  className="form-control"
                  id="dimensione"
                  required
                  value={currentCliente.dimensione}
                  onChange={handleInputChange}
                  name="dimensione"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Att. Istat Ateco 2007</label>
                <input
                  type="text"
                  className="form-control"
                  id="attIstatAteco2007"
                  required
                  value={currentCliente.attIstatAteco2007}
                  onChange={handleInputChange}
                  name="attIstatAteco2007"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Settore</label>
                <input
                  type="text"
                  className="form-control"
                  id="settore"
                  required
                  value={currentCliente.settore}
                  onChange={handleInputChange}
                  name="settore"
                />
              </div>
            </form>          
  
            <ConfirmDialog 
              title= 'Delete'
              message= 'Sei sicuro di voler cancellare il cliente?'
              onClickYes= {deleteCliente}
              className="btn btn-danger"
            />

            <button className="badge badge-danger mr-2 d-none" onClick={deleteCliente}>
              Delete
            </button>
  
            <button
              type="submit"
              className="btn btn-primary"
              onClick={updateCliente}
            >
              Update
            </button>
            <p>{message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Cliente...</p>
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
