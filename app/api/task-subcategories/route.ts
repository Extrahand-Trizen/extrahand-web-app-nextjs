import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TaskSubcategory from "@/lib/models/TaskSubcategory";

// GET - Fetch a single subcategory by slug and categorySlug (for public pages)
export async function GET(request: Request) {
   try {
      await connectDB();

      const { searchParams } = new URL(request.url);
      const slug = searchParams.get("slug");
      const categorySlug = searchParams.get("categorySlug");

      if (!slug || !categorySlug) {
         return NextResponse.json(
            { error: "Both slug and categorySlug parameters are required" },
            { status: 400 }
         );
      }

      // Fetch single subcategory by slug and categorySlug (allow unpublished in development)
      const subcategory = await TaskSubcategory.findOne({
         slug,
         categorySlug,
      } as any);

      if (!subcategory) {
         return NextResponse.json(
            { error: "Subcategory not found", slug, categorySlug },
            { status: 404 }
         );
      }

      return NextResponse.json(subcategory, { status: 200 });
   } catch (error: any) {
      console.error("Error fetching subcategory:", error);
      return NextResponse.json(
         { error: "Failed to fetch subcategory", details: error.message },
         { status: 500 }
      );
   }
}
