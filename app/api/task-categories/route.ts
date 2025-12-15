import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TaskCategory from "@/lib/models/TaskCategory";

// GET - Fetch a single category by slug (for public pages)
export async function GET(request: Request) {
   try {
      await connectDB();

      const { searchParams } = new URL(request.url);
      const slug = searchParams.get("slug");

      if (!slug) {
         return NextResponse.json(
            { error: "Slug parameter is required" },
            { status: 400 }
         );
      }

      // Fetch single category by slug (only published)
      const category = await TaskCategory.findOne({
         slug,
         isPublished: true,
      } as any);

      if (!category) {
         return NextResponse.json(
            { error: "Category not found" },
            { status: 404 }
         );
      }

      return NextResponse.json(category, { status: 200 });
   } catch (error: any) {
      console.error("Error fetching category:", error);
      return NextResponse.json(
         { error: "Failed to fetch category", details: error.message },
         { status: 500 }
      );
   }
}
