# Login Dialog - Visual Guide

## Component Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Fixed Overlay (z-50)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │         Backdrop (blur + semi-transparent)        │  │
│  │                                                   │  │
│  │    ┌─────────────────────────────────────┐  [X] │  │
│  │    │         Login Dialog Card           │      │  │
│  │    │                                     │      │  │
│  │    │          🔒 Lock Icon               │      │  │
│  │    │                                     │      │  │
│  │    │      Sign in to Continue            │      │  │
│  │    │                                     │      │  │
│  │    │  Sign in with Google to save your  │      │  │
│  │    │  learning progress, quiz scores,   │      │  │
│  │    │  and bookmarks across devices.     │      │  │
│  │    │                                     │      │  │
│  │    │  ┌───────────────────────────────┐ │      │  │
│  │    │  │  🔵 Sign in with Google       │ │      │  │
│  │    │  └───────────────────────────────┘ │      │  │
│  │    │                                     │      │  │
│  │    │  ✓ Track progress across modules   │      │  │
│  │    │  ✓ Save quiz scores and bookmarks  │      │  │
│  │    │  ✓ Sync data across devices        │      │  │
│  │    │                                     │      │  │
│  │    └─────────────────────────────────────┘      │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Layout Integration

### Before (No Dialog)
```
┌──────────────────────────────────────┐
│           Header                     │
├──────────────────────────────────────┤
│                                      │
│     Module Content (Sharp)           │
│     - Learning content               │
│     - Interactive controls           │
│     - Visualizations                 │
│     - Quiz                           │
│                                      │
├──────────────────────────────────────┤
│           Footer                     │
└──────────────────────────────────────┘
```

### After (With Dialog - Unauthenticated)
```
┌──────────────────────────────────────┐
│           Header                     │
├──────────────────────────────────────┤
│                                      │
│     Module Content (Blurred) 🌫️      │
│     - Learning content               │
│     - Interactive controls           │  ┌─────────────┐
│     - Visualizations                 │  │   Login     │
│     - Quiz                           │  │   Dialog    │
│                                      │  │   (Overlay) │
│     [pointer-events: none]           │  └─────────────┘
│                                      │
├──────────────────────────────────────┤
│           Footer                     │
└──────────────────────────────────────┘
```

## Color Scheme

### Dialog
- Background: `bg-white` (Pure white)
- Border Radius: `rounded-2xl` (Large rounded corners)
- Shadow: `shadow-2xl` (Deep shadow for depth)
- Padding: `p-8` (Generous spacing)

### Icon Container
- Background: `bg-blue-100` (Light blue)
- Icon Color: `text-blue-600` (Medium blue)
- Shape: Circular (`rounded-full`)

### Sign In Button
- Background: `bg-white` (White)
- Border: `border-2 border-gray-300` (Gray border)
- Text: `text-gray-700` (Dark gray)
- Hover: `hover:bg-gray-50 hover:border-gray-400`
- Focus Ring: `focus:ring-2 focus:ring-blue-500`

### Benefits List
- Check Icon: `text-green-600` (Green)
- Text: `text-gray-600` (Medium gray)

### Backdrop
- Background: `bg-gray-900/50` (50% opacity dark)
- Blur: `backdrop-blur-sm` (Small blur effect)

## Responsive Behavior

### Desktop (≥1024px)
- Dialog: Max width 28rem (448px)
- Padding: 2rem (32px)
- Icon: 4rem (64px)
- Button: Full width within dialog

### Tablet (768px - 1023px)
- Dialog: Max width 28rem (448px)
- Padding: 2rem (32px)
- Icon: 4rem (64px)
- Button: Full width within dialog

### Mobile (<768px)
- Dialog: Max width 28rem (448px) with 1rem margin
- Padding: 2rem (32px)
- Icon: 4rem (64px)
- Button: Full width within dialog
- Text: Slightly smaller for readability

## Animation

### Entrance Animation
```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

- Duration: 200ms
- Easing: ease-out
- Effect: Fade in + slight scale up

### Transitions
- Button hover: `transition-all`
- Close button: `transition-colors`
- Main content blur: `transition-all duration-300`

## Accessibility

### Keyboard Navigation
- ✅ Tab to Sign In button
- ✅ Tab to Close button
- ✅ Enter/Space to activate buttons
- ✅ Escape to close (handled by click outside)

### Screen Readers
- ✅ Close button has `aria-label="Close dialog"`
- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy (h2 for title)
- ✅ Descriptive button text

### Focus Management
- ✅ Focus ring on interactive elements
- ✅ Visible focus indicators
- ✅ Proper focus order

## User Interactions

### Click Targets
1. **Sign In Button**: Triggers Google OAuth flow
2. **Close Button (X)**: Redirects to `/modules`
3. **Backdrop**: Redirects to `/modules`

### States
1. **Default**: Button enabled, normal appearance
2. **Loading**: Button disabled, shows "Signing in..."
3. **Hover**: Button background changes
4. **Focus**: Blue ring appears around button

## Route Behavior

### Shows Dialog On:
- `/modules/classification/logistic-regression` ✅
- `/modules/regression/linear-regression` ✅
- `/modules/clustering/k-means` ✅
- `/modules/advanced/pca` ✅
- Any route matching `/modules/[domain]/[module]` ✅

### Does NOT Show Dialog On:
- `/modules` ❌
- `/modules/` ❌
- `/` ❌
- `/about` ❌
- `/contact` ❌
- `/progress` ❌
- Any other non-module page ❌

## Code Flow

```
User navigates to module page
         ↓
Layout checks route.path
         ↓
Is path /modules/[domain]/[module]? ──No──→ No dialog
         ↓ Yes
Is user authenticated? ──Yes──→ No dialog
         ↓ No
Show login dialog + blur content
         ↓
User clicks "Sign in with Google"
         ↓
Redirect to OAuth flow
         ↓
After auth, return to module
         ↓
Dialog hidden, content accessible
```

## Testing Checklist

- [ ] Dialog appears on module pages when not authenticated
- [ ] Dialog does NOT appear on `/modules` list page
- [ ] Dialog does NOT appear when authenticated
- [ ] Background is blurred when dialog is shown
- [ ] Background is NOT interactive when dialog is shown
- [ ] Close button redirects to `/modules`
- [ ] Clicking backdrop redirects to `/modules`
- [ ] Sign in button triggers OAuth flow
- [ ] Dialog hides after successful authentication
- [ ] Animation plays smoothly on dialog appearance
- [ ] Responsive on mobile, tablet, and desktop
- [ ] Keyboard navigation works correctly
- [ ] Focus indicators are visible
- [ ] Screen reader announces content correctly

## Browser Compatibility

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### CSS Features Used
- `backdrop-filter: blur()` - Supported in all modern browsers
- `@keyframes` - Universal support
- Flexbox - Universal support
- CSS Grid - Universal support
- Tailwind CSS utilities - Compiled to standard CSS
