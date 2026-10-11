import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('auracv_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Send cookie to server to validate active session on initial load
    const fetchUser = async () => {
      try {
        const res = await authAPI.getMe();
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        // No active or valid cookie session
        localStorage.removeItem('auracv_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await authAPI.login({ email, password });
      if (res.data.success) {
        localStorage.setItem('auracv_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      const res = await authAPI.register({ name, email, password });
      if (res.data.success) {
        localStorage.setItem('auracv_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const demoLogin = async () => {
    setAuthError(null);
    try {
      const res = await authAPI.demoLogin();
      if (res.data.success) {
        localStorage.setItem('auracv_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Demo login failed.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (_) {}
    localStorage.removeItem('auracv_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        loading,
        authError,
        setAuthError,
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
