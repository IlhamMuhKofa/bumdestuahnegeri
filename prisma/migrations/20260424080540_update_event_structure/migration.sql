-- AlterTable
ALTER TABLE `artikel` MODIFY `deskripsi_konten` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `event` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'published',
    MODIFY `deskripsi_event` LONGTEXT NULL;
