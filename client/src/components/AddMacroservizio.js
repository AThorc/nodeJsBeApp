import React, { useState } from "react";
import MacroservizioDataService from "../services/MacroservizioService";

import AuthService from "../services/auth.service";

const AddMacroservizio = props => {
  const initialMacroservizioState = {
    id: null,
    servizi: "",
    dataInizio: "" 

  };
  const [macroservizio, setMacroservizio] = useState(initialMacroservizioState);
  const [submitted, setSubmitted] = useState(false);

  const user = AuthService.getCurrentUser();

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMacroservizio({ ...macroservizio, [name]: value });
  };

  const saveMacroservizio = () => {
    if(user){
      var data = {        
        servizi: macroservizio.servizi,
        dataInizio: macroservizio.dataInizio,
        userid: user.id,
        username: user.username,
      };

      MacroservizioDataService.create(data)
      .then(response => {
        setMacroservizio({
          id: response.data.id,
          servizi: response.data.servizi,
        });
        setSubmitted(true);
        props.history.push("/listaMacroservizi");
        window.location.reload();
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }   
  };

  const newMacroservizio = () => {
    setMacroservizio(initialMacroservizioState);
    setSubmitted(false);
  };


  if(user){
    return (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>Macroservizio inserito correttamente!</h4>
            <button className="btn btn-success" onClick={newMacroservizio}>
              Aggiungi
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="title">Servizi</label>
              <input
                type="text"
                className="form-control"
                id="servizi"
                required
                value={macroservizio.servizi}
                onChange={handleInputChange}
                name="servizi"
              />
            </div>      
            <div className="form-group">
              <label htmlFor="title">Data inizio</label>
              <input
                type="date"
                className="form-control"
                id="dataInizio"
                required
                value={macroservizio.dataInizio}
                onChange={handleInputChange}
                name="dataInizio"
              />
            </div>         
  
            <button onClick={saveMacroservizio} className="btn btn-success">
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
          <p>Effettua il login per vedere i macroservizios...</p>
      </div>
    );
  }
  
};

export default AddMacroservizio;
