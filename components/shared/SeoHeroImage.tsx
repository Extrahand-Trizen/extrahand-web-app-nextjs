/**
 * Core Web Vitals–friendly hero image for SEO/service/location pages.
 * Does not alter visible SEO copy — only loading attributes and layout box.
 */

type SeoHeroImageProps = {
   src: string;
   alt: string;
   /** LCP candidate — no lazy load, high fetch priority */
   priority?: boolean;
   width?: number;
   height?: number;
   className?: string;
   objectFit?: "cover" | "contain";
};

const DEFAULT_WIDTH = 900;
const DEFAULT_HEIGHT = 600;

function isRemoteSrc(src: string) {
   return src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:");
}

export function SeoHeroImage({
   src,
   alt,
   priority = true,
   width = DEFAULT_WIDTH,
   height = DEFAULT_HEIGHT,
   className = "",
   objectFit = "cover",
}: SeoHeroImageProps) {
   const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";

   if (isRemoteSrc(src)) {
      return (
         // eslint-disable-next-line @next/next/no-img-element
         <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? "eager" : "lazy"}
            className={`h-full w-full ${fitClass} ${className}`.trim()}
         />
      );
   }

   return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
         src={src}
         alt={alt}
         width={width}
         height={height}
         decoding="async"
         fetchPriority={priority ? "high" : "auto"}
         loading={priority ? "eager" : "lazy"}
         className={`h-full w-full ${fitClass} ${className}`.trim()}
      />
   );
}

export const SEO_HERO_DIMENSIONS = {
   width: DEFAULT_WIDTH,
   height: DEFAULT_HEIGHT,
} as const;

export const SEO_HERO_DEFAULT_WEBP = "/assets/images/seo/default.webp";
