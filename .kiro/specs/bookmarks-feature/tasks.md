# Implementation Plan

- [x] 1. Update database schema and backend types
- [x] 1.1 Create database migration file to update bookmarks table schema
  - Add `name` column (TEXT NOT NULL)
  - Add `parameters` column (TEXT NOT NULL) for JSON storage
  - Add `updated_at` column (INTEGER NOT NULL)
  - Remove UNIQUE constraint on (user_id, module_id)
  - Add composite index on (user_id, module_id)
  - _Requirements: 4.1, 6.1_

- [x] 1.2 Update Bookmark type definition in worker/src/types/index.ts
  - Add `name: string` field
  - Add `parameters: string` field (JSON string)
  - Add `updated_at: number` field
  - Create BookmarkWithParams interface for deserialized version
  - _Requirements: 4.1, 6.1_

- [x] 1.3 Update SyncProgressRequest and ProgressResponse types
  - Add `id`, `name`, `parameters`, `updated_at` to bookmarks array in SyncProgressRequest
  - Update ProgressResponse bookmarks array to include new fields
  - _Requirements: 4.1, 5.1_

- [x] 2. Update backend database service functions
- [x] 2.1 Update saveBookmark() function in worker/src/services/database.ts
  - Add parameters for bookmarkId, name, parameters, updatedAt
  - Serialize parameters object to JSON string
  - Validate JSON size is under 10KB
  - Use INSERT with ON CONFLICT to handle upserts by bookmark ID
  - _Requirements: 4.1, 4.3, 6.2_

- [x] 2.2 Create updateBookmark() function in worker/src/services/database.ts
  - Accept userId, bookmarkId, and updates object (name, parameters)
  - Build dynamic UPDATE query based on provided fields
  - Update updated_at timestamp
  - Return updated bookmark
  - _Requirements: 3.1, 3.2_

- [x] 2.3 Update deleteBookmark() function to use bookmark ID
  - Change signature to accept bookmarkId instead of moduleId
  - Update WHERE clause to match on bookmark ID and user ID
  - _Requirements: 3.1, 3.4_

- [x] 2.4 Update getBookmarksByUserId() function
  - Deserialize parameters JSON string to object
  - Handle JSON parse errors gracefully
  - Return BookmarkWithParams array
  - _Requirements: 4.4, 5.1_

- [x] 3. Update backend progress handlers
- [x] 3.1 Update handleSyncProgress() in worker/src/handlers/progress.ts
  - Add validation for bookmark id, name, parameters, updated_at fields
  - Validate parameters is a valid object
  - Validate name is 1-100 characters
  - Validate serialized parameters JSON is under 10KB
  - Call updated saveBookmark() with new parameters
  - _Requirements: 4.1, 4.2, 6.2_

- [x] 3.2 Update handleGetProgress() in worker/src/handlers/progress.ts
  - Ensure returned bookmarks include deserialized parameters
  - Handle any deserialization errors gracefully
  - _Requirements: 4.4, 5.1_

- [x] 4. Update frontend Progress store
- [x] 4.1 Add updateBookmarkName() method to stores/progress.ts
  - Find bookmark by ID
  - Update name field
  - Update timestamp
  - Trigger sync for authenticated users
  - _Requirements: 3.2, 3.3_

- [x] 4.2 Update addBookmark() method to deep-clone parameters
  - Use structuredClone() or JSON parse/stringify for deep cloning
  - Ensure no reference issues between original and saved parameters
  - _Requirements: 1.1, 6.1_

- [x] 4.3 Update mergeBackendData() method for bookmarks
  - Properly handle bookmark parameters from backend
  - Use timestamp-based conflict resolution
  - Merge bookmarks by ID, not just moduleId
  - Preserve local bookmarks not in backend data
  - _Requirements: 5.2, 5.3_

- [x] 4.4 Remove saveToStorage() method calls
  - Pinia persistence plugin handles this automatically
  - Remove any manual localStorage.setItem() calls for bookmarks
  - _Requirements: 1.1, 1.3_

- [x] 5. Update useAuth composable for bookmark sync
- [x] 5.1 Update syncProgress() in composables/useAuth.ts
  - Include bookmark id, name, parameters, updated_at in sync payload
  - Ensure parameters are serialized correctly
  - Handle sync errors gracefully with user feedback
  - _Requirements: 4.1, 5.3_

- [x] 5.2 Update fetchProgress() in composables/useAuth.ts
  - Properly deserialize bookmark parameters from backend response
  - Map backend bookmark format to frontend Bookmark interface
  - Pass complete bookmark data to mergeBackendData()
  - _Requirements: 5.1, 5.2, 5.4_

- [x] 6. Update BookmarkButton component
- [x] 6.1 Fix parameter deep-cloning in components/shared/BookmarkButton.vue
  - Use structuredClone() when saving bookmarks
  - Ensure onLoad callback receives cloned parameters
  - _Requirements: 1.1, 2.1, 6.1_

