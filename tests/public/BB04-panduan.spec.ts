import { test, expect } from '@playwright/test';

test('BB04 - Halaman Panduan Pinjaman', async ({ page }) => {
  // Arrange
  await page.goto('/panduan');

  // Assert
  await expect(
    page.getByRole('heading', {
      name: /Yakin Mau Ajukan Pinjaman\? Pahami Dulu di Sini/i,
    })
  ).toBeVisible();

  await expect(
    page.getByRole('heading', {
      name: /Simulasi Pinjaman/i,
    })
  ).toBeVisible();
  
  await expect(
  page.getByText(/Hasil Kalkulasi/i)
).toBeVisible();
});