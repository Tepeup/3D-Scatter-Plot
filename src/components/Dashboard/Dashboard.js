import React from "react";
import "./Dashboard.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Region from "../Region/Region";
import Verifier from "../Verifier/Verifier";

export default function Dashboard() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          Luminex
          <ul>
            <li>
              <Link to="/">Verifier Sample</Link>
            </li>
            <li>
              <Link to="/region">Region Sample</Link>
            </li>
          </ul>
        </nav>
        <div class="content">
          <Switch>
            <Route path="/region">
              <Region />
            </Route>
            <Route path="/">
              <Verifier />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}
