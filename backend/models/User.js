const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { 
    type: String, 
    required: function() { return this.provider === 'local'; },
    minlength: 6 
  },
  diet: { type: String, enum: ['Vegetarian', 'Non-Veg', 'Vegan'], default: 'Vegetarian' },
  allergies: [{ type: String }],
  spiceLevel: { type: String, default: 'Medium' },
  plan: { type: String, enum: ['starter', 'regular', 'pro'], default: 'starter' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // OTP Verification fields
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  
  // Google OAuth fields
  googleId: { type: String, unique: true, sparse: true },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  avatar: { type: String },
  
  // Password reset
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
