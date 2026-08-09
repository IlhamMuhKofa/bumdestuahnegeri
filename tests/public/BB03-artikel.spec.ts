import { test, expect } from '@playwright/test';

test('BB03 - Halaman Artikel', async ({ page }) => {
  // Arrange
  await page.goto('/artikel');

  // Assert
  await expect(
    page.getByRole('heading', {
      name: /Portal Berita/i,
    })
  ).toBeVisible();

  await expect(
    page.getByRole('heading', {
      name: /Berita Lainnya/i,
    })
  ).toBeVisible();
});