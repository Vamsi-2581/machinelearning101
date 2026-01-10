# Design Document

## Overview

The Bookmarks feature enables users to save and manage module parameter configurations for quick access and reuse. The feature consists of:

1. **Frontend Components**: UI for saving, loading, editing, and deleting bookmarks
2. **State Management**: Pinia store for local bookmark storage with automatic persistence
3. **Backend API**: Cloudflare Workers endpoints for authenticated bookmark synchronization
4. **Database Schema**: Extended bookmarks table to store name and parameters as JSON
5. **Sync Mechanism**: Automatic background synchronization for authenticated users

The design follows the existing architecture patterns in the Machine Learning 101 platform, leveraging Pinia for state management, Nuxt 4 for routing, and Cloudflare Workers with D1 database for backend persistence.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Nuxt 4)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Bookmarks   │  │   Bookmark   │  │    Module    │     │
│  │     Page     │  │    Button    │  │    Pages     │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                  ┌─────────▼─────────┐                      │
│                  │  Progress Store   │                      │
│                  │   (Pinia + LS)    │                      │
│                  └─────────┬─────────┘                      │
│                            │                                 │
│                  ┌─────────▼─────────┐                      │
│                  │   useAuth Hook    │                      │
│                  └─────────┬─────────┘                      │
└────────────────────────────┼─────────────────────────────────┘
                             │ HTTP/JSON
                             │ (JWT Auth)
