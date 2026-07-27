/**
 * Auth.js configuration.
 *
 * Core authentication configuration using NextAuth v5 (Auth.js).
 * Supports credentials-based authentication with bcrypt password comparison.
 * Uses JWT strategy for session management.
 *
 * Callbacks enrich the JWT and session with user role and ID for
 * role-based access control throughout the application.
 *
 * @example
 * import { auth, signIn, signOut } from "@/lib/auth";
 *
 * // Server component
 * const session = await auth();
 *
 * // Server action
 * await signIn("credentials", { email, password, redirect: false });
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/config/auth";
import { ROUTES } from "@/constants/routes";
import { MESSAGES } from "@/constants/messages";
import { authService } from "@/features/auth/services/auth-service";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const user = await authService.authenticateUser(email, password);

          if (!user) {
            return null;
          }

          const userData = user as Record<string, unknown>;

          // Return the user object — Auth.js will pass it to the JWT callback
          return {
            id: userData.id as string,
            email: userData.email as string,
            name: userData.name as string,
            image: (userData.image as string | null) ?? null,
            role: userData.role as string | undefined,
          };
        } catch {
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: ROUTES.LOGIN,
    error: ROUTES.LOGIN,
  },

  callbacks: {
    /**
     * Enrich the JWT token with user metadata from the authorize result.
     * The `user` parameter is only available on initial sign-in.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as Record<string, unknown>).role as string;
      }
      return token;
    },

    /**
     * Enrich the session with user data from the JWT token.
     * This makes user.id and user.role available in `auth()` and `useSession()`.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: authConfig.sessionMaxAge,
  },

  secret: authConfig.authJs.secret,
  trustHost: authConfig.authJs.trustHost,
});
