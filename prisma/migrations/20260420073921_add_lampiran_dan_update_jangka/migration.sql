-- AlterTable
ALTER TABLE `detail_peminjaman` ADD COLUMN `foto_agunan` VARCHAR(191) NULL,
    ADD COLUMN `foto_surat` VARCHAR(191) NULL,
    ALTER COLUMN `jangka_waktu` DROP DEFAULT;
