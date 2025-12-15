import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Page slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, 'Page content is required'],
    },
    description: {
      type: String,
      trim: true,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    author: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index on slug for faster queries
PageSchema.index({ slug: 1 });
PageSchema.index({ isPublished: 1 });

// Prevent model re-compilation during hot reload in development
const Page = mongoose.models.Page || mongoose.model('Page', PageSchema);

export default Page;

