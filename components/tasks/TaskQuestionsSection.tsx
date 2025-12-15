"use client";

import { useState } from "react";
import { MessageSquare, ThumbsUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
   id: string;
   author: string;
   authorAvatar?: string;
   question: string;
   answer?: string;
   answeredBy?: string;
   timestamp: string;
   likes: number;
}

interface TaskQuestionsSectionProps {
   taskId: string;
}

// Mock questions data
const mockQuestions: Question[] = [
   {
      id: "q1",
      author: "Rajesh Kumar",
      question:
         "Do you need me to bring my own cleaning supplies, or will you provide them?",
      answer:
         "I can provide basic supplies, but if you have professional-grade products, please bring those.",
      answeredBy: "Task Poster",
      timestamp: "2 hours ago",
      likes: 3,
   },
   {
      id: "q2",
      author: "Priya Sharma",
      question: "How many rooms need to be cleaned? Is parking available?",
      answer:
         "It's a 3BHK apartment. Yes, parking is available in the basement.",
      answeredBy: "Task Poster",
      timestamp: "5 hours ago",
      likes: 1,
   },
];

export function TaskQuestionsSection({ taskId }: TaskQuestionsSectionProps) {
   const [questions, setQuestions] = useState<Question[]>(mockQuestions);
   const [newQuestion, setNewQuestion] = useState("");
   const [showQuestionForm, setShowQuestionForm] = useState(false);

   const handleAskQuestion = () => {
      if (newQuestion.trim()) {
         const question: Question = {
            id: `q${questions.length + 1}`,
            author: "You",
            question: newQuestion,
            timestamp: "Just now",
            likes: 0,
         };
         setQuestions([question, ...questions]);
         setNewQuestion("");
         setShowQuestionForm(false);
      }
   };

   return (
      <div className="p-4 md:p-8">
         {/* Header */}
         <div className="flex items-center justify-between mb-4 md:mb-8">
            <h2 className="md:text-lg font-bold text-secondary-900">
               Questions ({questions.length})
            </h2>
            {!showQuestionForm && (
               <Button
                  onClick={() => setShowQuestionForm(true)}
                  size="sm"
                  className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
               >
                  Ask a Question
               </Button>
            )}
         </div>

         {/* Question Form */}
         {showQuestionForm && (
            <div className="mb-8">
               <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="What would you like to know about this task?"
                  className="w-full px-4 py-3 text-xs md:text-sm border border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
               />
               <div className="flex gap-3 mt-2 md:mt-4">
                  <Button
                     onClick={handleAskQuestion}
                     size="sm"
                     className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 md:px-5"
                  >
                     Post Question
                  </Button>
                  <Button
                     onClick={() => {
                        setShowQuestionForm(false);
                        setNewQuestion("");
                     }}
                     size="sm"
                     variant="ghost"
                     className="text-secondary-600 hover:bg-secondary-50 rounded-lg"
                  >
                     Cancel
                  </Button>
               </div>
            </div>
         )}

         {/* Questions List */}
         {questions.length === 0 ? (
            <div className="text-center py-16">
               <div className="w-24 h-24 mx-auto mb-6 bg-secondary-50 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-secondary-300" />
               </div>
               <p className="text-base font-medium text-secondary-900 mb-2">
                  No questions yet
               </p>
               <p className="text-sm text-secondary-500">
                  Be the first to ask about this task
               </p>
            </div>
         ) : (
            <div className="space-y-3">
               {questions.map((q) => (
                  <div key={q.id} className="pb-5 sm:pb-6 last:pb-0">
                     {/* Question */}
                     <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm sm:text-base font-bold shrink-0 shadow-sm">
                           {q.author.charAt(0)}
                        </div>

                        <div className="flex-1 min-w-0">
                           <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <span className="font-bold text-secondary-900 text-sm sm:text-base">
                                 {q.author}
                              </span>
                              <span className="text-xs text-secondary-300">
                                 •
                              </span>
                              <span className="text-xs text-secondary-500">
                                 {q.timestamp}
                              </span>
                           </div>

                           <p className="text-xs md:text-sm text-secondary-700 leading-relaxed">
                              {q.question}
                           </p>
                        </div>
                     </div>

                     {/* Answer */}
                     {q.answer && (
                        <div className="mt-3 sm:ml-12 sm:pl-5 sm:border-l-2 border-primary-300 bg-primary-50/40 py-3 sm:py-4 px-4 sm:px-5 rounded-xl sm:rounded-r-2xl">
                           <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">
                                 {q.answeredBy}
                              </span>
                              <span className="text-xs text-primary-600">
                                 replied
                              </span>
                           </div>

                           <p className="text-xs md:text-sm text-secondary-800 leading-relaxed">
                              {q.answer}
                           </p>
                        </div>
                     )}

                     {/* Actions */}
                     <div className="mt-3 sm:mt-4 flex items-center gap-4 sm:ml-12">
                        <button className="flex items-center gap-2 text-xs sm:text-sm text-secondary-500 hover:text-primary-600 transition-colors             font-semibold">
                           <ThumbsUp className="w-4 h-4" />
                           <span>
                              {q.likes > 0 ? `${q.likes} helpful` : "Helpful"}
                           </span>
                        </button>

                        {!q.answer && (
                           <button className="text-xs sm:text-sm text-secondary-500 hover:text-primary-600 transition-colors font-semibold">
                              Reply
                           </button>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
