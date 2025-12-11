import { Container, Row, Col } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-5 pt-5 pb-4">
      <Container>
        <Row className="g-4">
          {/* Company Info */}
          <Col lg={4} md={6}>
            <div className="mb-4">
              <h4 className="text-primary mb-3">SportsBooking</h4>
              <p className="text-muted">
                Your premier destination for booking sports facilities. We
                provide state-of-the-art courts, professional coaches, and
                premium equipment for all your sporting needs.
              </p>
            </div>
            <div className="d-flex gap-3">
              <a href="#" className="text-white fs-5">
                <FaFacebook />
              </a>
              <a href="#" className="text-white fs-5">
                <FaTwitter />
              </a>
              <a href="#" className="text-white fs-5">
                <FaInstagram />
              </a>
              <a href="#" className="text-white fs-5">
                <FaLinkedin />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6}>
            <h5 className="text-primary mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link
                  to="/"
                  className="text-muted text-decoration-none hover-text-white"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/book"
                  className="text-muted text-decoration-none hover-text-white"
                >
                  Book Court
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/history"
                  className="text-muted text-decoration-none hover-text-white"
                >
                  My Bookings
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/auth"
                  className="text-muted text-decoration-none hover-text-white"
                >
                  Login/Signup
                </Link>
              </li>
            </ul>
          </Col>

          {/* Support */}
          <Col lg={2} md={6}>
            <h5 className="text-primary mb-3">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="#"
                  className="text-muted text-decoration-none hover-text-white"
                >
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-muted text-decoration-none hover-text-white"
                >
                  FAQs
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-muted text-decoration-none hover-text-white"
                >
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-muted text-decoration-none hover-text-white"
                >
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-muted text-decoration-none hover-text-white"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col lg={4} md={6}>
            <h5 className="text-primary mb-3">Contact Us</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="text-primary me-3" />
                <span>123 Sports Street, City, State 12345</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="text-primary me-3" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaEnvelope className="text-primary me-3" />
                <span>info@sportsbooking.com</span>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <div className="mt-4">
              <h6 className="text-primary mb-2">Subscribe to Newsletter</h6>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control bg-dark border-secondary text-white"
                  placeholder="Your email"
                />
                <button className="btn btn-primary" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </Col>
        </Row>

        <hr className="bg-secondary my-4" />

        {/* Copyright */}
        <Row>
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0 text-muted">
              &copy; {currentYear} SportsBooking. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="mb-0 text-muted">
              Made with <FaHeart className="text-danger" /> for sports
              enthusiasts
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
