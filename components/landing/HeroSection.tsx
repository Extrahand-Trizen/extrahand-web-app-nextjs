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
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-md tracking-tight">
               How can we help you today?
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8 font-medium drop-shadow-sm">
               Join 50,000+ neighbors getting things done.
            </p>

            {/* 3. The "Floating" Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-2xl max-w-2xl mx-auto">
               <form
                  onSubmit={handleSearch}
                  className="flex flex-col sm:flex-row items-center gap-2"
               >
                  <div className="relative flex-1 w-full">
                     <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search className="w-5 h-5" />
                     </div>
                     <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Try 'Mount a TV' or 'House Cleaning'"
                        className="w-full h-14 pl-12 pr-4 rounded-xl bg-transparent outline-none text-gray-800 placeholder:text-gray-400 text-lg"
                     />
                  </div>

                  <Button
                     type="submit"
                     size="lg"
                     className="w-full sm:w-auto h-14 px-8 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg shadow-md"
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
                     className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-sm font-medium transition-all border border-white/30"
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
