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
         "India's financial capital with a vibrant community of skilled helpers ready to help across home and professional services.",
      longDescription:
         "ExtraHand is Mumbai's trusted platform for getting things done. From Andheri to Colaba, connect with verified local helpers for home services, moving, cleaning, assembly, and professional work.",
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
      heroImage: "/assets/cities/mumbai.webp",
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
         "The capital region with thousands of verified helpers offering services across every major category.",
      longDescription:
         "Delhi’s premier on-demand services marketplace. From Connaught Place to Dwarka, ExtraHand helps you find reliable local professionals quickly and easily.",
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
      heroImage: "/assets/cities/delhi.webp",
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
         "India’s tech capital with skilled helpers specializing in both tech and home services.",
      longDescription:
         "Bangalore’s go-to platform for getting things done. From Koramangala to Whitefield, connect with verified helpers for tech support, home services, and professional help.",
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
      heroImage: "/assets/cities/bangalore.webp",
      coordinates: {
         lat: 12.9716,
         lng: 77.5946,
      },
   },

   kolkata: {
      name: "Kolkata",
      state: "West Bengal",
      slug: "kolkata",
      description:
         "A cultural and commercial hub with trusted helpers for home and professional services.",
      longDescription:
         "Kolkata’s on-demand services marketplace. From Salt Lake to South Kolkata, ExtraHand connects you with verified local helpers for cleaning, repairs, moving, and business services.",
      population: "15M+",
      activeTasks: 1045,
      activeTaskers: 2680,
      avgRating: 4.6,
      completedTasks: 9630,
      neighborhoods: [
         "Salt Lake",
         "New Town",
         "Park Street",
         "Ballygunge",
         "Garia",
         "Behala",
         "Dum Dum",
         "Howrah",
         "Tollygunge",
         "Kasba",
         "Jadavpur",
         "Alipore",
      ],
      heroImage: "/assets/cities/kolkata.webp",
      coordinates: {
         lat: 22.5726,
         lng: 88.3639,
      },
   },

   chennai: {
      name: "Chennai",
      state: "Tamil Nadu",
      slug: "chennai",
      description:
         "A major metro with reliable helpers offering home, tech, and professional services.",
      longDescription:
         "Chennai’s trusted marketplace for on-demand help. From Adyar to Velachery, find skilled and verified helpers for home maintenance, moving, cleaning, and more.",
      population: "11M+",
      activeTasks: 1320,
      activeTaskers: 2985,
      avgRating: 4.7,
      completedTasks: 11840,
      neighborhoods: [
         "Adyar",
         "Velachery",
         "Anna Nagar",
         "T Nagar",
         "Tambaram",
         "OMR",
         "Porur",
         "Guindy",
         "Mylapore",
         "Perungudi",
         "Ambattur",
         "Chromepet",
      ],
      heroImage: "/assets/cities/chennai.webp",
      coordinates: {
         lat: 13.0827,
         lng: 80.2707,
      },
   },

   hyderabad: {
      name: "Hyderabad",
      state: "Telangana",
      slug: "hyderabad",
      description:
         "A fast-growing tech and business hub with skilled, verified helpers across the city.",
      longDescription:
         "Hyderabad’s trusted on-demand services marketplace. From HITEC City to Secunderabad, ExtraHand connects you with experienced professionals for every kind of task.",
      population: "10M+",
      activeTasks: 1640,
      activeTaskers: 3560,
      avgRating: 4.6,
      completedTasks: 14230,
      neighborhoods: [
         "HITEC City",
         "Gachibowli",
         "Madhapur",
         "Kondapur",
         "Banjara Hills",
         "Jubilee Hills",
         "Secunderabad",
         "Begumpet",
         "Ameerpet",
         "Kukatpally",
         "Miyapur",
         "Uppal",
      ],
      heroImage: "/assets/cities/hyderabad.webp",
      coordinates: {
         lat: 17.385,
         lng: 78.4867,
      },
   },

   pune: {
      name: "Pune",
      state: "Maharashtra",
      slug: "pune",
      description:
         "A growing metro with skilled professionals for home, business, and personal services.",
      longDescription:
         "Pune’s trusted services marketplace. From Hinjewadi to Koregaon Park, connect with verified helpers ready to help with everything from home maintenance to professional work.",
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
      heroImage: "/assets/cities/pune.webp",
      coordinates: {
         lat: 18.5204,
         lng: 73.8567,
      },
   },

   ahmedabad: {
      name: "Ahmedabad",
      state: "Gujarat",
      slug: "ahmedabad",
      description:
         "A major commercial center with reliable helpers for home and business services.",
      longDescription:
         "Ahmedabad’s on-demand services platform connecting you with verified local helpers. From SG Highway to Maninagar, get help with home services, moving, and professional tasks.",
      population: "9M+",
      activeTasks: 760,
      activeTaskers: 1890,
      avgRating: 4.6,
      completedTasks: 7025,
      neighborhoods: [
         "SG Highway",
         "Navrangpura",
         "Satellite",
         "Bopal",
         "Maninagar",
         "Vastrapur",
         "Paldi",
         "Chandkheda",
         "Ghatlodia",
         "Naroda",
         "Thaltej",
         "Prahlad Nagar",
      ],
      heroImage: "/assets/cities/ahmedabad.webp",
      coordinates: {
         lat: 23.0225,
         lng: 72.5714,
      },
   },
};

export const getCityBySlug = (slug: string): CityInfo | null => {
   return cities[slug.toLowerCase()] || null;
};

export const getAllCitySlugs = (): string[] => {
   return Object.keys(cities);
};
