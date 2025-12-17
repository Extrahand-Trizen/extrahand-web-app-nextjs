/**
 * Payment Service
 * Mock data service for UI development
 * Replace with actual API calls when backend is ready
 */

import {
   CreateEscrowRequest,
   CreateEscrowResponse,
   VerifyPaymentRequest,
   ReleasePaymentRequest,
   ReleasePaymentResponse,
   RefundRequest,
   RefundResponse,
   TransactionListResponse,
   TransactionFilters,
   Escrow,
   PaymentTransaction,
   EscrowWithDetails,
   TransactionWithDetails,
} from "@/types/payment";

// ============================================================================
// MOCK DATA
// ============================================================================

const mockEscrows: EscrowWithDetails[] = [
   {
      _id: "esc1",
      escrowId: "ESC_1702992000000_abc123",
      razorpayOrderId: "order_abc123",
      razorpayPaymentId: "pay_abc123",
      posterUid: "user1",
      performerUid: "user2",
      taskId: "task3",
      amount: 80000,
      amountInRupees: 800,
      currency: "INR",
      status: "held",
      paymentStatus: "captured",
      autoReleaseEnabled: true,
      autoReleaseAfterDays: 7,
      autoReleaseDate: new Date(
         Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      heldAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      taskTitle: "Assemble IKEA wardrobe",
      performerName: "Rajesh Kumar",
      posterName: "Anita Kapoor",
   },
   {
      _id: "esc2",
      escrowId: "ESC_1702992000000_def456",
      razorpayOrderId: "order_def456",
      posterUid: "user1",
      performerUid: "user4",
      taskId: "task4",
      amount: 120000,
      amountInRupees: 1200,
      currency: "INR",
      status: "pending",
      autoReleaseEnabled: true,
      autoReleaseAfterDays: 7,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      taskTitle: "Deep clean 2BHK apartment",
      performerName: "Priya Sharma",
      posterName: "Anita Kapoor",
   },
   {
      _id: "esc3",
      escrowId: "ESC_1702992000000_ghi789",
      razorpayOrderId: "order_ghi789",
      razorpayPaymentId: "pay_ghi789",
      posterUid: "user1",
      performerUid: "user3",
      taskId: "task1",
      amount: 50000,
      amountInRupees: 500,
      currency: "INR",
      status: "released",
      paymentStatus: "captured",
      autoReleaseEnabled: false,
      heldAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      releasedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      releaseTransactionId: "txn2",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      taskTitle: "Fix kitchen sink",
      performerName: "Amit Patel",
      posterName: "Anita Kapoor",
   },
];

const mockTransactions: TransactionWithDetails[] = [
   {
      _id: "txn1",
      transactionId: "TXN_1702819200000_abc123",
      razorpayPaymentId: "pay_abc123",
      posterUid: "user1",
      performerUid: "user3",
      taskId: "task1",
      amount: 50000,
      amountInRupees: 500,
      currency: "INR",
      type: "escrow",
      status: "completed",
      paymentMethod: "upi",
      completedAt: new Date(
         Date.now() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      taskTitle: "Fix kitchen sink",
      posterName: "Anita Kapoor",
      performerName: "Amit Patel",
   },
   {
      _id: "txn2",
      transactionId: "TXN_1702905600000_def456",
      posterUid: "user1",
      performerUid: "user3",
      taskId: "task1",
      amount: 50000,
      amountInRupees: 500,
      currency: "INR",
      type: "release",
      status: "completed",
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      taskTitle: "Fix kitchen sink",
      posterName: "Anita Kapoor",
      performerName: "Amit Patel",
   },
   {
      _id: "txn3",
      transactionId: "TXN_1702992000000_ghi789",
      razorpayPaymentId: "pay_ghi789",
      posterUid: "user1",
      performerUid: "user2",
      taskId: "task3",
      amount: 80000,
      amountInRupees: 800,
      currency: "INR",
      type: "escrow",
      status: "completed",
      paymentMethod: "card",
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      taskTitle: "Assemble IKEA wardrobe",
      posterName: "Anita Kapoor",
      performerName: "Rajesh Kumar",
   },
   {
      _id: "txn4",
      transactionId: "TXN_1703000000000_jkl012",
      razorpayPaymentId: "pay_jkl012",
      posterUid: "user1",
      performerUid: "user4",
      taskId: "task4",
      amount: 120000,
      amountInRupees: 1200,
      currency: "INR",
      type: "escrow",
      status: "pending",
      paymentMethod: "netbanking",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      taskTitle: "Deep clean 2BHK apartment",
      posterName: "Anita Kapoor",
      performerName: "Priya Sharma",
   },
];

// ============================================================================
// MOCK SERVICE FUNCTIONS
// ============================================================================

/**
 * Simulate API delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create an escrow for a task (mock)
 */
export async function createEscrow(
   request: CreateEscrowRequest
): Promise<CreateEscrowResponse> {
   await delay(800);

   const newEscrow: Escrow = {
      _id: `esc_${Date.now()}`,
      escrowId: `ESC_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      razorpayOrderId: `order_${Math.random().toString(36).slice(2, 11)}`,
      posterUid: "user1", // Current user
      performerUid: request.performerUid,
      taskId: request.taskId,
      applicationId: request.applicationId,
      amount: request.amount * 100,
      amountInRupees: request.amount,
      currency: "INR",
      status: "pending",
      autoReleaseEnabled: true,
      autoReleaseAfterDays: 7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
   };

   return {
      success: true,
      escrow: newEscrow,
      razorpayOrderId: newEscrow.razorpayOrderId,
   };
}

/**
 * Verify payment after Razorpay checkout (mock)
 */
export async function verifyPayment(
   request: VerifyPaymentRequest
): Promise<{ success: boolean; escrow?: Escrow; error?: string }> {
   await delay(500);

   // Find and update escrow
   const escrowIndex = mockEscrows.findIndex(
      (e) => e.razorpayOrderId === request.razorpay_order_id
   );

   if (escrowIndex === -1) {
      // Create mock updated escrow
      return {
         success: true,
         escrow: {
            _id: "new_esc",
            escrowId: request.escrowId,
            razorpayOrderId: request.razorpay_order_id,
            razorpayPaymentId: request.razorpay_payment_id,
            posterUid: "user1",
            performerUid: "user2",
            taskId: "task_new",
            amount: 100000,
            amountInRupees: 1000,
            currency: "INR",
            status: "held",
            paymentStatus: "captured",
            autoReleaseEnabled: true,
            autoReleaseAfterDays: 7,
            autoReleaseDate: new Date(
               Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            heldAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
         },
      };
   }

   return {
      success: true,
      escrow: {
         ...mockEscrows[escrowIndex],
         status: "held",
         razorpayPaymentId: request.razorpay_payment_id,
         paymentStatus: "captured",
         heldAt: new Date().toISOString(),
      },
   };
}

/**
 * Release escrow payment to tasker (mock)
 */
export async function releasePayment(
   request: ReleasePaymentRequest
): Promise<ReleasePaymentResponse> {
   await delay(1000);

   const transactionId = `TXN_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`;

   return {
      success: true,
      transaction: {
         _id: transactionId,
         transactionId,
         posterUid: "user1",
         performerUid: "user2",
         taskId: request.taskId,
         amount: 80000,
         amountInRupees: 800,
         currency: "INR",
         type: "release",
         status: "completed",
         escrowId: request.escrowId,
         completedAt: new Date().toISOString(),
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
      },
   };
}

/**
 * Request a refund (mock)
 */
export async function requestRefund(
   request: RefundRequest
): Promise<RefundResponse> {
   await delay(1000);

   const transactionId = `TXN_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`;

   return {
      success: true,
      refund: {
         _id: transactionId,
         transactionId,
         razorpayRefundId: `rfnd_${Math.random().toString(36).slice(2, 11)}`,
         posterUid: "user1",
         taskId: request.taskId,
         amount: 80000,
         amountInRupees: 800,
         currency: "INR",
         type: "refund",
         status: "processing",
         escrowId: request.escrowId,
         metadata: { reason: request.reason },
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
      },
   };
}

/**
 * Get escrow by ID (mock)
 */
export async function getEscrow(escrowId: string): Promise<Escrow> {
   await delay(300);

   const escrow = mockEscrows.find((e) => e.escrowId === escrowId);

   if (!escrow) {
      throw new Error("Escrow not found");
   }

   return escrow;
}

/**
 * Get escrow by task ID (mock)
 */
export async function getEscrowByTask(taskId: string): Promise<Escrow | null> {
   await delay(300);

   const escrow = mockEscrows.find((e) => e.taskId === taskId);

   return escrow || null;
}

/**
 * Get user's transactions (mock)
 */
export async function getTransactions(
   userId: string,
   filters?: TransactionFilters,
   page: number = 1,
   limit: number = 20
): Promise<TransactionListResponse> {
   await delay(500);

   let filtered = mockTransactions.filter(
      (t) => t.posterUid === userId || t.performerUid === userId
   );

   if (filters?.status && filters.status !== "all") {
      filtered = filtered.filter((t) => t.status === filters.status);
   }

   if (filters?.type && filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type);
   }

   // Sort by date descending
   filtered.sort(
      (a, b) =>
         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
   );

   const total = filtered.length;
   const paginated = filtered.slice((page - 1) * limit, page * limit);

   return {
      transactions: paginated,
      pagination: {
         page,
         limit,
         total,
         pages: Math.ceil(total / limit),
      },
   };
}

/**
 * Get user's active escrows (mock)
 */
export async function getActiveEscrows(
   userId: string
): Promise<EscrowWithDetails[]> {
   await delay(400);

   return mockEscrows.filter(
      (e) =>
         (e.posterUid === userId || e.performerUid === userId) &&
         (e.status === "pending" || e.status === "held")
   );
}

/**
 * Get transaction by ID (mock)
 */
export async function getTransaction(
   transactionId: string
): Promise<PaymentTransaction> {
   await delay(300);

   const transaction = mockTransactions.find(
      (t) => t.transactionId === transactionId
   );

   if (!transaction) {
      throw new Error("Transaction not found");
   }

   return transaction;
}
