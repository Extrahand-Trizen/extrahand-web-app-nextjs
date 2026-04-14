"use client";

/**
 * Task Creation Flow - Multi-step form for posting tasks
 * Production-ready with React Hook Form + Zod validation
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
   TaskBasicsStep,
   LocationScheduleStep,
   ReviewStep,
} from "@/components/tasks";

import {
   completeTaskSchema,
   type CompleteTaskFormData,
} from "@/lib/validations/task";

import { api } from "@/lib/api";
import { getErrorMessage, isNetworkError } from "@/lib/utils/errorUtils";
import { useAuth } from "@/lib/auth/context";
import { addressesApi } from "@/lib/api/endpoints/addresses";
import { ADDRESSES_QUERY_KEY } from "@/components/shared/InteractiveLocationPicker";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

export type TaskFormData = CompleteTaskFormData;

type TaskLike = {
   _id?: string;
   id?: string;
   [key: string]: unknown;
};

function getCreatedTaskFromResponse(response: any): TaskLike | null {
   const candidate = response?.data ?? response ?? null;
   if (!candidate || typeof candidate !== "object") return null;
   const id = (candidate as TaskLike)._id || (candidate as TaskLike).id;
   if (!id || typeof id !== "string") return null;
   return candidate as TaskLike;
}

function mergeTaskIntoMyTasksCache(prev: any, createdTask: TaskLike) {
   if (!createdTask?._id && !createdTask?.id) return prev;
   const createdId = (createdTask._id || createdTask.id) as string;
   const dedupe = (list: any[]) => [createdTask, ...list.filter((t) => (t?._id || t?.id) !== createdId)];

   if (Array.isArray(prev)) {
      return dedupe(prev);
   }

   if (Array.isArray(prev?.data?.tasks)) {
      return {
         ...prev,
         data: {
            ...prev.data,
            tasks: dedupe(prev.data.tasks),
         },
      };
   }

   if (Array.isArray(prev?.data)) {
      return {
         ...prev,
         data: dedupe(prev.data),
      };
   }

   if (Array.isArray(prev?.tasks)) {
      return {
         ...prev,
         tasks: dedupe(prev.tasks),
      };
   }

   return {
      data: {
         tasks: [createdTask],
      },
   };
}

// ============================================================================
// Constants
// ============================================================================

const TOTAL_STEPS = 3;
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;
const DRAFT_KEY = "taskDraft";
const TOAST_ID_DRAFT_RESTORED = "task-create-draft-restored";
const TOAST_ID_ADDRESS_REQUIRED = "task-create-address-required";
const TOAST_ID_BUDGET_INVALID = "task-create-budget-invalid";
const TOAST_ID_STEP_INVALID = "task-create-step-invalid";

const URGENCY_SURCHARGES: Record<string, number> = {
   standard: 0,
   soon: 20,
   urgent: 50,
};

const CATEGORY_LABELS: Record<string, string> = {
   "it-computer-support": "IT & Computer Support",
   design: "Design",
   events: "Events",
   "repair-maintenance": "Repair & Maintenance",
   "personal-lifestyle": "Personal & Lifestyle Services",
   "care-services": "Care Services",
   "education-training": "Education & Training",
   "professional-services": "Professional Services",
   other: "Other",
   // Legacy task category slugs (drafts / older tasks)
   "home-cleaning": "Home Cleaning",
   "deep-cleaning": "Deep Cleaning",
   plumbing: "Plumbing",
   "water-tanker-services": "Water & Tanker Services",
   electrical: "Electrical",
   carpenter: "Carpenter",
   painting: "Painting",
   "ac-repair": "AC Repair & Service",
   "appliance-repair": "Appliance Repair",
   "pest-control": "Pest Control",
   "car-washing": "Car Washing / Car Cleaning",
   gardening: "Gardening",
   handyperson: "Handyperson / General Repairs",
   "furniture-assembly": "Furniture Assembly",
   "security-patrol": "Security Patrol / Watchman",
   "beauty-services": "Beauty Services",
   "massage-spa": "Massage / Spa",
   "fitness-trainers": "Fitness Trainers",
   tutors: "Tutors",
   "it-support": "IT Support / Laptop Repair",
   "photographer-videographer": "Photographer / Videographer",
   "event-services": "Event Services",
   "pet-services": "Pet Services",
   "driver-chauffeur": "Driver / Chauffeur",
   "cooking-home-chef": "Cooking / Home Chef",
   "laundry-ironing": "Laundry / Ironing",
   accounting: "Accounting",
   "packers-movers": "Packers & Movers",
   "senior-care-elder-care": "Senior Care / Elder Care",
};

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
   draft.recurringStartDate = reviveDate(draft.recurringStartDate);
   draft.recurringEndDate = reviveDate(draft.recurringEndDate);

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

const getUrgencySurcharge = (urgency: string): number =>
   URGENCY_SURCHARGES[urgency] ?? 0;

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
   // DEBUG: Log attachments before transform
   console.log('[TRANSFORM DEBUG] Form data attachments:', {
      hasAttachments: !!formData.attachments,
      attachmentsCount: formData.attachments?.length || 0,
      attachments: formData.attachments,
      title: formData.title
   });
   
   const isOnline = formData.locationMode === "online";

   // Ensure coordinates are a proper tuple
   const coords = formData.location.coordinates;
   const coordinates: [number, number] = isOnline
      ? [0, 0]
      : [coords?.[0] ?? 0, coords?.[1] ?? 0];

   const baseBudget =
      formData.budgetType === "negotiable" ? 0 : formData.budget ?? null;
   const urgencySurcharge = getUrgencySurcharge(formData.urgency);
   const budget =
      formData.budgetType === "negotiable" || baseBudget === null
         ? 0
         : baseBudget + urgencySurcharge;

   const baseCategoryLabel =
      CATEGORY_LABELS[formData.category] || formData.category;
   const subTrim = formData.subcategory?.trim();
   let resolvedCategoryLabel: string | undefined;
   if (formData.category === "other") {
      resolvedCategoryLabel = subTrim || CATEGORY_LABELS.other;
   } else if (subTrim) {
      resolvedCategoryLabel = `${baseCategoryLabel} – ${subTrim}`;
   } else {
      resolvedCategoryLabel = baseCategoryLabel;
   }

   return {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      categorySlug: formData.category,
      categoryLabel: resolvedCategoryLabel,
      subcategory: formData.subcategory || undefined,
      requirements: (formData.requirements || []).filter((req: string) => Boolean(req && req.trim())),
      estimatedDuration: formData.estimatedDuration || undefined,
      tags: formData.tags,
      priority: formData.priority,
      // Transform attachments to images array for backend
      images: formData.attachments?.map((a) => a.url) || [],
      // Location
      location: {
         type: "Point",
         coordinates,
         address: isOnline ? "Online" : formData.location.address,
         city: isOnline ? "Online" : formData.location.city,
         state: isOnline ? "Online" : formData.location.state,
         pinCode: isOnline ? "" : formData.location.pinCode,
         country: formData.location.country || "India",
      },
      remotely: isOnline,
      // Schedule - merge date and time into full datetime
      scheduledDate: formData.scheduledDate && formData.scheduledTimeStart 
         ? (() => {
             const merged = new Date(formData.scheduledDate);
             merged.setHours(
               formData.scheduledTimeStart.getHours(),
               formData.scheduledTimeStart.getMinutes(),
               0,
               0
             );
             return merged;
           })()
         : formData.scheduledDate || undefined,
      scheduledTime: formatTimeToString(formData.scheduledTimeStart),
      dateOption: formData.dateOption,
      timeSlot: formData.timeSlot,
      scheduledTimeStart: formatTimeToString(formData.scheduledTimeStart),
      scheduledTimeEnd: formatTimeToString(formData.scheduledTimeEnd),
      flexibility: mapFlexibilityToBackend(formData.flexibility),
      recurring: formData.recurringEnabled
         ? {
              enabled: true,
              frequency: formData.recurringFrequency,
              startDate: formData.recurringStartDate || undefined,
              endDate: formData.recurringEndDate || undefined,
           }
         : undefined,
      // Budget - required field, must be a number
      budgetType: formData.budgetType,
      budget,
      urgency: mapUrgencyToBackend(formData.urgency),
   };
};

const logTransformedTask = (task: Record<string, unknown>) => {
   console.log('[TRANSFORM DEBUG] Transformed payload:', {
      hasImages: !!task.images,
      imagesCount: Array.isArray(task.images) ? task.images.length : 0,
      images: task.images,
      title: task.title
   });
   return task;
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Note: getErrorMessage and isNetworkError are imported from @/lib/utils/errorUtils

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Round up current time to next 15-minute interval
 * If current time is in the past (shouldn't happen), rounds to next available slot
 */
