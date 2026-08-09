import { test } from '@playwright/test';
import { registerNasabah } from '../helpers/auth/regis';

test('BB05 - Registrasi Nasabah Berhasil', async ({ page }) => {

  // Email unik agar tidak bentrok jika test dijalankan berulang
  const email = `automation${Date.now()}@gmail.com`;

  await registerNasabah(page, {
    nama: 'Automation User',
    alamat: 'Jl. Kartika Sari',
    pekerjaan: 'Software Engineer',
    jenisKelamin: 'Laki-laki',
    noHp: '081234567890',
    tanggalLahir: '1990-01-01',
    email,
    password: 'Password123',
  });

});