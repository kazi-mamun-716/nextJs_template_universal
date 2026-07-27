/**
 * Auth repository — handles database operations for authentication.
 *
 * Extends the BaseRepository to inherit standard CRUD operations.
 * Adds auth-specific query methods like findByEmail and updatePassword.
 *
 * @example
 * import { authRepository } from "@/features/auth/repository/auth-repository";
 * const user = await authRepository.findByEmail("user@example.com");
 */

import type { Model } from "mongoose";
import { BaseRepository } from "@/lib/db/base-repository";
import type { IUser } from "@/types";

/**
 * Auth-specific repository with user authentication queries.
 *
 * @typeParam T - The user document type (extends IUser)
 */
export class AuthRepository<T extends IUser & import("mongoose").Document> extends BaseRepository<T> {
  constructor(model: Model<T>) {
    super(model);
  }

  /**
   * Find a user by their email address.
   *
   * @param email - The email to search for
   * @returns The user or null
   */
  async findByEmail(email: string): Promise<T | null> {
    return this.findOne({ email: email.toLowerCase() } as Record<string, unknown> as import("mongoose").FilterQuery<T>);
  }

  /**
   * Find a user by email or throw if not found.
   *
   * @param email - The email to search for
   * @returns The user (never null)
   * @throws NotFoundError if no user with that email exists
   */
  async findByEmailOrThrow(email: string): Promise<T> {
    return this.findOneOrThrow({ email: email.toLowerCase() } as Record<string, unknown> as import("mongoose").FilterQuery<T>);
  }

  /**
   * Update a user's password hash.
   *
   * @param userId - The user's ID
   * @param hashedPassword - The bcrypt-hashed password
   * @returns The updated user or null
   */
  async updatePassword(userId: string, hashedPassword: string): Promise<T | null> {
    return this.updateById(userId, { password: hashedPassword } as import("mongoose").UpdateQuery<T>);
  }

  /**
   * Check if an email is already registered.
   *
   * @param email - The email to check
   * @returns Whether the email exists
   */
  async emailExists(email: string): Promise<boolean> {
    return this.exists({ email: email.toLowerCase() } as Record<string, unknown> as import("mongoose").FilterQuery<T>);
  }
}

/** Singleton instance. Initialized with a UserModel when available. */
export let authRepository: AuthRepository<IUser & import("mongoose").Document> | null = null;

/**
 * Initialize the auth repository with a Mongoose model.
 * Call this during app bootstrap after the UserModel is defined.
 *
 * @param model - The Mongoose User model
 */
export function initAuthRepository(model: Model<IUser & import("mongoose").Document>): void {
  authRepository = new AuthRepository(model);
}
