import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

/**
 * Higher-order component that adds authentication guards to any component
 * Can be used as a wrapper or as a hook-like component
 */
export default function AuthGuard({
  children,
  requireAuth = false,
  requireAdmin = false,
  requirePermissions = [],
  redirectUnauthenticated = "/auth",
  redirectUnauthorized = "/",
  showLoader = true,
}) {
  const { user, isLoading, isAdmin, hasPermission } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run checks when auth state is loaded
    if (!isLoading) {
      // Check authentication requirement
      if (requireAuth && !user) {
        navigate(redirectUnauthenticated, {
          state: { from: location },
          replace: true,
        });
        return;
      }

      // Check admin requirement
      if (requireAdmin && user && !isAdmin) {
        navigate(redirectUnauthorized, {
          state: {
            from: location,
            error: "Admin access required",
          },
          replace: true,
        });
        return;
      }

      // Check permission requirements
      if (requirePermissions.length > 0 && user) {
        const hasAllPermissions = requirePermissions.every((permission) =>
          hasPermission(permission)
        );

        if (!hasAllPermissions) {
          navigate(redirectUnauthorized, {
            state: {
              from: location,
              error: "Insufficient permissions",
            },
            replace: true,
          });
          return;
        }
      }
    }
  }, [
    user,
    isLoading,
    isAdmin,
    hasPermission,
    requireAuth,
    requireAdmin,
    requirePermissions,
    location,
    navigate,
    redirectUnauthenticated,
    redirectUnauthorized,
  ]);

  // Show loading state if configured
  if (isLoading && showLoader) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return children;
}

// Pre-configured auth guard components
export const UserAuthGuard = ({ children }) => (
  <AuthGuard requireAuth redirectUnauthenticated="/auth">
    {children}
  </AuthGuard>
);

export const AdminAuthGuard = ({ children }) => (
  <AuthGuard
    requireAuth
    requireAdmin
    redirectUnauthenticated="/auth"
    redirectUnauthorized="/"
  >
    {children}
  </AuthGuard>
);

export const PermissionAuthGuard = ({ children, permissions }) => (
  <AuthGuard
    requireAuth
    requirePermissions={permissions}
    redirectUnauthenticated="/auth"
    redirectUnauthorized="/"
  >
    {children}
  </AuthGuard>
);
