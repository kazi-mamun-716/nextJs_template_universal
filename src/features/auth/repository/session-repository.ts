/**
 * Session repository — handles database operations for user sessions.
 *
 * @example
 * import { sessionRepository } from "@/features/auth/repository/session-repository";
 * const session = await sessionRepository.findByToken("token-123");
 */

import type { Model } from "mongoose";
import { BaseRepository } from "@/lib/db/base-repository";
import type { IUserSession } from "@/types";

/**
 * Session-specific repository with session management queries.
 *
 * @typeParam T - The session document type
 */
export class SessionRepository<
  T extends IUserSession & import("mongoose").Document,
> extends BaseRepository<T> {
  constructor(model: Model<T>) {
    super(model);
  }

  /**
   * Find a session by its token.
   *
   * @param token - The session token
   * @returns The session or null
   */
  async findByToken(token: string): Promise<T | null> {
    return this.findOne({ token } as Record<string, unknown> as import("mongoose").FilterQuery<T>);
  }

  /**
   * Delete all sessions for a user.
   *
   * @param userId - The user's ID
   * @returns Number of deleted sessions
   */
  async deleteByUserId(userId: string): Promise<number> {
    return this.deleteMany({ userId } as Record<string, unknown> as import("mongoose").FilterQuery<T>);
  }

  /**
   * Find all active sessions for a user.
   *
   * @param userId - The user's ID
   * @returns Array of active sessions
   */
  async findActiveByUserId(userId: string): Promise<T[]> {
    return this.findMany({
      userId,
      expiresAt: { $gt: new Date() },
    } as Record<string, unknown> as import("mongoose").FilterQuery<T>);
  }
}

/** Singleton instance. */
export let sessionRepository: SessionRepository<IUserSession & import("mongoose").Document> | null = null;

/**
 * Initialize the session repository with a Mongoose model.
 *
 * @param model - The Mongoose Session model
 */
export function initSessionRepository(
  model: Model<IUserSession & import("mongoose").Document>,
): void {
  sessionRepository = new SessionRepository(model);
}
