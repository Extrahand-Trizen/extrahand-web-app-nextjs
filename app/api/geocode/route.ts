import { NextRequest, NextResponse } from "next/server";

// Simple in-memory cache to reduce API calls
const geocodeCache = new Map<string, any>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

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

   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
   if (!apiKey) {
      return NextResponse.json(
         { error: "Google Maps API key not configured" },
         { status: 500 }
      );
   }

   // Check cache first to avoid unnecessary API calls
   const cacheKey = `${lat},${lng}`;
   const cached = geocodeCache.get(cacheKey);
   if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
   }

   try {
      // Use Google Maps Geocoding API for reliable, fast reverse geocoding
      const response = await fetch(
         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
         {
            next: { revalidate: 3600 }, // Cache for 1 hour
         }
      );

      if (!response.ok) {
         throw new Error("Google Geocoding API request failed");
      }

      const data = await response.json();

      if (data.status !== "OK" || !data.results || data.results.length === 0) {
         throw new Error(`Geocoding failed: ${data.status}`);
      }

      const result = data.results[0];
      const address = result.formatted_address;
      const components = result.address_components;

      // Extract address components
      const getComponent = (type: string) => {
         const component = components.find((c: any) => c.types.includes(type));
         return component?.long_name || "";
      };

      // Try to extract postal code from multiple possible locations
      let postcode = getComponent("postal_code");
      if (!postcode) {
         postcode = getComponent("postcode");
      }
      if (!postcode) {
         // Also try postal_code_prefix (sometimes used by Google)
         postcode = getComponent("postal_code_prefix");
      }
      if (!postcode) {
         // Try extracting from formatted address as last resort (Indian pincodes are 6 digits)
         const postcodeMatch = address.match(/\b\d{6}\b/);
         if (postcodeMatch) {
            postcode = postcodeMatch[0];
         } else {
            // Fallback to 5 digit postal codes for other countries
            const postcodeMatch5 = address.match(/\b\d{5}\b/);
            postcode = postcodeMatch5 ? postcodeMatch5[0] : "";
         }
      }
      
      // Log for debugging if postal code is missing
      if (!postcode) {
         console.warn(`No postal code found for coordinates ${lat},${lng}`);
         console.warn(`Address: ${address}`);
         console.warn(`Components:`, components);
      }

      const responseData = {
         address: address,
         raw: {
            address: {
               street: getComponent("route"),
               neighborhood: getComponent("neighborhood"),
               sublocality:
                  getComponent("sublocality_level_1") ||
                  getComponent("sublocality"),
               city:
                  getComponent("locality") ||
                  getComponent("administrative_area_level_2"),
               state: getComponent("administrative_area_level_1"),
               country: getComponent("country"),
               postcode: postcode,
               postalCode: postcode, // Also provide camelCase version for compatibility
               postal_code: postcode, // Also provide snake_case version
            },
         },
      };

      // Cache the result
      geocodeCache.set(cacheKey, {
         data: responseData,
         timestamp: Date.now(),
      });

      return NextResponse.json(responseData);
   } catch (error) {
      console.error("Geocoding error:", error);
      return NextResponse.json(
         { error: "Failed to geocode location", address: `${lat}, ${lng}` },
         { status: 500 }
      );
   }
}
