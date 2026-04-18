"use client";

/**
 * Interactive Location Picker with Map Integration
 * Features: Draggable marker, "Locate Me" button, address autocomplete
 * Production-grade with coordinate validation and error handling
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Locate, Loader2, Navigation, Home, Plus, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { isValidCoordinate, sanitizeString } from "@/lib/utils/sanitization";
import { GoogleMapPicker } from "@/components/maps/GoogleMapPicker";
import { addressesApi } from "@/lib/api/endpoints/addresses";
import { useMapsApiKey } from "@/lib/hooks/useMapsApiKey";
import {
   OPEN_CONSENT_PREFERENCES_EVENT,
   updateConsentPreference,
} from "@/lib/consent/cookieConsent";
import type { SavedAddress } from "@/types/profile";

// Query key for React Query caching
export const ADDRESSES_QUERY_KEY = ["saved-addresses"];

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
   
   const city = data.raw?.address?.city || "";
   const state = data.raw?.address?.state || "";
   
   // Parse address to show only until city to avoid duplication
   // Extract street/area parts from the full address (everything before city)
   const fullAddress = data.address || data.description || "";
   let addressLine1 = fullAddress;
   
   // If we have city, extract the part of the address that's before or around the city
   if (city && fullAddress) {
      const cityIndex = fullAddress.toLowerCase().indexOf(city.toLowerCase());
      if (cityIndex > 0) {
         // Get everything before the city as address line 1
         addressLine1 = fullAddress.substring(0, cityIndex).trim();
         // Remove trailing commas or spaces
         addressLine1 = addressLine1.replace(/[,\s]+$/, "");
      }
   }
   
   return {
      address: addressLine1 || "",
      city: city,
      state: state,
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
   const { mapsApiKey, fetchApiKey, isFetching: isFetchingApiKey, mapsConsentBlocked } = useMapsApiKey();
   const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
   const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
   const [showAddNewAddressForm, setShowAddNewAddressForm] = useState(false);
   const [pendingAddressToBeSaved, setPendingAddressToBeSaved] = useState<{
      coordinates: [number, number];
      address: Partial<LocationData>;
      fullAddress: string; // Store original full address for display
   } | null>(null);
   const [selectedAddressType, setSelectedAddressType] = useState<"Home" | "Work" | "Other">("Home");
   const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string | null>(null);
   const autoSelectRef = useRef(false); // Prevent duplicate auto-select
   const locateToastShownRef = useRef(false); // Prevent duplicate toasts for "Locate Me"

   // Fetch saved addresses using React Query for faster caching and reuse
   const { data: savedAddressesFromQuery, isLoading: isLoadingQueryAddresses } = useQuery({
      queryKey: ADDRESSES_QUERY_KEY,
      queryFn: () => addressesApi.getAddresses(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
   });

   // Update savedAddresses state from Query and handle auto-selection
   useEffect(() => {
      if (savedAddressesFromQuery) {
         setSavedAddresses(savedAddressesFromQuery);

         // Auto-select address only once, if no address is set yet
         if (!autoSelectRef.current && (!value.address || value.address === "") && !value.coordinates) {
            // First try to find default address
            let addressToSelect = savedAddressesFromQuery.find(addr => addr.isDefault);
            
            // If no default, prefer Home type address
            if (!addressToSelect) {
               addressToSelect = savedAddressesFromQuery.find(addr => addr.type === "home");
            }
            
            // Otherwise, just take the first address
            if (!addressToSelect && savedAddressesFromQuery.length > 0) {
               addressToSelect = savedAddressesFromQuery[0];
            }

            if (addressToSelect) {
               autoSelectRef.current = true;
               setSelectedSavedAddressId(addressToSelect.id);
            }
         }
      }
   }, [savedAddressesFromQuery, value.address, value.coordinates]);

   // Sync loading state
   useEffect(() => {
      setIsLoadingAddresses(isLoadingQueryAddresses);
   }, [isLoadingQueryAddresses]);

   // Initialize location picker with value when editing task
   useEffect(() => {
      if (value && value.address && addressInput !== value.address) {
         setAddressInput(value.address);
      }
      if (value && value.coordinates) {
         setMapCenter(value.coordinates);
         setMarkerPosition(value.coordinates);
      }
   }, [value?.address, value?.coordinates]);

   // Fetch Google Maps API key only when user clicks "Add New Address"
   const handleAddNewAddressClick = useCallback(async () => {
      setShowAddNewAddressForm(true);
      
      if (!mapsApiKey && !mapsConsentBlocked) {
         fetchApiKey();
      }
   }, [mapsApiKey, mapsConsentBlocked, fetchApiKey]);

   // Handle saved address selection
   const handleSelectSavedAddress = async (address: SavedAddress) => {
      setSelectedSavedAddressId(address.id);
      setPendingAddressToBeSaved(null);

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
      } else {
         // No coordinates - geocode the address
         setIsLoadingLocation(true);
         
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
         } finally {
            setIsLoadingLocation(false);
         }
      }
   };

   // Auto-select saved address when ID is set
   useEffect(() => {
      if (selectedSavedAddressId && autoSelectRef.current && savedAddresses.length > 0 && (!value.address || value.address === "")) {
         const addressToSelect = savedAddresses.find(addr => addr.id === selectedSavedAddressId);
         if (addressToSelect) {
            handleSelectSavedAddress(addressToSelect);
         }
      }
   }, [selectedSavedAddressId, savedAddresses, value.address]);

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

      // Prevent duplicate location detection toasts
      if (isLoadingLocation) {
         return;
      }

      setIsLoadingLocation(true);

      navigator.geolocation.getCurrentPosition(
         async (position) => {
            const { latitude, longitude } = position.coords;

            // Validate coordinates
            if (!isValidCoordinate(longitude, latitude)) {
               toast.error("Invalid coordinates received");
               setIsLoadingLocation(false);
               locateToastShownRef.current = false;
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
               const fullAddress = data.address || data.description || ""; // Store the original full address

               const updatedLocation: LocationData = {
                  ...value,
                  ...locationData,
                  coordinates: coords,
               };
               onChange(updatedLocation);
               setAddressInput(fullAddress || "");
               onCoordinatesChange?.(coords);
               setSelectedSavedAddressId(null);

               // Set pending address to show confirmation UI without needing to move cursor
               setPendingAddressToBeSaved({
                  coordinates: coords,
                  address: {
                     address: locationData.address || "",
                     city: locationData.city || "",
                     state: locationData.state || "",
                     pinCode: locationData.pinCode || "",
                     country: locationData.country || "India",
                  },
                  fullAddress: fullAddress,
               });

               // Show success with pinCode if available
               const description = locationData.pinCode 
                  ? `${locationData.city || ""}, ${locationData.state || ""} - ${locationData.pinCode}`
                  : `${locationData.city || ""}, ${locationData.state || ""}`;

               // Use toast ID to prevent duplicate toasts on rapid clicks
               toast.success("Location detected successfully!", {
                  id: "TOAST_ID_LOCATION_DETECTED",
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
               locateToastShownRef.current = false;
            }
         },
         (error) => {
            setIsLoadingLocation(false);
            locateToastShownRef.current = false;
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
   }, [value, onChange, onCoordinatesChange, isLoadingLocation]);

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

   // Handle marker drag: update form and input first, then offer inline Use/Save actions
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
         const fullAddress = data.address || data.description || ""; // Store original full address
         console.log('Parsed location data:', locationData);

         // Always apply dragged location immediately so the user sees it in the form.
         const updatedLocation: LocationData = {
            address: locationData.address || "",
            city: locationData.city || "",
            state: locationData.state || "",
            pinCode: locationData.pinCode || "",
            country: locationData.country || "India",
            coordinates: coords,
         };

         setAddressInput(fullAddress || "");
         onChange(updatedLocation);
         onCoordinatesChange?.(coords);
         setSelectedSavedAddressId(null);

         // Keep pending data only for optional save action.
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
            fullAddress: fullAddress,
         });
         
         // Log if pinCode is missing
         if (!locationData.pinCode) {
            console.warn('Warning: No pinCode found for marker position:', { lat, lng, locationData });
         }

      } catch (error) {
         console.error('Failed to geocode marker position:', error);
         toast.error("Could not determine address at this location");
      }
   }, [onChange, onCoordinatesChange]);

   const handleUseDraggedAddress = () => {
      setPendingAddressToBeSaved(null);
      toast.success("Using this location for your task");
   };

   const handleGoogleAuthFailure = useCallback(() => {
      toast.error("Google Maps failed to load", {
         description:
            "Please verify API key referrer restrictions for localhost and billing in Google Cloud.",
      });
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
         if (newAddress?.id) {
            setSelectedSavedAddressId(newAddress.id);
         }

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

         setPendingAddressToBeSaved(null);
         toast.success(`Address saved as ${selectedAddressType}`);
      } catch (error) {
         console.error('Failed to save address:', error);
         toast.error("Could not save address");
      }
   };


   const getSavedAddressText = (address: SavedAddress) =>
      [
         address.addressLine1,
         address.addressLine2,
         address.city,
         address.state,
         address.pinCode,
      ]
         .filter(Boolean)
         .join(", ");

   return (
      <div className="space-y-4">
         {/* Saved Addresses Section - Always Visible */}
         {savedAddresses.length > 0 && (
            <div className="space-y-2">
               <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Your Saved Addresses
               </label>
               <div className="grid grid-cols-1 gap-2">
                  {savedAddresses.map((address) => {
                     const addressText = getSavedAddressText(address);
                     const isSelected =
                        selectedSavedAddressId === address.id ||
                        (value?.address && value.address === addressText);

                     return (
                     <button
                        key={address.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(address)}
                        aria-pressed={isSelected}
                        className={cn(
                           "w-full px-3 py-2.5 text-left border rounded-lg transition-all group",
                           isSelected
                              ? "border-primary-600 bg-primary-50 shadow-sm ring-1 ring-primary-200"
                              : "border-gray-200 hover:border-primary-500 hover:bg-primary-50/50"
                        )}
                     >
                        <div className="flex items-start gap-2">
                           <Home
                              className={cn(
                                 "w-4 h-4 mt-0.5 shrink-0",
                                 isSelected
                                    ? "text-primary-700"
                                    : "text-gray-400 group-hover:text-primary-600"
                              )}
                           />
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                 <span className={cn(
                                    "text-sm font-medium",
                                    isSelected ? "text-primary-900" : "text-gray-900"
                                 )}>
                                    {address.label}
                                 </span>
                                 {isSelected && (
                                    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded font-medium">
                                       <CheckCircle2 className="w-3 h-3" />
                                       Selected
                                    </span>
                                 )}
                                 {address.isDefault && (
                                    <span className="text-[10px] px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded font-medium">
                                       Default
                                    </span>
                                 )}
                              </div>
                              <p className={cn(
                                 "text-xs line-clamp-2",
                                 isSelected ? "text-primary-800" : "text-gray-600"
                              )}>
                                 {addressText}
                              </p>
                           </div>
                        </div>
                     </button>
                     );
                  })}
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
                  {mapsConsentBlocked ? (
                     <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                        <div className="text-center text-gray-600 px-4">
                           <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                           <p className="text-sm font-medium mb-2">Maps Not Enabled</p>
                           <p className="text-xs text-gray-500 mb-3">Click to load map or adjust this anytime in cookie preferences.</p>
                           <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                              <Button
                                 type="button"
                                 onClick={() => {
                                    updateConsentPreference("maps", true);
                                 }}
                                 size="sm"
                                 className="bg-primary-500 text-secondary-900 hover:bg-primary-600"
                              >
                                 Click to load map
                              </Button>
                              <Button
                                 type="button"
                                 onClick={() => {
                                    window.dispatchEvent(new Event(OPEN_CONSENT_PREFERENCES_EVENT));
                                 }}
                                 variant="outline"
                                 size="sm"
                              >
                                 Manage Preferences
                              </Button>
                           </div>
                        </div>
                     </div>
                  ) : mapsApiKey ? (
                     <GoogleMapPicker
                        center={mapCenter}
                        markerPosition={markerPosition}
                        onMarkerDragEnd={handleMarkerDrag}
                        apiKey={mapsApiKey}
                        onGoogleAuthFailure={handleGoogleAuthFailure}
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

               {pendingAddressToBeSaved && (
                  <div className="rounded-lg border border-primary-200 bg-primary-50 p-3 space-y-3">
                     <div className="space-y-1">
                        <p className="text-sm font-semibold text-primary-900">Use this location?</p>
                        <p className="text-xs text-primary-800 line-clamp-2">
                           {pendingAddressToBeSaved.fullAddress}
                        </p>
                        <p className="text-xs text-primary-700">
                           {[pendingAddressToBeSaved.address.city, pendingAddressToBeSaved.address.state]
                              .filter(Boolean)
                              .join(", ")}
                           {pendingAddressToBeSaved.address.pinCode
                              ? `, PIN: ${pendingAddressToBeSaved.address.pinCode}`
                              : ""}
                        </p>
                     </div>

                     <div className="grid grid-cols-3 gap-2">
                        {["Home", "Work", "Other"].map((type) => (
                           <button
                              key={type}
                              type="button"
                              onClick={() => setSelectedAddressType(type as "Home" | "Work" | "Other")}
                              className={cn(
                                 "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                                 selectedAddressType === type
                                    ? "border-primary-600 bg-white text-primary-700"
                                    : "border-primary-200 bg-primary-50 text-primary-800 hover:border-primary-300"
                              )}
                           >
                              {type}
                           </button>
                        ))}
                     </div>

                     <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleUseDraggedAddress}>
                           Use This
                        </Button>
                        <Button
                           type="button"
                           onClick={handleSaveSelectedAddress}
                           className="bg-primary-600 text-white hover:bg-primary-700"
                        >
                           Save This
                        </Button>
                     </div>
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
