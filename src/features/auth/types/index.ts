import type { z } from "zod";
import type { loginSchema } from "@/features/auth/schemas/login-schema";
import type { registerSchema } from "@/features/auth/schemas/register-schema";

/**
 * Auth feature type definitions.
 */

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export interface IAuthResponse {
  user: IUserSession;
  accessToken?: string;
}

export interface IUserSession {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: string;
}
