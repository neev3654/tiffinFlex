import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tf_token');
    const savedUser = localStorage.getItem('tf_user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    if (email === 'demo@tiffinflex.com' && password === 'demo123') {
      const userData = { name: 'Neev Patel', email, plan: 'regular', diet: 'Vegetarian' };
      localStorage.setItem('tf_token', 'dummy-jwt-token');
      localStorage.setItem('tf_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials. Try demo@tiffinflex.com / demo123' };
  };

  const signup = (userData) => {
    localStorage.setItem('tf_token', 'dummy-jwt-token');
    localStorage.setItem('tf_user', JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
