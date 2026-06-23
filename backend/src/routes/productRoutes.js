const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Search products by name or SKU
router.get('/search', productController.searchProducts);

// Get all products
router.get('/', productController.getAllProducts);

// Get stores where product is in stock
router.get('/:id/stores', productController.getProductStores);

module.exports = router;
