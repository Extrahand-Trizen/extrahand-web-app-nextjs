"use client";

/**
 * Payments Section
 * Manage payment methods, payouts, and transaction history
 */

import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   CreditCard,
   Building2,
   Smartphone,
   Plus,
   Trash2,
   CheckCircle2,
   ArrowUpRight,
   ArrowDownLeft,
   Clock,
   TrendingUp,
   Wallet,
   Download,
   SlidersHorizontal,
   X,
   CalendarIcon,
   IndianRupee,
   FileText,
   FileSpreadsheet,
} from "lucide-react";
import { PaymentMethod, PayoutMethod, Transaction } from "@/types/profile";
import { mockTransactions } from "@/lib/data/payments";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";
import { usePaymentsStore } from "@/lib/state/paymentsStore";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { paymentApi } from "@/lib/api/endpoints/payment";
import { profilesApi } from "@/lib/api/endpoints/profiles";
import {
   exportTransactionsToPdf,
   exportTransactionsToExcel,
} from "@/lib/exportTransactions";
import { AddBankAccountModal } from "./AddBankAccountModal";
import { BankAccountBanner } from "./BankAccountBanner";
import { PayoutHistory } from "./PayoutHistory";
import { useBankAccounts } from "@/lib/hooks/usePayments";

interface PaymentsSectionProps {
   paymentMethods?: PaymentMethod[];
   payoutMethods?: PayoutMethod[];
   transactions?: Transaction[];
   userId?: string;
   onRemovePaymentMethod?: (id: string) => void;
   onRemovePayoutMethod?: (id: string) => void;
   onSetDefaultPayment?: (id: string) => void;
   onSetDefaultPayout?: (id: string) => void;
   onSavePaymentMethod?: (data: Partial<PaymentMethod>) => void;
   onSavePayoutMethod?: (data: Partial<PayoutMethod>) => void;
}

