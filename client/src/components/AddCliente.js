import React, { useState } from "react";
import ClienteDataService from "../services/ClienteService";

import AuthService from "../services/auth.service";

import moment from 'moment';


const AddCliente = props => {
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

  const [newNaturaGiuridica, setNewNaturaGiuridica] = useState(null);

  const user = AuthService.getCurrentUser();

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleInputNGChange = event => {
    const { name, value } = event.target;
    setNewNaturaGiuridica(value);
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
        userid: user.id,
        username: user.username,
        naturaGiuridica: newNaturaGiuridica,
        socio1: cliente.socio1,
        socio2: cliente.socio2,
        socio3: cliente.socio3,
        socio4: cliente.socio4,
        socio5: cliente.socio5,
        socio6: cliente.socio6
      };

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
          naturaGiuridica: response.data.naturaGiuridica,
          socio1: response.data.socio1,
          socio2: response.data.socio2,
          socio3: response.data.socio3,
          socio4: response.data.socio4,
          socio5: response.data.socio5,
          socio6: response.data.socio6
        });
        setSubmitted(true);        
        props.history.push("/anagrafica");
        window.location.reload();
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }   
  };

  const newCliente = () => {
    setCliente(initialClienteState);
    setSubmitted(false);
  };

  const naturaGiuridicas = [
    "Ditta Individuale",
    "Società a responsabilità limitata",
    "Società Semplice",
    "Società a responsabilità limitata semplice (srls)",
    "Società a nome collettivo(snc)",
    " Società in accomandita semplice",
    "Srl unipersonale",
    "Società cooperativa"
  ];

  const renderTableData = () => {  
    return (
        <tbody>       
          <tr key={1}>
            <td>
              <label>
                <strong>Ragione sociale:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="ragioneSociale"
                    required
                    value={cliente.ragioneSociale}
                    onChange={handleInputChange}
                    name="ragioneSociale"
                />
            </td>                         
            <td>
              <label>
                <strong>Codice fiscale:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="codiceFiscale"
                    required
                    value={cliente.codiceFiscale}
                    onChange={handleInputChange}
                    name="codiceFiscale"
                />
            </td>
            <td>
              <label>
                <strong>Partita IVA:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="partitaIVA"
                    required
                    value={cliente.partitaIVA}
                    onChange={handleInputChange}
                    name="partitaIVA"
                />
            </td>          
            <td>
              <label>
                <strong>Legale rappresentante:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="legaleRappresentate"
                    required
                    value={cliente.legaleRappresentate}
                    onChange={handleInputChange}
                    name="legaleRappresentate"
                />
            </td>
          </tr>

          <tr key={2}>
            <td>
              <label>
                <strong>Telefono:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="telefono"
                    required
                    value={cliente.telefono}
                    onChange={handleInputChange}
                    name="telefono"
                />
            </td>                    
            <td>
              <label>
                <strong>Cellulare:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="cellulare"
                    required
                    value={cliente.cellulare}
                    onChange={handleInputChange}
                    name="cellulare"
                />
            </td>        
            <td>
              <label>
                <strong>Mail:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="mail"
                    required
                    value={cliente.mail}
                    onChange={handleInputChange}
                    name="mail"
                />
            </td>
            <td>
              <label>
                <strong>Pec:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="pec"
                    required
                    value={cliente.pec}
                    onChange={handleInputChange}
                    name="pec"
                />
            </td>       
          </tr>

          <tr key={3}>
            <td>
              <label>
                <strong>Sede:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="sede"
                    required
                    value={cliente.sede}
                    onChange={handleInputChange}
                    name="sede"
                />
            </td>                    
            <td>
              <label>
                <strong>Località:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="localita"
                    required
                    value={cliente.localita}
                    onChange={handleInputChange}
                    name="localita"
                />
            </td>        
            <td>
              <label>
                <strong>Cap:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="cap"
                    required
                    value={cliente.cap}
                    onChange={handleInputChange}
                    name="cap"
                />
            </td>
            <td>
              <label>
                <strong>Data costituzione:</strong>
              </label>{" "}
              <input
                    type="date"
                    className="form-control fit-content"
                    id="dataCostituzione"
                    required
                    value={moment(cliente.dataCostituzione).format('YYYY-MM-DD')} 
                    onChange={handleInputChange}
                    name="dataCostituzione"
                />
            </td>       
          </tr>

          <tr key={4}>
            <td>
              <label>
                <strong>Inizio attività:</strong>
              </label>{" "}
              <input
                    type="date"
                    className="form-control fit-content"
                    id="inizioAttivita"
                    required
                    value={moment(cliente.inizioAttivita).format('YYYY-MM-DD')} 
                    onChange={handleInputChange}
                    name="inizioAttivita"
                />
            </td>                    
            <td>
              <label>
                <strong>Tipo:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="tipo"
                    required
                    value={cliente.tipo}
                    onChange={handleInputChange}
                    name="tipo"
                />
            </td>
            <td>
              <label>
                <strong>Dimensione:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="dimensione"
                    required
                    value={cliente.dimensione}
                    onChange={handleInputChange}
                    name="dimensione"
                />
            </td>       
            <td>
              <label>
                <strong>Att Istat Ateco 2007:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="attIstatAteco2007"
                    required
                    value={cliente.attIstatAteco2007}
                    onChange={handleInputChange}
                    name="attIstatAteco2007"
                />
            </td>
            <td>
              <label>
                <strong>Settore:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="settore"
                    required
                    value={cliente.settore} 
                    onChange={handleInputChange}
                    name="settore"
                />
            </td>       
          </tr>

          <tr key={5}>
            <td>
              <div className="form-group box">              
                <label>
                  <strong>Natura Giuridica:</strong>
                </label>{" "}
                <select defaultValue={'DEFAULT'} onClick={(e) => handleInputNGChange(e)} onChange={(e) => handleInputNGChange(e)}>
                  <option disabled value="DEFAULT">{cliente.naturaGiuridica?cliente.naturaGiuridica:"Seleziona una natura giuridica"}</option>    
                  {
                      naturaGiuridicas && naturaGiuridicas.map((natura, index) => (                  
                      
                        <option value={natura} key={index} >{natura}</option>                    
                    ))}
                  </select>
              </div>
            </td>
            <td>
              <label>
                <strong>Socio 1:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="socio1"
                    required
                    value={cliente.socio1} 
                    onChange={handleInputChange}
                    name="socio1"
                />
            </td>
            <td>
              <label>
                <strong>Socio 2:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="socio2"
                    required
                    value={cliente.socio2} 
                    onChange={handleInputChange}
                    name="socio2"
                />
            </td>    
            <td>
              <label>
                <strong>Socio 3:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="socio3"
                    required
                    value={cliente.socio3} 
                    onChange={handleInputChange}
                    name="socio3"
                />
            </td>               
           
          </tr>
          <tr key={6}>
            <td>
              <label>
                <strong>Socio 4:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="socio4"
                    required
                    value={cliente.socio4} 
                    onChange={handleInputChange}
                    name="socio4"
                />
            </td>    
            <td>
              <label>
                <strong>Socio 5:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="socio5"
                    required
                    value={cliente.socio5} 
                    onChange={handleInputChange}
                    name="socio5"
                />
            </td>    
            <td>
              <label>
                <strong>Socio 6:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="socio6"
                    required
                    value={cliente.socio6} 
                    onChange={handleInputChange}
                    name="socio6"
                />
            </td>         
          </tr>

        </tbody>
        
    )
  };


  if(user){
    return (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>Cliente inserito correttamente!</h4>
            <button className="btn btn-success" onClick={newCliente}>
              Aggiungi
            </button>
          </div>
        ) : (
          <div className="table-inserisci-anag">
              <div className="wrapper-anagrafica">
                <h4>Cliente</h4>
                  <div >
                    <table id='clientiById' className="table table-anagrafica">
                      {renderTableData()}
                    </table> 
                  </div> 
                  <button onClick={saveCliente} className="btn btn-success">
                    Conferma
                  </button>			        
              </div>                        
          </div>
        )}
      </div>
    );
  }else{
    return(
      <div>
        <br />
          <p>Effettua il login per vedere i clienti...</p>
      </div>
    );
  }
  
};

export default AddCliente;
