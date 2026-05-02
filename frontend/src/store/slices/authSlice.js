import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';
import { storage } from '../../utils/storage';

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const token = storage.local.get('tf_token');
    if (!token) return null;
    const { data } = await API.get('/auth/me');
    return data;
  } catch (err) {
    storage.local.remove('tf_token');
    storage.local.remove('tf_user');
    return rejectWithValue(err.response?.data?.message || 'Failed to load user');
  }
});

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/login', { email, password });
    if (data.requiresVerification) return data;
    storage.local.set('tf_token', data.token);
    storage.local.set('tf_user', data);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/register', userData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/auth/verify-otp', { email, otp });
    storage.local.set('tf_token', data.token);
    storage.local.set('tf_user', data);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Verification failed');
  }
});

const initialState = {
  user: storage.local.get('tf_user'),
  token: storage.local.get('tf_token'),
  loading: false,
  error: null,
  requiresVerification: false,
  verificationEmail: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      storage.local.remove('tf_token');
      storage.local.remove('tf_user');
      state.user = null;
      state.token = null;
      state.requiresVerification = false;
      state.verificationEmail = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.requiresVerification) {
          state.requiresVerification = true;
          state.verificationEmail = action.payload.email;
        } else {
          state.user = action.payload;
          state.token = action.payload.token;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.requiresVerification) {
          state.requiresVerification = true;
          state.verificationEmail = action.payload.email;
        } else {
          state.error = action.payload?.message || 'Login failed';
        }
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.requiresVerification = false;
        state.verificationEmail = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
