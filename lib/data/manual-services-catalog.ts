import type {
   Category,
   Subcategory,
   PosterCategoryDetail,
   PosterTopTasker,
   PosterReview,
   PosterWhyBookFeature,
   Question,
   PosterWhatTheyDoSection,
   PosterStaticTask,
} from "@/types/category";

export interface ManualServiceEntry {
   categorySlug: string;
   categoryName: string;
   subcategorySlug: string;
   subcategoryName: string;
   shortDescription: string;
   longDescription: string;
   imagePath: string;
   highlights: string[];
   commonRequests: string[];
   process: string[];
   faq: {
      question: string;
      answer: string;
   }[];
}

export const manualServiceEntries: ManualServiceEntry[] = [
   {
      categorySlug: "appliances-services",
      categoryName: "Appliances Services",
      subcategorySlug: "ac-repair-services",
      subcategoryName: "AC Repair Services",
      shortDescription: "Get reliable AC repair for cooling issues, airflow imbalance, and seasonal performance drops.",
      longDescription: "AC repair services focus on restoring cooling efficiency, improving airflow, and preventing repeat failures through proper diagnostics and performance checks.",
      imagePath: "/assets/mobilescreens/tech.webp",
      highlights: ["Cooling and airflow diagnosis", "Minor part replacement guidance", "Split and window AC support"],
      commonRequests: ["AC not cooling", "Indoor unit water leakage", "Unusual AC noise or odor"],
      process: ["Share AC issue details", "Technician checks cooling and airflow", "Receive repair recommendation and completion"],
      faq: [
         {
            question: "Do you support both home and office AC units?",
            answer: "Yes, AC repair is available for residential and commercial setups.",
         },
      ],
   },
   {
      categorySlug: "appliances-services",
      categoryName: "Appliances Services",
      subcategorySlug: "washing-machine-repair",
      subcategoryName: "Washing Machine Repair",
      shortDescription: "Fix washing machine spin, drainage, and motor problems with expert doorstep support.",
      longDescription: "Washing machine repair includes cycle-level troubleshooting for drum, drainage, and control issues to restore consistent daily laundry performance.",
      imagePath: "/assets/mobilescreens/work.webp",
      highlights: ["Spin and drum checks", "Drainage issue diagnosis", "Top-load and front-load support"],
      commonRequests: ["Machine not starting", "Water not draining", "Excessive vibration during spin"],
      process: ["Share brand and issue symptoms", "Technician inspects machine cycle behavior", "Repair completed with usage guidance"],
      faq: [
         {
            question: "Can same-day repair be requested?",
            answer: "Same-day slots may be available depending on area and technician availability.",
         },
      ],
   },
   {
      categorySlug: "appliances-services",
      categoryName: "Appliances Services",
      subcategorySlug: "refrigerator-repair",
      subcategoryName: "Refrigerator Repair",
      shortDescription: "Book refrigerator repair for cooling inconsistency, leakage, and compressor-related concerns.",
      longDescription: "Refrigerator repair services resolve cooling imbalance and component-level faults to protect food safety and daily storage reliability.",
      imagePath: "/assets/mobilescreens/tech.webp",
      highlights: ["Cooling consistency checks", "Compressor and thermostat diagnosis", "Leak and seal inspection"],
      commonRequests: ["Fridge not cooling", "Noise from compressor", "Water leakage near unit"],
      process: ["Raise issue with unit behavior", "On-site technical diagnosis", "Repair and cooling performance validation"],
      faq: [
         {
            question: "Do you inspect both freezer and lower compartment cooling?",
            answer: "Yes, both compartments are checked for balanced cooling output.",
         },
      ],
   },
   {
      categorySlug: "appliances-services",
      categoryName: "Appliances Services",
      subcategorySlug: "tv-repair-services",
      subcategoryName: "TV Repair Services",
      shortDescription: "Get TV repair for display, audio, power, and smart connectivity problems.",
      longDescription: "TV repair assistance supports LED and smart TV issues through board, power, and screen-level diagnosis for stable viewing quality.",
      imagePath: "/assets/mosted-booked-services/tv-mounting.webp",
      highlights: ["Display and panel diagnosis", "Sound and port troubleshooting", "Smart TV issue support"],
      commonRequests: ["No display output", "No audio", "TV not powering on"],
      process: ["Share TV symptoms", "Technician performs diagnostic checks", "Repair action and port validation"],
      faq: [
         {
            question: "Can wall-mounted TVs be repaired on-site?",
            answer: "Yes, wall-mounted TV units can be diagnosed and serviced.",
         },
      ],
   },
   {
      categorySlug: "appliances-services",
      categoryName: "Appliances Services",
      subcategorySlug: "geyser-repair",
      subcategoryName: "Geyser Repair",
      shortDescription: "Resolve geyser heating, thermostat, and leakage issues with trained technicians.",
      longDescription: "Geyser repair services restore safe and consistent hot-water output by checking elements, wiring, and pressure controls.",
      imagePath: "/assets/mobilescreens/electrical.webp",
      highlights: ["Heating element inspection", "Thermostat and safety checks", "Leakage troubleshooting"],
      commonRequests: ["No hot water", "Water leakage", "Frequent power tripping"],
      process: ["Describe heating issue", "Technician inspects control and element health", "Repair completion with safety checks"],
      faq: [
         {
            question: "Do you support both instant and storage geysers?",
            answer: "Yes, service support is available for instant and storage models.",
         },
      ],
   },
   {
      categorySlug: "appliances-services",
      categoryName: "Appliances Services",
      subcategorySlug: "ro-water-purifier-repair",
      subcategoryName: "RO Water Purifier Repair",
      shortDescription: "Fix low-flow RO, filter errors, and leakage issues for reliable drinking water.",
      longDescription: "RO repair services improve purifier performance through filter, membrane, and pressure-line diagnostics suited for regular household usage.",
      imagePath: "/assets/mobilescreens/plumbing.webp",
      highlights: ["Flow and pressure checks", "Filter and membrane guidance", "Leak and connector inspection"],
      commonRequests: ["Low output water", "Bad taste or odor", "Leakage from purifier"],
      process: ["Report purifier issue", "Technician tests flow and filtration performance", "Repair and maintenance recommendations"],
      faq: [
         {
            question: "Can this include preventive maintenance advice?",
            answer: "Yes, technicians share maintenance recommendations after service.",
         },
      ],
   },
   {
      categorySlug: "cleaning-services",
      categoryName: "Cleaning Services",
      subcategorySlug: "sofa-cleaning",
      subcategoryName: "Sofa Cleaning",
      shortDescription: "Professional sofa cleaning for stain removal, odor treatment, and upholstery care.",
      longDescription: "Sofa cleaning services restore fabric freshness and hygiene through material-safe methods designed for daily-use upholstery.",
      imagePath: "/assets/mosted-booked-services/homeclean.webp",
      highlights: ["Fabric-safe cleaning methods", "Stain and odor treatment", "Quick-dry process guidance"],
      commonRequests: ["Food or drink stains", "Pet odor", "Routine upholstery deep cleaning"],
      process: ["Share sofa material and stains", "Cleaning method selected by upholstery type", "Stain treatment and hygiene finish"],
      faq: [
         {
            question: "Do different fabric types need different methods?",
            answer: "Yes, cleaning methods are selected based on upholstery material.",
         },
      ],
   },
   {
      categorySlug: "cleaning-services",
      categoryName: "Cleaning Services",
      subcategorySlug: "bathroom-cleaning",
      subcategoryName: "Bathroom Cleaning",
      shortDescription: "Book deep bathroom cleaning for scaling, stains, and hard-water deposits.",
      longDescription: "Bathroom cleaning targets tiles, fittings, and hygiene-sensitive areas to improve freshness and daily usability.",
      imagePath: "/assets/mobilescreens/cleaning.webp",
      highlights: ["Tile and fitting descaling", "Stain and grime removal", "Hygiene-focused cleaning"],
      commonRequests: ["Hard-water stains", "Persistent odor", "Soap and mineral buildup"],
      process: ["Share cleaning scope", "Area-wise descaling and deep cleaning", "Final wipe and hygiene finish"],
      faq: [
         {
            question: "Are fittings and glass surfaces included?",
            answer: "Yes, exposed fittings and glass areas are typically included.",
         },
      ],
   },
   {
      categorySlug: "cleaning-services",
      categoryName: "Cleaning Services",
      subcategorySlug: "kitchen-cleaning",
      subcategoryName: "Kitchen Cleaning",
      shortDescription: "Get kitchen deep cleaning for grease removal, counters, and high-use surfaces.",
      longDescription: "Kitchen cleaning services focus on degreasing and hygiene improvement across cooking zones, counters, and utility surfaces.",
      imagePath: "/assets/mobilescreens/cleaning.webp",
      highlights: ["Grease-heavy area cleaning", "Counter and sink detailing", "Surface-safe hygiene treatment"],
      commonRequests: ["Oil buildup", "Cabinet grime", "Post-event cleanup"],
      process: ["Define kitchen cleaning scope", "Deep cleaning and degreasing", "Final detailing and hygiene checks"],
      faq: [
         {
            question: "Can chimney-side grease zones be covered?",
            answer: "Yes, heavy grease zones are included in deep-clean scope.",
         },
      ],
   },
   {
      categorySlug: "removals-services",
      categoryName: "Removals Services",
      subcategorySlug: "packers-and-movers",
      subcategoryName: "Packers and Movers",
      shortDescription: "Plan safe local relocation with packing, loading, transport, and unloading support.",
      longDescription: "Packers and movers services help households shift with better packing quality, transit control, and organized unloading.",
      imagePath: "/assets/mobilescreens/moving.webp",
      highlights: ["Packing and handling support", "Loading and transport coordination", "Destination unloading"],
      commonRequests: ["Apartment relocation", "Family household move", "Local city shifting"],
      process: ["Share move size and locations", "Packing and loading workflow", "Transit and destination unloading"],
      faq: [
         {
            question: "Can fragile items be packed separately?",
            answer: "Yes, fragile items can be packed with additional care.",
         },
      ],
   },
   {
      categorySlug: "removals-services",
      categoryName: "Removals Services",
      subcategorySlug: "house-shifting-services",
      subcategoryName: "House Shifting Services",
      shortDescription: "Get complete house shifting support with coordinated home relocation planning.",
      longDescription: "House shifting services streamline end-to-end residential relocation from packing to final placement of items.",
      imagePath: "/assets/mobilescreens/moving.webp",
      highlights: ["Room-wise packing support", "Safe transport for household items", "Unloading and placement guidance"],
      commonRequests: ["Within-city home shifting", "Weekend relocation", "Apartment to villa move"],
      process: ["Book your move date and scope", "Packing and loading execution", "Transport, unloading, and handover"],
      faq: [
         {
            question: "Can shifts be planned for weekends?",
            answer: "Yes, weekend slots can be arranged based on availability.",
         },
      ],
   },
   {
      categorySlug: "removals-services",
      categoryName: "Removals Services",
      subcategorySlug: "office-relocation",
      subcategoryName: "Office Relocation",
      shortDescription: "Move office furniture and equipment with minimal workflow disruption.",
      longDescription: "Office relocation services are structured to support business continuity with planned movement of workstations, records, and equipment.",
      imagePath: "/assets/images/office.webp",
      highlights: ["Department-wise relocation planning", "Equipment and workstation movement", "Setup support at destination"],
      commonRequests: ["Branch relocation", "Floor-wise office shift", "Startup office move"],
      process: ["Assess office move scope", "Execute phased movement plan", "Setup support and operational handover"],
      faq: [
         {
            question: "Can relocation be done in phases?",
            answer: "Yes, phased relocation plans can be created to reduce downtime.",
         },
      ],
   },
   {
      categorySlug: "home-automation-and-security-services",
      categoryName: "Home Automation and Security Services",
      subcategorySlug: "cctv-installation-services",
      subcategoryName: "CCTV Installation Services",
      shortDescription: "Install CCTV systems with proper camera placement and remote-view setup.",
      longDescription: "CCTV installation services improve home and office monitoring with practical coverage design and stable recording setup.",
      imagePath: "/assets/mobilescreens/mounting.webp",
      highlights: ["Coverage planning", "Wiring and device setup", "Basic remote-view configuration"],
      commonRequests: ["Entry-point monitoring", "Office camera setup", "Shop floor surveillance"],
      process: ["Share monitoring goals", "Camera placement and setup", "Testing and viewing configuration"],
      faq: [
         {
            question: "Can mobile viewing be configured during installation?",
            answer: "Yes, technicians can help with app-based viewing setup.",
         },
      ],
   },
   {
      categorySlug: "cleaning-services",
      categoryName: "Cleaning Services",
      subcategorySlug: "home-cleaning",
      subcategoryName: "Home Cleaning",
      shortDescription: "Book complete home cleaning for routine hygiene and deep-clean requirements.",
      longDescription: "Home cleaning services are designed for full-home hygiene improvement, dust removal, and refreshed living spaces.",
      imagePath: "/assets/mobilescreens/cleaning.webp",
      highlights: ["Room-wise deep cleaning", "Surface and dust treatment", "Move-in and seasonal cleaning support"],
      commonRequests: ["Festival cleaning", "Post-renovation cleanup", "Routine deep cleaning"],
      process: ["Select home cleaning scope", "Team executes area-wise cleaning", "Final quality walkthrough"],
      faq: [
         {
            question: "Is full-home deep cleaning available?",
            answer: "Yes, full-home packages are available based on property size.",
         },
      ],
   },
   {
      categorySlug: "pest-control-services",
      categoryName: "Pest Control Services",
      subcategorySlug: "pest-control",
      subcategoryName: "Pest Control",
      shortDescription: "Control common pests with targeted treatment and preventive service planning.",
      longDescription: "Pest control services combine inspection and treatment strategies to handle active infestations and reduce recurrence.",
      imagePath: "/assets/mobilescreens/home.webp",
      highlights: ["Site and infestation inspection", "Targeted treatment by pest type", "Preventive guidance"],
      commonRequests: ["Cockroach control", "Termite concerns", "Mosquito reduction"],
      process: ["Identify pest activity zones", "Apply treatment plan", "Follow preventive guidance"],
      faq: [
         {
            question: "Can preventive pest visits be scheduled?",
            answer: "Yes, preventive plans can be scheduled periodically.",
         },
      ],
   },
   {
      categorySlug: "painting-services",
      categoryName: "Painting Services",
      subcategorySlug: "painting-services",
      subcategoryName: "Painting Services",
      shortDescription: "Hire painting professionals for interior, exterior, and touch-up painting requirements.",
      longDescription: "Painting services include surface preparation, finishing, and clean application support for residential and commercial spaces.",
      imagePath: "/assets/mobilescreens/painting.webp",
      highlights: ["Surface prep and primer support", "Interior and exterior painting", "Touch-up and repaint jobs"],
      commonRequests: ["Room repainting", "Rental handover touch-up", "Office wall refresh"],
      process: ["Share painting scope and color preference", "Surface preparation and paint execution", "Final finishing and handover"],
      faq: [
         {
            question: "Can painting be done for only one room?",
            answer: "Yes, single-room and full-property painting support are both available.",
         },
      ],
   },
   {
      categorySlug: "computers-it-services",
      categoryName: "Computers & IT Services",
      subcategorySlug: "laptop-repair",
      subcategoryName: "Laptop Repair",
      shortDescription: "Fix laptop performance, display, charging, and hardware issues with expert support.",
      longDescription: "Laptop repair services address hardware and software issues to restore productivity with stable system performance.",
      imagePath: "/assets/mobilescreens/tech.webp",
      highlights: ["Hardware and performance diagnosis", "Charging and display issue support", "OS and startup troubleshooting"],
      commonRequests: ["Laptop not turning on", "Slow performance", "Battery and charging problems"],
      process: ["Share model and issue", "Technician diagnoses fault areas", "Repair and post-service performance checks"],
      faq: [
         {
            question: "Do you support both hardware and software troubleshooting?",
            answer: "Yes, support includes both hardware and software-level issues.",
         },
      ],
   },
];

