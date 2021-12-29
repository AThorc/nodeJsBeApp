import React, { useState, useEffect } from "react";
import MacroservizioDataService from "../services/MacroservizioService";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";

import moment from 'moment'

const Macroservizio = props => {
  const initialMacroservizioState = {
    id: null,
    servizi: "",
    dataInizio: "",
    fatturato: ""    
  };
  const [currentMacroservizio, setCurrentMacroservizio] = useState(initialMacroservizioState);
  const [message, setMessage] = useState("");

  const user = AuthService.getCurrentUser();

  const getMacroservizio = id => {
    if(user){
      MacroservizioDataService.get(id)
      .then(response => {
        setCurrentMacroservizio(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  useEffect(() => {
    getMacroservizio(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentMacroservizio({ ...currentMacroservizio, [name]: value });
  };  

  const updateMacroservizio = () => {
    if(user){
      MacroservizioDataService.update(currentMacroservizio.id, currentMacroservizio)
      .then(response => {
        console.log(response.data);
        setMessage("The macroservizio was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
    }
   
  };

  const deleteMacroservizio = () => {
    if(user){
      MacroservizioDataService.remove(currentMacroservizio.id)
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
      <div>
        {currentMacroservizio ? (
          <div className="edit-form">
            <h4>Macroservizio</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Servizi</label>
                <input
                  type="text"
                  className="form-control"
                  id="servizi"
                  required
                  value={currentMacroservizio.servizi}
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
                  value={moment(currentMacroservizio.dataInizio).format('YYYY-MM-DD')}        
                  onChange={handleInputChange}
                  name="dataInizio"
                />
              </div>
  
              <div className="form-group">
                <label htmlFor="title">Fatturato macroservizio</label>
                <input
                  type="number"
                  className="form-control"
                  id="fatturato"
                  required
                  value={currentMacroservizio.fatturato}
                  onChange={handleInputChange}
                  name="fatturato"
                />
              </div>               
            </form>          
  
            <ConfirmDialog 
              title= 'Delete'
              message= 'Sei sicuro di voler cancellare il macroservizio?'
              onClickYes= {deleteMacroservizio}
              className="btn btn-danger"
            />

            <button className="badge badge-danger mr-2 d-none" onClick={deleteMacroservizio}>
              Delete
            </button>
  
            <button
              type="submit"
              className="btn btn-primary"
              onClick={updateMacroservizio}
            >
              Update
            </button>
            <p>{message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Macroservizio...</p>
          </div>
        )}
      </div>
    );
  }else{
    return(
      <div>
        <br />
          <p>Effettua il login per vedere i macroservizi...</p>
      </div>
    );
  }
  
};

export default Macroservizio;
