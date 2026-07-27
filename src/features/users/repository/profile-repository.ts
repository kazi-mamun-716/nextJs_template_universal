/**
 * Profile repository — handles database operations for user profiles.
 *
 * @example
 * import { profileRepository } from "@/features/users/repository/profile-repository";
 * const profile = await profileRepository.findByUserId("user-123");
 */

import type { Model } from "mongoose";
import { BaseRepository } from "@/lib/db/base-repository";

/**
 * Profile-specific repository with profile management queries.
 *
 * @typeParam T - The profile document type
 */
export class ProfileRepository<
  T extends import("mongoose").Document,
> extends BaseRepository<T> {
  constructor(model: Model<T>) {
    super(model);
  }

  /**
   * Find a profile by user ID.
   *
   * @param userId - The user's ID
   * @returns The profile or null
   */
  async findByUserId(userId: string): Promise<T | null> {
    return this.findOne({ userId } as Record<string, unknown> as import("mongoose").FilterQuery<T>);
  }

  /**
   * Update or create a profile for a user.
   *
   * @param userId - The user's ID
   * @param data - Profile data to upsert
   * @returns The updated or created profile
   */
  async upsertByUserId(
    userId: string,
    data: Record<string, unknown>,
  ): Promise<T> {
    return this.upsert(
      { userId } as Record<string, unknown> as import("mongoose").FilterQuery<T>,
      { $set: data } as import("mongoose").UpdateQuery<T>,
    );
  }
}

/** Singleton instance. */
export let profileRepository: ProfileRepository<import("mongoose").Document> | null = null;

/**
 * Initialize the profile repository with a Mongoose model.
 *
 * @param model - The Mongoose Profile model
 */
export function initProfileRepository(
  model: Model<import("mongoose").Document>,
): void {
  profileRepository = new ProfileRepository(model);
}
