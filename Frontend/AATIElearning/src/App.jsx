import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/authentication/Register";
import Login from "./components/authentication/login";
import LandingPage from "./components/landing_page/LandingPage";
import ForgotPassword from "./components/authentication/ForgotPassword";
import ResetPassword from "./components/authentication/ResetPassword";
import BookShowcase from "./components/books/BookShowcase";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/books" element={<BookShowcase />} />
      </Routes>
    </Router>
  );
}

export default App;
