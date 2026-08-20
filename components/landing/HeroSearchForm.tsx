"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2 } from "lucide-react";

interface LocationSuggestion {
   place_id: string;
   description: string;
   main_text: string;
   secondary_text: string;
}

export function HeroSearchForm() {
   const router = useRouter();
   const [query, setQuery] = useState("");
   const [location, setLocation] = useState("");
   const [isLoadingLocation, setIsLoadingLocation] = useState(false);
   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
   const [locationSuggestions, setLocationSuggestions] = useState<
      LocationSuggestion[]
   >([]);
   const [isSearchingLocation, setIsSearchingLocation] = useState(false);
   const locationContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            locationContainerRef.current &&
            !locationContainerRef.current.contains(event.target as Node)
         ) {
            setShowLocationDropdown(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   useEffect(() => {
      if (!location || location.length < 2) {
         setLocationSuggestions([]);
         return;
      }

      const timer = setTimeout(() => {
         void searchLocations(location);
      }, 300);

      return () => clearTimeout(timer);
   }, [location]);

   const searchLocations = async (searchText: string) => {
      setIsSearchingLocation(true);
      try {
         const response = await fetch(
            `/api/geocode/search?input=${encodeURIComponent(searchText)}`
         );
         const data = await response.json();

         if (data.suggestions) {
            setLocationSuggestions(data.suggestions);
         }
      } catch (error) {
         console.error("Error searching locations:", error);
      } finally {
         setIsSearchingLocation(false);
      }
   };

   const requestLocationPermission = async () => {
      setIsLoadingLocation(true);
      try {
         if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
               async (position) => {
                  const { latitude, longitude } = position.coords;

                  try {
                     const response = await fetch(
                        `/api/geocode?lat=${latitude}&lng=${longitude}`
                     );

                     if (!response.ok) {
                        throw new Error("Geocoding failed");
                     }

                     const data = await response.json();

                     if (data) {
                        const area =
                           data?.raw?.address?.neighborhood ||
                           data?.raw?.address?.sublocality ||
                           data?.raw?.address?.street ||
                           "";
                        const city = data?.raw?.address?.city || "";
                        const shortLocation =
                           area && city
                              ? `${area}, ${city}`
                              : city || area || data.address || "";

                        if (shortLocation) {
                           setLocation(shortLocation);
                           setShowLocationDropdown(false);
                        }
                     }
                  } catch (error) {
                     console.error("Error geocoding:", error);
                  }

                  setIsLoadingLocation(false);
               },
               (error) => {
                  console.error("Error getting location:", error);
                  setIsLoadingLocation(false);
               }
            );
         }
      } catch (error) {
         console.error("Error fetching location:", error);
         setIsLoadingLocation(false);
      }
   };

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();

      try {
         const searchParams = new URLSearchParams();
         const trimmedQuery = query.trim();
         const trimmedLocation = location.trim();

         if (!trimmedQuery && !trimmedLocation) {
            return;
         }

         if (trimmedQuery) searchParams.set("q", trimmedQuery);
         if (trimmedLocation) searchParams.set("suburb", trimmedLocation);

         const qs = searchParams.toString();
         router.push(qs ? `/discover?${qs}` : "/discover");
      } catch (error) {
         console.error("Search error:", error);
         router.push("/discover");
      }
   };

   const navigateWithTag = (tag: string) => {
      const searchParams = new URLSearchParams();
      searchParams.set("q", tag);
      if (location.trim()) searchParams.set("suburb", location.trim());
      router.push(`/discover?${searchParams.toString()}`);
   };

   return (
      <div className="max-w-2xl mx-auto">
         <div className="bg-white px-2 md:py-2 rounded-lg shadow-lg">
            <form
               onSubmit={handleSearch}
               className="flex items-center gap-1 md:gap-2 min-h-[40px] md:min-h-[48px]"
            >
               <div
                  className="relative flex-1 md:w-1/3"
                  ref={locationContainerRef}
               >
                  <div className="relative">
                     <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                     <Input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onFocus={() => setShowLocationDropdown(true)}
                        placeholder="Hyderabad"
                        className="h-10 pl-10 pr-3 border-0 border-r border-gray-200 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs md:text-sm"
                        aria-label="Enter your location"
                     />
                  </div>

                  {showLocationDropdown && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-x-hidden overflow-y-auto max-h-72 custom-scrollbar">
                        <button
                           type="button"
                           onClick={requestLocationPermission}
                           disabled={isLoadingLocation}
                           className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100"
                        >
                           <MapPin className="size-4 md:size-5 text-primary-500 shrink-0" />
                           <div className="flex-1">
                              <div className="font-medium text-primary-500 text-xs md:text-sm">
                                 {isLoadingLocation
                                    ? "Detecting..."
                                    : "Detect Current Location"}
                              </div>
                              <div className="text-[9px] md:text-xs text-gray-500">
                                 Using GPS
                              </div>
                           </div>
                           {isLoadingLocation && (
                              <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                           )}
                        </button>

                        {isSearchingLocation && (
                           <div className="px-4 py-3 text-center text-sm text-gray-500">
                              <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                              Searching...
                           </div>
                        )}

                        {locationSuggestions.length > 0 && (
                           <div className="p-2">
                              {locationSuggestions.map((suggestion) => (
                                 <button
                                    key={suggestion.place_id}
                                    type="button"
                                    onClick={() => {
                                       setLocation(suggestion.description);
                                       setShowLocationDropdown(false);
                                    }}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-100 rounded transition-colors"
                                 >
                                    <div className="text-sm text-gray-900 font-medium">
                                       {suggestion.main_text}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       {suggestion.secondary_text}
                                    </div>
                                 </button>
                              ))}
                           </div>
                        )}

                        {!isSearchingLocation &&
                           locationSuggestions.length === 0 && (
                              <div className="p-3">
                                 <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-1">
                                    Popular Cities
                                 </h3>
                                 <div className="md:space-y-1">
                                    {[
                                       "Bangalore",
                                       "Chennai",
                                       "Delhi NCR",
                                       "Hyderabad",
                                       "Kolkata",
                                       "Mumbai",
                                       "Pune",
                                    ].map((city) => (
                                       <button
                                          key={city}
                                          type="button"
                                          onClick={() => {
                                             setLocation(city);
                                             setShowLocationDropdown(false);
                                          }}
                                          className="w-full px-2 py-1 md:px-3 md:py-2 text-left text-xs md:text-sm text-gray-900 hover:bg-gray-100 rounded transition-colors"
                                       >
                                          {city}
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           )}
                     </div>
                  )}
               </div>

               <div className="relative flex-1">
                  <Input
                     type="text"
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           handleSearch(e);
                        }
                     }}
                     placeholder="Try: Mount a TV, House cleaning..."
                     className="h-10 pl-3 pr-3 border-0 rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs md:text-sm"
                     aria-label="Search tasks or describe what you need"
                  />
               </div>

               <button
                  type="submit"
                  className="h-9 md:h-10 px-3 md:px-4 bg-primary-500 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors shrink-0"
                  aria-label="Search"
               >
                  <Search className="w-4 h-4 md:w-5 md:h-5 text-white" />
               </button>
            </form>
         </div>

         <div className="mt-8 flex flex-wrap justify-center gap-3 min-h-[28px] md:min-h-[36px]">
            {[
               "Cleaning",
               "Moving",
               "Handyman",
               "Painting",
               "Gardening",
               "Plumbing",
               "Business",
            ].map((tag) => (
               <button
                  key={tag}
                  type="button"
                  onClick={() => navigateWithTag(tag)}
                  className="px-3 md:px-4 py-1 md:py-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs md:text-sm font-medium transition-colors border border-white/30"
               >
                  {tag}
               </button>
            ))}
         </div>
      </div>
   );
}
