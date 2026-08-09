import { test, expect } from '@playwright/test';

test('BB01 - Halaman Beranda', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      name: /Selamat datang di BUMDES Tuah Negeri/i,
    })
  ).toBeVisible();
});