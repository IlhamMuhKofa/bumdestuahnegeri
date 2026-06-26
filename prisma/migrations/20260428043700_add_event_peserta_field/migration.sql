/*
  Warnings:

  - A unique constraint covering the columns `[id_event,id_anggota]` on the table `event_peserta` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `event_peserta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `event_peserta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `event_peserta` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `nama` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `event_peserta_id_event_id_anggota_key` ON `event_peserta`(`id_event`, `id_anggota`);
