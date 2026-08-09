import { test, expect } from '@playwright/test';

test('BB02 - Halaman Tentang Desa', async ({ page }) => {
  // Arrange
  await page.goto('/profil');

  // Assert
  await expect(
    page.getByRole('heading', {
      name: /BUMDes Tuah Negeri/i,
    })
  ).toBeVisible();

  await expect(
    page.getByText(/Didirikan Sejak Tahun 2022/i)
  ).toBeVisible();
});