import { useContext, useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge,
  Offcanvas,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaHistory,
  FaSignOutAlt,
  FaUser,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaRupeeSign,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { BookingContext } from "../../context/BookingContext";
import AuthStatus from "../auth/AuthStatus";

// NavbarComponent.jsx - NO AUTH CHECK
export default function NavbarComponent() {
  // Remove all auth context usage
  // const { user, logout } = useContext(AuthContext);

  // Create dummy user
  const user = {
    _id: "dummy123",
    name: "Demo User",
    email: "demo@example.com",
    role: "user", // or "admin" for testing
  };

  const handleLogout = () => {
    // Just reload the page
    window.location.href = "/";
  };

  // Always show navbar (remove: if (!user) return null;)

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Sports Booking</Navbar.Brand>
        <Nav className="ms-auto">
          <Link className="nav-link" to="/">
            Home
          </Link>
          <Link className="nav-link" to="/book">
            Book
          </Link>
          <Link className="nav-link" to="/history">
            History
          </Link>

          {/* Always show admin link or based on dummy role */}
          {user.role === "admin" && (
            <Link className="nav-link" to="/admin">
              Admin
            </Link>
          )}

          <span className="nav-link" onClick={handleLogout}>
            Logout (Demo)
          </span>
        </Nav>
      </Container>
    </Navbar>
  );
}
