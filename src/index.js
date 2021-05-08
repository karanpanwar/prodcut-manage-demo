import React from "react";
import store from "./redux/store";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import App from "./theme/app.js";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register();
