import { createContext, useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Create context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storedUser, setStoredUser] = useLocalStorage("user", null);
  const [storedToken, setStoredToken] = useLocalStorage("token", null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (storedUser && storedToken) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear corrupted storage
        setStoredUser(null);
        setStoredToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Validate token and refresh if needed
  useEffect(() => {
    const validateToken = async () => {
      if (!storedToken) return;

      try {
        // Here you could add token validation logic
        // For example, checking expiration or calling a validation endpoint
        const tokenExpiry = getTokenExpiry(storedToken);

        if (tokenExpiry && tokenExpiry < Date.now()) {
          // Token expired, logout
          logout();
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    if (user) {
      validateToken();
    }
  }, [user, storedToken]);

  // Helper to extract expiry from JWT token
  const getTokenExpiry = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
    } catch {
      return null;
    }
  };

  // Login function
  const login = useCallback(
    (userData, token) => {
      try {
        setUser(userData);
        setStoredUser(userData);
        setStoredToken(token);

        // Emit login event for other components
        window.dispatchEvent(
          new CustomEvent("auth:login", { detail: userData })
        );
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [setStoredUser, setStoredToken]
  );

  // Logout function
  const logout = useCallback(() => {
    try {
      setUser(null);
      setStoredUser(null);
      setStoredToken(null);

      // Clear any other app-related storage
      localStorage.removeItem("bookingDraft");
      localStorage.removeItem("selectedDate");

      // Emit logout event for other components
      window.dispatchEvent(new CustomEvent("auth:logout"));
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [setStoredUser, setStoredToken]);

  // Update user data
  const updateUser = useCallback(
    (updatedData) => {
      try {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        setStoredUser(newUser);

        // Emit update event
        window.dispatchEvent(
          new CustomEvent("auth:update", { detail: newUser })
        );
      } catch (error) {
        console.error("Update user error:", error);
        throw error;
      }
    },
    [user, setStoredUser]
  );

  // Check if user has specific role
  const hasRole = useCallback(
    (role) => {
      return user?.role === role;
    },
    [user]
  );

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback(
    (roles) => {
      return roles.includes(user?.role);
    },
    [user]
  );

  // Check if user has all specified roles (for multiple roles)
  const hasAllRoles = useCallback(
    (roles) => {
      return roles.every((role) => user?.roles?.includes(role));
    },
    [user]
  );

  // Get user permissions based on role
  const getPermissions = useCallback(() => {
    const rolePermissions = {
      admin: [
        "manage_courts",
        "manage_coaches",
        "manage_equipment",
        "manage_pricing",
        "view_all_bookings",
        "manage_users",
      ],
      user: ["book_courts", "view_own_bookings", "cancel_own_bookings"],
      guest: ["view_courts"],
    };

    return rolePermissions[user?.role] || rolePermissions.guest;
  }, [user]);

  // Check if user has specific permission
  const hasPermission = useCallback(
    (permission) => {
      const permissions = getPermissions();
      return permissions.includes(permission);
    },
    [getPermissions]
  );

  // Refresh token (if implemented in backend)
  const refreshToken = useCallback(async () => {
    try {
      // This would call your refresh token endpoint
      // const response = await api.post('/auth/refresh');
      // const { token } = response.data;
      // setStoredToken(token);
      // return token;
      return storedToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      throw error;
    }
  }, [storedToken, logout]);

  // Context value
  const contextValue = {
    // State
    user,
    isLoading,

    // Actions
    login,
    logout,
    updateUser,

    // Getters
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    getUserId: () => user?._id || null,
    getToken: () => storedToken,

    // Role and permission checks
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    getPermissions,

    // Token management
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
