const { searchProducts } = require('../src/controllers/productController');
const Product = require('../src/models/Product');

jest.mock('../src/models/Product', () => ({
  search: jest.fn(),
  getById: jest.fn(),
  getStoresWithStock: jest.fn(),
  getAll: jest.fn()
}));

const createRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('productController.searchProducts (unit)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when query is missing', async () => {
    const req = { query: {} };
    const res = createRes();

    await searchProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Search query is required' })
    );
    expect(Product.search).not.toHaveBeenCalled();
  });

  it('returns 400 when query is only spaces', async () => {
    const req = { query: { query: '   ' } };
    const res = createRes();

    await searchProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(Product.search).not.toHaveBeenCalled();
  });

  it('trims spaces before querying Product.search', async () => {
    const req = { query: { query: '  PRN-1234  ' } };
    const res = createRes();

    Product.search.mockResolvedValue([{ id: 1, name: 'Printer', sku: 'PRN-1234' }]);

    await searchProducts(req, res);

    expect(Product.search).toHaveBeenCalledWith('PRN-1234');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 400 for invalid special characters', async () => {
    const req = { query: { query: 'Laptop!' } };
    const res = createRes();

    await searchProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.stringMatching(/letters, numbers, and hyphen/i)
      })
    );
    expect(Product.search).not.toHaveBeenCalled();
  });

  it('returns 400 when SKU has fewer than 4 digits', async () => {
    const req = { query: { query: 'AB-12' } };
    const res = createRes();

    await searchProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Invalid SKU. SKU must contain at least 4 digits.'
      })
    );
    expect(Product.search).not.toHaveBeenCalled();
  });

  it('allows SKU with at least 4 digits', async () => {
    const req = { query: { query: 'AB-1234' } };
    const res = createRes();

    Product.search.mockResolvedValue([{ id: 2, name: 'Scanner', sku: 'AB-1234' }]);

    await searchProducts(req, res);

    expect(Product.search).toHaveBeenCalledWith('AB-1234');
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 404 when no products found', async () => {
    const req = { query: { query: 'AB-1234' } };
    const res = createRes();

    Product.search.mockResolvedValue([]);

    await searchProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'No products found',
      query: 'AB-1234'
    });
  });

  it('returns 500 on unexpected model errors', async () => {
    const req = { query: { query: 'AB-1234' } };
    const res = createRes();

    Product.search.mockRejectedValue(new Error('DB down'));

    await searchProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
