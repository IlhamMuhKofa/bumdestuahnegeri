ALTER TABLE `SuratTemplate` ADD COLUMN `kode` VARCHAR(191) NULL;

UPDATE `SuratTemplate`
SET `kode` = 'SP2K_PENCAIRAN'
WHERE `id_surat` = (
  SELECT `min_id`
  FROM (
    SELECT MIN(`id_surat`) AS `min_id`
    FROM `SuratTemplate`
  ) AS `surat_min`
);

DELETE FROM `SuratTemplate`
WHERE `kode` IS NULL;

ALTER TABLE `SuratTemplate` DROP COLUMN `jenis`;

ALTER TABLE `SuratTemplate` MODIFY `kode` VARCHAR(191) NOT NULL DEFAULT 'SP2K_PENCAIRAN';

CREATE UNIQUE INDEX `SuratTemplate_kode_key` ON `SuratTemplate`(`kode`);