/** One URL per primary category (subs are sections on that page with hash links). */
export const manualServicePrimaryPaths = [
   ...new Set(manualServiceEntries.map((service) => `/services/${service.categorySlug}`)),
];

export function getManualServiceBySlugs(
   categorySlug: string,
   subcategorySlug: string
) {
   return manualServiceEntries.find(
      (service) =>
         service.categorySlug === categorySlug &&
         service.subcategorySlug === subcategorySlug
   );
}

export function getManualServicesByCategorySlug(categorySlug: string) {
   return manualServiceEntries.filter(
      (service) => service.categorySlug === categorySlug
   );
}

export function mergeManualServicesIntoCategories(categories: Category[]) {
   const categoryMap = new Map<string, Category>();

   categories.forEach((category) => {
      categoryMap.set(category.slug, {
         ...category,
         subcategories: Array.isArray(category.subcategories)
            ? [...category.subcategories]
            : [],
      });
   });

   manualServiceEntries.forEach((manualService) => {
      const existingCategory = categoryMap.get(manualService.categorySlug);

      const manualSubcategory: Subcategory = {
         _id: `manual-${manualService.categorySlug}-${manualService.subcategorySlug}`,
         name: manualService.subcategoryName,
         slug: manualService.subcategorySlug,
         categorySlug: manualService.categorySlug,
         isPublished: true,
         status: "PUBLISHED",
      };

      if (!existingCategory) {
         categoryMap.set(manualService.categorySlug, {
            _id: `manual-${manualService.categorySlug}`,
            name: manualService.categoryName,
            slug: manualService.categorySlug,
            heroImage: manualService.imagePath,
            heroTitle: `${manualService.categoryName} on ExtraHand`,
            heroDescription: `Browse ${manualService.categoryName.toLowerCase()} and hire verified professionals on ExtraHand.`,
            subcategories: [manualSubcategory],
         });
         return;
      }

      const existingSubcategorySlugs = new Set(
         (existingCategory.subcategories || []).map((sub) => {
            const subSlug = (sub.slug || "").trim();
            const prefix = `${manualService.categorySlug}/`;
            return subSlug.startsWith(prefix)
               ? subSlug.slice(prefix.length)
               : subSlug;
         })
      );

      if (!existingSubcategorySlugs.has(manualService.subcategorySlug)) {
         existingCategory.subcategories = [
            ...(existingCategory.subcategories || []),
            manualSubcategory,
         ];
      }
   });

   return Array.from(categoryMap.values());
}

