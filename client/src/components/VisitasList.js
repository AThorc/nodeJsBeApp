import React, { useState, useEffect } from "react";
import VisitaDataService from "../services/VisitaService";
import { Link, useHistory } from "react-router-dom";

import AuthService from "../services/auth.service";

const VisitasList = () => {
  const [visitas, setVisitas] = useState([]);
  const [currentVisita, setCurrentVisita] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchLuogo, setSearchLuogo] = useState("");
  
  const user = AuthService.getCurrentUser();

  const history = useHistory();

  useEffect(() => {
    var user = AuthService.getCurrentUser();
    if (user) {
      retrieveVisitas(user.id);
    }
  }, []);

  const onChangeSearchLuogo = e => {
    const searchLuogo = e.target.value;
    setSearchLuogo(searchLuogo);
  };

  const retrieveVisitas = (searchUserid) => {
    VisitaDataService.getAllByUserId(searchUserid)
      .then(response => {
        setVisitas(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  function handleCreaVisitaClick() {
    history.push("/add");
  }

  /*
  const refreshList = () => {
    retrieveVisitas();
    setCurrentVisita(null);
    setCurrentIndex(-1);
  };
  */
 
  const setActiveVisita = (visita, index) => {
    setCurrentVisita(visita);
    setCurrentIndex(index);
  };

  /*
  const removeAllVisitas = () => {
    VisitaDataService.removeAll()
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };
  */

  const findByLuogo = (searchUserid, searchLuogo) => {
    VisitaDataService.findByLuogo(searchUserid, searchLuogo)
      .then(response => {
        setVisitas(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by luogo"
            value={searchLuogo}
            onChange={onChangeSearchLuogo}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => findByLuogo(user.id, searchLuogo)}
            >
              Search
            </button>
            <button
              className="btn btn-success float-right"
              type="button"
              onClick={handleCreaVisitaClick}
            >
              Crea Visita
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Visitas List</h4>

        <ul className="list-group">
          {visitas &&
            visitas.map((visita, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveVisita(visita, index)}
                key={index}
              >
                {visita.luogo}
              </li>
            ))}
        </ul>
        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={false}
        >
          Remove All
        </button>        
      </div>
      <div className="col-md-6">
        {currentVisita ? (
          <div>
            <h4>Visita</h4>
            <div>
              <label>
                <strong>Luogo:</strong>
              </label>{" "}
              {currentVisita.luogo}
            </div>
            <div>
              <label>
                <strong>Data avvio:</strong>
              </label>{" "}
              {currentVisita.data_avvio}
            </div>
            <div>
              <label>
                <strong>Data scadenza:</strong>
              </label>{" "}
              {currentVisita.data_scadenza}
            </div>
            <div>
              <label>
                <strong>Nome paziente:</strong>
              </label>{" "}
              {currentVisita.nomePaziente}
            </div>
            <div>
              <label>
                <strong>Cognome paziente:</strong>
              </label>{" "}
              {currentVisita.cognomePaziente}
            </div>

            <Link
              to={"/visitas/" + currentVisita.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Seleziona un Visita...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitasList;
