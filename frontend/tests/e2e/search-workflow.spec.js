const { test, expect } = require('@playwright/test');

test.describe('Stock search workflow', () => {
  test('user searches a product and sees results', async ({ page }) => {
    await page.goto('/');

    // Adjust selector to your real input:
    const searchInput = page.getByPlaceholder(/search|name|sku/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill('PRN-1001');

    // Adjust button label if needed:
    await page.getByRole('button', { name: /search/i }).click();

    // Assertions for expected results area
    // Update text to match your UI:
    await expect(page.getByText(/results|products found|printer|prn-1001/i)).toBeVisible();
  });

  test('user searches non-existing product and sees not found message', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder(/search|name|sku/i);
    await searchInput.fill('DOES-NOT-EXIST-999');
    await page.getByRole('button', { name: /search/i }).click();

    // Update message to match your UI wording:
    await expect(page.getByText(/no products found|not found/i)).toBeVisible();
  });

  test('invalid characters show validation feedback', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder(/search|name|sku/i);
    await searchInput.fill('Laptop!');
    await page.getByRole('button', { name: /search/i }).click();

    // Depending on your FE validation/API error rendering:
    await expect(
      page.getByText(/invalid search query|letters, numbers, and hyphen/i)
    ).toBeVisible();
  });
});
