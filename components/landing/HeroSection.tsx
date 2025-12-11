"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const heroImages = [
   "/assets/images/hero-bg1.png",
   "/assets/images/hero-bg2.png",
   "/assets/images/hero-bg3.png",
   "/assets/images/hero-bg4.png",
];

export const HeroSection: React.FC = () => {
   const router = useRouter();
   const [query, setQuery] = useState("");
   const [location, setLocation] = useState("");
   const [isLoadingLocation, setIsLoadingLocation] = useState(false);
   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
   const [currentImageIndex, setCurrentImageIndex] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 3000);

      return () => clearInterval(interval);
   }, []);

   const requestLocationPermission = async () => {
      setIsLoadingLocation(true);
      try {
         if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
               async (position) => {
                  const { latitude, longitude } = position.coords;

                  // Reverse geocode to get city name
                  const response = await fetch(
                     `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                  );
                  const data = await response.json();

                  const city =
                     data.address?.city ||
                     data.address?.town ||
                     data.address?.village ||
                     data.address?.state ||
                     "Unknown Location";

                  setLocation(city);
                  setIsLoadingLocation(false);
                  setShowLocationDropdown(false);
               },
               (error) => {
                  console.error("Error getting location:", error);
                  setIsLoadingLocation(false);
                  // Keep dropdown open so user can manually enter
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
            ? `/tasks/new?${searchParams.toString()}`
            : "/tasks/new"
      );
   };

   return (
      <section className="relative h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden">
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
            <div className="bg-white p-2 rounded-lg shadow-lg max-w-2xl mx-auto">
               <form
                  onSubmit={handleSearch}
                  className="flex flex-col sm:flex-row items-center gap-2"
               >
                  <div className="flex flex-1 w-full">
                     {/* Task Search Input */}
                     <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                           <Search className="w-4 h-4" />
                        </div>
                        <input
                           type="text"
                           value={query}
                           onChange={(e) => setQuery(e.target.value)}
                           placeholder="Try: Mount a TV, House cleaning..."
                           className="w-full h-10 pl-10 pr-3 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 text-xs md:text-sm border-r border-gray-200"
                           aria-label="Search tasks or describe what you need"
                        />
                     </div>

                     {/* Location Input with Dropdown */}
                     <div className="relative flex-1">
                        <button
                           type="button"
                           onClick={() =>
                              setShowLocationDropdown(!showLocationDropdown)
                           }
                           className="w-full h-10 pl-10 pr-3 bg-transparent outline-none text-left text-gray-800 text-sm flex items-center"
                        >
                           <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                              {isLoadingLocation ? (
                                 <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                 <MapPin className="w-4 h-4" />
                              )}
                           </div>
                           <span
                              className={cn(
                                 "text-xs md:text-sm",
                                 location ? "text-gray-800" : "text-gray-400"
                              )}
                           >
                              {location || "Select location"}
                           </span>
                        </button>

                        {/* Location Dropdown */}
                        {showLocationDropdown && (
                           <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                              {/* Use Current Location Button */}
                              <button
                                 type="button"
                                 onClick={requestLocationPermission}
                                 disabled={isLoadingLocation}
                                 className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-gray-100"
                              >
                                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                    {isLoadingLocation ? (
                                       <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                    ) : (
                                       <MapPin className="w-5 h-5 text-blue-600" />
                                    )}
                                 </div>
                                 <div className="flex-1">
                                    <div className="font-semibold text-gray-900 text-sm">
                                       Use my current location
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       We'll detect your location automatically
                                    </div>
                                 </div>
                              </button>

                              {/* Manual Location Input */}
                              <div className="p-3">
                                 <input
                                    type="text"
                                    value={location}
                                    onChange={(e) =>
                                       setLocation(e.target.value)
                                    }
                                    placeholder="Or enter your location manually..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-blue-500 text-sm"
                                    aria-label="Enter your location manually"
                                 />
                              </div>

                              {/* Apply Button */}
                              <div className="p-3 pt-0">
                                 <Button
                                    type="button"
                                    onClick={() =>
                                       setShowLocationDropdown(false)
                                    }
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                 >
                                    Apply
                                 </Button>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>

                  <Button
                     type="submit"
                     size="lg"
                     className="h-8 md:h-10 px-5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-sm w-full sm:w-auto"
                  >
                     Get Offers
                  </Button>
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
