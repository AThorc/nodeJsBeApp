import React, { useState, useEffect } from "react";

import ClienteDataService from "../services/ClienteService";
import ServizioDataService from "../services/ServizioService";
import { Link, useHistory } from "react-router-dom";

import AuthService from "../services/auth.service";

import ConfirmDialog from "./confirmDialog.component";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import moment from 'moment';

import ModificaDataService from "../services/ModificaService";
import LegameDataService from "../services/LegameService";

import exportFromJSON from 'export-from-json';

import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import { saveAs } from 'file-saver';


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

  const [newTipologiaDocumento, setNewTipologiaDocumento] = useState(null);

  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const [showClienteDialog, setShowClienteDialog] = useState(false);


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
        //setClientes(response.data);
        setClientes(response.data.sort((a, b) => a.ragioneSociale.toLowerCase() > b.ragioneSociale.toLowerCase() ? 1 : -1));
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
    //window.scrollTo(0, 0);
    setShowClienteDialog(true);
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

  const tipologieDocumento = [
    "Patente",
    "Carta d'identità",
    "Passaporto"
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


  async function handleEsportaClientiClick() {    
    //const data = [{'a':1, 'b':2},{'a':3, 'b':4}];

    //Inizio costruzione file EXCEL
    const wb = new ExcelJS.Workbook();
    var ws = wb.addWorksheet('listaClienti');

    const data = clientes.map(function(e){
                  delete e.ragioneSocialeid;
                  delete e.createdAt;
                  delete e.updatedAt;
                  delete e.partners;
                  delete e.userid;
                  delete e.username;
                  delete e.username;
                  delete e.id;
                  e.dataCostituzione = new Date(e.dataCostituzione).toLocaleDateString("en-GB");
                  e.inizioAttivita = new Date(e.inizioAttivita).toLocaleDateString("en-GB");
                  return e;
                });

    var cols = ['Ragione sociale', 'Codice fiscale', 'Partita IVA', 
    'Codice univoco', 'Tipologia documento', 'Numero documento', 'Scadenza documento',
    'Legale rappresentante', 'Telefono',
    'Cellulare', 'Mail', 'Pec', 'Sede', 'Localita', 'Cap', 'Data costituzione', 'Inizio attivita',
    'Tipo', 'Dimensione', 'Att Istat Ateco 2007', 'Settore', 'Natura Giuridica', 'Segnalatore',
    'Socio 1', 'Percentuale Socio 1', 'Socio 2', 'Percentuale Socio 2', 'Socio 3', 'Percentuale Socio 3',
    'Socio 4', 'Percentuale Socio 4', 'Socio 5', 'Percentuale Socio 5', 'Socio 6', 'Percentuale Socio 6',];

    //Inserisco nomi colonne

    const colonne = ws.addRow(cols);
    colonne.font = { bold: true }

    for(var i in data){
      var cliente = data[i];
      //Inserisco le righe
      const righe = ws.addRow([cliente.ragioneSociale, cliente.codiceFiscale, cliente.partitaIVA, 
                              cliente.codiceUnivoco, cliente.tipoDocumento, cliente.numeroDocumento, cliente.scadenzaDocumento,
                              cliente.legaleRappresentate, cliente.telefono, cliente.cellulare, cliente.mail, cliente.pec, cliente.sede,
                              cliente.localita, cliente.cap, cliente.dataCostituzione, cliente.inizioAttivita, cliente.tipo, cliente.dimensione, cliente.attIstatAteco2007,
                              cliente.settore, cliente.naturaGiuridica, cliente.segnalatore, cliente.socio1, cliente.percentualeSocio1, cliente.socio2, cliente.percentualeSocio2,
                              cliente.socio3, cliente.percentualeSocio3, cliente.socio4, cliente.percentualeSocio4, cliente.socio5, cliente.percentualeSocio5, cliente.socio6, cliente.percentualeSocio6
                             ]);
    }

    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), 'listaClienti.xlsx')
      

    // const fileName = 'listaClienti';
    // const exportType =  exportFromJSON.types.xls;
    // exportFromJSON({ data, fileName, exportType });
  }


  const updateCliente = () => {
    if(user && showAdminBoard){
      currentCliente.userid = user.id;
      currentCliente.username = user.username;
      if(newNaturaGiuridica && newNaturaGiuridica != 'DEFAULT') currentCliente.naturaGiuridica = newNaturaGiuridica;
      if(newTipologiaDocumento && newTipologiaDocumento != 'DEFAULT') currentCliente.tipoDocumento = newTipologiaDocumento;
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

  async function deleteCliente () {
    if(user && showAdminBoard){
      
      var responseLegami = await LegameDataService.findByClienteId(currentCliente.id);
      if(responseLegami.data.length > 0){
        //alert("Impossibile cancellare il cliente in quanto possiede dei servizi!");
        setShowAlertDialog(true);
      }else{
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
  
          // //Cancello tutti i legami del cliente da cancellare
          // LegameDataService.findByClienteId(currentCliente.id)
          // .then(responseLegami => {
          //   var legami = responseLegami.data;
          //   if(legami.length > 0){
          //     for(var i in legami){
          //       var legame = legami[i];
          //       LegameDataService.remove(legame.id);
          //     }
          //   }
  
          // })
  
        })
        .catch(e => {
          console.log(e);
        });
      }
    }
    
  };

  const handleInputNGChange = event => {
    const { name, value } = event.target;
    setNewNaturaGiuridica(value);
  };

  const handleInputTipoDochange = event => {
    const { name, value } = event.target;
    setNewTipologiaDocumento(value);
  };
  

  const handleCloseAlert = () => {
    setShowAlertDialog(false);
  };

  const handleCloseClienteAlert = () => {
    setShowClienteDialog(false);
  };
    
  const renderTableData = () => {  
    return (
        <tbody>       
          <tr key={0}>
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
                    autoFocus="true"
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

          <tr key={1}>
            <td>
              <label>
                <strong>Codice univoco:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="codiceUnivoco"
                    required
                    value={currentCliente.codiceUnivoco}
                    onChange={handleInputChange}
                    name="codiceUnivoco"
                    disabled={!showAdminBoard}
                    autoFocus="true"
                />
            </td>                         
            <td>
              <div className="form-group box">              
                  <label>
                    <strong>Tipo documento:</strong>
                  </label>{" "}<br/>
                  <select defaultValue={'DEFAULT'} onClick={(e) => handleInputTipoDochange(e)} onChange={(e) => handleInputTipoDochange(e)}>
                    <option disabled={!showAdminBoard} value="DEFAULT">{currentCliente.tipoDocumento?currentCliente.tipoDocumento:"Seleziona la tipologia del documento"}</option>    
                    {
                        tipologieDocumento && tipologieDocumento.map((tipoDoc, index) => (                  
                        
                          <option disabled={!showAdminBoard} value={tipoDoc} key={index} >{tipoDoc}</option>                    
                      ))}
                    </select>
                </div>
            </td>                       
          </tr>

          <tr key={1}>
            <td>
              <label>
                <strong>Numero documento:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="numeroDocumento"
                    required
                    value={currentCliente.numeroDocumento}
                    onChange={handleInputChange}
                    name="numeroDocumento"
                    disabled={!showAdminBoard}
                    autoFocus="true"
                />
            </td>                         
            <td>
              <label>
                <strong>Scadenza documento:</strong>
              </label>{" "}
              <input
                    type="date"
                    className="form-control fit-content"
                    id="scadenzaDocumento"
                    required
                    value={moment(currentCliente.scadenzaDocumento).format('YYYY-MM-DD')} 
                    onChange={handleInputChange}
                    name="scadenzaDocumento"
                    disabled={!showAdminBoard}
                />
            </td>                       
          </tr>

          <tr key={3}>
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

          <tr key={4}>
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

          <tr key={5}>
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

          <tr key={6}>
            
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
          <tr key={7}>
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
          </tr>
          <tr key={8}>
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
            <td>
              <label>
                <strong>Segnalatore:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="segnalatore"
                    required
                    value={currentCliente.segnalatore} 
                    onChange={handleInputChange}
                    name="segnalatore"
                    disabled={!showAdminBoard}
                />
            </td>
          </tr>

          <tr key={9}>    

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
                <strong>Percentuale Socio 1:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="percentualeSocio1"
                    required
                    value={currentCliente.percentualeSocio1} 
                    onChange={handleInputChange}
                    name="percentualeSocio1"
                    disabled={!showAdminBoard}
                />
            </td>
          </tr>

          <tr key={10}>  
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
                <strong>Percentuale Socio 2:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="percentualeSocio2"
                    required
                    value={currentCliente.percentualeSocio2} 
                    onChange={handleInputChange}
                    name="percentualeSocio2"
                    disabled={!showAdminBoard}
                />
            </td>
          </tr>

          <tr key={11}>
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

            <td>
              <label>
                <strong>Percentuale Socio 3:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="percentualeSocio3"
                    required
                    value={currentCliente.percentualeSocio3} 
                    onChange={handleInputChange}
                    name="percentualeSocio3"
                    disabled={!showAdminBoard}
                />
            </td>                     

          </tr>

          <tr key={12}>
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
                <strong>Percentuale Socio 4:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="percentualeSocio4"
                    required
                    value={currentCliente.percentualeSocio4} 
                    onChange={handleInputChange}
                    name="percentualeSocio4"
                    disabled={!showAdminBoard}
                />
            </td>                     

          </tr>

          <tr key={13}>
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
                <strong>Percentuale Socio 5:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="percentualeSocio5"
                    required
                    value={currentCliente.percentualeSocio5} 
                    onChange={handleInputChange}
                    name="percentualeSocio5"
                    disabled={!showAdminBoard}
                />
            </td>                     

          </tr>

          <tr key={14}>
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

            <td>
              <label>
                <strong>Percentuale Socio 6:</strong>
              </label>{" "}
              <input
                    type="text"
                    className="form-control fit-content"
                    id="percentualeSocio6"
                    required
                    value={currentCliente.percentualeSocio6} 
                    onChange={handleInputChange}
                    name="percentualeSocio6"
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


        {/* <div className="col-md-6">
        
          {currentCliente ? (
              <div className="wrapper-anagrafica">
                <h4>Cliente</h4>
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
                  <div>
                    <table id='clientiById' className="table table-anagrafica">
                      {renderTableData()}
                    </table> 
                  </div>  

				
			        	<br></br>
                                                 
                <Dialog
                  open={showAlertDialog}
                  onClose={handleCloseAlert}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  className="alert-error"
                >                    
                  <DialogTitle id="alert-dialog-title">
                    {"Alert"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Impossibile cancellare il cliente in quanto possiede dei servizi!
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseAlert}>Chiudi</Button>                    
                  </DialogActions>
                </Dialog>


               
				  
              </div>
              
            ) : (
              <div className="wrapper-anagrafica">
                <br />
                <p>Seleziona un Cliente...</p>
              </div>
            )}        


        </div>  */}

      {currentCliente ? (
          <div>  
            <Dialog
                open={showClienteDialog}
                onClose={handleCloseClienteAlert}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                //className="alert-error"
                //aria-labelledby="responsive-dialog-title"
                fullWidth
                maxWidth="lg"
              >                    
                <DialogTitle id="alert-dialog-title">
                  {currentCliente.ragioneSociale}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <div className="wrapper-anagrafica">
                      
                      <div>
                        <table id='clientiById' className="table table-anagrafica">
                          {renderTableData()}
                        </table> 
                      </div>  

              
                      <br></br>                                                                           
                    </div>
                  </DialogContentText>
                </DialogContent>                
                <DialogActions>
                  <div>
                    <ConfirmDialog 
                      title= 'Cancella'
                      message= 'Sei sicuro di voler cancellare il cliente?'
                      onClickYes= {deleteCliente}
                      className={"btn btn-danger " + (!showAdminBoard ? "d-none" : "")}
                      optionalFunction={handleCloseClienteAlert}               
                    />

                    <ConfirmDialog 
                      title= 'Aggiorna'
                      message= 'Sei sicuro di voler aggiornare il cliente?'
                      onClickYes= {updateCliente}
                      className={"btn btn-primary "+ (!showAdminBoard ? "d-none" : "")} 
                      optionalFunction={handleCloseClienteAlert}
                    />

                    <Link
                      to={"/clientes/" + currentCliente.id}
                      className="btn btn-warning"
                    >
                      Visualizza servizi                
                    </Link>
                    <Button onClick={handleCloseClienteAlert}>Chiudi</Button>                    
                  </div>
                </DialogActions>
              </Dialog>
              <Dialog
              open={showAlertDialog}
              onClose={handleCloseAlert}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              className="alert-error"
            >                    
              <DialogTitle id="alert-dialog-title">
                {"Alert"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Impossibile cancellare il cliente in quanto possiede dei servizi!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseAlert}>Chiudi</Button>                    
              </DialogActions>
            </Dialog>
            </div>
              
        ): (
        <div> 
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

export default ClientesList;
