import { NextRequest, NextResponse } from "next/server";

// Cache for autocomplete results to reduce API calls
const autocompleteCache = new Map<string, any>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const input = searchParams.get("input");
   const sessionToken = searchParams.get("sessionToken"); // Client provides session token

   if (!input || input.length < 2) {
      return NextResponse.json({ suggestions: [] });
   }

   // Check cache first
   const cacheKey = `${input.toLowerCase()}`;
   const cached = autocompleteCache.get(cacheKey);
   if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({ suggestions: cached.data });
   }

   try {
      // Use Nominatim API for search autocomplete
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("q", input);
      url.searchParams.set("format", "json");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("countrycodes", "in"); // Restrict to India
      url.searchParams.set("limit", "5");

      const response = await fetch(url.toString(), {
         headers: {
            "User-Agent": "ExtraHandApp/1.0",
         },
         next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
         throw new Error("Nominatim API request failed");
      }

      const data = await response.json();

   // Format results to match our interface
      const suggestions = (data || []).map((prediction: any) => {
         const mainText = prediction.name || prediction.display_name.split(",")[0];
         const secondaryText = prediction.display_name.split(",").slice(1).join(",").trim();
         
         // Format osm_type for lookup: R=relation, W=way, N=node
         const osmTypeMap: Record<string, string> = {
            relation: "R",
            way: "W",
            node: "N"
         };
         const osmType = prediction.osm_type ? osmTypeMap[prediction.osm_type] : "";
         const placeIdToUse = osmType && prediction.osm_id 
            ? `${osmType}${prediction.osm_id}`
            : prediction.place_id.toString();

         return {
            place_id: placeIdToUse,
            description: prediction.display_name,
            main_text: mainText,
            secondary_text: secondaryText,
         };
      });

      // Cache the results
      autocompleteCache.set(cacheKey, {
         data: suggestions,
         timestamp: Date.now(),
      });

      return NextResponse.json({ suggestions });
   } catch (error) {
      console.error("Location search error:", error);
      return NextResponse.json(
         { error: "Failed to search locations", suggestions: [] },
         { status: 500 }
      );
   }
}
