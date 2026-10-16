import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getCityBySlug } from "@/lib/data/cities";

export const dynamic = "force-dynamic";

function hasValidSecret(request: NextRequest, expectedSecret: string): boolean {
   const authorization = request.headers.get("authorization") ?? "";
   const suppliedSecret = authorization.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : "";
   const supplied = Buffer.from(suppliedSecret);
   const expected = Buffer.from(expectedSecret);

   return (
      supplied.length === expected.length &&
      timingSafeEqual(supplied, expected)
   );
}

export async function POST(request: NextRequest) {
   const expectedSecret = process.env.CITY_PAGE_REVALIDATION_SECRET;
   if (!expectedSecret) {
      console.error("CITY_PAGE_REVALIDATION_SECRET is not configured");
      return NextResponse.json(
         { error: "City Page revalidation is not configured" },
         { status: 503 }
      );
   }

   if (!hasValidSecret(request, expectedSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   }

   let body: unknown;
   try {
      body = await request.json();
   } catch {
      return NextResponse.json(
         { error: "Request body must be valid JSON" },
         { status: 400 }
      );
   }

   if (
      typeof body !== "object" ||
      body === null ||
      !("citySlug" in body) ||
      typeof body.citySlug !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.citySlug) ||
      !getCityBySlug(body.citySlug)
   ) {
      return NextResponse.json(
         { error: "A valid configured citySlug is required" },
         { status: 400 }
      );
   }

   revalidateTag(`city-page-${body.citySlug}`, { expire: 0 });
   revalidatePath(`/locations/${body.citySlug}`);

   return NextResponse.json({
      revalidated: true,
      citySlug: body.citySlug,
   });
}
