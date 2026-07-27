/**
 * Email service — handles all email sending via Resend.
 *
 * Separates sending logic from template logic.
 * - Render methods: Convert React components to HTML strings
 * - Send methods: Compose the full email (wrapper + template) and dispatch via Resend
 * - Convenience methods: High-level APIs for each template type
 *
 * @example
 * import { emailService } from "@/features/email/services/email-service";
 *
 * await emailService.sendWelcomeEmail({
 *   userName: "John",
 *   userEmail: "john@example.com",
 *   loginUrl: "https://app.example.com/login",
 * });
 */

import { Resend } from "resend";
import React from "react";
import { renderToString } from "react-dom/server";
import { env } from "@/config/env";
import { emailFeatureConfig, type EmailFeatureConfig } from "../config";
import { EMAIL_MESSAGES, EMAIL_SUBJECTS } from "../constants";
import { EmailWrapper } from "../components/email-wrapper";
import { WelcomeEmail } from "../components/welcome-email";
import { ResetPasswordEmail } from "../components/reset-password-email";
import { VerifyEmail } from "../components/verify-email";
import { NotificationEmail } from "../components/notification-email";
import type {
  IEmailPayload,
  IEmailResponse,
  WelcomeEmailProps,
  ResetPasswordEmailProps,
  VerifyEmailProps,
  NotificationEmailProps,
} from "../types";

// ─── Email Service ─────────────────────────────────

class EmailService {
  private client: Resend | null = null;
  private config: EmailFeatureConfig;

  constructor() {
    this.config = emailFeatureConfig;
    if (env.RESEND_API_KEY) {
      this.client = new Resend(env.RESEND_API_KEY);
    }
  }

  // ─── Render Helpers ─────────────────────────────

  /**
   * Render a React component to an HTML string suitable for email.
   * Wraps the component in the EmailWrapper layout.
   */
  private renderToHtml(content: React.ReactElement): string {
    const wrapped = React.createElement(EmailWrapper, null, content);
    return "<!DOCTYPE html>" + renderToString(wrapped);
  }

  // ─── Core Send Method ───────────────────────────

  /**
   * Send an email via Resend.
   *
   * @param options - Send options (to, subject, html)
   * @returns Response with id and status
   */
  async send(options: {
    to: string | string[];
    subject: string;
    html: string;
  }): Promise<{ success: boolean; error?: string }> {
    if (!this.client) {
      return { success: false, error: EMAIL_MESSAGES.SERVICE_DISABLED };
    }

    try {
      const { data, error } = await this.client.emails.send({
        from: `${this.config.fromName} <${this.config.fromAddress}>`,
        replyTo: this.config.replyToAddress,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        console.error("[EmailService] Resend error:", error);
        return { success: false, error: error.message ?? EMAIL_MESSAGES.SENT_FAILED };
      }

      return { success: true };
    } catch (err) {
      console.error("[EmailService] Unexpected error:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : EMAIL_MESSAGES.SENT_FAILED,
      };
    }
  }

  // ─── Convenience Send Methods ───────────────────

  /**
   * Send a welcome email to a newly registered user.
   */
  async sendWelcomeEmail(
    props: WelcomeEmailProps,
  ): Promise<{ success: boolean; error?: string }> {
    const html = this.renderToHtml(React.createElement(WelcomeEmail, props));
    return this.send({
      to: props.userEmail,
      subject: EMAIL_SUBJECTS.WELCOME,
      html,
    });
  }

  /**
   * Send a password reset email with a one-time reset link.
   */
  async sendResetPasswordEmail(
    props: ResetPasswordEmailProps,
  ): Promise<{ success: boolean; error?: string }> {
    const html = this.renderToHtml(
      React.createElement(ResetPasswordEmail, props),
    );
    return this.send({
      to: props.userEmail,
      subject: EMAIL_SUBJECTS.RESET_PASSWORD,
      html,
    });
  }

  /**
   * Send an email verification email.
   */
  async sendVerificationEmail(
    props: VerifyEmailProps,
  ): Promise<{ success: boolean; error?: string }> {
    const html = this.renderToHtml(React.createElement(VerifyEmail, props));
    return this.send({
      to: props.userEmail,
      subject: EMAIL_SUBJECTS.VERIFY_EMAIL,
      html,
    });
  }

  /**
   * Send a generic notification email.
   */
  async sendNotificationEmail(
    props: NotificationEmailProps,
  ): Promise<{ success: boolean; error?: string }> {
    const html = this.renderToHtml(
      React.createElement(NotificationEmail, props),
    );
    return this.send({
      to: props.userEmail,
      subject: EMAIL_SUBJECTS.NOTIFICATION,
      html,
    });
  }

  /**
   * Check if the email service is configured and ready.
   */
  get isEnabled(): boolean {
    return this.client !== null;
  }
}

// ─── Singleton Export ─────────────────────────────

export const emailService = new EmailService();
