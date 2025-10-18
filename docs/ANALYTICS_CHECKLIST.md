# Analytics Implementation Checklist

Use this checklist to ensure analytics is properly integrated in new modules.

## Module Page Checklist

When creating or updating a module page, ensure:

### Imports
- [ ] Import `useAnalyticsStore` from `~/stores/analytics`
- [ ] Import `useModuleTracking` if tracking time/interactions

### Module Visit Tracking
- [ ] Track module visit in `onMounted`:
  ```typescript
  analyticsStore.trackModuleVisit('module-id', 'Module Name');
  ```

### Parameter Change Tracking
- [ ] Track parameter changes in change handler:
  ```typescript
  analyticsStore.trackParameterChange('module-id', parameterId, value);
  ```

### Algorithm Run Tracking
- [ ] Track algorithm execution with duration:
  ```typescript
  const startTime = Date.now();
  await algorithm.fit(X, y);
  const duration = Date.now() - startTime;
  analyticsStore.trackAlgorithmRun('module-id', parameters, duration);
  ```

### Time Tracking (Optional)
- [ ] Initialize module tracking:
  ```typescript
  const { startTracking } = useModuleTracking('module-id', 'Module Name');
  ```
- [ ] Start tracking in `onMounted`:
  ```typescript
  onMounted(() => {
    startTracking();
  });
  ```

## Quiz Component Checklist

When implementing quiz functionality:

### Quiz Answer Tracking
- [ ] Track each answer submission:
  ```typescript
  analyticsStore.trackQuizAnswer(moduleId, questionId, isCorrect);
  ```

### Quiz Completion Tracking
- [ ] Track quiz completion with score:
  ```typescript
  analyticsStore.trackQuizComplete(moduleId, score, totalQuestions);
  ```

## Component Checklist

### Bookmark Component
- [ ] Track bookmark additions:
  ```typescript
  analyticsStore.trackBookmarkAdd(moduleId);
  ```

### Visualization Components (Optional)
- [ ] Track visualization interactions:
  ```typescript
  trackVisualizationInteraction('zoom', { level: 2 });
  ```

## Testing Checklist

### Development Testing
- [ ] Check console for analytics events
- [ ] Verify events are logged with correct data
- [ ] Test opt-in/opt-out functionality
- [ ] Verify events stop when opted out

### Production Testing
- [ ] Configure Plausible environment variables
- [ ] Deploy to staging/production
- [ ] Opt in to analytics
- [ ] Perform actions and verify in Plausible dashboard
- [ ] Test cookie consent banner
- [ ] Test privacy settings page

## Documentation Checklist

- [ ] Update module documentation with tracked events
- [ ] Document any custom tracking events
- [ ] Add module to analytics integration guide if needed

## Privacy Checklist

- [ ] Ensure no personal data is tracked
- [ ] Verify opt-in check is in place
- [ ] Test opt-out functionality
- [ ] Verify data clearing works
- [ ] Check cookie consent banner appears

## Deployment Checklist

### Environment Setup
- [ ] Create Plausible Analytics account
- [ ] Add domain to Plausible
- [ ] Set `NUXT_PUBLIC_PLAUSIBLE_DOMAIN` environment variable
- [ ] Set `NUXT_PUBLIC_PLAUSIBLE_HOST` if using self-hosted (optional)

### Verification
- [ ] Verify Plausible script loads
- [ ] Check events appear in Plausible dashboard
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Verify ad blockers don't break functionality

## Common Issues Checklist

If analytics isn't working:

- [ ] Check if user has opted in (`analyticsStore.optedIn`)
- [ ] Verify environment variables are set correctly
- [ ] Check browser console for errors
- [ ] Verify Plausible script is loaded
- [ ] Check network tab for Plausible requests
- [ ] Verify domain matches Plausible configuration
- [ ] Check if ad blocker is interfering

## Best Practices Checklist

- [ ] Only track meaningful events
- [ ] Include relevant context with events
- [ ] Use debouncing for frequent events
- [ ] Track errors and edge cases
- [ ] Track success metrics
- [ ] Don't track every user action
- [ ] Keep event names consistent
- [ ] Document custom events

## Accessibility Checklist

- [ ] Cookie consent banner is keyboard accessible
- [ ] Privacy settings page is screen reader friendly
- [ ] Toggle controls have proper ARIA labels
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG standards

## Performance Checklist

- [ ] Analytics doesn't block page rendering
- [ ] Events are debounced where appropriate
- [ ] Script loading is deferred
- [ ] No memory leaks from event tracking
- [ ] Cleanup on component unmount

## Compliance Checklist

- [ ] GDPR: Opt-in required before tracking
- [ ] CCPA: Clear opt-out mechanism
- [ ] PECR: No cookies without consent
- [ ] Privacy policy updated
- [ ] User data rights documented
- [ ] Data retention policy defined

## Quick Reference

### Module ID Convention
Use kebab-case: `linear-regression`, `k-means`, `gradient-descent`

### Event Naming Convention
Use descriptive names: `Module Visit`, `Parameter Change`, `Algorithm Run`

### Property Naming Convention
Use snake_case: `module_id`, `learning_rate`, `time_spent`

## Resources

- [Analytics Setup Guide](./ANALYTICS_SETUP.md)
- [Analytics Integration Guide](./ANALYTICS_INTEGRATION.md)
- [Implementation Summary](./ANALYTICS_IMPLEMENTATION_SUMMARY.md)
- [Plausible Documentation](https://plausible.io/docs)
