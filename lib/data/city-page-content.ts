import type { CityInfo } from "@/lib/data/cities";
import { getFeaturedCategories } from "@/lib/data/categories";
import { hyderabadServicePages } from "@/lib/data/hyderabad-service-pages";

export interface CityPageSeoContentBlock {
   id: string;
   title: string;
   html: string;
   type?: "content" | "faq";
   faqs?: Array<{ id: string; question: string; answer: string }>;
}

export interface CityPageContent {
   sectionOrder: string[];
   hero: {
      title: string;
      heading: string;
      description: string;
      image: string;
   };
   popularServices: {
      title: string;
      subtitle: string;
      items: Array<{ id: string; name: string; description: string }>;
   };
   howItWorks: {
      title: string;
      description: string;
      steps: Array<{ id: string; title: string; description: string }>;
   };
   stats: { title: string };
   neighborhoods: {
      title: string;
      description: string;
      popularAreasHeading: string;
      otherAreasHeading: string;
      areas: Array<{ id: string; name: string }>;
   };
   exploreServices: {
      title: string;
      subtitle: string;
      items: Array<{ id: string; title: string; description: string }>;
   };
   seoContentBlocks: CityPageSeoContentBlock[];
   seo: {
      metaTitle: string;
      metaDescription: string;
      canonicalUrl: string;
      ogTitle: string;
      ogDescription: string;
   };
}

export function getCityPageDefaultContent(city: CityInfo): CityPageContent {
   return {
      hero: {
         title: city.name,
         heading: `Find Local Help in ${city.name}`,
         description: city.description,
         image: city.heroImage || "/assets/images/cities/default.webp",
      },
      popularServices: {
         title: `Popular Services in ${city.name}`,
         subtitle: `What do people in ${city.name} need help with?`,
         items: getFeaturedCategories(12).map(({ id, name, description }) => ({
            id,
            name,
            description,
         })),
      },
      howItWorks: {
         title: `How ExtraHand Works in ${city.name}`,
         description: "",
         steps: [
            {
               id: "describe-task",
               title: `Get help in ${city.name}`,
               description:
                  "Describe what you need help with and set your budget.",
            },
            {
               id: "review-offers",
               title: "Get offers from local helpers",
               description:
                  "Review profiles, ratings, and prices from verified helpers.",
            },
            {
               id: "choose-helper",
               title: "Choose and confirm",
               description: "Pick the right helper and get your task done.",
            },
         ],
      },
      stats: { title: "" },
      neighborhoods: {
         title: "Neighborhood Coverage",
         description: `ExtraHand is available across ${city.name}`,
         popularAreasHeading: "Popular Areas",
         otherAreasHeading: "Also Available In",
         areas: city.neighborhoods.map((name) => ({
            id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
            name,
         })),
      },
      exploreServices: {
         title: `Explore Services in ${city.name}`,
         subtitle: `Explore all available services in ${city.name} and find the right local help for your task.`,
         items:
            city.slug === "hyderabad" ||
            city.slug === "mahabubnagar" ||
            city.slug === "siddipet"
               ? hyderabadServicePages.map((servicePage) => ({
                    id: servicePage.slug,
                    title: `${servicePage.serviceName} in ${city.name}`,
                    description: servicePage.shortDescription.replaceAll(
                       "Hyderabad",
                       city.name
                    ),
                 }))
               : [],
      },
      seoContentBlocks: [],
      sectionOrder: [
         "hero",
         "popularServices",
         "howItWorks",
         "stats",
         "neighborhoods",
         "exploreServices",
      ],
      seo: {
         metaTitle: `ExtraHand ${city.name} | Find Local Helpers & Services in ${city.name}`,
         metaDescription: `Connect with verified helpers in ${city.name}, ${city.state}. ${city.description}`,
         canonicalUrl: "",
         ogTitle: `ExtraHand ${city.name} - Local Services & Tasks`,
         ogDescription: city.description,
      },
   };
}

