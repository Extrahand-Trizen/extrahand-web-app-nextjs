"use client";

/**
 * MakeOfferModal - Modal for submitting an offer/application for a task
 * Uses React Hook Form + Zod validation
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
   X,
   IndianRupee,
   Calendar,
   Clock,
   FileText,
   Briefcase,
} from "lucide-react";

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
   Form,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/LoadingSpinner";

import {
   createApplicationSchema,
   type CreateApplicationFormData,
} from "@/lib/validations/application";
import { applicationsApi } from "@/lib/api/endpoints/applications";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import type { Task } from "@/types/task";

interface MakeOfferModalProps {
   task: Task;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSuccess?: () => void;
}

export function MakeOfferModal({
   task,
   open,
   onOpenChange,
   onSuccess,
}: MakeOfferModalProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [experienceInput, setExperienceInput] = useState("");
   const [portfolioInput, setPortfolioInput] = useState("");

   const taskBudget =
      typeof task.budget === "object" ? task.budget.amount : task.budget;

   const form = useForm<CreateApplicationFormData>({
      resolver: zodResolver(createApplicationSchema),
      defaultValues: {
         taskId: task._id,
         proposedBudget: {
            amount: taskBudget ?? 0,
            currency: "INR",
            isNegotiable: true,
         },
         proposedTime: {
            flexible: true,
            estimatedDuration: task.estimatedDuration ?? undefined,
         },
         coverLetter: "",
         relevantExperience: [],
         portfolio: [],
      },
   });

   const relevantExperience = form.watch("relevantExperience") || [];
   const portfolio = form.watch("portfolio") || [];

   const addExperience = () => {
      const trimmed = experienceInput.trim();
      if (trimmed && trimmed.length >= 3 && relevantExperience.length < 10) {
         form.setValue("relevantExperience", [...relevantExperience, trimmed]);
         setExperienceInput("");
      }
   };

   const removeExperience = (index: number) => {
      form.setValue(
         "relevantExperience",
         relevantExperience.filter((_, i) => i !== index)
      );
   };

   const addPortfolio = () => {
      const trimmed = portfolioInput.trim();
      if (trimmed && portfolio.length < 10) {
         try {
            new URL(trimmed); // Validate URL
            form.setValue("portfolio", [...portfolio, trimmed]);
            setPortfolioInput("");
         } catch {
            toast.error("Please enter a valid URL");
         }
      }
   };

   const removePortfolio = (index: number) => {
      form.setValue(
         "portfolio",
         portfolio.filter((_, i) => i !== index)
      );
   };

   const onSubmit = async (data: CreateApplicationFormData) => {
      if (isSubmitting) return;

      setIsSubmitting(true);

      try {
         // Build the application payload
         const applicationPayload = {
            taskId: task._id,
            proposedBudget: {
               amount: data.proposedBudget.amount,
               currency: data.proposedBudget.currency,
               isNegotiable: data.proposedBudget.isNegotiable,
            },
            proposedTime: {
               flexible: data.proposedTime.flexible,
               estimatedDuration: data.proposedTime.estimatedDuration,
            },
            coverLetter: data.coverLetter,
            relevantExperience: data.relevantExperience,
            portfolio: data.portfolio,
         };

         // Submit application via real API
         await applicationsApi.submitApplication(applicationPayload);

         toast.success("Offer submitted successfully!", {
            description: "Your offer has been sent to the task poster.",
         });

         form.reset();
         onOpenChange(false);
         onSuccess?.();
      } catch (error) {
         console.error("Error submitting offer:", error);
         toast.error("Failed to submit offer", {
            description: getErrorMessage(error),
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold text-secondary-900">
                  Make an Offer
               </DialogTitle>
               <DialogDescription className="text-sm text-secondary-600">
                  Submit your offer for &quot;{task.title}&quot;
               </DialogDescription>
            </DialogHeader>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  {/* Proposed Budget */}
                  <FormField
                     control={form.control}
                     name="proposedBudget.amount"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="flex items-center gap-2 text-sm font-semibold text-secondary-900">
                              <IndianRupee className="w-4 h-4" />
                              Proposed Budget (₹)
                           </FormLabel>
                           <FormControl>
                              <Input
                                 type="number"
                                 placeholder="Enter your proposed budget"
                                 value={field.value ?? ""}
                                 onChange={(e) =>
                                    field.onChange(
                                       e.target.value === ""
                                          ? 0
                                          : Number(e.target.value)
                                    )
                                 }
                                 onBlur={field.onBlur}
                                 className="h-11"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="proposedBudget.isNegotiable"
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
                                 Budget is negotiable
                              </FormLabel>
                           </div>
                        </FormItem>
                     )}
                  />

                  {/* Proposed Time */}
                  <div className="space-y-4">
                     <FormLabel className="flex items-center gap-2 text-sm font-semibold text-secondary-900">
                        <Clock className="w-4 h-4" />
                        Proposed Timeline
                     </FormLabel>

                     <FormField
                        control={form.control}
                        name="proposedTime.estimatedDuration"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel className="text-xs text-secondary-600">
                                 Estimated Duration (hours)
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    type="number"
                                    step="0.5"
                                    min="0.5"
                                    max="168"
                                    placeholder="e.g., 4"
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                       field.onChange(
                                          e.target.value === ""
                                             ? undefined
                                             : Number(e.target.value)
                                       )
                                    }
                                    onBlur={field.onBlur}
                                    className="h-10"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="proposedTime.flexible"
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
                                    Flexible with timing
                                 </FormLabel>
                              </div>
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* Cover Letter */}
                  <FormField
                     control={form.control}
                     name="coverLetter"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="flex items-center gap-2 text-sm font-semibold text-secondary-900">
                              <FileText className="w-4 h-4" />
                              Cover Letter (Optional)
                           </FormLabel>
                           <FormControl>
                              <Textarea
                                 placeholder="Tell the task poster why you're the right person for this task..."
                                 rows={5}
                                 maxLength={1000}
                                 {...field}
                                 className="resize-none"
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

                  {/* Relevant Experience */}
                  <div className="space-y-3">
                     <FormLabel className="flex items-center gap-2 text-sm font-semibold text-secondary-900">
                        <Briefcase className="w-4 h-4" />
                        Relevant Experience (Optional)
                     </FormLabel>
                     <div className="flex gap-2">
                        <Input
                           value={experienceInput}
                           onChange={(e) => setExperienceInput(e.target.value)}
                           onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                 e.preventDefault();
                                 addExperience();
                              }
                           }}
                           placeholder="Add relevant experience"
                           className="h-10"
                        />
                        <Button
                           type="button"
                           onClick={addExperience}
                           variant="outline"
                           disabled={
                              !experienceInput.trim() ||
                              relevantExperience.length >= 10
                           }
                        >
                           Add
                        </Button>
                     </div>
                     {relevantExperience.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                           {relevantExperience.map((exp, index) => (
                              <span
                                 key={index}
                                 className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                              >
                                 {exp}
                                 <button
                                    type="button"
                                    onClick={() => removeExperience(index)}
                                    className="hover:text-red-600"
                                 >
                                    <X className="w-3 h-3" />
                                 </button>
                              </span>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Portfolio Links */}
                  <div className="space-y-3">
                     <FormLabel className="text-sm font-semibold text-secondary-900">
                        Portfolio Links (Optional)
                     </FormLabel>
                     <div className="flex gap-2">
                        <Input
                           value={portfolioInput}
                           onChange={(e) => setPortfolioInput(e.target.value)}
                           onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                 e.preventDefault();
                                 addPortfolio();
                              }
                           }}
                           placeholder="https://example.com/portfolio"
                           type="url"
                           className="h-10"
                        />
                        <Button
                           type="button"
                           onClick={addPortfolio}
                           variant="outline"
                           disabled={
                              !portfolioInput.trim() || portfolio.length >= 10
                           }
                        >
                           Add
                        </Button>
                     </div>
                     {portfolio.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                           {portfolio.map((url, index) => (
                              <span
                                 key={index}
                                 className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                              >
                                 <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline truncate max-w-[200px]"
                                 >
                                    {url}
                                 </a>
                                 <button
                                    type="button"
                                    onClick={() => removePortfolio(index)}
                                    className="hover:text-red-600"
                                 >
                                    <X className="w-3 h-3" />
                                 </button>
                              </span>
                           ))}
                        </div>
                     )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-secondary-200">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                        disabled={isSubmitting}
                     >
                        Cancel
                     </Button>
                     <Button
                        type="submit"
                        className="flex-1 bg-primary-600 hover:bg-primary-700"
                        disabled={isSubmitting}
                     >
                        {isSubmitting ? (
                           <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Submitting...
                           </>
                        ) : (
                           "Submit Offer"
                        )}
                     </Button>
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
}
