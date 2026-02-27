import {
   PaymentError,
   PaymentSummary,
   PaymentTransaction,
} from "@/types/payment";
import { PaymentMethod, PayoutMethod, Transaction } from "@/types/profile";

// Mock payment methods for demo
export const mockPaymentMethods: PaymentMethod[] = [];

// Mock payout methods for demo
export const mockPayoutMethods: PayoutMethod[] = [];

// Mock transaction data for demo
export const mockTransactions: Transaction[] = [
   {
      id: "txn1",
      type: "payment",
      amount: 1500,
      currency: "INR",
      description: "Payment for Furniture Assembly",
      status: "completed",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      taskTitle: "Furniture Assembly",
      taskId: "task1",
   },
   {
      id: "txn2",
      type: "payout",
      amount: 2500,
      currency: "INR",
      description: "Earnings from Deep Cleaning Task",
      status: "completed",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      taskTitle: "Deep Cleaning",
      taskId: "task2",
   },
   {
      id: "txn3",
      type: "payment",
      amount: 800,
      currency: "INR",
      description: "Payment for Grocery Delivery",
      status: "pending",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      taskTitle: "Grocery Delivery",
      taskId: "task3",
   },
   {
      id: "txn4",
      type: "payout",
      amount: 3200,
      currency: "INR",
      description: "Earnings from Garden Maintenance",
      status: "completed",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      taskTitle: "Garden Maintenance",
      taskId: "task4",
   },
   {
      id: "txn5",
      type: "refund",
      amount: 500,
      currency: "INR",
      description: "Refund for cancelled task",
      status: "completed",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      taskTitle: "Pet Walking",
      taskId: "task5",
   },
   {
      id: "txn6",
      type: "payment",
      amount: 2200,
      currency: "INR",
      description: "Payment for AC Service & Repair",
      status: "completed",
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      taskTitle: "AC Service & Repair",
      taskId: "task6",
   },
   {
      id: "txn7",
      type: "payout",
      amount: 4500,
      currency: "INR",
      description: "Earnings from Plumbing Work",
      status: "completed",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      taskTitle: "Bathroom Plumbing",
      taskId: "task7",
   },
   {
      id: "txn8",
      type: "payment",
      amount: 1200,
      currency: "INR",
      description: "Payment for Dog Walking",
      status: "failed",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      taskTitle: "Pet Walking",
      taskId: "task8",
   },
   {
      id: "txn9",
      type: "payout",
      amount: 1800,
      currency: "INR",
      description: "Earnings from Moving Help",
      status: "pending",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      taskTitle: "Moving Assistance",
      taskId: "task9",
   },
   {
      id: "txn10",
      type: "payment",
      amount: 3500,
      currency: "INR",
      description: "Payment for Event Photography",
      status: "completed",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      taskTitle: "Birthday Party Photography",
      taskId: "task10",
   },
   {
      id: "txn11",
      type: "payout",
      amount: 5000,
      currency: "INR",
      description: "Earnings from Home Painting",
      status: "completed",
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
      taskTitle: "Living Room Painting",
      taskId: "task11",
   },
   {
      id: "txn12",
      type: "payment",
      amount: 650,
      currency: "INR",
      description: "Payment for Laundry Service",
      status: "completed",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      taskTitle: "Laundry & Ironing",
      taskId: "task12",
   },
];

export const mockPaymentSummary: PaymentSummary = {
   taskId: "task-123",
   taskTitle: "Deep House Cleaning - 3BHK Apartment",
   taskAmount: 2500,
   serviceFee: 125,
   platformFee: 125, // 5% of 2500
   totalAmount: 2750,
   currency: "INR",
   taskerName: "Rajesh Kumar",
};

export const mockPaymentError: PaymentError = {
   code: "PAYMENT_DECLINED",
   userMessage:
      "Your payment was declined by the bank. Please try a different payment method or contact your bank.",
   retryable: true,
   suggestedAction: "Try using a different card or UPI",
};

export const mockRefundTransaction: PaymentTransaction = {
   id: "txn-refund-789",
   type: "refund",
   amount: 2685,
   currency: "INR",
   status: "completed",
   description: "Refund for cancelled task - Deep House Cleaning",
   taskId: "task-123",
   taskTitle: "Deep House Cleaning",
   createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
   completedAt: new Date(),
};

export const mockPendingRefund: PaymentTransaction = {
   id: "txn-refund-790",
   type: "refund",
   amount: 1500,
   currency: "INR",
   status: "processing",
   description: "Refund for task dispute - Furniture Assembly",
   taskId: "task-456",
   taskTitle: "Furniture Assembly",
   createdAt: new Date(),
};
