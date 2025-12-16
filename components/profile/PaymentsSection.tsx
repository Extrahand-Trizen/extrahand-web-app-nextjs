"use client";

/**
 * Payments Section
 * Payment methods, payouts, and transaction history
 */

import React, { useState } from "react";
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
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  ExternalLink,
} from "lucide-react";
import { PaymentMethod, PayoutMethod, Transaction } from "@/types/profile";

interface PaymentsSectionProps {
  paymentMethods: PaymentMethod[];
  payoutMethods: PayoutMethod[];
  transactions: Transaction[];
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
  onAddPaymentMethod,
  onAddPayoutMethod,
  onRemovePaymentMethod,
  onRemovePayoutMethod,
  onSetDefaultPayment,
  onSetDefaultPayout,
}: PaymentsSectionProps) {
  const [activeTab, setActiveTab] = useState("payment");

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Payments</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your payment methods, payouts, and view transaction history
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="payout">Payouts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
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
                    onSetDefault={() => onSetDefaultPayment(method.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <CreditCard className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-4">
                  No payment methods added yet
                </p>
                <Button onClick={onAddPaymentMethod} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            )}
          </div>

          {paymentMethods.length > 0 && (
            <Button variant="outline" onClick={onAddPaymentMethod}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">
              Your payment information is securely encrypted. We never store your full card details.
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
              <div className="px-5 py-8 text-center">
                <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">
                  No payout method added yet
                </p>
                <p className="text-xs text-gray-400 mb-4">
                  Add a bank account or UPI to receive payments for completed tasks
                </p>
                <Button onClick={onAddPayoutMethod} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payout Method
                </Button>
              </div>
            )}
          </div>

          {payoutMethods.length > 0 && (
            <Button variant="outline" onClick={onAddPayoutMethod}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payout Method
            </Button>
          )}

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-900">Payout Schedule</h4>
            <p className="text-xs text-gray-500">
              Payouts are processed within 1-2 business days after task completion.
              Bank transfers may take an additional 1-3 business days.
            </p>
          </div>
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="history" className="space-y-4 mt-4">
          <div className="bg-white rounded-lg border border-gray-200">
            {transactions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {transactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
              </div>
            ) : (
              <div className="px-5 py-8 text-center">
                <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  No transactions yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Your payment and payout history will appear here
                </p>
              </div>
            )}
          </div>
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

function PaymentMethodRow({ method, onRemove, onSetDefault }: PaymentMethodRowProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          {method.type === "card" && <CreditCard className="w-5 h-5 text-gray-600" />}
          {method.type === "upi" && <Smartphone className="w-5 h-5 text-gray-600" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {method.type === "card" && `${method.cardBrand?.toUpperCase() || "Card"} •••• ${method.lastFour}`}
              {method.type === "upi" && method.upiId}
            </span>
            {method.isDefault && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                Default
              </Badge>
            )}
          </div>
          {method.type === "card" && method.expiryMonth && method.expiryYear && (
            <p className="text-xs text-gray-500 mt-0.5">
              Expires {method.expiryMonth}/{method.expiryYear}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!method.isDefault && (
            <Button variant="ghost" size="sm" onClick={onSetDefault}>
              Set Default
            </Button>
          )}
          {showConfirm ? (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onRemove();
                  setShowConfirm(false);
                }}
              >
                Remove
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowConfirm(true)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
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

function PayoutMethodRow({ method, onRemove, onSetDefault }: PayoutMethodRowProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
          {method.type === "bank" && <Building2 className="w-5 h-5 text-gray-600" />}
          {method.type === "upi" && <Smartphone className="w-5 h-5 text-gray-600" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {method.type === "bank" && `${method.bankName} •••• ${method.accountNumber?.slice(-4)}`}
              {method.type === "upi" && method.upiId}
            </span>
            {method.isDefault && (
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                Default
              </Badge>
            )}
            {method.isVerified ? (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                <AlertCircle className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            )}
          </div>
          {method.type === "bank" && method.accountHolderName && (
            <p className="text-xs text-gray-500 mt-0.5">
              {method.accountHolderName}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!method.isDefault && method.isVerified && (
            <Button variant="ghost" size="sm" onClick={onSetDefault}>
              Set Default
            </Button>
          )}
          {showConfirm ? (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onRemove();
                  setShowConfirm(false);
                }}
              >
                Remove
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowConfirm(true)}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
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
  const isCredit = transaction.type === "payout" || transaction.type === "refund";
  
  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          isCredit ? "bg-green-100" : "bg-gray-100"
        )}>
          {isCredit ? (
            <ArrowDownLeft className="w-5 h-5 text-green-600" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-gray-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {transaction.description}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {formatDate(transaction.createdAt)}
            {transaction.taskTitle && ` • ${transaction.taskTitle}`}
          </p>
        </div>

        <div className="text-right">
          <p className={cn(
            "text-sm font-semibold",
            isCredit ? "text-green-600" : "text-gray-900"
          )}>
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
    completed: { label: "Completed", className: "bg-green-100 text-green-700" },
    pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
    failed: { label: "Failed", className: "bg-red-100 text-red-700" },
    cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600" },
  };

  const { label, className } = config[status];

  return (
    <Badge variant="secondary" className={cn("text-xs mt-1", className)}>
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

export default PaymentsSection;
