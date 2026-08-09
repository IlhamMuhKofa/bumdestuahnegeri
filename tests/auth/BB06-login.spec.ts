import { test } from '@playwright/test';
import { loginNasabah } from '../helpers/auth/login';

test('BB06 - Login Nasabah Berhasil', async ({ page }) => {

  await loginNasabah(page);

});