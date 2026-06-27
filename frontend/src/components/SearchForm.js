import React, { useState } from 'react';
import axios from 'axios';
import SearchForm from './components/SearchForm';
// import ProductList from './components/ProductList'; // if you have one

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (rawQuery) => {
    const query = rawQuery.trim();

    setLoading(true);
    setError('');
    setProducts([]);

    try {
      const res = await axios.get(`/api/products/search?query=${encodeURIComponent(query)}`);
      setProducts(res.data.products || []);
    } catch (err) {
      const apiMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Request failed';
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchForm onSearch={handleSearch} loading={loading} />

      {error && <p role="alert">{error}</p>}

      {/* Example render; adapt to your real UI */}
      {products.length > 0 && (
        <ul>
          {products.map((p) => (
            <li key={p.id}>
              {p.name} - {p.sku}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
