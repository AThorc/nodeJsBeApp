import React, { Component } from "react";
import Chart from "react-apexcharts";

class ApexChart extends Component {
  constructor(props) {
    super(props);

    function generateRandomColor()
    {
        var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
        return randomColor;
        //random color will be freshly served
    }

    this.state = {
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
                if (dataPointIndex == 0) {
                  return "#F3B415";
                }else if (dataPointIndex == 1){
                    return "#F27036";
                }else if (dataPointIndex == 2){
                    return "#663F59";
                }else if (dataPointIndex == 3){
                    return "#6A6E94";
                }else if (dataPointIndex == 4){
                    return "#4E88B4";
                }else if (dataPointIndex == 5){
                    return "#00A7C6";
                }else if (dataPointIndex == 6){
                    return "#18D8D8";
                }else if (dataPointIndex == 7){
                    return "#A9D794";
                }else if (dataPointIndex == 8){
                    return "#46AF78";
                }else if (dataPointIndex == 9){
                    return "#A93F55";
                }else if (dataPointIndex == 10){
                    return "#8C5E58";
                }else {
                    return generateRandomColor();
                } 
                
              }
        ],
        }
    };
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart
              options={this.state.options}
              series={this.state.options.series}
              type="bar"
              width="500"
              colors={this.state.colors}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ApexChart;