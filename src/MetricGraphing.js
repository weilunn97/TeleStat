import React, { Component } from "react";
import { ScatterPlot } from "react-d3-components";

class MetricGraphing extends Component {
  state = {
    chartWidth: 800,
    chartHeight: 500,
    sOneData: null,
    sTwoData: null
  };

  componentDidMount() {
    this.generateData();
  }

  generateData = () => {
    var DEBUG = false;
    if (DEBUG) {
      var sOne = "sONE";
      var sOneX = [
        new Date(2020, 10, 11, 23),
        new Date(2020, 10, 12, 0),
        new Date(2020, 10, 12, 1)
      ];
      var sOneY = [0, 1, 72];
      var sTwo = "sTWO";
      var sTwoX = [
        new Date(2020, 10, 11, 22),
        new Date(2020, 10, 12, 1),
        new Date(2020, 10, 12, 2)
      ];
      var sTwoY = [15, 0, 1];
      var sOneData = [];
      var sTwoData = [];
    } else {
      var sOne = this.props.sOne;
      var sOneX = this.props.sOneDatetimes;
      var sOneY = this.props.sOneTimings;
      var sTwo = this.props.sTwo;
      var sTwoX = this.props.sTwoDatetimes;
      var sTwoY = this.props.sTwoTimings;
      var sOneData = [];
      var sTwoData = [];
    }

    for (let i = 0; i < Math.min(sOneX.length, sOneY.length); i++) {
      sOneData.push({
        x: sOneX[i],
        y: sOneY[i]
      });
    }
    for (let i = 0; i < Math.min(sTwoX.length, sTwoY.length); i++) {
      sTwoData.push({
        x: sTwoX[i],
        y: sTwoY[i]
      });
    }

    this.setState({
      sOneData: sOneData,
      sTwoData: sTwoData
    });
  };

  tooltipScatter = (x, y) => {
    x = x.toDateString();
    return `${x} | ${y.toFixed(1)} Hours`;
  };

  render() {
    if (this.state.sOneData && this.state.sTwoData) {
      console.log(this.state.sOneData);
      console.log(this.state.sTwoData);

      return (
        <div>
          {/* TODO : PLACE THIS DIV ONTO A FRONT CARD*/}
          {/*TODO : PLACE THE NAME ON TOP RIGHT CORNER*/}

          <label className="card-container">
            <input type="checkbox" />
            <div className="card">
              <div className="front">
                <div className="Graphing-name">{this.props.sOne}</div>
                <div className="ScatterPlot">
                  <ScatterPlot
                    data={{
                      label: "",
                      values: this.state.sOneData
                    }}
                    width={this.state.chartWidth}
                    height={this.state.chartHeight}
                    margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
                    tooltipHtml={this.tooltipScatter}
                    xAxis={{ label: "Date" }}
                    yAxis={{ label: "Reply Timing (Hours)" }}
                  />
                </div>
              </div>
              <div className="back">
                <div className="Graphing-name">{this.props.sTwo}</div>
                <div className="ScatterPlot">
                  <ScatterPlot
                    data={{
                      label: "",
                      values: this.state.sTwoData
                    }}
                    width={this.state.chartWidth}
                    height={this.state.chartHeight}
                    margin={{ top: 10, bottom: 50, left: 50, right: 10 }}
                    tooltipHtml={this.tooltipScatter}
                    xAxis={{ label: "Date" }}
                    yAxis={{ label: "Reply Timing (Hours)" }}
                  />
                </div>
              </div>
            </div>
          </label>
          {/*/!* TODO : PLACE THIS DIV ONTO A BACK CARD*!/*/}
          {/*TODO : PLACE THE NAME ON TOP RIGHT CORNER*/}
        </div>
      );
    } else {
      return <div>WAITING...</div>;
    }
  }
}

export default MetricGraphing;
