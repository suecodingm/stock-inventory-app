const VALID_QUERY_PATTERN = /^[A-Za-z0-9-]+$/;

const normalizeQuery = (value = '') => value.trim();

const isValidCharacters = (value) => VALID_QUERY_PATTERN.test(value);

const isLikelySku = (value) => /^[A-Za-z0-9-]+$/.test(value) && /\d/.test(value);

const countDigits = (value) => (value.match(/\d/g) || []).length;

const validateProductQuery = (rawQuery) => {
  if (rawQuery === undefined || rawQuery === null || String(rawQuery).trim() === '') {
    return {
      ok: false,
      status: 400,
      body: {
        error: 'Search query is required',
        example: '/api/products/search?query=laptop'
      }
    };
  }

  const normalized = normalizeQuery(String(rawQuery));

  if (!isValidCharacters(normalized)) {
    return {
      ok: false,
      status: 400,
      body: {
        error: 'Invalid search query. Use only letters, numbers, and hyphen (-).',
        query: rawQuery
      }
    };
  }

  if (isLikelySku(normalized) && countDigits(normalized) < 4) {
    return {
      ok: false,
      status: 400,
      body: {
        error: 'Invalid SKU. SKU must contain at least 4 digits.',
        query: normalized
      }
    };
  }

  return {
    ok: true,
    normalized
  };
};

module.exports = {
  normalizeQuery,
  isValidCharacters,
  isLikelySku,
  countDigits,
  validateProductQuery
};
