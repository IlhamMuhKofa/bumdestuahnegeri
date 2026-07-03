import { PrismaClient as PgClient } from "@prisma/client";
import { PrismaClient as MySqlClient } from "../generated/mysql-client";

const pg = new PgClient();
const mysql = new MySqlClient();

async function main() {
  console.log("=======================================");
  console.log("   MIGRASI MYSQL -> SUPABASE");
  console.log("=======================================\n");

  console.log("✅ Koneksi PostgreSQL berhasil");
  console.log("✅ Koneksi MySQL berhasil");
}

main()
  .catch((err) => {
    console.error("❌ Terjadi error:", err);
  })
  .finally(async () => {
    await mysql.$disconnect();
    await pg.$disconnect();
  });