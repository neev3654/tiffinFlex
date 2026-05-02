const Meal = require('../models/Meal');

// @desc    Get all meals (with optional filters)
// @route   GET /api/meals
// @access  Public
const getAllMeals = async (req, res) => {
  try {
    const { category, search, active } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (active !== undefined) filter.active = active === 'true';
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const meals = await Meal.find(filter).sort({ createdAt: -1 });
    res.json(meals);
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single meal by ID
// @route   GET /api/meals/:id
// @access  Public
const getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json(meal);
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new meal
// @route   POST /api/meals
// @access  Admin
const createMeal = async (req, res) => {
  try {
    const { name, category, calories, price, inventory, image, description, tags, rating, active } = req.body;

    if (!name || !calories || !price) {
      return res.status(400).json({ message: 'Name, calories, and price are required.' });
    }

    const meal = await Meal.create({
      name,
      category: category || 'North Indian',
      calories,
      price,
      inventory: inventory || 50,
      image: image || '',
      description: description || '',
      tags: tags || [],
      rating: rating || 4.0,
      active: active !== undefined ? active : true,
    });

    res.status(201).json(meal);
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a meal
// @route   PUT /api/meals/:id
// @access  Admin
const updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    const updatedMeal = await Meal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedMeal);
  } catch (error) {
    console.error('Update meal error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a meal
// @route   DELETE /api/meals/:id
// @access  Admin
const deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    await Meal.findByIdAndDelete(req.params.id);
    res.json({ message: `"${meal.name}" has been deleted.` });
  } catch (error) {
    console.error('Delete meal error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed meals into the database
// @route   POST /api/meals/seed
// @access  Admin
const seedMeals = async (req, res) => {
  try {
    const seedData = [
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

    // Clear existing meals and seed fresh data
    await Meal.deleteMany({});
    const meals = await Meal.insertMany(seedData);
    res.status(201).json({ message: `${meals.length} meals seeded successfully.`, count: meals.length });
  } catch (error) {
    console.error('Seed meals error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllMeals, getMealById, createMeal, updateMeal, deleteMeal, seedMeals };
