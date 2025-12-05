# Dashboard and Tracking Flow Analysis

## Overview
This document analyzes the dashboard pages (Performer and Poster), My Tasks, My Applications, and Task Tracking screens in both the original React Native Web app and the Next.js implementation.

---

## 1. Dashboard Pages

### 1.1 Performer Dashboard (`/performer`)

#### Original: `PerformerHomeScreen.tsx`
**Features**:
- **Tab Navigation**: Two tabs - "Available Tasks" and "My Tasks"
- **Tab Switching**: URL parameter support (`?tab=my-tasks`)
- **Component Integration**: Uses `AvailableTasksScreen` and `MyTasksScreen` components
- **Mobile/Desktop Layout**: Responsive design based on screen width
- **Navigation**: Includes `MobileNavBar` and `Footer`

#### Next.js Implementation: `app/performer/page.tsx`
**Status**: ✅ **IMPLEMENTED**

**Features**:
- ✅ Tab navigation matching original
- ✅ URL parameter support for tab switching
- ✅ Mobile/desktop responsive layout
- ✅ Integration with `AvailableTasksScreen` and `MyTasksScreen` components
- ✅ `NavBar` and `Footer` integration
- ⚠️ Desktop layout shows "coming soon" placeholder

**Differences**:
- Uses Next.js `useSearchParams` instead of `URLSearchParams`
- Tailwind CSS instead of StyleSheet
- Simplified tab styling

---

### 1.2 Poster Dashboard (`/poster`)

#### Original: `PosterHomeScreen.tsx`
**Features**:
- **Service Categories Grid**: 9 service categories with icons
- **Custom Task Button**: Button to create custom tasks
- **Horizontal Scrollable Banners**: Promotional banner images
- **Most Booked Services**: Horizontal scrollable service cards with ratings, reviews, and prices
- **Refer Section**: Referral program card with CTA
- **Mobile/Desktop Layout**: Different layouts for mobile and desktop
- **Category Navigation**: Clicking categories navigates to task posting with category pre-filled

#### Next.js Implementation: `app/poster/page.tsx`
**Status**: ✅ **IMPLEMENTED**

**Features**:
- ✅ Service categories grid (9 categories)
- ✅ Custom Task button
- ✅ Horizontal scrollable banners
- ✅ Most Booked Services section
- ✅ Refer section
- ✅ Mobile and desktop layouts
- ✅ Category click navigation to `/tasks/new?category={id}`
- ⚠️ **NO API CALLS** (mock data only)

**Differences**:
- Uses Next.js `Image` component instead of React Native `Image`
- Tailwind CSS instead of StyleSheet
- Simplified service category data structure

---

## 2. My Tasks Pages

### 2.1 My Tasks Screen

#### Original: `MyTasksScreen.tsx`
**Features**:
- **Task List**: Shows tasks created by current user
- **Task Cards Display**:
  - Task title and status badge (color-coded)
  - Description (2-line clamp)
  - Details: Budget, Location, Category, Posted date, Applications count
  - Action buttons: Edit, Applications/Track Progress, Delete
