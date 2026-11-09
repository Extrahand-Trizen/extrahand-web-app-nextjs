import { HeroSearchFormLazy } from "@/components/landing/HeroSearchFormLazy";

const HERO_IMAGE = "/assets/images/hero-bg1.webp";
const TRANSPARENT_PIXEL =
   "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

// Height comes from className (h-[450px] md:h-[650px]) so mobile/desktop
// reserved space stays correct. Do not set height here — it overrides md:.
const heroSectionStyle = {
   position: "relative",
   display: "flex",
   alignItems: "center",
   justifyContent: "center",
   backgroundColor: "#1a1a1a",
   backgroundImage: "linear-gradient(135deg, #173b4c 0%, #1a1a1a 55%, #263a46 100%)",
   minHeight: "450px",
} as const;

const heroImageStyle = {
   position: "absolute",
   inset: 0,
   width: "100%",
   height: "100%",
   objectFit: "cover",
   zIndex: 0,
} as const;

const heroOverlayStyle = {
   position: "absolute",
   inset: 0,
   backgroundColor: "rgba(0,0,0,0.4)",
   zIndex: 0,
} as const;

const heroContentStyle = {
   position: "relative",
   zIndex: 10,
   width: "100%",
   maxWidth: "64rem",
   paddingLeft: "1rem",
   paddingRight: "1rem",
   textAlign: "center",
} as const;

export function HeroSection() {
   return (
      <section
         aria-label="ExtraHand homepage introduction"
         className="relative flex h-[450px] items-center justify-center scroll-mt-28 md:h-[650px]"
         data-home-tab-step
         role="region"
         style={heroSectionStyle}
         tabIndex={-1}
      >
         <picture className="absolute inset-0 z-0 h-full w-full">
            <source media="(min-width: 768px)" srcSet={HERO_IMAGE} />
            <img
               src={TRANSPARENT_PIXEL}
               alt=""
               width={1920}
               height={650}
               fetchPriority="high"
               decoding="async"
               className="h-full w-full object-cover"
               style={heroImageStyle}
            />
         </picture>
         <div className="absolute inset-0 z-0 bg-black/40" style={heroOverlayStyle} />

         <div className="relative z-10 w-full max-w-5xl px-4 text-center" style={heroContentStyle}>
            <h1
               className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-3 leading-tight tracking-tight"
            >
               ExtraHand – Your Trusted Partner for Home Services & Daily Essentials
            </h1>

            <p
               className="text-sm md:text-lg text-white/90 mb-5 font-medium"
            >
               Book trusted professionals for home services and shop groceries,
               fruits, vegetables and everyday essentials with ExtraHand.
            </p>

            <HeroSearchFormLazy />
         </div>
      </section>
   );
}

export default HeroSection;
