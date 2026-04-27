import React, { createContext, useContext, useState, useCallback } from 'react';
import initialNotifications from '../data/notifications';

const NotificationContext = createContext(null);

export const useNotifications = () => useContext(NotificationContext);

let toastId = 0;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* Mark a single notification as read */
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  /* Mark all as read */
  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  /* Show a toast — type: 'success' | 'error' | 'info' */
  const showToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  /* Dismiss a toast manually */
  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const value = {
    notifications,
    unreadCount,
    toasts,
    markAsRead,
    markAllRead,
    showToast,
    dismissToast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