- **Status Colors**:
  - `open`: Green (#4CAF50)
  - `assigned`: Blue (#2196F3)
  - `in_progress`: Orange (#FF9800)
  - `completed`: Green (#4CAF50)
  - `cancelled`: Red (#F44336)
- **Empty State**: "No tasks posted yet" with "Post Your First Task" button
- **Loading State**: Spinner with message
- **Pull-to-Refresh**: RefreshControl for manual refresh
- **Event Listeners**: Listens for `task-updated`, `task-deleted`, `task-created` events
- **Applications Count**: Fetches and displays count of applications per task
- **Navigation**: 
  - Edit → `EditTaskScreen`
  - View Applications → `TaskApplicationsScreen`
  - Track Progress → `TaskTrackingScreen`
  - Delete → Confirmation dialog → API call

#### Next.js Implementation: `components/dashboard/MyTasksScreen.tsx`
**Status**: ✅ **UPDATED** to match original

**Features**:
- ✅ Task cards with all details from original
- ✅ Status badges with color coding
- ✅ Action buttons (Edit, Applications/Track Progress, Delete)
- ✅ Empty state with CTA button
- ✅ Loading state
- ✅ Applications count display
- ⚠️ **NO API CALLS** (mock data only)
- ⚠️ No pull-to-refresh (would need custom implementation)
- ⚠️ No event listeners (would need custom event system)

**Differences**:
- Uses Tailwind CSS instead of StyleSheet
- Mock task data instead of API calls
- Simplified delete confirmation (browser `confirm` instead of Alert.alert)
- Navigation uses Next.js router

---

## 3. My Applications Pages

### 3.1 My Applications Screen

#### Original: `MyApplicationsScreen.tsx`
**Features**:
- **Application List**: Shows all applications submitted by current user
- **Application Cards Display**:
  - Task title and status badge (color-coded)
  - Your Proposal (proposed budget)
  - Task Budget (original task budget)
  - Applied date
  - Response date (if responded)
  - Cover letter section (if provided)
  - Messages section (if messages exist)
- **Status Colors**:
  - `pending`: Orange (#FF9800)
  - `accepted`: Green (#4CAF50)
  - `rejected`: Red (#F44336)
  - `withdrawn`: Gray (#9E9E9E)
- **Action Buttons**:
  - **View Task**: Always available
  - **Track Progress**: Only for accepted applications
  - **Chat**: Only for accepted applications
  - **Withdraw**: Only for pending applications
- **Empty State**: "No Applications Yet" with "Browse Tasks" button
- **Loading State**: Spinner with message
- **Pull-to-Refresh**: RefreshControl
- **Event Listeners**: Listens for `application-submitted`, `application-updated` events
- **Chat Integration**: Starts chat with task owner when accepted

#### Next.js Implementation: `app/applications/page.tsx`
**Status**: ⚠️ **NEEDS UPDATE** to match original

**Current Features**:
- ✅ Application cards with basic info
- ✅ Status badges
- ✅ View Task button
- ✅ Start Chat button (for accepted)
- ✅ Empty state
- ⚠️ Missing: Cover letter display, Messages section, Withdraw button, Track Progress button
- ⚠️ **NO API CALLS** (mock data only)

**Needs**:
- Add cover letter section
- Add messages section
- Add withdraw button for pending applications
- Add Track Progress button for accepted applications
- Improve detail display (Applied date, Response date)
- Add pull-to-refresh (custom implementation)

---

## 4. Task Tracking Pages

### 4.1 Task Tracking Screen

#### Original: `TaskTrackingScreen.tsx`
**Features**:
- **Task Details Display**:
  - Task title and description
  - Budget, Category, Location
  - Current status badge with description
- **Status Timeline**: Visual progress timeline showing:
  - Assigned → Started → In Progress → Review → Completed
  - Active steps highlighted
  - Current step emphasized
- **User Role Detection**:
  - Task Owner
  - Assigned Performer
  - Viewer
- **Available Actions** (based on status and role):
  - **Assigned**:
    - Performer: "Mark as Started"
    - Owner: "Cancel Task"
  - **Started**:
    - Performer: "Mark In Progress"
    - Owner: "Cancel Task"
  - **In Progress**:
    - Performer: "Submit for Review"
    - Owner: "Cancel Task"
  - **Review**:
    - Owner: "Approve & Complete", "Request Changes"
    - Performer: "Make Changes"
  - **Completed/Cancelled**: No actions
- **Communication Section**:
  - Shows assigned performer/task owner info
  - "Send Message" button to start chat
  - Only visible for assigned tasks (not open/cancelled)
- **Review Modal**: Opens when owner marks task as completed
- **Status Updates**: API calls to update task status
- **Event Listeners**: Listens for `task-updated` events
- **Loading States**: For status updates and chat initiation

#### Next.js Implementation
**Status**: ❌ **NOT IMPLEMENTED**

**Needs**:
- Create `app/tasks/[id]/track/page.tsx`
- Implement status timeline component
- Implement status-based action buttons
- Implement user role detection
- Implement communication section
- Implement review modal (or redirect to review page)
- Add loading states
- Mock API calls for status updates

---

## 5. Task Applications Pages

### 5.1 Task Applications Screen (For Task Owners)

#### Original: `TaskApplicationsScreen.tsx`
**Features**:
- **Application List**: Shows all applications for a specific task
- **Application Cards Display**:
  - Applicant name and rating/reviews
  - Status badge
  - Proposed Budget
  - Negotiable (Yes/No)
  - Applied date
  - Estimated Duration (if provided)
  - Cover Letter section
  - Relevant Experience section
- **Action Buttons** (for pending applications):
  - **Accept**: Accepts application and assigns performer
  - **Reject**: Rejects application
- **Accepted Applications**:
  - Shows acceptance date
  - "Track Task Progress" button
- **Rejected Applications**:
  - Shows rejection date
- **Empty State**: "No Applications Yet" message
- **Loading State**: Spinner
- **Pull-to-Refresh**: RefreshControl
- **Header**: Shows task title and application count

#### Next.js Implementation
**Status**: ❌ **NOT IMPLEMENTED**

**Needs**:
- Create `app/tasks/[id]/applications/page.tsx`
- Implement application cards with all details
- Implement Accept/Reject buttons
- Implement Track Progress button for accepted
- Add empty state
- Add loading state
- Mock API calls for accept/reject actions

---

## Navigation Flow Summary

### Performer Flow
1. **Dashboard** (`/performer`) → Tabs: Available Tasks / My Tasks
2. **Available Tasks** → Click task → Task Details → Apply
3. **My Tasks** → Click task → Task Details → Edit/Delete/View Applications
4. **My Applications** (`/applications`) → View Task / Track Progress / Chat
5. **Task Tracking** (`/tasks/[id]/track`) → Update status / Chat

### Poster Flow
1. **Dashboard** (`/poster`) → Service categories / Custom Task
2. **Post Task** (`/tasks/new`) → 3-step form → Submit
3. **My Tasks** → View Applications → Accept/Reject
4. **Task Applications** (`/tasks/[id]/applications`) → Review applications
5. **Task Tracking** (`/tasks/[id]/track`) → Monitor progress / Approve completion

---

## Missing Implementations

### High Priority
1. **Task Tracking Page** (`/tasks/[id]/track`)
   - Status timeline
   - Action buttons based on role/status
   - Communication section
   - Review modal/page

2. **Task Applications Page** (`/tasks/[id]/applications`)
   - Application cards with full details
   - Accept/Reject functionality
   - Track Progress button

3. **My Applications Page Updates**
   - Cover letter display
   - Messages section
   - Withdraw button
   - Track Progress button
   - Better date formatting

### Medium Priority
1. **Pull-to-Refresh**: Custom implementation for Next.js
2. **Event System**: Custom event system for cross-page updates
3. **Desktop Layouts**: Complete desktop layouts for all pages

---

## API Integration Points (Future)

### Task Tracking
- `GET /api/tasks/:id` - Fetch task details
- `PUT /api/tasks/:id/status` - Update task status
- `POST /api/chats` - Start chat session
- `POST /api/tasks/:id/reviews` - Submit review

### Task Applications
- `GET /api/tasks/:id/applications` - Fetch applications for task
- `PUT /api/applications/:id/status` - Accept/Reject application

### My Applications
- `GET /api/applications/my` - Fetch user's applications
- `PUT /api/applications/:id/withdraw` - Withdraw application

---

## Notes

- All current implementations use mock data (as per user request)
- Navigation uses Next.js router instead of React Navigation
- Styling uses Tailwind CSS instead of React Native StyleSheet
- No real-time updates (would need WebSocket or polling)
- Event system would need custom implementation for Next.js
- Review modal could be a separate page or modal component
