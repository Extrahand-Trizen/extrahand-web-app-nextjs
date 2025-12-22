"use client";

/**
 * Edit Task Page
 * Single-page form for editing existing tasks
 * Uses React Hook Form + Zod validation
 * Only allows editing necessary fields (not status, assignedTo, etc.)
 */

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/LoadingSpinner";

import { TaskBasicsStep } from "@/components/tasks/steps/TaskBasicsStep";
import { LocationScheduleStep } from "@/components/tasks/steps/LocationScheduleStep";
import { BudgetStep } from "@/components/tasks/steps/BudgetStep";

import { editTaskSchema, type EditTaskFormData } from "@/lib/validations/task";
import { mockTasksData } from "@/lib/data/mockTasks";
import type { Task } from "@/types/task";
import type { TaskFormData } from "@/components/tasks/TaskCreationFlow";

// Transform Task to EditTaskFormData
function taskToFormData(task: Task): Partial<EditTaskFormData> {
   const budgetAmount =
      typeof task.budget === "object" ? task.budget.amount : task.budget;

   // Convert scheduledTime string to Date objects if needed
   let scheduledTimeStart: Date | undefined;
   let scheduledTimeEnd: Date | undefined;

   if (task.scheduledDate) {
      const baseDate = new Date(task.scheduledDate);
      scheduledTimeStart = new Date(baseDate);
      scheduledTimeStart.setHours(9, 0, 0, 0);

      scheduledTimeEnd = new Date(baseDate);
      scheduledTimeEnd.setHours(10, 0, 0, 0);
   }

   // Map flexibility values
   const flexibilityMap: Record<
      string,
      "exact" | "flexible" | "very_flexible"
   > = {
      strict: "exact",
      flexible: "flexible",
      anytime: "very_flexible",
   };

   // Map urgency values
   const urgencyMap: Record<string, "standard" | "soon" | "urgent"> = {
      low: "standard",
      medium: "standard",
      high: "soon",
      urgent: "urgent",
   };

   return {
      title: task.title,
      description: task.description,
      category: task.category,
      subcategory: task.subcategory,
      requirements: task.requirements || [],
      estimatedDuration: task.estimatedDuration || null,
      tags: task.tags || [],
      priority: task.priority,
      attachments:
         task.attachments?.map((att) => ({
            type: att.type,
            url: att.url,
            filename: att.filename,
            uploadedAt: att.uploadedAt || new Date(),
         })) || [],
      location: {
         address: task.location.address,
         city: task.location.city,
         state: task.location.state,
         pinCode: task.location.pinCode || "",
         country: task.location.country || "India",
         coordinates: task.location.coordinates
            ? ([task.location.coordinates[0], task.location.coordinates[1]] as [
                 number,
                 number
              ])
            : undefined,
      },
      scheduledDate: task.scheduledDate ? new Date(task.scheduledDate) : null,
      scheduledTimeStart,
      scheduledTimeEnd,
      flexibility: flexibilityMap[task.flexibility] || "flexible",
      budgetType: task.budgetType,
      budget: budgetAmount || null,
      urgency: urgencyMap[task.urgency] || "standard",
   };
}

