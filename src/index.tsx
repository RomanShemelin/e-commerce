import React from "react";

import ReactDOM from "react-dom/client";

import "regenerator-runtime";
import "./styles/index.scss";

import { HashRouter } from "react-router-dom";

import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);
if (module.hot) {
  module.hot.accept();
}
