import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Toast from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingPage from './components/LoadingPage';

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const VerifyOtpPage = lazy(() => import('./pages/VerifyOtpPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ReferralPage = lazy(() => import('./pages/ReferralPage'));
const NutritionPage = lazy(() => import('./pages/NutritionPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const MenuManager = lazy(() => import('./pages/admin/MenuManager'));

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <Router>
            <ErrorBoundary>
              <div className="min-h-screen bg-espresso transition-colors duration-300">
                <Suspense fallback={<LoadingPage />}>
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/verify-otp" element={<VerifyOtpPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                    <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/referral" element={<ProtectedRoute><ReferralPage /></ProtectedRoute>} />
                    <Route path="/nutrition" element={<ProtectedRoute><NutritionPage /></ProtectedRoute>} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/menu" element={<AdminRoute><MenuManager /></AdminRoute>} />
                  </Routes>
                </Suspense>
              </div>
              <Toast />
            </ErrorBoundary>
          </Router>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;

