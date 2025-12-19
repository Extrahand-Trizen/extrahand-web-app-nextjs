"use client";

/**
 * AnswerQuestionForm - Form component for answering a question
 * Uses React Hook Form + Zod validation
 */

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import {
   answerQuestionSchema,
   type AnswerQuestionFormData,
} from "@/lib/validations/question";

interface AnswerQuestionFormProps {
   questionId: string;
   onSubmit: (data: AnswerQuestionFormData) => Promise<void>;
   onCancel: () => void;
   isSubmitting?: boolean;
}

export function AnswerQuestionForm({
   questionId,
   onSubmit,
   onCancel,
   isSubmitting = false,
}: AnswerQuestionFormProps) {
   const form = useForm<AnswerQuestionFormData>({
      resolver: zodResolver(answerQuestionSchema),
      defaultValues: {
         answer: "",
      },
   });

   const handleSubmit = async (data: AnswerQuestionFormData) => {
      await onSubmit(data);
      form.reset();
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
            <FormField
               control={form.control}
               name="answer"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="flex items-center gap-2 text-xs font-semibold text-secondary-900">
                        <MessageSquare className="w-3 h-3" />
                        Your Answer
                     </FormLabel>
                     <FormControl>
                        <Textarea
                           placeholder="Type your answer here..."
                           rows={3}
                           maxLength={1000}
                           className="resize-none text-xs md:text-sm"
                           {...field}
                        />
                     </FormControl>
                     <div className="flex justify-between items-center">
                        <FormMessage />
                        <span className="text-xs text-secondary-500">
                           {field.value?.length || 0}/1000
                        </span>
                     </div>
                  </FormItem>
               )}
            />

            <div className="flex gap-2">
               <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs px-3"
               >
                  {isSubmitting ? "Posting..." : "Post Answer"}
               </Button>
               <Button
                  type="button"
                  onClick={onCancel}
                  size="sm"
                  variant="ghost"
                  disabled={isSubmitting}
                  className="text-secondary-600 hover:bg-secondary-50 rounded-lg text-xs"
               >
                  Cancel
               </Button>
            </div>
         </form>
      </Form>
   );
}

