"use client";

/**
 * Profile Payments Page
 * Shows user's payment history, escrows, and transactions
 */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { PaymentsTransactionsSection } from "@/components/payments";
import { TransactionWithDetails, EscrowWithDetails } from "@/types/payment";
import { getTransactions, getActiveEscrows } from "@/lib/services/payment";
import { ArrowLeft } from "lucide-react";

export default function ProfilePaymentsPage() {
   const router = useRouter();
   const { currentUser, userData, loading: authLoading } = useAuth();

   const [transactions, setTransactions] = useState<TransactionWithDetails[]>(
      []
   );
   const [activeEscrows, setActiveEscrows] = useState<EscrowWithDetails[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [page, setPage] = useState(1);
   const [hasMore, setHasMore] = useState(false);

   // Mock user ID for development
   const userId = currentUser?.uid || userData?.uid || "user1";

   useEffect(() => {
      loadData();
   }, [userId]);

   const loadData = async () => {
      setIsLoading(true);
      try {
         const [transactionsRes, escrowsRes] = await Promise.all([
            getTransactions(userId, undefined, 1, 20),
            getActiveEscrows(userId),
         ]);

         setTransactions(
            transactionsRes.transactions as TransactionWithDetails[]
         );
         setHasMore(
            transactionsRes.pagination.page < transactionsRes.pagination.pages
         );
         setActiveEscrows(escrowsRes as EscrowWithDetails[]);
      } catch (error) {
         console.error("Failed to load payment data:", error);
      } finally {
         setIsLoading(false);
      }
   };

   const loadMoreTransactions = async () => {
      try {
         const nextPage = page + 1;
         const response = await getTransactions(
            userId,
            undefined,
            nextPage,
            20
         );
         setTransactions((prev) => [
            ...prev,
            ...(response.transactions as TransactionWithDetails[]),
         ]);
         setPage(nextPage);
         setHasMore(response.pagination.page < response.pagination.pages);
      } catch (error) {
         console.error("Failed to load more transactions:", error);
      }
   };

   const handleViewTask = (taskId: string) => {
      router.push(`/tasks/${taskId}`);
   };

   const handleManagePaymentMethods = () => {
      router.push("/profile?section=payments");
   };

   if (authLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner />
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Header */}
         <div className="bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 py-4">
               <button
                  onClick={() => router.back()}
                  className="flex items-center text-gray-500 hover:text-gray-700 mb-3 text-sm"
               >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
               </button>
               <h1 className="text-xl font-semibold text-gray-900">
                  Payments & Transactions
               </h1>
            </div>
         </div>

         {/* Content */}
         <div className="max-w-4xl mx-auto px-4 py-6">
            <PaymentsTransactionsSection
               currentUserUid={userId}
               transactions={transactions}
               activeEscrows={activeEscrows}
               isLoading={isLoading}
               hasMoreTransactions={hasMore}
               onLoadMoreTransactions={loadMoreTransactions}
               onViewTask={handleViewTask}
               onManagePaymentMethods={handleManagePaymentMethods}
            />
         </div>
      </div>
   );
}
