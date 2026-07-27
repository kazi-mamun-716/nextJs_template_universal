import { Resend } from "resend";
import { env } from "@/config/env";

/**
 * Email service — handles all email sending via Resend.
 * Separates sending logic from template logic.
 */
class EmailService {
  private client: Resend;

  constructor() {
    this.client = new Resend(env.RESEND_API_KEY);
  }

  async send(options: { to: string; subject: string; html: string }) {
    // TODO: Implement email sending
    return { success: false, error: "Not implemented" };
  }
}

export const emailService = new EmailService();
