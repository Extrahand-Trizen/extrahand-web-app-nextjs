import type { Task } from "@/types/task";

const TASK_CATEGORY_LABELS: Record<string, string> = {
   "home-cleaning": "Home Cleaning",
   "deep-cleaning": "Deep Cleaning",
   plumbing: "Plumbing",
   "water-tanker-services": "Water & Tanker Services",
   electrical: "Electrical",
   carpenter: "Carpenter",
   painting: "Painting",
   "ac-repair": "AC Repair & Service",
   "appliance-repair": "Appliance Repair",
   "pest-control": "Pest Control",
   "car-washing": "Car Washing / Car Cleaning",
   gardening: "Gardening",
   handyperson: "Handyperson / General Repairs",
   "furniture-assembly": "Furniture Assembly",
   "security-patrol": "Security Patrol / Watchman",
   security_patrol: "Security Patrol / Watchman",
   "beauty-services": "Beauty Services",
   beauticians: "Beauty Services",
   "massage-spa": "Massage / Spa",
   massage_spa: "Massage / Spa",
   "fitness-trainers": "Fitness Trainers",
   fitness: "Fitness Trainers",
   tutors: "Tutors",
   "it-support": "IT Support / Laptop Repair",
   "photographer-videographer": "Photographer / Videographer",
   "event-services": "Event Services",
   "pet-services": "Pet Services",
   "driver-chauffeur": "Driver / Chauffeur",
   "cooking-home-chef": "Cooking / Home Chef",
   "laundry-ironing": "Laundry / Ironing",
   "senior-care-elder-care": "Senior Care / Elder Care",
   senior_elder_care: "Senior Care / Elder Care",
   water_tanker_services: "Water & Tanker Services",
   other: "Other",
};

function humanizeCategory(value: string): string {
   const normalized = value.trim().replace(/[-_]+/g, " ").replace(/\s+/g, " ");

   if (!normalized) return "Uncategorized";

   return normalized
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}

export function getTaskCategoryLabel(
   taskOrCategory:
      | Pick<Task, "category" | "categoryLabel" | "subcategory">
      | string
      | null
      | undefined
): string {
   if (!taskOrCategory) {
      return "Uncategorized";
   }

   if (typeof taskOrCategory === "string") {
      const raw = taskOrCategory.trim();
      if (!raw) return "Uncategorized";

      const lookupKey = raw.toLowerCase();
      return TASK_CATEGORY_LABELS[lookupKey] || humanizeCategory(raw);
   }

   const categoryLabel = taskOrCategory.categoryLabel?.trim();
   if (categoryLabel) return categoryLabel;

   const subcategory = taskOrCategory.subcategory?.trim();
   if (subcategory) return subcategory;

   const category = taskOrCategory.category?.trim();
   if (!category) return "Uncategorized";

   const lookupKey = category.toLowerCase();
   return TASK_CATEGORY_LABELS[lookupKey] || humanizeCategory(category);
}
