import React, { useState, useEffect } from "react";
import MacroservizioDataService from "../services/MacroservizioService";
import ClienteDataService from "../services/ClienteService";
import LegameDataService from "../services/LegameService";
import PartnerDataService from "../services/PartnerService";

import { Link, useHistory } from "react-router-dom";

import moment from 'moment'

import AuthService from "../services/auth.service";

import exportFromJSON from 'export-from-json';

import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import { saveAs } from 'file-saver';

const MacroserviziList = () => {
  const [macroservizi, setMacroservizi] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [currentMacroservizio, setCurrentMacroservizio] = useState(null);
  const [currentListaLegameMacroservizio, setCurrentListaLegameMacroservizio] = useState(null);

  const [clientesLegame, setClientesLegame] = useState([]);
  const [partnersLegame, setPartnersLegame] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchDenominazione, setSearchDenominazione] = useState("");

  //var ragioneSociale = [];


  const user = AuthService.getCurrentUser();
  const showAdminBoard = user.roles.includes("ROLE_ADMIN");
  const history = useHistory();


  var clientesExecuted = [];
  var partnersExecuted = [];

  var clientiMacroservizio = [];

  useEffect(() => {
    if(user){
      retrieveMacroservizi();
    }    
  }, []);


  const onChangeSearchDenominazione = e => {
    if(user){
      const searchDenominazione = e.target.value;
      setSearchDenominazione(searchDenominazione);
    }
  };

  const retrieveMacroservizi = () => {
    if(user){
      MacroservizioDataService.getAll()
      .then(response => {
        setMacroservizi(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const refreshList = () => {
    retrieveMacroservizi();
    refreshSearchedList();
  };

  const refreshSearchedList = () => {    
    setCurrentMacroservizio(null);
    setCurrentIndex(-1);
    setCurrentListaLegameMacroservizio(null);
  };

  const addClienteLegame = (newClienteLegame) => setClientesLegame(state => [...state, newClienteLegame]);
  const addPartnerLegame = (newPartnerLegame) => setPartnersLegame(state => [...state, newPartnerLegame]);

  const getCliente = id => {
    console.log('exec');
    console.log(clientesExecuted);
    if(user && !clientesExecuted.includes(id)){
      clientesExecuted.push(id);
      ClienteDataService.get(id)
      .then(response => {
        addClienteLegame(response.data.id + '-' + response.data.ragioneSociale);
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };

  const getPartner = id => {
    if(user && !partnersExecuted.includes(id)){
      partnersExecuted.push(id);
      PartnerDataService.get(id)
      .then(response => {
          addPartnerLegame(response.data.id + '-' + response.data.denominazione);       
      })
      .catch(e => {
        console.log(e);
      });
    }
    
  };


  const retrieveLegami = servizioid => {
    if(user){
      setClientesLegame([]);
      setPartnersLegame([]);
      LegameDataService.findByServizioId(servizioid)
      .then(response => {
        setCurrentListaLegameMacroservizio(response.data);
        console.log(response.data);
        for(const i in response.data){
          var legame = response.data[i];
          getCliente(legame.clienteid);
          getPartner(legame.partnerid);
        }            
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  const setActiveMacroservizio = (macroservizio, index) => {
    setCurrentMacroservizio(macroservizio);
    setCurrentIndex(index);
    
    setCurrentListaLegameMacroservizio(null);
  };

  const removeAllMacroservizi = () => {
    if(user && showAdminBoard){
      MacroservizioDataService.removeAll()
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
      MacroservizioDataService.findByDen(searchDenominazione)
      .then(response => {
        setMacroservizi(response.data);
        console.log(response.data);
        refreshSearchedList();
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };

  function handleAggiungiMacroservizioClick() {
    history.push("/addMacroservizio");
  }

  function handleAssociaServizioClick(macroservizio) {
    history.push("/associaServizio/"+macroservizio.id);
  }


  function getMacroservizioName(macroservizioid){
    for(var i in macroservizi){
      var m = macroservizi[i];
      if(macroservizioid == macroservizi[i].id){
        return m.servizi;
      }
    }
  }


  // function retrieveLegamiByMacroServizioForExcel(macroservizioid, promises, ultimoMacroservizio){
  //   var promise = new Promise( (resolve, reject) => {
  //     LegameDataService.findByServizioId(macroservizioid)
  //     .then(response => {
  //       console.log('LEGAMI PER macroservizio:');
  //       console.log(response.data);
  //       //geClientiByLegameExcel(this, partnerid, response.data, promises);

  //       //SE NON CI SONO LEGAMI PER QUEL PARTNER VADO AVANTI E RISOLVO LA PROMISE
  //       if(response.data.length == 0){
  //         resolve("Promise retrieveLegamiByMacroServizioForExcel resolved successfully, 0 legami found");  
  //       }

  //       for(const i in response.data){
  //         var legame = response.data[i];
  //         //promises.push(getClienteExcel(promise, partnerid, legame.clienteid));

  //         ClienteDataService.get(legame.clienteid)
  //         .then(responseCliente => {
  //           console.log(responseCliente.data);
  //           if(!clientiMacroservizio.hasOwnProperty(macroservizioid)){
  //             clientiMacroservizio[macroservizioid] = [];
  //             clientiMacroservizio[macroservizioid].push(responseCliente.data);
  //             console.log('CLIENTI PER macroservizio PRIMO IF:');
  //             console.log(clientiMacroservizio);
  //           }else{
             
  //             clientiMacroservizio[macroservizioid].push(responseCliente.data);
  //             console.log('CLIENTI PER macroservizio ELSE:');
  //             console.log(clientiMacroservizio);       
            
      
  //           }
  //           //SONO ALL'ULTIMO FOR DEL LEGAME dell'ultimo cliente
  //           if(ultimoMacroservizio && i == response.data.length-1)
  //           resolve("Promise retrieveLegamiByMacroServizioForExcel resolved successfully");            
  //         })
  //         .catch(e => {
  //           console.log(e);
  //           reject(Error("Promise rejected"));
  //         });
              
  //       }




  //       ////resolve("Promise findByPartnerId resolved successfully");
  //     })
  //     .catch(e => {
  //       console.log(e);
  //       reject(Error("Promise rejected"));
  //     });

  //   });
  //   //promise.then(result => console.log('LegameDataService.findByPartnerId then method'));
  //   promises.push(promise);
  //   console.log('PROMISES:');
  //   console.log(promises);

  // };

  function getPartnerDenominazioneByLegameId(legame){
    partnersLegame.filter(partner => partner.includes(legame.partnerid)).toString().substring(partnersLegame.filter(partner => partner.includes(legame.partnerid)).toString().indexOf('-')+1)
  };

  function retrieveLegamiByMacroServizioForExcelOld(macroservizioid, promises, ultimoMacroservizio){
    var promise = new Promise( (resolve, reject) => {
      LegameDataService.findByServizioId(macroservizioid)
      .then(response => {
        console.log('LEGAMI PER macroservizio:');
        console.log(response.data);
        //geClientiByLegameExcel(this, partnerid, response.data, promises);

        //SE NON CI SONO LEGAMI PER QUEL PARTNER VADO AVANTI E RISOLVO LA PROMISE
        if(response.data.length == 0){
          resolve("Promise retrieveLegamiByMacroServizioForExcel resolved successfully, 0 legami found");  
        }

        for(const i in response.data){
          var legame = response.data[i];

          var legameConNamingCompleto =  Object.assign({}, legame);
          //promises.push(getClienteExcel(promise, partnerid, legame.clienteid));

          ClienteDataService.get(legameConNamingCompleto.clienteid)
          .then(responseCliente => {
            console.log('responseCliente.data####');
            console.log(responseCliente.data);

            
            //Aggiungo solo RS e CF per ora
            legameConNamingCompleto.ragioneSociale = responseCliente.data.ragioneSociale;
            legameConNamingCompleto.codiceFiscale = responseCliente.data.codiceFiscale;

            //Aggiungo partner denominazione
            legameConNamingCompleto.partnerDenominazione = getPartnerDenominazioneByLegameId(legameConNamingCompleto);

            if(!clientiMacroservizio.hasOwnProperty(macroservizioid)){
              clientiMacroservizio[macroservizioid] = [];



              clientiMacroservizio[macroservizioid].push(legameConNamingCompleto);
              console.log('CLIENTI PER macroservizio PRIMO IF:');
              console.log(clientiMacroservizio);
            }else{
             
              clientiMacroservizio[macroservizioid].push(legameConNamingCompleto);
              console.log('CLIENTI PER macroservizio ELSE:');
              console.log(clientiMacroservizio);       
            
      
            }
            //SONO ALL'ULTIMO FOR DEL LEGAME dell'ultimo cliente
            if(ultimoMacroservizio && i == response.data.length-1)
            resolve("Promise retrieveLegamiByMacroServizioForExcel resolved successfully");  
            console.log('ULTIMO LEGAME ULTIMO CLIENTE******');      
            console.log(clientiMacroservizio);        

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


  function retrieveLegamiByMacroServizioForExcel(macroservizioid, promises){
    var promise = new Promise( (resolve, reject) => {
      LegameDataService.findByServizioId(macroservizioid)
      .then(responseLegame => {
         //SE NON CI SONO LEGAMI PER QUEL PARTNER VADO AVANTI E RISOLVO LA PROMISE
         if(responseLegame.data.length == 0){
          resolve("Promise retrieveLegamiByMacroServizioForExcel resolved successfully, 0 legami found"); 
          console.log('Nessun legame trovato') ;          
        }else{
          console.log('#ASDASF');
          console.log(responseLegame);
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

              
              ;

            });

            var promisePartners = new Promise( (resolve, reject) => {
            
              PartnerDataService.get(legameConNamingCompleto.partnerid)
                .then(responsePartner => {
                  console.log('responsePartner.data####');
                  console.log(responsePartner.data);
                  resolve(responsePartner.data);     
                })
                .catch(e => {
                  console.log(e);
                })
                 // .catch(e => {
                //   console.log(e);
                // })
                .catch(responsePartnerFail => {
                  console.log('responsePartnerFail.FAIL####');
                  resolve(responsePartnerFail);
                });
                ;

            });

            promisesInternal.push(promiseInternal);            
            promisesInternal.push(promisePartners);     
            promises.push(promiseInternal);     
            promises.push(promisePartners);    

          }

          Promise.all(promisesInternal).then((anagrafiche) => {
            //clientiMacroservizio[macroservizioid].push.apply(clientiMacroservizio[macroservizioid], legamiClone);
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
                if(anag.denominazione && legm.partnerid == anag.id){
                  legm.partnerName = anag.denominazione;
                }

              }
            }

            clientiMacroservizio[macroservizioid]=legamiClone;

            resolve("Promise retrieveLegamiByMacroServizioForExcel resolved a prescindire"); 
          });


          
        }
        

      });
    });
    promises.push(promise);    
  }


  //FORMATTA PER LISTA CLIENTI PER MACRO SERVIZIO
  // function handleEsportaClientiPerMacroServizioClick(){    
  //   var promises = [];
  //   for(var i in macroservizi){
  //     var macroservizio = macroservizi[i];
  //     var ultimoMacroServizio = !macroservizio[i+1]?true:false;
  //     retrieveLegamiByMacroServizioForExcel(macroservizio.id, promises, ultimoMacroServizio);
  //   }
  //   Promise.all(promises).then((values) => {
  //     var data =[];
  //     console.log('DENTRO LA VALORIZZAZIONE promises');
  //     console.log(promises);
  //     console.log(clientiMacroservizio);
  //     console.log(values);
  //     console.log('FINE VALORIZZAZIONE promises');
  //     for(var mid in clientiMacroservizio){
  //       var mName = getMacroservizioName(mid);
  //       for(var j in clientiMacroservizio[mid]){
  //         var cliente = clientiMacroservizio[mid][j];
  //         var record = Object.assign({}, cliente);

  //         // ADD IN CERTAIN POSITION
  //         var keyValues = Object.entries(record); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
  //         keyValues.splice(0,0, ["MacroServizioName", mName]); // insert key value at the index you want like 1.
  //         var newRecord = Object.fromEntries(keyValues) // convert key values to obj {key1: "value1", newKey: "newValue", key2: "value2"}

  //         delete newRecord.ragioneSocialeid;
  //         delete newRecord.createdAt;
  //         delete newRecord.updatedAt;
  //         delete newRecord.partners;
  //         delete newRecord.userid;
  //         delete newRecord.username;
  //         delete newRecord.username;
  //         delete newRecord.id;
  //         newRecord.dataCostituzione = new Date(newRecord.dataCostituzione).toLocaleDateString("en-GB");
  //         newRecord.inizioAttivita = new Date(newRecord.inizioAttivita).toLocaleDateString("en-GB");


  //         data.push(newRecord);
  //         console.log('DENTRO LA VALORIZZAZIONE DATA');
  //         console.log(data);

  //       }        
  //     }
  //     const fileName = 'listaClientiPerMacroservizio';
  //     const exportType =  exportFromJSON.types.xls;
  //     exportFromJSON({ data, fileName, exportType });

  //   });
  // }


  async function handleEsportaClientiPerMacroServizioClick(ev, macroId){
    console.log('MACROID****');
    console.log(macroId);
    var promises = [];
    if(!macroId){
      for(var p in macroservizi){
        var macroservizio = macroservizi[p];
        if(!clientiMacroservizio.hasOwnProperty(macroservizio.id)){
          clientiMacroservizio[macroservizio.id] = [];
        }
        
        retrieveLegamiByMacroServizioForExcel(macroservizio.id, promises);
      }
    }else{
      if(!clientiMacroservizio.hasOwnProperty(macroId)){
        clientiMacroservizio[macroId] = [];
      }
      retrieveLegamiByMacroServizioForExcel(macroId, promises);
    }
    
    Promise.all(promises).then(async (values) => {
      console.log('lista aux excel');
      console.log(clientiMacroservizio);
      console.log('Length promises:');
      console.log(promises);

      //Inizio costruzione file EXCEL
      const wb = new ExcelJS.Workbook()

      for(var mid in clientiMacroservizio){
        var mName = getMacroservizioName(mid);
        var ws = wb.addWorksheet(mName);
        //var cols = ['Nome Partner', 'Ragione Sociale', 'Codice Fiscale', 'Tipo', 'Data inizio', 'Fatturato Partner', 'Fatturato Multifinance', 'Acconto', 'Saldo', 'Note'];
        var cols = ['Nome Partner', 'Ragione Sociale', 'Codice Fiscale', 'Tipo', 'Stato Pratica', 'Data inizio', 'Totale Pratica', 'Incassato', 'Da Incassare', 'Compenso Partner', 'Netto','Note'];

        //Inserisco nomi colonne

        const colonne = ws.addRow(cols);
        colonne.font = { bold: true }
    

        for(var j in clientiMacroservizio[mid]){            
          var cliente = clientiMacroservizio[mid][j];
          console.log('DATA INIZIO');
          console.log(cliente.dataInizio);
          cliente.dataInizio = cliente.dataInizio ? new Date(cliente.dataInizio).toLocaleDateString("en-GB"): '';          
          console.log(cliente.dataInizio);
          
          //Inserisco le righe
          //const righe = ws.addRow([cliente.partnerName, cliente.ragioneSociale, cliente.codiceFiscale, cliente.tipo, cliente.dataInizio, cliente.fatturatoPartner, cliente.fatturatoSocieta, cliente.acconto, cliente.saldo, cliente.note]);
          const righe = ws.addRow([cliente.partnerName, cliente.ragioneSociale, cliente.codiceFiscale, cliente.tipo, cliente.statoPratica, cliente.dataInizio, cliente.totalePratica, cliente.incassato, (cliente.totalePratica && cliente.incassato)?cliente.totalePratica - cliente.incassato:'', cliente.compensoPartner, (cliente.totalePratica && cliente.compensoPartner)?cliente.totalePratica - cliente.compensoPartner:'', cliente.note]);

        }


      }

      const buf = await wb.xlsx.writeBuffer();
      saveAs(new Blob([buf]), 'listaClientiPerMacroservizio.xlsx')
      clientiMacroservizio = [];


    });
  
  }

 

  async function handleEsportaClientiPerMacroServizioClickOld(){    
    var promises = [];
    for(var p in macroservizi){
      var macroservizio = macroservizi[p];
      var ultimoMacroServizio = p == macroservizi.length-1 ?true:false;
      console.log('&&&&&&&');
      console.log(ultimoMacroServizio);
      
      retrieveLegamiByMacroServizioForExcel(macroservizio.id, promises, ultimoMacroServizio);
    }

    Promise.all(promises).then(async (values) => {
        //Inizio costruzione file EXCEL
        const wb = new ExcelJS.Workbook()
        
        console.log('DENTRO LA VALORIZZAZIONE promises');
        console.log(promises);
        console.log(clientiMacroservizio);
        console.log(values);
        console.log('FINE VALORIZZAZIONE promises');
        for(var mid in clientiMacroservizio){
          var mName = getMacroservizioName(mid);
          var ws = wb.addWorksheet(mName);
          var cols = [];
      

          for(var j in clientiMacroservizio[mid]){            
            var cliente = clientiMacroservizio[mid][j];
            var newRecord = Object.assign({}, cliente);
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

            if(j == 0){
              cols = Object.keys(newRecord);
              //Inserisco nomi colonne

              const colonne = ws.addRow(cols);
              colonne.font = { bold: true }
            }
            
            //Inserisco le righe
            const righe = ws.addRow(Object.values(newRecord));

          }

          

          

        }

        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), 'listaClientiPerMacroservizio.xlsx')

    });

    //Inizio costruzione file EXCEL
    // const wb = new ExcelJS.Workbook()

    // const ws = wb.addWorksheet('Partner1')
    // const ws2 = wb.addWorksheet('Partner2')

    // const row = ws.addRow(['a', 'b', 'c'])
    // row.font = { bold: true }

    // const data = ws.addRow(['a1', 'b1', 'c1'])


    // const rowWs2 = ws2.addRow(['d', 'e', 'f'])
    // rowWs2.font = { bold: true }

    // const data2 = ws2.addRow(['d1', 'e1', 'f1'])
    

    // const buf = await wb.xlsx.writeBuffer()

    // saveAs(new Blob([buf]), 'abc.xlsx')


  }



  if(user){
    return (
      <div className="list row">
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
              onClick={handleAggiungiMacroservizioClick}
            >
              Aggiungi macroservizio
            </button>
            <button
              className={"btn btn-primary float-right "}
              type="button"
              onClick={handleEsportaClientiPerMacroServizioClick}
            >
              Esporta lista clienti macroservizi
            </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Lista macroservizi</h4>
  
          <ul className="list-group">
            {macroservizi &&
              macroservizi.map((macroservizio, index) => (
                <li
                  className={
                    "list-group-item " + (index === currentIndex ? "active" : "")
                  }
                  onClick={() => setActiveMacroservizio(macroservizio, index)}
                  key={index}
                >
                  {macroservizio.servizi}
                </li>
              ))}
          </ul>
          
          <button
            className="m-3 btn btn-sm btn-danger d-none"
            onClick={removeAllMacroservizi}
          >
            Remove All
          </button>          
        </div>
        <div className="col-md-6">
          {currentMacroservizio ? (
            <div>
              <div>
                <h4 className="macroservizio-label">Macroservizio</h4>              
              </div>

              <div>
                <label>
                  <strong>Servizi:</strong>
                </label>{" "}
                {showAdminBoard ? (
                  <Link
                    to={"/macroservizios/" + currentMacroservizio.id}
                    className="badge badge-warning"
                  >
                    {currentMacroservizio.servizi}
                  </Link> 
                  ) : (
                    currentMacroservizio.servizi
                  )
                }

                {/* <div>
                  <label>
                    <strong>Data inizio:</strong>
                  </label>{" "}
                  {moment(currentMacroservizio.dataInizio).format('YYYY-MM-DD')}
                </div>     */}

                 <button
                  className={"btn btn-primary"}
                  type="button"                  
                  onClick={() => handleEsportaClientiPerMacroServizioClick(this, currentMacroservizio.id)}
                >
                  Esporta lista clienti {currentMacroservizio.servizi}
                </button>             
              </div>
                           
            </div>
          ) : (
            <div>
              <br />
              <p>Seleziona un Macroservizio...</p>
            </div>
          )}
        </div>

        {currentListaLegameMacroservizio ? (
          <div className="input-group mb-3">
            <div className="col-md-12">
              <h4>Lista legami servizi</h4>
      
              <ul className="list-group">
                {currentListaLegameMacroservizio &&
                  currentListaLegameMacroservizio.map((legame, index) => (
                    <li key={index}>
                      <div>
                        <label className="inline-block">
                          <strong>Tipologia servizio:</strong>
                        </label>{" "}
                        {legame.tipo}
                      </div>
                      <div>
                          <label className="inline-block">
                            <strong>Cliente:</strong>
                          </label>{" "}
                          {clientesLegame.filter(cliente => cliente.includes(legame.clienteid)).toString().substring(clientesLegame.filter(cliente => cliente.includes(legame.clienteid)).toString().indexOf('-')+1)}             
                      </div>
                      <div>
                          <label className="inline-block">
                            <strong>Partner:</strong>
                          </label>{" "}
                          {partnersLegame.filter(partner => partner.includes(legame.partnerid)).toString().substring(partnersLegame.filter(partner => partner.includes(legame.partnerid)).toString().indexOf('-')+1)}             
                      </div>
                    </li>                   
                  ))}
              </ul>

              <button
                className="m-3 btn btn-sm btn-danger d-none"
                onClick={removeAllMacroservizi}
              >
                Remove All
              </button>          
            </div>
          </div>
          ):(<div>
        </div>
        )}

      </div>
    );
  }else{
    return(
      <div>
        <br />
          <p>Effettua il login per vedere i macroservizi...</p>
      </div>
    );
  }
  
};

export default MacroserviziList;
