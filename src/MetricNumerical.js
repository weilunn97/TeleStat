import React, { Component } from "react";

class MetricNumerical extends Component {
  render() {
    return (
      <div>
        <div className="left circle-container">
          <div className="circle">
            <div className={`front C${this.props.index}`}>
              <p>{this.props.sOne}</p>
            </div>
            <div className={`back C${this.props.index}`}>
              <div className="metric-qty">{this.props.sOneMetric}</div>
              <div className="metric-title">{this.props.title}</div>
              <div className="metric-comment">INSERT COMMENTS HERE</div>
            </div>
          </div>
        </div>
        <div className="right circle-container">
          <div className="circle">
            <div className={`front C${this.props.index}`}>
              <p>{this.props.sTwo}</p>
            </div>
            <div className={`back C${this.props.index}`}>
              <div className="metric-qty">{this.props.sTwoMetric}</div>
              <div className="metric-title">{this.props.title}</div>
              <div className="metric-comment">INSERT COMMENTS HERE</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MetricNumerical;
