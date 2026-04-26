const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TiffinFlex API 🍱' });
});
app.use('/api/auth', authRoutes);

// Connect DB & Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(() => {
  // Start server without DB for development with dummy data
  console.log('Starting server without MongoDB...');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (no DB)`);
  });
});
