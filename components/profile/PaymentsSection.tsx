"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   CreditCard,
   Building2,
   Smartphone,
   Plus,
   Trash2,
   CheckCircle2,
   AlertCircle,
   ArrowUpRight,
   ArrowDownLeft,
   Clock,
   Shield,
   ExternalLink,
   Loader2,
} from "lucide-react";
import { PaymentMethod, PayoutMethod, Transaction } from "@/types/profile";
import { EscrowWithDetails } from "@/types/payment";
import { EscrowStatusBadge } from "@/components/payments";
import { formatCurrency, getDaysUntilAutoRelease } from "@/lib/utils/payment";
import { getActiveEscrows } from "@/lib/services/payment";

interface PaymentsSectionProps {
   paymentMethods: PaymentMethod[];
   payoutMethods: PayoutMethod[];
   transactions: Transaction[];
   userId?: string;
   onAddPaymentMethod: () => void;
   onAddPayoutMethod: () => void;
   onRemovePaymentMethod: (id: string) => void;
   onRemovePayoutMethod: (id: string) => void;
   onSetDefaultPayment: (id: string) => void;
   onSetDefaultPayout: (id: string) => void;
}

export function PaymentsSection({
   paymentMethods = [],
   payoutMethods = [],
   transactions = [],
   userId,
   onAddPaymentMethod,
   onAddPayoutMethod,
   onRemovePaymentMethod,
   onRemovePayoutMethod,
   onSetDefaultPayment,
   onSetDefaultPayout,
}: PaymentsSectionProps) {
   const [activeTab, setActiveTab] = useState("payment");
   const [activeEscrows, setActiveEscrows] = useState<EscrowWithDetails[]>([]);
   const [escrowsLoading, setEscrowsLoading] = useState(false);

   // Fetch active escrows when escrow tab is selected
   useEffect(() => {
      if (activeTab === "escrow" && userId) {
         setEscrowsLoading(true);
         getActiveEscrows(userId)
            .then(setActiveEscrows)
            .catch(console.error)
            .finally(() => setEscrowsLoading(false));
      }
   }, [activeTab, userId]);

   return (
      <div className="max-w-4xl space-y-4 sm:space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
               Payments
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
               Manage your payment methods, payouts, and view transaction
               history
            </p>
         </div>

         <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
               <TabsTrigger value="payment" className="text-xs sm:text-sm">
                  Methods
               </TabsTrigger>
               <TabsTrigger value="payout" className="text-xs sm:text-sm">
                  Payouts
               </TabsTrigger>
               <TabsTrigger value="escrow" className="text-xs sm:text-sm">
                  Escrow
               </TabsTrigger>
               <TabsTrigger value="history" className="text-xs sm:text-sm">
                  History
               </TabsTrigger>
            </TabsList>

            {/* Payment Methods Tab */}
            <TabsContent value="payment" className="space-y-4 mt-4">
               <div className="bg-white rounded-lg border border-gray-200">
                  {paymentMethods.length > 0 ? (
                     <div className="divide-y divide-gray-100">
                        {paymentMethods.map((method) => (
                           <PaymentMethodRow
                              key={method.id}
                              method={method}
                              onRemove={() => onRemovePaymentMethod(method.id)}
                              onSetDefault={() =>
                                 onSetDefaultPayment(method.id)
                              }
                           />
                        ))}
                     </div>
                  ) : (
                     <div className="px-4 py-6 sm:px-5 sm:py-8 text-center">
                        <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-xs sm:text-sm text-gray-500 mb-4">
                           No payment methods added yet
                        </p>
                        <Button
                           onClick={onAddPaymentMethod}
                           size="sm"
                           className="text-xs h-8 px-3 bg-primary-700"
                        >
                           <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                           Add Payment Method
                        </Button>
                     </div>
                  )}
               </div>

               {paymentMethods.length > 0 && (
                  <Button
                     variant="outline"
                     onClick={onAddPaymentMethod}
                     size="sm"
                     className="w-full sm:w-auto text-xs h-9 bg-primary-700"
                  >
                     <Plus className="w-4 h-4 mr-2" />
                     Add Payment Method
                  </Button>
               )}

               <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <p className="text-[10px] sm:text-xs text-gray-500">
                     Your payment information is securely encrypted. We never
                     store your full card details.
                  </p>
               </div>
            </TabsContent>

            {/* Payout Methods Tab */}
            <TabsContent value="payout" className="space-y-4 mt-4">
               <div className="bg-white rounded-lg border border-gray-200">
                  {payoutMethods.length > 0 ? (
                     <div className="divide-y divide-gray-100">
                        {payoutMethods.map((method) => (
                           <PayoutMethodRow
                              key={method.id}
                              method={method}
                              onRemove={() => onRemovePayoutMethod(method.id)}
                              onSetDefault={() => onSetDefaultPayout(method.id)}
                           />
                        ))}
                     </div>
                  ) : (
                     <div className="px-4 py-6 sm:px-5 sm:py-8 text-center">
                        <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-xs sm:text-sm text-gray-500 mb-2">
                           No payout method added yet
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mb-4">
                           Add a bank account or UPI to receive payments for
                           completed tasks
                        </p>
                        <Button
                           onClick={onAddPayoutMethod}
                           size="sm"
                           className="text-xs h-8 px-3 bg-primary-700"
                        >
                           <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                           Add Payout Method
                        </Button>
                     </div>
                  )}
               </div>

               {payoutMethods.length > 0 && (
                  <Button
                     variant="outline"
                     onClick={onAddPayoutMethod}
                     size="sm"
                     className="w-full sm:w-auto text-xs h-9"
                  >
                     <Plus className="w-4 h-4 mr-2" />
                     Add Payout Method
                  </Button>
               )}

               <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900">
                     Payout Schedule
                  </h4>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                     Payouts are processed within 1-2 business days after task
                     completion. Bank transfers may take an additional 1-3
                     business days.
                  </p>
               </div>
            </TabsContent>

            {/* Transaction History Tab */}
            <TabsContent value="history" className="space-y-4 mt-4">
               <div className="bg-white rounded-lg border border-gray-200">
                  {transactions.length > 0 ? (
                     <div className="divide-y divide-gray-100">
                        {transactions.map((transaction) => (
                           <TransactionRow
                              key={transaction.id}
                              transaction={transaction}
                           />
                        ))}
                     </div>
                  ) : (
                     <div className="px-4 py-6 sm:px-5 sm:py-8 text-center">
                        <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-xs sm:text-sm text-gray-500">
                           No transactions yet
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                           Your payment and payout history will appear here
                        </p>
                     </div>
                  )}
               </div>

               {/* View All Link */}
               <Link
                  href="/profile/payments"
                  className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium"
               >
                  View all transactions & escrows
                  <ExternalLink className="w-3 h-3" />
               </Link>
            </TabsContent>

            {/* Escrow Tab */}
            <TabsContent value="escrow" className="space-y-4 mt-4">
               <div className="bg-white rounded-lg border border-gray-200">
                  {escrowsLoading ? (
                     <div className="px-4 py-8 text-center">
                        <Loader2 className="w-6 h-6 text-gray-400 mx-auto animate-spin" />
                        <p className="text-xs text-gray-500 mt-2">
                           Loading escrows...
                        </p>
                     </div>
                  ) : activeEscrows.length > 0 ? (
                     <div className="divide-y divide-gray-100">
                        {activeEscrows.map((escrow) => (
                           <EscrowRow key={escrow._id} escrow={escrow} />
                        ))}
                     </div>
                  ) : (
                     <div className="px-4 py-6 sm:px-5 sm:py-8 text-center">
                        <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-xs sm:text-sm text-gray-500">
                           No active escrows
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                           Payment protection for your tasks will appear here
                        </p>
                     </div>
                  )}
               </div>

               {/* Info Box */}
               <div className="bg-primary-50 rounded-lg p-3 sm:p-4">
                  <div className="flex gap-2">
                     <Shield className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                     <div>
                        <p className="text-xs sm:text-sm font-medium text-primary-900">
                           Escrow Protection
                        </p>
                        <p className="text-[10px] sm:text-xs text-primary-700 mt-0.5">
                           Funds are securely held until tasks are completed.
                           Auto-release occurs after 7 days if not disputed.
                        </p>
                     </div>
                  </div>
               </div>

               {/* View All Link */}
               <Link
                  href="/profile/payments"
                  className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium"
               >
                  View detailed transactions & history
                  <ExternalLink className="w-3 h-3" />
               </Link>
            </TabsContent>
         </Tabs>
      </div>
   );
}

