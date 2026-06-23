import React from 'react';
import './StoresList.css';

function StoresList({ stores }) {
  const getTotalStock = () => {
    return stores.reduce((sum, store) => sum + store.quantity, 0);
  };

  const getStockStatus = (quantity) => {
    if (quantity > 20) return 'high';
    if (quantity > 10) return 'medium';
    return 'low';
  };

  return (
    <div className="stores-list">
      <div className="stores-summary">
        <div className="summary-item">
          <span className="summary-label">Total Stores</span>
          <span className="summary-value">{stores.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Stock</span>
          <span className="summary-value">{getTotalStock()} units</span>
        </div>
      </div>

      <div className="stores-grid">
        {stores.map((store) => (
          <div
            key={store.id}
            className={`store-card stock-${getStockStatus(store.quantity)}`}
          >
            <div className="store-info">
              <h4 className="store-name">📍 {store.name}</h4>
              {store.location && (
                <p className="store-location">{store.location}</p>
              )}
            </div>
            <div className="store-quantity">
              <span className="quantity-label">Available</span>
              <span className="quantity-value">{store.quantity}</span>
              <span className="quantity-unit">units</span>
            </div>
            <div className="stock-indicator">
              <div
                className="stock-bar"
                style={{
                  width: `${Math.min((store.quantity / 30) * 100, 100)}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoresList;
