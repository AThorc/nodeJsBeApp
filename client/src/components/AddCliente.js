import React, { useState } from "react";
import ClienteDataService from "../services/ClienteService";

import AuthService from "../services/auth.service";

const AddCliente = () => {
  const initialClienteState = {
    id: null,
    codiceFiscale: "",
    partitaIVA: "",
    legaleRappresentate: "",
    telefono: "",
    cellulare: "",
    mail: "",
    pec: "",
    sede: "",
    localita: "",
    cap: "",
    ragioneSociale: "",
    dataCostituzione: "",
    inizioAttivita: "",
    tipo: "",
    dimensione: "",
    attIstatAteco2007: "",
    settore: ""

  };
  const [cliente, setCliente] = useState(initialClienteState);
  const [submitted, setSubmitted] = useState(false);

  const user = AuthService.getCurrentUser();

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCliente({ ...cliente, [name]: value });
  };

  const saveCliente = () => {
    if(user){
      var data = {        
        codiceFiscale: cliente.codiceFiscale,
        partitaIVA: cliente.partitaIVA,
        legaleRappresentate: cliente.legaleRappresentate,
        telefono: cliente.telefono,
        cellulare: cliente.cellulare,
        mail: cliente.mail,
        pec: cliente.pec,
        sede: cliente.sede,
        localita: cliente.localita,
        cap: cliente.cap,
        ragioneSociale: cliente.ragioneSociale,
        dataCostituzione: cliente.dataCostituzione,
        inizioAttivita: cliente.inizioAttivita,
        tipo: cliente.tipo,
        dimensione: cliente.dimensione,
        attIstatAteco2007: cliente.attIstatAteco2007,
        settore: cliente.settore,
      };
    }
    

    ClienteDataService.create(data)
      .then(response => {
        setCliente({
          id: response.data.id,
          codiceFiscale: response.data.codiceFiscale,
          partitaIVA: response.data.partitaIVA,
          legaleRappresentate: response.data.legaleRappresentate,
          telefono: response.data.telefono,
          cellulare: response.data.cellulare,
          mail: response.data.mail,
          pec: response.data.pec,
          sede: response.data.sede,
          localita: response.data.localita,
          cap: response.data.cap,
          ragioneSociale: response.data.ragioneSociale,
          dataCostituzione: response.data.dataCostituzione,
          inizioAttivita: response.data.inizioAttivita,
          tipo: response.data.tipo,
          dimensione: response.data.dimensione,
          attIstatAteco2007: response.data.attIstatAteco2007,
          settore: response.data.settore,
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const newCliente = () => {
    setCliente(initialClienteState);
    setSubmitted(false);
  };

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button className="btn btn-success" onClick={newCliente}>
            Add
          </button>
        </div>
      ) : (
        <div>
          <div className="form-group">
            <label htmlFor="title">Codice fiscale</label>
            <input
              type="text"
              className="form-control"
              id="codiceFiscale"
              required
              value={cliente.codiceFiscale}
              onChange={handleInputChange}
              name="codiceFiscale"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Partita IVA</label>
            <input
              type="text"
              className="form-control"
              id="partitaIVA"
              required
              value={cliente.partitaIVA}
              onChange={handleInputChange}
              name="partitaIVA"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Legale Rappresentate</label>
            <input
              type="text"
              className="form-control"
              id="legaleRappresentate"
              required
              value={cliente.legaleRappresentate}
              onChange={handleInputChange}
              name="legaleRappresentate"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Telefono</label>
            <input
              type="text"
              className="form-control"
              id="telefono"
              required
              value={cliente.telefono}
              onChange={handleInputChange}
              name="telefono"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Cellulare</label>
            <input
              type="text"
              className="form-control"
              id="cellulare"
              required
              value={cliente.cellulare}
              onChange={handleInputChange}
              name="cellulare"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Mail</label>
            <input
              type="text"
              className="form-control"
              id="mail"
              required
              value={cliente.mail}
              onChange={handleInputChange}
              name="mail"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Pec</label>
            <input
              type="text"
              className="form-control"
              id="pec"
              required
              value={cliente.pec}
              onChange={handleInputChange}
              name="pec"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Sede</label>
            <input
              type="text"
              className="form-control"
              id="sede"
              required
              value={cliente.sede}
              onChange={handleInputChange}
              name="sede"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Localita</label>
            <input
              type="text"
              className="form-control"
              id="localita"
              required
              value={cliente.localita}
              onChange={handleInputChange}
              name="localita"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Cap</label>
            <input
              type="text"
              className="form-control"
              id="cap"
              required
              value={cliente.cap}
              onChange={handleInputChange}
              name="cap"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Ragione sociale</label>
            <input
              type="text"
              className="form-control"
              id="ragioneSociale"
              required
              value={cliente.ragioneSociale}
              onChange={handleInputChange}
              name="ragioneSociale"
            />
          </div>


          <div className="form-group">
            <label htmlFor="description">Data costituzione</label>
            <input
              type="date"
              className="form-control"
              id="dataCostituzione"
              required
              value={cliente.dataCostituzione}
              onChange={handleInputChange}
              name="dataCostituzione"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Inizio Attivita</label>
            <input
              type="date"
              className="form-control"
              id="inizioAttivita"
              required
              value={cliente.inizioAttivita}
              onChange={handleInputChange}
              name="inizioAttivita"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="title">Tipo</label>
            <input
              type="text"
              className="form-control"
              id="tipo"
              required
              value={cliente.tipo}
              onChange={handleInputChange}
              name="tipo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Dimensione</label>
            <input
              type="text"
              className="form-control"
              id="dimensione"
              required
              value={cliente.dimensione}
              onChange={handleInputChange}
              name="dimensione"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Att. Istat Ateco 2007</label>
            <input
              type="text"
              className="form-control"
              id="attIstatAteco2007"
              required
              value={cliente.attIstatAteco2007}
              onChange={handleInputChange}
              name="attIstatAteco2007"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Settore</label>
            <input
              type="text"
              className="form-control"
              id="settore"
              required
              value={cliente.settore}
              onChange={handleInputChange}
              name="settore"
            />
          </div>

          <button onClick={saveCliente} className="btn btn-success">
            Conferma
          </button>
        </div>
      )}
    </div>
  );
};

export default AddCliente;
