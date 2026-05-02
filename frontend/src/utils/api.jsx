import axios from 'axios';
import { storage } from './storage';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request automatically
API.interceptors.request.use((config) => {
  const token = storage.local.get('tf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling and retries
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry logic: retry up to 2 times for 5xx errors or network errors
    if (!originalRequest._retryCount) originalRequest._retryCount = 0;
    
    if (
      originalRequest._retryCount < 2 && 
      (error.code === 'ECONNABORTED' || (error.response && error.response.status >= 500))
    ) {
      originalRequest._retryCount += 1;
      const delay = originalRequest._retryCount * 1000;
      return new Promise(resolve => setTimeout(() => resolve(API(originalRequest)), delay));
    }

    // Handle 401 Unauthorized (expired token)
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      // Note: We can't easily dispatch to Redux from here directly without a circular dependency
      // or passing the store. For now, we clear storage and let the app state catch up.
      storage.local.remove('tf_token');
      storage.local.remove('tf_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }

    return Promise.reject(error);
  }
);

export default API;