const getRoundedCurrentTime = (): Date => {
   const now = new Date();
   const minutes = now.getMinutes();
   const remainder = 15 - (minutes % 15);
   
   // Round up to next 15-minute mark
   now.setMinutes(minutes + remainder);
   now.setSeconds(0);
   now.setMilliseconds(0);
   
   return now;
};

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
   locationMode: "in-person",
   location: {
      address: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
      coordinates: undefined,
   },
   scheduledDate: null,
   dateOption: "flexible",
   needsTimeOfDay: false,
   timeSlot: null,
   scheduledTimeStart: (() => {
      // Default to current time rounded to next 15-minute interval
      return getRoundedCurrentTime();
   })(),
   scheduledTimeEnd: (() => {
      // Default to 1 hour after rounded current time
      const startTime = getRoundedCurrentTime();
      startTime.setHours(startTime.getHours() + 1);
      return startTime;
   })(),
   flexibility: "flexible",
   recurringEnabled: false,
   recurringStartDate: null,
   recurringEndDate: null,
   recurringFrequency: "daily",
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
   const queryClient = useQueryClient();
   const searchParams = useSearchParams();
   const [currentStep, setCurrentStep] = useState(1);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
   const [retryCount, setRetryCount] = useState(0);
   const [isStepTransitioning, setIsStepTransitioning] = useState(false);
   const [showAuthModal, setShowAuthModal] = useState(false);
   const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
   const [pendingPostData, setPendingPostData] = useState<TaskFormData | null>(null);
   const { currentUser, userData } = useAuth();
   const isAuthenticated = Boolean(currentUser) || Boolean(userData);

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

   // Restore task creation context from sessionStorage if not in query params
   useEffect(() => {
      if (!initialCategoryFromQuery && typeof window !== "undefined") {
         const context = sessionStorage.getItem("taskCreationContext");
         if (context) {
            try {
               const { category, location } = JSON.parse(context);
               if (category) {
                  form.setValue("category", category, {
                     shouldValidate: false,
                     shouldDirty: false,
                  });
               }
               if (location) {
                  form.setValue("location.city", location, {
                     shouldValidate: false,
                     shouldDirty: false,
                  });
               }
               // Clear the context after using it
               sessionStorage.removeItem("taskCreationContext");
            } catch (e) {
               console.error("Failed to restore task creation context", e);
            }
         }
      }
   }, [form, initialCategoryFromQuery]);

   const scrollToTop = useCallback(() => {
      requestAnimationFrame(() => {
         window.scrollTo({ top: 0, left: 0, behavior: "auto" });
         document.documentElement.scrollTop = 0;
         document.body.scrollTop = 0;
      });
   }, []);

   // Memoized progress calculation
   const progress = useMemo(
      () => (currentStep / TOTAL_STEPS) * 100,
      [currentStep]
   );

   useEffect(() => {
      scrollToTop();
   }, [currentStep, scrollToTop]);

   // Track unsaved changes and auto-save periodically
   useEffect(() => {
      const subscription = form.watch(() => {
         setHasUnsavedChanges(true);
      });
      return () => subscription.unsubscribe();
   }, [form]);

   // Auto-save draft every 30 seconds if there are unsaved changes
   useEffect(() => {
      if (!hasUnsavedChanges) return;

      const autoSaveInterval = setInterval(() => {
         if (hasUnsavedChanges && !isSubmitting) {
            const values = form.getValues();
            localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
            console.log("Auto-saved draft");
            // Don't show toast for auto-save to avoid interrupting user
         }
      }, 30000); // Auto-save every 30 seconds

      return () => clearInterval(autoSaveInterval);
   }, [hasUnsavedChanges, isSubmitting, form]);

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

   // Prefetch saved addresses to make InteractiveLocationPicker load faster
   useEffect(() => {
      queryClient.prefetchQuery({
         queryKey: ADDRESSES_QUERY_KEY,
         queryFn: () => addressesApi.getAddresses(),
         staleTime: 5 * 60 * 1000,
      });
   }, [queryClient]);

   // Load draft on mount
   useEffect(() => {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
         try {
            const parsedDraft = JSON.parse(draft);
            const normalized = normalizeDraft(parsedDraft);
            form.reset(normalized);
            toast.info("Draft restored", {
               id: TOAST_ID_DRAFT_RESTORED,
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
            "budget",
         ] as const,
      }),
      []
   );

   // Handle navigation between steps
   const handleNext = useCallback(async () => {
      if (isSubmitting || isStepTransitioning) {
         return;
      }

      setIsStepTransitioning(true);

      try {
      const fieldsToValidate =
         stepValidationFields[currentStep as keyof typeof stepValidationFields];

      if (currentStep === 2) {
         const locationMode = form.getValues("locationMode");
         const location = form.getValues("location");

         // In-person tasks must have a selected address before progressing.
         if (locationMode === "in-person") {
            const hasAddress = Boolean(location?.address?.trim());
            const hasCity = Boolean(location?.city?.trim());
            const hasState = Boolean(location?.state?.trim());

            if (!hasAddress || !hasCity || !hasState) {
               form.setError("location.address", {
                  type: "manual",
                  message: "Please select an address for in-person tasks",
               });
               toast.error("Address required for in-person tasks", {
                  id: TOAST_ID_ADDRESS_REQUIRED,
                  description: "Select task location to continue.",
               });
               return;
            }
         }

         const budgetValue = form.getValues("budget");
         const isBudgetValid =
            typeof budgetValue === "number" &&
            budgetValue >= 50 &&
            budgetValue <= 50000;

         if (!isBudgetValid) {
            form.setError("budget", {
               type: "manual",
               message: "Enter a budget between ₹50 and ₹50,000.",
            });
            toast.error("Enter a valid budget", {
               id: TOAST_ID_BUDGET_INVALID,
               description: "Budget must be between ₹50 and ₹50,000.",
            });
            return;
         }
      }

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
               id: TOAST_ID_STEP_INVALID,
               description: secondary,
            });
            return;
         }
      }

      if (currentStep < TOTAL_STEPS) {
         setCurrentStep((prev) => prev + 1);
         scrollToTop();
         
         // Auto-save draft when moving to next step
         if (hasUnsavedChanges) {
            const values = form.getValues();
            localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
            setHasUnsavedChanges(false);
         }
      }
      } finally {
         setIsStepTransitioning(false);
      }
   }, [
      currentStep,
      form,
      stepValidationFields,
      hasUnsavedChanges,
      isStepTransitioning,
      isSubmitting,
      scrollToTop,
   ]);

   const handleBack = useCallback(() => {
      if (currentStep > 1) {
         setCurrentStep((prev) => prev - 1);
         scrollToTop();
         
         // Auto-save draft when going back
         if (hasUnsavedChanges) {
            const values = form.getValues();
            localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
            setHasUnsavedChanges(false);
         }
      } else if (currentStep === 1) {
         // Go back to previous page on step 1
         router.back();
      }
   }, [currentStep, hasUnsavedChanges, form, scrollToTop]);

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
   const submitTask = useCallback(
      async (data: TaskFormData) => {
         if (isSubmitting) return;

         setIsSubmitting(true);
         setRetryCount(0);

         try {
            if (data.budgetType !== "negotiable") {
               const budgetValue = data.budget ?? null;
               if (budgetValue === null || budgetValue < 50 || budgetValue > 50000) {
                  toast.error(`Please enter a ${data.budgetType} budget between ₹50 and ₹50,000`);
                  setIsSubmitting(false);
                  return;
               }
            }

            const taskPayload = transformFormDataToTask(data);
            logTransformedTask(taskPayload);

            const response = await toast.promise(
               createTaskWithRetry(taskPayload),
               {
                  loading: "Creating your task...",
                  success: "Task posted successfully!",
                  error: (err) => getErrorMessage(err),
               }
            );

            localStorage.removeItem(DRAFT_KEY);
            setHasUnsavedChanges(false);

            const createdTask = getCreatedTaskFromResponse(response);

            // Ensure My Tasks page renders the new task immediately from cache.
            if (createdTask) {
               queryClient.setQueryData(["my-tasks"], (prev: any) =>
                  mergeTaskIntoMyTasksCache(prev, createdTask)
               );
            }

            // Keep cache fresh in background for server-truth reconciliation.
            queryClient.invalidateQueries({ queryKey: ["my-tasks"] });

            // Signal the tasks page to open My Tasks regardless of user role defaults.
            localStorage.setItem(
               "extrahand_post_task_route",
               JSON.stringify({
                  tab: "mytasks",
                  taskId: createdTask?._id || createdTask?.id || null,
                  createdAt: Date.now(),
               })
            );

            setTimeout(() => {
               router.push("/tasks?tab=mytasks");
            }, 500);
         } catch (error) {
            console.error("Task submission error:", error);

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
      [isSubmitting, createTaskWithRetry, router, form, queryClient]
   );

   const onSubmit = useCallback(
      async (data: TaskFormData) => {
         if (!isAuthenticated) {
            const values = form.getValues();
            localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
            setHasUnsavedChanges(false);
            setShowAuthModal(true);
            return;
         }

         if (!userData?.isEmailVerified) {
            const values = form.getValues();
            localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
            setHasUnsavedChanges(false);
            setPendingPostData(data);
            setShowEmailVerifyModal(true);
            return;
         }

         await submitTask(data);
      },
      [isAuthenticated, userData?.isEmailVerified, form, submitTask]
   );

   // Save draft handler
   const handleSaveDraft = useCallback(() => {
      const values = form.getValues();
      
      // DEBUG: Log attachments in draft
      console.log('[DRAFT DEBUG] Saving draft:', {
         hasAttachments: !!values.attachments,
         attachmentsCount: values.attachments?.length || 0,
         attachments: values.attachments,
         title: values.title
      });
      
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      setHasUnsavedChanges(false);
      toast.success("Draft saved", {
         description: "Your progress has been saved locally.",
      });
   }, [form]);

   // Handle edit action from review step
   const handleEdit = useCallback((step: number) => {
      // Auto-save draft before navigating to edit step
      if (hasUnsavedChanges) {
         const values = form.getValues();
         localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
         setHasUnsavedChanges(false);
      }
      setCurrentStep(step);
      scrollToTop();
   }, [hasUnsavedChanges, form, scrollToTop]);

   const handleAuthLogin = () => {
      setShowAuthModal(false);
      // Store task creation context in sessionStorage to preserve after login
      const category = searchParams.get("category");
      const location = searchParams.get("location");
      if (category || location) {
         sessionStorage.setItem(
            "taskCreationContext",
            JSON.stringify({ category, location })
         );
      }
      sessionStorage.setItem("postAuthRedirectTo", "/tasks/new");
      window.location.href = "/login";
   };

   const handleAuthSignup = () => {
      setShowAuthModal(false);
      // Store task creation context in sessionStorage to preserve after signup
      const category = searchParams.get("category");
      const location = searchParams.get("location");
      if (category || location) {
         sessionStorage.setItem(
            "taskCreationContext",
            JSON.stringify({ category, location })
         );
      }
      sessionStorage.setItem("postAuthRedirectTo", "/tasks/new");
      window.location.href = "/signup";
   };

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Header */}
         <header className="bg-white border-b border-gray-200 sticky top-14 md:top-16 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="h-16 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <button
                        onClick={handleBack}
                        className="text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
                        disabled={isSubmitting}
                        aria-label="Previous step"
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
                     <ReviewStep
                        form={form}
                        onEdit={handleEdit}
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

         <Dialog open={showEmailVerifyModal} onOpenChange={setShowEmailVerifyModal}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Verify your email to continue</DialogTitle>
                  <DialogDescription>
                     Verify now to receive important notifications for task
                     updates, offers, and responses. You can also continue and
                     post the task now.
                  </DialogDescription>
               </DialogHeader>
               <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <Button
                     variant="outline"
                     className="w-full sm:w-auto"
                     disabled={isSubmitting}
                     onClick={async () => {
                        setShowEmailVerifyModal(false);
                        if (pendingPostData) {
                           const dataToPost = pendingPostData;
                           setPendingPostData(null);
                           await submitTask(dataToPost);
                        }
                     }}
                  >
                     Later
                  </Button>
                  <Button
                     className="w-full sm:w-auto"
                     disabled={isSubmitting}
                     onClick={() => {
                        const values = form.getValues();
                        localStorage.setItem(DRAFT_KEY, JSON.stringify(values));
                        setHasUnsavedChanges(false);
                        setShowEmailVerifyModal(false);
                        router.push("/profile/verify/email?next=/tasks/new");
                     }}
                  >
                     Verify email
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
