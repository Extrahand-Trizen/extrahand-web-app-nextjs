import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const lat = searchParams.get("lat");
   const lng = searchParams.get("lng");

   if (!lat || !lng) {
      return NextResponse.json(
         { error: "Missing latitude or longitude" },
         { status: 400 }
      );
   }

   try {
      // Use OpenStreetMap Nominatim API (free, no key required)
      // Adding user agent to comply with usage policy
      const response = await fetch(
         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
         {
            headers: {
               "User-Agent": "ExtraHand-App/1.0",
            },
         }
      );

      if (!response.ok) {
         throw new Error("Geocoding API request failed");
      }

      const data = await response.json();

      // Build full address from components
      const address = data.address || {};
      
      // Format full address: "Street, Suburb, City, State Postcode"
      const parts = [
         address.road || address.street,
         address.suburb || address.neighbourhood,
         address.city || address.town || address.village,
         address.state,
         address.postcode,
      ].filter(Boolean); // Remove undefined/null values

      const fullAddress = parts.join(", ");

      return NextResponse.json({
         address: fullAddress || `${lat}, ${lng}`,
         raw: data,
      });
   } catch (error) {
      console.error("Geocoding error:", error);
      return NextResponse.json(
         { error: "Failed to geocode location", address: `${lat}, ${lng}` },
         { status: 500 }
      );
   }
}
