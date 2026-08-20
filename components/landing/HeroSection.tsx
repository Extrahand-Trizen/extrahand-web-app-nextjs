import { HeroSearchFormLazy } from "@/components/landing/HeroSearchFormLazy";

const HERO_IMAGE = "/assets/images/hero-bg1.webp";

export function HeroSection() {
   return (
      <section
         className="relative flex h-[450px] items-center justify-center md:h-[650px]"
         style={{ backgroundColor: "#1a1a1a" }}
      >
         <img
            src={HERO_IMAGE}
            alt=""
            width={1920}
            height={650}
            fetchPriority="high"
            decoding="sync"
            className="absolute inset-0 z-0 h-full w-full object-cover"
         />
         <div className="absolute inset-0 z-0 bg-black/40" />

         <div className="relative z-10 w-full max-w-3xl px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-3 leading-tight tracking-tight">
               ExtraHand – Find Trusted Local Service Professionals Near You
            </h1>

            <p className="text-sm md:text-lg text-white/90 mb-5 font-medium">
               Choose Your Budget or Book Instantly. The Choice is Yours.
            </p>

            <HeroSearchFormLazy />
         </div>
      </section>
   );
}

export default HeroSection;
