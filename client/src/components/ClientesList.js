import React, { useState, useEffect } from "react";
import ClienteDataService from "../services/ClienteService";
import ServizioDataService from "../services/ServizioService";
import { Link, useHistory } from "react-router-dom";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";

import moment from 'moment';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchRagioneSociale, setSearchRagioneSociale] = useState("");

  const [servizios, setServizios] = useState([]);
  const [currentServizio, setCurrentServizio] = useState(null);
  const [currentServizioIndex, setCurrentServizioIndex] = useState(-1);

  const [message, setMessage] = useState("");

  const user = AuthService.getCurrentUser();
  const history = useHistory();

  useEffect(() => {
    if(user){
      retrieveClientes();
    }    
  }, []);


  const onChangeSearchRagioneSociale = e => {
    if(user){
      const searchRagioneSociale = e.target.value;
      setSearchRagioneSociale(searchRagioneSociale);
    }
  };

  const retrieveClientes = () => {
    if(user){
      ClienteDataService.getAll()
      .then(response => {
        setClientes(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const refreshList = () => {
    retrieveClientes();
    refreshSearchedList();
  };

  const refreshSearchedList = () => {    
    setCurrentCliente(null);
    setCurrentIndex(-1);
  };
  

  const setActiveCliente = (cliente, index) => {
    setCurrentCliente(cliente);
    setCurrentIndex(index);
  };

  const setActiveServizio = (servizio, index) => {
    setCurrentServizio(servizio);
    setCurrentServizioIndex(index);
  };

  const removeAllClientes = () => {
    if(user){
      ClienteDataService.removeAll()
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };


  const removeAllServizios = () => {
    if(user){
      ServizioDataService.removeAll()
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const findByRs = () => {
    if(user){
      ClienteDataService.findByRs(searchRagioneSociale)
      .then(response => {
        setClientes(response.data);
        console.log(response.data);
        refreshSearchedList();
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };
  
  function handleAggiungiClienteClick() {
    history.push("/addCliente");
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentCliente({ ...currentCliente, [name]: value });
  };  


  function handleAggiungiMacroservizioClick() {
    history.push("/addMacroservizio");
  }


  const updateCliente = () => {
    if(user){
      ClienteDataService.update(currentCliente.id, currentCliente)
      .then(response => {
        console.log(response.data);
        setMessage("Il cliente è stato aggiornato correttamente!");
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
    }
   
  };

  const deleteCliente = () => {
    if(user){
      ClienteDataService.remove(currentCliente.id)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };




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
                    value={currentCliente.ragioneSociale}
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
                    value={currentCliente.codiceFiscale}
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
                    value={currentCliente.partitaIVA}
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
                    value={currentCliente.legaleRappresentate}
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
                    value={currentCliente.telefono}
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
                    value={currentCliente.cellulare}
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
                    value={currentCliente.mail}
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
                    value={currentCliente.pec}
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
                    value={currentCliente.sede}
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
                    value={currentCliente.localita}
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
                    value={currentCliente.cap}
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
                    value={moment(currentCliente.dataCostituzione).format('YYYY-MM-DD')} 
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
                    value={moment(currentCliente.inizioAttivita).format('YYYY-MM-DD')} 
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
                    value={currentCliente.tipo}
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
                    value={currentCliente.dimensione}
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
                    value={currentCliente.attIstatAteco2007}
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
                    value={currentCliente.settore} 
                    onChange={handleInputChange}
                    name="settore"
                />
            </td>       
          </tr>

        </tbody>
        
    )
  };


  if(user){
    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Cerca per ragione sociale"
              value={searchRagioneSociale}
              onChange={onChangeSearchRagioneSociale}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={findByRs}
              >
                Cerca
              </button>
              <button
              className="btn btn-success float-right"
              type="button"
              onClick={handleAggiungiClienteClick}
            >
              Aggiungi cliente
            </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Lista clienti</h4>
  
          <ul className="list-group search-anag-clienti">
            {clientes &&
              clientes.map((cliente, index) => (
                <li
                  className={
                    "list-group-item " + (index === currentIndex ? "active" : "")
                  }
                  onClick={() => setActiveCliente(cliente, index)}
                  key={index}
                >
                  {cliente.codiceFiscale}
                </li>
              ))}
          </ul>
          
          <button
            className="m-3 btn btn-sm btn-danger d-none"
            onClick={removeAllClientes}
          >
            Remove All
          </button>          
        </div>
        <div className="col-md-6">
        
          {currentCliente ? (
              <div className="wrapper-anagrafica">
                <h4>Cliente</h4>
                  <div>
                    <table id='clientiById' className="table table-anagrafica">
                      {renderTableData()}
                    </table> 
                  </div>  

				
			        	<br></br>
                
                <ConfirmDialog 
                  title= 'Cancella'
                  message= 'Sei sicuro di voler cancellare il cliente?'
                  onClickYes= {deleteCliente}
                  className="btn btn-danger"
                />

                <ConfirmDialog 
                  title= 'Aggiorna'
                  message= 'Sei sicuro di voler aggiornare il cliente?'
                  onClickYes= {updateCliente}
                  className="btn btn-primary"
                />

                <Link
                  to={"/clientes/" + currentCliente.id}
                  className="btn btn-warning"
                >
                  Visualizza servizi                
                </Link>
				  
              </div>
              
            ) : (
              <div className="wrapper-anagrafica">
                <br />
                <p>Seleziona un Cliente...</p>
              </div>
            )}        


        </div> 
        
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

export default ClientesList;
