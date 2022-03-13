import React, { useState, useEffect } from "react";
import MacroservizioDataService from "../services/MacroservizioService";
import ClienteDataService from "../services/ClienteService";
import LegameDataService from "../services/LegameService";
import PartnerDataService from "../services/PartnerService";

import { Link, useHistory } from "react-router-dom";

import Chart from "react-apexcharts";

import moment from 'moment'

import AuthService from "../services/auth.service";

const Statistiche = () => {
  const initialFiltroDataState = {
    dataDa: null,
    dataA: null 
  };

  const [macroservizi, setMacroservizi] = useState([]);

  const [series, setSeries] = useState([]);

  const [macroServiziFormatted, setMacroServiziFormatted] = useState([]);


  const [partners, setPartners] = useState([]);
  const [partnersFormatted, setPartnersFormatted] = useState([]);
  const [partnersSeries, setPartnersSeries] = useState([]);


  const user = AuthService.getCurrentUser();

  
  const [filtroData, setFiltroData] = useState(initialFiltroDataState);


  const handleInputChange = event => {
    console.log(event.target);
    const { name, value } = event.target;
    setFiltroData({ ...filtroData, [name]: value });
    console.log('FILTRO BEFORE LEGAMI* ');
    console.log(filtroData);
    //retrievePartners();
    //retrieveMacroservizi();
  };  


  var barChart = {
    macroservizi: [],
    user: AuthService.getCurrentUser(),
    options: {
      chart: {
        type: 'bar'
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      colors: [  function ({ value, seriesIndex, dataPointIndex, w }) {
          if (seriesIndex == 0) {
            return "#F3B415";
          }else if (seriesIndex == 1){
              return "#F27036";
          }else if (seriesIndex == 2){
              return "#663F59";
          }else if (seriesIndex == 3){
              return "#6A6E94";
          }else if (seriesIndex == 4){
              return "#4E88B4";
          }else if (seriesIndex == 5){
              return "#00A7C6";
          }else if (seriesIndex == 6){
              return "#18D8D8";
          }else if (seriesIndex == 7){
              return "#A9D794";
          }else if (seriesIndex == 8){
              return "#46AF78";
          }else if (seriesIndex == 9){
              return "#A93F55";
          }else if (seriesIndex == 10){
              return "#8C5E58";
          }else {
              //RANDOM COLOR
              return '#'+Math.floor(Math.random()*16777215).toString(16);
          }

      }],      
    },   

  };


  var partnerBarChart = {
    partners: [],
    user: AuthService.getCurrentUser(),
    options: {
      chart: {
        type: 'bar'
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      colors: [  function ({ value, seriesIndex, dataPointIndex, w }) {
          if (seriesIndex == 0) {
            return "#18D8D8";
          }else if (seriesIndex == 1){
              return "#8C5E58";
          }else if (seriesIndex == 2){
              return "#663F59";
          }else if (seriesIndex == 3){
              return "#6A6E94";
          }else if (seriesIndex == 4){
              return "#4E88B4";
          }else if (seriesIndex == 5){
              return "#00A7C6";
          }else if (seriesIndex == 6){
              return "#F3B415";
          }else if (seriesIndex == 7){
              return "#A9D794";
          }else if (seriesIndex == 8){
              return "#46AF78";
          }else if (seriesIndex == 9){
              return "#F27036";
          }else if (seriesIndex == 10){
              return "#8C5E58";
          }else {
              //RANDOM COLOR
              return '#'+Math.floor(Math.random()*16777215).toString(16);
          }

      }],      
    },   

  };

  useEffect(() => {
    if(user){
      retrieveMacroservizi();
      retrievePartners();
    }
  }, []);


  const splitLabels = label =>{
    var category = [];

    var index = label.indexOf(" ");
    var part1 = label.substr(0,index);
    var part2 = label.substr(index);
    category.push(part1);
    category.push(part2);

    return category;
  }


  const addDataInSerie = macroservizi =>{
    var defs = [];
    for(var i in macroservizi){
      var macroservizio = macroservizi[i];

      //PRENDO LA SOMMA DEI FATTURATI SOC E PARTNER DI OGNI MACROSERVIZI
      defs = retrieveLegami(macroservizio, defs);

    }
    Promise.all(defs).then(() => {
      //Lista def di appoggio
      var defsTmp = [];

      for(var i in defs){
        var def = defs[i];
        var dataSoc = [];
        var dataPartner = [];
        

        defsTmp.push(
        def.then(function(result){
          dataSoc.push(result.elementSoc);
          dataPartner.push(result.elementPartner);

          console.log('result');
          console.log(result);
          addMacroServiziFormatted({servizi: result.servizi, fatturatoSocieta: result.elementSoc.y, fatturatoPartner:  result.elementPartner.y, dataInizio: result.dataInizio})
        })
        );
      }

      Promise.all(defsTmp).then(() => {
        var serieSoc = {name:'Fatturato Multifinance', data: dataSoc};
        var seriePartner = {name:'Fatturato partner', data: dataPartner};        
        addSerie(serieSoc);
        addSerie(seriePartner);
      });
     
    });

  }


  const addDataPartnersInSerie = partners =>{
    var defs = [];
    for(var i in partners){
      var partner = partners[i];

    
      //PRENDO LA SOMMA DEI FATTURATI SOC E PARTNER DI OGNI MACROSERVIZI
      defs = retrieveLegamiByPartnerId(partner, defs);      


    }
    Promise.all(defs).then(() => {
      //Lista def di appoggio
      var defsTmp = [];

      for(var i in defs){
        var def = defs[i];
        var dataSoc = [];
        var dataPartner = [];
        

        defsTmp.push(
        def.then(function(result){
          dataSoc.push(result.elementSoc);
          dataPartner.push(result.elementPartner);

          console.log('result');
          console.log(result);
          addPartnersFormatted({denominazione: result.denominazione, fatturatoSocieta: result.elementSoc.y, fatturatoPartner:  result.elementPartner.y, dataInizio: result.dataInizio})
        })
        );
      }

      Promise.all(defsTmp).then(() => {
        var serieSoc = {name:'Fatturato Multifinance', data: dataSoc};
        var seriePartner = {name:'Fatturato partner', data: dataPartner};        
        addPartnersSerie(serieSoc);
        addPartnersSerie(seriePartner);
      });
     
    });

  }

  const addSerie = (newSerie) => setSeries(state => [...state, newSerie]);
  const addMacroServiziFormatted = (newMacroServiziFormatted) => setMacroServiziFormatted(state => [...state, newMacroServiziFormatted]);

  const addPartnersSerie = (newPartnersSerie) => setPartnersSeries(state => [...state, newPartnersSerie]);
  const addPartnersFormatted = (newPartnersFormatted) => setPartnersFormatted(state => [...state, newPartnersFormatted]);

  const retrieveLegami = (macroservizio, defs) => {
    if(user){
      var servizioid = macroservizio.id;
      var fatturatoSoc = 0;
      var fatturatoPartner = 0;

      
      var def =
      LegameDataService.findByServizioId(servizioid)
      .then(response => {
        for(const i in response.data){
          var legame = response.data[i];
          fatturatoSoc += (legame.fatturatoSocieta || 0);
          fatturatoPartner += (legame.fatturatoPartner || 0);
        }
        var category = splitLabels(macroservizio.servizi);
        var elementSoc = {x: category, y: fatturatoSoc};
        var elementPartner = {x: category, y: fatturatoPartner};
        return {elementSoc: elementSoc, elementPartner: elementPartner, servizi: macroservizio.servizi, dataInizio: macroservizio.dataInizio};

      })
      .catch(e => {
        console.log(e);
        //def.reject('Error on findByServizioId');
      });
      defs.push(def);
      
      return defs;
    }
  };

  const retrieveLegamiByPartnerId = (partner, defs) => {
    if(user){
      var fatturatoSoc = 0;
      var fatturatoPartner = 0;


      
      var def =
      LegameDataService.findByPartnerId(partner.id)
      .then(response => {
        for(const i in response.data){
          var legame = response.data[i];
          fatturatoSoc += (legame.fatturatoSocieta || 0);
          fatturatoPartner += (legame.fatturatoPartner || 0);
        }
        var elementSoc = {x: partner.denominazione, y: fatturatoSoc};
        var elementPartner = {x: partner.denominazione, y: fatturatoPartner};
        return {elementSoc: elementSoc, elementPartner: elementPartner, denominazione: partner.denominazione, dataInizio: partner.dataInizio};

      })
      .catch(e => {
        console.log(e);
        //def.reject('Error on findByServizioId');
      });
      defs.push(def);      


     
      return defs;
    }
  };

  const retrieveMacroservizi = () => {
    if(user){
      MacroservizioDataService.getAll()
      .then(response => {
        initVar();
        var macroservizi = response.data.filter(p => ( ( (filtroData.dataDa &&  moment(p.dataInizio).format('YYYY-MM-DD') >= filtroData.dataDa)|| filtroData.dataDa == null ) && (filtroData.dataA && moment(p.dataInizio).format('YYYY-MM-DD') <= filtroData.dataA)|| filtroData.dataA == null ) ) ;       
        
        if(macroservizi.length > 0){
          setMacroservizi(macroservizi);

          addDataInSerie(macroservizi);        
  
          console.log(macroservizi);
        }
       
      })
      .catch(e => {
        console.log(e);
      });
    }
  };

  const initVar = () => {
    setPartners([]);
    setPartnersFormatted([]);
    setPartnersSeries([]);


    setMacroservizi([]);
    setMacroServiziFormatted([]);
    setSeries([]);


  }

  const retrievePartners = () => {    
    if(user){
      PartnerDataService.getAll()
      .then(response => {
        initVar();
        var partners = response.data.filter(p => ( ( (filtroData.dataDa &&  moment(p.dataInizio).format('YYYY-MM-DD') >= filtroData.dataDa)|| filtroData.dataDa == null ) && (filtroData.dataA && moment(p.dataInizio).format('YYYY-MM-DD') <= filtroData.dataA)|| filtroData.dataA == null ) ) ;       
        if(partners.length > 0){
          setPartners(partners);

          addDataPartnersInSerie(partners);
  
          console.log(partners);
          console.log('FILTRO DATA*');
          console.log(filtroData);
          
        }
        
      })
      .catch(e => {
        console.log(e);
      });
    }    
  };


  const renderTablePartnersHeader = () => {
    var header = [];
    header.push(<th key={1}>Partner</th>);    
    header.push(<th key={3}>Fatturato Multifinance</th>);
    header.push(<th key={2}>Fatturato Partner</th>);
    return header;
  };


  const renderTableHeader = () => {
    var header = [];
    header.push(<th key={1}>Servizi</th>);    
    header.push(<th key={3}>Fatturato Multifinance</th>);
    header.push(<th key={2}>Fatturato Partner</th>);
    return header;
 };

  const renderTableData = (filtro) => {
    console.log('macroServiziFormatted');
    console.log(macroServiziFormatted);
    var macroServiziFormattedFiltered=macroServiziFormatted;
    if(filtro) macroServiziFormattedFiltered=macroServiziFormatted.filter(p => ( ( (filtroData.dataDa &&  moment(p.dataInizio).format('YYYY-MM-DD') >= filtroData.dataDa)|| filtroData.dataDa == null ) && (filtroData.dataA && moment(p.dataInizio).format('YYYY-MM-DD') <= filtroData.dataA)|| filtroData.dataA == null ) ) ;
    return macroServiziFormattedFiltered.map((macroServizioFormatted, index) => {
      return (
          <tr key={index}>
            <td>{macroServizioFormatted.servizi}</td>       
            <td>{macroServizioFormatted.fatturatoSocieta}</td>  
            <td>{macroServizioFormatted.fatturatoPartner}</td>                                                 
          </tr>
      )
    })
  };

  const renderTablePartnersData = (filtro) => {
    console.log('partnersFormatted');
    console.log(partnersFormatted);
    var partnersFormattedFiltered=partnersFormatted;
    if(filtro) partnersFormattedFiltered=partnersFormatted.filter(p => ( ( (filtroData.dataDa &&  moment(p.dataInizio).format('YYYY-MM-DD') >= filtroData.dataDa)|| filtroData.dataDa == null ) && (filtroData.dataA && moment(p.dataInizio).format('YYYY-MM-DD') <= filtroData.dataA)|| filtroData.dataA == null ) ) ;
    return partnersFormattedFiltered
    .map((partnerFormatted, index) => {
      return (
          <tr key={index}>
            <td>{partnerFormatted.denominazione}</td>       
            <td>{partnerFormatted.fatturatoSocieta}</td>  
            <td>{partnerFormatted.fatturatoPartner}</td>                                                 
          </tr>
      )
    })
  };

  const applicaFiltro = () =>{
    renderTableData(true);
    renderTablePartnersData(true);

    retrievePartners();
    retrieveMacroservizi();
  }


  if(user){
    return (
      <div className="list row">        
       <div className="app">
          <div className="row"> 
            <label>
              <strong>Da:</strong>
            </label>{" "}
            <input
                  type="date"
                  className="form-control fit-content"
                  id="dataDa"
                  required
                  value={moment(filtroData.dataDa).format('YYYY-MM-DD')} 
                  onChange={handleInputChange}
                  name="dataDa"
              />

            <label>
              <strong>A:</strong>
            </label>{" "}
            <input
                  type="date"
                  className="form-control fit-content"
                  id="dataA"
                  required
                  value={moment(filtroData.dataA).format('YYYY-MM-DD')} 
                  onChange={handleInputChange}
                  name="dataA"
              />
               <button
                  className={"margin-left3 btn btn-primary"}
                  type="button"                  
                  onClick={applicaFiltro}
                >
                  Applica filtro
                </button>   
          </div>
          <div className="row">            
            {macroServiziFormatted && macroServiziFormatted.length > 0 ? (              
              <div className="half1-statistiche table-responsive text-nowrap">
                <h4>Performance servizi</h4>
                <table id='servizi' className="table w-auto">
                  <tbody>
                      <tr>{renderTableHeader()}</tr>
                      {renderTableData()}
                  </tbody>
                </table>
              </div> ):(<div>
              </div>
            )}           

            <div className="half2-statistiche mixed-chart">
              <Chart
                options={barChart.options}
                series={series}
                type="bar"
                width="600"
                height="300"
              />
            </div>
          </div>
        </div>


        <br></br>
        <div className="app">
          <div className="row">            
            {macroServiziFormatted && macroServiziFormatted.length > 0 ? (              
              <div className="half1-statistiche table-responsive text-nowrap">
                <h4>Performance partner</h4>
                <table id='servizi' className="table w-auto">
                  <tbody>
                      <tr>{renderTablePartnersHeader()}</tr>
                      {renderTablePartnersData()}
                  </tbody>
                </table>
              </div> ):(<div>
              </div>
            )}           

            <div className="half2-statistiche mixed-chart">
              <Chart
                options={partnerBarChart.options}
                series={partnersSeries}
                type="bar"
                width="800"
                height="300"
              />
            </div>
          </div>
        </div>
       
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

export default Statistiche;
