"use client";

/**
 * Task Creation Flow - Multi-step form for posting tasks
 * Production-ready with React Hook Form + Zod validation
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

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

import { api } from "@/lib/api";
import { getErrorMessage, isNetworkError } from "@/lib/utils/errorUtils";
import { getTaskPostingVerificationStatus } from "@/lib/utils/verificationGate";
import { useAuth } from "@/lib/auth/context";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

export type TaskFormData = CompleteTaskFormData;

// ============================================================================
// Constants
// ============================================================================

const TOTAL_STEPS = 4;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;
const DRAFT_KEY = "taskDraft";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Safely convert possible date-like values back into Date instances.
 */
const reviveDate = (value: unknown): Date | null => {
   if (!value) return null;
   if (value instanceof Date) return value;
   if (typeof value === "string" || typeof value === "number") {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
   }
   return null;
};

/**
 * Normalize draft object loaded from localStorage so it matches
 * the runtime shape expected by React Hook Form + Zod.
 */
const normalizeDraft = (raw: any): TaskFormData => {
   const draft: TaskFormData = {
      ...INITIAL_FORM_DATA,
      ...(raw || {}),
   };

   // Fix top-level dates
   draft.scheduledDate = reviveDate(draft.scheduledDate);
   draft.scheduledTimeStart =
      reviveDate(draft.scheduledTimeStart) || INITIAL_FORM_DATA.scheduledTimeStart;
   draft.scheduledTimeEnd =
      reviveDate(draft.scheduledTimeEnd) || INITIAL_FORM_DATA.scheduledTimeEnd;

   // Normalize attachments uploadedAt fields
   if (Array.isArray(draft.attachments)) {
      draft.attachments = draft.attachments.map((a: any) => ({
         ...a,
         uploadedAt: reviveDate(a?.uploadedAt) || undefined,
      }));
   }

   return draft;
};

/**
 * Map frontend urgency values to backend enum
 */
const mapUrgencyToBackend = (
   urgency: string
): "low" | "medium" | "high" | "urgent" => {
   const urgencyMap: Record<string, "low" | "medium" | "high" | "urgent"> = {
      standard: "medium",
      soon: "high",
      urgent: "urgent",
   };
   return urgencyMap[urgency] || "medium";
};

/**
 * Map frontend flexibility to backend values
 */
const mapFlexibilityToBackend = (
   flexibility: string
): "strict" | "flexible" | "anytime" => {
   if (flexibility === "very_flexible") return "anytime";
   if (flexibility === "exact") return "strict";
   return "flexible";
};

/**
 * Format Date object to time string (e.g., "10:00 AM")
 */
const formatTimeToString = (date: Date | null | undefined): string | undefined => {
   if (!date) return undefined;
   try {
      return date.toLocaleTimeString("en-US", {
         hour: "2-digit",
         minute: "2-digit",
         hour12: true,
      });
   } catch {
      return undefined;
   }
};

/**
 * Transform frontend form data to backend Task schema
 * Using Record type for flexibility as the backend accepts additional fields
 */