interface PaymentMethodRowProps {
   method: PaymentMethod;
   onRemove: () => void;
   onSetDefault: () => void;
}

function PaymentMethodRow({
   method,
   onRemove,
   onSetDefault,
}: PaymentMethodRowProps) {
   const [showConfirm, setShowConfirm] = useState(false);

   return (
      <div className="px-4 py-3 sm:px-5 sm:py-4">
         <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
               {method.type === "card" && (
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
               )}
               {method.type === "upi" && (
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
               )}
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                     {method.type === "card" &&
                        `${method.cardBrand?.toUpperCase() || "Card"} •••• ${
                           method.lastFour
                        }`}
                     {method.type === "upi" && method.upiId}
                  </span>
                  {method.isDefault && (
                     <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 shrink-0"
                     >
                        Default
                     </Badge>
                  )}
               </div>
               {method.type === "card" &&
                  method.expiryMonth &&
                  method.expiryYear && (
                     <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                        Expires {method.expiryMonth}/{method.expiryYear}
                     </p>
                  )}
            </div>

            <div className="flex items-center gap-2">
               {!method.isDefault && (
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={onSetDefault}
                     className="text-xs h-8 px-2 sm:px-3 hidden sm:flex"
                  >
                     Set Default
                  </Button>
               )}
               {showConfirm ? (
                  <div className="flex items-center gap-1 sm:gap-2">
                     <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                           onRemove();
                           setShowConfirm(false);
                        }}
                        className="text-xs h-8 px-2 sm:px-3"
                     >
                        Remove
                     </Button>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirm(false)}
                        className="text-xs h-8 px-2 sm:px-3"
                     >
                        Cancel
                     </Button>
                  </div>
               ) : (
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => setShowConfirm(true)}
                     className="text-gray-400 hover:text-red-500 h-8 w-8"
                  >
                     <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
               )}
            </div>
         </div>
      </div>
   );
}

