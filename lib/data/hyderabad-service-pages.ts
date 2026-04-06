export interface HyderabadServicePage {
   slug: string;
   serviceName: string;
   shortDescription: string;
   heroDescription: string;
   whatYouGet: string[];
   commonNeeds: string[];
   faq: {
      question: string;
      answer: string;
   }[];
}

export const hyderabadServicePages: HyderabadServicePage[] = [
   {
      slug: "electrician-in-hyderabad",
      serviceName: "Electrician Services",
      shortDescription: "Book verified electricians in Hyderabad for repairs, fittings, and urgent electrical faults.",
      heroDescription: "Get safe and reliable electrical work in Hyderabad for homes, apartments, and offices.",
      whatYouGet: ["Switch and socket repair", "Fan and light installation", "MCB and wiring fault checks"],
      commonNeeds: ["Power tripping issues", "Fuse burn or sparking points", "New appliance wiring setup"],
      faq: [
         {
            question: "Do you handle emergency electrical issues?",
            answer: "Yes, you can request urgent electrician support for common residential electrical faults in Hyderabad.",
         },
      ],
   },
   {
      slug: "plumber-in-hyderabad",
      serviceName: "Plumber Services",
      shortDescription: "Find trusted plumbers in Hyderabad for leakage, fitting, blockage, and bathroom plumbing work.",
      heroDescription: "From small pipe leaks to complete fitting replacement, get dependable plumbing help near you.",
      whatYouGet: ["Tap and mixer repair", "Pipe leakage fixing", "Drain and sink blockage clearing"],
      commonNeeds: ["Low water pressure", "Bathroom fitting replacement", "Kitchen pipeline repair"],
      faq: [
         {
            question: "Can I book plumbing work for apartments?",
            answer: "Yes, plumbing services are available for apartments, independent homes, and commercial properties in Hyderabad.",
         },
      ],
   },
   {
      slug: "ac-repair-in-hyderabad",
      serviceName: "AC Repair Services",
      shortDescription: "Schedule AC repair in Hyderabad for cooling issues, gas refill support, and performance checks.",
      heroDescription: "Keep your room cool with professional AC diagnostics and repair by experienced technicians.",
      whatYouGet: ["Cooling issue diagnosis", "Gas pressure and airflow checks", "AC servicing and minor part replacement"],
      commonNeeds: ["AC not cooling", "Water leakage from indoor unit", "Unusual AC noise"],
      faq: [
         {
            question: "Do you service both split and window AC units?",
            answer: "Yes, technicians support common split and window AC models used in Hyderabad homes and offices.",
         },
      ],
   },
   {
      slug: "appliance-repair-in-hyderabad",
      serviceName: "Appliance Repair Services",
      shortDescription: "Book appliance repair in Hyderabad for common home appliances including microwave, refrigerator, washing machine, and dishwasher issues.",
      heroDescription: "Get doorstep appliance diagnostics and repair support from trusted technicians across Hyderabad.",
      whatYouGet: ["Issue diagnosis and troubleshooting", "Minor part replacement support", "Safety and performance checks"],
      commonNeeds: ["Appliance not starting", "Heating or cooling issues", "Abnormal noise or vibration"],
      faq: [
         {
            question: "Do you repair multiple appliances in one visit?",
            answer: "Yes, you can request inspection for multiple appliances and the scope is confirmed during booking.",
         },
      ],
   },
   {
      slug: "beauty-services-in-hyderabad",
      serviceName: "Beauty Services",
      shortDescription: "Book beauty services in Hyderabad for salon-at-home support including grooming, cleanup, and occasion-ready packages.",
      heroDescription: "Get convenient at-home beauty and grooming services from experienced professionals.",
      whatYouGet: ["At-home salon-style support", "Hygienic service setup", "Customized service options"],
      commonNeeds: ["Party or event grooming", "Routine skincare and cleanup", "Quick home salon booking"],
      faq: [
         {
            question: "Can I book beauty services for a specific time slot?",
            answer: "Yes, you can choose preferred slots based on availability in your Hyderabad location.",
         },
      ],
   },
   {
      slug: "car-washing-in-hyderabad",
      serviceName: "Car Washing and Cleaning Services",
      shortDescription: "Find car washing and car cleaning services in Hyderabad for interior cleaning, exterior wash, and detailing support.",
      heroDescription: "Keep your car fresh and road-ready with convenient cleaning and detailing services.",
      whatYouGet: ["Exterior foam wash support", "Interior vacuum and wipe-down", "Basic detailing and finishing"],
      commonNeeds: ["Weekend car cleaning", "Interior odor and dust cleanup", "Post-travel car wash"],
      faq: [
         {
            question: "Do you provide interior and exterior cleaning together?",
            answer: "Yes, combined interior and exterior car cleaning options are available.",
         },
      ],
   },
   {
      slug: "washing-machine-repair-in-hyderabad",
      serviceName: "Washing Machine Repair",
      shortDescription: "Get washing machine repair in Hyderabad for spin, drainage, motor, and control panel issues.",
      heroDescription: "Book doorstep washing machine support for quick troubleshooting and transparent repair recommendations.",
      whatYouGet: ["Drainage and spin issue checks", "Inlet and outlet troubleshooting", "Motor and drum diagnosis"],
      commonNeeds: ["Machine not starting", "Water not draining", "Excessive vibration during spin"],
      faq: [
         {
            question: "Are front-load and top-load machines covered?",
            answer: "Yes, repair support is available for both front-load and top-load washing machines.",
         },
      ],
   },
   {
      slug: "refrigerator-repair-in-hyderabad",
      serviceName: "Refrigerator Repair",
      shortDescription: "Book refrigerator repair in Hyderabad for cooling loss, noise, compressor, and leakage problems.",
      heroDescription: "Protect your food and reduce downtime with professional fridge diagnostics and timely repairs.",
      whatYouGet: ["Cooling performance checks", "Compressor and thermostat diagnosis", "Door seal and leakage inspection"],
      commonNeeds: ["Fridge not cooling", "Water leakage near unit", "Compressor making noise"],
      faq: [
         {
            question: "Can I get same-day refrigerator service?",
            answer: "Same-day slots are often available based on location and technician availability in Hyderabad.",
         },
      ],
   },
   {
      slug: "tv-repair-in-hyderabad",
      serviceName: "TV Repair Services",
      shortDescription: "Find TV repair experts in Hyderabad for display, sound, motherboard, and connectivity issues.",
      heroDescription: "Restore your television quickly with trained professionals for LED, LCD, and smart TV issues.",
      whatYouGet: ["Screen and panel issue diagnosis", "Audio and port troubleshooting", "Power supply and board checks"],
      commonNeeds: ["No display", "No sound output", "TV not powering on"],
      faq: [
         {
            question: "Do you support smart TV troubleshooting?",
            answer: "Yes, technicians can help with common smart TV issues including connectivity and boot problems.",
         },
      ],
   },
   {
      slug: "microwave-repair-in-hyderabad",
      serviceName: "Microwave Repair",
      shortDescription: "Book microwave repair in Hyderabad for heating, turntable, keypad, and power-related issues.",
      heroDescription: "Get safe and efficient microwave diagnostics and repair support at your doorstep.",
      whatYouGet: ["Heating performance testing", "Door and safety switch checks", "Control panel troubleshooting"],
      commonNeeds: ["Microwave not heating", "Turntable not rotating", "Sparking or burning smell"],
      faq: [
         {
            question: "Is microwave repair safe at home?",
            answer: "Technicians follow safety checks before and after service to ensure secure operation.",
         },
      ],
   },
   {
      slug: "geyser-repair-in-hyderabad",
      serviceName: "Geyser Repair",
      shortDescription: "Get geyser repair in Hyderabad for no-heating, leakage, thermostat, and pressure valve issues.",
      heroDescription: "Ensure steady hot water with reliable geyser maintenance and troubleshooting support.",
      whatYouGet: ["Heating element checks", "Thermostat and wiring inspection", "Leakage and valve assessment"],
      commonNeeds: ["No hot water", "Water leakage from tank", "Geyser trips power"],
      faq: [
         {
            question: "Do you service instant and storage geysers?",
            answer: "Yes, both instant and storage geyser models are supported.",
         },
      ],
   },
   {
      slug: "ro-water-purifier-repair-in-hyderabad",
      serviceName: "RO Water Purifier Repair",
      shortDescription: "Book RO purifier repair in Hyderabad for low flow, filter issues, leakage, and taste concerns.",
      heroDescription: "Maintain clean drinking water with regular RO diagnostics and repair from experienced technicians.",
      whatYouGet: ["Filter and membrane checks", "Flow and pressure diagnosis", "Leakage and connector repair"],
      commonNeeds: ["Low water output", "Unusual taste or odor", "Leakage from RO unit"],
      faq: [
         {
            question: "Can you help with periodic RO maintenance too?",
            answer: "Yes, you can book routine maintenance along with repair visits for better purifier performance.",
         },
      ],
   },
   {
      slug: "carpenter-in-hyderabad",
      serviceName: "Carpenter Services",
      shortDescription: "Find experienced carpenters in Hyderabad for furniture fixes, fittings, assembly, and polish work.",
      heroDescription: "Get precise woodwork support for everyday furniture repairs and home improvement needs.",
      whatYouGet: ["Furniture repair and hinge fixing", "Door and lock alignment", "Furniture assembly and installation"],
      commonNeeds: ["Loose cabinet doors", "Broken bed or table joints", "New shelf installation"],
      faq: [
         {
            question: "Do you provide on-site furniture assembly?",
            answer: "Yes, carpenters can assist with on-site assembly and basic customization work.",
         },
      ],
   },
   {
      slug: "home-cleaning-in-hyderabad",
      serviceName: "Home Cleaning Services",
      shortDescription: "Book complete home cleaning in Hyderabad for apartments, villas, and move-in or move-out needs.",
      heroDescription: "Refresh your living space with deep, hygienic cleaning delivered by trained cleaning professionals.",
      whatYouGet: ["Floor and surface deep cleaning", "Bedroom and living area sanitization", "Dust and stain removal support"],
      commonNeeds: ["Festive deep cleaning", "Move-in cleaning", "Post-renovation cleanup"],
      faq: [
         {
            question: "Can I choose full-home deep cleaning?",
            answer: "Yes, complete full-home packages are available based on property size and cleaning scope.",
         },
      ],
   },
   {
      slug: "deep-cleaning-in-hyderabad",
      serviceName: "Deep Cleaning Services",
      shortDescription: "Book deep cleaning in Hyderabad for kitchens, bathrooms, living spaces, and high-use surfaces.",
      heroDescription: "Restore cleanliness and hygiene with detailed deep-cleaning support for your home.",
      whatYouGet: ["Room-wise deep cleaning", "Stain and grime treatment", "Surface sanitization support"],
      commonNeeds: ["Festival deep cleaning", "Move-in or move-out cleaning", "Post-renovation cleanup"],
      faq: [
         {
            question: "How is deep cleaning different from regular cleaning?",
            answer: "Deep cleaning targets buildup and hard-to-reach areas beyond routine daily cleaning.",
         },
      ],
   },
   {
      slug: "sofa-cleaning-in-hyderabad",
      serviceName: "Sofa Cleaning",
      shortDescription: "Professional sofa cleaning in Hyderabad for stain removal, odor control, and fabric care.",
      heroDescription: "Bring back freshness to your sofa with material-safe cleaning techniques and quick drying.",
      whatYouGet: ["Dry and wet upholstery cleaning", "Stain and odor treatment", "Fabric-safe cleaning products"],
      commonNeeds: ["Food or drink stains", "Pet odor removal", "Routine fabric maintenance"],
      faq: [
         {
            question: "How long does sofa cleaning take to dry?",
            answer: "Dry time depends on material and method, but most sofas are ready within a few hours.",
         },
      ],
   },
   {
      slug: "bathroom-cleaning-in-hyderabad",
      serviceName: "Bathroom Cleaning",
      shortDescription: "Get bathroom deep cleaning in Hyderabad for tiles, fittings, stains, and hard-water deposits.",
      heroDescription: "Keep your bathroom hygienic and fresh with focused deep-cleaning and descaling services.",
      whatYouGet: ["Tile and floor descaling", "Commode and sink cleaning", "Fitting and glass area sanitization"],
      commonNeeds: ["Hard-water stains", "Soap and grime buildup", "Persistent foul smell"],
      faq: [
         {
            question: "Do you clean bathroom tiles and joints deeply?",
            answer: "Yes, deep cleaning includes attention to tile surfaces and visible grout areas.",
         },
      ],
   },
   {
      slug: "kitchen-cleaning-in-hyderabad",
      serviceName: "Kitchen Cleaning",
      shortDescription: "Book kitchen deep cleaning in Hyderabad for grease removal, cabinet cleaning, and chimney area support.",
      heroDescription: "Maintain a cleaner cooking space with targeted kitchen cleaning and sanitization.",
      whatYouGet: ["Countertop and slab degreasing", "Cabinet exterior cleaning", "Sink and backsplash deep cleaning"],
      commonNeeds: ["Oil and grease buildup", "Cabinet grime", "Post-party kitchen cleanup"],
      faq: [
         {
            question: "Can you handle heavy grease removal in kitchens?",
            answer: "Yes, kitchen deep cleaning is designed to tackle regular and heavy grease accumulation.",
         },
      ],
   },
   {
      slug: "pest-control-in-hyderabad",
      serviceName: "Pest Control Services",
      shortDescription: "Schedule pest control in Hyderabad for cockroaches, ants, termites, mosquitoes, and general pests.",
      heroDescription: "Protect your home or office with effective pest treatment plans and preventive guidance.",
      whatYouGet: ["Site inspection and treatment planning", "Targeted pest treatment", "Post-service preventive tips"],
      commonNeeds: ["Cockroach infestation", "Termite risk in woodwork", "Mosquito control in indoor areas"],
      faq: [
         {
            question: "Is pest control available for offices too?",
            answer: "Yes, services are available for both residential and commercial spaces.",
         },
      ],
   },
   {
      slug: "painting-services-in-hyderabad",
      serviceName: "Painting Services",
      shortDescription: "Find painting services in Hyderabad for interior walls, exterior surfaces, and touch-up work.",
      heroDescription: "Upgrade your space with clean, professional paint finishes for homes and offices.",
      whatYouGet: ["Wall preparation and primer support", "Interior and exterior painting", "Minor touch-up and patchwork"],
      commonNeeds: ["Home repainting", "Rental handover touch-up", "Single-room color refresh"],
      faq: [
         {
            question: "Can I get painting for only one room?",
            answer: "Yes, you can book painting support for single rooms or full-property projects.",
         },
      ],
   },
   {
      slug: "packers-and-movers-in-hyderabad",
      serviceName: "Packers and Movers",
      shortDescription: "Book packers and movers in Hyderabad for safe packing, loading, transport, and unloading support.",
      heroDescription: "Move your household goods safely with organized packing and relocation coordination.",
      whatYouGet: ["Packing material and handling", "Loading and transport support", "Unloading at destination"],
      commonNeeds: ["Flat-to-flat shifting", "Student relocation", "Family household move"],
      faq: [
         {
            question: "Do you provide packing material as part of service?",
            answer: "Yes, packing support typically includes required materials based on move size.",
         },
      ],
   },
   {
      slug: "house-shifting-in-hyderabad",
      serviceName: "House Shifting Services",
      shortDescription: "Plan stress-free house shifting in Hyderabad with local experts for packing and transport.",
      heroDescription: "Get end-to-end home relocation support for short-distance and city-wide moves.",
      whatYouGet: ["Home move planning", "Fragile-item packing support", "Local transport and unloading"],
      commonNeeds: ["Weekend house shifting", "Apartment society move", "Family relocation within Hyderabad"],
      faq: [
         {
            question: "Can I schedule house shifting on specific dates?",
            answer: "Yes, date-based scheduling is available, subject to provider availability.",
         },
      ],
   },
   {
      slug: "office-relocation-in-hyderabad",
      serviceName: "Office Relocation",
      shortDescription: "Get office relocation support in Hyderabad for desks, IT equipment, records, and setup coordination.",
      heroDescription: "Minimize business disruption with planned office shifting and organized move execution.",
      whatYouGet: ["Office packing and labeling", "Workstation and equipment movement", "Unload and setup assistance"],
      commonNeeds: ["Startup office move", "Branch relocation", "Floor-to-floor workspace shifting"],
      faq: [
         {
            question: "Can office relocation be done during non-working hours?",
            answer: "Yes, many moves can be scheduled during evenings or weekends to reduce downtime.",
         },
      ],
   },
   {
      slug: "home-chef-services-in-hyderabad",
      serviceName: "Cooking and Home Chef Services",
      shortDescription: "Book cooking and home chef services in Hyderabad for daily meals, special occasions, and customized menu support.",
      heroDescription: "Get experienced home chefs for convenient meal prep and event-based cooking at home.",
      whatYouGet: ["Home-cooked meal preparation", "Custom menu planning", "One-time or recurring chef support"],
      commonNeeds: ["Daily meal assistance", "Party or guest meal prep", "Special-diet cooking support"],
      faq: [
         {
            question: "Can I book a chef for one-time events?",
            answer: "Yes, one-time event and recurring home chef bookings are both available.",
         },
      ],
   },
   {
      slug: "driver-services-in-hyderabad",
      serviceName: "Driver and Chauffeur Services",
      shortDescription: "Hire driver services in Hyderabad for local travel, business commute, and personal chauffeur needs.",
      heroDescription: "Book reliable drivers for flexible city travel and scheduled rides across Hyderabad.",
      whatYouGet: ["On-demand driver booking", "Short and full-day options", "Professional local-route support"],
      commonNeeds: ["Daily office commute", "Airport pickup and drop", "Family travel assistance"],
      faq: [
         {
            question: "Can I book driver service for a full day?",
            answer: "Yes, part-day and full-day chauffeur options are available depending on requirement.",
         },
      ],
   },
   {
      slug: "event-services-in-hyderabad",
      serviceName: "Event Services",
      shortDescription: "Find event services in Hyderabad for catering, decor, DJ support, and small-to-medium event coordination.",
      heroDescription: "Plan smoother events with trusted professionals for setup, support, and service execution.",
      whatYouGet: ["Event requirement planning", "Vendor and setup coordination", "On-site service support"],
      commonNeeds: ["Birthday and family events", "Corporate gatherings", "Small venue celebrations"],
      faq: [
         {
            question: "Do you support small home events as well?",
            answer: "Yes, event support is available for both home and venue-based functions.",
         },
      ],
   },
   {
      slug: "fitness-trainers-in-hyderabad",
      serviceName: "Fitness Trainers",
      shortDescription: "Book fitness trainers in Hyderabad for personal training, weight goals, and home workout guidance.",
      heroDescription: "Reach your fitness goals with personalized coaching and structured training sessions.",
      whatYouGet: ["Personalized workout plans", "Goal-based fitness tracking", "Home and outdoor training options"],
      commonNeeds: ["Weight loss training", "Strength and conditioning", "Posture and mobility improvement"],
      faq: [
         {
            question: "Can beginners book personal trainers?",
            answer: "Yes, beginner-friendly training plans are available with progressive routines.",
         },
      ],
   },
   {
      slug: "furniture-assembly-in-hyderabad",
      serviceName: "Furniture Assembly Services",
      shortDescription: "Book furniture assembly in Hyderabad for beds, wardrobes, tables, workstations, and modular units.",
      heroDescription: "Get safe and precise furniture assembly support for home and office setups.",
      whatYouGet: ["Flat-pack furniture assembly", "Alignment and fitting support", "Basic hardware tightening and checks"],
      commonNeeds: ["New furniture setup", "Relocation reassembly", "Loose fitting corrections"],
      faq: [
         {
            question: "Can you assemble office furniture as well?",
            answer: "Yes, furniture assembly support is available for both residential and office requirements.",
         },
      ],
   },
   {
      slug: "cctv-installation-in-hyderabad",
      serviceName: "CCTV Installation Services",
      shortDescription: "Book CCTV installation in Hyderabad for homes, shops, offices, and gated communities.",
      heroDescription: "Improve safety with expert CCTV camera placement, setup, and connectivity support.",
      whatYouGet: ["Camera placement consultation", "CCTV setup and wiring support", "DVR and mobile-viewing configuration"],
      commonNeeds: ["Home entrance monitoring", "Shop floor surveillance", "Apartment common-area coverage"],
      faq: [
         {
            question: "Do you help configure mobile viewing for CCTV?",
            answer: "Yes, technicians can assist with basic app and remote viewing setup.",
         },
      ],
   },
];

export const hyderabadServicePageSlugs = hyderabadServicePages.map(
   (servicePage) => servicePage.slug
);

export function getHyderabadServicePageBySlug(slug: string) {
   return hyderabadServicePages.find((servicePage) => servicePage.slug === slug);
}