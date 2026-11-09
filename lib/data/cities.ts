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

   mahabubnagar: {
      name: "Mahabubnagar",
      state: "Telangana",
      slug: "mahabubnagar",
      description:
         "Find trusted local helpers in Mahabubnagar for home repairs, cleaning, moving, and everyday services.",
      longDescription:
         "ExtraHand connects Mahabubnagar residents with local professionals for home maintenance, cleaning, moving, and other everyday services.",
      population: "0.2M+",
      activeTasks: 180,
      activeTaskers: 420,
      avgRating: 4.6,
      completedTasks: 1560,
      neighborhoods: [
         "New Town",
         "Old Town",
         "Badepally",
         "Mettugadda",
         "Ramanpally",
         "Boyapally",
         "Yenugonda",
         "Palakonda",
      ],
      heroImage: "/assets/cities/mahabubnagar.jpg",
      coordinates: {
         lat: 16.737,
         lng: 78.009,
      },
   },

   siddipet: {
      name: "Siddipet",
      state: "Telangana",
      slug: "siddipet",
      description:
         "Connect with local helpers in Siddipet for home services, repairs, cleaning, moving, and more.",
      longDescription:
         "ExtraHand helps Siddipet residents find local professionals for home repairs, cleaning, moving, and a wide range of everyday tasks.",
      population: "0.1M+",
      activeTasks: 140,
      activeTaskers: 310,
      avgRating: 4.6,
      completedTasks: 1180,
      neighborhoods: [
         "Old Bus Stand",
         "New Bus Stand",
         "Komati Cheruvu",
         "Raghavendra Nagar",
         "Gajwel Road",
         "Hyderabad Road",
         "Medak Road",
         "Ponnala",
      ],
      heroImage: "/assets/cities/siddipet.jpg",
      coordinates: {
         lat: 18.1048,
         lng: 78.852,
      },
   },

   warangal: {
      name: "Warangal",
      state: "Telangana",
      slug: "warangal",
      description:
         "Find trusted local helpers in Warangal for home repairs, cleaning, moving, and everyday services.",
      longDescription:
         "ExtraHand helps Warangal residents connect with local professionals for home maintenance, cleaning, moving, and other everyday tasks.",
      population: "0.8M+",
      activeTasks: 320,
      activeTaskers: 760,
      avgRating: 4.6,
      completedTasks: 2840,
      neighborhoods: [
         "Hanamkonda",
         "Kazipet",
         "Subedari",
         "Nakkalagutta",
         "Lashkar Bazar",
         "Kakatiya University",
         "Enumamula",
         "Warangal Fort",
      ],
      coordinates: {
         lat: 17.9689,
         lng: 79.5941,
      },
   },

   karimnagar: {
      name: "Karimnagar",
      state: "Telangana",
      slug: "karimnagar",
      description:
         "Connect with local helpers in Karimnagar for home services, repairs, cleaning, moving, and more.",
      longDescription:
         "ExtraHand connects Karimnagar residents with local professionals for home repairs, cleaning, moving, and a wide range of everyday services.",
      population: "0.3M+",
      activeTasks: 210,
      activeTaskers: 490,
      avgRating: 4.6,
      completedTasks: 1760,
      neighborhoods: [
         "Mukarampura",
         "Kothirampur",
         "Mankammathota",
         "Ramnagar",
         "Jyothinagar",
         "Rekurthi",
         "Alugunur",
         "Sai Nagar",
      ],
      coordinates: {
         lat: 18.4386,
         lng: 79.1288,
      },
   },

   nalgonda: {
      name: "Nalgonda",
      state: "Telangana",
      slug: "nalgonda",
      description:
         "Find reliable local helpers in Nalgonda for repairs, cleaning, moving, and everyday tasks.",
      longDescription:
         "ExtraHand helps Nalgonda residents find local professionals for home maintenance, cleaning, moving, and other everyday services.",
      population: "0.2M+",
      activeTasks: 150,
      activeTaskers: 360,
      avgRating: 4.6,
      completedTasks: 1260,
      neighborhoods: [
         "Clock Tower",
         "Panagallu",
         "Marriguda",
         "NG College Road",
         "Devarakonda Road",
         "Miryalaguda Road",
         "Cherlapally",
         "SLBC Colony",
      ],
      coordinates: {
         lat: 17.0575,
         lng: 79.269,
      },
   },

   nizamabad: {
      name: "Nizamabad",
      state: "Telangana",
      slug: "nizamabad",
      description:
         "Get help with home services, repairs, cleaning, and moving from local professionals in Nizamabad.",
      longDescription:
         "ExtraHand connects Nizamabad residents with trusted local professionals for home maintenance and everyday tasks.",
      population: "0.3M+",
      activeTasks: 220,
      activeTaskers: 510,
      avgRating: 4.6,
      completedTasks: 1840,
      neighborhoods: [
         "Khaleelwadi",
         "Vinayak Nagar",
         "Kanteshwar",
         "Bodhan Road",
         "Arsapally",
         "Yellammagutta",
         "Auto Nagar",
         "Mubarak Nagar",
      ],
      coordinates: {
         lat: 18.6725,
         lng: 78.0941,
      },
   },

   wanaparthy: {
      name: "Wanaparthy",
      state: "Telangana",
      slug: "wanaparthy",
      description:
         "Find local helpers in Wanaparthy for home repairs, cleaning, moving, and everyday services.",
      longDescription:
         "ExtraHand helps Wanaparthy residents connect with local professionals for home maintenance and a wide range of everyday tasks.",
      population: "0.1M+",
      activeTasks: 90,
      activeTaskers: 210,
      avgRating: 4.6,
      completedTasks: 720,
      neighborhoods: [
         "Rajanagar",
         "Kothakota Road",
         "Pebbair Road",
         "Raghavendra Colony",
         "Market Yard",
         "Chityala",
         "Gopalpet",
         "Madanapur",
      ],
      coordinates: {
         lat: 16.3623,
         lng: 78.0622,
      },
   },

   sircilla: {
      name: "Sircilla",
      state: "Telangana",
      slug: "sircilla",
      description:
         "Connect with local helpers in Sircilla for home services, repairs, cleaning, moving, and more.",
      longDescription:
         "ExtraHand connects Sircilla residents with local professionals for home repairs, cleaning, moving, and everyday services.",
      population: "0.1M+",
      activeTasks: 100,
      activeTaskers: 240,
      avgRating: 4.6,
      completedTasks: 840,
      neighborhoods: [
         "Vemulawada Road",
         "Gandhi Nagar",
         "Nehru Nagar",
         "Shanti Nagar",
         "Sardar Nagar",
         "B.Y. Nagar",
         "Mustabad Road",
         "Textile Park",
      ],
      coordinates: {
         lat: 18.3886,
         lng: 78.8105,
      },
   },

   jadcherla: {
      name: "Jadcherla",
      state: "Telangana",
      slug: "jadcherla",
      description:
         "Find trusted local helpers in Jadcherla for repairs, cleaning, moving, and everyday tasks.",
      longDescription:
         "ExtraHand helps Jadcherla residents find local professionals for home maintenance, cleaning, moving, and other everyday services.",
      population: "0.1M+",
      activeTasks: 80,
      activeTaskers: 190,
      avgRating: 4.6,
      completedTasks: 640,
      neighborhoods: [
         "Jadcherla Town",
         "Hanuman Temple Road",
         "Nethaji Nagar",
         "Shadnagar Road",
         "Hyderabad-Bangalore Highway",
         "Dhanwada Road",
         "Gollapally",
         "Gangapur",
      ],
      coordinates: {
         lat: 16.7692,
         lng: 78.1365,
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
