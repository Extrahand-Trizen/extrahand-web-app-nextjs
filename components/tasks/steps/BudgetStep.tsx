"use client";

/**
 * Step 3: Budget
 * Budget type, amount, urgency level
 * Using React Hook Form with Zod validation
 */

import React from "react";
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
      color: "blue",
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

   const selectedUrgency = URGENCY_OPTIONS.find((opt) => opt.id === urgency);
   const totalBudget =
      budgetType === "fixed" && budget
         ? budget + (selectedUrgency?.surcharge || 0)
         : null;

   return (
      <div className="space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
               What's your budget?
            </h2>
            <p className="text-sm text-gray-600">
               Set a fair price or let taskers make offers
            </p>
         </div>

         {/* Budget Type */}
         <FormField
            control={form.control}
            name="budgetType"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Payment approach</FormLabel>
                  <FormControl>
                     <div className="grid grid-cols-2 gap-4">
                        <button
                           type="button"
                           onClick={() => {
                              field.onChange("fixed");
                              form.setValue("budget", null);
                           }}
                           className={cn(
                              "h-24 rounded-xl border-2 p-4 text-left transition-all",
                              field.value === "fixed"
                                 ? "border-blue-600 bg-blue-50"
                                 : "border-gray-200 bg-white hover:border-gray-300"
                           )}
                        >
                           <div className="flex flex-col h-full justify-between">
                              <div className="flex items-center gap-2">
                                 <IndianRupee className="w-5 h-5 text-gray-700" />
                                 <span className="text-base font-semibold text-gray-900">
                                    Fixed price
                                 </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                 You set the price
                              </p>
                           </div>
                           {field.value === "fixed" && (
                              <div className="absolute top-3 right-3">
                                 <svg
                                    className="w-5 h-5 text-blue-600"
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
                              "h-24 rounded-xl border-2 p-4 text-left transition-all relative",
                              field.value === "negotiable"
                                 ? "border-blue-600 bg-blue-50"
                                 : "border-gray-200 bg-white hover:border-gray-300"
                           )}
                        >
                           <div className="flex flex-col h-full justify-between">
                              <div className="flex items-center gap-2">
                                 <svg
                                    className="w-5 h-5 text-gray-700"
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
                                 <span className="text-base font-semibold text-gray-900">
                                    Negotiable
                                 </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-2">
                                 Review offers from taskers
                              </p>
                           </div>
                           {field.value === "negotiable" && (
                              <div className="absolute top-3 right-3">
                                 <svg
                                    className="w-5 h-5 text-blue-600"
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
               render={({ field }) => (
                  <FormItem className="animate-in slide-in-from-top duration-200">
                     <FormLabel>Your budget</FormLabel>
                     <FormControl>
                        <div className="relative">
                           <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <Input
                              type="number"
                              placeholder="500"
                              min="50"
                              max="50000"
                              className="h-12 pl-12 text-lg"
                              value={field.value || ""}
                              onChange={(e) =>
                                 field.onChange(
                                    e.target.value
                                       ? parseFloat(e.target.value)
                                       : null
                                 )
                              }
                           />
                        </div>
                     </FormControl>
                     <FormDescription>
                        Minimum ₹50, maximum ₹50,000. Similar tasks typically
                        cost ₹200-800.
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
         )}

         {/* Urgency */}
         <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>How urgent is this?</FormLabel>
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
                                    "w-full h-20 rounded-xl border-2 p-4 text-left transition-all relative",
                                    isSelected
                                       ? "border-blue-600 bg-blue-50"
                                       : "border-gray-200 bg-white hover:border-gray-300"
                                 )}
                              >
                                 <div className="flex items-start gap-4">
                                    <div
                                       className={cn(
                                          "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                          option.color === "gray" &&
                                             "bg-gray-100",
                                          option.color === "blue" &&
                                             "bg-blue-100",
                                          option.color === "orange" &&
                                             "bg-orange-100"
                                       )}
                                    >
                                       <Icon
                                          className={cn(
                                             "w-5 h-5",
                                             option.color === "gray" &&
                                                "text-gray-600",
                                             option.color === "blue" &&
                                                "text-blue-600",
                                             option.color === "orange" &&
                                                "text-orange-600"
                                          )}
                                       />
                                    </div>
                                    <div className="flex-1">
                                       <div className="flex items-center gap-2 mb-1">
                                          <span className="text-base font-semibold text-gray-900">
                                             {option.label}
                                          </span>
                                          {option.badge && (
                                             <Badge
                                                variant="secondary"
                                                className={cn(
                                                   "h-5 px-2 text-xs font-medium",
                                                   option.color === "blue" &&
                                                      "bg-blue-100 text-blue-700",
                                                   option.color === "orange" &&
                                                      "bg-orange-100 text-orange-700"
                                                )}
                                             >
                                                {option.badge}
                                             </Badge>
                                          )}
                                       </div>
                                       <p className="text-sm text-gray-600">
                                          {option.description}
                                       </p>
                                    </div>
                                    {isSelected && (
                                       <div className="absolute top-4 right-4">
                                          <svg
                                             className="w-5 h-5 text-blue-600"
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
                  <FormDescription>
                     Urgent tasks get priority placement
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Total Budget Display */}
         {totalBudget && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                     Total amount (including urgency fee)
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                     ₹{totalBudget}
                  </span>
               </div>
            </div>
         )}

         {/* Continue Button */}
         <div className="pt-4">
            <Button
               type="button"
               onClick={onNext}
               className="w-full h-12 font-medium bg-blue-600 hover:bg-blue-700"
               size="lg"
            >
               Continue to Review
            </Button>
         </div>
      </div>
   );
}
