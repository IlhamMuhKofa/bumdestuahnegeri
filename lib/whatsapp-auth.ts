import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type SessionUser = {
  role?: string | null;
};

export async function canAccessWhatsAppApi(req: Request) {
  const configuredSecret =
    process.env.WA_CRON_SECRET || process.env.WA_REMINDER_SECRET;
  const requestSecret =
    req.headers.get("x-wa-secret") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (configuredSecret && requestSecret === configuredSecret) {
    return true;
  }

  // Selama development lokal, endpoint WA tetap mudah dites dari browser/Postman.
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  // Di production, admin session bisa mengirim manual dari dashboard.
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;
    return user?.role === "admin";
  } catch {
    return false;
  }
}
