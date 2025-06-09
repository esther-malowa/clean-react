import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <Link to="/" className="text-[#F18233] font-bold text-xl">
          BookStore
        </Link>
        <div className="space-x-4">
          <Link to="/books" className="text-[#58B440] hover:underline">
            Books
          </Link>
          <Link to="/cart" className="text-[#58B440] hover:underline">
            Cart ({cartItems.length})
          </Link>
        </div>
      </nav>

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
      </Routes>
    </Router>
  );
}

export default App;