export function PaymentsSection({
   paymentMethods = [],
   payoutMethods = [],
   transactions: initialTransactions,
   userId,
   onRemovePaymentMethod,
   onRemovePayoutMethod,
   onSetDefaultPayment,
   onSetDefaultPayout,
   onSavePaymentMethod,
   onSavePayoutMethod,
}: PaymentsSectionProps) {
   const { currentUser, userData } = useAuth();
   const {
      bankAccounts,
      hasBankAccount,
      loading: bankLoading,
      refetch: refetchBankAccounts,
      setDefaultBankAccount,
      deleteBankAccount,
   } = useBankAccounts();
   const [activeTab, setActiveTab] = useState("methods");
   const [transactionFilter, setTransactionFilter] = useState<
      "all" | "outgoing" | "earnings"
   >("all");

   const {
      transactions,
      totalEarnings,
      totalSpent,
      loading,
      fetchPayments,
   } = usePaymentsStore();

   // Range filter state
   const [showRangeFilters, setShowRangeFilters] = useState(false);
   const [dateRange, setDateRange] = useState<DateRange | undefined>();
   const [minAmount, setMinAmount] = useState<string>("");
   const [maxAmount, setMaxAmount] = useState<string>("");
   const [pendingPenaltyTotal, setPendingPenaltyTotal] = useState<number>(0);
   const [pendingPenaltyItems, setPendingPenaltyItems] = useState<
      Array<{
         penaltyId: string;
         taskId: string;
         taskTitle: string | null;
         remainingAmount: string;
      }>
   >([]);

   // Internal modal state
   const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
   const [showPayoutMethodModal, setShowPayoutMethodModal] = useState(false);
   const [showBankAccountModal, setShowBankAccountModal] = useState(false);
   const [selectedTransaction, setSelectedTransaction] =
      useState<Transaction | null>(null);
   const [settingPaymentMethodId, setSettingPaymentMethodId] = useState<
      string | null
   >(null);
   const [settingPayoutBankId, setSettingPayoutBankId] = useState<
      string | null
   >(null);
   const [deletingPayoutBankId, setDeletingPayoutBankId] = useState<
      string | null
   >(null);

   // Fetch earnings + transactions as soon as Payments section is shown (use userId
   // from parent so Total Earnings/Total Spent load without waiting for auth or tab).
   const effectiveUserId = userId ?? currentUser?.uid;
   const linkedUserIds = useMemo(
      () =>
         [currentUser?.uid, userData?.uid, userData?._id]
            .filter((id): id is string => typeof id === "string" && id.trim().length > 0)
            .map((id) => id.trim()),
      [currentUser?.uid, userData?.uid, userData?._id]
   );
   useEffect(() => {
      if (!effectiveUserId) return;
      fetchPayments(effectiveUserId, { linkedUserIds }).catch((error) => {
         console.error("Failed to load payments:", error);
      });
   }, [effectiveUserId, linkedUserIds, fetchPayments]);

   useEffect(() => {
      if (!effectiveUserId) return;

      const linkedCsv = linkedUserIds
         .filter((id) => id !== effectiveUserId)
         .join(",");

      paymentApi
         .getPendingCancellationPenalties(effectiveUserId, linkedCsv || undefined)
         .then((res) => {
            const total = Number.parseFloat(res?.totalRemaining || "0");
            setPendingPenaltyTotal(Number.isFinite(total) ? total : 0);
            setPendingPenaltyItems(Array.isArray(res?.items) ? res.items : []);
         })
         .catch((error) => {
            console.error("Failed to load pending penalties:", error);
            setPendingPenaltyTotal(0);
            setPendingPenaltyItems([]);
         });
   }, [effectiveUserId, linkedUserIds]);

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

   // Internal handlers
   const handleSavePaymentMethod = (data: Partial<PaymentMethod>) => {
      if (onSavePaymentMethod) {
         onSavePaymentMethod(data);
      } else {
         console.log("Payment method saved:", data);
      }
      setShowPaymentMethodModal(false);
   };

   const handleSavePayoutMethod = (data: Partial<PayoutMethod>) => {
      if (onSavePayoutMethod) {
         onSavePayoutMethod(data);
      } else {
         console.log("Payout method saved:", data);
      }
      setShowPayoutMethodModal(false);
   };

   const handleSetDefaultPaymentMethod = async (methodId: string) => {
      if (!onSetDefaultPayment || settingPaymentMethodId) return;
      setSettingPaymentMethodId(methodId);
      try {
         await Promise.resolve(onSetDefaultPayment(methodId));
      } finally {
         setSettingPaymentMethodId(null);
      }
   };

   // Filter transactions based on selected filter + range filters
   const filteredTransactions = transactions.filter((t) => {
      // Type filter
      if (transactionFilter === "outgoing" && t.type !== "payment")
         return false;
      if (
         transactionFilter === "earnings" &&
         t.type !== "payout" &&
         t.type !== "refund"
      )
         return false;

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

   const payoutTransactions = useMemo(
      () => transactions.filter((t) => t.type === "payout"),
      [transactions]
   );

   const payoutIds = useMemo(() => {
      const ids = payoutTransactions
         .map((transaction) => {
            if (transaction.payoutId) return transaction.payoutId;
            const metadata =
               transaction.metadata &&
               typeof transaction.metadata === "object" &&
               !Array.isArray(transaction.metadata)
                  ? (transaction.metadata as Record<string, unknown>)
                  : undefined;

            const fromMetadata =
               (typeof metadata?.payoutId === "string" && metadata.payoutId) ||
               (typeof metadata?.relatedEntityId === "string" &&
                  metadata.relatedEntityId) ||
               (typeof metadata?.transactionId === "string" &&
                  metadata.transactionId);

            return fromMetadata || transaction.id;
         })
         .filter(Boolean);

      return Array.from(new Set(ids));
   }, [payoutTransactions]);

   const appliedPenaltyTotalFromPayouts = useMemo(
      () =>
         payoutTransactions.reduce((sum, transaction) => {
            const penalty = getPenaltyDeductedValue(transaction);
            return sum + (penalty > 0 ? penalty : 0);
         }, 0),
      [payoutTransactions]
   );

   const effectivePendingPenaltyTotal = Math.max(
      0,
      pendingPenaltyTotal - appliedPenaltyTotalFromPayouts
   );

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

         {/* Quick Stats */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-primary-50 rounded-lg p-3 sm:p-4 border border-primary-100">
               <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-primary-600" />
                  <span className="text-xs text-primary-700 font-medium">
                     Total Earnings
                  </span>
               </div>
               <p className="text-lg sm:text-xl font-bold text-primary-700">
                  ₹{totalEarnings.toLocaleString()}
               </p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-3 sm:p-4 border border-secondary-100">
               <div className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4 text-secondary-600" />
                  <span className="text-xs text-secondary-700 font-medium">
                     Total Spent
                  </span>
               </div>
               <p className="text-lg sm:text-xl font-bold text-secondary-700">
                  ₹{totalSpent.toLocaleString()}
               </p>
            </div>
            {effectivePendingPenaltyTotal > 0 && (
               <div className="bg-rose-50 rounded-lg p-3 sm:p-4 border border-rose-200">
                  <div className="flex items-center gap-2 mb-1">
                     <Wallet className="w-4 h-4 text-rose-700" />
                     <span className="text-xs text-rose-800 font-medium">
                        Pending Penalty
                     </span>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-rose-800">
                     -₹{effectivePendingPenaltyTotal.toLocaleString()}
                  </p>
                  <p className="text-[11px] sm:text-xs text-rose-700 mt-1">
                     Deducted from next payout
                  </p>
               </div>
            )}
         </div>

         <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
               <TabsTrigger value="methods" className="text-xs sm:text-sm">
                  Payment Methods
               </TabsTrigger>
               <TabsTrigger value="bank" className="text-xs sm:text-sm">
                  Bank Accounts
               </TabsTrigger>
               <TabsTrigger value="payouts" className="text-xs sm:text-sm">
                  Payouts
               </TabsTrigger>
               <TabsTrigger value="transactions" className="text-xs sm:text-sm">
                  Transactions
               </TabsTrigger>
            </TabsList>

            {/* Payment Methods Tab */}
            <TabsContent value="methods" className="space-y-4 mt-4">
               <div className="bg-white rounded-lg border border-gray-200">
                  {paymentMethods.length > 0 ? (
                     <div className="divide-y divide-gray-100">
                        {paymentMethods.map((method) => (
                           <PaymentMethodRow
                              key={method.id}
                              method={method}
                              onRemove={() => onRemovePaymentMethod(method.id)}
                              onSetDefault={() =>
                                 handleSetDefaultPaymentMethod(method.id)
                              }
                              isSettingDefault={
                                 settingPaymentMethodId === method.id
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
                           onClick={() => setShowPaymentMethodModal(true)}
                           size="sm"
                           className="text-xs h-8 px-3 bg-primary-600 hover:bg-primary-700"
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
                     onClick={() => setShowPaymentMethodModal(true)}
                     size="sm"
                     className="w-full sm:w-auto text-xs h-9"
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

            {/* Payouts History Tab */}
            <TabsContent value="payouts" className="space-y-4 mt-4">
               <div className="space-y-4">
                  <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-4 border border-primary-200">
                     <div className="flex items-start gap-3">
                        <div className="text-primary-600">
                           <Wallet className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                           <h3 className="text-sm font-medium text-primary-900 mb-1">
                              Payout Status Tracking
                           </h3>
                           <p className="text-xs text-primary-700">
                              Your tasks are automatically paid out to your registered bank account within 1-2 business days after completion approval. Use this tab to track the status of your transfers.
                           </p>
                        </div>
                     </div>
                  </div>

                  {effectivePendingPenaltyTotal > 0 && (
                     <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <div className="flex items-start gap-3">
                           <div className="text-amber-700">
                              <Wallet className="w-5 h-5" />
                           </div>
                           <div className="flex-1">
                              <h3 className="text-sm font-medium text-amber-900 mb-1">
                                 Pending Cancellation Penalty
                              </h3>
                              <p className="text-xs text-amber-800 mb-2">
                                 ₹{effectivePendingPenaltyTotal.toLocaleString()} will be adjusted from upcoming payouts.
                              </p>
                              {pendingPenaltyItems.length > 0 && (
                                 <div className="space-y-1">
                                    {pendingPenaltyItems.slice(0, 3).map((item) => (
                                       <div
                                          key={item.penaltyId}
                                          className="text-xs text-amber-900 flex items-center justify-between"
                                       >
                                          <span className="truncate pr-2">
                                             {item.taskTitle || `Task ${item.taskId}`}
                                          </span>
                                          <span className="font-medium">
                                             ₹{Number.parseFloat(item.remainingAmount || "0").toLocaleString()}
                                          </span>
                                       </div>
                                    ))}
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  )}

                  <PayoutHistory
                     payoutIds={payoutIds}
                     fallbackPayouts={payoutTransactions}
                     maxItems={20}
                     showPending={true}
                     showCompleted={true}
                  />
               </div>
            </TabsContent>

            {/* Bank Accounts Tab */}
            <TabsContent value="bank" className="space-y-4 mt-4">
               <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Bank Account for Payouts</h3>
                  {!hasBankAccount ? (
                     <div className="space-y-3">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                           <p className="text-sm text-blue-900">
                              Add your bank account to receive payments for completed tasks via RazorpayX
                           </p>
                           <Button
                              onClick={() => setShowBankAccountModal(true)}
                              className="mt-3 bg-primary-600 hover:bg-primary-700 text-white"
                              size="sm"
                           >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Bank Account
                           </Button>
                        </div>
                     </div>
                  ) : (
                     <div className="space-y-3">
                        {bankAccounts.map((account) => (
                           <div
                              key={account.id}
                              className="rounded-lg border border-gray-200 p-3 flex items-center justify-between gap-3"
                           >
                              <div>
                                 <p className="text-sm font-medium text-gray-900">{account.accountNumber}</p>
                                 <p className="text-xs text-gray-500">{account.ifscCode}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                 {!account.isDefault ? (
                                    <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={async () => {
                                          if (
                                             settingPayoutBankId ||
                                             account.isDefault
                                          ) {
                                             return;
                                          }
                                          try {
                                             setSettingPayoutBankId(account.id);
                                             await setDefaultBankAccount(account.id);
                                             toast.success(
                                                "Default payout bank account updated",
                                                {
                                                   id: "default-payout-bank-account",
                                                }
                                             );
                                          } catch (error) {
                                             toast.error(
                                                error instanceof Error
                                                   ? error.message
                                                   : "Failed to update payout bank account",
                                                {
                                                   id: "default-payout-bank-account",
                                                }
                                             );
                                          } finally {
                                             setSettingPayoutBankId(null);
                                          }
                                       }}
                                       disabled={
                                          bankLoading ||
                                          settingPayoutBankId === account.id ||
                                          deletingPayoutBankId === account.id
                                       }
                                    >
                                       {settingPayoutBankId === account.id
                                          ? "Setting..."
                                          : "Set default"}
                                    </Button>
                                 ) : (
                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                       Default
                                    </Badge>
                                 )}
                                 <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                       if (deletingPayoutBankId) return;
                                       try {
                                          setDeletingPayoutBankId(account.id);
                                          await deleteBankAccount(account.id);
                                          toast.success("Bank account deleted", {
                                             id: "delete-payout-bank-account",
                                          });
                                       } catch (error) {
                                          toast.error(
                                             error instanceof Error
                                                ? error.message
                                                : "Failed to delete bank account",
                                             {
                                                id: "delete-payout-bank-account",
                                             }
                                          );
                                       } finally {
                                          setDeletingPayoutBankId(null);
                                       }
                                    }}
                                    disabled={
                                       bankLoading ||
                                       deletingPayoutBankId === account.id ||
                                       settingPayoutBankId === account.id
                                    }
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                 >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    {deletingPayoutBankId === account.id
                                       ? "Deleting..."
                                       : "Delete"}
                                 </Button>
                              </div>
                           </div>
                        ))}

                        <Button
                           onClick={() => setShowBankAccountModal(true)}
                           className="bg-primary-600 hover:bg-primary-700 text-white"
                           size="sm"
                        >
                           <Plus className="w-4 h-4 mr-2" />
                           Add Another Bank Account
                        </Button>
                     </div>
                  )}
               </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-4 mt-4">
               {/* Sub-filters for transactions */}
               <div className="flex items-center gap-2 flex-wrap">
                  <button
                     onClick={() => setTransactionFilter("all")}
                     className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                        transactionFilter === "all"
                           ? "bg-gray-900 text-white"
                           : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                     )}
                  >
                     All
                  </button>
                  <button
                     onClick={() => setTransactionFilter("outgoing")}
                     className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1",
                        transactionFilter === "outgoing"
                           ? "bg-secondary-600 text-white"
                           : "bg-secondary-50 text-secondary-700 hover:bg-secondary-100"
                     )}
                  >
                     <ArrowUpRight className="w-3 h-3" />
                     Outgoing
                  </button>
                  <button
                     onClick={() => setTransactionFilter("earnings")}
                     className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1",
                        transactionFilter === "earnings"
                           ? "bg-primary-600 text-white"
                           : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                     )}
                  >
                     <ArrowDownLeft className="w-3 h-3" />
                     Earnings
                  </button>
                  <div className="flex items-center gap-2 ml-auto">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowRangeFilters(!showRangeFilters)}
                        className={cn(
                           "h-8 px-2.5 text-xs gap-1.5",
                           hasActiveRangeFilters &&
                              "border-primary-500 bg-primary-50 text-primary-700"
                        )}
                     >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filters
                        {hasActiveRangeFilters && (
                           <span className="ml-0.5 bg-primary-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                              {
                                 [dateRange?.from, minAmount, maxAmount].filter(
                                    Boolean
                                 ).length
                              }
                           </span>
                        )}
                     </Button>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2"
                              aria-label="Download transactions"
                           >
                              <Download className="w-4 h-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem
                              onClick={async () => {
                                 try {
                                    await exportTransactionsToPdf(filteredTransactions, {
                                       totalEarnings,
                                       totalSpent,
                                    });
                                    toast.success("PDF downloaded");
                                 } catch (e) {
                                    toast.error("Failed to download PDF");
                                 }
                              }}
                           >
                              <FileText className="w-4 h-4 mr-2" />
                              Download as PDF
                           </DropdownMenuItem>
                           <DropdownMenuItem
                              onClick={async () => {
                                 try {
                                    await exportTransactionsToExcel(filteredTransactions, {
                                       totalEarnings,
                                       totalSpent,
                                    });
                                    toast.success("Excel downloaded");
                                 } catch (e) {
                                    toast.error("Failed to download Excel");
                                 }
                              }}
                           >
                              <FileSpreadsheet className="w-4 h-4 mr-2" />
                              Download as Excel
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               </div>

               {/* Range Filters Panel */}
               {showRangeFilters && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
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
                                             {format(
                                                dateRange.from,
                                                "dd MMM yyyy"
                                             )}{" "}
                                             -{" "}
                                             {format(
                                                dateRange.to,
                                                "dd MMM yyyy"
                                             )}
                                          </>
                                       ) : (
                                          format(dateRange.from, "dd MMM yyyy")
                                       )
                                    ) : (
                                       "Select date range"
                                    )}
                                 </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                 className="w-auto p-0"
                                 align="start"
                              >
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
                                          onClick={() =>
                                             setDateRange(undefined)
                                          }
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
                                    onChange={(e) =>
                                       setMinAmount(e.target.value)
                                    }
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
                                    onChange={(e) =>
                                       setMaxAmount(e.target.value)
                                    }
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
                                    ? `${format(
                                         dateRange.from,
                                         "dd MMM"
                                      )} - ${format(dateRange.to, "dd MMM")}`
                                    : `From ${format(
                                         dateRange.from,
                                         "dd MMM"
                                      )}`}
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

               {/* Transactions List */}
               <div className="bg-white rounded-lg border border-gray-200">
                  {loading ? (
                     <div className="px-4 py-12 sm:px-5 sm:py-16 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-xs sm:text-sm text-gray-500">
                           Loading transactions...
                        </p>
                     </div>
                  ) : filteredTransactions.length > 0 ? (
                     <div className="divide-y divide-gray-100">
                        {filteredTransactions.map((transaction) => (
                           <TransactionRow
                              key={transaction.id}
                              transaction={transaction}
                              onOpenDetails={() =>
                                 setSelectedTransaction(transaction)
                              }
                           />
                        ))}
                     </div>
                  ) : (
                     <div className="px-4 py-6 sm:px-5 sm:py-8 text-center">
                        <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-xs sm:text-sm text-gray-500">
                           {hasActiveRangeFilters
                              ? "No transactions match your filters"
                              : "No transactions yet"}
                        </p>
                        {hasActiveRangeFilters ? (
                           <Button
                              variant="link"
                              size="sm"
                              onClick={clearRangeFilters}
                              className="mt-2 text-xs"
                           >
                              Clear filters
                           </Button>
                        ) : (
                           <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                              Your payment and earning history will appear here
                           </p>
                        )}
                     </div>
                  )}
               </div>
            </TabsContent>
         </Tabs>

         {/* Payment Method Form Modal */}
         <PaymentMethodForm
            isOpen={showPaymentMethodModal}
            onClose={() => setShowPaymentMethodModal(false)}
            onSave={handleSavePaymentMethod}
         />

         {/* Payout Method Form Modal */}
         <PayoutMethodForm
            isOpen={showPayoutMethodModal}
            onClose={() => setShowPayoutMethodModal(false)}
            onSave={handleSavePayoutMethod}
         />

         <AddBankAccountModal
            open={showBankAccountModal}
            onOpenChange={setShowBankAccountModal}
            onSuccess={() => {
               refetchBankAccounts();
               // Refetch payments to update bank account status
               if (effectiveUserId) {
                  fetchPayments(effectiveUserId, { linkedUserIds }).catch((error) => {
                     console.error("Failed to reload payments:", error);
                  });
               }
            }}
         />

         <TransactionDetailsModal
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
         />
      </div>
   );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface PaymentMethodRowProps {
   method: PaymentMethod;
   onRemove: () => void;
   onSetDefault: () => void;
   isSettingDefault?: boolean;
}