interface PayoutMethodRowProps {
   method: PayoutMethod;
   onRemove: () => void;
   onSetDefault: () => void;
}

function PayoutMethodRow({
   method,
   onRemove,
   onSetDefault,
}: PayoutMethodRowProps) {
   const [showConfirm, setShowConfirm] = useState(false);

   return (
      <div className="px-4 py-3 sm:px-5 sm:py-4">
         <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
               {method.type === "bank" && (
                  <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
               )}
               {method.type === "upi" && (
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
               )}
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                     {method.type === "bank" &&
                        `${method.bankName} •••• ${method.accountNumber?.slice(
                           -4
                        )}`}
                     {method.type === "upi" && method.upiId}
                  </span>
                  {method.isDefault && (
                     <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 shrink-0"
                     >
                        Default
                     </Badge>
                  )}
                  {method.isVerified ? (
                     <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs bg-green-100 text-green-700 shrink-0"
                     >
                        <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                        Verified
                     </Badge>
                  ) : (
                     <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs bg-amber-100 text-amber-700 shrink-0"
                     >
                        <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                        Pending
                     </Badge>
                  )}
               </div>
               {method.type === "bank" && method.accountHolderName && (
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                     {method.accountHolderName}
                  </p>
               )}
            </div>

            <div className="flex items-center gap-2">
               {!method.isDefault && method.isVerified && (
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={onSetDefault}
                     className="text-xs h-8 px-2 sm:px-3 hidden sm:flex"
                  >
                     Set Default
                  </Button>
               )}
               {showConfirm ? (
                  <div className="flex items-center gap-1 sm:gap-2">
                     <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                           onRemove();
                           setShowConfirm(false);
                        }}
                        className="text-xs h-8 px-2 sm:px-3"
                     >
                        Remove
                     </Button>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirm(false)}
                        className="text-xs h-8 px-2 sm:px-3"
                     >
                        Cancel
                     </Button>
                  </div>
               ) : (
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => setShowConfirm(true)}
                     className="text-gray-400 hover:text-red-500 h-8 w-8"
                  >
                     <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
               )}
            </div>
         </div>
      </div>
   );
}

