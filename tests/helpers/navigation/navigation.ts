import { Page } from '@playwright/test';

/**
 * Dashboard Nasabah
 */
export async function bukaDashboardNasabah(page: Page) {
  await page.goto('/nasabah/dashboard');
  await page.waitForURL('**/nasabah/dashboard');
}

/**
 * Halaman Pinjaman
 */
export async function bukaPinjaman(page: Page) {
  await page.getByRole('button', {
    name: /Pengajuan/i,
  }).hover();

  await page
    .locator('a[href="/nasabah/pinjaman"]')
    .click();

  await page.waitForURL('**/nasabah/pinjaman');
}

/**
 * Halaman Simpanan
 */
export async function bukaSimpanan(page: Page) {
  await page.getByRole('button', {
    name: /Pengajuan/i,
  }).hover();

  await page
    .locator('a[href="/nasabah/simpanan"]')
    .click();

  await page.waitForURL('**/nasabah/simpanan');
}

/**
 * Halaman Event
 */
export async function bukaEvent(page: Page) {
  await page.goto('/nasabah/event');
  await page.waitForURL('**/nasabah/event');
}

/**
 * Halaman Jadwal
 */
export async function bukaJadwal(page: Page) {
  await page.goto('/nasabah/jadwal');
  await page.waitForURL('**/nasabah/jadwal');
}

/**
 * Halaman Riwayat
 */
export async function bukaRiwayat(page: Page) {
  await page.goto('/nasabah/riwayat');
  await page.waitForURL('**/nasabah/riwayat');
}

/**
 * Dashboard Admin
 */
export async function bukaDashboardAdmin(page: Page) {
  await page.goto('/admin/dashboard');
  await page.waitForURL('**/admin/dashboard');
}