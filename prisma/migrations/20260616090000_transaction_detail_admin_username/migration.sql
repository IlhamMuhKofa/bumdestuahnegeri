ALTER TABLE `anggota`
  ADD COLUMN `username` VARCHAR(191) NULL;

CREATE UNIQUE INDEX `anggota_username_key` ON `anggota`(`username`);

ALTER TABLE `riwayat_transaksi`
  ADD COLUMN `kategori` VARCHAR(191) NULL,
  ADD COLUMN `metode_bayar` VARCHAR(191) NULL,
  ADD COLUMN `bukti_bayar` VARCHAR(191) NULL,
  ADD COLUMN `ref_tabel` VARCHAR(191) NULL,
  ADD COLUMN `ref_id` INTEGER NULL;
