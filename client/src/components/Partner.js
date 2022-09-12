import React, { useState, useEffect } from "react";
import PartnerDataService from "../services/PartnerService";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";

import moment from 'moment'

import ModificaDataService from "../services/ModificaService";

import LegameDataService from "../services/LegameService";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const Partner = props => {
  const initialPartnerState = {
    id: null,
    denominazione: "",
    dataInizio: "",
    percentuale: ""
  };
  const [currentPartner, setCurrentPartner] = useState(initialPartnerState);
  const [message, setMessage] = useState("");

  const user = AuthService.getCurrentUser();
  const [showAlertDialog, setShowAlertDialog] = useState(false);

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
      currentPartner.userid = user.id;
      currentPartner.username = user.username;
      PartnerDataService.update(currentPartner.id, currentPartner)
      .then(response => {
        console.log(response.data);
        setMessage("The partner was updated successfully!");
        window.location.reload();
      })
      .catch(e => {
        console.log(e);
      });
    }
   
  };

  const deletePartner = async() => {
    if(user){
      var responseLegami = await LegameDataService.findByPartnerId(currentPartner.id);
      if(responseLegami.data.length > 0){
        //alert("Impossibile cancellare il partner in quanto possiede dei servizi!");
        setShowAlertDialog(true);    
      }else{
        PartnerDataService.remove(currentPartner.id)
      .then(response => {        
        var modifica = {        
          data: new Date(),          
          userid: user.id,
          username: user.username,
        };
        //Creo il record di modifica
        ModificaDataService.create(modifica).then(response => {        
          props.history.push("/listaPartner");
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

  const handleCloseAlert = () => {
    setShowAlertDialog(false);
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
                <label htmlFor="title">Percentuale Partner</label>
                <input
                  type="text"
                  className="form-control"
                  id="percentuale"
                  required
                  value={currentPartner.percentuale}
                  onChange={handleInputChange}
                  name="percentuale"
                />
              </div>
  
              {/* <div className="form-group">
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
              </div> */}
           
            </form>          

            <Dialog
                open={showAlertDialog}
                onClose={handleCloseAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="alert-error"
              >                    
                <DialogTitle id="alert-dialog-title">
                  {"Alert"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Impossibile cancellare il partner in quanto possiede dei servizi!
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseAlert}>Chiudi</Button>                    
                </DialogActions>
            </Dialog>
  
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
