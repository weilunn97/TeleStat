import "./App.css";
import "react-awesome-slider/dist/custom-animations/cube-animation.css";
import "react-awesome-slider/dist/styles.css";
import Analyzer from "./Analyzer";
import AwesomeSlider from "react-awesome-slider";
import Main from "./Main";
import MetricInterface from "./MetricInterface";
import React, { Component } from "react";

import bg1 from "./metric_bg/bg1.jpg";
import bg2 from "./metric_bg/bg2.jpg";
import bg3 from "./metric_bg/bg3.jpg";
import bg4 from "./metric_bg/bg4.jpg";
import bg5 from "./metric_bg/bg5.jpg";
import bg6 from "./metric_bg/bg6.jpg";
import bg7 from "./metric_bg/bg7.jpg";

class App extends Component {
  state = {
    DEBUG: true, // DEBUG : SWITCH TO FALSE IN PRODUCTION
    uploadedFile: null,
    contentsString: null,
    analyzer: null,
    completed: false,
    showHelp: true,
    showMain: true,
    showMetric: false
  };

  // DEBUG //
  componentDidMount() {
    if (this.state.DEBUG) {
      const analyzer = new Analyzer("");
      analyzer.sOne = "WINNIE";
      analyzer.sOneMsgCount = 1000;
      analyzer.sOneWordCount = 10000;
      analyzer.sOneWPMCount = 100;
      analyzer.sOnePhotoCount = 10;
      analyzer.sOneVideoCount = 1;
      analyzer.sOneAverageRT = 1000000;
      analyzer.sOneDatetimes = [new Date(), new Date(), new Date()];
      analyzer.sOneTimings = [1, 1, 1];
      analyzer.sTwo = "DUAH BAI";
      analyzer.sTwoMsgCount = 2000;
      analyzer.sTwoWordCount = 20000;
      analyzer.sTwoWPMCount = 200;
      analyzer.sTwoPhotoCount = 20;
      analyzer.sTwoVideoCount = 2;
      analyzer.sTwoAverageRT = 2000000;
      analyzer.sTwoDatetimes = [new Date(), new Date(), new Date()];
      analyzer.sTwoTimings = [2, 2, 2];

      this.setState({
        analyzer: analyzer,
        showMain: false,
        showMetric: true,
        completed: true
      });
    }
  }

  // DEBUG //

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.completed && !this.state.showMetric) {
      this.setState({
        showMain: false,
        showMetric: true
      });
    } else if (this.state.analyzer && !this.state.completed) {
      this.state.analyzer.startPipeline();
      this.setState({
        completed: true
      });
    } else if (this.state.contentsString && !this.state.analyzer) {
      this.update_analyzer();
    } else if (this.state.uploadedFile && !this.state.contentsString) {
      this.updateContentsString();
    }
  }

  uploadOverlayClickHandler = ___ => {
    document.getElementById("App-upload-button").click();
  };

  uploadBtnClickHandler = event => {
    this.setState({
      uploadedFile: event.target.files[0]
    });
  };

  helpBtnClickHandler = event => {
    this.setState({
      showHelp: true
    });
    document.getElementById("Main-help-button").click();
  };

  updateContentsString = () => {
    const reader = new FileReader();
    reader.onload = (reader => {
      return e => {
        this.setState({
          contentsString: e.target.result
        });
      };
    })(reader);
    reader.readAsText(this.state.uploadedFile);
  };

  update_analyzer = () => {
    this.setState({
      analyzer: new Analyzer(this.state.contentsString)
    });
  };

  render() {
    if (this.state.showMetric) {
      // DEBUG //
      console.log(this.state.analyzer.sOneMsgCount);
      console.log(this.state.analyzer.sOneWordCount);
      console.log(this.state.analyzer.sOneWPMCount);
      console.log(this.state.analyzer.sOnePhotoCount);
      console.log(this.state.analyzer.sOneVideoCount);
      console.log(this.state.analyzer.sOneAverageRT);
      console.log(this.state.analyzer.sOneTimings);
      console.log(this.state.analyzer.sOneDatetimes);

      console.log(this.state.analyzer.sTwoMsgCount);
      console.log(this.state.analyzer.sTwoWordCount);
      console.log(this.state.analyzer.sTwoWPMCount);
      console.log(this.state.analyzer.sTwoPhotoCount);
      console.log(this.state.analyzer.sTwoVideoCount);
      console.log(this.state.analyzer.sTwoAverageRT);
      console.log(this.state.analyzer.sTwoTimings);
      console.log(this.state.analyzer.sTwoDatetimes);
      // DEBUG //

      return (
        <div className="Metric">
          <AwesomeSlider animation="cubeAnimation">
            <div className="Metric-bg" data-src={bg1}>
              <MetricInterface
                index={"1"}
                title={"Messages"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOneMsgCount}
                sTwoMetric={this.state.analyzer.sTwoMsgCount}
              />
            </div>
            <div className="Metric-bg" data-src={bg2}>
              <MetricInterface
                index={"2"}
                title={"Words"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOneWordCount}
                sTwoMetric={this.state.analyzer.sTwoWordCount}
              />
            </div>
            <div className="Metric-bg" data-src={bg3}>
              <MetricInterface
                index={"3"}
                title={"Words per message"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOneWPMCount}
                sTwoMetric={this.state.analyzer.sTwoWPMCount}
              />
            </div>
            <div className="Metric-bg" data-src={bg4}>
              <MetricInterface
                index={"4"}
                title={"Photos"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOnePhotoCount}
                sTwoMetric={this.state.analyzer.sTwoPhotoCount}
              />
            </div>
            <div className="Metric-bg" data-src={bg5}>
              <MetricInterface
                index={"5"}
                title={"Videos"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOneVideoCount}
                sTwoMetric={this.state.analyzer.sTwoVideoCount}
              />
            </div>
            <div className="Metric-bg" data-src={bg6}>
              <MetricInterface
                index={"6"}
                title={"Average Reply Timing (Hours)"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOneAverageRT}
                sTwoMetric={this.state.analyzer.sTwoAverageRT}
              />
            </div>
            <div className="Metric-bg" data-src={bg7}>
              <MetricInterface
                graphing={true}
                index={"7"}
                title={"Reply Timing Chart"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneDatetimes={this.state.analyzer.sOneDatetimes}
                sOneTimings={this.state.analyzer.sOneTimings}
                sTwoDatetimes={this.state.analyzer.sTwoDatetimes}
                sTwoTimings={this.state.analyzer.sTwoTimings}
              />
            </div>
          </AwesomeSlider>
        </div>
      );
    }

    if (this.state.showMain) {
      return (
        <React.StrictMode>
          <Main
            uploadBtnClickHandler={this.uploadBtnClickHandler}
            uploadOverlayClickHandler={this.uploadOverlayClickHandler}
            helpBtnClickHandler={this.helpBtnClickHandler}
            showHelp={this.state.showHelp}
          />
        </React.StrictMode>
      );
    }
  }
}

export default App;
