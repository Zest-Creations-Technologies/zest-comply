
# Profile Settings Page Implementation

This plan adds full profile editing functionality including name updates and password changes, integrating with your new server endpoints.

## Overview

Transform the current read-only Profile Settings page into a fully functional settings page with:
- Editable first name and last name fields
- Password change form with validation
- Email verification status display

## Implementation Steps

### Step 1: Add API Types

Add new TypeScript interfaces in `src/lib/api/types.ts`:

```typescript
// Profile update request/response
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
}

// Change password request/response
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}
```

### Step 2: Add API Methods

Extend `src/lib/api/auth.ts` with two new methods:

```typescript
// Update user profile (first/last name)
async updateProfile(data: UpdateProfileRequest): Promise<User> {
  if (API_CONFIG.useMocks) {
    await delay();
    return { ...mockUser, ...data };
  }
  return apiClient.patch<User>('/auth/me', data);
}

// Change password (returns new tokens)
async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
  if (API_CONFIG.useMocks) {
    await delay();
    return {
      success: true,
      message: 'Password changed successfully.',
      access_token: 'mock-new-token-' + Date.now(),
      refresh_token: 'mock-new-refresh-' + Date.now(),
      token_type: 'bearer',
      expires_in: 900,
    };
  }
  const response = await apiClient.post<ChangePasswordResponse>('/auth/change-password', data);
  // Save new tokens after password change
  apiClient.saveTokens(response.access_token, response.refresh_token);
  return response;
}
```

### Step 3: Redesign Profile Settings Page

Rebuild `src/pages/app/ProfileSettingsPage.tsx` with three main sections:

**Account Information Card (Read-only)**
- Avatar placeholder with user icon
- Email (non-editable)
- Email verification status with badge (Verified/Unverified)
- Member since date
- Current plan badge

**Edit Profile Card**
- First name input field (1-100 characters)
- Last name input field (1-100 characters)
- Save button with loading state
- Zod validation for field lengths
- Success toast on save, error handling

**Change Password Card**
- Current password field (with show/hide toggle)
- New password field (with show/hide toggle)
- Confirm new password field (with show/hide toggle)
- Password strength indicator (reuse from SignupPage)
- Password requirements checklist
- Change Password button
- Validation: min 8 chars, uppercase, lowercase, digit, special char
- Passwords must match validation
- Current vs new password must be different

### Step 4: Form Validation

Use Zod schemas consistent with server requirements:

```typescript
const profileSchema = z.object({
  first_name: z.string().max(100, 'First name must be less than 100 characters').optional(),
  last_name: z.string().max(100, 'Last name must be less than 100 characters').optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain a number')
    .regex(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, 'Must contain special character'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
}).refine((data) => data.current_password !== data.new_password, {
  message: "New password must be different from current password",
  path: ['new_password'],
});
```

### Step 5: Token Handling After Password Change

After successful password change:
1. New tokens are returned from the API
2. `apiClient.saveTokens()` updates localStorage
3. User stays logged in on current device
4. Show success toast with message about other devices needing to re-login
5. Clear the password form fields

### Step 6: Integration with AuthContext

After profile update:
1. Call `refreshUser()` from AuthContext to update user state
2. This ensures the sidebar and header show updated name immediately

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/lib/api/types.ts` | Modify | Add `UpdateProfileRequest`, `ChangePasswordRequest`, `ChangePasswordResponse` |
| `src/lib/api/auth.ts` | Modify | Add `updateProfile()` and `changePassword()` methods |
| `src/pages/app/ProfileSettingsPage.tsx` | Rewrite | Full profile editing with name and password forms |

## UI Layout

```text
+------------------------------------------+
|  Profile                                 |
|  View and manage your account information|
+------------------------------------------+

+------------------------------------------+
|  Account Information                     |
|  Your personal details and account status|
+------------------------------------------+
|  [Avatar]  John Doe                      |
|            john@example.com              |
|                                          |
|  Email         john@example.com          |
|  Status        [Verified Badge]          |
|  Member Since  January 15, 2025          |
|  Current Plan  [Basic Badge]             |
+------------------------------------------+

+------------------------------------------+
|  Edit Profile                            |
|  Update your name                        |
+------------------------------------------+
|  First Name    [John____________]        |
|  Last Name     [Doe_____________]        |
|                          [Save Changes]  |
+------------------------------------------+

+------------------------------------------+
|  Change Password                         |
|  Update your account password            |
+------------------------------------------+
|  Current Password  [••••••••] [eye]      |
|  New Password      [••••••••] [eye]      |
|  Confirm Password  [••••••••] [eye]      |
|                                          |
|  [Password strength bar]                 |
|  [x] 8 characters  [x] Uppercase         |
|  [x] Lowercase     [x] Number            |
|  [x] Special char                        |
|                                          |
|                     [Change Password]    |
+------------------------------------------+
```

## Error Handling

| Scenario | User Experience |
|----------|-----------------|
| Invalid current password | Toast: "Current password is incorrect" |
| Weak new password | Inline validation with requirements checklist |
| Same password | Inline error: "New password must be different" |
| Network error | Toast with retry suggestion |
| Rate limit (429) | Toast: "Too many attempts. Please wait 15 minutes." |
| Session expired (401) | Auto-redirect to login |

## Technical Notes

- Password form clears all fields after successful change
- Profile form keeps values and shows success state
- Both forms have independent loading states
- Uses existing `useToast` hook for notifications
- Reuses password strength UI pattern from SignupPage
- Email verification badge shows green checkmark if verified, warning icon if not
