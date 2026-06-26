-- AlterTable
ALTER TABLE `anggota` ADD COLUMN `isProfileComplete` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `jenis_kelamin` VARCHAR(191) NULL,
    ADD COLUMN `tanggal_lahir` DATETIME(3) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'active';
