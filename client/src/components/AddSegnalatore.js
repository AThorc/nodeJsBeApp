import React, { useState } from "react";
import SegnalatoreDataService from "../services/SegnalatoreService";

import AuthService from "../services/auth.service";

const AddSegnalatore = () => {
  const initialSegnalatoreState = {
    id: null,
    denominazione: "",
    dataInizio: "",
    fatturatoSegnalatore: ""

  };
  const [segnalatore, setSegnalatore] = useState(initialSegnalatoreState);
  const [submitted, setSubmitted] = useState(false);

  const user = AuthService.getCurrentUser();

  const handleInputChange = event => {
    const { name, value } = event.target;
    setSegnalatore({ ...segnalatore, [name]: value });
  };

  const saveSegnalatore = () => {
    if(user){
      var data = {        
        denominazione: segnalatore.denominazione,
        dataInizio: segnalatore.dataInizio,
        fatturatoSegnalatore: segnalatore.fatturatoSegnalatore
      };

      SegnalatoreDataService.create(data)
      .then(response => {
        setSegnalatore({
          id: response.data.id,
          denominazione: response.data.denominazione,
          dataInizio: response.data.dataInizio,
          fatturatoSegnalatore: response.data.fatturatoSegnalatore
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }   
  };

  const newSegnalatore = () => {
    setSegnalatore(initialSegnalatoreState);
    setSubmitted(false);
  };


  if(user){
    return (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>Segnalatore inserito correttamente!</h4>
            <button className="btn btn-success" onClick={newSegnalatore}>
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
                value={segnalatore.denominazione}
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
                value={segnalatore.dataInizio}
                onChange={handleInputChange}
                name="dataInizio"
              />
            </div>
  
            <div className="form-group">
              <label htmlFor="title">Fatturato segnalatore</label>
              <input
                type="number"
                className="form-control"
                id="fatturatoSegnalatore"
                required
                value={segnalatore.fatturatoSegnalatore}
                onChange={handleInputChange}
                name="fatturatoSegnalatore"
              />
            </div>           
  
            <button onClick={saveSegnalatore} className="btn btn-success">
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
          <p>Effettua il login per vedere i segnalatori...</p>
      </div>
    );
  }
  
};

export default AddSegnalatore;