- [x] 6.2 Add loading states during save operations
  - Show spinner or disabled state while saving
  - Provide visual feedback on successful save
  - _Requirements: 1.5, 8.1_

- [x] 6.3 Improve error handling with user-friendly messages
  - Catch and display validation errors
  - Show toast notifications for sync failures
  - Handle offline scenarios gracefully
  - _Requirements: 1.5, 2.5_

- [x] 6.4 Update component to make bookmark requests to the backend endpoint
  - Component initiates request to backend
  - _Requirements: 1.5, 2.5_

- [x] 7. Update Bookmarks page
- [x] 7.1 Fix saveToStorage() calls in pages/bookmarks.vue
  - Remove manual saveToStorage() method calls
  - Rely on Pinia persistence plugin
  - _Requirements: 3.3_

- [x] 7.2 Update loadBookmark() to properly restore parameters
  - Ensure all parameters are passed via query string or state
  - Handle missing or invalid parameters gracefully
  - Trigger module re-initialization after parameter load
  - _Requirements: 2.2, 2.3, 2.4_

- [x] 7.3 Add loading states during fetch operations
  - Show skeleton loaders while fetching bookmarks
  - Display sync status indicator
  - _Requirements: 5.4, 8.1_

- [x] 7.4 Improve error handling for missing modules
  - Check if module exists in MODULE_REGISTRY before loading
  - Show helpful error message if module not found
  - Keep bookmark in list even if module missing
  - _Requirements: 2.4, 6.3_

- [x] 8. Integrate BookmarkButton into module pages
- [x] 8.1 Add BookmarkButton to all module pages that don't have it
  - Check which module pages are missing bookmark integration
  - Add BookmarkButton component to module header
  - Implement onLoad callback to restore parameters
  - _Requirements: 7.1, 7.2_

- [x] 8.2 Implement parameter restoration logic in module pages
  - Create handleLoadBookmark() function in each module
  - Update reactive parameters with bookmark values
  - Trigger algorithm re-training or visualization updates
  - _Requirements: 2.2, 2.3_

- [x] 9. Add validation and error handling
- [x] 9.1 Add frontend validation for bookmark names
  - Validate name is 1-100 characters
  - Show inline error for invalid names
  - Disable save button when validation fails
  - _Requirements: 1.1, 1.2_

- [x] 9.2 Add frontend validation for parameter size
  - Calculate serialized JSON size before saving
  - Show error if size exceeds 10KB
  - Provide helpful message about reducing parameters
  - _Requirements: 6.4, 8.1_

- [x] 9.3 Add backend validation in progress handler
  - Validate bookmark name length (1-100 chars)
  - Validate parameters JSON size (< 10KB)
  - Return appropriate error codes and messages
  - _Requirements: 4.2, 6.4_

- [x] 10. Integrate BookmarkButton into advanced module pages
- [x] 10.1 Add BookmarkButton to all advanced module pages that don't have it
  - Check which module pages do not have the correct bookmark integration setup
  - Implement the bookmarking functionality correctly by passing props to the ModuleLayout.
  - Implement onLoad callback to restore parameters
  - _Requirements: 7.1, 7.2_

- [x] 10.2 Implement parameter restoration logic in advanced module pages
  - Create handleLoadBookmark() function in each advanced module
  - Update reactive parameters with bookmark values
  - Trigger algorithm re-training or visualization updates
  - _Requirements: 2.2, 2.3_

- [x] 11. Integrate BookmarkButton into classification module pages
- [x] 11.1 Add BookmarkButton to all classification module pages that don't have it
  - Check which module pages do not have the correct bookmark integration setup
  - Implement the bookmarking functionality correctly by passing props to the ModuleLayout. Use `pages/modules/regression/linear-regression.vue` as a guide
  - Implement onLoad callback to restore parameters
  - _Requirements: 7.1, 7.2_

- [x] 11.2 Implement parameter restoration logic in classification module pages
  - Create handleLoadBookmark() function in each classification module
  - Update reactive parameters with bookmark values
  - Trigger algorithm re-training or visualization updates
  - _Requirements: 2.2, 2.3_

- [x] 12. Integrate BookmarkButton into clustering module pages
- [x] 12.1 Add BookmarkButton to all clustering module pages that don't have it
  - Check which module pages do not have the correct bookmark integration setup
  - Implement the bookmarking functionality correctly by passing props to the ModuleLayout. Use `pages/modules/regression/linear-regression.vue` as a guide
  - Implement onLoad callback to restore parameters
  - _Requirements: 7.1, 7.2_

- [x] 12.2 Implement parameter restoration logic in clustering module pages
  - Create handleLoadBookmark() function in each clustering module
  - Update reactive parameters with bookmark values
  - Trigger algorithm re-training or visualization updates
  - _Requirements: 2.2, 2.3_

