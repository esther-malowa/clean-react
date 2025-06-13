import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useState } from "react";
import Register from "./components/authentication/Register";
import Login from "./components/authentication/login";
import LandingPage from "./components/landing_page/LandingPage";
import ForgotPassword from "./components/authentication/ForgotPassword";
import ResetPassword from "./components/authentication/ResetPassword";
import BookShowcase from "./components/books/BookShowcase";
import ActivateAccount from "./components/authentication/activateAccount";
import AccountActivated from "./components/authentication/accountActivated";
import Cart from "./components/books/Cart";
import HomePage from './components/homepage/HomePage';
import CheckoutPage from './components/cart/CheckoutPage';
import BookDetailsPage from './components/books/BookDetailsPage';
import BookListing from './components/books/BookListing';



function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (book) => {
    setCartItems((prev) => [...prev, book]);
  };

  const handleRemoveFromCart = (bookToRemove) => {
    setCartItems((prev) =>
      prev.filter((book) => book.title !== bookToRemove.title)
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/activate-account" element={<ActivateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account-activated" element={<AccountActivated />} />
        <Route
          path="/books"
          element={<BookShowcase onAddToCart={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart cartItems={cartItems} onRemove={handleRemoveFromCart} />
          }
        />
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
