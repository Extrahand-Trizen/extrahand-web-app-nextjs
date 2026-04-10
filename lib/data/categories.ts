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

// Keep this list in sync with the "Select Category" list in Post a Task flow.
export const postTaskCategories: PostTaskCategory[] = [
   { id: "accounting", label: "Accounting" },
   { id: "ac-repair", label: "AC Repair & Service" },
   { id: "appliance-repair", label: "Appliance Repair" },
   { id: "beauty-services", label: "Beauty Services" },
   { id: "car-washing", label: "Car Washing / Car Cleaning" },
   { id: "carpenter", label: "Carpenter" },
   { id: "cooking-home-chef", label: "Cooking / Home Chef" },
   { id: "deep-cleaning", label: "Deep Cleaning" },
   { id: "driver-chauffeur", label: "Driver / Chauffeur" },
   { id: "electrical", label: "Electrical" },
   { id: "event-services", label: "Event Services" },
   { id: "fitness-trainers", label: "Fitness Trainers" },
   { id: "furniture-assembly", label: "Furniture Assembly" },
   { id: "gardening", label: "Gardening" },
   { id: "handyperson", label: "Handyperson / General Repairs" },
   { id: "home-cleaning", label: "Home Cleaning" },
   { id: "it-support", label: "IT Support / Laptop Repair" },
   { id: "laundry-ironing", label: "Laundry / Ironing" },
   { id: "massage-spa", label: "Massage / Spa" },
   { id: "other", label: "Other" },
   { id: "packers-movers", label: "Packers & Movers" },
   { id: "painting", label: "Painting" },
   { id: "pest-control", label: "Pest Control" },
   { id: "photographer-videographer", label: "Photographer / Videographer" },
   { id: "plumbing", label: "Plumbing" },
   { id: "senior-care-elder-care", label: "Senior Care / Elder Care" },
   { id: "security-patrol", label: "Security Patrol / Watchman" },
   { id: "tutors", label: "Tutors" },
   { id: "water-tanker-services", label: "Water & Tanker Services" },
];

export const serviceCategories: ServiceCategory[] = [
   {
      id: "accounting",
      name: "Accounting",
      description: "Accounting, bookkeeping, and tax services",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "ac-repair",
      name: "AC Repair & Service",
      description: "AC repair, servicing, and installation",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "appliance-repair",
      name: "Appliance Repair",
      description: "Repair and install home appliances",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "beauty-services",
      name: "Beauty Services",
      description: "Salon and beauty services at home",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "car-washing",
      name: "Car Washing / Car Cleaning",
      description: "Car wash and detailing services",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "carpenter",
      name: "Carpenter",
      description: "Woodwork, doors, and custom carpentry",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "cooking-home-chef",
      name: "Cooking / Home Chef",
      description: "Home chef and meal prep",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "deep-cleaning",
      name: "Deep Cleaning",
      description: "Intensive cleaning for kitchens, bathrooms, and more",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "driver-chauffeur",
      name: "Driver / Chauffeur",
      description: "Driver and chauffeur services",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "electrical",
      name: "Electrical",
      description: "Wiring, fixtures, and electrical repairs",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "event-services",
      name: "Event Services",
      description: "Catering, DJ, and event support",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "fitness-trainers",
      name: "Fitness Trainers",
      description: "Personal training and fitness coaching",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "furniture-assembly",
      name: "Furniture Assembly",
      description: "Assembly and installation of furniture",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "gardening",
      name: "Gardening",
      description: "Garden maintenance and landscaping",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "handyperson",
      name: "Handyperson / General Repairs",
      description: "General repairs and odd jobs",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "home-cleaning",
      name: "Home Cleaning",
      description: "Regular home cleaning and housekeeping",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "it-support",
      name: "IT Support",
      description: "Laptop, computer, and tech support",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "laundry-ironing",
      name: "Laundry / Ironing",
      description: "Laundry, ironing, and clothes care",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "massage-spa",
      name: "Massage / Spa",
      description: "Massage and spa services",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "other",
      name: "Other",
      description: "Custom or uncommon tasks",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "packers-movers",
      name: "Packers & Movers",
      description: "Home and office packing, moving, and relocation support",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "painting",
      name: "Painting",
      description: "Interior and exterior painting services",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "pest-control",
      name: "Pest Control",
      description: "Pest treatment and prevention",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "photographer-videographer",
      name: "Photographer / Videographer",
      description: "Photography and video services",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "plumbing",
      name: "Plumbing",
      description: "Repairs, fittings, and leak fixes",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "senior-care-elder-care",
      name: "Senior Care / Elder Care",
      description: "Compassionate assistance and companionship for seniors",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "security-patrol",
      name: "Security Patrol / Watchman",
      description: "Security guard and watchman services",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "tutors",
      name: "Tutors",
      description: "Home and online tutoring",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "pet-services",
      name: "Pet Services",
      description: "Pet walking, grooming, and care",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
   {
      id: "water-tanker-services",
      name: "Water & Tanker Services",
      description: "Water supply, tankers, and bulk delivery",
      icon: "",
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
   },
];

export const getCategoryById = (id: string): ServiceCategory | undefined => {
   return serviceCategories.find((cat) => cat.id === id);
};

export const getFeaturedCategories = (limit: number = 6): ServiceCategory[] => {
   return serviceCategories.slice(0, limit);
};
