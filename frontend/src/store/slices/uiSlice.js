import { createSlice } from '@reduxjs/toolkit';
import initialNotifications from '../../data/notifications';

const initialState = {
  persistentNotifications: initialNotifications,
  toasts: [],
  globalLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      // This adds a temporary toast
      state.toasts.push({
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || 'info',
      });
    },
    removeNotification: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
    markAsRead: (state, action) => {
      state.persistentNotifications = state.persistentNotifications.map(n => 
        n.id === action.payload ? { ...n, read: true } : n
      );
    },
    markAllRead: (state) => {
      state.persistentNotifications = state.persistentNotifications.map(n => ({ ...n, read: true }));
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
  },
});

export const { 
  addNotification, 
  removeNotification, 
  markAsRead, 
  markAllRead, 
  setGlobalLoading 
} = uiSlice.actions;

export default uiSlice.reducer;
