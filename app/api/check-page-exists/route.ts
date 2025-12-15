import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TaskCategory from "@/lib/models/TaskCategory";
import TaskSubcategory from "@/lib/models/TaskSubcategory";

/**
 * API endpoint to check if a category or subcategory page exists
 * Query params:
 * - categorySlug: The category slug
 * - subcategorySlug: Optional subcategory slug
 */
export async function GET(request: Request) {
   try {
      await connectDB();

      const { searchParams } = new URL(request.url);
      const categorySlug = searchParams.get("categorySlug");
      const subcategorySlug = searchParams.get("subcategorySlug");

      // Allow checks by categorySlug OR subcategorySlug alone.
      // If neither provided, return error.
      if (!categorySlug && !subcategorySlug) {
         return NextResponse.json(
            { error: "categorySlug or subcategorySlug parameter is required" },
            { status: 400 }
         );
      }

      // If subcategorySlug is provided, check for subcategory page
      if (subcategorySlug) {
         // Try multiple query formats to find the subcategory
         const fullSlug = `${categorySlug}/${subcategorySlug}`;

         let subcategory = await TaskSubcategory.findOne({
            slug: fullSlug,
         } as any).lean();

         if (!subcategory) {
            subcategory = await TaskSubcategory.findOne({
               slug: subcategorySlug,
               categorySlug: categorySlug,
            } as any).lean();
         }

         if (!subcategory) {
            subcategory = await TaskSubcategory.findOne({
               slug: {
                  $regex: new RegExp(
                     `^${fullSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
                     "i"
                  ),
               },
            } as any).lean();
         }

         if (subcategory && subcategory.isPublished) {
            return NextResponse.json({
               exists: true,
               type: "subcategory",
               // subcategory pages live under /categories/[category]/[subcategory]
               url: `/categories/${categorySlug}/${subcategorySlug}`,
            });
         }

         return NextResponse.json({
            exists: false,
            type: "subcategory",
         });
      }

      // If only subcategorySlug provided (no categorySlug), try to find subcategory across categories
      if (!categorySlug && subcategorySlug) {
         // Try to find subcategory by exact slug or slug that ends with /<subcategorySlug>
         let subcategory = await TaskSubcategory.findOne({
            $or: [
               { slug: subcategorySlug },
               {
                  slug: {
                     $regex: new RegExp(
                        `/${subcategorySlug.replace(
                           /[.*+?^${}()|[\]\\]/g,
                           "\\$&"
                        )}$`,
                        "i"
                     ),
                  },
               },
            ],
         } as any).lean();

         if (subcategory) {
            const parts = (subcategory.slug || "").split("/");
            const last = parts[parts.length - 1] || subcategorySlug;
            return NextResponse.json({
               exists: true,
               type: "subcategory",
               url: `/categories/${subcategory.categorySlug}/${last}`,
            });
         }
      }

      // Check for category page (when categorySlug provided)
      const category = await TaskCategory.findOne({
         slug: categorySlug,
      } as any).lean();

      if (category && category.isPublished) {
         return NextResponse.json({
            exists: true,
            type: "category",
            // category pages live under /categories/[category]
            url: `/categories/${categorySlug}`,
         });
      }

      return NextResponse.json({
         exists: false,
         type: "category",
      });
   } catch (error: any) {
      console.error("Error checking page existence:", error);
      return NextResponse.json(
         { error: "Failed to check page existence", details: error.message },
         { status: 500 }
      );
   }
}
