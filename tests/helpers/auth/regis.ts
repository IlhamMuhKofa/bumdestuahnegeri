import { expect, Page } from '@playwright/test';

type RegisterNasabahData = {
  nama: string;
  alamat: string;
  pekerjaan: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  noHp: string;
  tanggalLahir: string;
  email: string;
  password: string;
};

export async function registerNasabah(
  page: Page,
  data: RegisterNasabahData
) {
  // Buka halaman register
  await page.goto('/register');

  // ==========================
  // STEP 1
  // ==========================

  // Nama Lengkap
  await page
    .getByPlaceholder('Masukkan nama lengkap')
    .fill(data.nama);

  // Alamat
  await page
    .getByPlaceholder('Masukkan alamat tinggal')
    .fill(data.alamat);

  // Pekerjaan
  await page
    .getByPlaceholder('Masukkan pekerjaan')
    .fill(data.pekerjaan);

  // Jenis Kelamin
  await page
    .locator('select[name="jenisKelamin"]')
    .selectOption(data.jenisKelamin);

  // Nomor HP
  await page
    .locator('input[name="no_hp"]')
    .fill(data.noHp);

  // Tanggal Lahir
  await page
    .locator('input[name="tanggalLahir"]')
    .fill(data.tanggalLahir);

  // Lanjut
  await page
    .getByRole('button', { name: 'Lanjut' })
    .click();

  // ==========================
  // STEP 2
  // ==========================

  // Email
  await page
    .getByPlaceholder('Masukkan email')
    .fill(data.email);

  // Password
  await page
    .getByPlaceholder('Masukkan password')
    .fill(data.password);

  // Daftar
  await page
    .getByRole('button', { name: 'Daftar' })
    .click();

  // ==========================
  // Validasi
  // ==========================

  // Tunggu redirect (sesuaikan jika aplikasi mengarah ke halaman lain)
  await page.waitForLoadState('networkidle');

  // Contoh validasi:
  // Jika setelah daftar diarahkan ke login
  await expect(page).toHaveURL(/.*login/);
}