import { NextRequest, NextResponse } from "next/server";

const CONTENT_ADMIN_URL =
   process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL ||
   "https://extrahand-content-admin-backend.apps.extrahand.in";

type RouteParams = {
   path?: string[];
};

export async function GET(
   request: NextRequest,
   context: { params: RouteParams }
) {
   const parts = context.params.path || [];
   const pathname = parts.length ? `/${parts.join("/")}` : "";
   const url = `${CONTENT_ADMIN_URL}${pathname}${request.nextUrl.search}`;

   try {
      const response = await fetch(url, {
         headers: {
            "Content-Type": "application/json",
         },
         cache: "no-store",
      });

      const body = await response.text();
      return new NextResponse(body, {
         status: response.status,
         headers: {
            "Content-Type":
               response.headers.get("content-type") || "application/json",
         },
      });
   } catch (error) {
      console.error("Content-admin proxy error:", error);
      return NextResponse.json(
         { error: "Content-admin proxy error" },
         { status: 502 }
      );
   }
}
