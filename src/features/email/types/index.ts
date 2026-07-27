/**
 * Email feature type definitions.
 */
export interface IEmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export interface IEmailResponse {
  id: string;
  from: string;
  to: string[];
  createdAt: string;
}

export type EmailTemplate = "welcome" | "reset-password" | "verify-email";
