import React, { useState, useEffect } from "react";
import PartnerDataService from "../services/PartnerService";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";

import moment from 'moment'

const Partner = props => {
  const initialPartnerState = {
    id: null,
    denominazione: "",
    dataInizio: "",
    fatturatoPartner: ""    
  };
  const [currentPartner, setCurrentPartner] = useState(initialPartnerState);
  const [message, setMessage] = useState("");

  const user = AuthService.getCurrentUser();

  const getPartner = id => {
    if(user){
      PartnerDataService.get(id)
      .then(response => {
        setCurrentPartner(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  useEffect(() => {
    getPartner(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentPartner({ ...currentPartner, [name]: value });
  };  

  const updatePartner = () => {
    if(user){
      PartnerDataService.update(currentPartner.id, currentPartner)
      .then(response => {
        console.log(response.data);
        setMessage("The partner was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
    }
   
  };

  const deletePartner = () => {
    if(user){
      PartnerDataService.remove(currentPartner.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/partners");
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  if(user){
    return (
      <div>
        {currentPartner ? (
          <div className="edit-form">
            <h4>Partner</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Denominazione</label>
                <input
                  type="text"
                  className="form-control"
                  id="denominazione"
                  required
                  value={currentPartner.denominazione}
                  onChange={handleInputChange}
                  name="denominazione"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Data inizio</label>
                <input
                  type="date"
                  className="form-control"
                  id="dataInizio"
                  required
                  value={moment(currentPartner.dataInizio).format('YYYY-MM-DD')}        
                  onChange={handleInputChange}
                  name="dataInizio"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Fatturato partner</label>
                <input
                  type="number"
                  className="form-control"
                  id="fatturatoPartner"
                  required
                  value={currentPartner.fatturatoPartner}
                  onChange={handleInputChange}
                  name="fatturatoPartner"
                />
              </div>               
            </form>          
  
            <ConfirmDialog 
              title= 'Cancella'
              message= 'Sei sicuro di voler cancellare il partner?'
              onClickYes= {deletePartner}
              className="btn btn-danger"
            />

            <button className="badge badge-danger mr-2 d-none" onClick={deletePartner}>
              Cancella
            </button>
  
            <button
              type="submit"
              className="btn btn-primary"
              onClick={updatePartner}
            >
              Aggiorna
            </button>
            <p>{message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Seleziona un Partner...</p>
          </div>
        )}
      </div>
    );
  }else{
    return(
      <div>
        <br />
          <p>Effettua il login per vedere i partners...</p>
      </div>
    );
  }
  
};

export default Partner;
