import React, { Component } from "react";
import logo from "./logo.png";
import HelpModal from "./HelpModal";

class Main extends Component {
  render() {
    return (
      <div className="Main">
        <header className="Main-header">
          <img src={logo} className="Main-logo" alt="logo" />
          <p>TeleStat</p>
          <div>
            <input
              id="App-upload-button"
              type="file"
              onChange={this.props.uploadBtnClickHandler}
            />
            <button
              className="Main-button"
              onClick={this.props.uploadOverlayClickHandler}
            >
              Upload
            </button>
            <button
              id="Main-help-button-overlay"
              className="Main-button"
              onClick={this.props.helpBtnClickHandler}
            >
              Help
            </button>
            <HelpModal
              showModal={this.props.showHelp}
              uploadOverlayClickHandler={this.props.uploadOverlayClickHandler}
            />
          </div>
        </header>
      </div>
    );
  }
}

export default Main;