function PaymentMethodRow({
   method,
   onRemove,
   onSetDefault,
   isSettingDefault = false,
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
                        className="text-[10px] bg-primary-100 text-primary-700"
                     >
                        Default
                     </Badge>
                  )}
               </div>
               {method.type === "card" &&
                  method.expiryMonth &&
                  method.expiryYear && (
                     <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                        Expires {String(method.expiryMonth).padStart(2, "0")}/
                        {method.expiryYear}
                     </p>
                  )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
               {!method.isDefault && (
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={onSetDefault}
                     disabled={isSettingDefault}
                     className="text-xs h-8 px-2 text-gray-600 hover:text-primary-600"
                  >
                     {isSettingDefault ? "Setting..." : "Set default"}
                  </Button>
               )}
               {showConfirm ? (
                  <div className="flex items-center gap-1">
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
               <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                     {method.type === "bank" &&
                        `${method.bankName} •••• ${
                           method.accountNumber?.slice(-4) || "****"
                        }`}
                     {method.type === "upi" && method.upiId}
                  </span>
                  {method.isDefault && (
                     <Badge
                        variant="secondary"
                        className="text-[10px] bg-primary-100 text-primary-700"
                     >
                        Default
                     </Badge>
                  )}
                  {method.isVerified && (
                     <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  )}
               </div>
               {method.type === "bank" && method.accountHolderName && (
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                     {method.accountHolderName}
                  </p>
               )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
               {!method.isDefault && (
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={onSetDefault}
                     className="text-xs h-8 px-2 text-gray-600 hover:text-primary-600"
                  >
                     Set default
                  </Button>
               )}
               {showConfirm ? (
                  <div className="flex items-center gap-1">
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
   onOpenDetails: () => void;
}

function TransactionRow({ transaction, onOpenDetails }: TransactionRowProps) {
   const isCredit =
      transaction.type === "payout" || transaction.type === "refund";
   const safeTaskId =
      typeof transaction.taskId === "string" ? transaction.taskId : "";
   const fallbackTaskLabel = safeTaskId
      ? `Task ${safeTaskId.slice(0, 8)}`
      : transaction.description;
   const titleText = transaction.taskTitle || fallbackTaskLabel;
   const canOpenDetails = Boolean(safeTaskId);

   return (
      <div
         className={cn(
            "px-4 py-3 sm:px-5 sm:py-4 hover:bg-gray-50 transition-colors",
            canOpenDetails && "cursor-pointer"
         )}
         onClick={canOpenDetails ? onOpenDetails : undefined}
         role={canOpenDetails ? "button" : undefined}
         tabIndex={canOpenDetails ? 0 : undefined}
         onKeyDown={
            canOpenDetails
               ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                       event.preventDefault();
                       onOpenDetails();
                    }
                 }
               : undefined
         }
      >
         <div className="flex items-center gap-3 sm:gap-4">
            <div
               className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0",
                  isCredit ? "bg-primary-100" : "bg-secondary-100"
               )}
            >
               {isCredit ? (
                  <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
               ) : (
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600" />
               )}
            </div>

            <div className="flex-1 min-w-0">
               <p
                  className={cn(
                     "text-xs sm:text-sm font-medium text-gray-900 truncate",
                     canOpenDetails &&
                        "hover:text-primary-700 underline-offset-2 hover:underline"
                  )}
               >
                  {titleText}
               </p>
               <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                  {formatDate(transaction.createdAt)}
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

interface TransactionDetailsModalProps {
   transaction: Transaction | null;
   onClose: () => void;
}

function TransactionDetailsModal({ transaction, onClose }: TransactionDetailsModalProps) {
   const [taskStatus, setTaskStatus] = useState<Transaction["taskStatus"]>();
   const [taskCategory, setTaskCategory] = useState<string | undefined>();
   const [paidToName, setPaidToName] = useState<string | undefined>();
   const [escrowStatus, setEscrowStatus] =
      useState<Transaction["escrowStatus"]>();
   const [isRefreshing, setIsRefreshing] = useState(false);

   useEffect(() => {
      if (!transaction) return;
      const taskId =
         typeof transaction.taskId === "string" ? transaction.taskId : "";

      let cancelled = false;

      const loadLatest = async () => {
         setIsRefreshing(true);
         try {
            if (taskId) {
               const shouldFetchEscrow =
                  transaction.type === "payment" || transaction.type === "refund";

               const [task, escrowRes] = await Promise.all([
                  tasksApi.getTask(taskId).catch(() => null),
                  shouldFetchEscrow
                     ? paymentApi
                          .getEscrowByTaskId(taskId)
                          .catch(() => ({ success: false }))
                     : Promise.resolve({ success: false }),
               ]);

               if (cancelled) return;

               if (task) {
                  setTaskStatus((task as any).status);
                  setTaskCategory((task as any).categoryLabel || (task as any).category);

                  const taskerNameFromTask =
                     (task as any).assignedToName ||
                     (task as any).assigneeName ||
                     (task as any).performerName ||
                     (task as any).assignedUser?.name ||
                     (task as any).assignedTo?.name;

                  const taskerUidOrId =
                     (task as any).assigneeUid ||
                     (task as any).assignedTo ||
                     (task as any).assignedUser?._id ||
                     (task as any).assignedUser?.uid;

                  if (taskerNameFromTask) {
                     setPaidToName(taskerNameFromTask);
                  } else if (typeof taskerUidOrId === "string" && taskerUidOrId.trim()) {
                     const profile = await profilesApi
                        .getPublicProfile(taskerUidOrId)
                        .catch(() => null);

                     const profileName =
                        (profile as any)?.name ||
                        (profile as any)?.displayName ||
                        (profile as any)?.fullName;

                     if (profileName) {
                        setPaidToName(profileName);
                     }
                  }
               }

               const escrow =
                  (escrowRes as { escrow?: { status?: Transaction["escrowStatus"] } })
                     ?.escrow;
               if (escrowRes?.success && escrow?.status) {
                  setEscrowStatus(escrow.status);
               }
            }
         } catch (error) {
            if (!cancelled) {
               console.warn("Failed to refresh transaction details", error);
            }
         } finally {
            if (!cancelled) setIsRefreshing(false);
         }
      };

      setTaskStatus(transaction.taskStatus);
      setTaskCategory(transaction.taskCategory);
      setPaidToName(transaction.paidToName || transaction.assignedToName);
      setEscrowStatus(transaction.escrowStatus);

      loadLatest();
      const timer = setInterval(loadLatest, 20_000);

      return () => {
         cancelled = true;
         clearInterval(timer);
      };
   }, [transaction]);

   if (!transaction) return null;

   const isIncoming =
      transaction.type === "payout" || transaction.type === "refund";
   const statusMessage = getEscrowStatusMessage(escrowStatus, transaction.status);
   const breakdown = buildPaymentBreakdown(transaction);
   const showRefundBreakdown =
      transaction.type === "refund" ||
      transaction.status === "cancelled" ||
      escrowStatus === "cancelled" ||
      escrowStatus === "refunded";
   const timeline = buildPaymentTimeline(taskStatus, escrowStatus);
   const counterpartyLabel = isIncoming ? "Received from" : "Paid to";
   const counterpartyValue = isIncoming
      ? paidToName || transaction.assignedToName || "ExtraHand"
      : paidToName || "Will be assigned";

   return (
      <Dialog open={Boolean(transaction)} onOpenChange={(open) => !open && onClose()}>
         <DialogContent className="sm:max-w-lg">
            <DialogHeader>
               <DialogTitle className="text-base font-semibold">
                  {isIncoming ? "Payout Details" : "Payment Details"}
               </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
               <div className="border-b border-dashed border-gray-200 pb-4">
                  <p className="text-2xl font-bold text-gray-900">
                     ₹{safeCurrency(transaction.totalPaid ?? transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                     {formatDateTime(transaction.createdAt)}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-3">
                     {transaction.taskTitle || transaction.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{taskCategory || "General"}</p>
               </div>

               <div className="space-y-2 border-b border-dashed border-gray-200 pb-4">
                  <h4 className="text-sm font-semibold text-gray-900">Payment Details</h4>
                  <DetailRow label="Task Amount" value={breakdown.taskAmount} />
                  <DetailRow label="Platform Fee" value={breakdown.platformFee} />
                  <DetailRow label="GST" value={breakdown.gstAmount} />
                  {isIncoming && breakdown.penaltyDeducted > 0 && (
                     <div className="pt-2 mt-2 border-t border-gray-200">
                        <DetailRow
                           label="Penalty Deducted"
                           value={breakdown.penaltyDeducted}
                           strong={false}
                        />
                        <p className="text-[11px] text-red-600 mt-1">
                           Penalty for cancellation adjusted from payout
                        </p>
                     </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-gray-200">
                     <DetailRow
                        label={isIncoming ? "Amount Received" : "Total Paid"}
                        value={breakdown.totalPaid}
                        strong
                     />
                  </div>

                  {showRefundBreakdown && (
                     <div className="pt-3 mt-3 border-t border-gray-200 space-y-1.5">
                        <h5 className="text-xs font-semibold text-gray-900">Refund Breakdown</h5>
                        <DetailRow label="Refundable Base (Task Amount)" value={breakdown.taskAmount} />
                        <DetailRow
                           label={breakdown.appliedRuleLabel}
                           value={breakdown.appliedRuleAmount}
                        />
                        {breakdown.actualRefund > 0 ? (
                           <DetailRow label="Actual Refunded" value={breakdown.actualRefund} strong />
                        ) : (
                           <DetailRow label="Refund in Progress" value={breakdown.expectedRefund} strong />
                        )}
                        <p className="text-[11px] text-amber-700 mt-1">
                           Platform fee and GST are non-refundable.
                        </p>
                     </div>
                  )}
               </div>

               <div className="space-y-2 border-b border-dashed border-gray-200 pb-4">
                  <p className="text-sm font-medium text-gray-900">
                     Status: <span className="text-amber-700">{statusMessage}</span>
                  </p>
               </div>

               {!showRefundBreakdown && (
                  <>
                     <div className="space-y-2 border-b border-dashed border-gray-200 pb-4">
                        <h4 className="text-sm font-semibold text-gray-900">Timeline</h4>
                        {timeline.map((item) => (
                           <p key={item.label} className="text-sm text-gray-700">
                              {item.done ? "✔" : "⏳"} {item.label}
                           </p>
                        ))}
                     </div>

                     <div>
                        <h4 className="text-sm font-semibold text-gray-900">{counterpartyLabel}</h4>
                        <p className="text-sm text-gray-700 mt-1">{counterpartyValue}</p>
                     </div>
                  </>
               )}

               {isRefreshing && (
                  <p className="text-[11px] text-gray-500">Refreshing payment status...</p>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
}

function buildPaymentBreakdown(transaction: Transaction) {
   const metadata =
      transaction.metadata &&
      typeof transaction.metadata === "object" &&
      !Array.isArray(transaction.metadata)
         ? (transaction.metadata as Record<string, unknown>)
         : {};
   const amountBreakdown =
      metadata.amountBreakdown &&
      typeof metadata.amountBreakdown === "object" &&
      !Array.isArray(metadata.amountBreakdown)
         ? (metadata.amountBreakdown as Record<string, unknown>)
         : {};

   const penaltyDeducted = getPenaltyDeductedValue(transaction);
   const inferredNetAmount = safeNumber(transaction.amount ?? metadata.netAmount);
   const totalPaid = safeNumber(
      transaction.totalPaid ?? metadata.totalPaid ?? amountBreakdown.totalPaid ?? transaction.amount
   );
   const taskAmount = safeNumber(
      transaction.taskAmount ?? metadata.taskAmount ?? amountBreakdown.taskAmount
   );
   const platformFeeFromMeta = safeNumber(
      transaction.platformFee ?? metadata.platformFee ?? amountBreakdown.platformFee
   );
   const gstAmountFromMeta = safeNumber(
      transaction.gstAmount ?? metadata.gstAmount ?? metadata.platformFeeGst ?? amountBreakdown.gst
   );

   const isIncomingPayout = transaction.type === "payout";
   const netReceived =
      isIncomingPayout && inferredNetAmount > 0
         ? inferredNetAmount
         : totalPaid;
   const grossFromPenalty =
      isIncomingPayout && penaltyDeducted > 0 && netReceived > 0
         ? netReceived + penaltyDeducted
         : 0;
   const normalizedTaskAmount =
      taskAmount > 0
         ? Math.max(taskAmount, grossFromPenalty)
         : grossFromPenalty > 0
         ? grossFromPenalty
         : totalPaid;
   const inferredFees = Math.max(totalPaid - normalizedTaskAmount, 0);
   const platformFee = platformFeeFromMeta > 0 ? platformFeeFromMeta : inferredFees;
   const gstAmount = gstAmountFromMeta > 0 ? gstAmountFromMeta : Math.max(inferredFees - platformFee, 0);
   const actualRefund = safeNumber(
      metadata.refundAmount ?? metadata.refundedAmount ?? (transaction.type === "refund" ? transaction.amount : 0)
   );
   const latestCancelledBy = String(metadata.latestCancelledBy || metadata.cancelledBy || "").toLowerCase();
   const latestRefundAmount = safeNumber(metadata.latestRefundAmount);
   const expectedRefund =
      latestCancelledBy === "performer"
         ? totalPaid
         : actualRefund > 0
         ? actualRefund
         : latestRefundAmount;

   const refundRatio = normalizedTaskAmount > 0 ? expectedRefund / normalizedTaskAmount : 0;
   const normalizedRatio = Math.round(refundRatio * 100) / 100;
   const appliedRuleLabel =
      latestCancelledBy === "performer"
         ? "Applied: Cancelled by tasker (full refund)"
         : normalizedRatio >= 0.99
         ? "Applied: Cancelled within 15 mins or > 24 hrs before start (100%)"
         : normalizedRatio >= 0.89
         ? "Applied: Cancelled between 1 and 24 hrs before start (90%)"
         : normalizedRatio >= 0.79
         ? "Applied: Cancelled < 1 hr before start (80%)"
         : "Applied: Refund policy pending calculation";
   const appliedRuleAmount = expectedRefund;

   return {
      taskAmount: normalizedTaskAmount,
      platformFee,
      gstAmount,
      totalPaid: isIncomingPayout ? netReceived : totalPaid,
      penaltyDeducted,
      refundBefore24h: Math.round(normalizedTaskAmount),
      refundBefore1hTo24h: Math.round(normalizedTaskAmount * 0.9),
      refundBefore1h: Math.round(normalizedTaskAmount * 0.8),
      actualRefund,
      expectedRefund,
      appliedRuleLabel,
      appliedRuleAmount,
   };
}

function getPenaltyDeductedValue(transaction: Transaction): number {
   const metadata =
      transaction.metadata &&
      typeof transaction.metadata === "object" &&
      !Array.isArray(transaction.metadata)
         ? (transaction.metadata as Record<string, unknown>)
         : {};

   const explicitPenalty = safeNumber(
      transaction.penaltyDeducted ?? metadata.penaltyDeducted
   );
   if (explicitPenalty > 0) return explicitPenalty;

   if (transaction.type !== "payout") return 0;

   const amountBreakdown =
      metadata.amountBreakdown &&
      typeof metadata.amountBreakdown === "object" &&
      !Array.isArray(metadata.amountBreakdown)
         ? (metadata.amountBreakdown as Record<string, unknown>)
         : {};

   const netReceived = safeNumber(
      transaction.amount ?? metadata.netAmount ?? metadata.totalPaid
   );
   const grossAmount = safeNumber(
      transaction.taskAmount ??
         metadata.taskAmount ??
         metadata.grossAmount ??
         amountBreakdown.taskAmount
   );
   if (grossAmount <= 0 || netReceived <= 0 || grossAmount <= netReceived) {
      return 0;
   }

   const feeComponent = safeNumber(
      transaction.platformFee ??
         metadata.platformFee ??
         amountBreakdown.platformFee
   );
   const gstComponent = safeNumber(
      transaction.gstAmount ??
         metadata.gstAmount ??
         metadata.platformFeeGst ??
         amountBreakdown.gst
   );
   const inferredPenalty = Math.max(grossAmount - netReceived - feeComponent - gstComponent, 0);
   return inferredPenalty;
}

function buildPaymentTimeline(
   taskStatus?: Transaction["taskStatus"],
   escrowStatus?: Transaction["escrowStatus"]
) {
   const assignedDone =
      taskStatus === "assigned" ||
      taskStatus === "started" ||
      taskStatus === "in_progress" ||
      taskStatus === "review" ||
      taskStatus === "completed";

   const inProgressDone =
      taskStatus === "started" ||
      taskStatus === "in_progress" ||
      taskStatus === "review" ||
      taskStatus === "completed";

   const releaseDone =
      escrowStatus === "released" || taskStatus === "completed";

   return [
      { label: "Paid", done: true },
      { label: "Assigned", done: assignedDone },
      { label: "In progress", done: inProgressDone },
      { label: "Release pending", done: releaseDone },
   ];
}

function getEscrowStatusMessage(
   escrowStatus?: Transaction["escrowStatus"],
   paymentStatus?: Transaction["status"]
) {
   if (escrowStatus === "released") return "Payment released to tasker";
   if (escrowStatus === "refunded") return "Payment refunded";
   if (escrowStatus === "cancelled") return "Payment cancelled";
   if (escrowStatus === "held" || escrowStatus === "pending") {
      return "Payment secured";
   }
   if (paymentStatus === "completed") return "Payment secured";
   if (paymentStatus === "pending") return "Payment is being processed";
   if (paymentStatus === "failed") return "Payment failed";
   return "Status updating";
}

function DetailRow({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
   return (
      <div className="flex items-center justify-between text-sm">
         <span className="text-gray-600">{label}</span>
         <span className={cn("text-gray-900", strong && "font-semibold")}>
            ₹{safeCurrency(value)}
         </span>
      </div>
   );
}

function TransactionStatusBadge({ status }: { status: Transaction["status"] }) {
   const config = {
      completed: {
         label: "Completed",
         className: "bg-green-100 text-green-700",
      },
      pending: { label: "In Progress", className: "bg-amber-100 text-amber-700" },
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
   if (Number.isNaN(d.getTime())) return "Date unavailable";
   return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
   });
}

function formatDateTime(date: Date | string): string {
   const d = new Date(date);
   if (Number.isNaN(d.getTime())) return "Date unavailable";
   const dateText = d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
   });
   const timeText = d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
   });
   return `${dateText} • ${timeText}`;
}

function safeNumber(value: unknown): number {
   if (typeof value === "number" && Number.isFinite(value)) return Math.round(Math.abs(value));
   if (typeof value === "string") {
      const parsed = Number.parseFloat(value.replace(/,/g, ""));
      if (Number.isFinite(parsed)) return Math.round(Math.abs(parsed));
   }
   return 0;
}

function safeCurrency(value: unknown): string {
   return safeNumber(value).toLocaleString("en-IN");
}

// ============================================================================
// FORM COMPONENTS
// ============================================================================

interface PaymentMethodFormProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (data: Partial<PaymentMethod>) => void;
}

export function PaymentMethodForm({
   isOpen,
   onClose,
   onSave,
}: PaymentMethodFormProps) {
   const [methodType, setMethodType] = useState<"card" | "upi">("card");
   const [formData, setFormData] = useState({
      cardNumber: "",
      cardHolder: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      upiId: "",
   });
   const [errors, setErrors] = useState<Record<string, string>>({});

   if (!isOpen) return null;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (methodType === "card") {
         if (!formData.cardNumber || formData.cardNumber.length < 16) {
            newErrors.cardNumber = "Enter a valid card number";
         }
         if (!formData.cardHolder) {
            newErrors.cardHolder = "Cardholder name is required";
         }
         if (!formData.expiryMonth || !formData.expiryYear) {
            newErrors.expiry = "Expiry date is required";
         }
         if (!formData.cvv || formData.cvv.length < 3) {
            newErrors.cvv = "Enter a valid CVV";
         }
      } else {
         if (!formData.upiId || !formData.upiId.includes("@")) {
            newErrors.upiId = "Enter a valid UPI ID";
         }
      }

      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors);
         return;
      }

      if (methodType === "card") {
         const cardNum = formData.cardNumber.replace(/\s/g, "");
         let cardBrand: "visa" | "mastercard" | "rupay" | "amex" = "visa";
         if (cardNum.startsWith("5")) cardBrand = "mastercard";
         else if (cardNum.startsWith("6")) cardBrand = "rupay";
         else if (cardNum.startsWith("3")) cardBrand = "amex";

         onSave({
            type: "card",
            cardBrand,
            lastFour: cardNum.slice(-4),
            expiryMonth: parseInt(formData.expiryMonth),
            expiryYear: parseInt(formData.expiryYear),
            cardHolderName: formData.cardHolder.toUpperCase(),
         });
      } else {
         onSave({
            type: "upi",
            upiId: formData.upiId,
         });
      }

      // Reset form
      setFormData({
         cardNumber: "",
         cardHolder: "",
         expiryMonth: "",
         expiryYear: "",
         cvv: "",
         upiId: "",
      });
      setErrors({});
   };

   const formatCardNumber = (value: string) => {
      const v = value.replace(/\D/g, "").slice(0, 16);
      const parts = [];
      for (let i = 0; i < v.length; i += 4) {
         parts.push(v.slice(i, i + 4));
      }
      return parts.join(" ");
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
         <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            {/* Header */}
            <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
               <h3 className="text-base font-semibold text-gray-900">
                  Add Payment Method
               </h3>
               <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
               >
                  <svg
                     className="w-5 h-5 text-gray-500"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                     />
                  </svg>
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
               {/* Method Type Toggle */}
               <div className="flex gap-2">
                  <button
                     type="button"
                     onClick={() => setMethodType("card")}
                     className={cn(
                        "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2",
                        methodType === "card"
                           ? "border-primary-500 bg-primary-50 text-primary-700"
                           : "border-gray-200 text-gray-600 hover:border-gray-300"
                     )}
                  >
                     <CreditCard className="w-4 h-4" />
                     Card
                  </button>
                  <button
                     type="button"
                     onClick={() => setMethodType("upi")}
                     className={cn(
                        "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2",
                        methodType === "upi"
                           ? "border-primary-500 bg-primary-50 text-primary-700"
                           : "border-gray-200 text-gray-600 hover:border-gray-300"
                     )}
                  >
                     <Smartphone className="w-4 h-4" />
                     UPI
                  </button>
               </div>

               {methodType === "card" ? (
                  <>
                     {/* Card Number */}
                     <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                           Card Number
                        </label>
                        <input
                           type="text"
                           value={formData.cardNumber}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 cardNumber: formatCardNumber(e.target.value),
                              })
                           }
                           placeholder="1234 5678 9012 3456"
                           className={cn(
                              "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                              errors.cardNumber
                                 ? "border-red-300"
                                 : "border-gray-300"
                           )}
                        />
                        {errors.cardNumber && (
                           <p className="text-xs text-red-500 mt-1">
                              {errors.cardNumber}
                           </p>
                        )}
                     </div>

                     {/* Cardholder Name */}
                     <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                           Cardholder Name
                        </label>
                        <input
                           type="text"
                           value={formData.cardHolder}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 cardHolder: e.target.value,
                              })
                           }
                           placeholder="Name on card"
                           className={cn(
                              "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                              errors.cardHolder
                                 ? "border-red-300"
                                 : "border-gray-300"
                           )}
                        />
                        {errors.cardHolder && (
                           <p className="text-xs text-red-500 mt-1">
                              {errors.cardHolder}
                           </p>
                        )}
                     </div>

                     {/* Expiry & CVV */}
                     <div className="grid grid-cols-3 gap-3">
                        <div>
                           <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Month
                           </label>
                           <select
                              value={formData.expiryMonth}
                              onChange={(e) =>
                                 setFormData({
                                    ...formData,
                                    expiryMonth: e.target.value,
                                 })
                              }
                              className={cn(
                                 "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                                 errors.expiry
                                    ? "border-red-300"
                                    : "border-gray-300"
                              )}
                           >
                              <option value="">MM</option>
                              {Array.from({ length: 12 }, (_, i) => (
                                 <option
                                    key={i + 1}
                                    value={String(i + 1).padStart(2, "0")}
                                 >
                                    {String(i + 1).padStart(2, "0")}
                                 </option>
                              ))}
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              Year
                           </label>
                           <select
                              value={formData.expiryYear}
                              onChange={(e) =>
                                 setFormData({
                                    ...formData,
                                    expiryYear: e.target.value,
                                 })
                              }
                              className={cn(
                                 "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                                 errors.expiry
                                    ? "border-red-300"
                                    : "border-gray-300"
                              )}
                           >
                              <option value="">YY</option>
                              {Array.from({ length: 10 }, (_, i) => {
                                 const year = new Date().getFullYear() + i;
                                 return (
                                    <option key={year} value={year}>
                                       {year}
                                    </option>
                                 );
                              })}
                           </select>
                        </div>
                        <div>
                           <label className="block text-xs font-medium text-gray-700 mb-1.5">
                              CVV
                           </label>
                           <input
                              type="password"
                              value={formData.cvv}
                              onChange={(e) =>
                                 setFormData({
                                    ...formData,
                                    cvv: e.target.value
                                       .replace(/\D/g, "")
                                       .slice(0, 4),
                                 })
                              }
                              placeholder="•••"
                              maxLength={4}
                              className={cn(
                                 "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                                 errors.cvv
                                    ? "border-red-300"
                                    : "border-gray-300"
                              )}
                           />
                        </div>
                     </div>
                     {(errors.expiry || errors.cvv) && (
                        <p className="text-xs text-red-500">
                           {errors.expiry || errors.cvv}
                        </p>
                     )}
                  </>
               ) : (
                  /* UPI ID */
                  <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        UPI ID
                     </label>
                     <input
                        type="text"
                        value={formData.upiId}
                        onChange={(e) =>
                           setFormData({ ...formData, upiId: e.target.value })
                        }
                        placeholder="yourname@upi"
                        className={cn(
                           "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                           errors.upiId ? "border-red-300" : "border-gray-300"
                        )}
                     />
                     {errors.upiId && (
                        <p className="text-xs text-red-500 mt-1">
                           {errors.upiId}
                        </p>
                     )}
                     <p className="text-xs text-gray-500 mt-2">
                        Enter your UPI ID linked to any UPI app like Google Pay,
                        PhonePe, Paytm, etc.
                     </p>
                  </div>
               )}

               {/* Security Note */}
               <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
                  <svg
                     className="w-4 h-4 text-gray-500 mt-0.5 shrink-0"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                     />
                  </svg>
                  <p className="text-xs text-gray-600">
                     Your payment information is encrypted and securely stored.
                     We comply with PCI DSS standards.
                  </p>
               </div>

               {/* Actions */}
               <div className="flex gap-3 pt-2">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onClose}
                     className="flex-1"
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                     Add {methodType === "card" ? "Card" : "UPI"}
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
}