const transformFormDataToTask = (
   formData: TaskFormData
): Record<string, unknown> => {
   // Ensure coordinates are a proper tuple
   const coords = formData.location.coordinates;
   const coordinates: [number, number] = [coords?.[0] ?? 0, coords?.[1] ?? 0];

   // Budget is required in backend schema - default to 0 for negotiable
   const budget =
      formData.budgetType === "negotiable"
         ? 0
         : formData.budget ?? 0;

   return {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory || undefined,
      requirements: formData.requirements,
      estimatedDuration: formData.estimatedDuration || undefined,
      tags: formData.tags,
      priority: formData.priority,
      // Transform attachments to images array for backend
      images: formData.attachments?.map((a) => a.url) || [],
      // Location
      location: {
         type: "Point",
         coordinates,
         address: formData.location.address,
         city: formData.location.city,
         state: formData.location.state,
         pinCode: formData.location.pinCode,
         country: formData.location.country || "India",
      },
      // Schedule - convert Date objects to time strings for backend
      scheduledDate: formData.scheduledDate || undefined,
      scheduledTimeStart: formatTimeToString(formData.scheduledTimeStart),
      scheduledTimeEnd: formatTimeToString(formData.scheduledTimeEnd),
      flexibility: mapFlexibilityToBackend(formData.flexibility),
      // Budget - required field, must be a number
      budgetType: formData.budgetType,
      budget,
      urgency: mapUrgencyToBackend(formData.urgency),
   };
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Note: getErrorMessage and isNetworkError are imported from @/lib/utils/errorUtils

// ============================================================================
// Initial Form Data
// ============================================================================

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

// ============================================================================
// Component
// ============================================================================

export function TaskCreationFlow() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [currentStep, setCurrentStep] = useState(1);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
   const [retryCount, setRetryCount] = useState(0);
   const [showAuthModal, setShowAuthModal] = useState(false);
   const [showVerificationModal, setShowVerificationModal] = useState(false);
   const { currentUser, userData } = useAuth();
   const isAuthenticated = Boolean(currentUser) || Boolean(userData);
   const verificationStatus = getTaskPostingVerificationStatus(userData ?? null);

   const initialTitleFromQuery = searchParams.get("title") || "";
   const initialCategoryFromQuery = searchParams.get("category") || "";

   const form = useForm({
      resolver: zodResolver(completeTaskSchema),
      mode: "onChange" as const,
      defaultValues: {
         ...INITIAL_FORM_DATA,
         ...(initialTitleFromQuery && { title: initialTitleFromQuery }),
         ...(initialCategoryFromQuery && { category: initialCategoryFromQuery }),
      },
   }) as UseFormReturn<TaskFormData>;

   // Memoized progress calculation
   const progress = useMemo(
      () => (currentStep / TOTAL_STEPS) * 100,
      [currentStep]
   );

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
      return () => window.removeEventListener("beforeunload", handleBeforeUnload);
   }, [hasUnsavedChanges, isSubmitting]);

   // Load draft on mount
   useEffect(() => {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
         try {
            const parsedDraft = JSON.parse(draft);
            const normalized = normalizeDraft(parsedDraft);
            form.reset(normalized);
            toast.info("Draft restored", {
               description: "Your previous progress has been loaded.",
               action: {
                  label: "Clear",
                  onClick: () => {
                     localStorage.removeItem(DRAFT_KEY);
                     form.reset(INITIAL_FORM_DATA);
                     toast.success("Draft cleared");
                  },
               },
            });
         } catch (error) {
            console.error("Failed to load draft:", error);
            localStorage.removeItem(DRAFT_KEY);
         }
      }
   }, [form]);

   // Memoized step validation fields
   const stepValidationFields = useMemo(
      () => ({
         1: [
            "title",
            "description",
            "category",
            "subcategory",
            "requirements",
            "estimatedDuration",
            "tags",
            "priority",
            "attachments",
         ] as const,
         2: [
            "location",
            "scheduledDate",
            "scheduledTimeStart",
            "scheduledTimeEnd",
            "flexibility",
         ] as const,
         3: ["budgetType", "budget", "urgency"] as const,
      }),
      []
   );

   // Handle navigation between steps
   const handleNext = useCallback(async () => {
      const fieldsToValidate =
         stepValidationFields[currentStep as keyof typeof stepValidationFields];

      if (fieldsToValidate) {
         const isValid = await form.trigger(fieldsToValidate as any);
         if (!isValid) {
            // Collect specific field error messages for clearer feedback
            const errorMessages: string[] = [];
            (fieldsToValidate as readonly string[]).forEach((name) => {
               const fieldState = form.getFieldState(name as any);
               const msg = fieldState.error?.message;
               if (msg && !errorMessages.includes(msg)) {
                  errorMessages.push(msg);
               }
            });

            const primaryMessage =
               errorMessages[0] ||
               (currentStep === 2
                  ? "Please select a location"
                  : "Please fix the errors before continuing");

            const secondary =
               errorMessages.length > 1
                  ? errorMessages.slice(1).join(" • ")
                  : undefined;

            toast.error(primaryMessage, {
               description: secondary,
            });
            return;
         }
      }

      if (currentStep < TOTAL_STEPS) {
         setCurrentStep((prev) => prev + 1);
         window.scrollTo({ top: 0, behavior: "smooth" });
      }
   }, [currentStep, form, stepValidationFields]);

   const handleBack = useCallback(() => {
      if (currentStep > 1) {
         setCurrentStep((prev) => prev - 1);
         window.scrollTo({ top: 0, behavior: "smooth" });
      }
   }, [currentStep]);

   // API call with retry logic
   const createTaskWithRetry = useCallback(
      async (
         payload: Record<string, unknown>,
         attempt = 1
      ): Promise<unknown> => {
         try {
            return await api.createTask(payload);
         } catch (error) {
            if (attempt < MAX_RETRY_ATTEMPTS) {
               // Exponential backoff
               const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
               console.log(`Retry attempt ${attempt + 1} after ${delay}ms...`);
               setRetryCount(attempt);
               await sleep(delay);
               return createTaskWithRetry(payload, attempt + 1);
            }
            throw error;
         }
      },
      []
   );

   // Form submission handler
   const onSubmit = useCallback(
      async (data: TaskFormData) => {
         // If user is not authenticated, save draft and prompt for login/signup
         if (!isAuthenticated) {
            const values = form.getValues();
            localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
            setHasUnsavedChanges(false);
            setShowAuthModal(true);
            return;
         }

         // Background check: Aadhaar, PAN, and bank must be verified to post a task
         if (!verificationStatus.allowed) {
            setShowVerificationModal(true);
            return;
         }

         // Prevent duplicate submissions
         if (isSubmitting) {
            return;
         }

         setIsSubmitting(true);
         setRetryCount(0);

         try {
            // Transform form data to match backend Task schema
            const taskPayload = transformFormDataToTask(data);

            // Use toast.promise for loading state
            const response = await toast.promise(
               createTaskWithRetry(taskPayload),
               {
                  loading: "Creating your task...",
                  success: "Task posted successfully!",
                  error: (err) => getErrorMessage(err),
               }
            );

            // Clear draft after successful submission
            localStorage.removeItem(DRAFT_KEY);
            setHasUnsavedChanges(false);

            // Navigate to task details if we have an ID, otherwise go to my-tasks
            const taskId =
               (response as any)?.data?._id || (response as any)?._id;

            // Delay navigation slightly for toast to be visible
            setTimeout(() => {
               router.push(taskId ? `/tasks/${taskId}` : "/tasks");
            }, 500);
         } catch (error) {
            console.error("Task submission error:", error);

            // Show retry action for network errors
            if (isNetworkError(error)) {
               toast.error("Connection failed", {
                  description: "Please check your internet connection.",
                  action: {
                     label: "Retry",
                     onClick: () => form.handleSubmit(onSubmit)(),
                  },
                  duration: 10000,
               });
            } else {
               toast.error("Failed to create task", {
                  description: getErrorMessage(error),
               });
            }
         } finally {
            setIsSubmitting(false);
            setRetryCount(0);
         }
      },
      [isSubmitting, isAuthenticated, verificationStatus.allowed, createTaskWithRetry, router, form]
   );

   // Save draft handler
   const handleSaveDraft = useCallback(() => {
      const values = form.getValues();
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      setHasUnsavedChanges(false);
      toast.success("Draft saved", {
         description: "Your progress has been saved locally.",
      });
   }, [form]);

   // Handle navigation action
   const handleNavigateBack = useCallback(() => {
      if (hasUnsavedChanges) {
         handleSaveDraft();
      }
      router.back();
   }, [hasUnsavedChanges, handleSaveDraft, router]);

   const handleAuthLogin = () => {
      setShowAuthModal(false);
      router.push("/login?next=/tasks/new");
   };

   const handleAuthSignup = () => {
      setShowAuthModal(false);
      router.push("/signup?next=/tasks/new");
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
                           currentStep === 1 ? handleNavigateBack : handleBack
                        }
                        className="text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
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
                           Step {currentStep} of {TOTAL_STEPS}
                           {retryCount > 0 && (
                              <span className="ml-2 text-amber-600">
                                 (Retrying... {retryCount}/{MAX_RETRY_ATTEMPTS})
                              </span>
                           )}
                        </p>
                     </div>
                  </div>

                  <Button
                     variant="ghost"
                     onClick={handleSaveDraft}
                     disabled={isSubmitting}
                     className="text-primary-600 hover:text-primary-700"
                  >
                     {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     ) : null}
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
                     />
                  )}
               </form>
            </Form>
         </main>
         {/* Auth Required Modal */}
         <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Sign in to post your task</DialogTitle>
                  <DialogDescription>
                     Please log in or create an account to submit your task. Your
                     draft has been saved and will be restored after you sign in.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <Button
                     variant="outline"
                     className="w-full sm:w-auto"
                     onClick={handleAuthSignup}
                  >
                     Create an account
                  </Button>
                  <Button
                     className="w-full sm:w-auto"
                     onClick={handleAuthLogin}
                  >
                     Log in
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* Verification required: Aadhaar, PAN, Bank */}
         <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Verification required to post a task</DialogTitle>
                  <DialogDescription>
                     To post a task, your Aadhaar, PAN, and bank account must be
                     verified. Please complete the following in your profile:
                  </DialogDescription>
               </DialogHeader>
               <ul className="list-disc list-inside text-sm text-secondary-700 space-y-1">
                  {verificationStatus.missing.map((item) => (
                     <li key={item}>{item}</li>
                  ))}
               </ul>
               <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <Button
                     variant="outline"
                     className="w-full sm:w-auto"
                     onClick={() => setShowVerificationModal(false)}
                  >
                     Close
                  </Button>
                  <Button
                     className="w-full sm:w-auto"
                     onClick={() => {
                        setShowVerificationModal(false);
                        router.push("/profile?section=verifications");
                     }}
                  >
                     Complete verification
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
