import React, { Component } from "react";
import Chart from "react-apexcharts";

class ApexChart extends Component {
  constructor(props) {
    super(props);

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
                if (dataPointIndex == 1) {
                  return "#7E36AF";
                } else {
                  return "#D9534F";
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