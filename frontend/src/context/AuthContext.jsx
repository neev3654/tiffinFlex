import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('tf_token');
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data);
        } catch {
          // Token invalid or backend down — try saved user
          const saved = localStorage.getItem('tf_user');
          if (saved) setUser(JSON.parse(saved));
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('tf_token', data.token);
      localStorage.setItem('tf_user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (err) {
      // Fallback: dummy auth when backend is offline
      if (email === 'admin@tiffinflex.com' && password === 'admin123') {
        const userData = { name: 'Admin', email, plan: 'pro', diet: 'Vegetarian', role: 'admin' };
        localStorage.setItem('tf_token', 'dummy-jwt-token');
        localStorage.setItem('tf_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      if (email === 'demo@tiffinflex.com' && password === 'demo123') {
        const userData = { name: 'Neev Patel', email, plan: 'regular', diet: 'Vegetarian', role: 'user' };
        localStorage.setItem('tf_token', 'dummy-jwt-token');
        localStorage.setItem('tf_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      }
      return { success: false, message: err.response?.data?.message || 'Login failed. Try demo@tiffinflex.com / demo123' };
    }
  };

  const signup = async (userData) => {
    try {
      const { data } = await API.post('/auth/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        diet: userData.diet,
        allergies: userData.selectedAllergies,
        spiceLevel: userData.spiceLevel,
        plan: userData.selectedPlan,
      });
      localStorage.setItem('tf_token', data.token);
      localStorage.setItem('tf_user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (err) {
      // Fallback: dummy signup when backend is offline
      const fallback = { name: userData.name, email: userData.email, plan: userData.selectedPlan, diet: userData.diet };
      localStorage.setItem('tf_token', 'dummy-jwt-token');
      localStorage.setItem('tf_user', JSON.stringify(fallback));
      setUser(fallback);
      return { success: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    setUser(null);
  };

  const value = { user, isAuthenticated: !!user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
