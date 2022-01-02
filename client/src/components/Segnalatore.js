import React, { useState, useEffect } from "react";
import SegnalatoreDataService from "../services/SegnalatoreService";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";


const Segnalatore = props => {
  const initialSegnalatoreState = {
    id: null,
    denominazione: "",
    dataInizio: "",
    fatturatoSegnalatore: ""    
  };
  const [currentSegnalatore, setCurrentSegnalatore] = useState(initialSegnalatoreState);
  const [message, setMessage] = useState("");

  const user = AuthService.getCurrentUser();

  const getSegnalatore = id => {
    if(user){
      SegnalatoreDataService.get(id)
      .then(response => {
        setCurrentSegnalatore(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  useEffect(() => {
    getSegnalatore(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentSegnalatore({ ...currentSegnalatore, [name]: value });
  };  

  const updateSegnalatore = () => {
    if(user){
      SegnalatoreDataService.update(currentSegnalatore.id, currentSegnalatore)
      .then(response => {
        console.log(response.data);
        setMessage("The segnalatore was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
    }
   
  };

  const deleteSegnalatore = () => {
    if(user){
      SegnalatoreDataService.remove(currentSegnalatore.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/segnalatores");
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  if(user){
    return (
      <div>
        {currentSegnalatore ? (
          <div className="edit-form">
            <h4>Segnalatore</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Denominazione</label>
                <input
                  type="text"
                  className="form-control"
                  id="denominazione"
                  required
                  value={currentSegnalatore.denominazione}
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
                  value={moment(currentSegnalatore.dataInizio).format('YYYY-MM-DD')}       
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
                  value={currentSegnalatore.fatturatoSegnalatore}
                  onChange={handleInputChange}
                  name="fatturatoSegnalatore"
                />
              </div>               
            </form>          
  
            <ConfirmDialog 
              title= 'Cancella'
              message= 'Sei sicuro di voler cancellare il segnalatore?'
              onClickYes= {deleteSegnalatore}
              className="btn btn-danger"
            />

            <button className="badge badge-danger mr-2 d-none" onClick={deleteSegnalatore}>
              Cancella
            </button>
  
            <button
              type="submit"
              className="btn btn-primary"
              onClick={updateSegnalatore}
            >
              Aggiorna
            </button>
            <p>{message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Seleziona un Segnalatore...</p>
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

export default Segnalatore;
