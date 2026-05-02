import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/slices/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { loading, error, requiresVerification, verificationEmail } = useSelector((state) => state.auth);

  // Handle error from URL (e.g., from Google OAuth failure)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'google_auth_failed') {
      setLocalError('Google authentication failed. Please try again.');
    } else if (errorParam === 'auth_failed') {
      setLocalError('Authentication failed. Please try again.');
    }
    
    return () => {
      dispatch(clearError());
    };
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (requiresVerification && verificationEmail) {
      navigate('/verify-otp', { state: { email: verificationEmail } });
    }
  }, [requiresVerification, verificationEmail, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    if (!email || !password) {
      setLocalError('Please fill in all fields.');
      return;
    }

    const resultAction = await dispatch(login({ email, password }));
    if (login.fulfilled.match(resultAction)) {
      if (!resultAction.payload.requiresVerification) {
        navigate('/dashboard');
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };



  return (
    <div className="min-h-screen bg-espresso flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-cocoa to-espresso overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {['🍛', '🫔', '🥘', '🍚', '🍲'].map((e, i) => (
            <motion.span
              key={i}
              className="absolute text-6xl"
              style={{ left: `${15 + i * 18}%`, top: `${20 + i * 15}%` }}
              animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
            >
              {e}
            </motion.span>
          ))}
        </div>
        <div className="relative z-10 text-center px-12">
          <UtensilsCrossed className="w-16 h-16 text-gold mx-auto mb-6" />
          <h2 className="text-4xl font-serif font-bold text-offwhite mb-4">Welcome Back</h2>
          <p className="text-warm-grey text-lg leading-relaxed">
            Your personalized tiffin is waiting. Log in to customize today's meal before 10 AM.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <UtensilsCrossed className="w-8 h-8 text-gold" />
            <span className="text-xl font-serif font-bold italic text-gold">TiffinFlex</span>
          </div>

          <h1 className="text-3xl font-serif font-bold text-offwhite mb-2">Sign In</h1>
          <p className="text-warm-grey mb-8">Enter your credentials to access your account.</p>

          {(localError || error) && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {localError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-warm-grey mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-cocoa border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-offwhite placeholder:text-warm-grey/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-warm-grey mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cocoa border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-offwhite placeholder:text-warm-grey/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-grey hover:text-offwhite">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="w-4 h-4 rounded border-white/10 bg-cocoa accent-gold" />
                <span className="text-sm text-warm-grey">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-gold hover:text-gold-light transition-colors">Forgot password?</Link>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full bg-gold hover:bg-gold-light text-espresso py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-gold/20 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-espresso border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5" /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-warm-grey uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Google OAuth */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full border border-white/10 rounded-xl py-3.5 text-offwhite font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.27 9.76A7.08 7.08 0 0 1 12 5.48c1.68 0 3.19.59 4.38 1.55l3.27-3.27A11.96 11.96 0 0 0 12 .5 12 12 0 0 0 1.24 6.65l4.03 3.11z"/><path fill="#34A853" d="M16.04 18.01A7.4 7.4 0 0 1 12 19.02a7.08 7.08 0 0 1-6.73-4.76l-4.03 3.11A12 12 0 0 0 12 23.5c3.08 0 5.93-1.16 8.09-3.08l-4.05-2.41z"/><path fill="#4A90D9" d="M20.09 20.42A11.8 11.8 0 0 0 23.5 12c0-.82-.08-1.6-.22-2.36H12v4.64h6.46a5.5 5.5 0 0 1-2.42 3.65l4.05 2.49z"/><path fill="#FBBC05" d="M5.27 14.26a7.13 7.13 0 0 1 0-4.5L1.24 6.65a12 12 0 0 0 0 10.72l4.03-3.11z"/></svg>
            Continue with Google
          </button>

          {/* Signup Link */}
          <p className="text-center text-warm-grey mt-8 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-gold font-bold hover:text-gold-light transition-colors">
              Create one free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
