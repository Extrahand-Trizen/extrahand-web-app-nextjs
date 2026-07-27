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

   // Check cache first to avoid unnecessary API calls
   const cacheKey = `${lat},${lng}`;
   const cached = geocodeCache.get(cacheKey);
   if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
   }

   try {
      // Use Nominatim API for reverse geocoding
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      const response = await fetch(url, {
         headers: {
            "User-Agent": "ExtraHandApp/1.0",
         },
         next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
         throw new Error("Nominatim API request failed");
      }

      const data = await response.json();

      if (data.error) {
         throw new Error(`Geocoding failed: ${data.error}`);
      }

      const address = data.display_name;
      const components = data.address || {};

      let postcode = components.postcode || "";

      // Try extracting from formatted address as last resort (Indian pincodes are 6 digits)
      if (!postcode) {
         // First try 6-digit postcodes (most common for India)
         const postcodeMatch = address?.match(/\b\d{6}\b/);
         if (postcodeMatch) {
            postcode = postcodeMatch[0];
         } else {
            // Fallback to 5 digit postal codes for other countries
            const postcodeMatch5 = address?.match(/\b\d{5}\b/);
            postcode = postcodeMatch5 ? postcodeMatch5[0] : "";
         }
      }
      
      // If still not found, try extracting from the end of the address string
      if (!postcode && address) {
         // Look for any sequence of digits at the end of the address or in the last part
         const lastNumberMatch = address.match(/(\d{5,6})\s*$/);
         if (lastNumberMatch) {
            postcode = lastNumberMatch[1];
         }
      }
      
      // Log for debugging if postal code is missing
      if (!postcode) {
         console.warn(`No postal code found for coordinates, Address: ${address}, Components:`, components);
      }

      const responseData = {
         address: address,
         raw: {
            address: {
               street: components.road || "",
               neighborhood: components.neighbourhood || components.suburb || "",
               sublocality: components.suburb || components.residential || "",
               city: components.city || components.town || components.village || components.county || "",
               state: components.state || "",
               country: components.country || "",
               postcode: postcode,
               postalCode: postcode,
               postal_code: postcode,
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
