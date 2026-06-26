const {
  normalizeQuery,
  isValidCharacters,
  isLikelySku,
  countDigits,
  validateProductQuery
} = require('../src/validators/productQuery');

describe('productQuery validator', () => {
  it('normalizeQuery trims spaces', () => {
    expect(normalizeQuery('  AB-1234  ')).toBe('AB-1234');
  });

  it('isValidCharacters allows letters numbers hyphen only', () => {
    expect(isValidCharacters('Laptop-3000')).toBe(true);
    expect(isValidCharacters('Desk@1')).toBe(false);
  });

  it('isLikelySku detects values containing digits', () => {
    expect(isLikelySku('AB-1234')).toBe(true);
    expect(isLikelySku('Laptop')).toBe(false);
  });

  it('countDigits returns number of digits', () => {
    expect(countDigits('AB-1234')).toBe(4);
    expect(countDigits('AB-12')).toBe(2);
    expect(countDigits('Laptop')).toBe(0);
  });

  it('validateProductQuery rejects empty values', () => {
    const result = validateProductQuery('   ');
    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Search query is required');
  });

  it('validateProductQuery rejects invalid special chars', () => {
    const result = validateProductQuery('Desk@1');
    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
  });

  it('validateProductQuery rejects SKU with < 4 digits', () => {
    const result = validateProductQuery('AB-12');
    expect(result.ok).toBe(false);
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Invalid SKU. SKU must contain at least 4 digits.');
  });

  it('validateProductQuery accepts valid normalized query', () => {
    const result = validateProductQuery('  AB-1234 ');
    expect(result.ok).toBe(true);
    expect(result.normalized).toBe('AB-1234');
  });
});
