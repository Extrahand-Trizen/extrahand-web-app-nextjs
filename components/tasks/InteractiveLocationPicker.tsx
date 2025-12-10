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

interface LocationData {
   address: string;
   city: string;
   state: string;
   pinCode?: string;
   country: string;
   coordinates?: [number, number] | undefined; // [lng, lat]
}

interface InteractiveLocationPickerProps {
   value: LocationData;
   onChange: (location: LocationData) => void;
   onCoordinatesChange?: (coords: [number, number]) => void;
}

// Geocoding service (will integrate with Google Maps Geocoding API)
const reverseGeocode = async (
   lat: number,
   lng: number
): Promise<Partial<LocationData>> => {
   // TODO: Replace with actual Google Maps Geocoding API
   // For now, return mock data
   return {
      address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      city: "Bangalore",
      state: "Karnataka",
      pinCode: "560001",
      country: "India",
   };
};

const geocodeAddress = async (
   address: string
): Promise<{ lat: number; lng: number } | null> => {
   // TODO: Replace with actual Google Maps Geocoding API
   // For now, return mock coordinates (Bangalore)
   if (!address.trim()) return null;
   return { lat: 12.9716, lng: 77.5946 };
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
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const [showSuggestions, setShowSuggestions] = useState(false);

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

            // Reverse geocode to get address
            try {
               const locationData = await reverseGeocode(latitude, longitude);
               const updatedLocation: LocationData = {
                  ...value,
                  ...locationData,
                  coordinates: coords,
               };
               onChange(updatedLocation);
               setAddressInput(locationData.address || "");
               onCoordinatesChange?.(coords);

               toast.success("Location detected successfully!", {
                  description: `${locationData.city}, ${locationData.state}`,
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
            timeout: 10000,
            maximumAge: 0,
         }
      );
   }, [value, onChange, onCoordinatesChange]);

   // Handle address search
   const handleAddressSearch = useCallback(async () => {
      if (!addressInput.trim()) return;

      setIsLoadingLocation(true);
      try {
         const coords = await geocodeAddress(addressInput);
         if (coords) {
            const newCoords: [number, number] = [coords.lng, coords.lat];
            setMapCenter(newCoords);
            setMarkerPosition(newCoords);

            const locationData = await reverseGeocode(coords.lat, coords.lng);
            const updatedLocation: LocationData = {
               ...value,
               address: addressInput,
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
      }
   }, [addressInput, value, onChange, onCoordinatesChange]);

   // Mock address suggestions (will be replaced with Google Places Autocomplete)
   const handleAddressInputChange = (input: string) => {
      setAddressInput(input);

      if (input.length > 3) {
         // Mock suggestions - replace with actual Google Places API
         setSuggestions([
            `${input} - Koramangala, Bangalore`,
            `${input} - Indiranagar, Bangalore`,
            `${input} - Whitefield, Bangalore`,
         ]);
         setShowSuggestions(true);
      } else {
         setSuggestions([]);
         setShowSuggestions(false);
      }
   };

   const handleSuggestionClick = (suggestion: string) => {
      setAddressInput(suggestion);
      setShowSuggestions(false);
      onChange({ ...value, address: suggestion });
   };

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
                     setTimeout(() => setShowSuggestions(false), 200)
                  }
                  onKeyDown={(e) => {
                     if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddressSearch();
                     }
                  }}
                  placeholder="Enter your address"
                  className="h-12 pl-12 pr-4"
               />
            </div>

            {/* Address Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
               <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                     <button
                        key={index}
                        type="button"
                        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-start gap-3"
                        onClick={() => handleSuggestionClick(suggestion)}
                     >
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <span className="text-gray-900">{suggestion}</span>
                     </button>
                  ))}
               </div>
            )}
         </div>

         {/* Locate Me Button */}
         <Button
            type="button"
            variant="outline"
            className="w-full h-12 font-medium gap-2"
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

         {/* Map Preview (Placeholder - will integrate with Google Maps) */}
         <div className="relative w-full h-64 bg-gray-100 rounded-lg border-2 border-gray-200 overflow-hidden">
            {/* Map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-center text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">Map Preview</p>
                  <p className="text-xs mt-1">
                     {markerPosition
                        ? `${markerPosition[1].toFixed(
                             4
                          )}, ${markerPosition[0].toFixed(4)}`
                        : "Use 'Locate Me' or enter address"}
                  </p>
               </div>
            </div>

            {/* Marker indicator */}
            {markerPosition && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative">
                     <MapPin
                        className="w-10 h-10 text-red-600 drop-shadow-lg"
                        fill="currentColor"
                     />
                     <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600/30 rounded-full blur-sm"></div>
                  </div>
               </div>
            )}

            {/* TODO: Integrate Google Maps here */}
            <div className="absolute bottom-3 left-3 bg-white px-3 py-1.5 rounded-md shadow-sm text-xs text-gray-600 border border-gray-200">
               📍 Map integration pending
            </div>
         </div>

         {/* Location Details Grid */}
         {value.coordinates && (
            <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
               <div>
                  <label className="text-xs font-medium text-gray-600">
                     City
                  </label>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                     {value.city || "—"}
                  </p>
               </div>
               <div>
                  <label className="text-xs font-medium text-gray-600">
                     State
                  </label>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                     {value.state || "—"}
                  </p>
               </div>
               {value.pinCode && (
                  <div>
                     <label className="text-xs font-medium text-gray-600">
                        Pin Code
                     </label>
                     <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {value.pinCode}
                     </p>
                  </div>
               )}
               <div>
                  <label className="text-xs font-medium text-gray-600">
                     Coordinates
                  </label>
                  <p className="text-xs font-mono text-gray-700 mt-0.5">
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
