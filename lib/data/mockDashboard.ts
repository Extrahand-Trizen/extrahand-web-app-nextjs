/**
 * Mock Dashboard Data
 * Static data for the unified home page
 */

import type {
   DashboardData,
   UserCurrentStatus,
   ActiveTaskItem,
   PendingOfferItem,
   ActiveChatItem,
   PendingPaymentItem,
   ActivityItem,
   TaskSnapshotItem,
   ContextualNudge,
   PrimaryAction,
   DashboardStats,
} from "@/types/dashboard";

// Mock user info
export const mockUser = {
   name: "Rahul Sharma",
   email: "rahul.sharma@email.com",
   phone: "+91 98765 43210",
   photoURL: "/assets/images/avatar.png",
   isPhoneVerified: true,
   isEmailVerified: false,
   isAadhaarVerified: false,
   isBankVerified: false,
};

// Active tasks the user is involved in
const mockActiveTasks: ActiveTaskItem[] = [
   {
      id: "task_67890",
      title: "Help move furniture to new apartment",
      status: "in_progress",
      role: "poster",
      otherPartyName: "Mike Johnson",
      nextAction: "Track progress",
      nextActionRoute: "/tasks/task_67890",
      urgency: "medium",
      scheduledDate: new Date(Date.now() + 3600000), // 1 hour from now
      budget: 2500,
   },
   {
      id: "task_12345",
      title: "Fix leaking kitchen faucet",
      status: "assigned",
      role: "tasker",
      otherPartyName: "Sarah Chen",
      nextAction: "Start the task",
      nextActionRoute: "/tasks/task_12345",
      urgency: "high",
      scheduledDate: new Date(Date.now() + 86400000), // Tomorrow
      budget: 800,
   },
];

// Pending offers
const mockPendingOffers: PendingOfferItem[] = [
   {
      id: "offer_1",
      taskId: "1",
      taskTitle: "Sofa Deep Cleaning - 5 Seater",
      type: "received",
      applicantName: "Vijay Kumar",
      proposedBudget: 1400,
      createdAt: new Date(Date.now() - 1800000), // 30 mins ago
      actionRoute: "/tasks/1/applications",
   },
   {
      id: "offer_2",
      taskId: "3",
      taskTitle: "Ceiling Fan Installation",
      type: "sent",
      proposedBudget: 450,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
      actionRoute: "/applications",
   },
];

// Active chats with unread messages
const mockActiveChats: ActiveChatItem[] = [
   {
      id: "chat_1",
      taskId: "task_67890",
      taskTitle: "Help move furniture to new apartment",
      otherPartyName: "Mike Johnson",
      lastMessage: "I'll be there in 30 minutes with the truck",
      lastMessageTime: new Date(Date.now() - 600000), // 10 mins ago
      unreadCount: 2,
   },
   {
      id: "chat_5",
      taskId: "task_77777",
      taskTitle: "Clean apartment before move-out",
      otherPartyName: "Jennifer Lopez",
      lastMessage: "I'll bring all cleaning supplies",
      lastMessageTime: new Date(Date.now() - 7200000), // 2 hours ago
      unreadCount: 1,
   },
];

// Pending payments
const mockPendingPayments: PendingPaymentItem[] = [
   {
      id: "payment_1",
      taskId: "task_54321",
      taskTitle: "Paint living room walls",
      amount: 3500,
      type: "release",
      actionLabel: "Release Payment",
      actionRoute: "/tasks/task_54321",
   },
];

// Current status aggregation
const mockCurrentStatus: UserCurrentStatus = {
   activeTasks: mockActiveTasks,
   pendingOffers: mockPendingOffers,
   activeChats: mockActiveChats,
   pendingPayments: mockPendingPayments,
};

// Primary actions based on user context
const mockPrimaryActions: PrimaryAction[] = [
   {
      id: "post-task",
      label: "Post a Task",
      description: "Get help with anything you need",
      icon: "post",
      route: "/tasks/new",
      variant: "primary",
      priority: 1,
   },
   {
      id: "review-offers",
      label: "Review Offers",
      description: "2 offers awaiting your response",
      icon: "offers",
      route: "/tasks/1/applications",
      variant: "secondary",
      priority: 2,
   },
   {
      id: "browse-tasks",
      label: "Browse Tasks",
      description: "Find tasks to work on nearby",
      icon: "browse",
      route: "/tasks",
      variant: "outline",
      priority: 3,
   },
];