interface PayoutMethodFormProps {
   isOpen: boolean;
   onClose: () => void;
   onSave: (data: Partial<PayoutMethod>) => void;
}

export function PayoutMethodForm({
   isOpen,
   onClose,
   onSave,
}: PayoutMethodFormProps) {
   const [methodType, setMethodType] = useState<"bank" | "upi">("bank");
   const [formData, setFormData] = useState({
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      bankName: "",
      upiId: "",
   });
   const [errors, setErrors] = useState<Record<string, string>>({});

   if (!isOpen) return null;

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (methodType === "bank") {
         if (!formData.accountNumber || formData.accountNumber.length < 9) {
            newErrors.accountNumber = "Enter a valid account number";
         }
         if (formData.accountNumber !== formData.confirmAccountNumber) {
            newErrors.confirmAccountNumber = "Account numbers don't match";
         }
         if (!formData.ifscCode || formData.ifscCode.length !== 11) {
            newErrors.ifscCode = "Enter a valid 11-character IFSC code";
         }
         if (!formData.accountHolderName) {
            newErrors.accountHolderName = "Account holder name is required";
         }
      } else {
         if (!formData.upiId || !formData.upiId.includes("@")) {
            newErrors.upiId = "Enter a valid UPI ID";
         }
      }

      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors);
         return;
      }

      if (methodType === "bank") {
         onSave({
            type: "bank",
            bankName: formData.bankName || "Bank",
            accountNumber: `XXXX XXXX ${formData.accountNumber.slice(-4)}`,
            ifscCode: formData.ifscCode.toUpperCase(),
            accountHolderName: formData.accountHolderName,
         });
      } else {
         onSave({
            type: "upi",
            upiId: formData.upiId,
         });
      }

      // Reset form
      setFormData({
         accountNumber: "",
         confirmAccountNumber: "",
         ifscCode: "",
         accountHolderName: "",
         bankName: "",
         upiId: "",
      });
      setErrors({});
   };

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
         <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
               <h3 className="text-base font-semibold text-gray-900">
                  Add Payout Method
               </h3>
               <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
               >
                  <svg
                     className="w-5 h-5 text-gray-500"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                     />
                  </svg>
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
               {/* Method Type Toggle */}
               <div className="flex gap-2">
                  <button
                     type="button"
                     onClick={() => setMethodType("bank")}
                     className={cn(
                        "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2",
                        methodType === "bank"
                           ? "border-primary-500 bg-primary-50 text-primary-700"
                           : "border-gray-200 text-gray-600 hover:border-gray-300"
                     )}
                  >
                     <Building2 className="w-4 h-4" />
                     Bank Account
                  </button>
                  <button
                     type="button"
                     onClick={() => setMethodType("upi")}
                     className={cn(
                        "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors flex items-center justify-center gap-2",
                        methodType === "upi"
                           ? "border-primary-500 bg-primary-50 text-primary-700"
                           : "border-gray-200 text-gray-600 hover:border-gray-300"
                     )}
                  >
                     <Smartphone className="w-4 h-4" />
                     UPI
                  </button>
               </div>

               {methodType === "bank" ? (
                  <>
                     {/* Account Holder Name */}
                     <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                           Account Holder Name *
                        </label>
                        <input
                           type="text"
                           value={formData.accountHolderName}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 accountHolderName: e.target.value,
                              })
                           }
                           placeholder="Name as per bank records"
                           className={cn(
                              "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                              errors.accountHolderName
                                 ? "border-red-300"
                                 : "border-gray-300"
                           )}
                        />
                        {errors.accountHolderName && (
                           <p className="text-xs text-red-500 mt-1">
                              {errors.accountHolderName}
                           </p>
                        )}
                     </div>

                     {/* Account Number */}
                     <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                           Account Number *
                        </label>
                        <input
                           type="text"
                           value={formData.accountNumber}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 accountNumber: e.target.value.replace(
                                    /\D/g,
                                    ""
                                 ),
                              })
                           }
                           placeholder="Enter account number"
                           className={cn(
                              "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                              errors.accountNumber
                                 ? "border-red-300"
                                 : "border-gray-300"
                           )}
                        />
                        {errors.accountNumber && (
                           <p className="text-xs text-red-500 mt-1">
                              {errors.accountNumber}
                           </p>
                        )}
                     </div>

                     {/* Confirm Account Number */}
                     <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                           Confirm Account Number *
                        </label>
                        <input
                           type="text"
                           value={formData.confirmAccountNumber}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 confirmAccountNumber: e.target.value.replace(
                                    /\D/g,
                                    ""
                                 ),
                              })
                           }
                           placeholder="Re-enter account number"
                           className={cn(
                              "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                              errors.confirmAccountNumber
                                 ? "border-red-300"
                                 : "border-gray-300"
                           )}
                        />
                        {errors.confirmAccountNumber && (
                           <p className="text-xs text-red-500 mt-1">
                              {errors.confirmAccountNumber}
                           </p>
                        )}
                     </div>

                     {/* IFSC Code */}
                     <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                           IFSC Code *
                        </label>
                        <input
                           type="text"
                           value={formData.ifscCode}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 ifscCode: e.target.value
                                    .toUpperCase()
                                    .slice(0, 11),
                              })
                           }
                           placeholder="e.g., HDFC0001234"
                           maxLength={11}
                           className={cn(
                              "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase",
                              errors.ifscCode
                                 ? "border-red-300"
                                 : "border-gray-300"
                           )}
                        />
                        {errors.ifscCode && (
                           <p className="text-xs text-red-500 mt-1">
                              {errors.ifscCode}
                           </p>
                        )}
                     </div>

                     {/* Bank Name (Optional) */}
                     <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                           Bank Name
                        </label>
                        <input
                           type="text"
                           value={formData.bankName}
                           onChange={(e) =>
                              setFormData({
                                 ...formData,
                                 bankName: e.target.value,
                              })
                           }
                           placeholder="e.g., HDFC Bank"
                           className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                     </div>
                  </>
               ) : (
                  /* UPI ID */
                  <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        UPI ID *
                     </label>
                     <input
                        type="text"
                        value={formData.upiId}
                        onChange={(e) =>
                           setFormData({ ...formData, upiId: e.target.value })
                        }
                        placeholder="yourname@upi"
                        className={cn(
                           "w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500",
                           errors.upiId ? "border-red-300" : "border-gray-300"
                        )}
                     />
                     {errors.upiId && (
                        <p className="text-xs text-red-500 mt-1">
                           {errors.upiId}
                        </p>
                     )}
                     <p className="text-xs text-gray-500 mt-2">
                        Payouts will be sent directly to your UPI-linked bank
                        account.
                     </p>
                  </div>
               )}

               {/* Info Note */}
               <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                  <svg
                     className="w-4 h-4 text-blue-600 mt-0.5 shrink-0"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                     />
                  </svg>
                  <p className="text-xs text-blue-700">
                     {methodType === "bank"
                        ? "Bank account verification may take 1-2 business days. A small test deposit will be made for verification."
                        : "UPI payouts are instant once verified. Make sure the UPI ID is active and linked to your bank account."}
                  </p>
               </div>

               {/* Actions */}
               <div className="flex gap-3 pt-2">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={onClose}
                     className="flex-1"
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     className="flex-1 bg-primary-600 hover:bg-primary-700"
                  >
                     Add {methodType === "bank" ? "Bank Account" : "UPI"}
                  </Button>
               </div>
            </form>
         </div>
      </div>
   );
}
