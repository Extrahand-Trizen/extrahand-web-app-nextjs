"use client";

import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { TaskQuestion } from "@/types/question";
import {
   mockQuestionsData,
   mockQuestionUserData,
} from "@/lib/data/mockQuestions";
import { AskQuestionForm } from "./questions/AskQuestionForm";
import { AnswerQuestionForm } from "./questions/AnswerQuestionForm";
import type { CreateQuestionFormData } from "@/lib/validations/question";

interface TaskQuestionsSectionProps {
   taskId: string;
}

const getTimeAgo = (date: Date | string | undefined): string => {
   if (!date) return "Recently";
   const now = new Date();
   const taskDate = typeof date === "string" ? new Date(date) : date;
   const diffMs = now.getTime() - taskDate.getTime();
   const diffMins = Math.floor(diffMs / 60000);
   const diffHours = Math.floor(diffMs / 3600000);
   const diffDays = Math.floor(diffMs / 86400000);

   if (diffMins < 1) return "Just now";
   if (diffMins < 60) return `${diffMins} min ago`;
   if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
   if (diffDays === 1) return "Yesterday";
   return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

export function TaskQuestionsSection({ taskId }: TaskQuestionsSectionProps) {
   const [questions, setQuestions] = useState<TaskQuestion[]>([]);
   const [loading, setLoading] = useState(true);
   const [showQuestionForm, setShowQuestionForm] = useState(false);
   const [answeringQuestionId, setAnsweringQuestionId] = useState<
      string | null
   >(null);
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      const loadQuestions = async () => {
         try {
            setLoading(true);
            // TODO: Replace with actual API call
            // const response = await questionsApi.getTaskQuestions(taskId);
            // setQuestions(response.questions);
            const filtered = mockQuestionsData.filter(
               (q) => q.taskId === taskId && q.isPublic
            );
            setQuestions(filtered);
         } catch (error) {
            console.error("Error loading questions:", error);
         } finally {
            setLoading(false);
         }
      };

      if (taskId) {
         loadQuestions();
      }
   }, [taskId]);

   const handleAskQuestion = async (data: CreateQuestionFormData) => {
      if (isSubmitting) return;

      setIsSubmitting(true);

      try {
         // TODO: Replace with actual API call
         // const newQuestion = await questionsApi.createQuestion(data);
         const newQuestion: TaskQuestion = {
            _id: `q${Date.now()}`,
            taskId: data.taskId,
            askedByUid: "currentUser", // Would come from auth context
            question: data.question,
            isPublic: data.isPublic,
            createdAt: new Date(),
            updatedAt: new Date(),
         };

         setQuestions([newQuestion, ...questions]);
         setShowQuestionForm(false);
      } catch (error) {
         console.error("Error asking question:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleAnswerQuestion = async (
      questionId: string,
      data: { answer: string }
   ) => {
      if (isSubmitting) return;

      setIsSubmitting(true);

      try {
         // TODO: Replace with actual API call
         // await questionsApi.answerQuestion(questionId, data);
         setQuestions((prev) =>
            prev.map((q) =>
               q._id === questionId
                  ? {
                       ...q,
                       answer: data.answer,
                       answeredByUid: "currentUser", // Would come from auth context
                       answeredAt: new Date(),
                       updatedAt: new Date(),
                    }
                  : q
            )
         );
         setAnsweringQuestionId(null);
      } catch (error) {
         console.error("Error answering question:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   if (loading) {
      return (
         <div className="p-4 md:p-8 flex items-center justify-center py-16">
            <div className="text-center">
               <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
               <p className="text-sm text-secondary-600">
                  Loading questions...
               </p>
            </div>
         </div>
      );
   }

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

         {/* Ask Question Form */}
         {showQuestionForm && (
            <AskQuestionForm
               taskId={taskId}
               onSubmit={handleAskQuestion}
               onCancel={() => setShowQuestionForm(false)}
               isSubmitting={isSubmitting}
            />
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
               {questions.map((q) => {
                  const asker = mockQuestionUserData[q.askedByUid] || {
                     name: "Tasker",
                  };
                  const answerer = q.answeredByUid
                     ? mockQuestionUserData[q.answeredByUid] || {
                          name: "Task Poster",
                       }
                     : null;

                  return (
                     <div
                        key={q._id}
                        className="pb-5 sm:pb-6 last:pb-0 border-b border-secondary-100 last:border-b-0"
                     >
                        {/* Question */}
                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                           <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm sm:text-base font-bold shrink-0 shadow-sm">
                              {asker.name.charAt(0)}
                           </div>

                           <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                 <span className="font-bold text-secondary-900 text-sm sm:text-base">
                                    {asker.name}
                                 </span>
                                 <span className="text-xs text-secondary-300">
                                    •
                                 </span>
                                 <span className="text-xs text-secondary-500">
                                    {getTimeAgo(q.createdAt)}
                                 </span>
                              </div>

                              <p className="text-xs md:text-sm text-secondary-700 leading-relaxed">
                                 {q.question}
                              </p>
                           </div>
                        </div>

                        {/* Answer */}
                        {q.answer ? (
                           <div className="mt-3 sm:ml-12 sm:pl-5 sm:border-l-2 border-primary-300 bg-primary-50/40 py-3 sm:py-4 px-4 sm:px-5 rounded-xl sm:rounded-r-2xl">
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">
                                    {answerer?.name || "Task Poster"}
                                 </span>
                                 <span className="text-xs text-primary-600">
                                    replied
                                 </span>
                                 {q.answeredAt && (
                                    <>
                                       <span className="text-xs text-secondary-300">
                                          •
                                       </span>
                                       <span className="text-xs text-secondary-500">
                                          {getTimeAgo(q.answeredAt)}
                                       </span>
                                    </>
                                 )}
                              </div>

                              <p className="text-xs md:text-sm text-secondary-800 leading-relaxed">
                                 {q.answer}
                              </p>
                           </div>
                        ) : // Answer Form (for task poster)
                        answeringQuestionId === q._id ? (
                           <div className="mt-3 sm:ml-12">
                              <AnswerQuestionForm
                                 questionId={q._id}
                                 onSubmit={(data) =>
                                    handleAnswerQuestion(q._id, data)
                                 }
                                 onCancel={() => setAnsweringQuestionId(null)}
                                 isSubmitting={isSubmitting}
                              />
                           </div>
                        ) : (
                           <div className="mt-3 sm:ml-12">
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() => setAnsweringQuestionId(q._id)}
                                 className="text-xs text-secondary-600 hover:text-primary-600 border-secondary-200 hover:border-primary-300"
                              >
                                 Reply
                              </Button>
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         )}
      </div>
   );
}
