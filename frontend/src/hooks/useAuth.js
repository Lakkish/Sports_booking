// hooks/useAuth.js - SIMPLIFIED
export const useAuth = () => {
  return {
    user: {
      _id: "dummy123",
      name: "Demo User",
      email: "demo@example.com",
      role: "user", // Change to "admin" for admin testing
    },
    login: () => console.log("Demo login"),
    logout: () => (window.location.href = "/"),
    isAuthenticated: true,
    isAdmin: false, // Set to true for admin testing
    getUserId: () => "dummy123",
  };
};
