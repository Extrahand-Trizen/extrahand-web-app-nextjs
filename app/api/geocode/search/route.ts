import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const input = searchParams.get("input");

   if (!input || input.length < 2) {
      return NextResponse.json({ suggestions: [] });
   }

   try {
      // Use OpenStreetMap Nominatim API for location search
      const response = await fetch(
         `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            input
         )}&countrycodes=in&limit=5`,
         {
            headers: {
               "User-Agent": "ExtraHand-App/1.0",
            },
         }
      );

      if (!response.ok) {
         throw new Error("Search API request failed");
      }

      const data = await response.json();

      // Format results to match our interface
      const suggestions = data.map((item: any) => ({
         place_id: item.place_id,
         description: item.display_name,
         main_text: item.name || item.display_name.split(",")[0],
         secondary_text: item.display_name.split(",").slice(1).join(",").trim(),
      }));

      return NextResponse.json({ suggestions });
   } catch (error) {
      console.error("Location search error:", error);
      return NextResponse.json(
         { error: "Failed to search locations", suggestions: [] },
         { status: 500 }
      );
   }
}
