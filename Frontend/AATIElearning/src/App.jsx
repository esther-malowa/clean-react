

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from "./components/books/WishlistContext";
import Landpage from './components/landing_page/landing_page';
import HomePage from './components/homepage/HomePage';
import CheckoutPage from './components/cart/CheckoutPage';
import BookDetailsPage from './components/books/BookDetailsPage';
import BookListing from './components/books/BookListing';
import WishlistPage from "./components/books/WishlistPage";



function App() {
  return (
    <Router>
    
    <WishlistProvider>
      <Routes>
        <Route path="/" element={<Landpage />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/books/:book_id" element={<BookDetailsPage />} />
        <Route path="/books" element={<BookListing />} />
         <Route path="/wishlist" element={<WishlistPage />} />
        
        
    
      </Routes>
    
    </WishlistProvider>
    </Router>
  );
}

export default App;
