import "./css/normalize.global.css"
import "./css/index.global.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"

import App from "./components/App"

const root = ReactDOM.createRoot(document.querySelector("#root"))

root.render(
  <Router>
    <App />
  </Router>
)
