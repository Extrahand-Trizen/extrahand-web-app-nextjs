/**
 * Static export requires every slug at build time (dynamicParams=false).
 * In local dev, allow on-demand rendering for newly approved CMS pages.
 */
export const allowDynamicCategoryParams =
   process.env.NODE_ENV !== "production";
