import React, { useState, useEffect } from "react";
import MacroservizioDataService from "../services/MacroservizioService";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";

import moment from 'moment';

import ModificaDataService from "../services/ModificaService";
import LegameDataService from "../services/LegameService";

const Macroservizio = props => {
  const initialMacroservizioState = {
    id: null,
    servizi: "",  
    dataInizio: ""  
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
      currentMacroservizio.userid = user.id;
      currentMacroservizio.username = user.username;

      MacroservizioDataService.update(currentMacroservizio.id, currentMacroservizio)
      .then(response => {
        console.log(response.data);
        setMessage("The macroservizio was updated successfully!");
        window.location.reload();
      })
      .catch(e => {
        console.log(e);
      });
    }
   
  };

  const deleteMacroservizio = async() => {
    if(user){      
      var responseLegami = await LegameDataService.findByServizioId(currentMacroservizio.id);
      debugger
      if(responseLegami.data.length > 0){
        alert("Impossibile cancellare il macroservizio in quanto possiede dei servizi!");        
      }else{
        MacroservizioDataService.remove(currentMacroservizio.id)
        .then(response => {
          // console.log(response.data);
          // props.history.push("/listaMacroservizi");

          var modifica = {        
            data: new Date(),          
            userid: user.id,
            username: user.username,
          };
          //Creo il record di modifica
          ModificaDataService.create(modifica).then(response => {        
            props.history.push("/listaMacroservizi");
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
              {/* <div className="form-group">
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
              </div>        */}
              
            </form>          
  
            <ConfirmDialog 
              title= 'Cancella'
              message= 'Sei sicuro di voler cancellare il macroservizio?'
              onClickYes= {deleteMacroservizio}
              className="btn btn-danger"
            />

            <button className="badge badge-danger mr-2 d-none" onClick={deleteMacroservizio}>
              Cancella
            </button>
  
            <button
              type="submit"
              className="btn btn-primary"
              onClick={updateMacroservizio}
            >
              Aggiorna
            </button>
            <p>{message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Seleziona un Macroservizio...</p>
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
