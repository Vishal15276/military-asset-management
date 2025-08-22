import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user session from localStorage
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // ---- LOGIN ----
  const login = async (credentials) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ---- SIGNUP ----
  const signup = async (credentials) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!data.success) {
        return { success: false, error: data.error || 'Signup failed' };
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ---- LOGOUT ----
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ---- PERMISSIONS ----
  const hasPermission = (permission) => {
    if (!user) return false;

    const permissions = {
      admin: [
        'view_all', 'manage_all',
        'view_equipment', 'manage_equipment',
        'record_purchase', 'assign_equipment',
        'view_reports'
      ],
      logistics: [
        'record_purchase',
        'assign_equipment',
        'view_reports'
      ],
      commander: [
        'view_equipment',
        'view_reports'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  const value = {
    user,
    login,
    signup,
    logout,
    hasPermission,  // ✅ exposed to Dashboard and Sidebar
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
