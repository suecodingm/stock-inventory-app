const pool = require('../db/connection');

class Product {
  // Search products by name or SKU
  static async search(query) {
    try {
      const searchQuery = `%${query}%`;
      const result = await pool.query(
        'SELECT id, name, sku, description FROM products WHERE name ILIKE $1 OR sku ILIKE $2 LIMIT 20',
        [searchQuery, searchQuery]
      );
      return result.rows;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Get all stores where product is in stock
  static async getStoresWithStock(productId) {
    try {
      const result = await pool.query(
        `SELECT 
          s.id, 
          s.name, 
          s.location, 
          i.quantity
        FROM stores s
        JOIN inventory i ON s.id = i.store_id
        WHERE i.product_id = $1 AND i.quantity > 0
        ORDER BY s.name`,
        [productId]
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching stores with stock:', error);
      throw error;
    }
  }

  // Get product details by ID
  static async getById(id) {
    try {
      const result = await pool.query(
        'SELECT id, name, sku, description FROM products WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  // Get all products
  static async getAll() {
    try {
      const result = await pool.query(
        'SELECT id, name, sku, description FROM products LIMIT 100'
      );
      return result.rows;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  }
}

module.exports = Product;
