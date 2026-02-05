"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const heroImages = [
   "/assets/images/hero-bg1.png",
   "/assets/images/hero-bg2.png",
   "/assets/images/hero-bg3.png",
   "/assets/images/hero-bg4.png",
];

interface LocationSuggestion {
   place_id: string;
   description: string;
   main_text: string;
   secondary_text: string;
}

export const HeroSection: React.FC = () => {
   const router = useRouter();
   const [query, setQuery] = useState("");
   const [location, setLocation] = useState("");
   const [isLoadingLocation, setIsLoadingLocation] = useState(false);
   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
   const [locationSuggestions, setLocationSuggestions] = useState<
      LocationSuggestion[]
   >([]);
   const [isSearchingLocation, setIsSearchingLocation] = useState(false);
   const [currentImageIndex, setCurrentImageIndex] = useState(0);

   const isMobile = useIsMobile();

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 3000);

      return () => clearInterval(interval);
   }, []);

   // Debounce location search
   useEffect(() => {
      if (!location || location.length < 2) {
         setLocationSuggestions([]);
         return;
      }

      const timer = setTimeout(() => {
         searchLocations(location);
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
      const searchParams = new URLSearchParams();
      if (query) searchParams.set("q", query);
      if (location) searchParams.set("location", location);

      router.push(
         searchParams.toString()
            ? `/tasks/${searchParams.toString()}`
            : "/tasks"
      );
   };

   return (
      <section className="relative h-[450px] md:h-[650px] flex items-center justify-center">
         {/* Background Image Carousel */}
         <div className="absolute inset-0 z-0">
            {heroImages.map((image, index) => (
               <div
                  key={image}
                  className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                     index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                     backgroundImage: `url("${image}")`,
                  }}
               >
                  {/* Dark Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" />
               </div>
            ))}
         </div>

         {/* 2. The Content Card */}
         <div className="relative z-10 w-full max-w-3xl px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-semibold text-white mb-3 leading-tight tracking-tight">
               How can we help you today?
            </h1>

            <p className="text-sm md:text-lg text-white/90 mb-5 font-medium">
               Join 50,000+ neighbours getting things done.
            </p>

            {/* 3. The "Floating" Search Bar */}
            <div className="bg-white px-2 md:py-2 rounded-lg shadow-lg max-w-2xl mx-auto">
               <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-0"
               >
                  {/* Location Input with Dropdown */}
                  <div className="relative w-5/12">
                     <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                        <Input
                           type="text"
                           value={location}
                           onChange={(e) => setLocation(e.target.value)}
                           onFocus={() => setShowLocationDropdown(true)}
                           placeholder="Mumbai"
                           className="h-10 pl-10 pr-3 border-0 border-r border-gray-200 rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs md:text-sm"
                           aria-label="Enter your location"
                        />
                     </div>

                     {/* Location Dropdown */}
                     {showLocationDropdown && (
                        <>
                           <div
                              className="fixed inset-0 z-100"
                              onClick={() => setShowLocationDropdown(false)}
                           />
                           <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-101 overflow-hidden max-h-96 overflow-y-auto">
                              {/* Detect Current Location */}
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

                              {/* Search Results */}
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
                                             setLocation(
                                                suggestion.description
                                             );
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

                              {/* Popular Cities (show when no search results) */}
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
                                                   setShowLocationDropdown(
                                                      false
                                                   );
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
                        </>
                     )}
                  </div>

                  {/* Task Search Input */}
                  <div className="relative flex-1">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                        className="h-10 pl-10 pr-3 border-0 rounded-l-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs md:text-sm"
                        aria-label="Search tasks or describe what you need"
                     />
                  </div>

                  {isMobile && (
                     <button type="submit" onClick={handleSearch}>
                        <div
                           className={cn(
                              "h-9 p-1 bg-primary-600 hover:bg-primary-700 rounded-lg flex items-center justify-center transition-colors",
                              query ? "cursor-pointer" : "cursor-not-allowed"
                           )}
                        >
                           <Search className="w-4 h-4 text-white" />
                        </div>
                     </button>
                  )}
               </form>
            </div>

            {/* Quick Links below search */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
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
                     onClick={() => setQuery(tag)}
                     className="px-3 md:px-4 py-1 md:py-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs md:text-sm font-medium transition-all border border-white/30"
                  >
                     {tag}
                  </button>
               ))}
            </div>
         </div>
      </section>
   );
};

export default HeroSection;
