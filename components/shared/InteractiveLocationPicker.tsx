"use client";

/**
 * Interactive Location Picker with Map Integration
 * Features: Draggable marker, "Locate Me" button, address autocomplete
 * Production-grade with coordinate validation and error handling
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { MapPin, Locate, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { isValidCoordinate, sanitizeString } from "@/lib/utils/sanitization";
import { GoogleMapPicker } from "@/components/maps/GoogleMapPicker";

interface LocationData {
   address: string;
   city: string;
   state: string;
   pinCode?: string;
   country: string;
   coordinates?: [number, number] | undefined; // [lng, lat]
}

interface LocationSuggestion {
   place_id: string;
   description: string;
   main_text: string;
   secondary_text: string;
}

interface InteractiveLocationPickerProps {
   value: LocationData;
   onChange: (location: LocationData) => void;
   onCoordinatesChange?: (coords: [number, number]) => void;
}

// Parse location data from geocoding API response
const parseLocationFromGeocode = (data: any): Partial<LocationData> => {
   return {
      address: data.address || data.description || "",
      city: data.raw.address.city || "",
      state: data.raw.address.state || "",
      pinCode: data.raw.address.postcode || data.raw.address.postalCode || "",
      country: data.raw.address.country || "India",
   };
};

export function InteractiveLocationPicker({
   value,
   onChange,
   onCoordinatesChange,
}: InteractiveLocationPickerProps) {
   const [isLoadingLocation, setIsLoadingLocation] = useState(false);
   const [mapCenter, setMapCenter] = useState<[number, number]>(
      value.coordinates || [77.5946, 12.9716] // Default to Bangalore
   );
   const [markerPosition, setMarkerPosition] = useState<[number, number]>(
      value.coordinates || [77.5946, 12.9716]
   );
   const [addressInput, setAddressInput] = useState(value.address);
   const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const [isSearching, setIsSearching] = useState(false);
   const sessionTokenRef = useRef<string>(Math.random().toString(36).substring(7));
   const [mapsApiKey, setMapsApiKey] = useState<string | null>(null);

   // Fetch Google Maps API key on mount
   useEffect(() => {
      fetch('/api/maps/key')
         .then(res => res.json())
         .then(data => setMapsApiKey(data.apiKey))
         .catch(err => console.error('Failed to load Maps API key:', err));
   }, []);

   // Debounce location search - Increased to 500ms to reduce API calls
   useEffect(() => {
      if (!addressInput || addressInput.length < 2) {
         setSuggestions([]);
         return;
      }

      const timer = setTimeout(() => {
         searchLocations(addressInput);
      }, 500); // Increased debounce for cost optimization

      return () => clearTimeout(timer);
   }, [addressInput]);

   // Search locations using API with session token for cost optimization
   const searchLocations = async (searchText: string) => {
      setIsSearching(true);
      try {
         const response = await fetch(
            `/api/geocode/search?input=${encodeURIComponent(searchText)}&sessionToken=${sessionTokenRef.current}`
         );
         const data = await response.json();

         if (data.suggestions) {
            setSuggestions(data.suggestions);
         }
      } catch (error) {
         console.error("Error searching locations:", error);
         toast.error("Could not search locations");
      } finally {
         setIsSearching(false);
      }
   };

   // Get user's current location
   const handleLocateMe = useCallback(() => {
      if (!navigator.geolocation) {
         toast.error("Geolocation is not supported by your browser");
         return;
      }

      setIsLoadingLocation(true);
      toast.info("Getting your location...");

      navigator.geolocation.getCurrentPosition(
         async (position) => {
            const { latitude, longitude } = position.coords;

            // Validate coordinates
            if (!isValidCoordinate(longitude, latitude)) {
               toast.error("Invalid coordinates received");
               setIsLoadingLocation(false);
               return;
            }

            const coords: [number, number] = [longitude, latitude];

            setMapCenter(coords);
            setMarkerPosition(coords);

            // Reverse geocode to get address using API
            try {
               const response = await fetch(
                  `/api/geocode?lat=${latitude}&lng=${longitude}`
               );

               if (!response.ok) {
                  throw new Error("Geocoding failed");
               }

               const data = await response.json();
               const locationData = parseLocationFromGeocode(data);

               const updatedLocation: LocationData = {
                  ...value,
                  ...locationData,
                  coordinates: coords,
               };
               onChange(updatedLocation);
               setAddressInput(locationData.address || "");
               onCoordinatesChange?.(coords);

               toast.success("Location detected successfully!", {
                  description: `${locationData.city || ""}, ${
                     locationData.state || ""
                  }`,
               });
            } catch (error) {
               toast.error("Could not get address details");
            } finally {
               setIsLoadingLocation(false);
            }
         },
         (error) => {
            setIsLoadingLocation(false);
            let errorMessage = "Could not get your location";

            switch (error.code) {
               case error.PERMISSION_DENIED:
                  errorMessage =
                     "Location permission denied. Please enable it in browser settings.";
                  break;
               case error.POSITION_UNAVAILABLE:
                  errorMessage = "Location information unavailable";
                  break;
               case error.TIMEOUT:
                  errorMessage =
                     "Location request timed out. Please try again.";
                  break;
            }

            toast.error(errorMessage);
         },
         {
            enableHighAccuracy: true,
            timeout: 15000, // Increased to 15 seconds for better reliability
            maximumAge: 0,
         }
      );
   }, [value, onChange, onCoordinatesChange]);

   // Handle address search (when user presses Enter or searches)
   const handleAddressSearch = useCallback(
      async (selectedSuggestion?: LocationSuggestion) => {
         const searchAddress = selectedSuggestion?.description || addressInput;
         if (!searchAddress.trim()) return;

         setIsLoadingLocation(true);
         try {
            // If we have a place_id from a suggestion, we can use it for more accurate results
            const url = selectedSuggestion?.place_id
               ? `/api/geocode/details?placeId=${selectedSuggestion.place_id}`
               : `/api/geocode/search?input=${encodeURIComponent(
                    searchAddress
                 )}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.coordinates || (data.lat && data.lng)) {
               const lat = data.coordinates?.[1] || data.lat;
               const lng = data.coordinates?.[0] || data.lng;
               const newCoords: [number, number] = [lng, lat];

               setMapCenter(newCoords);
               setMarkerPosition(newCoords);

               const locationData = parseLocationFromGeocode(data);
               const updatedLocation: LocationData = {
                  ...value,
                  address: searchAddress,
                  ...locationData,
                  coordinates: newCoords,
               };
               onChange(updatedLocation);
               onCoordinatesChange?.(newCoords);

               toast.success("Location found");
            }
         } catch (error) {
            toast.error("Could not find location");
         } finally {
            setIsLoadingLocation(false);
            setShowSuggestions(false);
         }
      },
      [addressInput, value, onChange, onCoordinatesChange]
   );

   // Handle address input change
   const handleAddressInputChange = (input: string) => {
      setAddressInput(input);
      if (input.length >= 2) {
         setShowSuggestions(true);
      }
   };

   // Handle suggestion click
   const handleSuggestionClick = (suggestion: LocationSuggestion) => {
      setAddressInput(suggestion.description);
      handleAddressSearch(suggestion);
   };

   // Handle marker drag on map
   const handleMarkerDrag = useCallback(async (lat: number, lng: number) => {
      const coords: [number, number] = [lng, lat];
      setMarkerPosition(coords);
      setMapCenter(coords);

      // Reverse geocode to get address
      try {
         const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
         if (!response.ok) throw new Error('Geocoding failed');
         
         const data = await response.json();
         const locationData = parseLocationFromGeocode(data);

         const updatedLocation: LocationData = {
            ...value,
            ...locationData,
            coordinates: coords,
         };
         onChange(updatedLocation);
         setAddressInput(locationData.address || "");
         onCoordinatesChange?.(coords);
      } catch (error) {
         console.error('Failed to geocode marker position:', error);
      }
   }, [value, onChange, onCoordinatesChange]);

   return (
      <div className="space-y-4">
         {/* Address Input with Suggestions */}
         <div className="relative">
            <div className="relative">
               <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <Input
                  value={addressInput}
                  onChange={(e) => handleAddressInputChange(e.target.value)}
                  onFocus={() =>
                     suggestions.length > 0 && setShowSuggestions(true)
                  }
                  onBlur={() =>
                     setTimeout(() => setShowSuggestions(false), 300)
                  }
                  onKeyDown={(e) => {
                     if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddressSearch();
                     }
                  }}
                  placeholder="Enter your address"
                  className="h-10 text-sm pl-12 pr-4"
               />
            </div>

            {/* Address Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
               <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {isSearching && (
                     <div className="px-4 py-3 text-center text-sm text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                        Searching...
                     </div>
                  )}
                  {!isSearching &&
                     suggestions.map((suggestion, index) => (
                        <button
                           key={suggestion.place_id || index}
                           type="button"
                           className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-start gap-3"
                           onClick={() => handleSuggestionClick(suggestion)}
                        >
                           <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                           <div className="flex-1 min-w-0">
                              <div className="text-gray-900 text-sm font-medium">
                                 {suggestion.main_text}
                              </div>
                              <div className="text-xs text-gray-500">
                                 {suggestion.secondary_text}
                              </div>
                           </div>
                        </button>
                     ))}
               </div>
            )}
         </div>

         {/* Locate Me Button */}
         <Button
            type="button"
            variant="outline"
            className="w-full h-10 text-sm font-medium gap-2"
            onClick={handleLocateMe}
            disabled={isLoadingLocation}
         >
            {isLoadingLocation ? (
               <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Detecting location...
               </>
            ) : (
               <>
                  <Navigation className="w-5 h-5" />
                  Use my current location
               </>
            )}
         </Button>

         {/* Google Maps - Interactive */}
         <div className="relative w-full h-64 bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
            {mapsApiKey ? (
               <GoogleMapPicker
                  center={mapCenter}
                  markerPosition={markerPosition}
                  onMarkerDragEnd={handleMarkerDrag}
                  apiKey={mapsApiKey}
               />
            ) : (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                     <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                     <p className="text-sm font-medium">Loading map...</p>
                  </div>
               </div>
            )}
         </div>

         {/* Location Details Grid */}
         {value.coordinates && (
            <div className="grid grid-cols-2 md:gap-3 p-2 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
               <div>
                  <label className="text-[10px] md:text-xs font-medium text-gray-600">
                     City
                  </label>
                  <p className="text-xs md:text-sm font-semibold text-gray-900 mt-0.5">
                     {value.city || "—"}
                  </p>
               </div>
               <div>
                  <label className="text-[10px] md:text-xs font-medium text-gray-600">
                     State
                  </label>
                  <p className="text-xs md:text-sm font-semibold text-gray-900 mt-0.5">
                     {value.state || "—"}
                  </p>
               </div>
               {value.pinCode && (
                  <div>
                     <label className="text-[10px] md:text-xs font-medium text-gray-600">
                        Pin Code
                     </label>
                     <p className="text-xs md:text-sm font-semibold text-gray-900 mt-0.5">
                        {value.pinCode}
                     </p>
                  </div>
               )}
               <div>
                  <label className="text-[10px] md:text-xs font-medium text-gray-600">
                     Coordinates
                  </label>
                  <p className="text-xs md:text-sm font-mono text-gray-700 mt-0.5">
                     {value.coordinates[1].toFixed(4)},{" "}
                     {value.coordinates[0].toFixed(4)}
                  </p>
               </div>
            </div>
         )}

         {/* Help Text */}
         <p className="text-xs text-gray-500">
            💡 Tip: Use "Locate Me" for accurate GPS coordinates, or type your
            address for manual entry
         </p>
      </div>
   );
}
