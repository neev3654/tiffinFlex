const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Meal = require('../models/Meal');

dotenv.config();

const mealsData = [
  { name: 'Paneer Butter Masala', category: 'North Indian', calories: 380, price: 120, tags: ['vegetarian'], image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', rating: 4.8, description: 'Rich and creamy paneer in a buttery tomato gravy.' },
  { name: 'Dal Tadka', category: 'North Indian', calories: 220, price: 80, tags: ['vegetarian', 'high-protein'], image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', rating: 4.6, description: 'Yellow lentils tempered with cumin, garlic, and ghee.' },
  { name: 'Chicken Biryani', category: 'North Indian', calories: 520, price: 180, tags: ['non-vegetarian', 'high-protein'], image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', rating: 4.9, description: 'Fragrant basmati rice layered with spiced chicken.' },
  { name: 'Masala Dosa', category: 'South Indian', calories: 290, price: 90, tags: ['vegetarian', 'vegan'], image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', rating: 4.7, description: 'Crispy crepe filled with spiced potato filling.' },
  { name: 'Chole Bhature', category: 'North Indian', calories: 450, price: 110, tags: ['vegetarian'], image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400', rating: 4.5, description: 'Spicy chickpea curry with fluffy fried bread.' },
  { name: 'Veg Hakka Noodles', category: 'Chinese', calories: 340, price: 100, tags: ['vegetarian'], image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', rating: 4.3, description: 'Stir-fried noodles with fresh vegetables and soy sauce.' },
  { name: 'Idli Sambar', category: 'South Indian', calories: 180, price: 70, tags: ['vegetarian', 'vegan', 'gluten-free'], image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400', rating: 4.4, description: 'Steamed rice cakes with lentil stew and coconut chutney.' },
  { name: 'Egg Curry', category: 'North Indian', calories: 310, price: 100, tags: ['non-vegetarian', 'high-protein', 'gluten-free'], image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400', rating: 4.5, description: 'Boiled eggs simmered in a spiced onion-tomato gravy.' },
  { name: 'Rajma Chawal', category: 'North Indian', calories: 410, price: 90, tags: ['vegetarian', 'high-protein'], image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', rating: 4.7, description: 'Kidney bean curry served over steamed basmati rice.' },
  { name: 'Palak Paneer', category: 'North Indian', calories: 280, price: 130, tags: ['vegetarian', 'gluten-free'], image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400', rating: 4.6, description: 'Cottage cheese cubes in a creamy spinach gravy.' },
  { name: 'Fish Curry', category: 'South Indian', calories: 350, price: 200, tags: ['non-vegetarian', 'high-protein', 'gluten-free'], image: 'https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=400', rating: 4.8, description: 'Fresh fish simmered in coconut and tamarind curry.' },
  { name: 'Aloo Gobi', category: 'North Indian', calories: 200, price: 80, tags: ['vegetarian', 'vegan', 'gluten-free'], image: 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400', rating: 4.2, description: 'Spiced potato and cauliflower dry curry.' },
  { name: 'Butter Chicken', category: 'North Indian', calories: 490, price: 190, tags: ['non-vegetarian'], image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', rating: 4.9, description: 'Tender chicken in a rich, creamy tomato-butter sauce.' },
  { name: 'Veg Fried Rice', category: 'Chinese', calories: 320, price: 90, tags: ['vegetarian'], image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', rating: 4.3, description: 'Wok-tossed rice with crisp vegetables and aromatics.' },
  { name: 'Gulab Jamun', category: 'Desserts', calories: 300, price: 60, tags: ['vegetarian'], image: 'https://images.unsplash.com/photo-1666190064816-5f2a3804e7c1?w=400', rating: 4.8, description: 'Deep-fried milk dumplings soaked in rose-cardamom syrup.' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // --- Seed Admin ---
    const adminEmail = 'admin@tiffinflex.com';
    const existing = await User.findOne({ email: adminEmail });

    if (existing) {
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
        isVerified: true,
        provider: 'local',
      });
      console.log('✅ Admin user created:', adminEmail, '/ password: admin123');
    }

    // --- Seed Meals ---
    const mealCount = await Meal.countDocuments();
    if (mealCount === 0) {
      await Meal.insertMany(mealsData);
      console.log(`✅ ${mealsData.length} meals seeded successfully.`);
    } else {
      console.log(`ℹ️  ${mealCount} meals already exist. Skipping meal seed.`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
