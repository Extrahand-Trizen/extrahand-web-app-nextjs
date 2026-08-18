import type { Metadata } from "next";
import { Suspense } from "react";
import BlogPageClient from "./BlogPageClient";

export const metadata: Metadata = {
  title: "ExtraHand Blog | Articles, Categories, and Insights",
  description:
    "Browse ExtraHand blog posts by category and tags with paginated article listings.",
};

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <BlogPageClient />
    </Suspense>
  );
}
