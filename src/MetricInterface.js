import MetricGraphing from "./MetricGraphing";
import MetricNumerical from "./MetricNumerical";
import React, { Component } from "react";

class MetricInterface extends Component {
  // TODO : ADD A STATIC CONVERSATION DATETIME RANGE ON TOP RIGHT CORNER
  render() {
    if (this.props.graphing) {
      return (
        <MetricGraphing
          index={this.props.index}
          startDate={this.props.startDate}
          endDate={this.props.endDate}
          title={this.props.title}
          sOne={this.props.sOne}
          sTwo={this.props.sTwo}
          sOneDatetimes={this.props.sOneDatetimes}
          sOneTimings={this.props.sOneTimings}
          sTwoDatetimes={this.props.sTwoDatetimes}
          sTwoTimings={this.props.sTwoTimings}
        />
      );
    }
    return (
      <MetricNumerical
        index={this.props.index}
        startDate={this.props.startDate}
        endDate={this.props.endDate}
        title={this.props.title}
        sOne={this.props.sOne}
        sTwo={this.props.sTwo}
        sOneMetric={this.props.sOneMetric}
        sTwoMetric={this.props.sTwoMetric}
        sOneComment={this.props.sOneComment}
        sTwoComment={this.props.sTwoComment}
      />
    );
  }
}

export default MetricInterface;
