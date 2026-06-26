import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
  try {
    const email = credentials?.email?.toLowerCase().trim();
    const password = credentials?.password ?? "";

    if (!email || !password) return null;

    const user = await prisma.anggota.findFirst({
      where: {
        OR: [
          { email },
          { username: email },
        ],
      },
    });

    if (!user) return null;

    if (!user.password) return null;

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;

    return {
      id: String(user.id),
      name: user.nama ?? "Anggota",
      email: user.email,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
      image: user.foto_diri ?? null,
    };
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return null;
  }
      },
    }),
  ],

  callbacks: {
 async jwt({ token, user, trigger, session }) {
  // saat login pertama
  if (user) {
    token.id = (user as any).id;
    token.role = (user as any).role;
    token.isProfileComplete = (user as any).isProfileComplete;
    token.image = (user as any).image ?? null;
    token.name = (user as any).name ?? token.name;
  }

  // saat client memanggil useSession().update(...)
  if (trigger === "update" && session?.user) {
    const su = session.user as any;
    if (typeof su.image !== "undefined") token.image = su.image;
    if (typeof su.name !== "undefined") token.name = su.name;
    if (typeof su.isProfileComplete !== "undefined")
      token.isProfileComplete = su.isProfileComplete;
  }

  return token;
},

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).isProfileComplete =
          token.isProfileComplete;
        (session.user as any).image = (token as any).image ?? null;

            // biar nama di session ikut sinkron
        session.user.name = (token as any).name ?? session.user.name;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
