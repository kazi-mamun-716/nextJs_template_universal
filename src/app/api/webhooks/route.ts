import { NextResponse } from "next/server";

/**
 * Webhook handler for external service integrations.
 */
export async function POST(request: Request) {
  // TODO: Implement webhook handling
  return NextResponse.json({ success: true, message: "Webhook received" });
}