function buildTopTaskers(serviceName: string): PosterTopTasker[] {
   return [
      {
         name: "Raju Kumar",
         location: "Hyderabad",
         rating: "4.8",
         reviewsCount: "46 reviews",
         latestReviewText: `Really happy with the ${serviceName.toLowerCase()}. Everything was organized clearly and on time.`,
         isVerified: true,
         isTopRated: true,
      },
      {
         name: "Ramesh",
         location: "Hyderabad",
         rating: "4.8",
         reviewsCount: "140 reviews",
         latestReviewText: `Great support and smooth process for ${serviceName.toLowerCase()}.`,
         isVerified: true,
      },
      {
         name: "Harish Kumar",
         location: "Hyderabad",
         rating: "4.9",
         reviewsCount: "118 reviews",
         latestReviewText: `Excellent service quality and communication throughout the ${serviceName.toLowerCase()} task.`,
         isVerified: true,
      },
      {
         name: "Sandeep Reddy",
         location: "Hyderabad",
         rating: "4.6",
         reviewsCount: "69 reviews",
         latestReviewText: "Very professional work with clear updates from start to finish.",
      },
   ];
}

function buildReviews(serviceName: string): PosterReview[] {
   return [
      {
         reviewerName: "Priya S",
         reviewerLocation: "Hyderabad, Telangana",
         jobType: serviceName,
         text: `Very professional ${serviceName.toLowerCase()} experience and excellent delivery quality.`,
         price: "₹1,200",
      },
      {
         reviewerName: "Rahul K",
         reviewerLocation: "Hyderabad, Telangana",
         jobType: serviceName,
         text: `Quick response and reliable outcome for my ${serviceName.toLowerCase()} requirement.`,
         price: "₹800",
      },
      {
         reviewerName: "Anita M",
         reviewerLocation: "Hyderabad, Telangana",
         jobType: serviceName,
         text: "Excellent support from start to finish. I would definitely book this service again.",
         price: "₹2,500",
      },
      {
         reviewerName: "Vikram P",
         reviewerLocation: "Hyderabad, Telangana",
         jobType: serviceName,
         text: "Above expectations and completed with strong attention to detail.",
         price: "₹950",
      },
   ];
}

