import React, { useState, useEffect } from "react";
import PartnerDataService from "../services/PartnerService";
import ClienteDataService from "../services/ClienteService";
import MacroservizioDataService from "../services/MacroservizioService";
import { Link, useHistory } from "react-router-dom";

import LegameDataService from "../services/LegameService";

import moment from 'moment'

import AuthService from "../services/auth.service";

import exportFromJSON from 'export-from-json';

import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import { saveAs } from 'file-saver';

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

  var clientiPartner = [];

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
    // var header = Object.keys(clientiById[0])
    // header =  header.map((key, index) => {
    //   if(['ragioneSociale', 'codiceFiscale', 'partitaIVA'].includes(key))
    //     return <th key={index}>{initCap(key)}</th>
    // })
    var header = [];
    header.push(<th key={1}>Ragione sociale</th>);
    header.push(<th key={2}>Codice fiscale</th>);
    header.push(<th key={2}>PartitaIva</th>);
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

  function getPartnerName(partnerid){
    for(var i in partners){
      var p = partners[i];
      if(partnerid == partners[i].id){
        return p.denominazione;
      }
    }
  }


  function retrieveLegamiByPartnerForExcel(partnerid, promises){
    var promise = new Promise( (resolve, reject) => {
      LegameDataService.findByPartnerId(partnerid)
      .then(responseLegame => {
         //SE NON CI SONO LEGAMI PER QUEL PARTNER VADO AVANTI E RISOLVO LA PROMISE
         if(responseLegame.data.length == 0){
          resolve("Promise retrieveLegamiByPartnerForExcel resolved successfully, 0 legami found"); 
          console.log('Nessun legame trovato') ;          
        }else{
          var legamiClone =  responseLegame.data;
          var promisesInternal = [];

          for(const j in legamiClone){
            var legameConNamingCompleto = legamiClone[j];
            console.log('legameConNamingCompleto');
            console.log(legameConNamingCompleto);

             var promiseInternal = new Promise( (resolve, reject) => {
            
              ClienteDataService.get(legameConNamingCompleto.clienteid)
              .then(responseCliente => {
                console.log('responseCliente.data####');
                console.log(responseCliente.data);
                resolve(responseCliente.data);


              })
              .catch(responseClienteFail => {
                console.log('responseCliente.FAIL####');
                resolve(responseClienteFail);
              });

            });

            var promiseMacro = new Promise( (resolve, reject) => {
            
              MacroservizioDataService.get(legameConNamingCompleto.servizioid)
                .then(responseMacro => {
                  console.log('responseMacro.data####');
                  console.log(responseMacro.data);
                  resolve(responseMacro.data);     
                })
                // .catch(e => {
                //   console.log(e);
                // })
                .catch(responseMacroFail => {
                  console.log('responseMacroFail.FAIL####');
                  resolve(responseMacroFail);
                });

            });

            promisesInternal.push(promiseInternal);            
            promisesInternal.push(promiseMacro);     
            promises.push(promiseInternal);     
            promises.push(promiseMacro);    

          }

          Promise.all(promisesInternal).then((anagrafiche) => {
            //clientiPartner[partnerid].push.apply(clientiPartner[partnerid], legamiClone);
            console.log('INSIDE ******+anagrafiche legameConNamingCompleto');
            console.log(anagrafiche);

            for(const j in legamiClone){
              var legm = legamiClone[j];
              for(var k in anagrafiche){
                var anag = anagrafiche[k];
                if(anag.ragioneSociale && legm.clienteid == anag.id){
                  legm.ragioneSociale = anag.ragioneSociale;
                  legm.codiceFiscale = anag.codiceFiscale;
                }
                if(anag.servizi && legm.servizioid == anag.id){
                  legm.servizioName = anag.servizi;
                }

              }
            }

            clientiPartner[partnerid]=legamiClone;

            resolve("Promise retrieveLegamiByMacroServizioForExcel resolved a prescindire"); 
          });


          
        }
        

      });
    });
    promises.push(promise);    
  }



  function retrieveLegamiByPartnerForExcelOld(partnerid, promises, ultimoPartner){
    var promise = new Promise( (resolve, reject) => {
      LegameDataService.findByPartnerId(partnerid)
      .then(response => {
        console.log('LEGAMI PER PARTNER:');
        console.log(response.data);
        //geClientiByLegameExcel(this, partnerid, response.data, promises);

        //SE NON CI SONO LEGAMI PER QUEL PARTNER VADO AVANTI E RISOLVO LA PROMISE
        if(response.data.length == 0){
          resolve("Promise retrieveLegamiByPartnerForExcel resolved successfully, 0 legami found");  
        }

        for(const i in response.data){
          var legame = response.data[i];
          //promises.push(getClienteExcel(promise, partnerid, legame.clienteid));

          ClienteDataService.get(legame.clienteid)
          .then(response => {
            console.log(response.data);
            if(!clientiPartner.hasOwnProperty(partnerid)){
              clientiPartner[partnerid] = [];
              clientiPartner[partnerid].push(response.data);
              console.log('CLIENTI PER PARTNER PRIMO IF:');
              console.log(clientiPartner);
            }else{
              var clienteExists = clientiPartner[partnerid].some(cliente => cliente.codiceFiscale === response.data.codiceFiscale);
              if(!clienteExists) {
                clientiPartner[partnerid].push(response.data);
                console.log('CLIENTI PER PARTNER ELSE:');
                console.log(clientiPartner);       
              }
      
            }
            //SONO ALL'ULTIMO FOR DEL LEGAME dell'ultimo partner
            if(ultimoPartner && !response.data[i+1])
            resolve("Promise retrieveLegamiByPartnerForExcel resolved successfully");            
          })
          .catch(e => {
            console.log(e);
            reject(Error("Promise rejected"));
          });
              
        }




        ////resolve("Promise findByPartnerId resolved successfully");
      })
      .catch(e => {
        console.log(e);
        reject(Error("Promise rejected"));
      });

    });
    //promise.then(result => console.log('LegameDataService.findByPartnerId then method'));
    promises.push(promise);
    console.log('PROMISES:');
    console.log(promises);

  };


  function getPartnerName(partnerid){
    for(var i in partners){
      var p = partners[i];
      if(partnerid == p.id){
        return p.denominazione;
      }
    }
  }


  async function handleEsportaClientiPerPartnerClick(ev, partnerid){
    console.log('partnerid****');
    console.log(partnerid);
    var promises = [];
    if(!partnerid){
      console.log('partners****');
      console.log(partners);
      for(var i in partners){
        var part = partners[i];
        console.log('part.id****');
        console.log(part.id);
        if(!clientiPartner.hasOwnProperty(part.id)){
          clientiPartner[part.id] = [];
        }
        
        retrieveLegamiByPartnerForExcel(part.id, promises);
      }
    }else{
      if(!clientiPartner.hasOwnProperty(partnerid)){
        clientiPartner[partnerid] = [];
      }
      retrieveLegamiByPartnerForExcel(partnerid, promises);
    }
    
    Promise.all(promises).then(async (values) => {
      console.log('lista aux excel');
      console.log(clientiPartner);
      console.log('Length promises:');
      console.log(promises);

      //Inizio costruzione file EXCEL
      const wb = new ExcelJS.Workbook()

      for(var pid in clientiPartner){
        var pName = getPartnerName(pid);
        var ws = wb.addWorksheet(pName);
        var cols = ['Nome Servizio', 'Ragione Sociale', 'Codice Fiscale', 'Tipo', 'Data Inizio', 'Fatturato Partner', 'Fatturato Multifinance', 'Acconto', 'Saldo', 'Note'];

        //Inserisco nomi colonne

        const colonne = ws.addRow(cols);
        colonne.font = { bold: true }
    

        for(var j in clientiPartner[pid]){            
          var cliente = clientiPartner[pid][j];
          console.log('DATA INIZIO');
          console.log(cliente.dataInizio);
          cliente.dataInizio = new Date(cliente.dataInizio).toLocaleDateString("en-GB");          
          console.log(cliente.dataInizio);
          
          //Inserisco le righe
          const righe = ws.addRow([cliente.servizioName, cliente.ragioneSociale, cliente.codiceFiscale, cliente.tipo, cliente.dataInizio, cliente.fatturatoPartner, cliente.fatturatoSocieta, cliente.acconto, cliente.saldo, cliente.note]);

        }


      }

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), 'listaClientiPerPartner.xlsx')
      clientiPartner = [];


    });
  
  }


  //FORMATTA PER LISTA CLIENTI PER PARTNER
  function handleEsportaClientiPerPartnerClickOld(){    
    var promises = [];
    for(var i in partners){
      var partner = partners[i];
      var ultimoPartner = !partners[i+1]?true:false;
      retrieveLegamiByPartnerForExcel(partner.id, promises, ultimoPartner);
    }
    Promise.all(promises).then((values) => {
      var data =[];
      console.log('DENTRO LA VALORIZZAZIONE promises');
      console.log(promises);
      console.log(clientiPartner);
      console.log(values);
      console.log('FINE VALORIZZAZIONE promises');
      for(var pid in clientiPartner){
        var pName = getPartnerName(pid);
        for(var j in clientiPartner[pid]){
          var cliente = clientiPartner[pid][j];
          var record = Object.assign({}, cliente);

          // ADD IN CERTAIN POSITION
          var keyValues = Object.entries(record); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
          keyValues.splice(0,0, ["partnerName", pName]); // insert key value at the index you want like 1.
          var newRecord = Object.fromEntries(keyValues) // convert key values to obj {key1: "value1", newKey: "newValue", key2: "value2"}

          delete newRecord.ragioneSocialeid;
          delete newRecord.createdAt;
          delete newRecord.updatedAt;
          delete newRecord.partners;
          delete newRecord.userid;
          delete newRecord.username;
          delete newRecord.username;
          delete newRecord.id;
          newRecord.dataCostituzione = new Date(newRecord.dataCostituzione).toLocaleDateString("en-GB");
          newRecord.inizioAttivita = new Date(newRecord.inizioAttivita).toLocaleDateString("en-GB");


          data.push(newRecord);
          console.log('DENTRO LA VALORIZZAZIONE DATA');
          console.log(data);

        }        
      }
      const fileName = 'listaClientiPerPartner';
      const exportType =  exportFromJSON.types.xls;
      exportFromJSON({ data, fileName, exportType });

    });
  }

  if(user){
    return (
      <div className="list row">
        {/* <div className="col-md-8"> */}
        <div>
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
            <button
              className={"btn btn-primary float-right "}
              type="button"
              onClick={handleEsportaClientiPerPartnerClick}
            >
              Esporta lista clienti partner
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

              {/* <div>
                <label>
                  <strong>Data inizio:</strong>
                </label>{" "}
                {moment(currentPartner.dataInizio).format('YYYY-MM-DD')}
              </div>                    */}

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
              <h4>Lista clienti di {currentPartner.denominazione}  
              <button
                  className={"margin-left3 btn btn-primary"}
                  type="button"                  
                  onClick={() => handleEsportaClientiPerPartnerClick(this, currentPartner.id)}
                >
                  Esporta
                </button>             
              </h4>
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
