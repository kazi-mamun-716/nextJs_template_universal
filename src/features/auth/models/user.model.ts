/**
 * User Mongoose model.
 *
 * Defines the User schema, indexes, and model for the application.
 * Passwords are hashed using bcryptjs before saving.
 * The model is cached to prevent HMR re-initialization in development.
 */

import mongoose, { Schema, type Model } from "mongoose";
import bcrypt from "bcryptjs";
import { authConfig } from "@/config/auth";
import { registerIndexes, TIMESTAMP_INDEXES } from "@/lib/db/indexes";

// ─── Schema Definition ────────────────────────────

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: authConfig.password.minLength,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    image: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    deletedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const document = ret as Record<string, unknown>;
        document.id = String(document._id ?? "");
        delete document.__v;
        delete document.password;
        return document;
      },
    },
  },
);

// ─── Password Hashing ───────────────────────────────

/**
 * Hash the password before saving if it has been modified.
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// ─── Instance Methods ───────────────────────────────

/**
 * Compare a candidate password with the stored hash.
 */
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Indexes ───────────────────────────────────────

registerIndexes("User", [
  ...TIMESTAMP_INDEXES,
  { fields: { role: 1 } },
  { fields: { isActive: 1 } },
  { fields: { isDeleted: 1, deletedAt: 1 } },
]);

// ─── Model Cache ───────────────────────────────────

/**
 * Prevent model re-compilation during Next.js HMR.
 */
const UserModel = (mongoose.models.User as Model<any>) ?? mongoose.model<any>("User", userSchema);

export { UserModel };
