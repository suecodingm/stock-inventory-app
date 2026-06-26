const Product = require('../models/Product');
const { validateProductQuery } = require('../validators/productQuery');

// Search products by name or SKU
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const validation = validateProductQuery(query);

    if (!validation.ok) {
      return res.status(validation.status).json(validation.body);
    }

    const products = await Product.search(validation.normalized);

    if (products.length === 0) {
      return res.status(404).json({
        message: 'No products found',
        query: validation.normalized
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

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Valid product ID is required' });
    }

    const product = await Product.getById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

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
