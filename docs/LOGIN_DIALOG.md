# Login Dialog Implementation

## Overview

A login dialog has been implemented that appears on module pages when users are not authenticated. The dialog prompts users to sign in with Google to save their learning progress.

## Features

- **Automatic Display**: Shows automatically when accessing any module page (e.g., `/modules/classification/logistic-regression`) without authentication
- **Background Blur**: Blurs the module content behind the dialog to focus user attention
- **Google OAuth**: Integrates with existing Google OAuth authentication flow
- **Benefits Display**: Shows users why they should sign in (progress tracking, quiz scores, bookmarks)
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dismissible**: Users can close the dialog and return to the modules list

## Implementation Details

### Components

1. **LoginDialog.vue** (`components/shared/LoginDialog.vue`)
   - Reusable dialog component
   - Shows Google sign-in button
   - Lists benefits of signing in
   - Animated entrance effect

2. **Layout Integration** (`layouts/default.vue`)
   - Detects module pages using route path matching
   - Shows dialog when `route.path.startsWith('/modules/')` and user is not authenticated
   - Applies blur effect to main content when dialog is visible
   - Redirects to `/modules` when dialog is closed

### Route Detection

The dialog appears on any route matching the pattern:
- `/modules/[domain]/[module-name]` (e.g., `/modules/classification/logistic-regression`)

It does NOT appear on:
- `/modules` (modules list page)
- `/modules/` (modules list page)
- Any other pages

### User Flow

1. User navigates to a module page without being authenticated
2. Dialog appears with blurred background
3. User can either:
   - Click "Sign in with Google" to authenticate
   - Click the close button (X) to return to modules list
   - Click outside the dialog to return to modules list

## Testing

To test the login dialog:

1. Ensure you're logged out
2. Navigate to any module page: `http://localhost:3000/modules/classification/logistic-regression`
3. The dialog should appear with the background blurred
4. Click "Sign in with Google" to test the OAuth flow
5. Click the X or outside the dialog to return to `/modules`

## Styling

The dialog uses:
- Tailwind CSS for styling
- Backdrop blur effect for focus
- Smooth animations for entrance
- Google brand colors for the sign-in button
- Responsive design that adapts to screen size

## Future Enhancements

Possible improvements:
- Add a "Continue without signing in" option with limited functionality
- Show a preview of what users can do after signing in
- Add social proof (e.g., "Join 10,000+ learners")
- Remember user preference to not show dialog again for a session
