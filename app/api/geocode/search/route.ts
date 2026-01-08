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

   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
   if (!apiKey) {
      return NextResponse.json(
         { error: "Google Maps API key not configured", suggestions: [] },
         { status: 500 }
      );
   }

   // Check cache first
   const cacheKey = `${input.toLowerCase()}`;
   const cached = autocompleteCache.get(cacheKey);
   if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json({ suggestions: cached.data });
   }

   try {
      // Use Google Places Autocomplete API with session token for cost optimization
      // Session tokens group multiple autocomplete calls into a single billing unit
      const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
      url.searchParams.set("input", input);
      url.searchParams.set("key", apiKey);
      url.searchParams.set("components", "country:in"); // Restrict to India
      if (sessionToken) {
         url.searchParams.set("sessiontoken", sessionToken);
      }

      const response = await fetch(url.toString(), {
         next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
         throw new Error("Places Autocomplete API request failed");
      }

      const data = await response.json();

      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
         throw new Error(`Autocomplete failed: ${data.status}`);
      }

      // Format results to match our interface - LIMIT TO 5 to reduce costs
      const suggestions = (data.predictions || []).slice(0, 5).map((prediction: any) => ({
         place_id: prediction.place_id,
         description: prediction.description,
         main_text: prediction.structured_formatting?.main_text || prediction.description.split(",")[0],
         secondary_text: prediction.structured_formatting?.secondary_text || prediction.description.split(",").slice(1).join(",").trim(),
      }));

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