export default function EditTaskPage() {
   const router = useRouter();
   const params = useParams();
   const taskId = params.id as string;

   const [task, setTask] = useState<Task | null>(null);
   const [loading, setLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [currentStep, setCurrentStep] = useState(1);

   const form = useForm({
      resolver: zodResolver(editTaskSchema),
      mode: "onChange" as const,
      defaultValues: {} as Partial<EditTaskFormData>,
   }) as UseFormReturn<Partial<EditTaskFormData>>;

   // Load task data
   useEffect(() => {
      const loadTask = async () => {
         try {
            setLoading(true);
            // TODO: Replace with actual API call
            // const taskData = await tasksApi.getTask(taskId);
            const taskData = mockTasksData.find((t) => t._id === taskId);

            if (!taskData) {
               toast.error("Task not found");
               router.push("/tasks/my-tasks");
               return;
            }

            setTask(taskData);
            const formData = taskToFormData(taskData);
            form.reset(formData);
         } catch (error) {
            console.error("Error loading task:", error);
            toast.error("Failed to load task", {
               description: "Please try again later.",
            });
            router.push("/tasks/my-tasks");
         } finally {
            setLoading(false);
         }
      };

      if (taskId) {
         loadTask();
      }
   }, [taskId, form, router]);

   const totalSteps = 3;
   const progress = (currentStep / totalSteps) * 100;

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

   const onSubmit = async (data: Partial<EditTaskFormData>) => {
      if (isSubmitting || !task) return;

      setIsSubmitting(true);

      try {
         // Transform form data back to Task format
         const updateData: Partial<Task> = {};

         if (data.title !== undefined) updateData.title = data.title;
         if (data.description !== undefined)
            updateData.description = data.description;
         if (data.category !== undefined) updateData.category = data.category;
         if (data.subcategory !== undefined)
            updateData.subcategory = data.subcategory;
         if (data.requirements !== undefined)
            updateData.requirements = data.requirements;
         if (data.estimatedDuration !== undefined)
            updateData.estimatedDuration = data.estimatedDuration;
         if (data.tags !== undefined) updateData.tags = data.tags;
         if (data.priority !== undefined) updateData.priority = data.priority;
         if (data.attachments !== undefined) {
            updateData.attachments = data.attachments.map((att) => ({
               type: att.type,
               url: att.url,
               filename: att.filename,
               uploadedAt: att.uploadedAt ?? new Date(),
            })) as Array<{
               type: string;
               url: string;
               filename: string;
               uploadedAt: Date;
            }>;
         }

         if (data.location !== undefined) {
            updateData.location = {
               type: "Point",
               coordinates: (data.location.coordinates ||
                  task.location.coordinates) as [number, number],
               address: data.location.address || task.location.address,
               city: data.location.city || task.location.city,
               state: data.location.state || task.location.state,
               pinCode: data.location.pinCode || task.location.pinCode,
               country: data.location.country || task.location.country,
            };
         }

         if (data.scheduledDate !== undefined)
            updateData.scheduledDate = data.scheduledDate;

         // Map flexibility back
         if (data.flexibility !== undefined) {
            const flexibilityMap: Record<
               string,
               "strict" | "flexible" | "anytime"
            > = {
               exact: "strict",
               flexible: "flexible",
               very_flexible: "anytime",
            };
            updateData.flexibility =
               flexibilityMap[data.flexibility] || task.flexibility;
         }

         if (data.budgetType !== undefined)
            updateData.budgetType = data.budgetType;
         if (data.budget !== undefined) {
            if (data.budgetType === "negotiable") {
               updateData.budget = {
                  amount: 0,
                  currency: "INR",
                  negotiable: true,
               };
            } else {
               updateData.budget = data.budget;
            }
         }

         // Map urgency back
         if (data.urgency !== undefined) {
            const urgencyMap: Record<
               string,
               "low" | "medium" | "high" | "urgent"
            > = {
               standard: "medium",
               soon: "high",
               urgent: "urgent",
            };
            updateData.urgency = urgencyMap[data.urgency] || task.urgency;
         }

         // TODO: Replace with actual API call
         // await tasksApi.updateTask(taskId, updateData);
         await new Promise((resolve) => setTimeout(resolve, 1500));

         toast.success("Task updated successfully!", {
            description: "Your changes have been saved.",
         });

         router.push(`/tasks/${taskId}`);
      } catch (error) {
         console.error("Task update error:", error);
         toast.error("Failed to update task", {
            description:
               error instanceof Error
                  ? error.message
                  : "Please try again or contact support if the problem persists.",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoadingSpinner size="lg" />
         </div>
      );
   }

   if (!task) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
               <AlertCircle className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
               <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                  Task not found
               </h1>
               <p className="text-secondary-600 mb-6">
                  The task you&apos;re looking for doesn&apos;t exist or has
                  been removed.
               </p>
               <Button onClick={() => router.push("/tasks/my-tasks")}>
                  Back to My Tasks
               </Button>
            </div>
         </div>
      );
   }

   // Check if task can be edited (not completed or cancelled)
   const canEdit = task.status !== "completed" && task.status !== "cancelled";

   if (!canEdit) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto px-4">
               <AlertCircle className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
               <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                  Cannot Edit Task
               </h1>
               <p className="text-secondary-600 mb-6">
                  This task cannot be edited because it is{" "}
                  {task.status === "completed" ? "completed" : "cancelled"}.
               </p>
               <Button onClick={() => router.push(`/tasks/${taskId}`)}>
                  View Task
               </Button>
            </div>
         </div>
      );
   }

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
                           Edit Task
                        </h1>
                        <p className="text-sm text-gray-500">
                           Step {currentStep} of {totalSteps}
                        </p>
                     </div>
                  </div>

                  {currentStep === totalSteps && (
                     <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="flex items-center gap-2"
                     >
                        {isSubmitting ? (
                           <>
                              <LoadingSpinner size="sm" />
                              Saving...
                           </>
                        ) : (
                           <>
                              <Save className="w-4 h-4" />
                              Save Changes
                           </>
                        )}
                     </Button>
                  )}
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
                     <TaskBasicsStep
                        form={form as unknown as UseFormReturn<TaskFormData>}
                        onNext={handleNext}
                     />
                  )}

                  {currentStep === 2 && (
                     <LocationScheduleStep
                        form={form as unknown as UseFormReturn<TaskFormData>}
                        onNext={handleNext}
                     />
                  )}

                  {currentStep === 3 && (
                     <BudgetStep
                        form={form as unknown as UseFormReturn<TaskFormData>}
                        onNext={async () => {
                           const isValid = await form.trigger([
                              "budgetType",
                              "budget",
                              "urgency",
                           ]);
                           if (isValid) {
                              form.handleSubmit(onSubmit)();
                           }
                        }}
                     />
                  )}
               </form>
            </Form>
         </main>
      </div>
   );
}
