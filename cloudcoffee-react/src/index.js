import React from 'react';
import ReactDOM from 'react-dom/client';
import './CSS/index.css';
import App from './JSX/App.jsx';
import reportWebVitals from './JS/reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();