const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  seedMeals,
} = require('../controllers/mealController');

const router = express.Router();

// Public routes
router.get('/', getAllMeals);
router.get('/:id', getMealById);

// Admin-only routes (require auth + admin role)
router.post('/', protect, admin, createMeal);
router.put('/:id', protect, admin, updateMeal);
router.delete('/:id', protect, admin, deleteMeal);
router.post('/seed', protect, admin, seedMeals);

module.exports = router;
