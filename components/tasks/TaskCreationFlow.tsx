"use client";

/**
 * Task Creation Flow - Multi-step form for posting tasks
 * Production-ready with React Hook Form + Zod validation
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
   TaskBasicsStep,
   LocationScheduleStep,
   BudgetStep,
   ReviewStep,
} from "@/components/tasks";

import {
   completeTaskSchema,
   type CompleteTaskFormData,
} from "@/lib/validations/task";

export type TaskFormData = CompleteTaskFormData;

const INITIAL_FORM_DATA: TaskFormData = {
   title: "",
   description: "",
   category: "",
   subcategory: "",
   requirements: [],
   estimatedDuration: null,
   tags: [],
   priority: "normal",
   attachments: [],
   location: {
      address: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
      coordinates: undefined,
   },
   scheduledDate: null,
   scheduledTimeStart: (() => {
      const date = new Date();
      date.setHours(9, 0, 0, 0);
      return date;
   })(),
   scheduledTimeEnd: (() => {
      const date = new Date();
      date.setHours(10, 0, 0, 0);
      return date;
   })(),
   flexibility: "flexible",
   budgetType: "fixed",
   budget: null,
   urgency: "standard",
   agreedToGuidelines: false,
};

export function TaskCreationFlow() {
   const router = useRouter();
   const [currentStep, setCurrentStep] = useState(1);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

   const form = useForm({
      resolver: zodResolver(completeTaskSchema),
      mode: "onChange" as const,
      defaultValues: INITIAL_FORM_DATA,
   }) as UseFormReturn<TaskFormData>;

   const totalSteps = 4;
   const progress = (currentStep / totalSteps) * 100;

   // Track unsaved changes
   useEffect(() => {
      const subscription = form.watch(() => {
         setHasUnsavedChanges(true);
      });
      return () => subscription.unsubscribe();
   }, [form]);

   // Warn before leaving page with unsaved changes
   useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
         if (hasUnsavedChanges && !isSubmitting) {
            e.preventDefault();
            e.returnValue = "";
         }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () =>
         window.removeEventListener("beforeunload", handleBeforeUnload);
   }, [hasUnsavedChanges, isSubmitting]);

   // Load draft on mount
   useEffect(() => {
      const draft = localStorage.getItem("taskDraft");
      if (draft) {
         try {
            const parsedDraft = JSON.parse(draft);
            form.reset(parsedDraft);
            toast.info("Draft restored", {
               description: "Your previous progress has been loaded.",
            });
         } catch (error) {
            console.error("Failed to load draft:", error);
         }
      }
   }, [form]);

   const handleNext = async () => {
      let isValid = false;

      // Validate current step
      if (currentStep === 1) {
         isValid = await form.trigger([
            "title",
            "description",
            "category",
            "subcategory",
            "requirements",
            "estimatedDuration",
            "tags",
            "priority",
            "attachments",
         ]);
      } else if (currentStep === 2) {
         isValid = await form.trigger([
            "location",
            "scheduledDate",
            "scheduledTimeStart",
            "scheduledTimeEnd",
            "flexibility",
         ]);
      } else if (currentStep === 3) {
         isValid = await form.trigger(["budgetType", "budget", "urgency"]);
      }

      if (isValid && currentStep < totalSteps) {
         setCurrentStep((prev) => prev + 1);
         window.scrollTo({ top: 0, behavior: "smooth" });
      }
   };

   const handleBack = () => {
      if (currentStep > 1) {
         setCurrentStep((prev) => prev - 1);
         window.scrollTo({ top: 0, behavior: "smooth" });
      }
   };

   const onSubmit = async (data: TaskFormData) => {
      // Prevent duplicate submissions
      if (isSubmitting) {
         toast.error("Please wait", {
            description: "Your task is being submitted...",
         });
         return;
      }

      setIsSubmitting(true);

      try {
         // TODO: Replace with actual API call
         await new Promise((resolve) => setTimeout(resolve, 2000));

         // Clear draft after successful submission
         localStorage.removeItem("taskDraft");
         setHasUnsavedChanges(false);

         toast.success("Task posted successfully!", {
            description: "Your task has been created and is now live.",
         });

         router.push("/tasks/my-tasks");
      } catch (error) {
         console.error("Task submission error:", error);
         toast.error("Failed to post task", {
            description:
               error instanceof Error
                  ? error.message
                  : "Please try again or contact support if the problem persists.",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleSaveDraft = () => {
      const values = form.getValues();
      localStorage.setItem("taskDraft", JSON.stringify(values));
      toast.success("Draft saved", {
         description: "Your progress has been saved.",
      });
   };

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Header */}
         <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="h-16 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <button
                        onClick={
                           currentStep === 1 ? () => router.back() : handleBack
                        }
                        className="text-gray-700 hover:text-gray-900 transition-colors"
                        aria-label={
                           currentStep === 1 ? "Go back" : "Previous step"
                        }
                     >
                        <ArrowLeft className="w-6 h-6" />
                     </button>

                     <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                           Post a Task
                        </h1>
                        <p className="text-sm text-gray-500">
                           Step {currentStep} of {totalSteps}
                        </p>
                     </div>
                  </div>

                  <Button
                     variant="ghost"
                     onClick={handleSaveDraft}
                     className="text-primary-600 hover:text-primary-700"
                  >
                     Save Draft
                  </Button>
               </div>

               {/* Progress Bar */}
               <div className="h-1 bg-gray-100">
                  <div
                     className="h-full bg-primary-600 transition-all duration-300 ease-out"
                     style={{ width: `${progress}%` }}
                  />
               </div>
            </div>
         </header>

         {/* Content */}
         <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  {currentStep === 1 && (
                     <TaskBasicsStep form={form} onNext={handleNext} />
                  )}

                  {currentStep === 2 && (
                     <LocationScheduleStep form={form} onNext={handleNext} />
                  )}

                  {currentStep === 3 && (
                     <BudgetStep form={form} onNext={handleNext} />
                  )}

                  {currentStep === 4 && (
                     <ReviewStep
                        form={form}
                        onEdit={(step) => setCurrentStep(step)}
                        isSubmitting={isSubmitting}
                        onSubmit={() => form.handleSubmit(onSubmit)()}
                     />
                  )}
               </form>
            </Form>
         </main>
      </div>
   );
}