export function mergeCityPageContent(
   defaults: CityPageContent,
   published: CityPageContent
): CityPageContent {
   const publishedById = <T extends { id: string }>(items: T[]) =>
      new Map(items.map((item) => [item.id, item]));

   const popularServices = publishedById(published.popularServices.items);
   const steps = publishedById(published.howItWorks.steps);
   const areas = publishedById(published.neighborhoods.areas);
   const exploreServices = publishedById(published.exploreServices.items);
   const seoContentBlocks = published.seoContentBlocks ?? [];
   const sectionKeys = new Set([
      "hero",
      "popularServices",
      "howItWorks",
      "stats",
      "neighborhoods",
      "exploreServices",
      ...seoContentBlocks.map((block) => `seo:${block.id}`),
   ]);
   const legacySectionOrder = [
      "hero",
      "popularServices",
      "howItWorks",
      "stats",
      "neighborhoods",
      ...seoContentBlocks.map((block) => `seo:${block.id}`),
      "exploreServices",
   ];
   const requestedSectionOrder = Array.isArray(published.sectionOrder)
      ? published.sectionOrder
      : legacySectionOrder;
   const sectionOrder = [
      ...new Set(requestedSectionOrder.filter((key) => sectionKeys.has(key))),
      ...legacySectionOrder.filter(
         (key) =>
            sectionKeys.has(key) && !requestedSectionOrder.includes(key)
      ),
   ];

   return {
      sectionOrder,
      hero: { ...defaults.hero, ...published.hero },
      popularServices: {
         ...defaults.popularServices,
         ...published.popularServices,
         items: defaults.popularServices.items.map((item) => ({
            ...item,
            ...popularServices.get(item.id),
         })),
      },
      howItWorks: {
         ...defaults.howItWorks,
         ...published.howItWorks,
         steps: defaults.howItWorks.steps.map((step) => ({
            ...step,
            ...steps.get(step.id),
         })),
      },
      stats: { ...defaults.stats, ...published.stats },
      neighborhoods: {
         ...defaults.neighborhoods,
         ...published.neighborhoods,
         areas: defaults.neighborhoods.areas.map((area) => ({
            ...area,
            ...areas.get(area.id),
         })),
      },
      exploreServices: {
         ...defaults.exploreServices,
         ...published.exploreServices,
         items: defaults.exploreServices.items.map((item) => ({
            ...item,
            ...exploreServices.get(item.id),
         })),
      },
      seoContentBlocks,
      seo: { ...defaults.seo, ...published.seo },
   };
}

function isRecord(value: unknown): value is Record<string, unknown> {
   return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
   return typeof value === "string";
}

export function isCityPageContent(value: unknown): value is CityPageContent {
   if (!isRecord(value)) return false;
   const stringFields = (record: unknown, fields: string[]) =>
      isRecord(record) && fields.every((field) => isString(record[field]));
   const items = (value: unknown, fields: string[]) =>
      Array.isArray(value) &&
      value.every((item) => stringFields(item, ["id", ...fields]));

   return (
      stringFields(value.hero, ["title", "heading", "description", "image"]) &&
      stringFields(value.popularServices, ["title", "subtitle"]) &&
      items(
         isRecord(value.popularServices) ? value.popularServices.items : null,
         ["name", "description"]
      ) &&
      stringFields(value.howItWorks, ["title", "description"]) &&
      items(
         isRecord(value.howItWorks) ? value.howItWorks.steps : null,
         ["title", "description"]
      ) &&
      stringFields(value.stats, ["title"]) &&
      stringFields(value.neighborhoods, [
         "title",
         "description",
         "popularAreasHeading",
         "otherAreasHeading",
      ]) &&
      items(
         isRecord(value.neighborhoods) ? value.neighborhoods.areas : null,
         ["name"]
      ) &&
      stringFields(value.exploreServices, ["title", "subtitle"]) &&
      items(
         isRecord(value.exploreServices) ? value.exploreServices.items : null,
         ["title", "description"]
      ) &&
      Array.isArray(value.seoContentBlocks) &&
      value.seoContentBlocks.every((block) => {
         if (
            !stringFields(block, ["id", "title", "html"]) ||
            !isRecord(block) ||
            (block.type !== undefined &&
               block.type !== "content" &&
               block.type !== "faq")
         ) {
            return false;
         }
         return (
            block.type !== "faq" ||
            (Array.isArray(block.faqs) &&
               block.faqs.length > 0 &&
               block.faqs.every((faq) =>
                  stringFields(faq, ["id", "question", "answer"])
               ))
         );
      }) &&
      (value.sectionOrder === undefined ||
         (Array.isArray(value.sectionOrder) &&
            value.sectionOrder.every(isString))) &&
      stringFields(value.seo, [
         "metaTitle",
         "metaDescription",
         "canonicalUrl",
         "ogTitle",
         "ogDescription",
      ])
   );
}
