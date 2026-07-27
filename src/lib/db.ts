/**
 * Database connection (backward-compatible entry point).
 *
 * Re-exports all connection-related exports from the connection module.
 * New code should prefer imports from `@/lib/db/connection` or the barrel at `@/lib/db/index`.
 *
 * @example
 * import { connectToDatabase } from "@/lib/db";
 * await connectToDatabase();
 */

export {
  connectToDatabase,
  disconnectFromDatabase,
  getDatabaseStatus,
  isDatabaseConnected,
} from "./db/connection";

export type { DatabaseStatus } from "./db/connection";
