// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/authentication/Register';
import Login from './components/authentication/login';
import LandingPage from './components/landing_page/LandingPage';
import ForgotPassword from './components/landing_page/ForgotPassword';
import ResetPassword from './components/landing_page/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/register' element={<Register />}/>  
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
