SELECT setval(
  pg_get_serial_sequence('pembayaran', 'id_pembayaran'),
  COALESCE((SELECT MAX("id_pembayaran") FROM "pembayaran"), 0) + 1,
  false
);

SELECT setval(
  pg_get_serial_sequence('jadwal_angsuran', 'id_jadwal'),
  COALESCE((SELECT MAX("id_jadwal") FROM "jadwal_angsuran"), 0) + 1,
  false
);

SELECT setval(
  pg_get_serial_sequence('pembayaran_simpanan', 'id_pembayaran_simpanan'),
  COALESCE((SELECT MAX("id_pembayaran_simpanan") FROM "pembayaran_simpanan"), 0) + 1,
  false
);
