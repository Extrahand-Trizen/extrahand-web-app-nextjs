"use client";

/**
 * Transaction List
 * Shows list of payment transactions with filters
 * Used in Profile → Payments section
 */

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentTransaction } from "@/types/payment";
import { TransactionRow } from "./TransactionRow";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import {
   CreditCard,
   Loader2,
   ChevronDown,
   SlidersHorizontal,
   X,
   CalendarIcon,
   IndianRupee,
} from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

interface TransactionListProps {
   transactions: PaymentTransaction[];
   currentUserUid: string;
   isLoading?: boolean;
   hasMore?: boolean;
   onLoadMore?: () => void;
   onViewTask?: (taskId: string) => void;
   emptyMessage?: string;
   className?: string;
}

type StatusFilter = "all" | "completed" | "pending" | "failed";

const filterOptions: { value: StatusFilter; label: string }[] = [
   { value: "all", label: "All" },
   { value: "completed", label: "Completed" },
   { value: "pending", label: "Pending" },
   { value: "failed", label: "Failed" },
];

export function TransactionList({
   transactions,
   currentUserUid,
   isLoading = false,
   hasMore = false,
   onLoadMore,
   onViewTask,
   emptyMessage = "No transactions yet",
   className,
}: TransactionListProps) {
   const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
   const [showRangeFilters, setShowRangeFilters] = useState(false);
   const [dateRange, setDateRange] = useState<DateRange | undefined>();
   const [minAmount, setMinAmount] = useState<string>("");
   const [maxAmount, setMaxAmount] = useState<string>("");

   // Check if any range filters are active
   const hasActiveRangeFilters = useMemo(() => {
      return dateRange?.from || dateRange?.to || minAmount || maxAmount;
   }, [dateRange, minAmount, maxAmount]);

   // Clear all range filters
   const clearRangeFilters = () => {
      setDateRange(undefined);
      setMinAmount("");
      setMaxAmount("");
   };

   const filteredTransactions = useMemo(() => {
      return transactions.filter((t) => {
         // Status filter
         if (activeFilter !== "all" && t.status !== activeFilter) {
            return false;
         }

         // Date range filter
         if (dateRange?.from) {
            const txDate = new Date(t.createdAt);
            const fromDate = new Date(dateRange.from);
            fromDate.setHours(0, 0, 0, 0);
            if (txDate < fromDate) return false;
         }
         if (dateRange?.to) {
            const txDate = new Date(t.createdAt);
            const toDate = new Date(dateRange.to);
            toDate.setHours(23, 59, 59, 999);
            if (txDate > toDate) return false;
         }

         // Amount range filter
         const minAmountNum = parseFloat(minAmount);
         const maxAmountNum = parseFloat(maxAmount);
         if (!isNaN(minAmountNum) && t.amount < minAmountNum) return false;
         if (!isNaN(maxAmountNum) && t.amount > maxAmountNum) return false;

         return true;
      });
   }, [transactions, activeFilter, dateRange, minAmount, maxAmount]);

   return (
      <div className={cn("", className)}>
         {/* Filter Header */}
         <div className="flex items-center justify-between gap-2 mb-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
               {filterOptions.map((option) => (
                  <button
                     key={option.value}
                     onClick={() => setActiveFilter(option.value)}
                     className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap",
                        activeFilter === option.value
                           ? "bg-gray-900 text-white"
                           : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                     )}
                  >
                     {option.label}
                  </button>
               ))}
            </div>

            {/* Range Filter Toggle */}
            <Button
               variant="outline"
               size="sm"
               onClick={() => setShowRangeFilters(!showRangeFilters)}
               className={cn(
                  "shrink-0 text-xs gap-1.5",
                  hasActiveRangeFilters &&
                     "border-primary-500 bg-primary-50 text-primary-700"
               )}
            >
               <SlidersHorizontal className="w-3.5 h-3.5" />
               Filters
               {hasActiveRangeFilters && (
                  <span className="ml-1 bg-primary-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                     {
                        [dateRange?.from, minAmount, maxAmount].filter(Boolean)
                           .length
                     }
                  </span>
               )}
            </Button>
         </div>

         {/* Range Filters Panel */}
         {showRangeFilters && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 space-y-4">
               <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                     Filter by Range
                  </h4>
                  {hasActiveRangeFilters && (
                     <button
                        onClick={clearRangeFilters}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                     >
                        <X className="w-3 h-3" />
                        Clear all
                     </button>
                  )}
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date Range Filter */}
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        Date Range
                     </label>
                     <Popover>
                        <PopoverTrigger asChild>
                           <Button
                              variant="outline"
                              className={cn(
                                 "w-full justify-start text-left font-normal text-xs h-9",
                                 !dateRange?.from && "text-gray-400"
                              )}
                           >
                              {dateRange?.from ? (
                                 dateRange.to ? (
                                    <>
                                       {format(dateRange.from, "dd MMM yyyy")} -{" "}
                                       {format(dateRange.to, "dd MMM yyyy")}
                                    </>
                                 ) : (
                                    format(dateRange.from, "dd MMM yyyy")
                                 )
                              ) : (
                                 "Select date range"
                              )}
                           </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                           <Calendar
                              mode="range"
                              selected={dateRange}
                              onSelect={setDateRange}
                              numberOfMonths={1}
                              disabled={{ after: new Date() }}
                           />
                           {dateRange?.from && (
                              <div className="p-3 pt-0 border-t">
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full text-xs"
                                    onClick={() => setDateRange(undefined)}
                                 >
                                    Clear dates
                                 </Button>
                              </div>
                           )}
                        </PopoverContent>
                     </Popover>
                  </div>

                  {/* Amount Range Filter */}
                  <div className="space-y-2">
                     <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5" />
                        Amount Range
                     </label>
                     <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                           <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                              ₹
                           </span>
                           <Input
                              type="number"
                              placeholder="Min"
                              value={minAmount}
                              onChange={(e) => setMinAmount(e.target.value)}
                              className="pl-6 h-9 text-xs"
                              min="0"
                           />
                        </div>
                        <span className="text-gray-400 text-xs">to</span>
                        <div className="relative flex-1">
                           <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                              ₹
                           </span>
                           <Input
                              type="number"
                              placeholder="Max"
                              value={maxAmount}
                              onChange={(e) => setMaxAmount(e.target.value)}
                              className="pl-6 h-9 text-xs"
                              min="0"
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Active filters summary */}
               {hasActiveRangeFilters && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                     {dateRange?.from && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
                           <CalendarIcon className="w-3 h-3" />
                           {dateRange.to
                              ? `${format(dateRange.from, "dd MMM")} - ${format(
                                   dateRange.to,
                                   "dd MMM"
                                )}`
                              : `From ${format(dateRange.from, "dd MMM")}`}
                           <button
                              onClick={() => setDateRange(undefined)}
                              className="ml-1 hover:text-gray-900"
                           >
                              <X className="w-3 h-3" />
                           </button>
                        </span>
                     )}
                     {(minAmount || maxAmount) && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
                           <IndianRupee className="w-3 h-3" />
                           {minAmount && maxAmount
                              ? `₹${minAmount} - ₹${maxAmount}`
                              : minAmount
                              ? `Min ₹${minAmount}`
                              : `Max ₹${maxAmount}`}
                           <button
                              onClick={() => {
                                 setMinAmount("");
                                 setMaxAmount("");
                              }}
                              className="ml-1 hover:text-gray-900"
                           >
                              <X className="w-3 h-3" />
                           </button>
                        </span>
                     )}
                  </div>
               )}
            </div>
         )}

         {/* Transaction List */}
         <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {isLoading && transactions.length === 0 ? (
               <div className="px-4 py-12 text-center">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">
                     Loading transactions...
                  </p>
               </div>
            ) : filteredTransactions.length === 0 ? (
               <div className="px-4 py-12 text-center">
                  <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                     {hasActiveRangeFilters
                        ? "No transactions match your filters"
                        : activeFilter === "all"
                        ? emptyMessage
                        : `No ${activeFilter} transactions`}
                  </p>
                  {hasActiveRangeFilters && (
                     <Button
                        variant="link"
                        size="sm"
                        onClick={clearRangeFilters}
                        className="mt-2 text-xs"
                     >
                        Clear filters
                     </Button>
                  )}
               </div>
            ) : (
               <div className="divide-y divide-gray-100">
                  {filteredTransactions.map((transaction) => (
                     <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                        currentUserUid={currentUserUid}
                        onViewTask={onViewTask}
                     />
                  ))}
               </div>
            )}

            {/* Load More */}
            {hasMore && !isLoading && (
               <div className="px-4 py-3 border-t border-gray-100">
                  <Button
                     onClick={onLoadMore}
                     variant="ghost"
                     size="sm"
                     className="w-full text-gray-600"
                  >
                     Load more
                     <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
               </div>
            )}

            {isLoading && transactions.length > 0 && (
               <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin mx-auto" />
               </div>
            )}
         </div>
      </div>
   );
}
