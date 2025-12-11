"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const heroImages = [
   "/assets/images/hero-bg1.png",
   "/assets/images/hero-bg2.png",
   "/assets/images/hero-bg3.png",
   "/assets/images/hero-bg4.png",
];

export const HeroSection: React.FC = () => {
   const router = useRouter();
   const [query, setQuery] = useState("");
   const [currentImageIndex, setCurrentImageIndex] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 3000);

      return () => clearInterval(interval);
   }, []);

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      router.push(
         query ? `/tasks/new?q=${encodeURIComponent(query)}` : "/tasks/new"
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
                  <div className="relative flex-1 w-full">
                     <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Search className="w-4 h-4" />
                     </div>
                     <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Try: Mount a TV, House cleaning, or Moving"
                        className="w-full h-10 pl-10 pr-3 rounded-md bg-transparent outline-none text-gray-800 placeholder:text-gray-400 text-sm"
                        aria-label="Search tasks or describe what you need"
                     />
                  </div>

                  <Button
                     type="submit"
                     size="lg"
                     className="h-8 md:h-10 px-5 rounded-md bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-sm"
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
