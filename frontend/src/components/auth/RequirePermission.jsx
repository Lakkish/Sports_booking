import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spinner, Alert } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

/**
 * Component to protect routes that require specific permissions
 * Checks if user has all required permissions
 * Can also check for any permission if anyPermission flag is true
 */
export default function RequirePermission({
  children,
  permissions = [],
  anyPermission = false, // if true, user needs any of the permissions
  redirectPath = "/auth",
  fallbackPath = "/",
  showForbidden = true, // show custom forbidden page instead of redirect
}) {
  const { user, isLoading, hasPermission, hasAllRoles } =
    useContext(AuthContext);
  const location = useLocation();

  // Show loading spinner while checking permissions
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

  // Check permissions based on mode
  let hasRequiredPermissions = false;

  if (anyPermission) {
    // User needs ANY of the specified permissions
    hasRequiredPermissions = permissions.some((permission) =>
      hasPermission(permission)
    );
  } else {
    // User needs ALL of the specified permissions
    hasRequiredPermissions = permissions.every((permission) =>
      hasPermission(permission)
    );
  }

  // If user doesn't have required permissions
  if (!hasRequiredPermissions) {
    // Option 1: Show custom forbidden page
    if (showForbidden) {
      return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
          <div className="text-center p-5 bg-light rounded-3 shadow-sm">
            <Alert variant="danger" className="border-0">
              <Alert.Heading className="display-6">Access Denied</Alert.Heading>
              <p className="lead">
                You don't have permission to access this page.
              </p>
              <hr />
              <div className="d-flex justify-content-center gap-3 mt-4">
                <p className="mb-0">
                  Required permissions: {permissions.join(", ")}
                </p>
              </div>
            </Alert>
          </div>
        </div>
      );
    }

    // Option 2: Redirect to fallback path
    return (
      <Navigate
        to={fallbackPath}
        state={{
          from: location,
          error: "Insufficient permissions to access this resource.",
        }}
        replace
      />
    );
  }

  // If user has required permissions, render the component
  return children;
}

// Helper component for common permission checks
export const RequireBookingPermission = ({ children }) => (
  <RequirePermission
    permissions={["book_courts", "view_own_bookings"]}
    anyPermission
  >
    {children}
  </RequirePermission>
);

export const RequireManagementPermission = ({ children }) => (
  <RequirePermission
    permissions={["manage_courts", "manage_coaches", "manage_equipment"]}
    anyPermission
  >
    {children}
  </RequirePermission>
);
