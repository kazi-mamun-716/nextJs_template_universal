/**
 * Auth service — orchestrates authentication business logic.
 *
 * Sits between server actions and repositories.
 * Handles user registration, password management, email verification,
 * and delegates authentication to Auth.js.
 *
 * @example
 * import { authService } from "@/features/auth/services/auth-service";
 * const result = await authService.register({ email, password, name });
 */

import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose from "mongoose";
import { UserModel } from "@/features/auth/models/user.model";
import { VerificationTokenModel, type VerificationTokenType } from "@/features/auth/models/verification-token.model";
import { AuthRepository } from "@/features/auth/repository/auth-repository";
import { authFeatureConfig } from "@/features/auth/config";
import { auth } from "@/lib/auth";
import { MESSAGES } from "@/constants/messages";
import { DuplicateKeyError } from "@/lib/db/errors";
import { env } from "@/config/env";
import type { ApiResponse, IUser } from "@/types";
import { emailService } from "@/features/email/services/email-service";

// ─── Initialize Repository ─────────────────────────

const userRepo = new AuthRepository(UserModel);

// ─── Token Helpers ─────────────────────────────────

/**
 * Generate a cryptographically secure random token.
 *
 * @param bytes - Number of random bytes (default: 32)
 * @returns Hex-encoded token string
 */
function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Calculate expiry date for a token.
 *
 * @param minutes - Minutes until expiry (default from config)
 * @returns Future date
 */
function getTokenExpiry(minutes = authFeatureConfig.resetTokenExpiryMinutes): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

// ─── Type Helper ──────────────────────────────────

/**
 * Get the Mongoose document fields needed for password comparison.
 * Selects password explicitly since it has select: false in the schema.
 */
async function findUserWithPassword(email: string) {
  return UserModel.findOne({ email: email.toLowerCase() }).select("+password");
}

// ─── Auth Service ──────────────────────────────────

