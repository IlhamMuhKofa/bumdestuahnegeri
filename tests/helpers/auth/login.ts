import { expect, Page } from '@playwright/test';

/* Login sebagai Nasabah */
export async function loginNasabah(page: Page) {
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

  await expect(page).toHaveURL(/.*nasabah\/dashboard/);
}

/* Login sebagai Admin */
export async function loginAdmin(page: Page) {
  await page.goto('/login');

  await page
    .getByPlaceholder('Email')
    .fill('admin2@gmail.com');

  await page
    .getByPlaceholder('Password')
    .fill('admin02');

  await page
    .getByRole('button', { name: 'Login' })
    .click();

  await page.waitForURL('**/admin/dashboard');

  await expect(page).toHaveURL(/.*admin\/dashboard/);
}