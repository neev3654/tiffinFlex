const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { 
  register, 
  verifyOTP, 
  resendOTP,
  login, 
  forgotPassword,
  resetPassword,
  googleCallback,
  getMe,
  generateToken
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Google Strategy
console.log('Google OAuth Config:', {
  clientID: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
  callbackURL: process.env.GOOGLE_CALLBACK_URL
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('Google OAuth Success:', profile?.displayName || 'No profile');
      // Store profile in req.user for the callback
      return done(null, profile);
    }
  ));
} else {
  console.warn('⚠️ Google OAuth is disabled because GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing.');
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Local Auth Routes
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Google OAuth Routes
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ message: 'Google OAuth is not configured on the server.' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_not_configured`);
  }
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`, 
    session: false 
  })(req, res, next);
},
  async (req, res) => {
    try {
      console.log('Direct callback - req.user:', req.user);
      console.log('Direct callback - req.session:', req.session);
      
      // If req.user doesn't have the profile, try to get it from the session
      if (!req.user) {
        console.log('No user in req, checking other sources');
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
      }
      
      // Call the actual callback with the profile
      const profile = req.user;
      req.profile = profile; // Add profile to request
      await googleCallback(req, res);
    } catch (error) {
      console.error('Direct callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
  }
);

// Protected Route
router.get('/me', protect, getMe);

// Refresh Token Route
router.post('/refresh', protect, (req, res) => {
  const token = generateToken(req.user.id);
  res.json({ token });
});

module.exports = router;
