import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authService from "../services/authService";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Initialize Auth State from LocalStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    showToast("Logged out successfully", "info");
  }, [showToast]);

  // Handle cross-app token expiration events from Axios interceptors
  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
    };

    window.addEventListener("auth-logout", handleAuthLogout);
    return () => {
      window.removeEventListener("auth-logout", handleAuthLogout);
    };
  }, [logout]);

  const loginUser = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      
      const userData = { _id: data._id, name: data.name, email: data.email };
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(data.token);
      setUser(userData);
      
      showToast(`Welcome back, ${data.name}!`, "success");
      return true;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK"
          ? "Cannot connect to server. Please verify if the backend is running."
          : "Invalid credentials. Please try again.");
      showToast(errorMsg, "error");
      throw error;
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const data = await authService.register(name, email, password);
      
      const userData = { _id: data._id, name: data.name, email: data.email };
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(data.token);
      setUser(userData);

      showToast(`Account created! Welcome, ${data.name}!`, "success");
      return true;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        (error.code === "ERR_NETWORK"
          ? "Cannot connect to server. Please verify if the backend is running."
          : "Registration failed. Email might be in use.");
      showToast(errorMsg, "error");
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    loginUser,
    registerUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
