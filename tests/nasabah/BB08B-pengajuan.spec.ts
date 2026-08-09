import { test, expect } from '@playwright/test';

test('BB08B - Buat Pengajuan Pinjaman', async ({ page }) => {

    // Login
    await page.goto('/login');

    await page.getByPlaceholder('Email')
        .fill('AutomationUser@example.com');

    await page.getByPlaceholder('Password')
        .fill('Password123');

    await page.getByRole('button', { name: 'Login' }).click();

    await page.waitForURL('**/nasabah/dashboard');

    // Buka dropdown Pengajuan
    await page.getByRole('button', { name: /Pengajuan/i }).hover();

    // Pastikan link Pinjaman sudah muncul
    const menuPinjaman = page.locator('a[href="/nasabah/pinjaman"]');

    await expect(menuPinjaman).toBeVisible();

    // Klik menu Pinjaman
    await menuPinjaman.click();

    await page.waitForURL('**/nasabah/pinjaman');

    // Validasi halaman
    await expect(
        page.getByRole('heading', {
            name: 'Pinjaman',
            exact: true
        })
    ).toBeVisible();

    //buat pengajuan
});