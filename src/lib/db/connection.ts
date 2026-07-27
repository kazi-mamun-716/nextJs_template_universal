/**
 * MongoDB connection module.
 *
 * Provides a singleton connection to MongoDB using Mongoose.
 * Connection lifecycle events are logged for observability.
 * The connection is cached globally to prevent HMR from creating
 * multiple connections during development.
 *
 * @example
 * import { connectToDatabase } from "@/lib/db/connection";
 *
 * await connectToDatabase();
 */

import mongoose from "mongoose";
import { databaseConfig } from "@/config/database";

// ─── Types ────────────────────────────────────────────

/** Database health status. */
export interface DatabaseStatus {
  /** Whether the database is connected. */
  connected: boolean;
  /** Human-readable connection state. */
  state: string;
  /** Database name from the connection URI. */
  databaseName: string;
  /** Host the database is connected to. */
  host: string | null;
  /** Port the database is connected to. */
  port: number | null;
  /** Connection pool size. */
  poolSize: number | null;
}

// ─── Global Cache ────────────────────────────────────

/**
 * Global mongoose connection cache.
 * Prevents creating multiple connections during Next.js hot module reloading.
 */
const globalForMongoose = globalThis as unknown as {
  mongooseConnection: typeof mongoose | null;
  mongoosePromise: Promise<typeof mongoose> | null;
};

// ─── Connection Lifecycle Handlers ──────────────────

/** Track whether event handlers have been registered. */
let eventHandlersRegistered = false;

/**
 * Register connection lifecycle event handlers.
 * These log connection state changes and handle errors.
 */
function registerConnectionHandlers(): void {
  if (eventHandlersRegistered) return;
  eventHandlersRegistered = true;

  mongoose.connection.on("connected", () => {
    console.log(`[MongoDB] Connected to database: ${databaseConfig.databaseName}`);
  });

  mongoose.connection.on("error", (error) => {
    console.error("[MongoDB] Connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("[MongoDB] Disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("[MongoDB] Reconnected");
  });

  mongoose.connection.on("reconnectFailed", () => {
    console.error("[MongoDB] Reconnection failed");
  });
}

// ─── Connection Function ────────────────────────────

/**
 * Connects to MongoDB using a singleton pattern.
 * In development, the connection is cached to prevent HMR from creating new connections.
 *
 * @returns The Mongoose instance
 * @throws Error if connection fails
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // Return cached connection if available
  if (globalForMongoose.mongooseConnection) {
    return globalForMongoose.mongooseConnection;
  }

  // Register event handlers once
  registerConnectionHandlers();

  // Start connection if not already in progress
  if (!globalForMongoose.mongoosePromise) {
    globalForMongoose.mongoosePromise = mongoose.connect(
      databaseConfig.uri,
      databaseConfig.options,
    );
  }

  try {
    globalForMongoose.mongooseConnection = await globalForMongoose.mongoosePromise;
    return globalForMongoose.mongooseConnection;
  } catch (error) {
    globalForMongoose.mongoosePromise = null;

    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[MongoDB] Failed to connect:", message);

    throw new Error(
      "Database connection failed. Please check your MONGODB_URI environment variable and ensure MongoDB is running.",
    );
  }
}

// ─── Disconnection ──────────────────────────────────

/**
 * Disconnects from MongoDB (useful for testing and graceful shutdown).
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    globalForMongoose.mongooseConnection = null;
    globalForMongoose.mongoosePromise = null;
    eventHandlersRegistered = false;
    console.log("[MongoDB] Disconnected successfully");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[MongoDB] Error during disconnection:", message);
  }
}

// ─── Health & Status ────────────────────────────────

/**
 * Get the current database connection status.
 *
 * @returns Database status object with connection details
 */
export function getDatabaseStatus(): DatabaseStatus {
  const state = mongoose.connection.readyState;
  const states: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return {
    connected: state === 1,
    state: states[state] ?? "unknown",
    databaseName: databaseConfig.databaseName,
    host: mongoose.connection.host ?? null,
    port: mongoose.connection.port ?? null,
    poolSize: null,
  };
}

/**
 * Check if the database is currently connected and ready.
 *
 * @returns Whether the database connection is established
 */
export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