interface TransactionRowProps {
   transaction: Transaction;
}

function TransactionRow({ transaction }: TransactionRowProps) {
   const isCredit =
      transaction.type === "payout" || transaction.type === "refund";

   return (
      <div className="px-4 py-3 sm:px-5 sm:py-4">
         <div className="flex items-center gap-3 sm:gap-4">
            <div
               className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0",
                  isCredit ? "bg-green-100" : "bg-gray-100"
               )}
            >
               {isCredit ? (
                  <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
               ) : (
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
               )}
            </div>

            <div className="flex-1 min-w-0">
               <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {transaction.description}
               </p>
               <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                  {formatDate(transaction.createdAt)}
                  {transaction.taskTitle && ` • ${transaction.taskTitle}`}
               </p>
            </div>

            <div className="text-right shrink-0">
               <p
                  className={cn(
                     "text-xs sm:text-sm font-semibold",
                     isCredit ? "text-green-600" : "text-gray-900"
                  )}
               >
                  {isCredit ? "+" : "-"}₹{transaction.amount.toLocaleString()}
               </p>
               <TransactionStatusBadge status={transaction.status} />
            </div>
         </div>
      </div>
   );
}

function TransactionStatusBadge({ status }: { status: Transaction["status"] }) {
   const config = {
      completed: {
         label: "Completed",
         className: "bg-green-100 text-green-700",
      },
      pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
      failed: { label: "Failed", className: "bg-red-100 text-red-700" },
      cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600" },
   };

   const { label, className } = config[status];

   return (
      <Badge
         variant="secondary"
         className={cn("text-[10px] sm:text-xs mt-1", className)}
      >
         {label}
      </Badge>
   );
}

function formatDate(date: Date | string): string {
   const d = new Date(date);
   return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
   });
}

// Escrow row component for the escrow tab
interface EscrowRowProps {
   escrow: EscrowWithDetails;
}

function EscrowRow({ escrow }: EscrowRowProps) {
   const daysUntilRelease = getDaysUntilAutoRelease(escrow.autoReleaseDate);

   return (
      <Link
         href={`/tasks/${escrow.taskId}`}
         className="block px-4 py-3 sm:px-5 sm:py-4 hover:bg-gray-50 transition-colors"
      >
         <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
               <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>

            <div className="flex-1 min-w-0">
               <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {escrow.taskTitle || `Task #${escrow.taskId}`}
               </p>
               <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  {escrow.performerName
                     ? `Tasker: ${escrow.performerName}`
                     : "Awaiting assignment"}
                  {daysUntilRelease !== null && escrow.status === "held" && (
                     <span className="ml-2 text-blue-600">
                        • Auto-release in {daysUntilRelease} day
                        {daysUntilRelease !== 1 ? "s" : ""}
                     </span>
                  )}
               </p>
            </div>

            <div className="text-right shrink-0">
               <p className="text-xs sm:text-sm font-semibold text-gray-900">
                  {formatCurrency(escrow.amountInRupees)}
               </p>
               <EscrowStatusBadge status={escrow.status} size="sm" />
            </div>
         </div>
      </Link>
   );
}
