import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP, clearError } from '../store/slices/authSlice';
import API from '../utils/api';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Get email from navigation state
    const emailFromState = location.state?.email;
    if (emailFromState) {
      setEmail(emailFromState);
    } else {
      // Redirect to signup if no email
      navigate('/signup');
    }
  }, [location, navigate]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0 && !canResend) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendTimer, canResend]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setLocalError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    
    // Focus last filled input or first empty
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setLocalError('Please enter all 6 digits');
      return;
    }

    setLocalError('');
    dispatch(clearError());

    const resultAction = await dispatch(verifyOTP({ email, otp: otpString }));
    if (verifyOTP.fulfilled.match(resultAction)) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    setLocalError('');
    dispatch(clearError());
    
    try {
      await API.post('/auth/resend-otp', { email });
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-offwhite mb-2">Verified!</h2>
          <p className="text-warm-grey">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

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
          <h2 className="text-2xl font-serif font-bold text-offwhite mb-2 text-center">
            Verify Your Email
          </h2>
          <p className="text-warm-grey text-center mb-6 text-sm">
            Enter the 6-digit code sent to<br />
            <span className="text-offwhite">{email}</span>
          </p>

          {(localError || error) && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {localError || error}
            </div>
          )}

          {/* OTP Inputs */}
          <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 bg-espresso border border-white/10 rounded-xl text-center text-xl font-bold text-offwhite focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-gold hover:bg-gold-light text-espresso py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Verify <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>

          {/* Resend */}
          <p className="text-center text-warm-grey mt-6 text-sm">
            Didn't receive the code?{' '}
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-gold font-bold hover:text-gold-light transition-colors"
              >
                {isResending ? 'Resending...' : 'Resend'}
              </button>
            ) : (
              <span className="text-warm-grey">
                Resend in <span className="text-gold">{resendTimer}s</span>
              </span>
            )}
          </p>

          {/* Back to Signup */}
          <p className="text-center text-warm-grey mt-4 text-sm">
            Wrong email?{' '}
            <Link to="/signup" className="text-gold font-bold hover:text-gold-light transition-colors">
              Go back
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOtpPage;
