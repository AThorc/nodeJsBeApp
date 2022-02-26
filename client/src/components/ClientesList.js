import React, { useState, useEffect } from "react";

import ClienteDataService from "../services/ClienteService";
import ServizioDataService from "../services/ServizioService";
import { Link, useHistory } from "react-router-dom";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";

import moment from 'moment';

import ModificaDataService from "../services/ModificaService";

import exportFromJSON from 'export-from-json';


const ClientesList = props => {
  const [clientes, setClientes] = useState([]);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchRagioneSociale, setSearchRagioneSociale] = useState("");

  const [servizios, setServizios] = useState([]);
  const [currentServizio, setCurrentServizio] = useState(null);
  const [currentServizioIndex, setCurrentServizioIndex] = useState(-1);

  const [message, setMessage] = useState("");

  const user = AuthService.getCurrentUser();
  const showAdminBoard = user.roles.includes("ROLE_ADMIN");
  const history = useHistory();

  const [newNaturaGiuridica, setNewNaturaGiuridica] = useState(null);



  useEffect(() => {
    if(user){
      retrieveClientes();
      if(history.location.cliente){
        setCurrentCliente(history.location.cliente);
      }
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
    if(user && showAdminBoard){
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

  const removeAllServizios = () => {
    if(user && showAdminBoard){
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


  function handleEsportaClientiClick() {    
    //const data = [{'a':1, 'b':2},{'a':3, 'b':4}];
    const data = clientes;
    const fileName = 'listaClienti';
    const exportType =  exportFromJSON.types.xls;
    exportFromJSON({ data, fileName, exportType });
  }


  const updateCliente = () => {
    if(user && showAdminBoard){
      currentCliente.userid = user.id;
      currentCliente.username = user.username;
      if(newNaturaGiuridica && newNaturaGiuridica != 'DEFAULT') currentCliente.naturaGiuridica = newNaturaGiuridica;
      ClienteDataService.update(currentCliente.id, currentCliente)
      .then(response => {
        console.log(response.data);
        setMessage("Il cliente è stato aggiornato correttamente!");
        // refreshList();
        window.location.reload();
      })
      .catch(e => {
        console.log(e);
      });
    }
   
  };

  const deleteCliente = () => {
    if(user && showAdminBoard){
      ClienteDataService.remove(currentCliente.id)
      .then(response => {
        // console.log(response.data);
        // refreshList();

        var modifica = {        
          data: new Date(),          
          userid: user.id,
          username: user.username,
        };
        //Creo il record di modifica
        ModificaDataService.create(modifica).then(response => {        
          props.history.push("/anagrafica");
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
    
  };

  const handleInputNGChange = event => {
    const { name, value } = event.target;
    setNewNaturaGiuridica(value);
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
                    disabled={!showAdminBoard}
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
                    disabled={!showAdminBoard}
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
                    disabled={!showAdminBoard}
                />
            </td>          
            
          </tr>

          <tr key={2}>
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
                      disabled={!showAdminBoard}
                  />
              </td>

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
                    disabled={!showAdminBoard}
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
                    disabled={!showAdminBoard}
                />
            </td>                    
          </tr>

          <tr key={3}>
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
                    disabled={!showAdminBoard}
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
                    disabled={!showAdminBoard}
                />
            </td>       

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
                    disabled={!showAdminBoard}
                />
            </td>                    
           
          </tr>

          <tr key={4}>
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
                    disabled={!showAdminBoard}
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
                    disabled={!showAdminBoard}
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
                    disabled={!showAdminBoard}
                />
            </td>       
          </tr>

          <tr key={5}>
            
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
                    disabled={!showAdminBoard}
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
                    disabled={!showAdminBoard}
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
                    disabled={!showAdminBoard}
                />
            </td>       
            
           
          </tr>
          <tr key={6}>
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
                    disabled={!showAdminBoard}
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
                    disabled={!showAdminBoard}
                />
            </td>       

            <td>
              <div className="form-group box">              
                <label>
                  <strong>Natura Giuridica:</strong>
                </label>{" "}<br/>
                <select defaultValue={'DEFAULT'} onClick={(e) => handleInputNGChange(e)} onChange={(e) => handleInputNGChange(e)}>
                  <option disabled={!showAdminBoard} value="DEFAULT">{currentCliente.naturaGiuridica?currentCliente.naturaGiuridica:"Seleziona una natura giuridica"}</option>    
                  {
                      naturaGiuridicas && naturaGiuridicas.map((natura, index) => (                  
                      
                        <option disabled={!showAdminBoard} value={natura} key={index} >{natura}</option>                    
                    ))}
                  </select>
              </div>
            </td>            
          </tr>
          <tr key={7}>
            <td>
              <label>
                <strong>Socio 1:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="socio1"
                    required
                    value={currentCliente.socio1} 
                    onChange={handleInputChange}
                    name="socio1"
                    disabled={!showAdminBoard}
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
                    value={currentCliente.socio2} 
                    onChange={handleInputChange}
                    name="socio2"
                    disabled={!showAdminBoard}
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
                    value={currentCliente.socio3} 
                    onChange={handleInputChange}
                    name="socio3"
                    disabled={!showAdminBoard}
                />
            </td>                        

          </tr>
         
         <tr key ={8}>
           <td>
              <label>
                <strong>Socio 4:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="socio4"
                    required
                    value={currentCliente.socio4} 
                    onChange={handleInputChange}
                    name="socio4"
                    disabled={!showAdminBoard}
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
                    value={currentCliente.socio5} 
                    onChange={handleInputChange}
                    name="socio5"
                    disabled={!showAdminBoard}
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
                    value={currentCliente.socio6} 
                    onChange={handleInputChange}
                    name="socio6"
                    disabled={!showAdminBoard}
                />
            </td>         

         </tr>

        </tbody>
        
    )
  };


  if(user){
    return (
      <div className="list row">
        {/* <div className="col-md-8"> */}
        <div>
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
              className={"btn btn-success float-right " + (!showAdminBoard ? "d-none" : "")}
              type="button"
              onClick={handleAggiungiClienteClick}
            >
              Aggiungi cliente
            </button>
            <button
              className={"btn btn-primary float-right "}
              type="button"
              onClick={handleEsportaClientiClick}
            >
              Esporta lista clienti
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
                  {cliente.ragioneSociale}
                </li>
              ))}
          </ul>
          
          <button
            className="m-3 btn btn-sm btn-danger d-none"
            onClick={removeAllClientes}
            disabled={!showAdminBoard}
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
                  className={"btn btn-danger " + (!showAdminBoard ? "d-none" : "")}
                />

                <ConfirmDialog 
                  title= 'Aggiorna'
                  message= 'Sei sicuro di voler aggiornare il cliente?'
                  onClickYes= {updateCliente}
                  className={"btn btn-primary "+ (!showAdminBoard ? "d-none" : "")}  
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
