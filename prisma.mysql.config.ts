import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/mysql.prisma",
  engine: "classic",
  datasource: {
    url: env("MYSQL_DATABASE_URL"),
  },
});