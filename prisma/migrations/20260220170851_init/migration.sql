/*
  Warnings:

  - Added the required column `updatedAt` to the `anggota` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `anggota` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;
