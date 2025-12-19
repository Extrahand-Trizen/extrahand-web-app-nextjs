import type { TaskApplication } from "@/types/application";

// Applications from other users (for task posters to see)
export const mockApplicationsData: TaskApplication[] = [
   {
      _id: "app1",
      id: "app1",
      taskId: "1",
      applicantUid: "performer1",
      proposedBudget: {
         amount: 1200,
         currency: "INR",
         isNegotiable: true,
      },
      proposedTime: {
         estimatedDuration: 4,
         flexible: true,
      },
      coverLetter:
         "Hi! I have 5 years of experience in deep cleaning services. I use eco-friendly products and provide my own equipment. I can complete this task efficiently within 4-5 hours.",
      relevantExperience: [
         "5 years professional cleaning",
         "Eco-friendly products certified",
         "Residential deep cleaning specialist",
      ],
      portfolio: [],
      status: "pending",
      messages: [],
      createdAt: new Date(Date.now() - 7200000),
      updatedAt: new Date(Date.now() - 7200000),
      isUrgent: false,
      priority: "medium",
   },
   {
      _id: "app2",
      id: "app2",
      taskId: "1",
      applicantUid: "performer2",
      proposedBudget: {
         amount: 1500,
         currency: "INR",
         isNegotiable: false,
      },
      proposedTime: {
         estimatedDuration: 5,
         flexible: false,
      },
      coverLetter:
         "Hello! Professional cleaning service with all equipment. I specialize in residential deep cleaning and have great reviews. Available this week.",
      relevantExperience: [
         "Professional cleaner since 2018",
         "100+ satisfied customers",
      ],
      portfolio: ["https://example.com/portfolio/sunita"],
      status: "pending",
      messages: [],
      createdAt: new Date(Date.now() - 14400000),
      updatedAt: new Date(Date.now() - 14400000),
      isUrgent: false,
      priority: "high",
   },
   {
      _id: "app3",
      id: "app3",
      taskId: "1",
      applicantUid: "performer3",
      proposedBudget: {
         amount: 1400,
         currency: "INR",
         isNegotiable: true,
      },
      proposedTime: {
         estimatedDuration: 4.5,
         flexible: true,
      },
      coverLetter:
         "Experienced cleaner with eco-friendly products. I can start immediately and ensure thorough cleaning of all rooms including kitchen and bathrooms.",
      relevantExperience: ["3 years experience", "Eco-friendly certified"],
      portfolio: [],
      status: "pending",
      messages: [],
      createdAt: new Date(Date.now() - 21600000),
      updatedAt: new Date(Date.now() - 21600000),
      isUrgent: false,
      priority: "medium",
   },
];

// Applications from current user (for "My Applications" page)
// Using "currentUser" as applicantUid to simulate logged-in user's applications
export const mockMyApplicationsData: TaskApplication[] = [
   {
      _id: "myapp1",
      id: "myapp1",
      taskId: "1",
      applicantUid: "currentUser",
      proposedBudget: {
         amount: 1300,
         currency: "INR",
         isNegotiable: true,
      },
      proposedTime: {
         estimatedDuration: 4,
         flexible: true,
      },
      coverLetter:
         "I have extensive experience in deep cleaning and use only eco-friendly products. I can complete this task efficiently and provide excellent results.",
      relevantExperience: [
         "5+ years professional cleaning",
         "Eco-friendly certified",
         "Residential specialist",
      ],
      portfolio: [],
      status: "pending",
      messages: [],
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
      isUrgent: false,
      priority: "medium",
   },
   {
      _id: "myapp2",
      id: "myapp2",
      taskId: "2",
      applicantUid: "currentUser",
      proposedBudget: {
         amount: 2500,
         currency: "INR",
         isNegotiable: false,
      },
      proposedTime: {
         estimatedDuration: 3,
         flexible: false,
      },
      coverLetter:
         "Professional plumber with 8 years of experience. I specialize in pipe installations and repairs. Available immediately and can complete the work within 3 hours.",
      relevantExperience: [
         "8 years plumbing experience",
         "Licensed professional",
         "Emergency repairs specialist",
      ],
      portfolio: [],
      status: "accepted",
      messages: [],
      createdAt: new Date(Date.now() - 172800000),
      updatedAt: new Date(Date.now() - 172800000),
      respondedAt: new Date(Date.now() - 86400000),
      isUrgent: false,
      priority: "high",
   },
   {
      _id: "myapp3",
      id: "myapp3",
      taskId: "3",
      applicantUid: "currentUser",
      proposedBudget: {
         amount: 1800,
         currency: "INR",
         isNegotiable: true,
      },
      proposedTime: {
         estimatedDuration: 2,
         flexible: true,
      },
      coverLetter:
         "Experienced electrician available for ceiling fan installation. I have all necessary tools and can complete the installation safely and efficiently.",
      relevantExperience: [
         "6 years electrical work",
         "Certified electrician",
         "Fan installation specialist",
      ],
      portfolio: [],
      status: "rejected",
      messages: [],
      createdAt: new Date(Date.now() - 259200000),
      updatedAt: new Date(Date.now() - 259200000),
      respondedAt: new Date(Date.now() - 172800000),
      isUrgent: false,
      priority: "medium",
   },
   {
      _id: "myapp4",
      id: "myapp4",
      taskId: "4",
      applicantUid: "currentUser",
      proposedBudget: {
         amount: 5000,
         currency: "INR",
         isNegotiable: true,
      },
      proposedTime: {
         estimatedDuration: 8,
         flexible: true,
      },
      coverLetter:
         "Professional painter with expertise in interior painting. I can provide high-quality paint job with proper preparation and finishing.",
      relevantExperience: [
         "10 years painting experience",
         "Interior painting specialist",
         "Premium finishes",
      ],
      portfolio: [],
      status: "withdrawn",
      messages: [],
      createdAt: new Date(Date.now() - 432000000),
      updatedAt: new Date(Date.now() - 345600000),
      isUrgent: false,
      priority: "low",
   },
   {
      _id: "myapp5",
      id: "myapp5",
      taskId: "5",
      applicantUid: "currentUser",
      proposedBudget: {
         amount: 800,
         currency: "INR",
         isNegotiable: false,
      },
      proposedTime: {
         estimatedDuration: 2,
         flexible: false,
      },
      coverLetter:
         "Experienced gardener available for lawn mowing and basic garden maintenance. I have my own equipment and can complete the work quickly.",
      relevantExperience: [
         "4 years gardening experience",
         "Lawn maintenance specialist",
      ],
      portfolio: [],
      status: "pending",
      messages: [],
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000),
      isUrgent: false,
      priority: "medium",
   },
];
