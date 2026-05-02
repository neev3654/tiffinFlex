const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const otpGenerator = require('otp-generator');
const User = require('../models/User');
const { Resend } = require('resend');

// Initialize Resend conditionally
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Send OTP Email
const sendOTPEmail = async (email, otp, name) => {
  if (!resend) {
    console.warn('RESEND_API_KEY is not configured. OTP email was not sent.');
    // For development without API key, you could return true and log the OTP
    return false;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: `TiffinFlex <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your OTP for TiffinFlex Registration',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #ffffff; border-radius: 10px;">
          <h2 style="color: #DAA520; text-align: center;">Welcome to TiffinFlex!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for signing up. Please use the following OTP to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #DAA520; background: #2a2a2a; padding: 15px 30px; border-radius: 8px;">${otp}</span>
          </div>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          <p style="color: #888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
};

// Send Password Reset Email
const sendResetEmail = async (email, resetUrl, name) => {
  if (!resend) {
    console.warn('RESEND_API_KEY is not configured. Reset email was not sent.');
    return false;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: `TiffinFlex <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Password Reset Request - TiffinFlex',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #ffffff; border-radius: 10px;">
          <h2 style="color: #DAA520; text-align: center;">Password Reset</h2>
          <p>Hi ${name},</p>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #DAA520; color: #1a1a1a; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
          <p>Or copy this link:</p>
          <p style="word-break: break-all; color: #DAA520;">${resetUrl}</p>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p style="color: #888; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
};

// POST /api/auth/register - Send OTP
const register = async (req, res) => {
  try {
    const { name, email, password, diet, allergies, spiceLevel, plan } = req.body;

    // Check if user exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'User already exists and is verified' });
    }

    // Generate 6-digit OTP
    const otp = otpGenerator.generate(6, { 
      upperCaseAlphabets: false, 
      lowerCaseAlphabets: false, 
      specialChars: false 
    });

    // Hash OTP
    const hashedOTP = await bcrypt.hash(otp, 10);

    if (existingUser && !existingUser.isVerified) {
      // Update existing unverified user
      existingUser.name = name;
      existingUser.password = password;
      existingUser.diet = diet || 'Vegetarian';
      existingUser.allergies = allergies || [];
      existingUser.spiceLevel = spiceLevel || 'Medium';
      existingUser.plan = plan || 'starter';
      existingUser.otp = hashedOTP;
      existingUser.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await existingUser.save();
    } else {
      // Create new user (unverified)
      await User.create({
        name,
        email,
        password,
        diet: diet || 'Vegetarian',
        allergies: allergies || [],
        spiceLevel: spiceLevel || 'Medium',
        plan: plan || 'starter',
        isVerified: false,
        otp: hashedOTP,
        otpExpires: Date.now() + 10 * 60 * 1000,
        provider: 'local'
      });
    }

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, name);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email. Please try again.' });
    }

    res.status(201).json({
      message: 'OTP sent to your email. Please verify to complete registration.',
      email,
      requiresVerification: true
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/verify-otp
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP expired
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, user.otp);
    if (!isValidOTP) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate token and return user
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      diet: user.diet,
      plan: user.plan,
      role: user.role,
      isVerified: true,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/resend-otp
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate new OTP
    const otp = otpGenerator.generate(6, { 
      upperCaseAlphabets: false, 
      lowerCaseAlphabets: false, 
      specialChars: false 
    });

    // Hash and save OTP
    const hashedOTP = await bcrypt.hash(otp, 10);
    user.otp = hashedOTP;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, user.name);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }

    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is verified
    if (!user.isVerified && user.provider === 'local') {
      return res.status(403).json({ 
        message: 'Email not verified. Please verify your email first.',
        requiresVerification: true,
        email: user.email
      });
    }

    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        diet: user.diet,
        plan: user.plan,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send reset email
    const emailSent = await sendResetEmail(email, resetUrl, user.name);
    
    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send reset email' });
    }

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. Please login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Google OAuth callback handler
const googleCallback = async (req, res) => {
  try {
    console.log('Google callback started');
    console.log('Request object keys:', Object.keys(req));
    console.log('req.user:', req.user);
    console.log('req.session:', req.session);
    const profile = req.user;
    
    if (!profile) {
      console.log('No profile found');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }

    const { id: googleId, emails, name, photos } = profile;
    const email = emails[0].value;
    const displayName = name.givenName + ' ' + name.familyName;
    const avatar = photos[0]?.value;

    console.log('Google user data:', { googleId, email, displayName });

    // Check if user exists
    let user = await User.findOne({ email });
    console.log('Existing user found:', !!user);

    if (user) {
      // Link Google to existing account if not already linked
      if (!user.googleId) {
        console.log('Linking Google to existing user');
        user.googleId = googleId;
        user.avatar = avatar || user.avatar;
        await user.save();
        console.log('Google linked successfully');
      }
    } else {
      // Create new user from Google
      console.log('Creating new Google user');
      user = await User.create({
        name: displayName,
        email,
        googleId,
        avatar,
        isVerified: true, // Google emails are verified
        provider: 'google',
        diet: 'Vegetarian',
        spiceLevel: 'Medium',
        plan: 'starter'
      });
      console.log('Google user created successfully');
    }

    // Generate token
    const token = generateToken(user._id);
    console.log('Token generated, redirecting to frontend');

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
      diet: user.diet,
      plan: user.plan,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar
    }))}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -resetPasswordToken');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  register, 
  verifyOTP, 
  resendOTP,
  login, 
  forgotPassword,
  resetPassword,
  googleCallback,
  getMe,
  generateToken
};