- [x] 13. Integrate BookmarkButton into computer-vision module pages
- [x] 13.1 Add BookmarkButton to all computer-vision module pages that don't have it
  - Check which module pages do not have the correct bookmark integration setup. The correct pattern is to pass the bookmark props directly to ModuleLayout, not use a separate #actions slot. You must update the module pages to follow the correct pattern.
  - Implement the bookmarking functionality correctly by passing props to the ModuleLayout. Use `pages/modules/regression/linear-regression.vue` as a guide
  - Implement onLoad callback to restore parameters
  - _Requirements: 7.1, 7.2_

- [x] 13.2 Implement parameter restoration logic in computer-vision module pages
  - Create handleLoadBookmark() function in each computer-vision module
  - Update reactive parameters with bookmark values
  - Trigger algorithm re-training or visualization updates
  - _Requirements: 2.2, 2.3_

- [x] 14. Integrate BookmarkButton into nlp module pages
- [x] 14.1 Add BookmarkButton to all nlp module pages that don't have it
  - Check which module pages do not have the correct bookmark integration setup. The correct pattern is to pass the bookmark props directly to ModuleLayout, not use a separate #actions slot. You must update the module pages to follow the correct pattern.
  - Implement the bookmarking functionality correctly by passing props to the ModuleLayout. Use `pages/modules/regression/linear-regression.vue` as a guide
  - Implement onLoad callback to restore parameters
  - _Requirements: 7.1, 7.2_

- [x] 14.2 Implement parameter restoration logic in nlp module pages
  - Create handleLoadBookmark() function in each nlp module
  - Update reactive parameters with bookmark values
  - Trigger algorithm re-training or visualization updates
  - _Requirements: 2.2, 2.3_

- [x] 15. Integrate BookmarkButton into optimization module pages
- [x] 15.1 Add BookmarkButton to all optimization module pages that don't have it
  - Check which module pages do not have the correct bookmark integration setup. The correct pattern is to pass the bookmark props directly to ModuleLayout, not use a separate #actions slot. You must update the module pages to follow the correct pattern.
  - Implement the bookmarking functionality correctly by passing props to the ModuleLayout. Use `pages/modules/regression/linear-regression.vue` as a guide
  - Implement onLoad callback to restore parameters
  - _Requirements: 7.1, 7.2_

- [x] 15.2 Implement parameter restoration logic in optimization module pages
  - Create handleLoadBookmark() function in each optimization module
  - Update reactive parameters with bookmark values
  - Trigger algorithm re-training or visualization updates
  - _Requirements: 2.2, 2.3_

- [x] 16. Integrate BookmarkButton into preprocessing module pages
- [x] 16.1 Add BookmarkButton to all preprocessing module pages that don't have it
  - Check which module pages do not have the correct bookmark integration setup. The correct pattern is to pass the bookmark props directly to ModuleLayout, not use a separate #actions slot. You must update the module pages to follow the correct pattern.
  - Implement the bookmarking functionality correctly by passing props to the ModuleLayout. Use `pages/modules/regression/linear-regression.vue` as a guide
  - Implement onLoad callback to restore parameters
  - _Requirements: 7.1, 7.2_

- [x] 16.2 Implement parameter restoration logic in preprocessing module pages
  - Create handleLoadBookmark() function in each preprocessing module
  - Update reactive parameters with bookmark values
  - Trigger algorithm re-training or visualization updates
  - _Requirements: 2.2, 2.3_

- [x] 17. Integrate BookmarkButton into regression module pages
- [x] 17.1 Add BookmarkButton to all regression module pages that don't have it
  - Check which module pages do not have the correct bookmark integration setup. The correct pattern is to pass the bookmark props directly to ModuleLayout, not use a separate #actions slot. You must update the module pages to follow the correct pattern.
  - Implement the bookmarking functionality correctly by passing props to the ModuleLayout. Use `pages/modules/regression/linear-regression.vue` as a guide
  - Implement onLoad callback to restore parameters
  - _Requirements: 7.1, 7.2_

- [x] 17.2 Implement parameter restoration logic in regression module pages
  - Create handleLoadBookmark() function in each regression module
  - Update reactive parameters with bookmark values
  - Trigger algorithm re-training or visualization updates
  - _Requirements: 2.2, 2.3_

- [x] 18. Integrate BookmarkButton into reinforcement-learning module pages
- [x] 18.1 Add BookmarkButton to all reinforcement-learning module pages that don't have it
  - Check which module pages do not have the correct bookmark integration setup. The correct pattern is to pass the bookmark props directly to ModuleLayout, not use a separate #actions slot. You must update the module pages to follow the correct pattern.
  - Implement the bookmarking functionality correctly by passing props to the ModuleLayout. Use `pages/modules/regression/linear-regression.vue` as a guide
  - Implement onLoad callback to restore parameters
  - _Requirements: 7.1, 7.2_

- [x] 18.2 Implement parameter restoration logic in reinforcement-learning module pages
  - Create handleLoadBookmark() function in each reinforcement-learning module
  - Update reactive parameters with bookmark values
  - Trigger algorithm re-training or visualization updates
  - _Requirements: 2.2, 2.3_
