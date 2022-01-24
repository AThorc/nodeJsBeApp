import React, { useState, useEffect } from "react";
import PartnerDataService from "../services/PartnerService";
import ClienteDataService from "../services/ClienteService";
import { Link, useHistory } from "react-router-dom";

import LegameDataService from "../services/LegameService";

import moment from 'moment'

import AuthService from "../services/auth.service";

const PartnersList = () => {
  const [partners, setPartners] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchDenominazione, setSearchDenominazione] = useState("");

  //const [clientiIdByLegame, setClientiIdByLegame] = useState([]);

  const [clientiById, setClientiById] = useState([]);

  //var ragioneSociale = [];

  var clientesExecuted = [];

  const user = AuthService.getCurrentUser();
  const showAdminBoard = user.roles.includes("ROLE_ADMIN");

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

  function geClientiByLegame(legami){
    for(const i in legami){
      var legame = legami[i];
      getCliente(legame.clienteid);
          
    }
  };


  const getCliente = id => {
    if(user && !clientesExecuted.includes(id)){
      clientesExecuted.push(id);
      ClienteDataService.get(id)
      .then(response => {
        addClienteById(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
  };

  const addClienteById = (newClienteById) => setClientiById(state => [...state, newClienteById]);

  const initCap = (text) => {
    return text.toLowerCase().charAt(0).toUpperCase()+(text.slice(1).toLowerCase());
  }

  const retrieveLegamiByPartner = (partnerid) => {
    if(user){
      setClientiById([]);
      LegameDataService.findByPartnerId(partnerid)
      .then(response => {
        geClientiByLegame(response.data);
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

    retrieveLegamiByPartner(partner.id);
  };

  const removeAllPartners = () => {
    if(user && showAdminBoard){
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

  const renderTableHeader = () => {
    var header = Object.keys(clientiById[0])
    header =  header.map((key, index) => {
      if(['ragioneSociale', 'codiceFiscale', 'partitaIVA'].includes(key))
        return <th key={index}>{initCap(key)}</th>
    })
    return header;
 };


 const renderTableData = () => {
  return clientiById.map((cliente, index) => {    
    return (
        <tr key={index}>
          <td>
            {/* <Link
              to={"/clientes/" + cliente.id}
              className="badge badge-warning"
            >
              {cliente.ragioneSociale}
            </Link>                 */}
            <Link
              to={{
                pathname: "/anagrafica/" + cliente.id,
                cliente: cliente                
              }}
              className="badge badge-warning"
            >
              {cliente.ragioneSociale}
            </Link>
          </td>         
          <td>{cliente.codiceFiscale}</td>         
          <td>{cliente.partitaIVA}</td>         
        </tr>
    )
  })
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
                Cerca
              </button>
              <button
              className={"btn btn-success float-right " + (!showAdminBoard ? "d-none" : "")}
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
                {showAdminBoard ? (
                  <Link
                    to={"/partners/" + currentPartner.id}
                    className="badge badge-warning"
                  >
                    {currentPartner.denominazione}
                  </Link>
                  ) : (
                    currentPartner.denominazione
                  )
                }
                                  
              </div>

              <div>
                <label>
                  <strong>Data inizio:</strong>
                </label>{" "}
                {moment(currentPartner.dataInizio).format('YYYY-MM-DD')}
              </div>                   

            </div>
          ) : (
            <div>
              <br />
              <p>Seleziona un Partner...</p>
            </div>
          )}
        </div>
        
        <div className="col-md-6">
          {currentPartner ? (
            <div>
              <h4>Lista clienti di {currentPartner.denominazione}</h4>
              {clientiById && clientiById.length > 0 ? (
                <div>
                  <table id='clientiById' className="table w-auto">
                    <tbody>
                        <tr>{renderTableHeader()}</tr>
                        {renderTableData()}
                    </tbody>
                  </table>
                </div> ):(<div>
                </div>
              )}                   

            </div>
          ) : (
            <div>
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
