import { NextResponse } from "next/server";

/**
 * Secure Google Maps Script Loader
 * Serves Google Maps JavaScript API without exposing the API key in frontend
 */
export async function GET() {
   const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Server-side only, not NEXT_PUBLIC_

   if (!apiKey) {
      console.error('❌ Google Maps API key not configured');
      return new NextResponse(
         'console.error("Google Maps API key not configured");',
         { 
            status: 500,
            headers: {
               "Content-Type": "application/javascript; charset=utf-8",
            }
         }
      );
   }

   // Build the Google Maps URL with proper parameters
   const mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker,places&loading=async`;

   const script = `
// Initialize callback if not already defined
if (typeof window._mapsLoadedCallback === 'undefined') {
  window._mapsLoadedCallback = function() {
    console.log('✓ Google Maps API loaded successfully');
    window.dispatchEvent(new CustomEvent('google-maps-loaded'));
  };
}

// Check if already loaded
if (window.google && window.google.maps) {
  console.log('✓ Google Maps already loaded in memory');
  window._mapsLoadedCallback();
} else {
  // Dynamically load the Google Maps library
  (function() {
    var existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      console.log('ℹ Google Maps script already exists in DOM');
      if (window.google && window.google.maps) {
        window._mapsLoadedCallback();
      }
      return;
    }
    
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '${mapsUrl}&callback=_mapsLoadedCallback';
    script.async = true;
    script.onerror = function() {
      console.error('❌ Failed to load Google Maps from CDN');
    };
    
    // Append to head with fallback
    if (document.head) {
      document.head.appendChild(script);
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        document.head.appendChild(script);
      });
    }
  })();
}
`;

   return new NextResponse(script, {
      status: 200,
      headers: {
         "Content-Type": "application/javascript; charset=utf-8",
         "Cache-Control": "public, max-age=3600, must-revalidate",
         "X-Content-Type-Options": "nosniff",
         "Access-Control-Allow-Origin": "*",
      },
   });
}

