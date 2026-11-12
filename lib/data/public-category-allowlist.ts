export const PUBLIC_CATEGORY_SLUGS = [
   "appliances-services",
   "beauticians-services",
   "carpentry-services",
   "cleaning-services",
   "electricians-services",
   "hairdressers-services",
   "heating-cooling-services",
   "laundry-services",
   "painting-services",
   "pest-control-services",
   "plumbing-services",
] as const;

const publicCategorySlugSet = new Set<string>(PUBLIC_CATEGORY_SLUGS);

export function isAllowedPublicCategorySlug(
   slug: string | null | undefined
): boolean {
   return publicCategorySlugSet.has((slug || "").trim().toLowerCase());
}
