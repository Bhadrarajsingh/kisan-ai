import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // ── Restore session from localStorage on app mount ────────
  useEffect(() => {
    const savedToken = localStorage.getItem('monsoon_ai_token');
    const savedUser  = localStorage.getItem('monsoon_ai_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('monsoon_ai_token');
        localStorage.removeItem('monsoon_ai_user');
        setUser(null);
        setToken(null);
      }
    } else {
      setUser(null);
      setToken(null);
    }
    setIsLoading(false);
  }, []);

  // ── Persist session helpers ───────────────────────────────
  const saveSession = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('monsoon_ai_user', JSON.stringify(userData));
    localStorage.setItem('monsoon_ai_token', authToken);
  };

  // ── Login with Email + Password ───────────────────────────
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // Send as 'identifier' for backend compatibility
      const res = await api.login({ identifier: email, email, password });
      if (res?.success && res.user) {
        saveSession(res.user, res.token);
        return { success: true, user: res.user };
      }
      // Backend returned success:false without throwing
      const msg = res?.message || 'Login failed.';
      setAuthError(msg);
      return { success: false, message: msg };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Invalid email or password.'
          : 'Login failed. Please check your connection.');
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // ── Register new user ─────────────────────────────────────
  const register = async (userData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await api.register(userData);
      if (res?.success && res.user) {
        saveSession(res.user, res.token);
        return { success: true, user: res.user };
      }
      const msg = res?.message || 'Registration failed.';
      setAuthError(msg);
      return { success: false, message: msg };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 409
          ? 'An account with this email already exists.'
          : 'Registration failed. Please try again.');
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout ────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('monsoon_ai_user');
    localStorage.removeItem('monsoon_ai_token');
  };

  // ── Update local user profile (after edit) ─────────────────
  const updateUserProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('monsoon_ai_user', JSON.stringify(updated));
  };

  // ── Refresh user data from backend ───────────────────────
  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res?.success && res.user) {
        setUser(res.user);
        localStorage.setItem('monsoon_ai_user', JSON.stringify(res.user));
        return res.user;
      }
    } catch {
      // Token expired / invalid – logout silently
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        authError,
        setAuthError,
        login,
        register,
        logout,
        updateUserProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
