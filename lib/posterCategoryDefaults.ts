/**
 * Default/dummy data for poster category pages (Services / "As A Poster").
 * Used so all poster sections render even when API returns empty.
 */

export const DEFAULT_TOP_TASKERS = [
  { name: "Priya S", location: "Mumbai, Maharashtra", rating: "4.9", reviewsCount: "(203)", tasksCount: "312 tasks", priceLabel: "From ₹1,200", latestReviewText: "Very professional and delivered exactly what we needed.", isVerified: true, isTopRated: true, profileImage: "" },
  { name: "Rahul K", location: "Delhi NCR", rating: "5.0", reviewsCount: "(156)", tasksCount: "189 tasks", priceLabel: "From ₹800", latestReviewText: "Quick response and great quality work. Highly recommend!", isVerified: true, isTopRated: false, profileImage: "" },
  { name: "Anita M", location: "Bangalore, Karnataka", rating: "4.8", reviewsCount: "(94)", tasksCount: "127 tasks", priceLabel: "From ₹2,500", latestReviewText: "Excellent service from start to finish. Punctual and skilled.", isVerified: false, isTopRated: true, profileImage: "" },
  { name: "Vikram P", location: "Chennai, Tamil Nadu", rating: "5.0", reviewsCount: "(267)", tasksCount: "341 tasks", priceLabel: "From ₹950", latestReviewText: "Above and beyond what we expected. Five stars!", isVerified: true, isTopRated: true, profileImage: "" },
  { name: "Sneha R", location: "Pune, Maharashtra", rating: "4.9", reviewsCount: "(88)", tasksCount: "112 tasks", priceLabel: "From ₹1,100", latestReviewText: "Reliable and trustworthy. Great attention to detail.", isVerified: true, isTopRated: true, profileImage: "" },
  { name: "Arjun D", location: "Hyderabad, Telangana", rating: "4.7", reviewsCount: "(134)", tasksCount: "198 tasks", priceLabel: "From ₹900", latestReviewText: "Very helpful and knew what to do straight away.", isVerified: false, isTopRated: true, profileImage: "" },
  { name: "Kavita N", location: "Kolkata, West Bengal", rating: "5.0", reviewsCount: "(72)", tasksCount: "95 tasks", priceLabel: "From ₹1,350", latestReviewText: "Outstanding work. Will definitely book again.", isVerified: true, isTopRated: false, profileImage: "" },
  { name: "Rohan M", location: "Ahmedabad, Gujarat", rating: "4.8", reviewsCount: "(119)", tasksCount: "156 tasks", priceLabel: "From ₹850", latestReviewText: "Professional and efficient. Highly satisfied.", isVerified: true, isTopRated: true, profileImage: "" },
];

export const DEFAULT_REVIEWS = [
  { reviewerName: "Priya S", reviewerLocation: "Mumbai", price: "₹1,200", text: "Very professional and delivered exactly what we needed. Would definitely hire again!", jobType: "Home service" },
  { reviewerName: "Rahul K", reviewerLocation: "Delhi NCR", price: "₹800", text: "Quick response and great quality work. Highly recommend.", jobType: "Repair" },
  { reviewerName: "Anita M", reviewerLocation: "Bangalore", price: "₹2,500", text: "Excellent service from start to finish. The expert was punctual and very skilled.", jobType: "Consultation" },
  { reviewerName: "Vikram P", reviewerLocation: "Chennai", price: "₹950", text: "Above and beyond what we expected. Problem solved in no time.", jobType: "Installation" },
  { reviewerName: "Sneha R", reviewerLocation: "Pune", price: "₹1,500", text: "Reliable and trustworthy. Completed the task with great attention to detail.", jobType: "Maintenance" },
  { reviewerName: "Arjun D", reviewerLocation: "Hyderabad", price: "₹1,100", text: "Very helpful and knew what to do straight away. Will book again.", jobType: "Support" },
];

