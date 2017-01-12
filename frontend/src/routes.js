import React from "react";
import { Router, Route } from "react-router";

import MainView from "./components/MainView";
import Splash from "./components/Splash";

const Routes = (props) => (
  <Router {...props}>
    <Route path="/:region/:name" component={MainView} />
    <Route path="/:region" component={Splash} />
    <Route path="/" component={Splash} />
  </Router>
);

export default Routes;
