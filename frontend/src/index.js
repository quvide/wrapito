import React from "react";
import ReactDOM from "react-dom";

import { browserHistory } from "react-router";
import Routes from "./routes";

import "./style.css";

ReactDOM.render(
  <div id="outer-container">
    <Routes history={browserHistory} />
  </div>,
  document.getElementById("root")
);
