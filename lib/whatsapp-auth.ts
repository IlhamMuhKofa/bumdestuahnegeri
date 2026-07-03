import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

type SessionUser = {
  role?: string | null;
};

export async function canAccessWhatsAppApi(req: Request) {
  // SOLUSI JITU: Selama di komputer lokal (development), langsung loloskan tanpa syarat!
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV !== "production") {
    return true; 
  }

  // Pengecekan ini baru akan aktif jika nanti sudah di-hosting (Production)
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as SessionUser | undefined;
    return user?.role === "admin";
  } catch (error) {
    return false;
  }
}