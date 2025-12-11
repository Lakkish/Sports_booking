import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

/**
 * Component to protect routes that require admin role
 * First checks authentication, then checks admin role
 * Shows appropriate error messages
 */
export default function RequireAdmin({
  children,
  redirectPath = "/auth",
  fallbackPath = "/",
}) {
  const { user, isLoading, isAdmin } = useContext(AuthContext);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-50">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-muted">Checking permissions...</p>
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If user is authenticated but not admin, show access denied
  // Redirect to fallback path (default: home) with error state
  if (!isAdmin) {
    return (
      <Navigate
        to={fallbackPath}
        state={{
          from: location,
          error: "Access denied. Admin privileges required.",
        }}
        replace
      />
    );
  }

  // If user is admin, render the admin component
  return children;
}
