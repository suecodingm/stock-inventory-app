const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/Product');

jest.mock('../src/models/Product');

describe('Products API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products/search', () => {
    it('returns products when an item exists by name', async () => {
      Product.search.mockResolvedValue([
        {
          id: 1,
          name: 'Printer-XL',
          sku: 'PRN-1001',
          description: 'Office printer'
        }
      ]);

      const res = await request(app)
        .get('/api/products/search')
        .query({ query: 'Printer-XL' });

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.products[0]).toEqual(
        expect.objectContaining({ name: 'Printer-XL', sku: 'PRN-1001' })
      );
      expect(Product.search).toHaveBeenCalledWith('Printer-XL');
    });

    it('returns products when an item exists by SKU', async () => {
      Product.search.mockResolvedValue([
        {
          id: 2,
          name: 'Scanner-Pro',
          sku: 'SCN-2020',
          description: 'High speed scanner'
        }
      ]);

      const res = await request(app)
        .get('/api/products/search')
        .query({ query: 'SCN-2020' });

      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.products[0]).toEqual(
        expect.objectContaining({ name: 'Scanner-Pro', sku: 'SCN-2020' })
      );
      expect(Product.search).toHaveBeenCalledWith('SCN-2020');
    });

    it('returns 400 when query is missing', async () => {
      const res = await request(app).get('/api/products/search');

      expect(res.status).toBe(400);
      expect(res.body).toEqual(
        expect.objectContaining({ error: 'Search query is required' })
      );
    });

    it('returns 404 when item does not exist', async () => {
      Product.search.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/products/search')
        .query({ query: 'DOES-NOT-EXIST-999' });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        message: 'No products found',
        query: 'DOES-NOT-EXIST-999'
      });
    });

    describe('input validation contract (letters, numbers, and hyphen only)', () => {
      // NOTE:
      // Current API does not yet enforce this validation at controller level.
      // These tests define the expected contract and will pass once validation is implemented.

      const validQueries = ['Laptop', 'A1', 'A-1', 'Office-Printer-3000'];
      const invalidQueries = ['Laptop!', 'Desk@1', 'Cable#12', 'Phone*Case'];

      it.each(validQueries)('accepts valid query "%s"', async (q) => {
        Product.search.mockResolvedValue([]);

        const res = await request(app)
          .get('/api/products/search')
          .query({ query: q });

        expect([200, 404]).toContain(res.status);
      });

      it.each(invalidQueries)('rejects invalid query "%s" with 400', async (q) => {
        const res = await request(app)
          .get('/api/products/search')
          .query({ query: q });

        expect(res.status).toBe(400);
        expect(res.body).toEqual(
          expect.objectContaining({
            error: expect.stringMatching(/invalid|letters|numbers|-/i)
          })
        );
      });
    });
  });

  describe('GET /api/products/:id/stores', () => {
    it('returns 400 for invalid product id', async () => {
      const res = await request(app).get('/api/products/abc/stores');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Valid product ID is required' });
    });

    it('returns 404 when product id does not exist', async () => {
      Product.getById.mockResolvedValue(undefined);

      const res = await request(app).get('/api/products/99999/stores');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Product not found' });
    });
  });
});
