import { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Tab,
  Tabs,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useApi } from "../../hooks/useApi";

import { login, signup } from "../../services/authService";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../../utils/validationUtils";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); // Rename to avoid conflict
  const { post, isLoading, error, clearError } = useApi();

  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
    clearError();
  };

  const validateForm = () => {
    const errors = {};

    if (activeTab === "signup") {
      if (!validateName(formData.name)) {
        errors.name = "Name must be 2-50 characters (letters and spaces only)";
      }
    }

    if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }

    if (
      activeTab === "signup" &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const data = await post(login, {
        email: formData.email,
        password: formData.password,
      });

      authLogin(data.user, data.token);
      navigate("/");
    } catch (err) {}
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      await post(signup, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const data = await post(login, {
        email: formData.email,
        password: formData.password,
      });

      authLogin(data.user, data.token);
      navigate("/");
    } catch (err) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "login") {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  const isFormValid = () => {
    if (activeTab === "login") {
      return formData.email && formData.password;
    }
    return (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword
    );
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        className="shadow-lg border-0"
        style={{ width: "100%", maxWidth: "450px" }}
      >
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Sports Booking</h2>
            <p className="text-muted">Book your favorite sports facilities</p>
          </div>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
            fill
          >
            <Tab
              eventKey="login"
              title={<span style={{ color: "#333" }}>Login</span>}
              className="border-0"
            >
              <h4 className="text-center mb-3">Welcome Back</h4>
            </Tab>
            <Tab
              eventKey="signup"
              title={<span style={{ color: "#333" }}>Sign Up</span>}
              className="border-0"
            >
              <h4 className="text-center mb-3">Create Account</h4>
            </Tab>
          </Tabs>

          {error && (
            <Alert
              variant="danger"
              onClose={clearError}
              dismissible
              className="mb-3"
            >
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {activeTab === "signup" && (
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  isInvalid={!!validationErrors.name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                isInvalid={!!validationErrors.email}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                isInvalid={!!validationErrors.password}
                required
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.password}
              </Form.Control.Feedback>
              {activeTab === "signup" && (
                <Form.Text className="text-muted">
                  Must be at least 6 characters with uppercase, lowercase, and
                  number
                </Form.Text>
              )}
            </Form.Group>

            {activeTab === "signup" && (
              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  isInvalid={!!validationErrors.confirmPassword}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {validationErrors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-100 mb-3"
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {activeTab === "login"
                    ? "Logging in..."
                    : "Creating account..."}
                </>
              ) : activeTab === "login" ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </Button>

            {activeTab === "login" && (
              <div className="text-center">
                <p className="text-muted mb-0">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => setActiveTab("signup")}
                  >
                    Sign up here
                  </Button>
                </p>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
