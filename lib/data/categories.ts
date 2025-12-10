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

export const serviceCategories: ServiceCategory[] = [
   {
      id: "cleaning",
      name: "Cleaning",
      description: "Home, office, and deep cleaning services",
      icon: "🧹",
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      image: "/assets/mobilescreens/cleaning.png",
      popularTasks: [
         "House Cleaning",
         "Office Cleaning",
         "Deep Cleaning",
         "Move-in/out Cleaning",
      ],
      avgPrice: "₹500 - ₹2000",
   },
   {
      id: "handyperson",
      name: "Handyperson",
      description: "Home repairs and maintenance",
      icon: "🔧",
      gradient: "from-orange-500 via-red-500 to-pink-500",
      image: "/assets/mobilescreens/handy.png",
      popularTasks: [
         "Furniture Assembly",
         "Picture Hanging",
         "Minor Repairs",
         "Installation",
      ],
      avgPrice: "₹300 - ₹1500",
   },
   {
      id: "moving",
      name: "Moving & Delivery",
      description: "Packing, moving, and delivery help",
      icon: "📦",
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      image: "/assets/mobilescreens/moving.png",
      popularTasks: [
         "Home Moving",
         "Furniture Moving",
         "Pickup & Delivery",
         "Packing Help",
      ],
      avgPrice: "₹800 - ₹5000",
   },
   {
      id: "gardening",
      name: "Gardening",
      description: "Garden maintenance and landscaping",
      icon: "🌱",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      image: "/assets/mobilescreens/garden.png",
      popularTasks: ["Lawn Mowing", "Weeding", "Garden Cleanup", "Plant Care"],
      avgPrice: "₹400 - ₹2000",
   },
   {
      id: "business",
      name: "Business Services",
      description: "Admin, accounting, and business support",
      icon: "💼",
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      image: "/assets/mobilescreens/business.png",
      popularTasks: [
         "Data Entry",
         "Bookkeeping",
         "Admin Support",
         "Document Preparation",
      ],
      avgPrice: "₹500 - ₹3000",
   },
   {
      id: "marketing",
      name: "Marketing & Design",
      description: "Digital marketing and creative services",
      icon: "📱",
      gradient: "from-pink-500 via-purple-500 to-indigo-500",
      image: "/assets/mobilescreens/marketing.png",
      popularTasks: [
         "Social Media Help",
         "Website Updates",
         "Graphic Design",
         "Content Writing",
      ],
      avgPrice: "₹1000 - ₹5000",
   },
   {
      id: "tech",
      name: "Tech Support",
      description: "Computer and device help",
      icon: "💻",
      gradient: "from-blue-600 via-cyan-500 to-teal-500",
      popularTasks: [
         "Computer Repair",
         "Software Installation",
         "Tech Setup",
         "Troubleshooting",
      ],
      avgPrice: "₹500 - ₹3000",
   },
   {
      id: "tutoring",
      name: "Tutoring",
      description: "Academic and skill tutoring",
      icon: "📚",
      gradient: "from-amber-500 via-orange-500 to-red-500",
      popularTasks: [
         "School Tutoring",
         "Language Lessons",
         "Music Lessons",
         "Exam Prep",
      ],
      avgPrice: "₹400 - ₹2000",
   },
   {
      id: "photography",
      name: "Photography",
      description: "Event and product photography",
      icon: "📷",
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      popularTasks: [
         "Event Photography",
         "Product Photos",
         "Portrait Sessions",
         "Photo Editing",
      ],
      avgPrice: "₹2000 - ₹10000",
   },
   {
      id: "beauty",
      name: "Beauty & Wellness",
      description: "Personal care and wellness services",
      icon: "💅",
      gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
      popularTasks: ["Hair Styling", "Makeup", "Massage", "Personal Training"],
      avgPrice: "₹500 - ₹3000",
   },
   {
      id: "pet-care",
      name: "Pet Care",
      description: "Pet sitting and care services",
      icon: "🐕",
      gradient: "from-yellow-500 via-amber-500 to-orange-500",
      popularTasks: [
         "Dog Walking",
         "Pet Sitting",
         "Pet Grooming",
         "Vet Visits",
      ],
      avgPrice: "₹300 - ₹1500",
   },
   {
      id: "events",
      name: "Events & Entertainment",
      description: "Event planning and entertainment",
      icon: "🎉",
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      popularTasks: [
         "Event Planning",
         "DJ Services",
         "Catering Help",
         "Party Setup",
      ],
      avgPrice: "₹3000 - ₹15000",
   },
];

export const getCategoryById = (id: string): ServiceCategory | undefined => {
   return serviceCategories.find((cat) => cat.id === id);
};

export const getFeaturedCategories = (limit: number = 6): ServiceCategory[] => {
   return serviceCategories.slice(0, limit);
};
