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
   // contain: match previous CMS hero behavior (max box, not stretched full)
   const sizeClass =
      objectFit === "contain" ? "max-w-full max-h-full w-auto h-auto" : "h-full w-full";

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
         className={`${sizeClass} ${fitClass} ${className}`.trim()}
      />
   );
}

export const SEO_HERO_DIMENSIONS = {
   width: DEFAULT_WIDTH,
   height: DEFAULT_HEIGHT,
} as const;

/** Original CDN fallback used by CMS SEO / area pages (do not change path). */
export const SEO_HERO_DEFAULT_IMAGE = "/assets/images/seo/default.png";

/** @deprecated use SEO_HERO_DEFAULT_IMAGE */
export const SEO_HERO_DEFAULT_WEBP = SEO_HERO_DEFAULT_IMAGE;
