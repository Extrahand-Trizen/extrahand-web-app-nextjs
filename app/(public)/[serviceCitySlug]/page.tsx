import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
   getHyderabadServicePageBySlug,
   type HyderabadServicePage,
   hyderabadServicePageSlugs,
} from "@/lib/data/hyderabad-service-pages";

interface ServiceCityPageProps {
   params: Promise<{ serviceCitySlug: string }>;
}

interface ServicePageEnhancement {
   imagePath: string;
   overview: string;
   bestFor: string;
   serviceDeepDive: string;
   prepTips: string[];
   postServiceTips: string[];
   secondFaq: {
      question: string;
      answer: string;
   };
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://extrahand.in";

const hyderabadAreas = [
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
];

function toAreaSlug(area: string) {
   return area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const servicePageEnhancements: Record<string, ServicePageEnhancement> = {
   "electrician-in-hyderabad": {
      imagePath: "/assets/mobilescreens/electrical.webp",
      overview: "From minor fixture replacements to load-balancing checks, Hyderabad households and offices use this service for safe, standards-driven electrical work with clear issue diagnosis before repair.",
      bestFor: "Homes facing repeated power trips, old switchboard issues, or new appliance wiring needs.",
      serviceDeepDive: "Electrical service quality depends on safe diagnosis, correct load handling, and durable component selection. For Hyderabad homes, this often includes balancing modern appliance usage with older wiring points in apartments and independent houses.",
      prepTips: ["Keep a list of faulty points and rooms", "Share timings of repeated tripping", "Keep access clear near switchboards and distribution points"],
      postServiceTips: ["Avoid overloading repaired points", "Monitor any repeated tripping for 24 hours", "Schedule periodic wiring checks in older properties"],
      secondFaq: {
         question: "Do technicians carry basic electrical parts?",
         answer: "Yes, most visits include common consumables for quick fixes, and larger replacements are recommended after inspection.",
      },
   },
   "plumber-in-hyderabad": {
      imagePath: "/assets/mobilescreens/plumbing.webp",
      overview: "Plumbing support covers kitchens, bathrooms, utility lines, and pressure concerns with practical solutions that prevent recurring leaks and avoid unnecessary wall or floor damage.",
      bestFor: "Leakage complaints, blocked drains, low pressure lines, and fitting replacements.",
      serviceDeepDive: "Plumbing outcomes improve when root-cause diagnosis is done before repair, especially for hidden leakage and pressure imbalance. Good service combines immediate fixes with preventive recommendations to reduce future water damage.",
      prepTips: ["Note all leakage points and timings", "Keep sink and pipeline areas accessible", "Share if low pressure is floor-specific"],
      postServiceTips: ["Check repaired joints after first full water cycle", "Avoid harsh chemicals in drains", "Plan periodic fitting inspection"],
      secondFaq: {
         question: "Can the service include both repair and replacement?",
         answer: "Yes, technicians can repair existing fittings or suggest replacements if components are heavily worn.",
      },
   },
   "ac-repair-in-hyderabad": {
      imagePath: "/assets/mobilescreens/tech.webp",
      overview: "AC service requests in Hyderabad often need cooling restoration, airflow optimization, and preventive checks to reduce electricity waste during peak summer usage.",
      bestFor: "Split or window AC units with cooling drops, leakage, noise, or recurring shutdowns.",
      serviceDeepDive: "AC reliability in Hyderabad weather depends on airflow efficiency, cooling balance, and regular preventive servicing. A detailed inspection helps identify whether issues are due to filters, airflow blockages, or deeper component faults.",
      prepTips: ["Share last service date", "Report cooling pattern by room", "Keep indoor and outdoor unit access available"],
      postServiceTips: ["Run test cooling for 20 to 30 minutes", "Clean filters periodically", "Schedule pre-summer servicing"],
      secondFaq: {
         question: "Will performance checks include airflow and cooling output?",
         answer: "Yes, technicians evaluate cooling behavior and airflow before recommending service actions.",
      },
   },
   "washing-machine-repair-in-hyderabad": {
      imagePath: "/assets/mobilescreens/work.webp",
      overview: "This service focuses on spin, drum, water inlet, and drainage issues so daily laundry cycles are restored with minimal downtime and clear part-level diagnosis.",
      bestFor: "Machines that stop mid-cycle, do not drain, or show vibration and noise spikes.",
      serviceDeepDive: "Washing machine performance is best restored through complete cycle-based testing, not single-point checks. This includes load balance, water flow, drum behavior, and control response across wash and spin modes.",
      prepTips: ["Keep machine area dry and accessible", "Share error codes if displayed", "Describe when the failure happens in cycle"],
      postServiceTips: ["Run one trial cycle before heavy loads", "Avoid overloading drum", "Clean lint and filter areas regularly"],
      secondFaq: {
         question: "Do you inspect both electrical and mechanical causes?",
         answer: "Yes, troubleshooting includes motor, control, drainage, and connection-level checks.",
      },
   },
   "refrigerator-repair-in-hyderabad": {
      imagePath: "/assets/mobilescreens/tech.webp",
      overview: "Refrigerator support is tailored to preserve cooling consistency and food safety by addressing compressor behavior, thermostat mismatch, and seal-related losses.",
      bestFor: "Fridges with cooling inconsistency, unusual sounds, leakage, or frequent restart cycles.",
      serviceDeepDive: "Refrigerator service quality depends on cooling stability across both compartments and proper sealing efficiency. Detailed diagnosis prevents food spoilage by resolving intermittent faults before they become major failures.",
      prepTips: ["Share if issue is freezer-only or full unit", "Clear space near refrigerator vents", "Mention unusual noise timings"],
      postServiceTips: ["Allow unit to stabilize after service", "Avoid frequent door opening initially", "Maintain regular condenser cleaning"],
      secondFaq: {
         question: "Can you diagnose freezer and fresh-food section imbalance?",
         answer: "Yes, service checks cover compartment-level cooling behavior and likely failure points.",
      },
   },
   "tv-repair-in-hyderabad": {
      imagePath: "/assets/mosted-booked-services/tv-mounting.webp",
      overview: "TV repair assistance handles display, audio, power, and connectivity problems across popular LED and smart TV models used in Hyderabad homes.",
      bestFor: "Blank screens, boot loops, audio failure, HDMI/port issues, and power faults.",
      serviceDeepDive: "TV service works best with symptom-based diagnosis across screen, board, and connectivity layers. Accurate issue mapping reduces repeat visits and helps restore consistent viewing quality.",
      prepTips: ["Note exact symptoms and frequency", "Keep remote and connected devices ready", "Ensure wall-unit cable access"],
      postServiceTips: ["Test all ports after service", "Use surge protection for stable power", "Keep firmware and app setup updated"],
      secondFaq: {
         question: "Is wall-mounted TV troubleshooting also supported?",
         answer: "Yes, technicians can diagnose mounted units and inspect cable and port access during service.",
      },
   },
   "microwave-repair-in-hyderabad": {
      imagePath: "/assets/mobilescreens/tech.webp",
      overview: "Microwave repair prioritizes safe operation, stable heating output, and reliable controls so routine cooking is not disrupted by unpredictable appliance behavior.",
      bestFor: "Microwaves with heating failure, keypad errors, turntable issues, or safety concerns.",
      serviceDeepDive: "Microwave repair requires both safety and performance validation. A complete check ensures heating consistency, control reliability, and operational safety before normal kitchen use resumes.",
      prepTips: ["Describe exact heating issue", "Keep oven cavity clean for inspection", "Share if sparking occurs with specific utensils"],
      postServiceTips: ["Run brief test cycles initially", "Avoid unsuitable containers", "Follow safe usage and cleaning routine"],
      secondFaq: {
         question: "Will safety checks be done after the repair?",
         answer: "Yes, post-repair checks are done to confirm safe and stable microwave operation.",
      },
   },
   "geyser-repair-in-hyderabad": {
      imagePath: "/assets/mobilescreens/electrical.webp",
      overview: "Geyser service helps restore safe hot-water output through element testing, thermostat checks, and leakage control, especially in high-usage family homes.",
      bestFor: "Units not heating water properly, leaking, or causing frequent electrical trips.",
      serviceDeepDive: "Geyser reliability depends on heating element health, thermostat response, and pressure control. Structured servicing prevents sudden failures and improves daily hot-water consistency.",
      prepTips: ["Share if issue is intermittent or constant", "Keep geyser installation area accessible", "Mention power tripping pattern"],
      postServiceTips: ["Observe heating time after service", "Avoid extreme thermostat settings", "Plan periodic tank and element checks"],
      secondFaq: {
         question: "Can the technician check pressure valve and thermostat together?",
         answer: "Yes, both controls are inspected as part of routine geyser troubleshooting.",
      },
   },
   "ro-water-purifier-repair-in-hyderabad": {
      imagePath: "/assets/mobilescreens/plumbing.webp",
      overview: "RO purifier support is designed for Hyderabad water conditions, covering flow correction, leakage repairs, and consumable health checks for reliable drinking water.",
      bestFor: "Low-flow systems, leakage, filter warnings, and quality or taste complaints.",
      serviceDeepDive: "RO performance is closely linked to feed-water conditions, membrane health, and timely consumable replacement. Proper diagnostics help maintain safe water quality and steady output.",
      prepTips: ["Share filter change history", "Describe taste or odor changes", "Keep purifier and inlet area accessible"],
      postServiceTips: ["Discard initial flush water if advised", "Track output flow weekly", "Follow preventive maintenance schedule"],
      secondFaq: {
         question: "Do you guide on filter replacement timing?",
         answer: "Yes, technicians provide maintenance guidance based on usage and purifier condition.",
      },
   },
   "carpenter-in-hyderabad": {
      imagePath: "/assets/mobilescreens/handy.webp",
      overview: "Carpentry work covers functional repairs and utility upgrades, from cabinet alignment to furniture assembly and practical woodwork improvements.",
      bestFor: "Loose fittings, damaged furniture joints, shelf installations, and door alignment problems.",
      serviceDeepDive: "Good carpentry service combines structural repair with finish quality. Whether the need is maintenance or installation, precise measurements and stable fitting are key to long-lasting results.",
      prepTips: ["List furniture and fittings to be repaired", "Share measurements for new installations", "Clear nearby area for tool movement"],
      postServiceTips: ["Avoid immediate load on new fittings", "Check hinge and alignment after first day", "Plan periodic tightening for heavy-use units"],
      secondFaq: {
         question: "Can I request both repair and installation in one visit?",
         answer: "Yes, combined carpentry tasks can be planned in a single scheduled service slot.",
      },
   },
   "home-cleaning-in-hyderabad": {
      imagePath: "/assets/mobilescreens/cleaning.webp",
      overview: "Full-home cleaning emphasizes deep hygiene, dust reduction, and surface care for apartments and villas preparing for occupancy, events, or routine maintenance.",
      bestFor: "Seasonal deep cleaning, move-in readiness, and complete post-renovation cleanup.",
      serviceDeepDive: "Home cleaning quality improves with area-wise planning and material-safe methods. Deep cleaning helps remove hidden dust and accumulated grime from high-use zones and difficult corners.",
      prepTips: ["Highlight priority rooms and problem spots", "Set aside fragile or personal items", "Ensure water and power availability"],
      postServiceTips: ["Allow surfaces to dry fully", "Ventilate cleaned areas", "Maintain weekly light-clean routine"],
      secondFaq: {
         question: "Can large homes be covered in one session?",
         answer: "Yes, cleaning teams are allocated based on home size and job scope.",
      },
   },
   "sofa-cleaning-in-hyderabad": {
      imagePath: "/assets/mosted-booked-services/homeclean.webp",
      overview: "Sofa cleaning improves upholstery hygiene through targeted stain treatment, odor control, and fabric-safe methods that preserve comfort and finish.",
      bestFor: "Homes with visible stains, pet odor, heavy usage marks, and periodic hygiene cleaning needs.",
      serviceDeepDive: "Sofa cleaning effectiveness depends on upholstery type, stain profile, and cleaning method suitability. Controlled treatment helps refresh fabric look while protecting texture and comfort.",
      prepTips: ["Share fabric type if known", "Point out old and fresh stains separately", "Keep seating area clear for access"],
      postServiceTips: ["Allow full drying before use", "Vacuum regularly to reduce dust", "Use fabric-safe maintenance products"],
      secondFaq: {
         question: "Do you support different sofa fabrics?",
         answer: "Yes, cleaning methods are selected based on upholstery material and condition.",
      },
   },
   "bathroom-cleaning-in-hyderabad": {
      imagePath: "/assets/mobilescreens/cleaning.webp",
      overview: "Bathroom deep cleaning targets hard-water deposits, scale, and hygiene-sensitive surfaces to improve freshness, look, and day-to-day usability.",
      bestFor: "Bathrooms with scaling, stains, odor, or persistent soap and mineral buildup.",
      serviceDeepDive: "Bathroom cleaning is most effective when descaling and sanitation are done together. This restores hygiene and improves finish quality across tiles, fittings, and moisture-prone areas.",
      prepTips: ["Mention major stain or scale zones", "Keep cleaning chemicals or preferences ready", "Ensure uninterrupted water for cleaning"],
      postServiceTips: ["Keep area ventilated after cleaning", "Use mild cleaners for daily upkeep", "Address new stains early"],
      secondFaq: {
         question: "Are fixtures and glass partitions included?",
         answer: "Yes, service usually includes fittings and exposed glass surfaces as part of deep cleaning.",
      },
   },
   "kitchen-cleaning-in-hyderabad": {
      imagePath: "/assets/mobilescreens/cleaning.webp",
      overview: "Kitchen cleaning focuses on grease-heavy zones, utility surfaces, and frequently touched areas to restore hygiene and improve cooking-space comfort.",
      bestFor: "Homes with grease buildup, frequent cooking residue, and pre-event kitchen cleanup needs.",
      serviceDeepDive: "Kitchen deep cleaning requires targeted degreasing and surface-safe treatment for counters, utility zones, and frequently touched sections. Proper cleaning improves hygiene and supports easier daily maintenance.",
      prepTips: ["Identify heavy grease hotspots", "Clear countertop appliances where possible", "Separate food items before cleaning"],
      postServiceTips: ["Wipe oil-prone areas regularly", "Use ventilation while cooking", "Schedule periodic deep cleaning"],
      secondFaq: {
         question: "Can deep cleaning include sink and counter detailing?",
         answer: "Yes, sink, counter, and backsplash detailing are covered in the standard kitchen scope.",
      },
   },
   "pest-control-in-hyderabad": {
      imagePath: "/assets/images/home.webp",
      overview: "Pest treatment combines inspection and targeted application to address active infestations and reduce repeat activity in residential and office environments.",
      bestFor: "Recurring cockroach, ant, termite, and mosquito concerns in homes or commercial spaces.",
      serviceDeepDive: "Effective pest control is built on accurate infestation mapping and targeted treatment. When combined with preventive steps, it reduces recurrence and improves indoor hygiene confidence.",
      prepTips: ["Share pest activity zones and timing", "Keep food and utensils covered", "Follow pre-service instructions for children and pets"],
      postServiceTips: ["Follow advised waiting period", "Maintain dry and clean corners", "Schedule follow-up treatment if suggested"],
      secondFaq: {
         question: "Is preventive pest treatment available?",
         answer: "Yes, preventive service plans can be selected for periodic pest risk management.",
      },
   },
   "painting-services-in-hyderabad": {
      imagePath: "/assets/mobilescreens/painting.webp",
      overview: "Painting support includes surface preparation, clean execution, and finish consistency for interior refreshes, exterior touchups, and selective repaint work.",
      bestFor: "Room refreshes, rental handovers, and full-house repainting projects.",
      serviceDeepDive: "Painting quality relies on proper surface preparation and finish planning. Whether for aesthetic upgrades or maintenance, well-executed painting improves appearance and protects wall surfaces for longer.",
      prepTips: ["Share preferred colors and finish type", "Point out dampness or crack-prone areas", "Clear movable furniture from painting zones"],
      postServiceTips: ["Allow curing time before heavy wall contact", "Maintain ventilation during drying", "Keep touch-up references for future maintenance"],
      secondFaq: {
         question: "Do you support both fresh paint and repaint jobs?",
         answer: "Yes, teams handle first-time painting and repainting with prep recommendations.",
      },
   },
   "packers-and-movers-in-hyderabad": {
      imagePath: "/assets/mobilescreens/moving.webp",
      overview: "Packers and movers support safe packing, loading logistics, and controlled transport so fragile and high-use household items are shifted with care.",
      bestFor: "Families and individuals planning local moves with complete packing support.",
      serviceDeepDive: "Packers and movers service quality depends on packing discipline, loading order, and handling precision. Proper planning reduces breakage risk and keeps relocation timelines predictable.",
      prepTips: ["Prepare item inventory by room", "Mark fragile and high-value boxes", "Confirm pickup and drop access details"],
      postServiceTips: ["Unpack essentials first", "Check fragile items on arrival", "Keep labels until full setup is complete"],
      secondFaq: {
         question: "Can fragile electronics be packed separately?",
         answer: "Yes, delicate items can be packed with additional handling measures when requested.",
      },
   },
   "house-shifting-in-hyderabad": {
      imagePath: "/assets/mobilescreens/moving.webp",
      overview: "House shifting assistance is built for end-to-end residential relocation, including route planning, safe handling, and coordinated unloading.",
      bestFor: "Apartment-to-apartment or villa relocations within Hyderabad.",
      serviceDeepDive: "House shifting outcomes improve when packing, loading, transit, and unloading are coordinated as one workflow. This helps avoid delays and reduces handling risk for high-use household items.",
      prepTips: ["Create room-wise packing checklist", "Plan elevator and parking permissions", "Separate essentials bag for first day"],
      postServiceTips: ["Prioritize setup of kitchen and sleeping area", "Inspect large furniture after placement", "Retain packing list till complete unpacking"],
      secondFaq: {
         question: "Can I choose weekend house shifting slots?",
         answer: "Yes, weekend scheduling is available based on booking demand and crew availability.",
      },
   },
   "office-relocation-in-hyderabad": {
      imagePath: "/assets/images/office.webp",
      overview: "Office relocation services are structured for business continuity, with careful movement of furniture, equipment, and operational essentials.",
      bestFor: "Startups, teams, and businesses planning branch or floor-level office movement.",
      serviceDeepDive: "Office relocation is most effective when workstation movement, equipment handling, and sequencing are planned to minimize operational downtime and maintain business continuity.",
      prepTips: ["Prepare department-wise move plan", "Label equipment and cables clearly", "Confirm building access and shift windows"],
      postServiceTips: ["Validate workstation and network setup", "Track moved assets against inventory", "Plan phased stabilization if needed"],
      secondFaq: {
         question: "Can office relocation be phased department-wise?",
         answer: "Yes, multi-stage relocation can be planned to reduce operational disruption.",
      },
   },
   "appliance-repair-in-hyderabad": {
      imagePath: "https://www.zuper.co/wp-content/uploads/2023/11/Blog-Feature-Image-Appliance-repair.webp",
      overview: "Appliance repair support covers common home devices with practical diagnostics and clear recommendations.",
      bestFor: "Households facing appliance faults, sudden shutdowns, and recurring performance issues.",
      serviceDeepDive: "Appliance reliability improves when diagnosis checks both electrical and mechanical causes before replacement decisions.",
      prepTips: ["Share appliance model and issue details", "Mention when the fault usually occurs", "Keep appliance access area clear"],
      postServiceTips: ["Run a short test cycle after repair", "Use the appliance as advised", "Schedule periodic maintenance checks"],
      secondFaq: {
         question: "Can multiple appliances be checked in one booking?",
         answer: "Yes, multiple appliance checks can be planned in one visit based on service scope.",
      },
   },
   "beauty-services-in-hyderabad": {
      imagePath: "https://charmssalon.in/wp-content/uploads/2024/09/beautician-with-brush-applies-white-moisturizing-mask-face-young-girl-client-spa-beauty-salon-scaled.jpg",
      overview: "Beauty services are tailored for at-home convenience with hygienic setup and flexible slot availability.",
      bestFor: "Users looking for home salon support, event grooming, and regular personal care sessions.",
      serviceDeepDive: "At-home beauty service quality depends on hygienic practices, product suitability, and clear service customization before the session.",
      prepTips: ["Share preferred services in advance", "Keep a clean, well-lit setup area", "Mention any skin sensitivity upfront"],
      postServiceTips: ["Follow after-care guidance provided", "Use recommended products for maintenance", "Book routine sessions based on your schedule"],
      secondFaq: {
         question: "Can I book beauty services for events at home?",
         answer: "Yes, event-focused beauty and grooming sessions can be booked based on availability.",
      },
   },
   "car-washing-in-hyderabad": {
      imagePath: "https://img.freepik.com/free-photo/professional-washer-blue-uniform-washing-luxury-car-with-water-gun-open-air-car-wash_496169-333.jpg?semt=ais_hybrid&w=740&q=80",
      overview: "Car washing services provide practical cleaning support for routine upkeep and appearance maintenance.",
      bestFor: "Cars needing interior cleanup, exterior wash, and periodic detailing support.",
      serviceDeepDive: "Good car cleaning combines exterior treatment and interior hygiene with attention to high-touch and dust-prone areas.",
      prepTips: ["Remove valuable items from the vehicle", "Share preferred cleaning type", "Confirm wash location access"],
      postServiceTips: ["Avoid immediate dusty parking after wash", "Use periodic interior wipe-down", "Schedule regular wash intervals"],
      secondFaq: {
         question: "Are interior and exterior cleaning both available?",
         answer: "Yes, combined interior and exterior cleaning options are available.",
      },
   },
   "deep-cleaning-in-hyderabad": {
      imagePath: "/assets/mobilescreens/cleaning.webp",
      overview: "Deep cleaning covers high-use rooms and difficult corners for better hygiene and comfort.",
      bestFor: "Homes preparing for festivals, move-ins, or periodic full-space hygiene resets.",
      serviceDeepDive: "Deep cleaning outcomes improve with room-wise planning and targeted treatment of buildup zones.",
      prepTips: ["Share priority rooms and concern spots", "Keep fragile items aside", "Ensure water and power availability"],
      postServiceTips: ["Allow cleaned surfaces to dry", "Ventilate rooms after service", "Maintain with weekly light cleaning"],
      secondFaq: {
         question: "Can deep cleaning be booked for selected rooms only?",
         answer: "Yes, you can request room-specific deep cleaning based on your requirement.",
      },
   },
   "home-chef-services-in-hyderabad": {
      imagePath: "https://www.staffingattiffanies.com/wp-content/uploads/2022/05/chef-in-restaurant-kitchen-cooking.jpg",
      overview: "Home chef services support daily meal prep and occasion-based cooking with menu flexibility.",
      bestFor: "Families, working professionals, and events that need convenient cooking assistance.",
      serviceDeepDive: "Home chef experiences are best when dietary needs, cuisine preferences, and kitchen setup are discussed in advance.",
      prepTips: ["Share menu and diet preferences", "Confirm ingredient availability", "Keep kitchen workspace ready"],
      postServiceTips: ["Store prepared food as advised", "Plan upcoming meals in advance", "Maintain kitchen hygiene between sessions"],
      secondFaq: {
         question: "Can I book one-time and recurring chef services?",
         answer: "Yes, both one-time and recurring home chef options are available.",
      },
   },
   "driver-services-in-hyderabad": {
      imagePath: "/assets/mobilescreens/delivery.webp",
      overview: "Driver services are suited for flexible city travel, office commutes, and daily mobility support.",
      bestFor: "Users needing part-day, full-day, or schedule-based chauffeur assistance.",
      serviceDeepDive: "Reliable driver support depends on clear route planning, time scheduling, and requirement communication before pickup.",
      prepTips: ["Share trip plan and duration", "Mention pickup and drop constraints", "Confirm any route preferences"],
      postServiceTips: ["Review trip details at completion", "Save preferred schedules for repeat booking", "Book early during peak hours"],
      secondFaq: {
         question: "Can I book a driver for an entire day?",
         answer: "Yes, full-day and custom-duration driver slots are available based on requirement.",
      },
   },
   "event-services-in-hyderabad": {
      imagePath: "https://4.imimg.com/data4/VH/CO/MY-19253486/event-management-services.jpg",
      overview: "Event services help with setup, coordination, and execution for smoother gatherings.",
      bestFor: "Home functions, celebrations, and corporate gatherings requiring support teams.",
      serviceDeepDive: "Event quality improves when roles, timelines, and setup requirements are finalized before the event day.",
      prepTips: ["Share event date and expected guest count", "List required support services", "Confirm venue access and setup time"],
      postServiceTips: ["Review service outcomes with providers", "Capture feedback for future events", "Store contact details for repeat bookings"],
      secondFaq: {
         question: "Can event services be customized by event size?",
         answer: "Yes, service scope is tailored to event size and support needs.",
      },
   },
   "fitness-trainers-in-hyderabad": {
      imagePath: "https://www.embodyfitnessatx.com/wp-content/uploads/sites/70/2022/12/Personal-Training.jpg",
      overview: "Fitness training support includes structured coaching plans for strength, weight, and consistency goals.",
      bestFor: "Beginners and regular trainees looking for goal-based personal guidance.",
      serviceDeepDive: "Training outcomes improve with personalized routines, progressive load plans, and periodic progress checks.",
      prepTips: ["Share your current fitness level", "Mention goals and health constraints", "Keep a safe workout space ready"],
      postServiceTips: ["Track sessions and consistency", "Follow warm-up and recovery routine", "Adjust plan periodically with trainer input"],
      secondFaq: {
         question: "Are beginner fitness plans available?",
         answer: "Yes, beginner-friendly plans are included with gradual progression.",
      },
   },
   "furniture-assembly-in-hyderabad": {
      imagePath: "/assets/mobilescreens/furniture.webp",
      overview: "Furniture assembly services focus on stable fitting, alignment, and safe setup at home or office.",
      bestFor: "Flat-pack furniture setup, relocation reassembly, and fixing loose assembled units.",
      serviceDeepDive: "Furniture assembly quality depends on measurement accuracy, component fitting, and hardware tightening for long-term stability.",
      prepTips: ["Keep all assembly parts ready", "Share furniture model details", "Clear enough space for assembly work"],
      postServiceTips: ["Avoid heavy load immediately", "Recheck hinges and bolts after first use", "Schedule periodic tightening for heavy-use units"],
      secondFaq: {
         question: "Can both home and office furniture be assembled?",
         answer: "Yes, assembly support is available for both residential and office furniture.",
      },
   },
   "cctv-installation-in-hyderabad": {
      imagePath: "/assets/mobilescreens/mounting.webp",
      overview: "CCTV setup focuses on practical camera placement, stable wiring, and visibility optimization for homes, stores, and office premises.",
      bestFor: "Properties requiring entrance monitoring, indoor surveillance, and remote-viewing setup.",
      serviceDeepDive: "CCTV effectiveness depends on placement logic, field-of-view planning, and stable connectivity. Proper installation improves usable coverage and helps avoid blind spots.",
      prepTips: ["List priority monitoring points", "Share day/night coverage expectations", "Keep router and power points accessible"],
      postServiceTips: ["Verify recording and playback settings", "Test remote viewing on phone", "Plan periodic camera and storage checks"],
      secondFaq: {
         question: "Can technicians suggest camera placement before installation?",
         answer: "Yes, placement planning is part of setup to improve practical coverage.",
      },
   },
};

function getServicePageEnhancement(servicePage: HyderabadServicePage): ServicePageEnhancement {
   const explicitEnhancement = servicePageEnhancements[servicePage.slug];

   if (explicitEnhancement) {
      return explicitEnhancement;
   }

   return {
      imagePath: "/assets/images/default.webp",
      overview: `${servicePage.serviceName} in Hyderabad is tailored for local needs with quick booking and dependable service support.`,
      bestFor: servicePage.commonNeeds[0] || `Common ${servicePage.serviceName.toLowerCase()} requests in Hyderabad.`,
      serviceDeepDive: `This service focuses on practical diagnosis, quality execution, and clear next steps so users can get reliable outcomes for ${servicePage.serviceName.toLowerCase()} requirements.`,
      prepTips: [
         `Share specific details about your ${servicePage.serviceName.toLowerCase()} requirement before booking.`,
         "Keep the work area accessible for faster assessment.",
         "Mention any urgency, preferred timing, or prior issues to help with planning.",
      ],
      postServiceTips: [
         "Follow the professional's care instructions after service completion.",
         "Track performance for the first 24 to 48 hours and report recurring issues.",
         "Plan periodic maintenance to keep service outcomes consistent.",
      ],
      secondFaq: {
         question: `Can I request this ${servicePage.serviceName.toLowerCase()} service in my Hyderabad area?`,
         answer: "Yes, service availability covers major Hyderabad neighborhoods and nearby localities based on provider slots.",
      },
   };
}

function getAreaSlice(slug: string) {
   const sum = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
   const start = sum % hyderabadAreas.length;
   const selected = new Set<string>();

   for (let i = 0; i < 6; i += 1) {
      selected.add(hyderabadAreas[(start + i) % hyderabadAreas.length]);
   }

   return Array.from(selected);
}

export async function generateStaticParams() {
   return hyderabadServicePageSlugs.map((serviceCitySlug) => ({
      serviceCitySlug,
   }));
}

export async function generateMetadata({
   params,
}: ServiceCityPageProps): Promise<Metadata> {
   const { serviceCitySlug } = await params;
   const servicePage = getHyderabadServicePageBySlug(serviceCitySlug);

   if (!servicePage) {
      return {
         title: "Service Page Not Found | ExtraHand",
      };
   }

   const enhancement = getServicePageEnhancement(servicePage);

   const canonicalPath = `/${servicePage.slug}`;

   return {
      title: `${servicePage.serviceName} in Hyderabad | ExtraHand`,
      description: servicePage.shortDescription,
      alternates: {
         canonical: canonicalPath,
      },
      openGraph: {
         title: `${servicePage.serviceName} in Hyderabad`,
         description: servicePage.shortDescription,
         url: `${baseUrl}${canonicalPath}`,
         type: "website",
         images: [
            {
               url: enhancement.imagePath,
               width: 1200,
               height: 630,
               alt: `${servicePage.serviceName} in Hyderabad`,
            },
         ],
      },
      twitter: {
         card: "summary_large_image",
         title: `${servicePage.serviceName} in Hyderabad | ExtraHand`,
         description: servicePage.shortDescription,
         images: [enhancement.imagePath],
      },
   };
}

export default async function ServiceCityPage({ params }: ServiceCityPageProps) {
   const { serviceCitySlug } = await params;
   const servicePage = getHyderabadServicePageBySlug(serviceCitySlug);

   if (!servicePage) {
      notFound();
   }

   const enhancement = getServicePageEnhancement(servicePage);

   const coverageAreas = getAreaSlice(servicePage.slug);
   const postTaskHref = `/tasks/new?source=seo&service=${servicePage.slug}`;
   const trustPoints = [
      "Verified professionals with service-category experience",
      "Clear scoping before work begins",
      "Convenient booking with Hyderabad-wide coverage",
   ];

   const serviceFlow = [
      {
         title: "Share Your Requirement",
         description: `Tell us the issue and location details for ${servicePage.serviceName.toLowerCase()} in Hyderabad.`,
      },
      {
         title: "Get Matched Quickly",
         description: "Your request is aligned with available professionals near your area.",
      },
      {
         title: "Complete and Review",
         description: "Service is delivered, verified, and followed by clear next-step guidance if needed.",
      },
   ];

   return (
      <main className="min-h-screen bg-linear-to-b from-white to-secondary-50">
         <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-16">
            <div>
               <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                  Hyderabad Local Services
               </p>
               <h1 className="mt-3 text-3xl font-bold text-secondary-900 sm:text-4xl">
                  {servicePage.serviceName} in Hyderabad
               </h1>
               <p className="mt-4 max-w-2xl text-base text-secondary-700 sm:text-lg">
                  {servicePage.heroDescription}
               </p>
               <p className="mt-4 max-w-2xl text-sm leading-6 text-secondary-600">
                  {enhancement.overview}
               </p>

               <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                     href={postTaskHref}
                     className="rounded-lg bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                     Book This Service
                  </Link>
                  <Link
                     href="/locations/hyderabad"
                     className="rounded-lg border border-secondary-300 bg-white px-5 py-3 text-sm font-semibold text-secondary-800 transition hover:bg-secondary-100"
                  >
                     Explore Hyderabad Services
                  </Link>
               </div>

               <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-secondary-200 bg-white p-3 text-sm text-secondary-700">
                     <p className="font-semibold text-secondary-900">Best For</p>
                     <p className="mt-1">{enhancement.bestFor}</p>
                  </div>
                  <div className="rounded-lg border border-secondary-200 bg-white p-3 text-sm text-secondary-700">
                     <p className="font-semibold text-secondary-900">Coverage</p>
                     <p className="mt-1">Available across key Hyderabad neighborhoods.</p>
                  </div>
               </div>
            </div>

            <div>
               <div className="overflow-hidden rounded-2xl border border-secondary-200 bg-white">
                  <Image
                     src={enhancement.imagePath}
                     alt={`${servicePage.serviceName} in Hyderabad`}
                     width={900}
                     height={560}
                     className="h-80 w-full object-cover object-center sm:h-96 lg:h-112"
                     priority
                  />
               </div>
            </div>
         </section>

         <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
            <article className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-xs">
               <h2 className="text-xl font-semibold text-secondary-900">
                  What You Get
               </h2>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {servicePage.whatYouGet.map((item) => (
                     <li key={item} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                        <span>{item}</span>
                     </li>
                  ))}
               </ul>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-xs">
               <h2 className="text-xl font-semibold text-secondary-900">
                  Common Service Requests
               </h2>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {servicePage.commonNeeds.map((item) => (
                     <li key={item} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                        <span>{item}</span>
                     </li>
                  ))}
               </ul>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-xs">
               <h2 className="text-xl font-semibold text-secondary-900">
                  Why People Choose ExtraHand
               </h2>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {trustPoints.map((point) => (
                     <li key={point} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                        <span>{point}</span>
                     </li>
                  ))}
               </ul>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-xs">
               <h2 className="text-xl font-semibold text-secondary-900">
                  How Service Works
               </h2>
               <ol className="mt-4 space-y-3 text-secondary-700">
                  {serviceFlow.map((step, index) => (
                     <li key={step.title} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                           {index + 1}
                        </span>
                        <span>
                           <span className="font-semibold text-secondary-900">{step.title}: </span>
                           {step.description}
                        </span>
                     </li>
                  ))}
               </ol>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-xs lg:col-span-2">
               <h2 className="text-xl font-semibold text-secondary-900">
                  Popular Hyderabad Service Areas
               </h2>
               <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {coverageAreas.map((area) => (
                     <Link
                        key={area}
                        href={`/locations/hyderabad/${toAreaSlug(area)}/${servicePage.slug}`}
                        className="rounded-lg border border-secondary-200 bg-secondary-50 px-3 py-2 text-sm text-secondary-800 transition hover:border-primary-300 hover:bg-white"
                     >
                        {area}
                     </Link>
                  ))}
               </div>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-xs lg:col-span-2">
               <h2 className="text-xl font-semibold text-secondary-900">
                  About {servicePage.serviceName} in Hyderabad
               </h2>
               <p className="mt-4 text-secondary-700">{servicePage.shortDescription}</p>
               <p className="mt-3 text-secondary-700">{enhancement.overview}</p>
               <p className="mt-3 text-secondary-700">{enhancement.serviceDeepDive}</p>
               <p className="mt-3 text-secondary-700">
                  Commonly requested outcomes include {servicePage.whatYouGet[0].toLowerCase()}, {servicePage.whatYouGet[1].toLowerCase()}, and {servicePage.whatYouGet[2].toLowerCase()} with local coverage across residential and commercial areas of Hyderabad.
               </p>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-xs">
               <h2 className="text-xl font-semibold text-secondary-900">
                  Before You Book
               </h2>
               <p className="mt-3 text-secondary-700">
                  Sharing the right details helps professionals arrive prepared and complete your {servicePage.serviceName.toLowerCase()} request faster.
               </p>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {enhancement.prepTips.map((tip) => (
                     <li key={tip} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                        <span>{tip}</span>
                     </li>
                  ))}
               </ul>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-xs">
               <h2 className="text-xl font-semibold text-secondary-900">
                  After-Service Care Tips
               </h2>
               <p className="mt-3 text-secondary-700">
                  These steps help maintain results and reduce repeat issues after your service visit.
               </p>
               <ul className="mt-4 space-y-3 text-secondary-700">
                  {enhancement.postServiceTips.map((tip) => (
                     <li key={tip} className="flex items-start gap-2">
                        <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                        <span>{tip}</span>
                     </li>
                  ))}
               </ul>
            </article>

            <article className="rounded-2xl border border-secondary-200 bg-white p-6 shadow-xs lg:col-span-2">
               <h2 className="text-xl font-semibold text-secondary-900">Frequently Asked Questions</h2>
               {servicePage.faq.map((item) => (
                  <div key={item.question} className="mt-4 border-t border-secondary-100 pt-4">
                     <h3 className="text-base font-semibold text-secondary-900">
                        {item.question}
                     </h3>
                     <p className="mt-2 text-secondary-700">{item.answer}</p>
                  </div>
               ))}
               <div className="mt-4 border-t border-secondary-100 pt-4">
                  <h3 className="text-base font-semibold text-secondary-900">
                     {enhancement.secondFaq.question}
                  </h3>
                  <p className="mt-2 text-secondary-700">{enhancement.secondFaq.answer}</p>
               </div>
            </article>
         </section>
      </main>
   );
}