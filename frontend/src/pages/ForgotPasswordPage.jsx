import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Mail, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      await API.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <UtensilsCrossed className="w-8 h-8 text-gold" />
          <span className="text-xl font-serif font-bold italic text-gold">TiffinFlex</span>
        </Link>

        {/* Card */}
        <div className="bg-cocoa border border-white/5 rounded-2xl p-8">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 text-warm-grey hover:text-offwhite transition-colors mb-6 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to login
                </Link>

                <h2 className="text-2xl font-serif font-bold text-offwhite mb-2">
                  Forgot Password?
                </h2>
                <p className="text-warm-grey mb-6 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-warm-grey mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-grey" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-espresso border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-offwhite placeholder:text-warm-grey/50 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="w-full bg-gold hover:bg-gold-light text-espresso py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-gold/20 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="animate-pulse">Sending...</span>
                    ) : (
                      <>
                        Send Reset Link <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-serif font-bold text-offwhite mb-3">
                  Check Your Email
                </h3>
                <p className="text-warm-grey mb-6 text-sm">
                  We've sent a password reset link to<br />
                  <span className="text-offwhite">{email}</span>
                </p>
                <p className="text-warm-grey text-sm mb-6">
                  Didn't receive it? Check your spam folder or{' '}
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-gold hover:text-gold-light transition-colors"
                  >
                    try again
                  </button>
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
