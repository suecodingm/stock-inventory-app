import React from 'react';
import './ProductList.css';

function ProductList({ products, selectedProduct, onSelectProduct, loading }) {
  return (
    <div className="product-list">
      {products.map((product) => (
        <div
          key={product.id}
          className={`product-item ${selectedProduct?.id === product.id ? 'selected' : ''}`}
          onClick={() => onSelectProduct(product)}
        >
          <div className="product-header">
            <h3>{product.name}</h3>
            <span className="product-badge">SKU: {product.sku}</span>
          </div>
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}
          <div className="product-action">
            {selectedProduct?.id === product.id && loading && (
              <span className="loading-indicator">Loading stores...</span>
            )}
            {selectedProduct?.id === product.id && !loading && (
              <span className="selected-indicator">✓ Selected</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
