"use client";

/**
 * Interactive Location Picker with Map Integration
 * Features: Draggable marker, "Locate Me" button, address autocomplete
 * Production-grade with coordinate validation and error handling
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { MapPin, Locate, Loader2, Navigation, Home, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { isValidCoordinate, sanitizeString } from "@/lib/utils/sanitization";
import { GoogleMapPicker } from "@/components/maps/GoogleMapPicker";
import { addressesApi } from "@/lib/api/endpoints/addresses";
import type { SavedAddress } from "@/types/profile";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";

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
   // Try multiple fields for pinCode to ensure we get it
   const pinCode = data.raw?.address?.postcode || 
                   data.raw?.address?.postalCode || 
                   data.raw?.address?.postal_code || 
                   data.pinCode || 
                   data.postalCode || 
                   "";
   
   // Log if pinCode is missing for debugging
   if (!pinCode) {
      console.warn("No pinCode found in geocoding data:", data);
   }
   
   return {
      address: data.address || data.description || "",
      city: data.raw?.address?.city || "",
      state: data.raw?.address?.state || "",
      pinCode: pinCode,
      country: data.raw?.address?.country || "India",
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
   const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
   const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
   const [showAddNewAddressForm, setShowAddNewAddressForm] = useState(false);
   const [showSaveAddressDialog, setShowSaveAddressDialog] = useState(false);
   const [pendingAddressToBeSaved, setPendingAddressToBeSaved] = useState<{
      coordinates: [number, number];
      address: Partial<LocationData>;
   } | null>(null);
   const [selectedAddressType, setSelectedAddressType] = useState<"Home" | "Work" | "Other">("Home");

   // Fetch saved addresses on mount
   useEffect(() => {
      const fetchAddresses = async () => {
         try {
            setIsLoadingAddresses(true);
            const addresses = await addressesApi.getAddresses();
            setSavedAddresses(addresses || []);
            
            // Auto-select default address if no address is set yet and we're mounting fresh
            if ((!value.address || value.address === "") && !value.coordinates) {
               const defaultAddress = addresses?.find(addr => addr.isDefault);
               if (defaultAddress) {
                  await handleSelectSavedAddress(defaultAddress);
               }
            }
         } catch (err) {
            console.error("Failed to load saved addresses:", err);
         } finally {
            setIsLoadingAddresses(false);
         }
      };
      fetchAddresses();
   }, []);

   // Fetch Google Maps API key only when user clicks "Add New Address"
   const handleAddNewAddressClick = useCallback(async () => {
      setShowAddNewAddressForm(true);
      
      if (!mapsApiKey) {
         try {
            const response = await fetch('/api/maps/key');
            const data = await response.json();
            if (data.apiKey) {
               setMapsApiKey(data.apiKey);
            }
         } catch (error) {
            console.error('Failed to fetch maps API key:', error);
         }
      }
   }, [mapsApiKey]);

   // Handle saved address selection
   const handleSelectSavedAddress = async (address: SavedAddress) => {
      const fullAddress = [
         address.addressLine1,
         address.addressLine2,
         address.city,
         address.state,
         address.pinCode,
      ]
         .filter(Boolean)
         .join(", ");

      setAddressInput(fullAddress);

      // If coordinates exist, use them
      if (address.coordinates && address.coordinates.lat && address.coordinates.lng) {
         const coords: [number, number] = [
            address.coordinates.lng,
            address.coordinates.lat,
         ];

         const updatedLocation: LocationData = {
            address: fullAddress,
            city: address.city,
            state: address.state,
            pinCode: address.pinCode,
            country: address.country || "India",
            coordinates: coords,
         };

         onChange(updatedLocation);
         setMapCenter(coords);
         setMarkerPosition(coords);
         onCoordinatesChange?.(coords);
         toast.success(`Selected: ${address.label}`);
      } else {
         // No coordinates - geocode the address
         setIsLoadingLocation(true);
         toast.info("Locating address on map...");
         
         try {
            // Step 1: Get place suggestions from search endpoint
            const searchResponse = await fetch(
               `/api/geocode/search?input=${encodeURIComponent(fullAddress)}`
            );
            const searchData = await searchResponse.json();

            // Step 2: If we have suggestions, get coordinates from details endpoint
            if (searchData.suggestions && searchData.suggestions.length > 0) {
               const firstSuggestion = searchData.suggestions[0];
               const detailsResponse = await fetch(
                  `/api/geocode/details?placeId=${firstSuggestion.place_id}`
               );
               const detailsData = await detailsResponse.json();
               
               if (detailsData.coordinates || (detailsData.lat && detailsData.lng)) {
                  const lat = detailsData.coordinates?.[1] || detailsData.lat;
                  const lng = detailsData.coordinates?.[0] || detailsData.lng;
                  const coords: [number, number] = [lng, lat];

                  setMapCenter(coords);
                  setMarkerPosition(coords);

                  const updatedLocation: LocationData = {
                     address: fullAddress,
                     city: address.city,
                     state: address.state,
                     pinCode: address.pinCode,
                     country: address.country || "India",
                     coordinates: coords,
                  };

                  onChange(updatedLocation);
                  onCoordinatesChange?.(coords);
                  toast.success(`Selected: ${address.label}`);
                  setIsLoadingLocation(false);
                  return;
               }
            }

            // Step 3: Try with just city, state, country as fallback
            const simplifiedAddress = `${address.city}, ${address.state}, India`;
            const fallbackSearchResponse = await fetch(
               `/api/geocode/search?input=${encodeURIComponent(simplifiedAddress)}`
            );
            const fallbackSearchData = await fallbackSearchResponse.json();
            
            if (fallbackSearchData.suggestions && fallbackSearchData.suggestions.length > 0) {
               const firstSuggestion = fallbackSearchData.suggestions[0];
               const detailsResponse = await fetch(
                  `/api/geocode/details?placeId=${firstSuggestion.place_id}`
               );
               const detailsData = await detailsResponse.json();
               
               if (detailsData.coordinates || (detailsData.lat && detailsData.lng)) {
                  const lat = detailsData.coordinates?.[1] || detailsData.lat;
                  const lng = detailsData.coordinates?.[0] || detailsData.lng;
                  const coords: [number, number] = [lng, lat];

                  setMapCenter(coords);
                  setMarkerPosition(coords);

                  const updatedLocation: LocationData = {
                     address: fullAddress,
                     city: address.city,
                     state: address.state,
                     pinCode: address.pinCode,
                     country: address.country || "India",
                     coordinates: coords,
                  };

                  onChange(updatedLocation);
                  onCoordinatesChange?.(coords);
                  toast.success(`Selected: ${address.label}`, {
                     description: "Showing city center location"
                  });
                  setIsLoadingLocation(false);
                  return;
               }
            }

            // Fallback - still update location but without map update
            const updatedLocation: LocationData = {
               address: fullAddress,
               city: address.city,
               state: address.state,
               pinCode: address.pinCode,
               country: address.country || "India",
            };
            onChange(updatedLocation);
            toast.warning(`Selected: ${address.label}`, {
               description: "Location not found on map"
            });
         } catch (error) {
            console.error("Geocoding failed:", error);
            const updatedLocation: LocationData = {
               address: fullAddress,
               city: address.city,
               state: address.state,
               pinCode: address.pinCode,
               country: address.country || "India",
            };
            onChange(updatedLocation);
            toast.warning(`Selected: ${address.label}`, {
               description: "Couldn't locate on map"
            });
         } finally {
            setIsLoadingLocation(false);
         }
      }
   };

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

               // Show success with pinCode if available
               const description = locationData.pinCode 
                  ? `${locationData.city || ""}, ${locationData.state || ""} - ${locationData.pinCode}`
                  : `${locationData.city || ""}, ${locationData.state || ""}`;

               toast.success("Location detected successfully!", {
                  description: description,
               });
               
               // Log if pinCode is missing
               if (!locationData.pinCode) {
                  console.warn('Warning: No pinCode found for current location:', { latitude, longitude, locationData });
               }
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
            // If we have a place_id from a suggestion, use details endpoint directly
            if (selectedSuggestion?.place_id) {
               const response = await fetch(
                  `/api/geocode/details?placeId=${selectedSuggestion.place_id}`
               );
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
            } else {
               // No suggestion selected - search first, then get details
               const searchResponse = await fetch(
                  `/api/geocode/search?input=${encodeURIComponent(searchAddress)}`
               );
               const searchData = await searchResponse.json();

               if (searchData.suggestions && searchData.suggestions.length > 0) {
                  // Get details for the first suggestion
                  const firstSuggestion = searchData.suggestions[0];
                  const detailsResponse = await fetch(
                     `/api/geocode/details?placeId=${firstSuggestion.place_id}`
                  );
                  const detailsData = await detailsResponse.json();

                  if (detailsData.coordinates || (detailsData.lat && detailsData.lng)) {
                     const lat = detailsData.coordinates?.[1] || detailsData.lat;
                     const lng = detailsData.coordinates?.[0] || detailsData.lng;
                     const newCoords: [number, number] = [lng, lat];

                     setMapCenter(newCoords);
                     setMarkerPosition(newCoords);

                     const locationData = parseLocationFromGeocode(detailsData);
                     const updatedLocation: LocationData = {
                        ...value,
                        address: searchAddress,
                        ...locationData,
                        coordinates: newCoords,
                     };
                     onChange(updatedLocation);
                     onCoordinatesChange?.(newCoords);

                     toast.success("Location found");
                  } else {
                     toast.error("Could not get location coordinates");
                  }
               } else {
                  toast.error("Location not found");
               }
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

   // Handle marker drag on map - Show save dialog instead of directly updating
   const handleMarkerDrag = useCallback(async (lat: number, lng: number) => {
      const coords: [number, number] = [lng, lat];
      setMarkerPosition(coords);
      setMapCenter(coords);

      // Reverse geocode to get address
      try {
         const response = await fetch(`/api/geocode?lat=${lat}&lng=${lng}`);
         if (!response.ok) throw new Error('Geocoding failed');
         
         const data = await response.json();
         console.log('Geocoding API response:', data);
         
         const locationData = parseLocationFromGeocode(data);
         console.log('Parsed location data:', locationData);

         // Store pending address and show save dialog
         setPendingAddressToBeSaved({
            coordinates: coords,
            address: {
               address: locationData.address || "",
               city: locationData.city || "",
               state: locationData.state || "",
               pinCode: locationData.pinCode || "",
               country: locationData.country || "India",
               coordinates: coords,
            },
         });
         
         // Log if pinCode is missing
         if (!locationData.pinCode) {
            console.warn('Warning: No pinCode found for marker position:', { lat, lng, locationData });
         }
         
         setShowSaveAddressDialog(true);
      } catch (error) {
         console.error('Failed to geocode marker position:', error);
         toast.error("Could not determine address at this location");
      }
   }, []);

   // Handle saving the selected address
   const handleSaveSelectedAddress = async () => {
      if (!pendingAddressToBeSaved) return;

      try {
         const { coordinates, address } = pendingAddressToBeSaved;
         
         console.log('Saving address with pinCode:', address.pinCode);
         
         // Save to backend
         const newAddress = await addressesApi.addAddress({
            label: selectedAddressType,
            addressLine1: address.address,
            city: address.city,
            state: address.state,
            pinCode: address.pinCode || "",
            country: address.country || "India",
            coordinates: coordinates,
            isDefault: false,
         });

         console.log('Address saved successfully:', newAddress);

         // Refresh addresses list
         const addresses = await addressesApi.getAddresses();
         setSavedAddresses(addresses || []);

         // Update the location in the form
         onChange({
            address: address.address,
            city: address.city,
            state: address.state,
            pinCode: address.pinCode,
            country: address.country,
            coordinates: coordinates,
         });
         onCoordinatesChange?.(coordinates);

         setShowSaveAddressDialog(false);
         setPendingAddressToBeSaved(null);
         toast.success(`Address saved as ${selectedAddressType}`);
      } catch (error) {
         console.error('Failed to save address:', error);
         toast.error("Could not save address");
      }
   };

   // Handle canceling the save dialog
   const handleCancelSaveDialog = () => {
      setShowSaveAddressDialog(false);
      setPendingAddressToBeSaved(null);
      // But keep the marker position on map
      if (pendingAddressToBeSaved) {
         const { coordinates, address } = pendingAddressToBeSaved;
         onChange({
            address: address.address,
            city: address.city,
            state: address.state,
            pinCode: address.pinCode,
            country: address.country,
            coordinates: coordinates,
         });
         onCoordinatesChange?.(coordinates);
      }
   };


   return (
      <div className="space-y-4">
         {/* Saved Addresses Section - Always Visible */}
         {savedAddresses.length > 0 && (
            <div className="space-y-2">
               <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Your Saved Addresses
               </label>
               <div className="grid grid-cols-1 gap-2">
                  {savedAddresses.map((address) => (
                     <button
                        key={address.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(address)}
                        className="w-full px-3 py-2.5 text-left border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50/50 transition-all group"
                     >
                        <div className="flex items-start gap-2">
                           <Home className="w-4 h-4 text-gray-400 group-hover:text-primary-600 mt-0.5 shrink-0" />
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                 <span className="text-sm font-medium text-gray-900">
                                    {address.label}
                                 </span>
                                 {address.isDefault && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded font-medium">
                                       Default
                                    </span>
                                 )}
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                 {[
                                    address.addressLine1,
                                    address.addressLine2,
                                    address.city,
                                    address.state,
                                    address.pinCode,
                                 ]
                                    .filter(Boolean)
                                    .join(", ")}
                              </p>
                           </div>
                        </div>
                     </button>
                  ))}
               </div>
            </div>
         )}

         {/* Add New Address Button */}
         <Button
            type="button"
            onClick={handleAddNewAddressClick}
            className="w-full h-10 gap-2 bg-primary-600 text-white hover:bg-primary-700"
         >
            <Plus className="w-4 h-4" />
            {showAddNewAddressForm ? "Address Form Below" : "Add New Address"}
         </Button>

         {/* Conditional Form - Only shown when "Add New Address" is clicked */}
         {showAddNewAddressForm && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
               <button
                  type="button"
                  onClick={() => {
                     setShowAddNewAddressForm(false);
                     setSuggestions([]);
                     setShowSuggestions(false);
                  }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 -mt-2 mb-2"
               >
                  <X className="w-4 h-4" />
                  Hide Address Form
               </button>

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
                        placeholder="Search for an address..."
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
            </div>
         )}

         {/* Save Address Dialog */}
         <Dialog open={showSaveAddressDialog} onOpenChange={setShowSaveAddressDialog}>
            <DialogContent className="sm:max-w-sm">
               <DialogHeader>
                  <DialogTitle>Save This Address?</DialogTitle>
                  <DialogDescription>
                     Choose a label for this address to save it
                  </DialogDescription>
               </DialogHeader>

               <div className="space-y-4 py-4">
                  {pendingAddressToBeSaved && (
                     <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                        <p className="text-sm text-gray-900 font-medium line-clamp-2">
                           {pendingAddressToBeSaved.address.address}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                           {pendingAddressToBeSaved.address.city && (
                              <span>
                                 {pendingAddressToBeSaved.address.city}, {pendingAddressToBeSaved.address.state}
                              </span>
                           )}
                           {pendingAddressToBeSaved.address.pinCode && (
                              <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded font-medium">
                                 PIN: {pendingAddressToBeSaved.address.pinCode}
                              </span>
                           )}
                        </div>
                        {!pendingAddressToBeSaved.address.pinCode && (
                           <p className="text-xs text-orange-600 mt-1">
                              ⚠️ PIN code not found for this location
                           </p>
                        )}
                     </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                     {['Home', 'Work', 'Other'].map((type) => (
                        <button
                           key={type}
                           type="button"
                           onClick={() => setSelectedAddressType(type as "Home" | "Work" | "Other")}
                           className={`px-3 py-2.5 rounded-lg border-2 font-medium text-sm transition-all ${
                              selectedAddressType === type
                                 ? 'border-primary-600 bg-primary-50 text-primary-700'
                                 : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                           }`}
                        >
                           {type}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="flex gap-2 justify-end">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={handleCancelSaveDialog}
                     className="px-4"
                  >
                     Cancel
                  </Button>
                  <Button
                     type="button"
                     onClick={handleSaveSelectedAddress}
                     className="px-4 bg-primary-600 text-white hover:bg-primary-700"
                  >
                     Save
                  </Button>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}
