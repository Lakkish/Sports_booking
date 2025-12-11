import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { useContext } from "react";

// Context
import { AuthContext } from "./context/AuthContext";

// Pages
import AuthPage from "./pages/public/AuthPage";
import Home from "./pages/user/Home";
import BookingPage from "./pages/user/BookingPage";
import BookingHistory from "./pages/user/BookingHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";

// Components
import NavbarComponent from "./components/shared/NavbarComponent";

// Auth Wrappers
import RequireAuth from "./components/auth/RequireAuth";
import RequireAdmin from "./components/auth/RequireAdmin";

// Loader Component
const Loader = () => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      {/* Always show navbar */}
      <NavbarComponent />

      <Container fluid className="main-container py-4">
        <Routes>
          {/* Public routes only */}
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/history" element={<BookingHistory />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Remove /auth route */}
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
