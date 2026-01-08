import { NextRequest, NextResponse } from "next/server";

/**
 * Get place details from Google Places API using place_id
 * This provides accurate coordinates and full address for a selected place
 */

// Cache for place details to reduce API calls
const detailsCache = new Map<string, any>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET(request: NextRequest) {
   const searchParams = request.nextUrl.searchParams;
   const placeId = searchParams.get("placeId");

   if (!placeId) {
      return NextResponse.json(
         { error: "Missing placeId parameter" },
         { status: 400 }
      );
   }

   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
   if (!apiKey) {
      return NextResponse.json(
         { error: "Google Maps API key not configured" },
         { status: 500 }
      );
   }

   // Check cache first
   const cached = detailsCache.get(placeId);
   if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
   }

   try {
      // Use Google Places Details API
      const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
      url.searchParams.set("place_id", placeId);
      url.searchParams.set("key", apiKey);
      url.searchParams.set("fields", "formatted_address,geometry,address_components");

      const response = await fetch(url.toString(), {
         next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
         throw new Error("Places Details API request failed");
      }

      const data = await response.json();

      if (data.status !== "OK" || !data.result) {
         throw new Error(`Place details failed: ${data.status}`);
      }

      const result = data.result;
      const location = result.geometry?.location;

      if (!location) {
         throw new Error("No location data in place details");
      }

      // Extract address components
      const components = result.address_components || [];
      const getComponent = (type: string) => {
         const component = components.find((c: any) => c.types.includes(type));
         return component?.long_name || "";
      };

      const responseData = {
         lat: location.lat,
         lng: location.lng,
         coordinates: [location.lng, location.lat],
         address: result.formatted_address,
         raw: {
            address: {
               street: getComponent("route"),
               city: getComponent("locality") || getComponent("administrative_area_level_2"),
               state: getComponent("administrative_area_level_1"),
               country: getComponent("country"),
               postcode: getComponent("postal_code"),
            },
         },
      };

      // Cache the result
      detailsCache.set(placeId, {
         data: responseData,
         timestamp: Date.now(),
      });

      return NextResponse.json(responseData);
   } catch (error) {
      console.error("Place details error:", error);
      return NextResponse.json(
         { error: "Failed to get place details" },
         { status: 500 }
      );
   }
}
