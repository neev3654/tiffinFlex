const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@tiffinflex.com';
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
      // Update role to admin if user exists but isn't admin
      if (existing.role !== 'admin') {
        await User.findOneAndUpdate({ email: adminEmail }, { role: 'admin' });
        console.log('✅ Existing user upgraded to admin:', adminEmail);
      } else {
        console.log('ℹ️  Admin already exists:', adminEmail);
      }
    } else {
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'admin123',
        diet: 'Vegetarian',
        plan: 'pro',
        role: 'admin',
      });
      console.log('✅ Admin user created:', adminEmail, '/ password: admin123');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedAdmin();
