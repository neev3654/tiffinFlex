const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['North Indian', 'South Indian', 'Continental', 'Chinese', 'Thali', 'Desserts'],
    default: 'North Indian' 
  },
  calories: { type: Number, required: true },
  price: { type: Number, required: true },
  inventory: { type: Number, default: 50 },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  tags: [{ type: String }],
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// Index for search and filtering
mealSchema.index({ name: 'text', category: 1 });

module.exports = mongoose.model('Meal', mealSchema);
