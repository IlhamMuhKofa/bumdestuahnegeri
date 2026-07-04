import { prisma } from "@/lib/prisma";

import Client from "./client";

export default async function Page() {
  const data =
    await prisma.rekeningpembayaran.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

  return (
    <Client data={data} />
  );
}
