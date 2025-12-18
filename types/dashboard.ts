/**
 * Dashboard type definitions
 * Types for the unified home page command center
 */

import { Task } from "./task";
import { TaskApplication } from "./application";

/**
 * User's current status across all activities
 */
export interface UserCurrentStatus {
   // Active tasks the user is involved in (as poster or tasker)
   activeTasks: ActiveTaskItem[];
   // Pending offers/applications requiring attention
   pendingOffers: PendingOfferItem[];
   // Ongoing chats with unread messages
   activeChats: ActiveChatItem[];
   // Payments requiring action
   pendingPayments: PendingPaymentItem[];
}

export interface ActiveTaskItem {
   id: string;
   title: string;
   status: Task["status"];
   role: "poster" | "tasker";
   otherPartyName?: string;
   nextAction: string;
   nextActionRoute: string;
   urgency: "low" | "medium" | "high";
   scheduledDate?: Date;
   budget: number;
}

export interface PendingOfferItem {
   id: string;
   taskId: string;
   taskTitle: string;
   type: "received" | "sent";
   applicantName?: string;
   proposedBudget: number;
   createdAt: Date;
   actionRoute: string;
}

export interface ActiveChatItem {
   id: string;
   taskId: string;
   taskTitle: string;
   otherPartyName: string;
   otherPartyAvatar?: string;
   lastMessage: string;
   lastMessageTime: Date;
   unreadCount: number;
}

export interface PendingPaymentItem {
   id: string;
   taskId: string;
   taskTitle: string;
   amount: number;
   type: "release" | "receive" | "escrow";
   dueDate?: Date;
   actionLabel: string;
   actionRoute: string;
}

/**
 * Primary action types based on user context
 */
export interface PrimaryAction {
   id: string;
   label: string;
   description: string;
   icon: string;
   route: string;
   variant: "primary" | "secondary" | "outline";
   priority: number;
}

/**
 * Activity feed item types
 */
export type ActivityType =
   | "offer_received"
   | "offer_sent"
   | "offer_accepted"
   | "offer_rejected"
   | "message_received"
   | "payment_released"
   | "payment_received"
   | "task_completed"
   | "task_started"
   | "task_assigned"
   | "task_posted"
   | "review_received";

export interface ActivityItem {
   id: string;
   type: ActivityType;
   title: string;
   description: string;
   relatedTaskId?: string;
   relatedTaskTitle?: string;
   timestamp: Date;
   isRead: boolean;
   actionRoute?: string;
}

/**
 * Task snapshot for quick overview
 */
export interface TaskSnapshotItem {
   id: string;
   title: string;
   status: Task["status"];
   role: "poster" | "tasker";
   nextStep: string;
   nextStepRoute: string;
   progress?: number; // 0-100
   dueDate?: Date;
   budget: number;
}

/**
 * Contextual nudges for incomplete items
 */
export type NudgeType =
   | "verification_pending"
   | "payout_method_missing"
   | "profile_incomplete"
   | "email_unverified"
   | "phone_unverified"
   | "bank_unverified";

export interface ContextualNudge {
   id: string;
   type: NudgeType;
   title: string;
   description: string;
   actionLabel: string;
   actionRoute: string;
   priority: "low" | "medium" | "high";
   dismissible: boolean;
}

/**
 * Complete dashboard data structure
 */
export interface DashboardData {
   currentStatus: UserCurrentStatus;
   primaryActions: PrimaryAction[];
   activityFeed: ActivityItem[];
   taskSnapshots: TaskSnapshotItem[];
   nudges: ContextualNudge[];
   stats: DashboardStats;
}

export interface DashboardStats {
   totalTasksPosted: number;
   totalTasksCompleted: number;
   totalTasksAsTasker: number;
   totalEarnings: number;
   totalSpent: number;
   averageRating: number;
}

/**
 * Empty state configuration
 */
export interface EmptyStateConfig {
   title: string;
   description: string;
   whatWillAppear: string;
   whenItAppears: string;
   actionLabel?: string;
   actionRoute?: string;
}



