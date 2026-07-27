import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/config/auth";
import { MESSAGES } from "@/constants/messages";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is a placeholder — will be implemented in the auth feature
        if (!credentials?.email || !credentials?.password) {
          throw new Error(MESSAGES.VALIDATION_ERROR);
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: authConfig.sessionMaxAge,
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
