/**
 * Email validation schemas.
 *
 * Provides:
 * - Base send schema (to, subject, html)
 * - Per-template send schemas with URL validation
 * - Action schema for the send-email server action
 */

import { z } from "zod";
import { REGEX } from "@/constants/regex";

// ─── Base Send Schema ─────────────────────────────────

export const sendEmailSchema = z.object({
  to: z
    .string()
    .regex(REGEX.EMAIL, "Invalid recipient email"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be 200 characters or fewer"),
  html: z
    .string()
    .min(1, "HTML content is required"),
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;

// ─── Welcome Email Schema ─────────────────────────────

export const sendWelcomeSchema = z.object({
  userName: z
    .string()
    .min(1, "User name is required"),
  userEmail: z
    .string()
    .regex(REGEX.EMAIL, "Invalid email address"),
  loginUrl: z
    .string()
    .url("Login URL must be a valid URL"),
});

export type SendWelcomeInput = z.infer<typeof sendWelcomeSchema>;

// ─── Reset Password Email Schema ──────────────────────

export const sendResetPasswordSchema = z.object({
  userName: z
    .string()
    .min(1, "User name is required"),
  userEmail: z
    .string()
    .regex(REGEX.EMAIL, "Invalid email address"),
  resetUrl: z
    .string()
    .url("Reset URL must be a valid URL"),
  expiresInMinutes: z
    .number()
    .positive()
    .optional()
    .default(60),
});

export type SendResetPasswordInput = z.infer<typeof sendResetPasswordSchema>;

// ─── Verification Email Schema ────────────────────────

export const sendVerificationSchema = z.object({
  userName: z
    .string()
    .min(1, "User name is required"),
  userEmail: z
    .string()
    .regex(REGEX.EMAIL, "Invalid email address"),
  verifyUrl: z
    .string()
    .url("Verification URL must be a valid URL"),
  expiresInMinutes: z
    .number()
    .positive()
    .optional()
    .default(1440),
});

export type SendVerificationInput = z.infer<typeof sendVerificationSchema>;

// ─── Notification Email Schema ────────────────────────

export const sendNotificationSchema = z.object({
  userName: z
    .string()
    .min(1, "User name is required"),
  userEmail: z
    .string()
    .regex(REGEX.EMAIL, "Invalid email address"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or fewer"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message must be 5000 characters or fewer"),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().url().optional(),
});

export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
