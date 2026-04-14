/**
 * Service categories data
 * Used across the application for task categorization
 */

export interface ServiceCategory {
   id: string;
   name: string;
   description: string;
   icon: string;
   gradient: string;
   image?: string;
   popularTasks?: string[];
   avgPrice?: string;
}

export interface PostTaskCategory {
   id: string;
   label: string;
}

/** Top-level categories for Post a Task (must match keys in `postTaskSubcategories`). */
export const postTaskCategories: PostTaskCategory[] = [
   { id: "it-computer-support", label: "IT & Computer Support" },
   { id: "design", label: "Design" },
   { id: "events", label: "Events" },
   { id: "repair-maintenance", label: "Repair & Maintenance" },
   { id: "personal-lifestyle", label: "Personal & Lifestyle Services" },
   { id: "care-services", label: "Care Services" },
   { id: "education-training", label: "Education & Training" },
   { id: "professional-services", label: "Professional Services" },
   { id: "other", label: "Other" },
];

/**
 * Subcategory options per Post a Task category (display strings stored as task.subcategory).
 */
export const postTaskSubcategories: Record<string, string[]> = {
   "it-computer-support": [
      "Laptop Repair",
      "Desktop Repair",
      "Slow Performance Fix",
      "Virus / Malware Removal",
      "WiFi Setup",
      "Router Installation",
      "OS Installation",
      "Software Installation",
      "Data Backup & Recovery",
      "Office IT Setup",
      "AMC (Annual Maintenance)",
      "Server Setup",
   ],
   design: [
      "Logo Design",
      "Graphic Design",
      "UI/UX Design",
      "Branding Design",
      "Poster & Flyer Design",
      "Social Media Creatives",
      "Brochure Design",
      "Business Card Design",
      "Packaging Design",
      "Illustration",
      "3D Modelling & Rendering",
      "Animation & Motion Graphics",
      "Landing Page Design",
   ],
   events: [
      "Birthday Party Organizer",
      "Wedding Planning & Coordination",
      "Engagement / Ring Ceremony Planning",
      "Housewarming (Griha Pravesh) Setup",
      "Anniversary Celebration Setup",
      "Festival Decoration (Diwali, Sankranti, etc.)",
      "Corporate Event Management",
      "College / Farewell Event Planning",
      "Balloon Decoration",
      "Flower Decoration",
      "Photography & Videography for Events",
      "Event Catering Coordination",
      "DJ & Music Setup",
      "Live Performers / Anchors",
      "Event Helpers & Staff",
      "Event Setup & Cleaning",
   ],
   "repair-maintenance": [
      "Carpenter",
      "Furniture Repair",
      "Furniture Assembly",
      "Appliance Repair",
      "Electronic Repair",
      "Locksmith",
      "Glaziers",
      "Windows & Doors",
   ],
   "personal-lifestyle": [
      "Beauty Services",
      "Massage / Spa",
      "Fitness Trainers",
      "Hairdressers",
      "Makeup Artist",
      "Health & Wellness",
   ],
   "care-services": [
      "Senior Care / Elder Care",
      "Childcare & Babysitting",
      "Pet Care Services",
      "Dog Care",
      "Cat Care",
   ],
   "education-training": [
      "Tutors",
      "Coaching",
      "Dance Lessons",
      "Music Lessons",
      "Fitness Coaching",
   ],
   "professional-services": [
      "Accounting",
      "Legal Services",
      "Real Estate",
      "Business Consulting",
   ],
   other: [],
};

const defaultGradient = "from-slate-500 via-gray-500 to-zinc-500";

export const serviceCategories: ServiceCategory[] = postTaskCategories
   .filter((c) => c.id !== "other")
   .map((c) => ({
      id: c.id,
      name: c.label,
      description: `${c.label} tasks on ExtraHand`,
      icon: "",
      gradient: defaultGradient,
   }))
   .concat([
      {
         id: "other",
         name: "Other",
         description: "Custom or uncommon tasks",
         icon: "",
         gradient: defaultGradient,
      },
   ]);

export const getCategoryById = (id: string): ServiceCategory | undefined => {
   return serviceCategories.find((cat) => cat.id === id);
};

export const getFeaturedCategories = (limit: number = 6): ServiceCategory[] => {
   return serviceCategories.slice(0, limit);
};
