import { NextResponse } from "next/server";

/**
 * Secure Google Maps Script Loader
 * Serves Google Maps JavaScript API without exposing the API key in frontend
 */
export async function GET() {
   const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Server-side only, not NEXT_PUBLIC_

   if (!apiKey) {
      return NextResponse.json(
         { error: "Google Maps API key not configured" },
         { status: 500 }
      );
   }

   // Fetch the Google Maps script from Google's servers
   const mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;

   try {
      const response = await fetch(mapsUrl);
      const script = await response.text();

      // Return the script with proper headers
      return new NextResponse(script, {
         headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "public, max-age=86400", // Cache for 24 hours
            // Security headers
            "X-Content-Type-Options": "nosniff",
         },
      });
   } catch (error) {
      console.error("Failed to load Google Maps script:", error);
      return NextResponse.json(
         { error: "Failed to load Google Maps script" },
         { status: 500 }
      );
   }
}
