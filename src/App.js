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
import bg8 from "./metric_bg/bg8.jpg";

class App extends Component {
  state = {
    DEBUG: false, // DEBUG : SWITCH TO FALSE IN PRODUCTION
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
      analyzer.startDate = "Tue 10 Mar 2020";
      analyzer.endDate = "Wed 11 Mar 2020";
      analyzer.sOne = "WINNIE";
      analyzer.sOneMsgCount = 1000;
      analyzer.sOneWordCount = 10000;
      analyzer.sOneWPMCount = 100;
      analyzer.sOnePhotoCount = 10;
      analyzer.sOneVideoCount = 1;
      analyzer.sOneStickerCount = 10;
      analyzer.sOneAverageRT = 1000000;
      analyzer.sOneMsgComment = "DEBUG COMMENT";
      analyzer.sOneWordComment = "DEBUG COMMENT";
      analyzer.sOneWPMComment = "DEBUG COMMENT";
      analyzer.sOnePhotoComment = "DEBUG COMMENT";
      analyzer.sOneVideoComment = "DEBUG COMMENT";
      analyzer.sOneStickerComment = "DEBUG COMMENT";
      analyzer.sOneAverageRTComment = "DEBUG COMMENT";
      analyzer.sOneDatetimes = [new Date(), new Date(), new Date()];
      analyzer.sOneTimings = [1, 1, 1];
      analyzer.sTwo = "DUAH BAI";
      analyzer.sTwoMsgCount = 2000;
      analyzer.sTwoWordCount = 20000;
      analyzer.sTwoWPMCount = 200;
      analyzer.sTwoPhotoCount = 20;
      analyzer.sTwoVideoCount = 2;
      analyzer.sTwoStickerCount = 20;
      analyzer.sTwoAverageRT = 2000000;
      analyzer.sTwoMsgComment = "DEBUG COMMENT";
      analyzer.sTwoWordComment = "DEBUG COMMENT";
      analyzer.sTwoWPMComment = "DEBUG COMMENT";
      analyzer.sTwoPhotoComment = "DEBUG COMMENT";
      analyzer.sTwoVideoComment = "DEBUG COMMENT";
      analyzer.sTwoStickerComment = "DEBUG COMMENT";
      analyzer.sTwoAverageRTComment = "DEBUG COMMENT";
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

  helpBtnClickHandler = _ => {
    this.setState({
      showHelp: true
    });
    document.getElementById("Main-help-button").click();
  };

  updateContentsString = () => {
    const reader = new FileReader();
    reader.onload = (_ => {
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
      console.log(this.state.analyzer.sOneStickerCount);
      console.log(this.state.analyzer.sOneAverageRT);
      console.log(this.state.analyzer.sOneTimings);
      console.log(this.state.analyzer.sOneDatetimes);

      console.log(this.state.analyzer.sTwoMsgCount);
      console.log(this.state.analyzer.sTwoWordCount);
      console.log(this.state.analyzer.sTwoWPMCount);
      console.log(this.state.analyzer.sTwoPhotoCount);
      console.log(this.state.analyzer.sTwoVideoCount);
      console.log(this.state.analyzer.sTwoStickerCount);
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
                startDate={this.state.analyzer.startDate}
                endDate={this.state.analyzer.endDate}
                title={"Messages"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOneMsgCount}
                sTwoMetric={this.state.analyzer.sTwoMsgCount}
                sOneComment={this.state.analyzer.sOneMsgComment}
                sTwoComment={this.state.analyzer.sTwoMsgComment}
              />
            </div>
            <div className="Metric-bg" data-src={bg2}>
              <MetricInterface
                index={"2"}
                startDate={this.state.analyzer.startDate}
                endDate={this.state.analyzer.endDate}
                title={"Words"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOneWordCount}
                sTwoMetric={this.state.analyzer.sTwoWordCount}
                sOneComment={this.state.analyzer.sOneWordComment}
                sTwoComment={this.state.analyzer.sTwoWordComment}
              />
            </div>
            <div className="Metric-bg" data-src={bg3}>
              <MetricInterface
                index={"3"}
                startDate={this.state.analyzer.startDate}
                endDate={this.state.analyzer.endDate}
                title={"Words per message"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOneWPMCount}
                sTwoMetric={this.state.analyzer.sTwoWPMCount}
                sOneComment={this.state.analyzer.sOneWPMComment}
                sTwoComment={this.state.analyzer.sTwoWPMComment}
              />
            </div>
            <div className="Metric-bg" data-src={bg4}>
              <MetricInterface
                index={"4"}
                startDate={this.state.analyzer.startDate}
                endDate={this.state.analyzer.endDate}
                title={"Photos"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOnePhotoCount}
                sTwoMetric={this.state.analyzer.sTwoPhotoCount}
                sOneComment={this.state.analyzer.sOnePhotoComment}
                sTwoComment={this.state.analyzer.sTwoPhotoComment}
              />
            </div>
            <div className="Metric-bg" data-src={bg5}>
              <MetricInterface
                index={"5"}
                startDate={this.state.analyzer.startDate}
                endDate={this.state.analyzer.endDate}
                title={"Videos"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOneVideoCount}
                sTwoMetric={this.state.analyzer.sTwoVideoCount}
                sOneComment={this.state.analyzer.sOneVideoComment}
                sTwoComment={this.state.analyzer.sTwoVideoComment}
              />
            </div>
            <div className="Metric-bg" data-src={bg6}>
              <MetricInterface
                index={"6"}
                startDate={this.state.analyzer.startDate}
                endDate={this.state.analyzer.endDate}
                title={"Stickers"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOneStickerCount}
                sTwoMetric={this.state.analyzer.sTwoStickerCount}
                sOneComment={this.state.analyzer.sOneStickerComment}
                sTwoComment={this.state.analyzer.sTwoStickerComment}
              />
            </div>
            <div className="Metric-bg" data-src={bg7}>
              <MetricInterface
                index={"7"}
                startDate={this.state.analyzer.startDate}
                endDate={this.state.analyzer.endDate}
                title={"Average Reply Timing (Hours)"}
                sOne={this.state.analyzer.sOne}
                sTwo={this.state.analyzer.sTwo}
                sOneMetric={this.state.analyzer.sOneAverageRT}
                sTwoMetric={this.state.analyzer.sTwoAverageRT}
                sOneComment={this.state.analyzer.sOneAverageRTComment}
                sTwoComment={this.state.analyzer.sTwoAverageRTComment}
              />
            </div>
            <div className="Metric-bg" data-src={bg8}>
              <MetricInterface
                graphing={true}
                index={"8"}
                startDate={this.state.analyzer.startDate}
                endDate={this.state.analyzer.endDate}
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
