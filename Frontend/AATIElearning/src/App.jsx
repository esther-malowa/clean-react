

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landpage from './components/Landpage';
import HomePage from './components/HomePage';
import CheckoutPage from './components/CheckoutPage';
import BookDetailsPage from './components/BookDetailsPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import BookListing from './components/BookListing';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landpage />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/books/:book_id" element={<BookDetailsPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/books" element={<BookListing />} />
        
        
    
      </Routes>
    </Router>
  );
}

export default App;
