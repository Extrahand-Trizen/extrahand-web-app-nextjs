import type { TaskApplication } from "@/types/application";

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

