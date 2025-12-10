import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavbarComponent() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Court Booking</Navbar.Brand>
        <Nav className="ms-auto">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/book" className="nav-link">
            Book
          </Link>
          <Link to="/history" className="nav-link">
            History
          </Link>
          <Link to="/admin" className="nav-link">
            Admin
          </Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
