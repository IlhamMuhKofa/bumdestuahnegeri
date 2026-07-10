import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type Db = typeof prisma | Prisma.TransactionClient;

const sequenceTargets = {
  pembayaran: {
    table: "pembayaran",
    id: "id_pembayaran",
  },
  jadwalAngsuran: {
    table: "jadwal_angsuran",
    id: "id_jadwal",
  },
} as const;

export async function syncPostgresSequence(
  db: Db,
  target: keyof typeof sequenceTargets
) {
  const { table, id } = sequenceTargets[target];

  await db.$executeRaw(
    Prisma.sql`
      SELECT setval(
        pg_get_serial_sequence(${table}, ${id}),
        COALESCE((SELECT MAX(${Prisma.raw(`"${id}"`)}) FROM ${Prisma.raw(`"${table}"`)}), 0) + 1,
        false
      )
    `
  );
}