export const authService = {
  /**
   * Authenticates a user via the Auth.js credentials provider.
   * Called internally by the authorize function in Auth.js config.
   *
   * @param email - User email
   * @param password - User password (plain text)
   * @returns The user object or null
   */
  async authenticateUser(email: string, password: string): Promise<Record<string, unknown> | null> {
    try {
      const user = await findUserWithPassword(email);
      if (!user) return null;

      // Check if account is active or soft-deleted
      const userData = user.toJSON() as Record<string, unknown>;
      if (userData.isActive === false) return null;
      if (userData.isDeleted === true) return null;

      // Compare password using bcrypt directly (avoids schema method typing issues)
      const userPassword = user.get("password") as string;
      if (!userPassword) return null;

      const isValid = await bcrypt.compare(password, userPassword);
      if (!isValid) return null;

      // Return safe user data (password excluded via toJSON transform)
      return userData;
    } catch {
      return null;
    }
  },

  /**
   * Register a new user account.
   *
   * @param data - Registration data (email, password, name)
   * @returns API response with user data or error
   */
  async register(data: { email: string; password: string; name: string }): Promise<ApiResponse<IUser>> {
    try {
      // Check if email already exists
      const existing = await userRepo.findByEmail(data.email);
      if (existing) {
        return {
          success: false,
          message: MESSAGES.ERROR.EMAIL_IN_USE,
        };
      }

      // Create user (password is hashed by the schema pre-save hook)
      const user = await userRepo.create({
        email: data.email,
        password: data.password,
        name: data.name,
      } as Partial<IUser & mongoose.Document>);

      // Generate verification token if email verification is required
      if (authFeatureConfig.requireEmailVerification && user) {
        const token = generateToken();
        await VerificationTokenModel.create({
          email: user.email,
          token,
          type: "verify_email" as VerificationTokenType,
          expiresAt: getTokenExpiry(1440), // 24 hours
        });
        // Send verification email
        if (emailService.isEnabled) {
          const verifyUrl = `${env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
          emailService.sendVerificationEmail({
            userName: data.name,
            userEmail: user.email,
            verifyUrl,
            expiresInMinutes: 1440,
          }).catch((err) => {
            console.error("[AuthService] Failed to send verification email:", err);
          });
        }
      }

      return {
        success: true,
        message: MESSAGES.SUCCESS.ACCOUNT_CREATED,
        data: user as unknown as IUser,
      };
    } catch (error) {
      if (error instanceof DuplicateKeyError) {
        return {
          success: false,
          message: MESSAGES.ERROR.EMAIL_IN_USE,
        };
      }
      return {
        success: false,
        message: MESSAGES.ERROR.DEFAULT,
      };
    }
  },

  /**
   * Initiate a password reset by generating a reset token.
   * Always returns success to prevent email enumeration.
   *
   * @param email - User email
   * @returns API response
   */
  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const user = await userRepo.findByEmail(email);
      if (!user) {
        return { success: true, message: MESSAGES.SUCCESS.EMAIL_SENT };
      }

      // Delete any existing reset tokens for this email
      await VerificationTokenModel.deleteMany({
        email: email.toLowerCase(),
        type: "reset_password",
      });

      // Generate new reset token
      const token = generateToken();
      await VerificationTokenModel.create({
        email: email.toLowerCase(),
        token,
        type: "reset_password" as VerificationTokenType,
        expiresAt: getTokenExpiry(),
      });

      // Send password reset email
      if (emailService.isEnabled) {
        const resetUrl = `${env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
        emailService.sendResetPasswordEmail({
          userName: user.name,
          userEmail: user.email,
          resetUrl,
          expiresInMinutes: authFeatureConfig.resetTokenExpiryMinutes,
        }).catch((err) => {
          console.error("[AuthService] Failed to send reset email:", err);
        });
      }

      return { success: true, message: MESSAGES.SUCCESS.EMAIL_SENT };
    } catch {
      return { success: true, message: MESSAGES.SUCCESS.EMAIL_SENT };
    }
  },

  /**
   * Reset a user's password using a valid reset token.
   * Sets the plain password and lets the schema pre-save hook hash it.
   *
   * @param token - Reset token
   * @param newPassword - New password (plain text)
   * @returns API response
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    try {
      // Find valid token
      const resetToken = await VerificationTokenModel.findOne({
        token,
        type: "reset_password",
        expiresAt: { $gt: new Date() },
      });

      if (!resetToken) {
        return { success: false, message: MESSAGES.ERROR.INVALID_TOKEN };
      }

      // Update password using the repository (lets schema pre-save hook hash it)
      const user = await UserModel.findOne({ email: resetToken.email });
      if (!user) {
        return { success: false, message: MESSAGES.ERROR.USER_NOT_FOUND };
      }

      // Set plain password — the pre-save hook will hash it
      user.password = newPassword;
      await user.save();

      // Delete the used token
      await VerificationTokenModel.deleteOne({ _id: resetToken._id });

      return { success: true, message: MESSAGES.SUCCESS.PASSWORD_RESET };
    } catch {
      return { success: false, message: MESSAGES.ERROR.DEFAULT };
    }
  },

  /**
   * Verify a user's email address using a verification token.
   *
   * @param token - Verification token
   * @returns API response
   */
  async verifyEmail(token: string): Promise<ApiResponse> {
    try {
      const verificationToken = await VerificationTokenModel.findOne({
        token,
        type: "verify_email",
        expiresAt: { $gt: new Date() },
      });

      if (!verificationToken) {
        return { success: false, message: MESSAGES.ERROR.INVALID_TOKEN };
      }

      // Update user's email verified status
      const user = await UserModel.findOne({ email: verificationToken.email });
      if (!user) {
        return { success: false, message: MESSAGES.ERROR.USER_NOT_FOUND };
      }

      user.emailVerified = new Date();
      await user.save();

      // Delete the used token
      await VerificationTokenModel.deleteOne({ _id: verificationToken._id });

      return { success: true, message: MESSAGES.SUCCESS.PASSWORD_UPDATED };
    } catch {
      return { success: false, message: MESSAGES.ERROR.DEFAULT };
    }
  },

  /**
   * Get the current authenticated user's session data.
   *
   * @returns Current session or null
   */
  async getSession() {
    const session = await auth();
    return session;
  },

  /**
   * Get the current user from the database by session user ID.
   *
   * @returns User data or null
   */
  async getCurrentUser(): Promise<Record<string, unknown> | null> {
    const session = await this.getSession();
    if (!session?.user?.id) return null;

    try {
      const user = await userRepo.findById(session.user.id);
      return user as unknown as Record<string, unknown> | null;
    } catch {
      return null;
    }
  },
};
