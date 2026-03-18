# Login Flow Implementation - Testing & Documentation

## Overview
A new goal-based onboarding flow has been implemented. After OTP verification, new users now select their main goal on Airtasker before proceeding with profile setup.

---

## Implementation Summary

### New & Modified Files

#### 1. **New: Goal Selection Page**
- **Path**: `app/(protected)/onboarding/goal-selection/page.tsx`
- **Accessible at**: `/onboarding/goal-selection`
- **Displays**:
  - "Get things done" (Poster role) - with checkmark icon
  - "Earn money" (Tasker role) - with money/₹ icon
- **Actions**:
  - Poster path: Sets role immediately, goes to `/home`
  - Tasker path: Stores goal in sessionStorage, goes to location selection

#### 2. **New: Skills Selection Page**
- **Path**: `app/(protected)/onboarding/skills-selection/page.tsx`
- **Accessible at**: `/onboarding/skills-selection`
- **Features**:
  - Fetches all categories from content-admin backend API
  - Multi-select grid of skills/categories
  - Saves selected skills to user profile
  - Sets role to "tasker"
  - Validates at least one skill is selected
  - Redirects to `/home`

#### 3. **Modified: OTP Verification Form**
- **File**: `components/auth/OTPVerificationForm.tsx`
- **Changes**:
  - Default redirect now context-aware:
    ```typescript
    const finalRedirectTo = 
      redirectTo || 
      (authType === "signup" ? "/onboarding/goal-selection" : "/home")
    ```
  - Updated all redirect references to use `finalRedirectTo`

#### 4. **Modified: Location Confirmation Page**
- **File**: `app/(protected)/onboarding/location-confirmation/page.tsx`
- **Changes**:
  - Changed auto-redirect from `/onboarding/role-selection` to `/onboarding/skills-selection`
  - Now users go directly from location confirmation to skills selection

---

## Flow Diagrams

### Signup Flow (New Users)

```
┌─────────────────┐
│ Sign Up Page    │
└────────┬────────┘
         │ Enter phone & name
         ↓
┌─────────────────┐
│ OTP Page        │ ← authType="signup"
└────────┬────────┘
         │ Enter OTP
         ↓
┌─────────────────────────┐
│ Goal Selection Page     │ ← NEW
│ "Get things done" vs    │
│ "Earn money"            │
└────────┬────────┬───────┘
         │        │
    "Get things done"  "Earn money"
    (Poster)         (Tasker)
         │            │
         ↓            ↓
   Set role:      Location Method
    "poster"      ↓ ↓
         │        Auto-Detect / Manual
         │        ↓ ↓
         │        Location Input
         │        ↓
         │        Location Confirmation
         │        ↓
         │    Skills Selection ← NEW
         │    (Select 1+ skills)
         │        ↓
         │    Set role: "tasker"
         │        ↓
         └───────→ Home Page
```

### Login Flow (Existing Users)
```
┌─────────────────┐
│ Login Page      │
└────────┬────────┘
         │ Enter phone
         ↓
┌─────────────────┐
│ OTP Page        │ ← authType="login"
└────────┬────────┘
         │ Enter OTP
         ↓
┌─────────────────┐
│ Home Page       │ ← Direct redirect, no onboarding
└─────────────────┘
```

---

## Testing Guidelines

### 1. **Testing Goal Selection - Poster Path**
- **Setup**: Create new account via `/signup`
- **Steps**:
  1. Enter phone number
  2. Enter 6-digit OTP
  3. You should see the Goal Selection page
  4. Click "Get things done" card
  5. Click "Continue" button
- **Expected Result**:
  - User is redirected to `/home`
  - User profile has role: `["poster"]`
  - No location or skills required

### 2. **Testing Goal Selection - Tasker Path**
- **Setup**: Create new account via `/signup`
- **Steps**:
  1. Enter phone number
  2. Enter 6-digit OTP
  3. You should see the Goal Selection page
  4. Click "Earn money" card
  5. Click "Continue" button
- **Expected Result**:
  - User is redirected to `/onboarding/choose-location-method`
  - `selectedGoal: "earn"` is stored in sessionStorage

### 3. **Testing Skills Selection**
- **Setup**: Complete tasker path up to location confirmation
- **Steps**:
  1. Auto-detect or manually enter location
  2. Confirm location
  3. You should see Skills Selection page
  4. Select at least 2-3 skill categories
  5. Click "Continue" button
- **Expected Result**:
  - User is redirected to `/home`
  - User profile has role: `["tasker"]`
  - User profile has skills saved in `skills.list[]`
  - Toast shows: "Profile setup complete! Welcome to Airtasker..."

### 4. **Testing Login (No Onboarding)**
- **Setup**: Use existing user account
- **Steps**:
  1. Go to `/login`
  2. Enter phone number
  3. Enter OTP
- **Expected Result**:
  - User is redirected to `/home` directly
  - No goal selection or onboarding pages shown

---

## API Interactions

### Goal Selection Page
```typescript
// When "Get things done" is selected:
profilesApi.upsertProfile({ roles: ['poster'] })

// When "Earn money" is selected:
sessionStorage.setItem('selectedGoal', 'earn')
```

### Skills Selection Page
```typescript
// Fetch categories:
categoriesApi.getCategories({ includeUnpublished: false })

// Save skills and role:
profilesApi.upsertProfile({
  roles: ['tasker'],
  skills: {
    list: [
      { name: "AC Repair & Service", category: "ac-repair" },
      { name: "Electrical", category: "electrical" },
      // ... etc
    ]
  }
})
```

---

## Error Handling

### Goal Selection Page
- **No selection**: Shows toast error: "Please select an option"
- **API failure**: Shows toast error: "Something went wrong"

### Skills Selection Page
- **Categories load failure**: Shows toast error: "Could not load categories"
- **No skills selected**: Disables Continue button, shows message: "Select at least one skill"
- **API failure**: Shows toast error: "Something went wrong"

---

## Browser Testing Checklist

- [ ] **Desktop** (1920x1080): Test at 100% zoom
- [ ] **Tablet** (768x1024): Test responsive layout
- [ ] **Mobile** (375x667): Test touch interactions
- [ ] **Dark mode**: Test if applicable (check TailwindCSS settings)
- [ ] **Slow network**: Test loading states with network throttling
- [ ] **Back button**: Verify Back navigates correctly

---

## Dev Mode Testing

To test with dev OTP:
1. Phone: `+91 9876543210`
2. OTP: `654321`

This bypasses Firebase and uses the dev backend endpoint `/api/v1/auth/otp/complete-dev`.

---

## Rollback Instructions

If issues are found, revert these changes:

1. **OTP Form**: Change default redirect back to `"/home"` for all users
2. **Location Confirmation**: Change redirect from `skills-selection` to `role-selection`
3. **Delete**: Goal selection and skills selection pages

The old `role-selection` page will resume being the next step after location confirmation.

---

## Future Enhancements

- [ ] Add optional photo/banner upload during goal selection
- [ ] Allow users to switch roles from profile settings
- [ ] Add skill verification/certification uploads
- [ ] Create skill recommendation system based on location
- [ ] Add estimated earnings display based on selected skills
- [ ] Implement skill level (beginner/intermediate/expert) selection
- [ ] Add real-time category filtering based on location availability
