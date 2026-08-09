import { test, expect } from '@playwright/test';

test('BB07 - Dashboard Nasabah Berhasil Ditampilkan', async ({ page }) => {

  await page.goto('/login');

  await page
    .getByPlaceholder('Email')
    .fill('AutomationUser@example.com');

  await page
    .getByPlaceholder('Password')
    .fill('Password123');

  await page
    .getByRole('button', { name: 'Login' })
    .click();

  await page.waitForURL('**/nasabah/dashboard');

  // Banner 
  await expect(
    page.getByText('Informasi Dashboard')
  ).toBeVisible();

  // Card Simpanan 
  await expect(
    page.getByText('Saldo Simpanan Wajib')
  ).toBeVisible();

  //card tabungan
  await expect(
    page.getByText('Tabungan Pendidikan').first()
  ).toBeVisible();

  //card pinjaman
  await expect(
    page.getByText('Total Pinjaman Aktif')
  ).toBeVisible();

});