require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Use environment variable for frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// API Routes
app.use('/api/products', productRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Stock Inventory API',
    version: '1.0.0',
    endpoints: {
      search: 'GET /api/products/search?query=<name_or_sku>',
      stores: 'GET /api/products/:id/stores'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`CORS enabled for: ${FRONTEND_URL}`);
});

module.exports = app;