function buildWhyBookFeatures(entry: ManualServiceEntry): PosterWhyBookFeature[] {
   return [
      {
         title: "Quick offers",
         description: "Post your task and receive offers from relevant professionals quickly.",
      },
      {
         title: "Stay insured",
         description: "All tasks are covered under platform protection policies.",
      },
      {
         title: "Choose your budget",
         description: "Set your budget and compare quotes before selecting an expert.",
      },
      {
         title: "Always protected",
         description: `Verified professionals for your ${entry.subcategoryName.toLowerCase()} needs.`,
      },
   ];
}

function buildQuestions(entry: ManualServiceEntry): Question[] {
   const faqFromEntry = entry.faq[0];

   return [
      {
         subtitle: faqFromEntry?.question || `What does ${entry.subcategoryName} include?`,
         description:
            faqFromEntry?.answer ||
            entry.longDescription,
      },
      {
         subtitle: `How does ${entry.subcategoryName.toLowerCase()} help me?`,
         description: entry.shortDescription,
      },
      {
         subtitle: `Why choose ExtraHand for ${entry.subcategoryName.toLowerCase()}?`,
         description: "You can compare offers, choose verified professionals, and book with confidence.",
      },
   ];
}

function buildWhatTheyDoSections(entry: ManualServiceEntry): PosterWhatTheyDoSection[] {
   return [
      {
         heading: "Professional service",
         body: entry.highlights[0] || entry.shortDescription,
      },
      {
         heading: "Quality results",
         body: entry.highlights[1] || entry.longDescription,
      },
      {
         heading: "Convenient experience",
         body: entry.highlights[2] || "Book easily, compare quotes, and get the task done with trusted professionals.",
      },
   ];
}

