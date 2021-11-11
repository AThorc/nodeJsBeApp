import React, { useState, useEffect } from "react";
import VisitaDataService from "../services/VisitaService";

import moment from 'moment'

const Visita = props => {
  const initialVisitaState = {
    id: null,
    luogo: "",
    data_avvio: "",
    data_scadenza: "",
    nomePaziente: "",
    cognomePaziente: ""
  };
  const [currentVisita, setCurrentVisita] = useState(initialVisitaState);
  const [message, setMessage] = useState("");

  const getVisita = id => {
    VisitaDataService.get(id)
      .then(response => {
        setCurrentVisita(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getVisita(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentVisita({ ...currentVisita, [name]: value });
  };

  /*
  const updatePublished = status => {
    var data = {
      id: currentVisita.id,
      luogo: currentVisita.luogo,
      data_avvio: currentVisita.data_avvio,
      data_scadenza: currentVisita.data_scadenza
    };

    VisitaDataService.update(currentVisita.id, data)
      .then(response => {
        setCurrentVisita({ ...currentVisita, published: status });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  */


  const updateVisita = () => {
    VisitaDataService.update(currentVisita.id, currentVisita)
      .then(response => {
        console.log(response.data);
        setMessage("The visita was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteVisita = () => {
    VisitaDataService.remove(currentVisita.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/visitas");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentVisita ? (
        <div className="edit-form">
          <h4>Visita</h4>
          <form>
            <div className="form-group">
              <label htmlFor="luogo">Luogo</label>
              <input
                type="text"
                className="form-control"
                id="luogo"
                name="luogo"
                value={currentVisita.luogo}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="data_avvio">Data avvio</label>
              <input
                type="date"
                className="form-control"
                id="data_avvio"
                name="data_avvio"
                value={moment(currentVisita.data_avvio).format('YYYY-MM-DD')}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
            <label htmlFor="data_scadenza">Data scadenza</label>
              <input
                type="date"
                className="form-control"
                id="data_scadenza"
                name="data_scadenza"
                value={moment(currentVisita.data_scadenza).format('YYYY-MM-DD')}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
            <label htmlFor="nomePaziente">Nome paziente</label>
              <input
                type="text"
                className="form-control"
                id="nomePaziente"
                name="nomePaziente"
                value={currentVisita.nomePaziente}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
            <label htmlFor="data_scadenza">Cognome paziente</label>
              <input
                type="text"
                className="form-control"
                id="cognomePaziente"
                name="cognomePaziente"
                value={currentVisita.cognomePaziente}
                onChange={handleInputChange}
              />
            </div>
          </form>

          {currentVisita.published ? (
            <button
              className="badge badge-primary mr-2"
              onClick={false}
            >
              UnPublish
            </button>
          ) : (
            <button
              className="badge badge-primary mr-2"
              onClick={false}
            >
              Publish
            </button>
          )}

          <button className="badge badge-danger mr-2" onClick={false}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateVisita}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Visita...</p>
        </div>
      )}
    </div>
  );
};

export default Visita;
