/**
 * User repository — handles database operations for users.
 *
 * @example
 * import { userRepository } from "@/features/users/repository/user-repository";
 * const users = await userRepository.findPaginated({ role: "admin" }, { page: 1, pageSize: 20 });
 */

import type { Model } from "mongoose";
import { BaseRepository } from "@/lib/db/base-repository";
import type { IUser } from "@/types";

/**
 * User-specific repository with user management queries.
 *
 * @typeParam T - The user document type (extends IUser)
 */
export class UserRepository<
  T extends IUser & import("mongoose").Document,
> extends BaseRepository<T> {
  constructor(model: Model<T>) {
    super(model);
  }

  /**
   * Find active (non-deleted) users with pagination.
   *
   * @param page - Page number (1-based)
   * @param pageSize - Items per page
   * @returns Paginated list of active users
   */
  async findAllActive(
    page = 1,
    pageSize = 10,
  ): Promise<import("@/types").PaginatedResponse<T>> {
    return this.findPaginated(
      { isDeleted: { $ne: true } } as Record<string, unknown> as import("mongoose").FilterQuery<T>,
      { page, pageSize },
    );
  }

  /**
   * Search users by name or email.
   *
   * @param query - Search term
   * @param page - Page number
   * @param pageSize - Items per page
   * @returns Paginated search results
   */
  async search(
    query: string,
    page = 1,
    pageSize = 10,
  ): Promise<import("@/types").PaginatedResponse<T>> {
    const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    return this.findPaginated(
      {
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
        ],
      } as Record<string, unknown> as import("mongoose").FilterQuery<T>,
      { page, pageSize },
    );
  }

  /**
   * Find users by role.
   *
   * @param role - The user role to filter by
   * @returns Array of users with that role
   */
  async findByRole(role: string): Promise<T[]> {
    return this.findMany({ role } as Record<string, unknown> as import("mongoose").FilterQuery<T>);
  }

  /**
   * Soft-delete a user.
   *
   * @param id - The user's ID
   * @param deletedBy - Admin who performed the deletion
   * @returns The soft-deleted user or null
   */
  async softDelete(id: string, deletedBy?: string): Promise<T | null> {
    return this.softDeleteById(id, deletedBy);
  }
}

/** Singleton instance. */
export let userRepository: UserRepository<IUser & import("mongoose").Document> | null = null;

/**
 * Initialize the user repository with a Mongoose model.
 *
 * @param model - The Mongoose User model
 */
export function initUserRepository(
  model: Model<IUser & import("mongoose").Document>,
): void {
  userRepository = new UserRepository(model);
}
