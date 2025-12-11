import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

/**
 * Component to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 * Shows loading spinner while checking auth state
 */
export default function RequireAuth({ children, redirectPath = "/auth" }) {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-50">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-muted">Checking authentication...</p>
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  // Save the current location to redirect back after login
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If user is authenticated, render the protected component
  return children;
}
