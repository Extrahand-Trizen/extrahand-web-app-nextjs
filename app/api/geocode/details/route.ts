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

   // Check cache first
   const cached = detailsCache.get(placeId);
   if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
   }

   try {
      // Check if placeId is formatted as osm_ids (starts with R, W, or N)
      const isOsmId = /^[RWN]\d+$/.test(placeId);
      
      let url: string;
      if (isOsmId) {
         // Use lookup API which returns full address mapping and coordinates
         url = `https://nominatim.openstreetmap.org/lookup?osm_ids=${placeId}&format=json&addressdetails=1`;
      } else {
         // Fallback to details API using standard place_id if it's purely numeric
         url = `https://nominatim.openstreetmap.org/details?place_id=${placeId}&format=json&addressdetails=1`;
      }

      const response = await fetch(url, {
         headers: {
            "User-Agent": "ExtraHandApp/1.0",
         },
         next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
         throw new Error("Nominatim API request failed");
      }

      let data = await response.json();
      
      // The lookup API returns an array, the details API returns an object
      const result = Array.isArray(data) ? data[0] : data;

      if (!result || result.error) {
         throw new Error(`Place details failed: ${result?.error || 'No results'}`);
      }

      // Extract coordinates from either lookup or details format
      const lat = result.lat ? parseFloat(result.lat) : (result.centroid?.coordinates?.[1] || 0);
      const lng = result.lon ? parseFloat(result.lon) : (result.centroid?.coordinates?.[0] || 0);

      if (!lat || !lng) {
         throw new Error("No coordinate data in place details");
      }

      let address = result.display_name;
      
      // If using details API without display_name, use localname
      if (!address && result.localname) {
         address = result.localname;
      }

      // To handle both lookup (returns full address object) and details (returns array of components)
      const components = Array.isArray(result.address) ? {} : (result.address || {});

      let postcode = components.postcode || "";

      // Try extracting from formatted address as last resort
      if (!postcode) {
         const postcodeMatch = address?.match(/\b\d{6}\b/);
         if (postcodeMatch) {
            postcode = postcodeMatch[0];
         } else {
            const postcodeMatch5 = address?.match(/\b\d{5}\b/);
            postcode = postcodeMatch5 ? postcodeMatch5[0] : "";
         }
      }

      const responseData = {
         lat: lat,
         lng: lng,
         coordinates: [lng, lat],
         address: address,
         raw: {
            address: {
               street: components.road || "",
               city: components.city || components.town || components.village || components.county || "",
               state: components.state || "",
               country: components.country || "",
               postcode: postcode,
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
