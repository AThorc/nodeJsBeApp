import React, { useState, useEffect } from "react";
import PartnerDataService from "../services/PartnerService";
import ClienteDataService from "../services/ClienteService";
import { Link, useHistory } from "react-router-dom";

import moment from 'moment'

import AuthService from "../services/auth.service";

const PartnersList = () => {
  const [partners, setPartners] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchDenominazione, setSearchDenominazione] = useState("");

  //var ragioneSociale = [];


  const user = AuthService.getCurrentUser();
  const history = useHistory();

  useEffect(() => {
    if(user){
      retrievePartners();
    }    
  }, []);


  const onChangeSearchDenominazione = e => {
    if(user){
      const searchDenominazione = e.target.value;
      setSearchDenominazione(searchDenominazione);
    }
  };

  const retrievePartners = () => {
    if(user){
      PartnerDataService.getAll()
      .then(response => {
        setPartners(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const refreshList = () => {
    retrievePartners();
    refreshSearchedList();
  };

  const refreshSearchedList = () => {    
    setCurrentPartner(null);
    setCurrentIndex(-1);
  };

  const setActivePartner = (partner, index) => {
    setCurrentPartner(partner);
    setCurrentIndex(index);
   
    //Sbianco i clienti dal partner
    //setClientes([]);

    //Riempio i clienti
    findClientesByPartnerId(partner.id);
    /*for(const id in partner.clientes){
      findRsById(partner.clientes[id]);
    }*/
  };

  const removeAllPartners = () => {
    if(user){
      PartnerDataService.removeAll()
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const findByDen = () => {
    if(user){
      PartnerDataService.findByDen(searchDenominazione)
      .then(response => {
        setPartners(response.data);
        console.log(response.data);
        refreshSearchedList();
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const findClientesByPartnerId = (partnerId) => {
    if(user){
      ClienteDataService.findByPartners(partnerId)
      .then(response => {        
        setClientes(response.data);
        console.log('**');
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  /*
  function setRagioneSociale(id, ragioneSociale){
    if(!ragioneSocialeById.hasOwnProperty(id)){
      ragioneSociale[id] = ragioneSociale;
    } 
  }
  */

  /*
  function setRsById(id, ragioneSociale){
    if(!rsById.hasOwnProperty(id)){
      rsById[id] = ragioneSociale;
    }    
  }*/

  
  function handleAggiungiPartnerClick() {
    history.push("/addPartner");
  }


  if(user){
    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Cerca per denominazione"
              value={searchDenominazione}
              onChange={onChangeSearchDenominazione}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByDen}
              >
                Search
              </button>
              <button
              className="btn btn-success float-right"
              type="button"
              onClick={handleAggiungiPartnerClick}
            >
              Aggiungi partner
            </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Lista partners</h4>
  
          <ul className="list-group">
            {partners &&
              partners.map((partner, index) => (
                <li
                  className={
                    "list-group-item " + (index === currentIndex ? "active" : "")
                  }
                  onClick={() => setActivePartner(partner, index)}
                  key={index}
                >
                  {partner.denominazione}
                </li>
              ))}
          </ul>
          
          <button
            className="m-3 btn btn-sm btn-danger d-none"
            onClick={removeAllPartners}
          >
            Remove All
          </button>          
        </div>
        <div className="col-md-6">
          {currentPartner ? (
            <div>
              <h4>Partner</h4>
              <div>
                <label>
                  <strong>Denominazione:</strong>
                </label>{" "}
                <Link
                  to={"/partners/" + currentPartner.id}
                  className="badge badge-warning"
                >
                  {currentPartner.denominazione}
                </Link>                
              </div>

              <div>
                <label>
                  <strong>Data inizio:</strong>
                </label>{" "}
                {moment(currentPartner.dataInizio).format('YYYY-MM-DD')}
              </div>
              <div>
                <label>
                  <strong>Fatturato partner:</strong>
                </label>{" "}
                {currentPartner.fatturatoPartner}
              </div>                    

            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Partner...</p>
            </div>
          )}
        </div>
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

export default PartnersList;
