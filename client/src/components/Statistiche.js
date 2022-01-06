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
  const [macroservizi, setMacroservizi] = useState([]);

  const [series, setSeries] = useState([]);

  const [macroServiziFormatted, setMacroServiziFormatted] = useState([]);


  const user = AuthService.getCurrentUser();


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

  useEffect(() => {
    if(user){
      retrieveMacroservizi();
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
          addMacroServiziFormatted({servizi: result.servizi, fatturatoSocieta: result.elementSoc.y, fatturatoPartner:  result.elementPartner.y})
        })
        );
      }

      Promise.all(defsTmp).then(() => {
        var serieSoc = {name:'Fatturato società', data: dataSoc};
        var seriePartner = {name:'Fatturato partner', data: dataPartner};        
        addSerie(serieSoc);
        addSerie(seriePartner);
      });
     
    });

  }

  const addSerie = (newSerie) => setSeries(state => [...state, newSerie]);
  const addMacroServiziFormatted = (newMacroServiziFormatted) => setMacroServiziFormatted(state => [...state, newMacroServiziFormatted]);

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
        return {elementSoc: elementSoc, elementPartner: elementPartner, servizi: macroservizio.servizi};

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
        setMacroservizi(response.data);

        addDataInSerie(response.data);

        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
    }
  };




  const renderTableHeader = () => {
    var header = [];
    header.push(<th key={1}>Servizi</th>);    
    header.push(<th key={3}>Fatturato Società</th>);
    header.push(<th key={2}>Fatturato Partner</th>);
    return header;
 };

  const renderTableData = () => {
    console.log('macroServiziFormatted');
    console.log(macroServiziFormatted);
    return macroServiziFormatted.map((macroServizioFormatted, index) => {
      return (
          <tr key={index}>
            <td>{macroServizioFormatted.servizi}</td>       
            <td>{macroServizioFormatted.fatturatoSocieta}</td>  
            <td>{macroServizioFormatted.fatturatoPartner}</td>                                                 
          </tr>
      )
    })
  };



  if(user){
    return (
      <div className="list row">        
       <div className="app">
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
