/**
 * Database configuration.
 */
export const databaseConfig = {
  uri: process.env.MONGODB_URI ?? "mongodb://localhost:27017/universal_boilerplate",
  options: {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
  },
} as const;
