/**
 * NextAuth.js (Auth.js) type augmentation.
 *
 * Extends the default Auth.js types to include custom fields
 * used throughout the application (role on User, Session, and JWT).
 *
 * These augmentations are automatically picked up by TypeScript
 * and make `session.user.role` and `token.role` available
 * without manual type casting.
 */

import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}