function buildStaticTasks(entry: ManualServiceEntry): PosterStaticTask[] {
   return entry.commonRequests.slice(0, 5).map((request, index) => ({
      title: request,
      price: `₹${1200 + index * 500}`,
      date: `${7 - index}th Feb 2026`,
      description: `Need help with ${request.toLowerCase()} for ${entry.subcategoryName.toLowerCase()}.`,
   }));
}

export function buildManualPosterCategoryDetail(
   entry: ManualServiceEntry
): PosterCategoryDetail {
   return {
      _id: `manual-detail-${entry.categorySlug}-${entry.subcategorySlug}`,
      name: entry.subcategoryName,
      slug: `${entry.categorySlug}/${entry.subcategorySlug}`,
      heroImage: entry.imagePath,
      heroTitle: entry.subcategoryName,
      heroDescription: entry.shortDescription,
      subcategories: [],

      // Fields consumed by poster layout sections
      categoryType: "poster",
      metaTitle: `${entry.subcategoryName} | ExtraHand Services`,
      metaDescription: entry.shortDescription,
      isPublished: true,
      reviewsCount: "11114+",
      topTaskers: buildTopTaskers(entry.subcategoryName),
      reviews: buildReviews(entry.subcategoryName),
      whyBookTitle: `Why hire ${entry.subcategoryName.toLowerCase()} near you through Extrahand?`,
      whyBookDescription: entry.longDescription,
      whyBookFeatures: buildWhyBookFeatures(entry),
      questionsTitle: `Top ${entry.subcategoryName} related questions`,
      questions: buildQuestions(entry),
      categoryServicesList: [...entry.highlights, "View more"],
      relatedServicesNearMe: [
         "Handyman near me",
         "Cleaning services near me",
         "Electricians near me",
         "Plumbers near me",
      ],
      topLocationsList: ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "View more"],
      relatedLocations: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "View more"],
      whatTheyDoTitle: `What does ${entry.subcategoryName.toLowerCase()} include?`,
      whatTheyDoSections: buildWhatTheyDoSections(entry),
      staticTasks: buildStaticTasks(entry),
      staticTasksSectionDescription: "Check out what tasks people want done near you right now...",

      posterCostTitle: `What's the average cost of a ${entry.subcategoryName.toLowerCase()}?`,
      posterCostLow: "1000",
      posterCostMedian: "2000",
      posterCostHigh: "3000",
      posterCostTasksCount: "50",
      posterAvgRating: "4.9",
      posterAvgReviewsCount: "50",
      posterRatingBreakdown: {
         fiveStar: 54,
         fourStar: 32,
         threeStar: 5,
         twoStar: 2,
         oneStar: 1,
      },
   } as PosterCategoryDetail;
}

export function buildManualPosterCategoryOverview(
   categorySlug: string
): PosterCategoryDetail | null {
   const services = getManualServicesByCategorySlug(categorySlug);

   if (services.length === 0) {
      return null;
   }

   const representative = services[0];

   return {
      ...buildManualPosterCategoryDetail(representative),
      _id: `manual-category-${representative.categorySlug}`,
      name: representative.categoryName,
      slug: representative.categorySlug,
      subcategories: services.map((s) => ({
         name: s.subcategoryName,
         slug: s.subcategorySlug,
      })),
      heroTitle: `Find ${representative.categoryName.toLowerCase()} near you`,
      heroDescription: `Browse ${representative.categoryName.toLowerCase()} and hire verified professionals on ExtraHand.`,
      whyBookTitle: `Why hire ${representative.categoryName.toLowerCase()} near you through Extrahand?`,
      questionsTitle: `Top ${representative.categoryName} related questions`,
      categoryServicesList: [...services.map((service) => service.subcategoryName), "View more"],
      whatTheyDoTitle: `What does ${representative.categoryName.toLowerCase()} include?`,
   } as PosterCategoryDetail;
}