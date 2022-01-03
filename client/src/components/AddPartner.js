import React, { useState } from "react";
import PartnerDataService from "../services/PartnerService";

import AuthService from "../services/auth.service";

const AddPartner = () => {
  const initialPartnerState = {
    id: null,
    denominazione: "",
    dataInizio: "",
    fatturatoPartner: ""

  };
  const [partner, setPartner] = useState(initialPartnerState);
  const [submitted, setSubmitted] = useState(false);

  const user = AuthService.getCurrentUser();

  const handleInputChange = event => {
    const { name, value } = event.target;
    setPartner({ ...partner, [name]: value });
  };

  const savePartner = () => {
    if(user){
      var data = {        
        denominazione: partner.denominazione,
        dataInizio: partner.dataInizio,
        fatturatoPartner: partner.fatturatoPartner
      };

      PartnerDataService.create(data)
      .then(response => {
        setPartner({
          id: response.data.id,
          denominazione: response.data.denominazione,
          dataInizio: response.data.dataInizio,
          fatturatoPartner: response.data.fatturatoPartner
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }   
  };

  const newPartner = () => {
    setPartner(initialPartnerState);
    setSubmitted(false);
  };


  if(user){
    return (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>Partner inserito correttamente!</h4>
            <button className="btn btn-success" onClick={newPartner}>
              Aggiungi
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="title">Denominazione</label>
              <input
                type="text"
                className="form-control"
                id="denominazione"
                required
                value={partner.denominazione}
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
                value={partner.dataInizio}
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
                value={partner.fatturatoPartner}
                onChange={handleInputChange}
                name="fatturatoPartner"
              />
            </div>           
  
            <button onClick={savePartner} className="btn btn-success">
              Conferma
            </button>
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

export default AddPartner;
