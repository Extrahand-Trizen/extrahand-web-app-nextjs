"use client";

/**
 * Payments & Transactions Section
 * Complete section for Profile → Payments page
 * Shows escrow history, transactions, and payment management
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   TransactionWithDetails,
   EscrowWithDetails,
   PaymentUserRole,
} from "@/types/payment";
import { TransactionList } from "./TransactionList";
import { EscrowStatusBadge } from "./EscrowStatusBadge";
import {
   formatCurrency,
   formatShortDate,
   formatTransactionId,
} from "@/lib/utils/payment";
import {
   CreditCard,
   Clock,
   Lock,
   CheckCircle,
   ArrowRight,
   ExternalLink,
   Loader2,
   Settings,
} from "lucide-react";

interface PaymentsTransactionsSectionProps {
   currentUserUid: string;
   transactions: TransactionWithDetails[];
   activeEscrows: EscrowWithDetails[];
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
   activeEscrows,
   isLoading = false,
   hasMoreTransactions = false,
   onLoadMoreTransactions,
   onViewTask,
   onManagePaymentMethods,
   className,
}: PaymentsTransactionsSectionProps) {
   const [activeTab, setActiveTab] = useState("transactions");

   const pendingEscrows = activeEscrows.filter(
      (e) => e.status === "pending" || e.status === "held"
   );
   const totalHeld = pendingEscrows
      .filter((e) => e.status === "held")
      .reduce((sum, e) => sum + e.amountInRupees, 0);

   return (
      <div className={cn("max-w-4xl space-y-6", className)}>
         {/* Header */}
         <div className="flex items-center justify-between">
            <div>
               <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Payments & Transactions
               </h2>
               <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Track your payments, escrows, and transaction history
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
         {pendingEscrows.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                     <Lock className="w-4 h-4 text-blue-600" />
                     <span className="text-xs text-gray-500">In Escrow</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                     {formatCurrency(totalHeld)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                     {pendingEscrows.filter((e) => e.status === "held").length}{" "}
                     active
                  </p>
               </div>
               <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                     <Clock className="w-4 h-4 text-yellow-600" />
                     <span className="text-xs text-gray-500">Pending</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                     {
                        pendingEscrows.filter((e) => e.status === "pending")
                           .length
                     }
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Awaiting payment</p>
               </div>
            </div>
         )}

         {/* Tabs */}
         <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
               <TabsTrigger value="transactions" className="text-xs sm:text-sm">
                  Transactions
               </TabsTrigger>
               <TabsTrigger value="escrows" className="text-xs sm:text-sm">
                  Active Escrows
                  {pendingEscrows.length > 0 && (
                     <span className="ml-1.5 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">
                        {pendingEscrows.length}
                     </span>
                  )}
               </TabsTrigger>
            </TabsList>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-4">
               <TransactionList
                  transactions={transactions}
                  currentUserUid={currentUserUid}
                  isLoading={isLoading}
                  hasMore={hasMoreTransactions}
                  onLoadMore={onLoadMoreTransactions}
                  onViewTask={onViewTask}
               />
            </TabsContent>

            {/* Active Escrows Tab */}
            <TabsContent value="escrows" className="mt-4">
               <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  {isLoading && activeEscrows.length === 0 ? (
                     <div className="px-4 py-12 text-center">
                        <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
                        <p className="text-sm text-gray-500 mt-2">
                           Loading escrows...
                        </p>
                     </div>
                  ) : pendingEscrows.length === 0 ? (
                     <div className="px-4 py-12 text-center">
                        <Lock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">
                           No active escrows
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                           Escrows are created when you accept offers
                        </p>
                     </div>
                  ) : (
                     <div className="divide-y divide-gray-100">
                        {pendingEscrows.map((escrow) => (
                           <EscrowRow
                              key={escrow._id}
                              escrow={escrow}
                              currentUserUid={currentUserUid}
                              onViewTask={onViewTask}
                           />
                        ))}
                     </div>
                  )}
               </div>
            </TabsContent>
         </Tabs>

         {/* Footer Info */}
         <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">
               All payments are processed securely through Razorpay. Escrow
               funds are held until task completion is confirmed. For any
               payment issues, please contact support.
            </p>
         </div>
      </div>
   );
}

// Internal component for escrow rows
function EscrowRow({
   escrow,
   currentUserUid,
   onViewTask,
}: {
   escrow: EscrowWithDetails;
   currentUserUid: string;
   onViewTask?: (taskId: string) => void;
}) {
   const isPoster = escrow.posterUid === currentUserUid;

   return (
      <div className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
         <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
               className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                  escrow.status === "held" && "bg-blue-50",
                  escrow.status === "pending" && "bg-yellow-50"
               )}
            >
               {escrow.status === "held" ? (
                  <Lock className="w-4 h-4 text-blue-600" />
               ) : (
                  <Clock className="w-4 h-4 text-yellow-600" />
               )}
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-gray-900 truncate">
                  {escrow.taskTitle || `Task #${escrow.taskId.slice(-6)}`}
               </p>
               <p className="text-xs text-gray-500">
                  {isPoster
                     ? `To: ${escrow.performerName || "Tasker"}`
                     : `From: ${escrow.posterName || "Poster"}`}
               </p>
            </div>
         </div>
         <div className="flex items-center gap-3">
            <div className="text-right">
               <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(escrow.amountInRupees)}
               </p>
               <EscrowStatusBadge
                  status={escrow.status}
                  size="sm"
                  showIcon={false}
               />
            </div>
            {onViewTask && (
               <Button
                  onClick={() => onViewTask(escrow.taskId)}
                  variant="ghost"
                  size="icon-sm"
                  className="text-gray-400 hover:text-gray-600"
               >
                  <ExternalLink className="w-4 h-4" />
               </Button>
            )}
         </div>
      </div>
   );
}
