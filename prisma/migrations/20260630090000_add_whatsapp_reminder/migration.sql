CREATE TABLE `whatsapp_reminder` (
  `id_reminder` INTEGER NOT NULL AUTO_INCREMENT,
  `id_jadwal` INTEGER NOT NULL,
  `no_hp` VARCHAR(191) NOT NULL,
  `pesan` TEXT NOT NULL,
  `jadwal_kirim` DATETIME(3) NOT NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  `sent_at` DATETIME(3) NULL,
  `error_message` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  UNIQUE INDEX `whatsapp_reminder_id_jadwal_key`(`id_jadwal`),
  INDEX `whatsapp_reminder_status_jadwal_kirim_idx`(`status`, `jadwal_kirim`),
  PRIMARY KEY (`id_reminder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `whatsapp_reminder`
  ADD CONSTRAINT `whatsapp_reminder_id_jadwal_fkey`
  FOREIGN KEY (`id_jadwal`) REFERENCES `jadwal_angsuran`(`id_jadwal`)
  ON DELETE RESTRICT ON UPDATE CASCADE;
