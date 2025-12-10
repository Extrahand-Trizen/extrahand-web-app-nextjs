/**
 * City data for location pages
 * Centralized data for all supported cities
 */

export interface CityInfo {
   name: string;
   state: string;
   slug: string;
   description: string;
   longDescription: string;
   population: string;
   activeTasks: number;
   activeTaskers: number;
   avgRating: number;
   completedTasks: number;
   neighborhoods: string[];
   heroImage?: string;
   coordinates: {
      lat: number;
      lng: number;
   };
}

export const cities: Record<string, CityInfo> = {
   mumbai: {
      name: "Mumbai",
      state: "Maharashtra",
      slug: "mumbai",
      description:
         "India's financial capital with a vibrant community of skilled taskers ready to help with everything from home repairs to professional services.",
      longDescription:
         "ExtraHand is Mumbai's trusted platform for connecting people who need help with skilled and verified taskers ready to assist. Whether you're looking for home cleaning, furniture assembly, moving help, or professional services, our community of verified taskers in Mumbai is here to help.",
      population: "20M+",
      activeTasks: 1243,
      activeTaskers: 3567,
      avgRating: 4.8,
      completedTasks: 12450,
      neighborhoods: [
         "Andheri",
         "Bandra",
         "Powai",
         "Juhu",
         "Worli",
         "Colaba",
         "Malad",
         "Goregaon",
         "Borivali",
         "Kandivali",
         "Santacruz",
         "Kurla",
      ],
      heroImage: "/assets/cities/mumbai.png",
      coordinates: {
         lat: 19.076,
         lng: 72.8777,
      },
   },
   delhi: {
      name: "Delhi",
      state: "National Capital Territory",
      slug: "delhi",
      description:
         "The heart of India with thousands of verified taskers offering services across all categories in the capital region.",
      longDescription:
         "Delhi's premier on-demand services marketplace. From Connaught Place to Dwarka, ExtraHand connects you with local professionals across all neighborhoods in Delhi. Our platform makes it easy to post a task, receive competitive offers, and choose the perfect tasker for your needs.",
      population: "32M+",
      activeTasks: 2156,
      activeTaskers: 4821,
      avgRating: 4.7,
      completedTasks: 18920,
      neighborhoods: [
         "Connaught Place",
         "Saket",
         "Dwarka",
         "Rohini",
         "Lajpat Nagar",
         "Greater Kailash",
         "Vasant Kunj",
         "Nehru Place",
         "Karol Bagh",
         "Pitampura",
         "Janakpuri",
         "Mayur Vihar",
      ],
      heroImage: "/assets/cities/delhi.png",
      coordinates: {
         lat: 28.7041,
         lng: 77.1025,
      },
   },
   bangalore: {
      name: "Bangalore",
      state: "Karnataka",
      slug: "bangalore",
      description:
         "Tech hub of India with a growing community of professional taskers specializing in both tech and traditional services.",
      longDescription:
         "Bangalore's go-to platform for getting things done. Whether you need help with tech support, home services, or professional assistance, our community of verified taskers is ready to help. From Koramangala to Whitefield, find trusted help across all neighborhoods.",
      population: "13M+",
      activeTasks: 1876,
      activeTaskers: 4123,
      avgRating: 4.9,
      completedTasks: 15680,
      neighborhoods: [
         "Koramangala",
         "Indiranagar",
         "Whitefield",
         "HSR Layout",
         "Electronic City",
         "Jayanagar",
         "Marathahalli",
         "BTM Layout",
         "Bellandur",
         "Sarjapur Road",
         "JP Nagar",
         "Yelahanka",
      ],
      heroImage: "/assets/cities/bangalore.png",
      coordinates: {
         lat: 12.9716,
         lng: 77.5946,
      },
   },
   pune: {
      name: "Pune",
      state: "Maharashtra",
      slug: "pune",
      description:
         "Cultural capital with skilled professionals ready to assist with home services, tutoring, and business needs.",
      longDescription:
         "Pune's trusted services marketplace connecting you with skilled professionals. From Koregaon Park to Hinjewadi, our verified taskers are ready to help with everything from home maintenance to professional services. Experience the convenience of on-demand help.",
      population: "7M+",
      activeTasks: 892,
      activeTaskers: 2134,
      avgRating: 4.8,
      completedTasks: 8920,
      neighborhoods: [
         "Koregaon Park",
         "Hinjewadi",
         "Wakad",
         "Kothrud",
         "Viman Nagar",
         "Hadapsar",
         "Baner",
         "Aundh",
         "Pimpri",
         "Chinchwad",
         "Magarpatta",
         "Kharadi",
      ],
      heroImage: "/assets/cities/pune.png",
      coordinates: {
         lat: 18.5204,
         lng: 73.8567,
      },
   },
};

export const getCityBySlug = (slug: string): CityInfo | null => {
   return cities[slug.toLowerCase()] || null;
};

export const getAllCitySlugs = (): string[] => {
   return Object.keys(cities);
};
