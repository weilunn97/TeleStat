import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import firebase from "firebase";

const config = {
  apiKey: "AIzaSyC5dwq14duK6nYbwSwYKjOEs8_A97Ho7wU",
  authDomain: "telestat-817a8.firebaseapp.com",
  databaseURL: "https://telestat-817a8.firebaseio.com",
  projectId: "telestat-817a8",
  storageBucket: "telestat-817a8.appspot.com",
  messagingSenderId: "433175668589",
  appId: "1:433175668589:web:4c07351901f9e195239c64",
  measurementId: "G-Y8JW90LD8X"
};
firebase.initializeApp(config);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
