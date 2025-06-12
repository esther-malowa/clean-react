

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landpage from './components/landing_page/landing_page';
import HomePage from './components/homepage/HomePage';
import CheckoutPage from './components/cart/CheckoutPage';
import BookDetailsPage from './components/books/BookDetailsPage';
import BookListing from './components/books/BookListing';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landpage />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/books/:book_id" element={<BookDetailsPage />} />
        <Route path="/books" element={<BookListing />} />
        
        
    
      </Routes>
    </Router>
  );
}

export default App;
