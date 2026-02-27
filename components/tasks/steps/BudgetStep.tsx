"use client";

/**
 * Step 3: Budget
 * Budget type, amount, urgency level
 * Using React Hook Form with Zod validation
 */

import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormData } from "../TaskCreationFlow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IndianRupee, Zap, Clock, Calendar } from "lucide-react";

interface BudgetStepProps {
   form: UseFormReturn<TaskFormData>;
   onNext: () => Promise<void>;
}

const URGENCY_OPTIONS = [
   {
      id: "standard",
      label: "Standard",
      description: "No rush, flexible timing",
      badge: null,
      surcharge: 0,
      icon: Calendar,
      color: "gray",
   },
   {
      id: "soon",
      label: "Soon",
      description: "Within 2-3 days",
      badge: "+₹20",
      surcharge: 20,
      icon: Clock,
      color: "primary",
   },
   {
      id: "urgent",
      label: "Urgent",
      description: "Need it done today/tomorrow",
      badge: "+₹50",
      surcharge: 50,
      icon: Zap,
      color: "orange",
   },
];

export function BudgetStep({ form, onNext }: BudgetStepProps) {
   const budgetType = form.watch("budgetType");
   const budget = form.watch("budget");
   const urgency = form.watch("urgency");
   const budgetErrors = form.formState.errors.budget;

   const selectedUrgency = URGENCY_OPTIONS.find((opt) => opt.id === urgency);
   const totalBudget =
      budgetType === "fixed" && budget
         ? budget + (selectedUrgency?.surcharge || 0)
         : null;

   // Check if budget is valid
   const isBudgetValid =
      budgetType === "negotiable" ||
      (budgetType === "fixed" &&
         budget !== null &&
         budget !== undefined &&
         budget >= 50 &&
         budget <= 50000);

   useEffect(() => {
      if (budgetType !== "fixed") {
         form.clearErrors("budget");
         return;
      }

      if (typeof budget === "number" && budget >= 50 && budget <= 50000) {
         form.clearErrors("budget");
      }
   }, [budgetType, budget, form]);

   return (
      <div className="space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
               What's your budget?
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
               Set a fair price or let taskers make offers
            </p>
         </div>

         {/* Budget Type */}
         <FormField
            control={form.control}
            name="budgetType"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Payment approach</FormLabel>
                  <FormControl>
                     <div className="grid grid-cols-2 gap-4">
                        <button
                           type="button"
                           onClick={() => {
                              field.onChange("fixed");
                              form.setValue("budget", null);
                           }}
                           className={cn(
                              "h-16 md:h-24 rounded-xl border-2 p-2.5 md:p-4 text-left transition-all",
                              field.value === "fixed"
                                 ? "border-primary-600 bg-primary-50"
                                 : "border-gray-200 bg-white hover:border-gray-300"
                           )}
                        >
                           <div className="flex flex-col h-full justify-between">
                              <div className="flex items-center gap-2">
                                 <IndianRupee className="size-4 md:size-5 text-gray-700" />
                                 <span className="text-sm font-semibold text-gray-900">
                                    Fixed price
                                 </span>
                              </div>
                              <p className="text-[9px] md:text-xs text-gray-600 mt-2">
                                 You set the price
                              </p>
                           </div>
                           {field.value === "fixed" && (
                              <div className="absolute top-3 right-3">
                                 <svg
                                    className="size-4 md:size-5 text-primary-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                              </div>
                           )}
                        </button>

                        <button
                           type="button"
                           onClick={() => {
                              field.onChange("negotiable");
                              form.setValue("budget", null);
                           }}
                           className={cn(
                              "h-16 md:h-24 rounded-xl border-2 p-2.5 md:p-4 text-left transition-all relative",
                              field.value === "negotiable"
                                 ? "border-primary-600 bg-primary-50"
                                 : "border-gray-200 bg-white hover:border-gray-300"
                           )}
                        >
                           <div className="flex flex-col h-full justify-between">
                              <div className="flex items-center gap-2">
                                 <svg
                                    className="size-4 md:size-5 text-gray-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                    />
                                 </svg>
                                 <span className="text-sm font-semibold text-gray-900">
                                    Negotiable
                                 </span>
                              </div>
                              <p className="text-[9px] md:text-xs text-gray-600 mt-2">
                                 Review offers from taskers
                              </p>
                           </div>
                           {field.value === "negotiable" && (
                              <div className="absolute top-3 right-3">
                                 <svg
                                    className="size-4 md:size-5 text-primary-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                              </div>
                           )}
                        </button>
                     </div>
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Budget Amount (conditional) */}
         {budgetType === "fixed" && (
            <FormField
               control={form.control}
               name="budget"
               render={({ field }) => {
                  const isOutOfRange =
                     field.value !== null &&
                     field.value !== undefined &&
                     (field.value < 50 || field.value > 50000);

                  return (
                     <FormItem className="animate-in slide-in-from-top duration-200">
                        <FormLabel className="text-xs md:text-sm">Your budget</FormLabel>
                        <FormControl>
                           <div className="relative">
                              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 size-4 md:size-5 text-gray-400" />
                              <Input
                                 type="text"
                                 inputMode="numeric"
                                 pattern="[0-9]*"
                                 placeholder="500"
                                 className="h-10 pl-12 text-sm"
                                 value={field.value ?? ""}
                                 onChange={(e) => {
                                    const digits = e.target.value.replace(/[^0-9]/g, "");
                                    if (!digits) {
                                       field.onChange(null);
                                       form.clearErrors("budget");
                                       return;
                                    }

                                    const parsed = parseInt(digits, 10);
                                    field.onChange(parsed);

                                    // Validate and show error if out of range
                                    if (parsed < 50 || parsed > 50000) {
                                       form.setError("budget", {
                                          type: "manual",
                                          message: `Budget must be between ₹50 and ₹50,000. Entered: ₹${parsed}`,
                                       });
                                    } else {
                                       form.clearErrors("budget");
                                    }
                                 }}
                                 onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                       e.preventDefault();
                                    }
                                 }}
                              />
                           </div>
                        </FormControl>
                        <FormDescription className={cn(
                           "text-xs",
                           isOutOfRange && "text-red-600 font-medium"
                        )}>
                          Enter a budget between ₹50 and ₹50,000.
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  );
               }}
            />
         )}

         {/* Urgency */}
         <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">How urgent is this?</FormLabel>
                  <FormControl>
                     <div className="space-y-3">
                        {URGENCY_OPTIONS.map((option) => {
                           const Icon = option.icon;
                           const isSelected = field.value === option.id;

                           return (
                              <button
                                 key={option.id}
                                 type="button"
                                 onClick={() => field.onChange(option.id)}
                                 className={cn(
                                    "w-full h-16 md:h-20 rounded-xl border-2 p-2 md:p-4 text-left transition-all relative",
                                    isSelected
                                       ? "border-primary-600 bg-primary-50"
                                       : "border-gray-200 bg-white hover:border-gray-300"
                                 )}
                              >
                                 <div className="flex items-start gap-4">
                                    <div
                                       className={cn(
                                          "size-8 md:size-10 rounded-lg flex items-center justify-center shrink-0",
                                          option.color === "gray" &&
                                             "bg-gray-100",
                                          option.color === "primary" &&
                                             "bg-primary-100",
                                          option.color === "orange" &&
                                             "bg-orange-100"
                                       )}
                                    >
                                       <Icon
                                          className={cn(
                                             "size-4 md:size-5",
                                             option.color === "gray" &&
                                                "text-gray-600",
                                             option.color === "primary" &&
                                                "text-primary-600",
                                             option.color === "orange" &&
                                                "text-orange-600"
                                          )}
                                       />
                                    </div>
                                    <div className="flex-1">
                                       <div className="flex items-center gap-2 mb-1">
                                          <span className="text-sm md:text-base font-semibold text-gray-900">
                                             {option.label}
                                          </span>
                                          {option.badge && (
                                             <Badge
                                                variant="secondary"
                                                className={cn(
                                                   "h-5 px-2 text-[9px] md:text-xs font-medium",
                                                   option.color === "primary" &&
                                                      "bg-primary-100 text-primary-700",
                                                   option.color === "orange" &&
                                                      "bg-orange-100 text-orange-700"
                                                )}
                                             >
                                                {option.badge}
                                             </Badge>
                                          )}
                                       </div>
                                       <p className="text-xs md:text-sm text-gray-600">
                                          {option.description}
                                       </p>
                                    </div>
                                    {isSelected && (
                                       <div className="absolute top-4 right-4">
                                          <svg
                                             className="w-5 h-5 text-primary-600"
                                             fill="currentColor"
                                             viewBox="0 0 20 20"
                                          >
                                             <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                             />
                                          </svg>
                                       </div>
                                    )}
                                 </div>
                              </button>
                           );
                        })}
                     </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                     Urgent tasks get priority placement
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Total Budget Display */}
         {totalBudget && (
            <div className="p-3 md:p-4 bg-primary-50 border border-primary-200 rounded-lg">
               <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium text-gray-700">
                     Total amount (including urgency fee)
                  </span>
                  <span className="md:text-lg font-bold text-primary-600">
                     ₹{totalBudget}
                  </span>
               </div>
            </div>
         )}

         {/* Continue Button */}
         <div className="pt-2">
            <Button
               type="button"
               onClick={onNext}
               disabled={!isBudgetValid}
               className="w-full h-10 font-medium bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
               size="lg"
            >
               Continue to Review
            </Button>
         </div>
      </div>
   );
}
