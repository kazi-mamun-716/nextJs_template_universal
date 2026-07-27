/**
 * Profile Mongoose model.
 *
 * Stores extended profile data for users: bio, website, location, social links.
 * One-to-one relationship with User model via userId field.
 */

import mongoose, { Schema, type Model } from "mongoose";

// ─── Schema Definition ────────────────────────────

const profileSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    website: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
      maxlength: 100,
    },
    socialLinks: {
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
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

// ─── Model Cache ───────────────────────────────────

const ProfileModel =
  (mongoose.models.Profile as Model<any>) ??
  mongoose.model<any>("Profile", profileSchema);

export { ProfileModel };
