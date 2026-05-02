import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    setUser(null);
  }, []);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('tf_token');
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data);
        } catch (err) {
          // Token invalid - clear storage
          localStorage.removeItem('tf_token');
          localStorage.removeItem('tf_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Setup axios interceptor for token refresh
  useEffect(() => {
    const interceptor = API.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const token = localStorage.getItem('tf_token');
            if (token) {
              // Try to refresh token
              const { data } = await API.post('/auth/refresh', {}, {
                headers: { Authorization: `Bearer ${token}` }
              });
              
              localStorage.setItem('tf_token', data.token);
              originalRequest.headers.Authorization = `Bearer ${data.token}`;
              
              return API(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed - logout user
            logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      API.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      // Check if verification required
      if (data.requiresVerification) {
        return { 
          success: false, 
          requiresVerification: true, 
          email: data.email,
          message: data.message 
        };
      }

      localStorage.setItem('tf_token', data.token);
      localStorage.setItem('tf_user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (err) {
      // Check if verification required from error
      if (err.response?.data?.requiresVerification) {
        return {
          success: false,
          requiresVerification: true,
          email: err.response.data.email,
          message: err.response.data.message
        };
      }
      return { success: false, message: err.response?.data?.message || 'Login failed' };
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
      
      return { 
        success: true, 
        requiresVerification: true, 
        email: data.email,
        message: data.message 
      };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Signup failed' };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      const { data } = await API.post('/auth/verify-otp', { email, otp });
      
      localStorage.setItem('tf_token', data.token);
      localStorage.setItem('tf_user', JSON.stringify(data));
      setUser(data);
      
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Verification failed' };
    }
  };

  const resendOTP = async (email) => {
    try {
      await API.post('/auth/resend-otp', { email });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to resend OTP' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await API.post('/auth/forgot-password', { email });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to send reset link' };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      await API.post('/auth/reset-password', { token, password });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to reset password' };
    }
  };

  // Google OAuth - redirect to backend
  const loginWithGoogle = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    window.location.href = `${apiUrl}/auth/google`;
  };

  const value = { 
    user, 
    isAuthenticated: !!user, 
    loading, 
    login, 
    signup, 
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    loginWithGoogle,
    logout 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
