-- AlterTable
ALTER TABLE `detail_peminjaman` ADD COLUMN `jangka_waktu` INTEGER NOT NULL DEFAULT 12;

-- AlterTable
ALTER TABLE `peminjaman` ADD COLUMN `jangka_waktu` INTEGER NOT NULL DEFAULT 12;