// Activity feed
const mockActivityFeed: ActivityItem[] = [
   {
      id: "activity_1",
      type: "offer_received",
      title: "New offer received",
      description: "Vijay Kumar offered ₹1,400 for your task",
      relatedTaskId: "1",
      relatedTaskTitle: "Sofa Deep Cleaning - 5 Seater",
      timestamp: new Date(Date.now() - 1800000), // 30 mins ago
      isRead: false,
      actionRoute: "/tasks/1/applications",
   },
   {
      id: "activity_2",
      type: "message_received",
      title: "New message from Mike Johnson",
      description: "I'll be there in 30 minutes with the truck",
      relatedTaskId: "task_67890",
      relatedTaskTitle: "Help move furniture to new apartment",
      timestamp: new Date(Date.now() - 600000), // 10 mins ago
      isRead: false,
      actionRoute: "/chat?id=chat_1",
   },
   {
      id: "activity_3",
      type: "task_assigned",
      title: "You were assigned to a task",
      description: "Sarah Chen accepted your application",
      relatedTaskId: "task_12345",
      relatedTaskTitle: "Fix leaking kitchen faucet",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: true,
      actionRoute: "/tasks/task_12345",
   },
   {
      id: "activity_4",
      type: "task_completed",
      title: "Task completed",
      description: "Paint living room walls",
      relatedTaskId: "task_54321",
      relatedTaskTitle: "Paint living room walls",
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      isRead: true,
      actionRoute: "/tasks/task_54321",
   },
   {
      id: "activity_5",
      type: "payment_received",
      title: "Payment received",
      description: "₹2,800 for Garden maintenance and lawn mowing",
      relatedTaskId: "task_66666",
      relatedTaskTitle: "Garden maintenance and lawn mowing",
      timestamp: new Date(Date.now() - 432000000), // 5 days ago
      isRead: true,
   },
   {
      id: "activity_6",
      type: "offer_sent",
      title: "You applied to a task",
      description: "Ceiling Fan Installation",
      relatedTaskId: "3",
      relatedTaskTitle: "Ceiling Fan Installation",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: true,
      actionRoute: "/applications",
   },
   {
      id: "activity_7",
      type: "review_received",
      title: "You received a 5-star review",
      description: "Great work! Very professional and efficient.",
      relatedTaskId: "task_66666",
      relatedTaskTitle: "Garden maintenance and lawn mowing",
      timestamp: new Date(Date.now() - 518400000), // 6 days ago
      isRead: true,
   },
];

// Task snapshots
const mockTaskSnapshots: TaskSnapshotItem[] = [
   {
      id: "task_67890",
      title: "Help move furniture to new apartment",
      status: "in_progress",
      role: "poster",
      nextStep: "Track progress",
      nextStepRoute: "/tasks/task_67890",
      progress: 75,
      budget: 2500,
   },
   {
      id: "task_12345",
      title: "Fix leaking kitchen faucet",
      status: "assigned",
      role: "tasker",
      nextStep: "Start the task",
      nextStepRoute: "/tasks/task_12345",
      progress: 25,
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      budget: 800,
   },
   {
      id: "1",
      title: "Sofa Deep Cleaning - 5 Seater",
      status: "open",
      role: "poster",
      nextStep: "Review 11 applications",
      nextStepRoute: "/tasks/1/applications",
      progress: 0,
      dueDate: new Date(Date.now() + 86400000),
      budget: 1500,
   },
];

// Contextual nudges
const mockNudges: ContextualNudge[] = [
   {
      id: "email-verification",
      type: "email_unverified",
      title: "Verify your email",
      description:
         "Email verification enables important notifications and account recovery.",
      actionLabel: "Verify Email",
      actionRoute: "/profile/verify/email",
      priority: "low",
      dismissible: true,
   },
   {
      id: "aadhaar-verification",
      type: "verification_pending",
      title: "Complete identity verification",
      description:
         "Verified accounts get more responses and build trust with clients.",
      actionLabel: "Verify Identity",
      actionRoute: "/profile/verify/aadhaar",
      priority: "medium",
      dismissible: true,
   },
   {
      id: "bank-verification",
      type: "payout_method_missing",
      title: "Add payout method",
      description:
         "Add your bank account to receive payments for completed tasks.",
      actionLabel: "Add Bank Account",
      actionRoute: "/profile/verify/bank",
      priority: "medium",
      dismissible: true,
   },
];

// Dashboard stats
const mockStats: DashboardStats = {
   totalTasksPosted: 8,
   totalTasksCompleted: 5,
   totalTasksAsTasker: 12,
   totalEarnings: 24500,
   totalSpent: 15200,
   averageRating: 4.8,
};

// Complete dashboard data export
export const mockDashboardData: DashboardData = {
   currentStatus: mockCurrentStatus,
   primaryActions: mockPrimaryActions,
   activityFeed: mockActivityFeed,
   taskSnapshots: mockTaskSnapshots,
   nudges: mockNudges,
   stats: mockStats,
};

// Empty state data for new users
export const mockEmptyDashboardData: DashboardData = {
   currentStatus: {
      activeTasks: [],
      pendingOffers: [],
      activeChats: [],
      pendingPayments: [],
   },
   primaryActions: [
      {
         id: "post-task",
         label: "Post a Task",
         description: "Get help with anything you need",
         icon: "post",
         route: "/tasks/new",
         variant: "primary",
         priority: 1,
      },
      {
         id: "browse-tasks",
         label: "Browse Tasks",
         description: "Find tasks to work on nearby",
         icon: "browse",
         route: "/tasks",
         variant: "secondary",
         priority: 2,
      },
      {
         id: "complete-profile",
         label: "Complete Profile",
         description: "Stand out to get more work",
         icon: "profile",
         route: "/profile",
         variant: "outline",
         priority: 3,
      },
   ],
   activityFeed: [],
   taskSnapshots: [],
   nudges: [
      {
         id: "phone-verification",
         type: "phone_unverified",
         title: "Verify your phone number",
         description:
            "Phone verification helps secure your account and enables SMS notifications.",
         actionLabel: "Verify Phone",
         actionRoute: "/profile/verify/phone",
         priority: "high",
         dismissible: false,
      },
   ],
   stats: {
      totalTasksPosted: 0,
      totalTasksCompleted: 0,
      totalTasksAsTasker: 0,
      totalEarnings: 0,
      totalSpent: 0,
      averageRating: 0,
   },
};



