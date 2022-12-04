import React, { useState, useEffect } from "react";
import ClienteDataService from "../services/ClienteService";
import { Link, useHistory } from "react-router-dom";


import moment from 'moment';

import AuthService from "../services/auth.service";

const Scadenziario = () => {  

  const user = AuthService.getCurrentUser();
  const showAdminBoard = user.roles.includes("ROLE_ADMIN");

  const history = useHistory();

  const [clientes, setClientes] = useState([]);
  const [clientiConScadenzaDoc, setClientiConScadenzaDoc] = useState([]);
  const [clientiSenzaDoc, setClientiSenzaDoc] = useState([]);

  const retrieveClientes = () => {
    if(user){
      ClienteDataService.getAll()
      .then(response => {
        //setClientes(response.data);
        var lowerDay = new Date();
        lowerDay.setDate(lowerDay.getDate() - 10);
        setClientes(response.data.sort((a, b) => a.ragioneSociale.toLowerCase() > b.ragioneSociale.toLowerCase() ? 1 : -1));

        setClientiSenzaDoc(response.data.sort((a, b) => a.ragioneSociale.toLowerCase() > b.ragioneSociale.toLowerCase() ? 1 : -1)
                                        .filter(cliente => cliente.numeroDocumento == undefined || cliente.numeroDocumento == '' || 
                                                    cliente.scadenzaDocumento == undefined || cliente.scadenzaDocumento == ''
                                        ));
                                

        setClientiConScadenzaDoc(response.data.sort((a, b) => a.ragioneSociale.toLowerCase() > b.ragioneSociale.toLowerCase() ? 1 : -1)
                                              .filter(cliente => cliente.scadenzaDocumento!=undefined && cliente.scadenzaDocumento != '' && (new Date(cliente.scadenzaDocumento)) >= lowerDay
                                                ));                                

        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  useEffect(() => {
    if(user){
      retrieveClientes();
    }    
  }, []);

  if(user){
    return (
      <div>        
        <h4>Lista scadenze documenti</h4>
        <ul className="list-group search-anag-clienti">
            {clientiSenzaDoc &&
              clientiSenzaDoc.map((cliente, index) => (
                <li
                  className="list rowScadenziario"
                  key={index}
                >
                  Attenzione: Per il cliente {cliente.ragioneSociale} documento o data scadenza non presenti!
                </li>
              ))}
              {clientiConScadenzaDoc &&
              clientiConScadenzaDoc.map((cliente, index) => (
                <li
                  className="list rowScadenziario"
                  key={index}
                >
                  Attenzione: Documento {cliente.numeroDocumento} del cliente {cliente.ragioneSociale} sta per scadere! (Data scadenza: {moment(cliente.scadenzaDocumento).format('YYYY-MM-DD')})
                </li>
              ))}
          </ul>
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

export default Scadenziario;
