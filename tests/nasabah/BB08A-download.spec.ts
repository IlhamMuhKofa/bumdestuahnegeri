import { test, expect } from '@playwright/test';
import { loginNasabah } from '../helpers/auth/login';

test('BB08A - Download Dokumen Persyaratan', async ({ page }) => {

  // Login
  await loginNasabah(page);

  // Buka menu Pengajuan
  await page.getByRole('button', {
    name: /Pengajuan/i
  }).hover();

  // Masuk halaman Pinjaman
  await page.getByRole('link', {
    name: /Pinjaman/i
  }).click();

  // Pastikan sudah berada di halaman Pinjaman
  await expect(
    page.getByRole('heading', {
      name: 'Pinjaman',
      exact: true
    })
  ).toBeVisible();

  // Download dokumen SP2K
  const downloadPromise = page.waitForEvent('download');

  await page.getByRole('link', {
    name: /SP2K Pencairan/i
  }).click();

  const download = await downloadPromise;

  expect(download.suggestedFilename()).toContain('.pdf');

});