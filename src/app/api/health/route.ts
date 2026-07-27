/**
 * Health check endpoint.
 * Returns the server status, database connection state, and uptime.
 */

import { withErrorHandling } from "@/lib/api/handler";
import { ok, serverError } from "@/lib/api/response";
import { isConnected } from "@/lib/db/helpers";
import { getDatabaseStatus } from "@/lib/db/connection";

export const GET = withErrorHandling(async () => {
  const dbStatus = getDatabaseStatus();

  if (!dbStatus.connected) {
    return serverError("Database is not connected");
  }

  return ok({
    status: "healthy",
    database: dbStatus.state,
    databaseName: dbStatus.databaseName,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