┌────────────────────────────▼─────────────────────────────────┐
│              Backend (Cloudflare Workers)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │   Progress   │  │   Database   │     │
│  │  Middleware  │  │   Handlers   │  │   Service    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                  ┌─────────▼─────────┐                      │
│                  │   D1 Database     │                      │
│                  │  (SQLite-based)   │                      │
│                  └───────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```



### Data Flow

#### Saving a Bookmark (Authenticated User)

```
User clicks "Save" → BookmarkButton validates input → Progress Store creates bookmark
→ Store persists to localStorage → Store triggers sync → useAuth sends to backend
→ Backend validates JWT → Backend validates data → Backend saves to D1 database
→ Backend returns success → Frontend updates UI
```

#### Loading Bookmarks (Authenticated User on New Device)

```
User logs in → useAuth.initializeAuth() → fetchProgress() → Backend queries D1
→ Backend returns all bookmarks → Frontend merges with local data
→ Progress Store updates → UI reflects merged bookmarks
```

#### Conflict Resolution

- **Strategy**: Last-write-wins based on timestamp
- **Local vs Cloud**: When syncing, the most recent timestamp wins
- **Merge Logic**: Bookmarks are identified by user_id + module_id + bookmark_id
- **Duplicate Prevention**: Frontend generates unique IDs; backend uses upsert operations



## Components and Interfaces

### Frontend Components

#### 1. BookmarkButton Component (Existing - Needs Enhancement)

**Location**: `components/shared/BookmarkButton.vue`

**Current State**: Partially implemented with basic save/load functionality

**Required Enhancements**:
- Add support for editing bookmark names
- Improve parameter deep-cloning to prevent reference issues
- Add loading states during sync operations
- Enhance error handling with user-friendly messages

**Props**:
```typescript
interface BookmarkButtonProps {
  moduleId: string;              // Module identifier
  parameters: Record<string, any>; // Current parameter values
  onLoad?: (parameters: Record<string, any>) => void; // Callback when bookmark loaded
}
```

**Key Methods**:
- `saveBookmark()`: Validates input, creates bookmark, triggers sync
- `loadBookmark(bookmark)`: Restores parameters, calls onLoad callback
- `deleteBookmark(id)`: Removes bookmark with confirmation
- `toggleBookmarkMenu()`: Shows/hides dropdown menu



#### 2. Bookmarks Page (Existing - Needs Enhancement)

**Location**: `pages/bookmarks.vue`

**Current State**: Displays bookmarks with basic CRUD operations

**Required Enhancements**:
- Fix `saveToStorage()` method call (should use Pinia persistence automatically)
- Add loading states during fetch operations
- Improve error handling for missing modules
- Add empty state with better UX
- Implement proper parameter restoration when loading bookmarks

**Key Features**:
- Display all bookmarks sorted by timestamp
- Show module name, bookmark name, timestamp, and parameter preview
- Edit bookmark names via modal dialog
- Delete bookmarks with confirmation
- Load bookmarks by navigating to module with query parameters



### State Management

#### Progress Store (Existing - Needs Enhancement)

**Location**: `stores/progress.ts`

**Current Bookmark Interface**:
```typescript
interface Bookmark {
  id: string;              // Unique identifier
  moduleId: string;        // Module identifier
  name: string;            // User-provided name
  parameters: Record<string, any>; // Saved parameter values
  timestamp: number;       // Creation/update timestamp
}
```

**Required Enhancements**:
1. Fix `saveToStorage()` method calls (Pinia persistence handles this automatically)
2. Improve `mergeBackendData()` to properly handle bookmark parameters
3. Add method to update bookmark names
4. Enhance deep-cloning of parameters to prevent reference issues

**Key Methods**:
- `addBookmark(bookmark)`: Creates new bookmark with generated ID
- `removeBookmark(id)`: Deletes bookmark by ID
- `getModuleBookmarks(moduleId)`: Returns bookmarks for specific module
- `updateBookmarkName(id, name)`: Updates bookmark name (NEW)
- `mergeBackendData(data)`: Merges cloud bookmarks with local bookmarks



### Backend API

#### useAuth Composable (Existing - Needs Enhancement)

**Location**: `composables/useAuth.ts`

**Current State**: Handles authentication and basic progress sync

**Required Enhancements**:
1. Update `syncProgress()` to include bookmark name and parameters
2. Update `fetchProgress()` to properly deserialize bookmark parameters from backend
3. Improve error handling for bookmark sync failures
4. Add retry logic for failed sync operations

**Sync Data Structure** (Updated):
```typescript
interface SyncProgressData {
  modules: Array<{
    module_id: string;
    completed: boolean;
    completed_at: number | null;
  }>;
  quizzes: Array<{
    module_id: string;
    score: number;
    total: number;
    completed_at: number;
  }>;
  bookmarks: Array<{
    id: string;                    // NEW: Bookmark ID
    module_id: string;
    name: string;                  // NEW: Bookmark name
    parameters: Record<string, any>; // NEW: Parameter values
    created_at: number;
  }>;
}
```



## Data Models

### Database Schema Changes

#### Current Bookmarks Table

```sql
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, module_id)
);
```

**Problem**: Current schema only supports one bookmark per module per user (UNIQUE constraint on user_id + module_id)

#### Updated Bookmarks Table (Required)

```sql
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  name TEXT NOT NULL,
  parameters TEXT NOT NULL,  -- JSON string
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Remove old unique constraint, add index for queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_module ON bookmarks(user_id, module_id);
```

**Key Changes**:
1. Remove `UNIQUE(user_id, module_id)` constraint to allow multiple bookmarks per module
2. Add `name` column for user-provided bookmark names
3. Add `parameters` column to store JSON-serialized parameter values
4. Add `updated_at` column for tracking modifications
5. Add composite index for efficient queries



### Backend Type Definitions

#### Updated Bookmark Type

**Location**: `worker/src/types/index.ts`

```typescript
// Current (incomplete)
export interface Bookmark {
  id: string;
  user_id: string;
  module_id: string;
  created_at: number;
}

// Updated (complete)
export interface Bookmark {
  id: string;
  user_id: string;
  module_id: string;
  name: string;
  parameters: string;  // JSON string in database
  created_at: number;
  updated_at: number;
}

// Frontend representation (after deserialization)
export interface BookmarkWithParams {
  id: string;
  user_id: string;
  module_id: string;
  name: string;
  parameters: Record<string, any>;  // Parsed JSON object
  created_at: number;
  updated_at: number;
}
```

#### Updated Request/Response Types

```typescript
// Sync request - updated bookmarks array
export interface SyncProgressRequest {
  modules: Array<{
    module_id: string;
    completed: boolean;
    completed_at: number | null;
  }>;
  quizzes: Array<{
    module_id: string;
    score: number;
    total: number;
    completed_at: number;
  }>;
  bookmarks: Array<{
    id: string;
    module_id: string;
    name: string;
    parameters: Record<string, any>;
    created_at: number;
    updated_at: number;
  }>;
}

