/**
 * User service — orchestrates user management business logic.
 *
 * Handles profile updates, password changes, account deletion,
 * avatar management, and user settings.
 */

import bcrypt from "bcryptjs";
import { UserModel } from "@/features/auth/models/user.model";
import { ProfileModel } from "@/features/users/models/profile.model";
import { MESSAGES } from "@/constants/messages";
import type { ApiResponse } from "@/types";

export const userService = {
  /**
   * Get user by ID with their profile data.
   */
  async getById(id: string): Promise<Record<string, unknown> | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;

    const profile = await ProfileModel.findOne({ userId: id });
    const userData = user.toJSON() as Record<string, unknown>;

    if (profile) {
      const profileData = profile.toJSON() as Record<string, unknown>;
      userData.profile = {
        bio: profileData.bio ?? "",
        website: profileData.website ?? "",
        location: profileData.location ?? "",
        socialLinks: profileData.socialLinks ?? {},
      };
    }

    return userData;
  },

  /**
   * Update the current user's profile (name, bio, website, location, social links).
   */
  async updateProfile(
    userId: string,
    data: {
      name?: string;
      bio?: string;
      website?: string;
      location?: string;
      socialLinks?: { twitter?: string; github?: string; linkedin?: string };
    },
  ): Promise<ApiResponse> {
    try {
      if (data.name) {
        await UserModel.findByIdAndUpdate(userId, { name: data.name });
      }

      const profileFields: Record<string, unknown> = {};
      if (data.bio !== undefined) profileFields.bio = data.bio;
      if (data.website !== undefined) profileFields.website = data.website;
      if (data.location !== undefined) profileFields.location = data.location;
      if (data.socialLinks !== undefined) profileFields.socialLinks = data.socialLinks;

      if (Object.keys(profileFields).length > 0) {
        await ProfileModel.findOneAndUpdate(
          { userId },
          { $set: profileFields },
          { upsert: true, new: true },
        );
      }

      return { success: true, message: MESSAGES.SUCCESS.PROFILE_UPDATED };
    } catch {
      return { success: false, message: MESSAGES.ERROR.DEFAULT };
    }
  },

  /**
   * Change the user's password by verifying the current password first.
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    try {
      const user = await UserModel.findById(userId).select("+password");
      if (!user) {
        return { success: false, message: MESSAGES.ERROR.USER_NOT_FOUND };
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return { success: false, message: MESSAGES.ERROR.INVALID_CREDENTIALS };
      }

      user.password = newPassword;
      await user.save();

      return { success: true, message: MESSAGES.SUCCESS.PASSWORD_UPDATED };
    } catch {
      return { success: false, message: MESSAGES.ERROR.DEFAULT };
    }
  },

  /**
   * Soft-delete the user account.
   */
  async deleteAccount(userId: string, confirmPassword: string): Promise<ApiResponse> {
    try {
      const user = await UserModel.findById(userId).select("+password");
      if (!user) {
        return { success: false, message: MESSAGES.ERROR.USER_NOT_FOUND };
      }

      const isValid = await bcrypt.compare(confirmPassword, user.password);
      if (!isValid) {
        return { success: false, message: MESSAGES.ERROR.INVALID_CREDENTIALS };
      }

      user.isDeleted = true;
      user.deletedAt = new Date();
      await user.save();

      return { success: true, message: MESSAGES.SUCCESS.DELETED };
    } catch {
      return { success: false, message: MESSAGES.ERROR.DEFAULT };
    }
  },

  /**
   * Update the user's avatar image.
   */
  async updateAvatar(userId: string, imageUrl: string): Promise<ApiResponse> {
    try {
      await UserModel.findByIdAndUpdate(userId, { image: imageUrl });

      return {
        success: true,
        message: MESSAGES.SUCCESS.PROFILE_UPDATED,
        data: { image: imageUrl },
      };
    } catch {
      return { success: false, message: MESSAGES.ERROR.DEFAULT };
    }
  },

  /**
   * Update user settings (theme, notifications, language).
   */
  async updateSettings(
    userId: string,
    settings: {
      theme?: "light" | "dark" | "system";
      emailNotifications?: boolean;
      language?: string;
    },
  ): Promise<ApiResponse> {
    try {
      await UserModel.findByIdAndUpdate(userId, {
        $set: {
          "settings.theme": settings.theme ?? "system",
          "settings.emailNotifications": settings.emailNotifications ?? true,
          "settings.language": settings.language ?? "en",
        },
      });

      return { success: true, message: MESSAGES.SUCCESS.SAVED };
    } catch {
      return { success: false, message: MESSAGES.ERROR.DEFAULT };
    }
  },
};
