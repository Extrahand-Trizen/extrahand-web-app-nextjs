"use client";

/**
 * MakeOfferModal - Modal for submitting an offer/application for a task
 * Uses React Hook Form + Zod validation
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
   FormDescription,
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
import { getOfferSubmissionVerificationStatus } from "@/lib/utils/verificationGate";
import { useAuth } from "@/lib/auth/context";
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
   const router = useRouter();
   const { userData } = useAuth();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [showVerificationModal, setShowVerificationModal] = useState(false);
   const [experienceInput, setExperienceInput] = useState("");
   const [portfolioInput, setPortfolioInput] = useState("");
   const [rangeStart, setRangeStart] = useState("");
   const [rangeEnd, setRangeEnd] = useState("");
   const verificationStatus = getOfferSubmissionVerificationStatus(userData ?? null);

   const taskBudget =
      typeof task.budget === "object" ? task.budget.amount : task.budget;

   const isRecurring = Boolean(
      task.recurring?.enabled && Array.isArray(task.schedule) && task.schedule.length > 0
   );
   const openSchedule = Array.isArray(task.schedule)
      ? task.schedule.filter((entry) => entry.status === "open")
      : [];

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
         selectedDates: [],
         coverLetter: "",
         relevantExperience: [],
         portfolio: [],
      },
   });

   const relevantExperience = form.watch("relevantExperience") || [];
   const portfolio = form.watch("portfolio") || [];
   const selectedDates = form.watch("selectedDates") || [];
   const openDates = openSchedule.map((entry) => new Date(entry.date));
   const openDatesSorted = [...openDates].sort((a, b) => a.getTime() - b.getTime());
   const minOpenDate = openDatesSorted[0];
   const maxOpenDate = openDatesSorted[openDatesSorted.length - 1];

   const toDateInputValue = (date?: Date) => {
      if (!date) return "";
      return date.toISOString().slice(0, 10);
   };

   const normalizeDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

   const applyRangeSelection = (startValue: string, endValue: string) => {
      if (!startValue || !endValue) return;
      const start = new Date(`${startValue}T00:00:00`);
      const end = new Date(`${endValue}T00:00:00`);
      const startDay = normalizeDate(start);
      const endDay = normalizeDate(end);
      const rangeStartDate = startDay <= endDay ? startDay : endDay;
      const rangeEndDate = startDay <= endDay ? endDay : startDay;

      const next = openDates.filter((date) => {
         const day = normalizeDate(date);
         return day >= rangeStartDate && day <= rangeEndDate;
      });

      setSelectedDates(next);
   };

   const setSelectedDates = (dates: Date[]) => {
      form.setValue("selectedDates", dates, { shouldValidate: true });
   };

   const selectWeekdays = () => {
      setSelectedDates(openDates.filter((date) => ![0, 6].includes(date.getDay())));
   };

   const selectWeekends = () => {
      setSelectedDates(openDates.filter((date) => [0, 6].includes(date.getDay())));
   };

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

      if (isRecurring && (!data.selectedDates || data.selectedDates.length === 0)) {
         toast.error("Please select at least one date");
         return;
      }

      // Background check: Aadhaar, PAN, and bank must be verified to apply
      if (!verificationStatus.allowed) {
         setShowVerificationModal(true);
         return;
      }

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
            selectedDates: data.selectedDates?.length ? data.selectedDates : undefined,
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
      } catch (error: any) {
         console.error("Error submitting offer:", error);
         const isUnauthorized = error?.status === 401 || error?.status === 403;
         if (isUnauthorized) {
            toast.error("Session expired", {
               description:
                  "Please log in again to submit an offer. Your session may have expired.",
            });
         } else {
            toast.error("Failed to submit offer", {
               description: getErrorMessage(error),
            });
         }
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <>
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
                     {isRecurring && (
                        <FormField
                           control={form.control}
                           name="selectedDates"
                           render={() => (
                              <FormItem>
                                 <FormLabel className="flex items-center gap-2 text-sm font-semibold text-secondary-900">
                                    <Calendar className="w-4 h-4" />
                                    Select dates you can take
                                 </FormLabel>
                                 <FormControl>
                                    <div className="space-y-2">
                                       {openSchedule.length > 0 && (
                                          <div className="space-y-2">
                                             <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                                <div>
                                                   <FormLabel className="text-xs text-secondary-600">
                                                      Start date
                                                   </FormLabel>
                                                   <Input
                                                      type="date"
                                                      value={rangeStart}
                                                      min={toDateInputValue(minOpenDate)}
                                                      max={toDateInputValue(maxOpenDate)}
                                                      onChange={(event) => {
                                                         const value = event.target.value;
                                                         setRangeStart(value);
                                                         applyRangeSelection(value, rangeEnd);
                                                      }}
                                                      className="h-9 text-sm"
                                                   />
                                                </div>
                                                <div>
                                                   <FormLabel className="text-xs text-secondary-600">
                                                      End date
                                                   </FormLabel>
                                                   <Input
                                                      type="date"
                                                      value={rangeEnd}
                                                      min={toDateInputValue(minOpenDate)}
                                                      max={toDateInputValue(maxOpenDate)}
                                                      onChange={(event) => {
                                                         const value = event.target.value;
                                                         setRangeEnd(value);
                                                         applyRangeSelection(rangeStart, value);
                                                      }}
                                                      className="h-9 text-sm"
                                                   />
                                                </div>
                                             </div>
                                             <div className="flex flex-wrap gap-2">
                                                <Button
                                                   type="button"
                                                   variant="outline"
                                                   size="sm"
                                                   onClick={() => setSelectedDates(openDates)}
                                                >
                                                   Select all
                                                </Button>
                                                <Button
                                                   type="button"
                                                   variant="outline"
                                                   size="sm"
                                                   onClick={() => setSelectedDates([])}
                                                >
                                                   Clear
                                                </Button>
                                                <Button
                                                   type="button"
                                                   variant="outline"
                                                   size="sm"
                                                   onClick={selectWeekdays}
                                                >
                                                   Weekdays
                                                </Button>
                                                <Button
                                                   type="button"
                                                   variant="outline"
                                                   size="sm"
                                                   onClick={selectWeekends}
                                                >
                                                   Weekends
                                                </Button>
                                             </div>
                                          </div>
                                       )}
                                       <div className="max-h-48 overflow-y-auto rounded-lg border border-secondary-200 p-3">
                                       {openSchedule.length === 0 && (
                                          <p className="text-xs text-secondary-500">
                                             No open dates available right now.
                                          </p>
                                       )}
                                       {openSchedule.map((entry) => {
                                          const entryDate = new Date(entry.date);
                                          const key = entryDate.toISOString();
                                          const isChecked = selectedDates.some(
                                             (d: Date) => new Date(d).toDateString() === entryDate.toDateString()
                                          );

                                          return (
                                             <label
                                                key={key}
                                                className="flex items-center gap-3 text-xs text-secondary-700"
                                             >
                                                <Checkbox
                                                   checked={isChecked}
                                                   onCheckedChange={(checked) => {
                                                      const next = checked
                                                         ? [...selectedDates, entryDate]
                                                         : selectedDates.filter(
                                                              (d: Date) =>
                                                                 new Date(d).toDateString() !==
                                                                 entryDate.toDateString()
                                                           );
                                                      form.setValue("selectedDates", next, {
                                                         shouldValidate: true,
                                                      });
                                                   }}
                                                />
                                                <span>
                                                   {entryDate.toLocaleDateString("en-US", {
                                                      weekday: "short",
                                                      month: "short",
                                                      day: "numeric",
                                                   })}
                                                </span>
                                             </label>
                                          );
                                       })}
                                       </div>
                                    </div>
                                 </FormControl>
                                 <FormDescription className="text-xs text-secondary-600">
                                    Choose one or more dates from the poster&apos;s range.
                                 </FormDescription>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     )}

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
                                 min="50"
                                 max="50000"
                                 value={field.value || ""}
                                 onChange={(e) => {
                                    const val = e.target.value === ""
                                       ? 0
                                       : Number(e.target.value);
                                    field.onChange(val);
                                 }}
                                 onBlur={field.onBlur}
                                 className="h-11"
                              />
                           </FormControl>
                           <FormDescription className="text-xs text-secondary-600">
                              Minimum ₹50, maximum ₹50,000
                           </FormDescription>
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
                                 Estimated Duration
                              </FormLabel>
                              <FormControl>
                                 <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                       <div className="flex items-center gap-2">
                                          <Input
                                             type="number"
                                             placeholder="0"
                                             min="0"
                                             max="365"
                                             step="1"
                                             inputMode="numeric"
                                             className="h-10 text-sm flex-1"
                                             value={field.value ? Math.floor(field.value / 24) : ""}
                                             onChange={(e) => {
                                                const days = e.target.value === "" ? 0 : parseFloat(e.target.value);
                                                const hours = field.value ? (field.value % 24) : 0;
                                                const total = days * 24 + hours;
                                                field.onChange(total === 0 ? undefined : total);
                                             }}
                                          />
                                          <span className="text-xs text-secondary-600 font-medium min-w-fit">
                                             days
                                          </span>
                                       </div>
                                    </div>
                                    <div className="flex-1">
                                       <div className="flex items-center gap-2">
                                          <Input
                                             type="number"
                                             placeholder="0"
                                             min="0"
                                             max="23"
                                             step="1"
                                             inputMode="numeric"
                                             className="h-10 text-sm flex-1"
                                             value={field.value ? Math.floor(field.value % 24) : ""}
                                             onChange={(e) => {
                                                const hours = e.target.value === "" ? 0 : parseFloat(e.target.value);
                                                const days = field.value ? Math.floor(field.value / 24) : 0;
                                                const total = days * 24 + hours;
                                                field.onChange(total === 0 ? undefined : total);
                                             }}
                                          />
                                          <span className="text-xs text-secondary-600 font-medium min-w-fit">
                                             hours
                                          </span>
                                       </div>
                                    </div>
                                 </div>
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

      {/* Verification required: Aadhaar, PAN, Bank */}
      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Verification required to apply</DialogTitle>
               <DialogDescription>
                  To submit an offer, your Aadhaar, PAN, and bank account must be
                  verified. Please complete the following in your profile:
               </DialogDescription>
            </DialogHeader>
            <ul className="list-disc list-inside text-sm text-secondary-700 space-y-1">
               {verificationStatus.missing.map((item) => (
                  <li key={item}>{item}</li>
               ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-4">
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
                     onOpenChange(false);
                     router.push("/profile?section=verifications");
                  }}
               >
                  Complete verification
               </Button>
            </div>
         </DialogContent>
      </Dialog>
      </>
   );
}
