"use client";

/**
 * Transaction List
 * Shows list of payment transactions with filters
 * Used in Profile → Payments section
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PaymentTransaction } from "@/types/payment";
import { TransactionRow } from "./TransactionRow";
import { CreditCard, Loader2, ChevronDown } from "lucide-react";

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

   const filteredTransactions = transactions.filter((t) => {
      if (activeFilter === "all") return true;
      return t.status === activeFilter;
   });

   return (
      <div className={cn("", className)}>
         {/* Filter Tabs */}
         <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
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
                     {activeFilter === "all"
                        ? emptyMessage
                        : `No ${activeFilter} transactions`}
                  </p>
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
