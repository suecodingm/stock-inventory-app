const { test, expect } = require('@playwright/test');

test('search success shows rows', async ({ page }) => {
  await page.route('**/api/products/search**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        count: 1,
        products: [{ id: 1, name: 'Printer-XL', sku: 'PRN-1001', description: 'Office printer' }]
      })
    });
  });

  await page.goto('/');
  await page.getByPlaceholder(/search|name|sku/i).fill('PRN-1001');
  await page.getByRole('button', { name: /search/i }).click();

  await expect(page.getByText('Printer-XL')).toBeVisible();
  await expect(page.getByText('PRN-1001')).toBeVisible();
});

test('search no results shows empty-state message', async ({ page }) => {
  await page.route('**/api/products/search**', async route => {
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'No products found', query: 'DOES-NOT-EXIST-999' })
    });
  });

  await page.goto('/');
  await page.getByPlaceholder(/search|name|sku/i).fill('DOES-NOT-EXIST-999');
  await page.getByRole('button', { name: /search/i }).click();

  await expect(page.getByText(/no products found/i)).toBeVisible();
});

test('invalid query shows validation message', async ({ page }) => {
  await page.route('**/api/products/search**', async route => {
    await route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Invalid search query. Use only letters, numbers, and hyphen (-).' })
    });
  });

  await page.goto('/');
  await page.getByPlaceholder(/search|name|sku/i).fill('Laptop!');
  await page.getByRole('button', { name: /search/i }).click();

  await expect(page.getByText(/invalid search query/i)).toBeVisible();
});
