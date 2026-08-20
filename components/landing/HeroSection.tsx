import { HeroSearchFormLazy } from "@/components/landing/HeroSearchFormLazy";

const HERO_IMAGE = "/assets/images/hero-bg1.webp";
const HERO_IMAGE_MOBILE = "/assets/images/hero-bg1-mobile.webp";

// Height comes from className (h-[450px] md:h-[650px]) so mobile/desktop
// reserved space stays correct. Do not set height here — it overrides md:.
const heroSectionStyle = {
   position: "relative",
   display: "flex",
   alignItems: "center",
   justifyContent: "center",
   backgroundColor: "#1a1a1a",
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
   maxWidth: "48rem",
   paddingLeft: "1rem",
   paddingRight: "1rem",
   textAlign: "center",
} as const;

const heroTitleStyle = {
   margin: 0,
   marginBottom: "0.75rem",
   fontSize: "1.875rem",
   lineHeight: 1.25,
   fontWeight: 600,
   letterSpacing: "-0.025em",
   color: "#ffffff",
   fontFamily: "Inter, system-ui, sans-serif",
} as const;

const heroSubtitleStyle = {
   margin: 0,
   marginBottom: "1.25rem",
   fontSize: "0.875rem",
   lineHeight: 1.5,
   fontWeight: 500,
   color: "rgba(255,255,255,0.9)",
   fontFamily: "Inter, system-ui, sans-serif",
} as const;

export function HeroSection() {
   return (
      <section className="relative flex h-[450px] items-center justify-center md:h-[650px]" style={heroSectionStyle}>
         <img
            src={HERO_IMAGE_MOBILE}
            srcSet={`${HERO_IMAGE_MOBILE} 828w, ${HERO_IMAGE} 1920w`}
            sizes="100vw"
            alt=""
            width={828}
            height={450}
            fetchPriority="high"
            decoding="sync"
            className="absolute inset-0 z-0 h-full w-full object-cover"
            style={heroImageStyle}
         />
         <div className="absolute inset-0 z-0 bg-black/40" style={heroOverlayStyle} />

         <div className="relative z-10 w-full max-w-3xl px-4 text-center" style={heroContentStyle}>
            <h1
               className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-3 leading-tight tracking-tight"
               style={heroTitleStyle}
            >
               ExtraHand – Find Trusted Local Service Professionals Near You
            </h1>

            <p
               className="text-sm md:text-lg text-white/90 mb-5 font-medium"
               style={heroSubtitleStyle}
            >
               Choose Your Budget or Book Instantly. The Choice is Yours.
            </p>

            <HeroSearchFormLazy />
         </div>
      </section>
   );
}

export default HeroSection;
