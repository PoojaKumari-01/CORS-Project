import { createContext, useState, useEffect } from "react";
import { authAPI } from "../services/api.js";

const AuthContext = createContext(undefined);

export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage on initial mount
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // On app load, check for token and user in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  const login = async (login_id, password) => {
    try {
      setLoading(true);

      const response = await authAPI.login({ login_id, password });

      if (response.data.success) {
        const { token, user: userData } = response.data;
        const mp = new Map();
        if (userData.permissions) {
          userData.permissions.forEach((p) => {
            mp.set(p._id, p);
          });
        }
        userData.permissions = [];
        mp.forEach((value) => {
          userData.permissions.push(value);
        });
        localStorage.setItem("token", token);
        const userObj = {
          id: userData._id || userData.id,
          login_id: userData.login_id,
          type: userData.type,
          permissions: userData.permissions || [],
        };
        setUser(userObj);
        localStorage.setItem("user", JSON.stringify(userObj));
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Ignore errors
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
