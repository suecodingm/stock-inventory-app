import React, { useState } from 'react';
import './SearchForm.css';

function SearchForm({ onSearch, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-input-group">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search by product name or SKU (e.g., 'Laptop Pro 15' or 'LP15-2024')"
          className="search-input"
          disabled={loading}
          autoFocus
        />
        <button
          type="submit"
          className="search-button"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <p className="search-hint">💡 Tip: You can search by product name or SKU code</p>
    </form>
  );
}

export default SearchForm;
