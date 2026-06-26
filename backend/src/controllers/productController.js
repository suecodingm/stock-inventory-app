const Product = require('../models/Product');

// Search products by name or SKU
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        error: 'Search query is required',
        example: '/api/products/search?query=laptop'
      });
    }

    // Validate search query: allow only letters, numbers, and hyphens
    const trimmedQuery = query.trim();
    const validQueryPattern = /^[A-Za-z0-9-]+$/;

    if (!validQueryPattern.test(trimmedQuery)) {
      return res.status(400).json({
        error: 'Invalid search query. Use only letters, numbers, and hyphen (-).',
        query: query
      });
    }

    const products = await Product.search(trimmedQuery);

    if (products.length === 0) {
      return res.status(404).json({
        message: 'No products found',
        query: trimmedQuery
      });
    }

    res.status(200).json({
      count: products.length,
      products: products
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get stores where product is in stock
exports.getProductStores = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Valid product ID is required' });
    }

    // Check if product exists
    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Get stores with stock
    const stores = await Product.getStoresWithStock(id);

    res.status(200).json({
      product: product,
      storesInStock: stores.length,
      stores: stores
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all products (optional)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json({
      count: products.length,
      products: products
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
