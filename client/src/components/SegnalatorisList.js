import React, { useState, useEffect } from "react";
import SegnalatoreDataService from "../services/SegnalatoreService";
import { Link, useHistory } from "react-router-dom";

import AuthService from "../services/auth.service";

const SegnalatoresList = () => {
  const [segnalatores, setSegnalatores] = useState([]);
  const [currentSegnalatore, setCurrentSegnalatore] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchDenominazione, setSearchDenominazione] = useState("");

  const user = AuthService.getCurrentUser();
  const history = useHistory();

  useEffect(() => {
    if(user){
      retrieveSegnalatores();
    }    
  }, []);


  const onChangeSearchDenominazione = e => {
    if(user){
      const searchDenominazione = e.target.value;
      setSearchDenominazione(searchDenominazione);
    }
  };

  const retrieveSegnalatores = () => {
    if(user){
      SegnalatoreDataService.getAll()
      .then(response => {
        setSegnalatores(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const refreshList = () => {
    retrieveSegnalatores();
    retrieveSegnalatores();
    refreshSearchedList();
  };

  const refreshSearchedList = () => {    
    setCurrentSegnalatore(null);
    setCurrentIndex(-1);
  };

  const setActiveSegnalatore = (segnalatore, index) => {
    setCurrentSegnalatore(segnalatore);
    setCurrentIndex(index);
  };

  const removeAllSegnalatores = () => {
    if(user){
      SegnalatoreDataService.removeAll()
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
      SegnalatoreDataService.findByDen(searchDenominazione)
      .then(response => {
        setSegnalatores(response.data);
        console.log(response.data);
        refreshSearchedList();
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  
  function handleAggiungiSegnalatoreClick() {
    history.push("/addSegnalatore");
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
                Cerca
              </button>
              <button
              className="btn btn-success float-right"
              type="button"
              onClick={handleAggiungiSegnalatoreClick}
            >
              Aggiungi segnalatore
            </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Lista segnalatori</h4>
  
          <ul className="list-group">
            {segnalatores &&
              segnalatores.map((segnalatore, index) => (
                <li
                  className={
                    "list-group-item " + (index === currentIndex ? "active" : "")
                  }
                  onClick={() => setActiveSegnalatore(segnalatore, index)}
                  key={index}
                >
                  {segnalatore.denominazione}
                </li>
              ))}
          </ul>
          
          <button
            className="m-3 btn btn-sm btn-danger d-none"
            onClick={removeAllSegnalatores}
          >
            Remove All
          </button>          
        </div>
        <div className="col-md-6">
          {currentSegnalatore ? (
            <div>
              <h4>Segnalatore</h4>
              <div>
                <label>
                  <strong>Denominazione:</strong>
                </label>{" "}
                <Link
                  to={"/segnalatores/" + currentSegnalatore.id}
                  className="badge badge-warning"
                >
                  {currentSegnalatore.denominazione}
                </Link>                
              </div>                   
  
              
            </div>
          ) : (
            <div>
              <br />
              <p>Seleziona un Segnalatore...</p>
            </div>
          )}
        </div>
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

export default SegnalatoresList;
