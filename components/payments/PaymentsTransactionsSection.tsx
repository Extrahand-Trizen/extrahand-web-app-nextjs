"use client";

/**
 * Payments & Transactions Section
 * Complete section for Profile → Payments page
 * Shows transaction history and payment management
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentTransaction } from "@/types/payment";
import { TransactionList } from "./TransactionList";
import { formatCurrency } from "@/lib/utils/payment";
import { ArrowUpRight, Settings, TrendingUp } from "lucide-react";

interface PaymentsTransactionsSectionProps {
   currentUserUid: string;
   transactions: PaymentTransaction[];
   isLoading?: boolean;
   hasMoreTransactions?: boolean;
   onLoadMoreTransactions?: () => void;
   onViewTask?: (taskId: string) => void;
   onManagePaymentMethods?: () => void;
   className?: string;
}

export function PaymentsTransactionsSection({
   currentUserUid,
   transactions,
   isLoading = false,
   hasMoreTransactions = false,
   onLoadMoreTransactions,
   onViewTask,
   onManagePaymentMethods,
   className,
}: PaymentsTransactionsSectionProps) {
   const [activeTab, setActiveTab] = useState("all");

   // Calculate summaries
   const outgoingTransactions = transactions.filter(
      (t) => t.type === "payment"
   );
   const incomingTransactions = transactions.filter((t) => t.type === "payout");
   const refundTransactions = transactions.filter((t) => t.type === "refund");

   const totalOutgoing = outgoingTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
   );
   const totalEarnings = incomingTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
   );

   // Filter based on active tab
   const filteredTransactions =
      activeTab === "all"
         ? transactions
         : activeTab === "outgoing"
         ? outgoingTransactions
         : activeTab === "earnings"
         ? incomingTransactions
         : refundTransactions;

   return (
      <div className={cn("max-w-4xl space-y-6", className)}>
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Payments & Transactions
               </h2>
               <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Track your payments and transaction history
               </p>
            </div>
            {onManagePaymentMethods && (
               <Button
                  onClick={onManagePaymentMethods}
                  variant="outline"
                  size="sm"
                  className="text-xs"
               >
                  <Settings className="w-3.5 h-3.5 mr-1.5" />
                  Payment Methods
               </Button>
            )}
         </div>

         {/* Summary Cards */}
         <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
               <div className="flex items-center gap-2 mb-2">
                  <ArrowUpRight className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-gray-500">Total Spent</span>
               </div>
               <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(totalOutgoing)}
               </p>
               <p className="text-xs text-gray-400 mt-1">
                  {outgoingTransactions.length} payments
               </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
               <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-gray-500">Total Earnings</span>
               </div>
               <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(totalEarnings)}
               </p>
               <p className="text-xs text-gray-400 mt-1">
                  {incomingTransactions.length} payouts
               </p>
            </div>
         </div>

         {/* Tabs */}
         <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
               <TabsTrigger value="all" className="text-xs sm:text-sm">
                  All
               </TabsTrigger>
               <TabsTrigger value="outgoing" className="text-xs sm:text-sm">
                  Outgoing
                  {outgoingTransactions.length > 0 && (
                     <span className="ml-1.5 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full hidden sm:inline">
                        {outgoingTransactions.length}
                     </span>
                  )}
               </TabsTrigger>
               <TabsTrigger value="earnings" className="text-xs sm:text-sm">
                  Earnings
                  {incomingTransactions.length > 0 && (
                     <span className="ml-1.5 bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full hidden sm:inline">
                        {incomingTransactions.length}
                     </span>
                  )}
               </TabsTrigger>
               <TabsTrigger value="refunds" className="text-xs sm:text-sm">
                  Refunds
               </TabsTrigger>
            </TabsList>

            {/* All Transactions */}
            <TabsContent value="all" className="mt-4">
               <TransactionList
                  transactions={filteredTransactions}
                  currentUserUid={currentUserUid}
                  isLoading={isLoading}
                  hasMore={hasMoreTransactions}
                  onLoadMore={onLoadMoreTransactions}
                  onViewTask={onViewTask}
                  emptyMessage="No transactions yet"
               />
            </TabsContent>

            {/* Outgoing Tab */}
            <TabsContent value="outgoing" className="mt-4">
               <TransactionList
                  transactions={filteredTransactions}
                  currentUserUid={currentUserUid}
                  isLoading={isLoading}
                  hasMore={false}
                  onViewTask={onViewTask}
                  emptyMessage="No outgoing payments yet"
               />
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="mt-4">
               <TransactionList
                  transactions={filteredTransactions}
                  currentUserUid={currentUserUid}
                  isLoading={isLoading}
                  hasMore={false}
                  onViewTask={onViewTask}
                  emptyMessage="No earnings yet"
               />
            </TabsContent>

            {/* Refunds Tab */}
            <TabsContent value="refunds" className="mt-4">
               <TransactionList
                  transactions={filteredTransactions}
                  currentUserUid={currentUserUid}
                  isLoading={isLoading}
                  hasMore={false}
                  onViewTask={onViewTask}
                  emptyMessage="No refunds"
               />
            </TabsContent>
         </Tabs>

         {/* Footer Info */}
         <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">
               All payments are processed securely through Razorpay. For any
               payment issues, please contact support.
            </p>
         </div>
      </div>
   );
}
