import type { TaskQuestion } from "@/types/question";

export const mockQuestionsData: TaskQuestion[] = [
   {
      _id: "q1",
      taskId: "1",
      askedByUid: "performer1",
      question:
         "Do you need me to bring my own cleaning supplies, or will you provide them?",
      answer:
         "I can provide basic supplies, but if you have professional-grade products, please bring those.",
      answeredByUid: "user1",
      answeredAt: new Date(Date.now() - 7200000),
      isPublic: true,
      createdAt: new Date(Date.now() - 10800000),
      updatedAt: new Date(Date.now() - 7200000),
   },
   {
      _id: "q2",
      taskId: "1",
      askedByUid: "performer2",
      question: "How many rooms need to be cleaned? Is parking available?",
      answer:
         "It's a 3BHK apartment. Yes, parking is available in the basement.",
      answeredByUid: "user1",
      answeredAt: new Date(Date.now() - 18000000),
      isPublic: true,
      createdAt: new Date(Date.now() - 21600000),
      updatedAt: new Date(Date.now() - 18000000),
   },
   {
      _id: "q3",
      taskId: "1",
      askedByUid: "performer3",
      question: "What time would be convenient for you?",
      isPublic: true,
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
   },
];

// Mock user data for questions (would come from API)
export const mockQuestionUserData: Record<
   string,
   { name: string; avatar?: string }
> = {
   performer1: { name: "Rajesh Kumar" },
   performer2: { name: "Priya Sharma" },
   performer3: { name: "Amit Patel" },
   user1: { name: "Task Poster" },
};

