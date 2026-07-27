import mongoose from "mongoose";
import { databaseConfig } from "@/config/database";

/**
 * Global mongoose connection cache.
 * Prevents creating multiple connections during Next.js hot module reloading.
 */
const globalForMongoose = globalThis as unknown as {
  mongooseConnection: typeof mongoose | null;
  mongoosePromise: Promise<typeof mongoose> | null;
};

/**
 * Connects to MongoDB using a singleton pattern.
 * In development, the connection is cached to prevent HMR from creating new connections.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalForMongoose.mongooseConnection) {
    return globalForMongoose.mongooseConnection;
  }

  if (!globalForMongoose.mongoosePromise) {
    globalForMongoose.mongoosePromise = mongoose.connect(databaseConfig.uri, databaseConfig.options);
  }

  try {
    globalForMongoose.mongooseConnection = await globalForMongoose.mongoosePromise;
  } catch (error) {
    globalForMongoose.mongoosePromise = null;
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Database connection failed. Please check your MONGODB_URI.");
  }

  return globalForMongoose.mongooseConnection;
}

/**
 * Disconnects from MongoDB (useful for testing).
 */
export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
  globalForMongoose.mongooseConnection = null;
  globalForMongoose.mongoosePromise = null;
}