// Progress response - updated bookmarks array
export interface ProgressResponse {
  modules: Progress[];
  quizzes: QuizScore[];
  bookmarks: Array<{
    id: string;
    user_id: string;
    module_id: string;
    name: string;
    parameters: Record<string, any>;  // Deserialized
    created_at: number;
    updated_at: number;
  }>;
}
```



### Database Service Updates

#### Updated Database Functions

**Location**: `worker/src/services/database.ts`

**Functions to Update**:

1. **saveBookmark()** - Add name and parameters
```typescript
export async function saveBookmark(
  db: D1Database,
  userId: string,
  bookmarkId: string,
  moduleId: string,
  name: string,
  parameters: Record<string, any>,
  createdAt: number,
  updatedAt: number
): Promise<Bookmark>
```

2. **updateBookmark()** - NEW function for updating existing bookmarks
```typescript
export async function updateBookmark(
  db: D1Database,
  userId: string,
  bookmarkId: string,
  updates: {
    name?: string;
    parameters?: Record<string, any>;
  }
): Promise<Bookmark>
```

3. **deleteBookmark()** - Update to use bookmark ID instead of module ID
```typescript
export async function deleteBookmark(
  db: D1Database,
  userId: string,
  bookmarkId: string
): Promise<boolean>
```

4. **getBookmarksByUserId()** - Update to deserialize parameters
```typescript
export async function getBookmarksByUserId(
  db: D1Database,
  userId: string
): Promise<BookmarkWithParams[]>
```



## Error Handling

### Frontend Error Scenarios

1. **Invalid Bookmark Name**
   - Validation: Name must be 1-100 characters
   - Action: Show inline error message, prevent save
   - User Feedback: "Bookmark name is required"

2. **Parameters Too Large**
   - Validation: Serialized JSON must be < 10KB
   - Action: Show error toast, prevent save
   - User Feedback: "Configuration is too large to save"

3. **Sync Failure (Network Error)**
   - Action: Save locally, retry sync in background
   - User Feedback: "Saved locally. Will sync when online."

4. **Sync Failure (Auth Error)**
   - Action: Save locally, prompt re-authentication
   - User Feedback: "Session expired. Please sign in to sync."

5. **Module Not Found (Loading Bookmark)**
   - Action: Show error, keep bookmark in list
   - User Feedback: "Module not found. Bookmark preserved."

### Backend Error Scenarios

1. **Invalid JWT Token**
   - HTTP Status: 401 Unauthorized
   - Response: `{ "code": "INVALID_TOKEN", "message": "Invalid or expired token" }`
   - Action: Frontend clears auth and redirects to login

2. **Invalid Bookmark Data**
   - HTTP Status: 400 Bad Request
   - Response: `{ "code": "VALIDATION_ERROR", "message": "Invalid bookmark data: [details]" }`
   - Action: Frontend shows error toast, keeps local data

3. **Parameters JSON Too Large**
   - HTTP Status: 400 Bad Request
   - Response: `{ "code": "VALIDATION_ERROR", "message": "Parameters exceed 10KB limit" }`
   - Action: Frontend shows error, suggests reducing parameters

4. **Database Error**
   - HTTP Status: 500 Internal Server Error
   - Response: `{ "code": "DATABASE_ERROR", "message": "Failed to save bookmark" }`
   - Action: Frontend retries sync, shows error if persistent

5. **Bookmark Not Found (Delete/Update)**
   - HTTP Status: 404 Not Found
   - Response: `{ "code": "NOT_FOUND", "message": "Bookmark not found" }`
   - Action: Frontend removes from local store



## Testing Strategy

### Unit Tests

#### Frontend Unit Tests

**Location**: `tests/unit/stores/progress.spec.ts`

1. **Bookmark CRUD Operations**
   - Test `addBookmark()` creates bookmark with correct structure
   - Test `removeBookmark()` deletes bookmark by ID
   - Test `getModuleBookmarks()` filters by module ID
   - Test `updateBookmarkName()` updates name correctly

2. **Parameter Deep Cloning**
   - Test that modifying original parameters doesn't affect saved bookmark
   - Test that modifying bookmark parameters doesn't affect original

3. **Merge Logic**
   - Test `mergeBackendData()` with newer cloud bookmarks
   - Test `mergeBackendData()` with newer local bookmarks
   - Test `mergeBackendData()` with duplicate bookmarks

**Location**: `tests/unit/components/BookmarkButton.spec.ts`

1. **Component Behavior**
   - Test bookmark menu opens/closes correctly
   - Test save button disabled when name is empty
   - Test bookmark count displays correctly
   - Test delete confirmation dialog appears

#### Backend Unit Tests

**Location**: `worker/tests/services/database.spec.ts`

1. **Database Operations**
   - Test `saveBookmark()` inserts bookmark with parameters
   - Test `updateBookmark()` modifies existing bookmark
   - Test `deleteBookmark()` removes bookmark
   - Test `getBookmarksByUserId()` returns all user bookmarks
   - Test JSON serialization/deserialization of parameters

2. **Validation**
   - Test parameters JSON size limit (10KB)
   - Test invalid JSON handling
   - Test missing required fields



### Integration Tests

#### Frontend Integration Tests

**Location**: `tests/integration/bookmarks.spec.ts`

1. **End-to-End Bookmark Flow**
   - Navigate to module page
   - Adjust parameters
   - Save bookmark with custom name
   - Verify bookmark appears in dropdown
   - Load bookmark and verify parameters restored
   - Navigate to bookmarks page
   - Edit bookmark name
   - Delete bookmark

2. **Sync Flow (Mocked Backend)**
   - Login as authenticated user
   - Create bookmark
   - Verify sync request sent to backend
   - Mock backend response
   - Verify local state updated

#### Backend Integration Tests

**Location**: `worker/tests/integration/progress.spec.ts`

1. **Bookmark Sync Endpoint**
   - Send sync request with bookmarks
   - Verify bookmarks saved to database
   - Verify response includes synced_at timestamp

2. **Bookmark Fetch Endpoint**
   - Create bookmarks in database
   - Send fetch request
   - Verify all bookmarks returned with deserialized parameters

3. **Conflict Resolution**
   - Create bookmark with timestamp T1
   - Sync bookmark with timestamp T2 (newer)
   - Verify T2 bookmark overwrites T1

### Manual Testing Checklist

1. **Unauthenticated User**
   - [ ] Save bookmark on module page
   - [ ] Verify bookmark persists after page refresh
   - [ ] Load bookmark and verify parameters restored
   - [ ] Edit bookmark name on bookmarks page
   - [ ] Delete bookmark

2. **Authenticated User - Single Device**
   - [ ] Login
   - [ ] Save bookmark
   - [ ] Verify sync indicator shows success
   - [ ] Refresh page
   - [ ] Verify bookmark still present

3. **Authenticated User - Multiple Devices**
   - [ ] Login on Device A
   - [ ] Save bookmark on Device A
   - [ ] Login on Device B
   - [ ] Verify bookmark appears on Device B
   - [ ] Edit bookmark on Device B
   - [ ] Verify changes appear on Device A after refresh

4. **Edge Cases**
   - [ ] Save bookmark with very long name (100 chars)
   - [ ] Save bookmark with many parameters (large JSON)
   - [ ] Save multiple bookmarks for same module
   - [ ] Delete all bookmarks and verify empty state
   - [ ] Test offline mode (save locally, sync when online)



## Performance Considerations

### Frontend Performance

1. **Local Storage Optimization**
   - Pinia persistence plugin handles automatic serialization
   - Bookmarks stored as JSON in localStorage
   - Maximum 5MB localStorage limit (browser dependent)
   - Estimated capacity: ~500-1000 bookmarks with typical parameters

2. **Rendering Performance**
   - Bookmarks page uses virtual scrolling for 100+ bookmarks
   - Lazy loading of bookmark parameter previews
   - Debounced search/filter operations

3. **Sync Performance**
   - Background sync doesn't block UI interactions
   - Sync triggered max once per 100ms (debounced)
   - Failed syncs retry with exponential backoff

### Backend Performance

1. **Database Queries**
   - Indexed queries on `user_id` for fast lookups
   - Composite index on `(user_id, module_id)` for filtering
   - Batch operations for syncing multiple bookmarks

2. **JSON Serialization**
   - Parameters serialized once during save
   - Deserialized once during fetch
   - 10KB limit prevents excessive payload sizes

3. **API Response Times**
   - Target: < 200ms for bookmark fetch (100 bookmarks)
   - Target: < 300ms for bookmark sync (10 bookmarks)
   - Cloudflare Workers edge computing reduces latency

### Scalability

1. **User Limits**
   - Soft limit: 100 bookmarks per user (UI warning)
   - Hard limit: 1000 bookmarks per user (backend validation)
   - Per-bookmark parameter size: 10KB max

2. **Database Scaling**
   - D1 database supports millions of rows
   - Indexes ensure query performance at scale
   - Foreign key cascades handle user deletion efficiently



## Implementation Notes

### Migration Strategy

Since the bookmarks table schema needs to change, we need a migration strategy:

1. **Database Migration**
   - Create new migration file: `worker/migrations/002_update_bookmarks_table.sql`
   - Drop old unique constraint
   - Add new columns (name, parameters, updated_at)
   - Add new index
   - Existing bookmarks will need default values or be cleared

2. **Backward Compatibility**
   - Frontend should handle bookmarks without parameters gracefully
   - Backend should validate bookmark structure before processing
   - Consider versioning the bookmark format for future changes

### Security Considerations

1. **Parameter Validation**
   - Sanitize bookmark names (prevent XSS)
   - Validate parameter types match module schema
   - Limit parameter JSON size to prevent DoS

2. **Authorization**
   - Users can only access their own bookmarks
   - JWT validation on all bookmark endpoints
   - User ID from JWT, not from request body

3. **Data Privacy**
   - Bookmarks contain user-specific configurations
   - No sharing or public bookmarks in this version
   - Bookmarks deleted when user account deleted (CASCADE)

### Accessibility

1. **Keyboard Navigation**
   - Bookmark button accessible via Tab key
   - Dropdown menu navigable with arrow keys
   - Modal dialogs support Escape to close

2. **Screen Readers**
   - ARIA labels on all interactive elements
   - Status announcements for save/load/delete actions
   - Semantic HTML structure

3. **Visual Feedback**
   - Loading states during async operations
   - Success/error messages via toast notifications
   - Disabled states for invalid actions



## Design Decisions and Rationales

### 1. Multiple Bookmarks Per Module

**Decision**: Allow users to save multiple bookmarks for the same module

**Rationale**: 
- Users may want to save different parameter configurations for experimentation
- Example: "High learning rate", "Low learning rate", "Best accuracy" for same module
- Removes artificial limitation of one bookmark per module

**Alternative Considered**: Single bookmark per module with versioning
- Rejected: Too complex for user mental model

### 2. Store Parameters as JSON in Database

**Decision**: Serialize parameters as JSON string in database

**Rationale**:
- Flexible schema - supports any parameter structure
- No need to create separate tables for parameter types
- Easy to add new parameter types without schema changes
- Standard approach for semi-structured data in SQL

**Alternative Considered**: Separate parameters table with key-value pairs
- Rejected: Overly complex, harder to query, no significant benefits

### 3. Last-Write-Wins Conflict Resolution

**Decision**: Use timestamp-based last-write-wins for sync conflicts

**Rationale**:
- Simple to implement and understand
- Matches user expectations (most recent change wins)
- No complex merge logic needed for parameters
- Acceptable for bookmark use case (low conflict probability)

**Alternative Considered**: Operational transformation or CRDTs
- Rejected: Overkill for bookmark synchronization

### 4. Background Sync with Debouncing

**Decision**: Sync automatically in background with 100ms debounce

**Rationale**:
- Non-blocking user experience
- Prevents excessive API calls during rapid changes
- Graceful degradation if sync fails (local data preserved)
- Matches existing progress sync pattern

**Alternative Considered**: Manual sync button
- Rejected: Adds friction, users forget to sync

### 5. 10KB Parameter Size Limit

**Decision**: Limit serialized parameters to 10KB

**Rationale**:
- Prevents abuse and excessive storage costs
- Typical parameter sets are < 1KB
- Allows for reasonable number of parameters
- Protects against malicious payloads

**Alternative Considered**: No limit or 100KB limit
- Rejected: Risk of abuse, unnecessary for use case

