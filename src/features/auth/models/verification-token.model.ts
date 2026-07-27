/**
 * Verification Token Mongoose model.
 *
 * Stores tokens for email verification and password reset flows.
 * Tokens are short-lived and automatically cleaned up after expiry.
 */

import mongoose, { Schema, type Model } from "mongoose";

// ─── Types ──────────────────────────────────────────

export type VerificationTokenType = "verify_email" | "reset_password";

export interface IVerificationToken {
  email: string;
  token: string;
  type: VerificationTokenType;
  expiresAt: Date;
  createdAt: Date;
}

// ─── Schema Definition ────────────────────────────

const verificationTokenSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["verify_email", "reset_password"],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      transform(_doc, ret) {
        const document = ret as Record<string, unknown>;
        document.id = String(document._id ?? "");
        delete document.__v;
        return document;
      },
    },
  },
);

// ─── TTL Index ─────────────────────────────────────

/**
 * Automatically delete expired tokens.
 * MongoDB TTL index runs every 60 seconds.
 */
verificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Compound index for efficient lookups.
 */
verificationTokenSchema.index({ email: 1, type: 1 });

// ─── Model Cache ───────────────────────────────────

const VerificationTokenModel =
  (mongoose.models.VerificationToken as Model<any>) ??
  mongoose.model<any>("VerificationToken", verificationTokenSchema);

export { VerificationTokenModel };
export type VerificationTokenDocument = IVerificationToken & mongoose.Document;
