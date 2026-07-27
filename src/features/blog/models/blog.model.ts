/**
 * Blog post Mongoose model.
 *
 * Defines the schema and model for persisted blog posts.
 * Soft-delete is supported via isDeleted / deletedAt fields
 * inherited from the base repository pattern.
 */
import mongoose, { Schema, type Document } from "mongoose";

/** Blog post document interface matching the Mongoose document shape. */
export interface IBlogPostDocument extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags: string[];
  status: "draft" | "published" | "archived";
  publishedAt?: Date;
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPostDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    excerpt: {
      type: String,
      default: "",
      maxlength: 500,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  },
);

// Compound index for listing published posts efficiently
blogPostSchema.index({ status: 1, publishedAt: -1 });
// Text index for search
blogPostSchema.index({ title: "text", excerpt: "text", content: "text" });

export const BlogPostModel =
  (mongoose.models.BlogPost as mongoose.Model<IBlogPostDocument>) ??
  mongoose.model<IBlogPostDocument>("BlogPost", blogPostSchema);
