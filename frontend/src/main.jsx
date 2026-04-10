import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App.jsx'
import './styles/global.scss'

// Issue #4 / #3 — send cookies on every axios request automatically.
// The httpOnly signed cookie replaces the token-in-localStorage pattern.
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
