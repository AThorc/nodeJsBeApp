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
  const [clientes, setClientes] = useState([]);
  const [currentMacroservizio, setCurrentMacroservizio] = useState(null);
  const [currentListaLegameMacroservizio, setCurrentListaLegameMacroservizio] = useState(null);

  const [clientesLegame, setClientesLegame] = useState([]);
  const [partnersLegame, setPartnersLegame] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchDenominazione, setSearchDenominazione] = useState("");


  const [series, setSeries] = useState([]);
  const [dataSoc, setDataSoc] = useState([]);
  const [dataPartner, setDataPartner] = useState([]);

  //var ragioneSociale = [];


  const user = AuthService.getCurrentUser();
  const history = useHistory();

  var resultDef = undefined;


  var clientesExecuted = [];
  var partnersExecuted = [];

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
      series: [{
        data: [{
          x: 'category A',
          y: 10,
        }, {
          x: 'category B',
          y: 18,
        }, {
          x: 'category C',
          y: 13,
        }]
      },
      ],
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

      
      // xaxis: {
      //   categories: [
      //     ["Consulenza", "finanziaria"],
      //     ["Consulenza", "del lavoro"],
      //     ["Consulenza", "aziendale"]
      //   ]
      // }
    },
    // series: [{
    //   data: [{
    //     x: 'Consulenza aziendale',
    //     y: 10,
    //   }, {
    //     x: 'Consulenza del lavoro',
    //     y: 18,
    //   }, {
    //     x: 'Consulenza finanziaria',
    //     y: 13,
    //   }]
    // },
    // ],

  };

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

  const splitLabels = label =>{
    var category = [];

    var index = label.indexOf(" ");
    var part1 = label.substr(0,index);
    var part2 = label.substr(index);
    category.push(part1);
    category.push(part2);

    return category;
  }

  // const addDataInSerie = macroservizi =>{
  //   var series = [];
  //   var data = [];
  //   var categories = [];
  //   var xaxis = {};
  //   for(var i in macroservizi){
  //     var macroservizio = macroservizi[i];
  //     var category = splitLabels(macroservizio.servizi);

  //     //PRENDO LA SOMMA DEI FATTURATI SOC E PARTNER DI OGNI MACROSERVIZI
  //     retrieveLegami(macroservizio.id);

  //     var element = {x: category, y: macroservizio.fatturato};

  //     categories.push(category);
  //     data.push(element);
  //   }

  //   var serie = {data: data}
  //   series.push(serie);
  //   setSeries(series);
  // }


  const addDataInSerie = macroservizi =>{
    var series = [];
    var data = [];
    var defs = [];
    for(var i in macroservizi){
      var macroservizio = macroservizi[i];
      //var category = splitLabels(macroservizio.servizi);

      //PRENDO LA SOMMA DEI FATTURATI SOC E PARTNER DI OGNI MACROSERVIZI
      defs = retrieveLegami(macroservizio, defs);

      // var element = {x: category, y: macroservizio.fatturato};

      // data.push(element);
    }


    console.log('DEFS');
    console.log(defs);
    Promise.all(defs).then(() => {
      console.log('INSIDE RESOLVE');
      console.log(defs);
      var serieSoc = {data: dataSoc};
      console.log('Data soc');
      console.log(dataSoc);
      var seriePartner = {data: dataPartner};
      console.log('Data partner');
      console.log(dataPartner);
      //series.push(serie);


      var defsTmp = [];

      for(var i in defs){
        var def = defs[i];
        var dataSoc = [];
        var dataPartner = [];

        defsTmp.push(
        def.then(function(result){
          dataSoc.push(result.elementSoc);
          dataPartner.push(result.elementPartner);
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



    //setSeries(series);
  }

  const addDataSoc = (newDataSoc) => setDataSoc(state => [...state, newDataSoc]);
  const addDataPartner = (newDataPartner) => setDataPartner(state => [...state, newDataPartner]);
  const addSerie = (newSerie) => setSeries(state => [...state, newSerie]);

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

        // addDataSoc(elementSoc);
        // addDataPartner(elementPartner);

        console.log('Retrieve legami');
        console.log(fatturatoSoc);
        console.log(fatturatoPartner);
        return {elementSoc: elementSoc, elementPartner: elementPartner};
        //console.log(def);
        //def.resolve('Success on findByServizioId');
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

  const setActiveMacroservizio = (macroservizio, index) => {
    setCurrentMacroservizio(macroservizio);
    setCurrentIndex(index);

    setCurrentListaLegameMacroservizio(null);
  };

  const removeAllMacroservizi = () => {
    if(user){
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


  if(user){
    return (
      <div className="list row">

       <div className="app">
          <div className="row">
            <div className="mixed-chart">
              <Chart
                options={barChart.options}
                series={series}
                //series={barChart.series}
                type="bar"
                width="600"
                height="300"
                //colors={barChart.colors}
              />
            </div>
          </div>
        </div>

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
              className="btn btn-success float-right"
              type="button"
              onClick={handleAggiungiMacroservizioClick}
            >
              Aggiungi macroservizio
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
                <Link
                  to={"/macroservizios/" + currentMacroservizio.id}
                  className="badge badge-warning"
                >
                  {currentMacroservizio.servizi}
                </Link>
              </div>

              <div>
                <label>
                  <strong>Data inizio:</strong>
                </label>{" "}
                {moment(currentMacroservizio.dataInizio).format('YYYY-MM-DD')}
              </div>
              <div>
                <label>
                  <strong>Fatturato macroservizio:</strong>
                </label>{" "}
                {currentMacroservizio.fatturato}
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

export default Statistiche;
