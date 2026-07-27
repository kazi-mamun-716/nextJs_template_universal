"use server";

/**
 * Send email server actions.
 *
 * Provides createAction-based actions for each email template type.
 * Convenient for calling from other server actions or admin interfaces.
 */

import { createAction } from "@/lib/api";
import { emailService } from "../services/email-service";
import {
  sendWelcomeSchema,
  sendResetPasswordSchema,
  sendVerificationSchema,
  sendNotificationSchema,
} from "../schemas/email-schema";
import { EMAIL_MESSAGES } from "../constants";

export const sendWelcomeEmail = createAction({
  schema: sendWelcomeSchema,
  requireAuth: true,
  handler: async (data) => {
    const result = await emailService.sendWelcomeEmail({
      userName: data.userName,
      userEmail: data.userEmail,
      loginUrl: data.loginUrl,
    });

    if (!result.success) {
      return { success: false, message: result.error ?? EMAIL_MESSAGES.SENT_FAILED };
    }

    return { success: true, message: EMAIL_MESSAGES.SENT_SUCCESS };
  },
});

export const sendResetPasswordEmail = createAction({
  schema: sendResetPasswordSchema,
  requireAuth: true,
  handler: async (data) => {
    const result = await emailService.sendResetPasswordEmail({
      userName: data.userName,
      userEmail: data.userEmail,
      resetUrl: data.resetUrl,
      expiresInMinutes: data.expiresInMinutes,
    });

    if (!result.success) {
      return { success: false, message: result.error ?? EMAIL_MESSAGES.SENT_FAILED };
    }

    return { success: true, message: EMAIL_MESSAGES.SENT_SUCCESS };
  },
});

export const sendVerificationEmail = createAction({
  schema: sendVerificationSchema,
  requireAuth: true,
  handler: async (data) => {
    const result = await emailService.sendVerificationEmail({
      userName: data.userName,
      userEmail: data.userEmail,
      verifyUrl: data.verifyUrl,
      expiresInMinutes: data.expiresInMinutes,
    });

    if (!result.success) {
      return { success: false, message: result.error ?? EMAIL_MESSAGES.SENT_FAILED };
    }

    return { success: true, message: EMAIL_MESSAGES.SENT_SUCCESS };
  },
});

export const sendNotificationEmail = createAction({
  schema: sendNotificationSchema,
  requireAuth: true,
  handler: async (data) => {
    const result = await emailService.sendNotificationEmail({
      userName: data.userName,
      userEmail: data.userEmail,
      title: data.title,
      message: data.message,
      cta: data.ctaLabel && data.ctaUrl
        ? { label: data.ctaLabel, url: data.ctaUrl }
        : undefined,
    });

    if (!result.success) {
      return { success: false, message: result.error ?? EMAIL_MESSAGES.SENT_FAILED };
    }

    return { success: true, message: EMAIL_MESSAGES.SENT_SUCCESS };
  },
});
