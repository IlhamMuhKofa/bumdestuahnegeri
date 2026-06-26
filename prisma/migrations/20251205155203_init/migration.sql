-- CreateTable
CREATE TABLE `anggota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `no_hp` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'nasabah',
    `pekerjaan` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `anggota_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `peminjaman` (
    `id_peminjaman` INTEGER NOT NULL AUTO_INCREMENT,
    `id_anggota` INTEGER NOT NULL,
    `tanggal_pengajuan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `total_pinjaman` INTEGER NOT NULL,

    PRIMARY KEY (`id_peminjaman`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_peminjaman` (
    `id_peminjamandetail` INTEGER NOT NULL AUTO_INCREMENT,
    `id_peminjaman` INTEGER NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `jenis` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `nilai_perolehan` INTEGER NOT NULL,
    `keterangan` VARCHAR(191) NULL,

    PRIMARY KEY (`id_peminjamandetail`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jadwal_angsuran` (
    `id_jadwal` INTEGER NOT NULL AUTO_INCREMENT,
    `id_peminjaman` INTEGER NOT NULL,
    `jatuh_tempo` DATETIME(3) NOT NULL,
    `jumlah_tagihan` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_jadwal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembayaran` (
    `id_pembayaran` INTEGER NOT NULL AUTO_INCREMENT,
    `id_peminjaman` INTEGER NOT NULL,
    `tanggal_bayar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `jumlah` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `metode_bayar` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_pembayaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `penyetoran` (
    `id_penyetoran` INTEGER NOT NULL AUTO_INCREMENT,
    `id_anggota` INTEGER NOT NULL,
    `tanggal_setor` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `jumlah` INTEGER NOT NULL,
    `jenis_simpanan` VARCHAR(191) NOT NULL,
    `status_penyetoran` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_penyetoran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `riwayat_transaksi` (
    `id_riwayat` INTEGER NOT NULL AUTO_INCREMENT,
    `id_anggota` INTEGER NOT NULL,
    `jenis_transaksi` VARCHAR(191) NOT NULL,
    `nominal` INTEGER NOT NULL,
    `tanggal` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `keterangan` VARCHAR(191) NULL,

    PRIMARY KEY (`id_riwayat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifikasi` (
    `id_notifikasi` INTEGER NOT NULL AUTO_INCREMENT,
    `id_anggota` INTEGER NOT NULL,
    `isi_notifikasi` VARCHAR(191) NOT NULL,
    `url_tujuan` VARCHAR(191) NULL,
    `waktu_dibaca` DATETIME(3) NULL,
    `jenis_notifikasi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_notifikasi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event` (
    `id_event` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi_event` VARCHAR(191) NULL,
    `gambar_event` VARCHAR(191) NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `lokasi` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_event`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_peserta` (
    `id_event_peserta` INTEGER NOT NULL AUTO_INCREMENT,
    `id_event` INTEGER NOT NULL,
    `id_anggota` INTEGER NOT NULL,
    `tanggal_daftar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_event_peserta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artikel` (
    `id_artikel` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `deskripsi_konten` VARCHAR(191) NULL,
    `gambar_konten` VARCHAR(191) NULL,
    `tanggal_publish` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_artikel`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `peminjaman` ADD CONSTRAINT `peminjaman_id_anggota_fkey` FOREIGN KEY (`id_anggota`) REFERENCES `anggota`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_peminjaman` ADD CONSTRAINT `detail_peminjaman_id_peminjaman_fkey` FOREIGN KEY (`id_peminjaman`) REFERENCES `peminjaman`(`id_peminjaman`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jadwal_angsuran` ADD CONSTRAINT `jadwal_angsuran_id_peminjaman_fkey` FOREIGN KEY (`id_peminjaman`) REFERENCES `peminjaman`(`id_peminjaman`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_id_peminjaman_fkey` FOREIGN KEY (`id_peminjaman`) REFERENCES `peminjaman`(`id_peminjaman`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penyetoran` ADD CONSTRAINT `penyetoran_id_anggota_fkey` FOREIGN KEY (`id_anggota`) REFERENCES `anggota`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `riwayat_transaksi` ADD CONSTRAINT `riwayat_transaksi_id_anggota_fkey` FOREIGN KEY (`id_anggota`) REFERENCES `anggota`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifikasi` ADD CONSTRAINT `notifikasi_id_anggota_fkey` FOREIGN KEY (`id_anggota`) REFERENCES `anggota`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_peserta` ADD CONSTRAINT `event_peserta_id_event_fkey` FOREIGN KEY (`id_event`) REFERENCES `event`(`id_event`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `event_peserta` ADD CONSTRAINT `event_peserta_id_anggota_fkey` FOREIGN KEY (`id_anggota`) REFERENCES `anggota`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
