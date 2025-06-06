/*import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Register from './Register'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Register />
  </React.StrictMode>,
)



// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './login'; // or './Register'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>,
);*/

/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import Register from './Register';
import Login from './login';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
*/

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App"; // App now contains all the routes

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
