import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Extend NextAuth types to include 'role'
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      role?: string;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string | null;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<{ id: string; name: string | null; email: string | null; role: string | null } | null> => {
        if (!credentials) return null;

        const email = typeof credentials.email === "string" ? credentials.email : undefined;
        if (!email) return null;
        const user = await prisma.user.findUnique({
          where: { email },
          include: { role: true }, // Include the related role if it exists
        });

        if (!user) return null;

        const password = typeof credentials.password === "string" ? credentials.password : "";
        const isValid = await bcrypt.compare(
          password,
          user.password ?? ""
        );

        if (!isValid) return null;
        // ✅ Include role in the session
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role?.name ?? user.roleId ?? null, // Use role name if available, otherwise fallback to roleId
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
});
