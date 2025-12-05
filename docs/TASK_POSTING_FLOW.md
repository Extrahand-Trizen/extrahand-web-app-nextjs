# Task Posting Flow Analysis

## Overview
This document analyzes the task posting and editing flow in both the original React Native Web app and the Next.js implementation.

## Original App Structure

### 1. TaskPostingForm.tsx
**Location**: `web-apps/extrahand-web-app/src/TaskPostingForm.tsx`

**Features**:
- **3-Step Multi-Step Form**:
  - **Step 1**: Category selection, Task Title, Task Description
  - **Step 2**: Location, Due Date, Preferred Time, Image Upload
  - **Step 3**: Budget (with ₹ symbol), Additional Notes
- **Dual Layout**: Separate mobile and desktop layouts
- **Progress Indicators**: Dots at the top showing current step
- **Color Scheme**: 
  - Primary Yellow: `#f9b233` (buttons)
  - Primary Blue: `#2563eb` (progress indicators, accents)
- **Supports Edit Mode**: Can accept a `task` prop to pre-fill form for editing
- **Validation**: Required fields validated before proceeding
- **API Integration**: Calls `api.createTask()` or `api.updateTask()`

**Key UI Elements**:
- Header with back button and progress dots
- Category grid (2 columns on mobile, flexible on desktop)
- Yellow "Next" / "Post Task" button at bottom
- Scrollable content area
- Image upload placeholder

### 2. EditTaskScreen.tsx
**Location**: `web-apps/extrahand-web-app/src/screens/EditTaskScreen.tsx`

**Features**:
- **Single-Page Form** (not multi-step)
- **Fields**: Title, Category, Description, Location, Budget
- **Blue Header**: With back button and "Edit Task" title
- **Category Selection**: Grid of category buttons
- **Save Button**: Blue button at bottom
- **API Integration**: Calls `api.updateTask()`
- **Event Broadcasting**: Dispatches `task-updated` event for cross-screen updates
- **LocalStorage Updates**: Updates task caches for UI consistency

## Next.js Implementation

### 1. Post Task Page
**Location**: `web-apps/extrahand-web-app-nextjs/app/tasks/new/page.tsx`

**Status**: ✅ **UPDATED** to match original

**Features**:
- ✅ 3-step multi-step form matching original structure
- ✅ Mobile and desktop layouts
- ✅ Progress dots indicator
- ✅ Category grid with yellow/blue selection styling
- ✅ All form fields from original (Title, Description, Category, Location, Due Date, Preferred Time, Budget, Additional Notes)
- ✅ Image upload placeholder
- ✅ Budget card with ₹ symbol
- ✅ Yellow "Next" / "Post Task" button
- ✅ Validation for required fields
- ⚠️ **NO API CALLS** (mock functionality only - as per user request)

**Differences from Original**:
- Uses Tailwind CSS instead of StyleSheet
- No NavBar/Footer (matches original structure)
- Mock submission (alerts instead of API calls)

### 2. Edit Task Page
**Location**: `web-apps/extrahand-web-app-nextjs/app/tasks/[id]/edit/page.tsx`

**Status**: ✅ **CREATED** to match original

**Features**:
- ✅ Single-page form (not multi-step)
- ✅ All fields from original (Title, Category, Description, Location, Budget)
- ✅ Category grid with blue selection styling
- ✅ Blue header with back button
- ✅ Blue "Save Changes" button
- ✅ Loading state during submission
- ⚠️ **NO API CALLS** (mock functionality only - as per user request)

**Differences from Original**:
- Uses Tailwind CSS instead of StyleSheet
- Mock task data (would be fetched from API in production)
- Simplified error handling (alerts instead of Alert.alert)

## Navigation Flow

### Creating a Task
1. User clicks "Post a Task" from:
   - Poster Dashboard
   - Browse Tasks page
   - My Tasks empty state
   - Profile page
   - Navigation menu
2. Navigate to `/tasks/new`
3. Complete 3-step form
4. Submit → Redirect to `/poster` dashboard

### Editing a Task
1. User clicks "Edit" button on a task in:
   - My Tasks screen
   - Task Details screen
2. Navigate to `/tasks/[id]/edit`
3. Form pre-filled with task data
4. Make changes and save
5. Submit → Navigate back to previous page

## Form Fields Summary

### Step 1: Task Details
- **Category*** (required): Grid selection from 8 categories
- **Task Title*** (required): Text input
- **Task Description*** (required): Multi-line textarea

### Step 2: Location & Timing
- **Location*** (required): Multi-line textarea for address
- **Due Date**: Text input (e.g., "Before Wed, 23 Jul")
- **Preferred Time**: Text input (e.g., "Anytime, Morning, Afternoon")
- **Add Photos** (optional): Image upload button

### Step 3: Budget
- **Budget*** (required): Number input with ₹ symbol in styled card
- **Additional Notes**: Multi-line textarea

### Edit Form (All Fields)
- **Task Title*** (required)
- **Category*** (required)
- **Description*** (required)
- **Location*** (required)
- **Budget (₹)*** (required)

## Styling Details

### Colors
- **Primary Yellow**: `#f9b233` - Used for main action buttons
- **Primary Blue**: `#2563eb` - Used for progress indicators, selected categories, accents
- **Gray Backgrounds**: `#f5f5f5` / `#f8f9fa` - Form inputs and cards
- **Border Colors**: `#e0e0e0` / `#e9ecef` - Borders and dividers

### Typography
- **Mobile Headers**: 18-24px, bold/semibold
- **Desktop Headers**: 26-30px, bold
- **Labels**: 14-18px, semibold
- **Inputs**: 16px, regular

### Spacing
- **Mobile Padding**: 20px
- **Desktop Padding**: 40-80px
- **Section Margins**: 25-40px (mobile), 40px (desktop)
- **Form Field Gaps**: 6-10px

## Future API Integration Points

When connecting to the backend, these endpoints will be needed:

1. **Create Task**: `POST /api/tasks`
   - Body: `{ type, title, description, location, preferredTime, budget, skillsRequired }`
   
2. **Update Task**: `PUT /api/tasks/:id`
   - Body: Same as create
   
3. **Get Task**: `GET /api/tasks/:id`
   - Used to pre-fill edit form

4. **Image Upload**: `POST /api/tasks/:id/images`
   - For uploading task photos

## Notes

- All API calls are currently disabled per user request
- Forms use mock data and alert messages
- Navigation uses Next.js router instead of React Navigation
- Styling converted from React Native StyleSheet to Tailwind CSS
- Form validation is client-side only
- No image upload functionality implemented (placeholder only)
