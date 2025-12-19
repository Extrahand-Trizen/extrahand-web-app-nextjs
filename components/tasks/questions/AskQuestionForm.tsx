"use client";

/**
 * AskQuestionForm - Form component for asking a question
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
import { Checkbox } from "@/components/ui/checkbox";

import {
   createQuestionSchema,
   type CreateQuestionFormData,
} from "@/lib/validations/question";

interface AskQuestionFormProps {
   taskId: string;
   onSubmit: (data: CreateQuestionFormData) => Promise<void>;
   onCancel: () => void;
   isSubmitting?: boolean;
}

export function AskQuestionForm({
   taskId,
   onSubmit,
   onCancel,
   isSubmitting = false,
}: AskQuestionFormProps) {
   const form = useForm<CreateQuestionFormData>({
      resolver: zodResolver(createQuestionSchema),
      defaultValues: {
         taskId,
         question: "",
         isPublic: true,
      },
   });

   const handleSubmit = async (data: CreateQuestionFormData) => {
      await onSubmit(data);
      form.reset();
   };

   return (
      <div className="mb-6 md:mb-8">
         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(handleSubmit)}
               className="space-y-4"
            >
               <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="flex items-center gap-2 text-sm font-semibold text-secondary-900">
                           <MessageSquare className="w-4 h-4" />
                           Your Question
                        </FormLabel>
                        <FormControl>
                           <Textarea
                              placeholder="What would you like to know about this task?"
                              rows={4}
                              maxLength={1000}
                              className="resize-none"
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

               <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                     <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                           <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                           />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel className="text-sm text-secondary-700 cursor-pointer">
                              Make this question public
                           </FormLabel>
                           <p className="text-xs text-secondary-500">
                              Other taskers can see public questions and answers
                           </p>
                        </div>
                     </FormItem>
                  )}
               />

               <div className="flex gap-3">
                  <Button
                     type="submit"
                     size="sm"
                     disabled={isSubmitting}
                     className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 md:px-5"
                  >
                     {isSubmitting ? "Posting..." : "Post Question"}
                  </Button>
                  <Button
                     type="button"
                     onClick={onCancel}
                     size="sm"
                     variant="ghost"
                     disabled={isSubmitting}
                     className="text-secondary-600 hover:bg-secondary-50 rounded-lg"
                  >
                     Cancel
                  </Button>
               </div>
            </form>
         </Form>
      </div>
   );
}
