import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import SearchForm from './components/SearchForm';
import ProductList from './components/ProductList';
import StoresList from './components/StoresList';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [noStockMessage, setNoStockMessage] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setError('Please enter a product name or SKU');
      return;
    }

    setSearchQuery(query);
    setLoading(true);
    setError('');
    setNoStockMessage('');
    setProducts([]);
    setSelectedProduct(null);
    setStores([]);

    try {
      const response = await axios.get(`${API_URL}/api/products/search`, {
        params: { query }
      });

      if (response.data.products && response.data.products.length > 0) {
        setProducts(response.data.products);
      } else {
        setError(`❌ No products found matching "${query}". Please try a different search term.`);
        setProducts([]);
      }
    } catch (err) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        '❌ Error searching products. Please try again.';
      setError(message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = async (product) => {
    setSelectedProduct(product);
    setLoading(true);
    setError('');
    setNoStockMessage('');
    setStores([]);

    try {
      const response = await axios.get(`${API_URL}/api/products/${product.id}/stores`);
      
      if (response.data.stores && response.data.stores.length > 0) {
        setStores(response.data.stores);
        setNoStockMessage('');
      } else {
        // Product exists but no stock available
        setStores([]);
        setNoStockMessage(
          `⚠️ "${product.name}" is currently out of stock at all store locations. Please check back later!`
        );
      }
    } catch (err) {
      setError('❌ Error fetching store information. Please try again.');
      console.error('Store fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>📦 Stock Inventory Finder</h1>
        <p>Find where your products are in stock across all store locations</p>
      </header>

      <main className="app-main">
        <SearchForm onSearch={handleSearch} loading={loading} />

        {error && <div className="error-message" role="alert">{error}</div>}
        {noStockMessage && <div className="no-stock-message">{noStockMessage}</div>}

        <div className="results-container">
          {products.length > 0 && (
            <div className="results-section">
              <h2>Search Results ({products.length})</h2>
              <ProductList
                products={products}
                selectedProduct={selectedProduct}
                onSelectProduct={handleSelectProduct}
                loading={loading}
              />
            </div>
          )}

          {selectedProduct && stores.length > 0 && (
            <div className="stores-section">
              <h2>
                In Stock: <span className="product-name">{selectedProduct.name}</span>
              </h2>
              <p className="product-sku">SKU: {selectedProduct.sku}</p>
              <StoresList stores={stores} />
            </div>
          )}

          {!products.length && !loading && !error && !noStockMessage && (
            <div className="empty-state">
              <p>🔍 Start by searching for a product above</p>
            </div>
          )}

          {loading && <div className="loading">Loading...</div>}
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Stock Inventory System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
