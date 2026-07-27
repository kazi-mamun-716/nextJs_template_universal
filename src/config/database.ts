/**
 * Database configuration.
 *
 * All MongoDB/Mongoose connection settings are centralized here.
 * Connection string comes from validated env vars.
 */
import { env } from "@/config/env";

function extractDatabaseName(uri: string): string {
  const match = uri.match(/\/([^/?]+)(\?|$)/);
  return match?.[1] ?? "universal_boilerplate";
}

export const databaseConfig = {
  /** MongoDB connection URI */
  uri: env.MONGODB_URI,

  /** Mongoose connection options */
  options: {
    /** Maximum number of connections in the pool */
    maxPoolSize: 10,
    /** Minimum number of connections in the pool */
    minPoolSize: 2,
    /** Timeout for server selection (ms) */
    serverSelectionTimeoutMS: 5000,
    /** Timeout for socket operations (ms) */
    socketTimeoutMS: 45000,
    /** Use IPv4, skip trying IPv6 */
    family: 4,
  },

  /** Database name extracted from URI */
  databaseName: extractDatabaseName(env.MONGODB_URI),
} as const;

export type DatabaseConfig = typeof databaseConfig;
