import { useContext, useState } from "react";
import {
  Dropdown,
  NavDropdown,
  Button,
  Badge,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaUserCircle,
  FaShieldAlt,
  FaBell,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import * as authService from "../../services/authService";

/**
 * Displays current authentication status and user menu
 * Can be used in navbar or other navigation components
 */
export default function AuthStatus({
  variant = "dropdown",
  placement = "end",
}) {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { post, isLoading } = useApi();
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      logout();
      navigate("/auth");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleProfileUpdate = async () => {
    setError("");
    setMessage("");

    try {
      await authService.updateProfile(profileData);
      setMessage("Profile updated successfully!");
      setTimeout(() => setShowProfileModal(false), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    setError("");
    setMessage("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setMessage("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
    }
  };

  const renderUserBadge = () => {
    if (!user) return null;

    const getRoleColor = () => {
      switch (user.role) {
        case "admin":
          return "danger";
        case "staff":
          return "warning";
        default:
          return "primary";
      }
    };

    return (
      <div className="d-flex align-items-center gap-2">
        <FaUserCircle className="text-primary" size={20} />
        <span className="d-none d-md-inline">{user.name}</span>
        <Badge bg={getRoleColor()} className="text-capitalize">
          {user.role}
        </Badge>
      </div>
    );
  };

  const renderProfileModal = () => (
    <Modal
      show={showProfileModal}
      onHide={() => setShowProfileModal(false)}
      size="lg"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>
          <FaUser className="me-2" />
          My Profile
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex mb-4">
          <Button
            variant={activeTab === "profile" ? "primary" : "outline-primary"}
            className="me-2"
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </Button>
          <Button
            variant={activeTab === "password" ? "primary" : "outline-primary"}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </Button>
        </div>

        {message && (
          <Alert variant="success" dismissible onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {activeTab === "profile" ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" value={profileData.email} disabled />
              <Form.Text className="text-muted">
                Email cannot be changed
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </Form.Group>
          </Form>
        ) : (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="Enter current password"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Enter new password"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Confirm new password"
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={
            activeTab === "profile" ? handleProfileUpdate : handlePasswordChange
          }
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : activeTab === "profile"
            ? "Save Changes"
            : "Change Password"}
        </Button>
      </Modal.Footer>
    </Modal>
  );

  // If user is not authenticated, show login button
  if (!user) {
    return (
      <>
        <Button
          variant="outline-light"
          onClick={() => navigate("/auth")}
          className="d-flex align-items-center"
        >
          <FaUser className="me-2" />
          Login / Sign Up
        </Button>
      </>
    );
  }

  // Dropdown variant (for navbar)
  if (variant === "dropdown") {
    return (
      <>
        <NavDropdown
          title={renderUserBadge()}
          id="user-dropdown"
          align={placement}
          className="user-dropdown"
        >
          <div className="px-3 py-2 border-bottom">
            <div className="small text-muted">Signed in as</div>
            <div className="fw-bold">{user.email}</div>
          </div>

          <NavDropdown.Item onClick={() => setShowProfileModal(true)}>
            <FaUserCircle className="me-2" />
            My Profile
          </NavDropdown.Item>

          {isAdmin && (
            <NavDropdown.Item onClick={() => navigate("/admin")}>
              <FaShieldAlt className="me-2" />
              Admin Dashboard
            </NavDropdown.Item>
          )}

          <NavDropdown.Divider />

          <NavDropdown.Item onClick={handleLogout}>
            <FaSignOutAlt className="me-2" />
            Logout
          </NavDropdown.Item>
        </NavDropdown>

        {renderProfileModal()}
      </>
    );
  }

  // Compact variant (for sidebar or compact views)
  if (variant === "compact") {
    return (
      <div className="d-flex align-items-center gap-2">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => setShowProfileModal(true)}
          title="Profile"
        >
          <FaUserCircle />
        </Button>
        {isAdmin && (
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => navigate("/admin")}
            title="Admin"
          >
            <FaShieldAlt />
          </Button>
        )}
        <Button
          variant="outline-danger"
          size="sm"
          onClick={handleLogout}
          title="Logout"
        >
          <FaSignOutAlt />
        </Button>

        {renderProfileModal()}
      </div>
    );
  }

  // Default: simple display
  return (
    <div className="d-flex align-items-center gap-3">
      {renderUserBadge()}
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => setShowProfileModal(true)}
      >
        Profile
      </Button>
      <Button variant="outline-danger" size="sm" onClick={handleLogout}>
        Logout
      </Button>

      {renderProfileModal()}
    </div>
  );
}

// Simple auth status display component
export const SimpleAuthStatus = () => {
  const { user, isAdmin } = useContext(AuthContext);

  if (!user) {
    return (
      <Badge bg="secondary" className="px-3 py-2">
        Not Signed In
      </Badge>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <Badge bg={isAdmin ? "danger" : "success"} className="px-3 py-2">
        {user.name} ({user.role})
      </Badge>
    </div>
  );
};