export const DEFAULT_WHY_BOOK_FEATURES = [
  { title: "Quick offers", description: "Get offers from skilled professionals quickly. Post your task and receive quotes in minutes." },
  { title: "Stay insured", description: "All services are covered by Extrahand's insurance policies for your peace of mind." },
  { title: "Choose your budget", description: "Set your budget and compare offers. Pick the best professional for your needs." },
  { title: "Always protected", description: "Secure payments and verified professionals. Your task is in safe hands." },
];

export const DEFAULT_QUESTIONS = [
  { subtitle: "How do I book a service?", description: "Post your task with a short description, set your budget, and receive offers from qualified professionals. Choose the one that fits best and get it done." },
  { subtitle: "What types of services can I get?", description: "You can find professionals for a wide range of tasks—from repairs and installations to consultations and ongoing support. Just describe what you need." },
  { subtitle: "How much does it cost?", description: "Costs vary by task and professional. You can set a budget when posting, and compare quotes from different experts to find the right fit." },
];

export const DEFAULT_CATEGORY_SERVICES = ["General consultation", "Repair and maintenance", "Installation", "Inspection", "Emergency call-out", "Follow-up support"];

export const DEFAULT_RELATED_SERVICES = ["Handyman near me", "Cleaning services near me", "Electricians near me", "Plumbers near me"];

export const DEFAULT_TOP_LOCATIONS = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad"];

export const DEFAULT_RELATED_LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"];

export const DEFAULT_WHAT_THEY_DO_SECTIONS = [
  { heading: "Professional service", body: "You get skilled professionals who deliver quality work. They come prepared with the right tools and expertise." },
  { heading: "Quality results", body: "Service providers on Extrahand are rated by customers. You can choose based on reviews and past work." },
  { heading: "Convenient experience", body: "Book from home, set your schedule, and get the job done without the hassle. Many services can be done at your location." },
];

export const DEFAULT_STATIC_TASKS = [
  { title: "Assembly of BBQ", price: "₹1,200", location: "Mumbai, Maharashtra 400001", date: "7th Feb 2026", description: "Assembly of charcoal BBQ. Need it done by this weekend.", profileImage: "", rating: "4.9" },
  { title: "Furniture assembly", price: "₹2,500", location: "Delhi NCR", date: "6th Feb 2026", description: "Would be great if this task can be done this afternoon from 2:00 PM onwards.", profileImage: "", rating: "5.0" },
  { title: "IKEA shelves and cabinet", price: "₹1,800", location: "Bangalore, Karnataka", date: "5th Feb 2026", description: "Need IKEA shelves and a small cabinet assembled. Tools provided.", profileImage: "", rating: "4.8" },
  { title: "Wardrobe assembly", price: "₹3,000", location: "Pune, Maharashtra", date: "4th Feb 2026", description: "Two wardrobes to be assembled. Experienced person preferred.", profileImage: "", rating: "4.9" },
  { title: "Office desk setup", price: "₹1,500", location: "Hyderabad, Telangana", date: "3rd Feb 2026", description: "Desk and monitor stand assembly. Quick turnaround needed.", profileImage: "", rating: "5.0" },
];

export const DEFAULT_FOOTER = {
  discoverHeading: "Discover",
  discoverLinks: ["How it works", "Earn money", "Search tasks", "Cost Guides", "Service Guides"],
  companyHeading: "Company",
  companyLinks: ["About us", "Careers", "Terms and Conditions", "Privacy policy", "Contact us"],
  existingMembersHeading: "Existing Members",
  existingMembersLinks: ["Post a task", "Browse tasks", "Login", "Support centre"],
  popularCategoriesHeading: "Popular Categories",
  popularCategoriesLinks: ["Handyman Services", "Cleaning Services", "Delivery Services", "All Services"],
  popularLocationsHeading: "Popular Locations",
  popularLocations: ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune"],
  copyrightText: "Extrahand Limited 2011-2025 ©, All rights reserved",
};
