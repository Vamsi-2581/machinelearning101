# Requirements Document

## Introduction

This document specifies the requirements for completing the Bookmarks feature in the Machine Learning 101 learning platform. The Bookmarks feature allows users to save and manage module configurations (parameter settings) for quick access and reuse. The feature includes both frontend UI components and backend API endpoints for authenticated users to sync bookmarks across devices.

## Glossary

- **System**: The Machine Learning 101 learning platform
- **User**: A person using the platform to learn machine learning concepts
- **Module**: An interactive learning unit focused on a specific ML algorithm or concept
- **Bookmark**: A saved configuration of module parameters with a user-provided name
- **Parameter**: A configurable value that affects how an algorithm behaves (e.g., learning rate, epochs)
- **Frontend**: The browser-based Vue.js/Nuxt application
- **Backend**: The Cloudflare Workers API that handles authentication and data persistence
- **Local Storage**: Browser-based storage for unauthenticated users
- **Cloud Sync**: Synchronization of bookmarks to the backend database for authenticated users

## Requirements

### Requirement 1: Save Module Configurations

**User Story:** As a user, I want to save my current module parameter configuration with a custom name, so that I can quickly restore these settings later without manually adjusting each parameter.

#### Acceptance Criteria

1. WHEN the User clicks the bookmark button on a module page, THE Frontend SHALL display a bookmark menu with an input field for naming the configuration
2. WHEN the User enters a bookmark name and clicks save, THE Frontend SHALL create a bookmark containing the module ID, bookmark name, all current parameter values, and a timestamp
3. WHEN a bookmark is created, THE Frontend SHALL store the bookmark in Local Storage immediately
4. IF the User is authenticated, THEN THE Frontend SHALL sync the new bookmark to the Backend within 100 milliseconds
5. WHEN a bookmark is successfully saved, THE Frontend SHALL provide visual feedback to the User within 1 second

### Requirement 2: Load Saved Configurations

**User Story:** As a user, I want to load a previously saved bookmark, so that I can quickly restore parameter settings without manual configuration.

#### Acceptance Criteria

1. WHEN the User clicks the bookmark button, THE Frontend SHALL display all bookmarks for the current module sorted by most recent first
2. WHEN the User clicks on a saved bookmark in the dropdown menu, THE Frontend SHALL restore all parameter values from that bookmark
3. WHEN parameters are restored from a bookmark, THE Frontend SHALL trigger any necessary side effects such as retraining the algorithm or updating visualizations
4. WHEN a bookmark is loaded from the bookmarks page, THE Frontend SHALL navigate to the module page with parameters applied via URL query parameters
5. WHEN parameters are loaded, THE Frontend SHALL provide visual feedback that the configuration has been restored

### Requirement 3: Manage Bookmarks

**User Story:** As a user, I want to view, edit, and delete my bookmarks, so that I can organize my saved configurations effectively.

#### Acceptance Criteria

1. WHEN the User navigates to the bookmarks page, THE Frontend SHALL display all bookmarks grouped by module with metadata including name, module, timestamp, and parameter preview
2. WHEN the User clicks the edit button on a bookmark, THE Frontend SHALL display a modal dialog allowing the User to modify the bookmark name
3. WHEN the User saves an edited bookmark name, THE Frontend SHALL update the bookmark in Local Storage and sync to the Backend if authenticated
4. WHEN the User clicks the delete button on a bookmark, THE Frontend SHALL display a confirmation dialog
5. WHEN the User confirms deletion, THE Frontend SHALL remove the bookmark from Local Storage and sync the deletion to the Backend if authenticated

### Requirement 4: Backend Bookmark Persistence

**User Story:** As an authenticated user, I want my bookmarks to be saved to the cloud, so that I can access them from any device.

#### Acceptance Criteria

1. WHEN the Frontend syncs bookmarks to the Backend, THE Backend SHALL validate the user's JWT token before processing the request
2. WHEN the Backend receives bookmark data, THE Backend SHALL validate that each bookmark contains a valid module ID, name, parameters object, and timestamp
3. WHEN the Backend saves a bookmark, THE Backend SHALL store the user ID, module ID, bookmark name, parameters as JSON, and timestamp in the database
4. WHEN the Backend receives a sync request with existing bookmarks, THE Backend SHALL use last-write-wins conflict resolution based on timestamp
5. WHEN the Frontend requests bookmarks from the Backend, THE Backend SHALL return all bookmarks for the authenticated user with complete parameter data

### Requirement 5: Cross-Device Synchronization

**User Story:** As an authenticated user, I want my bookmarks to sync across all my devices, so that I have consistent access to my saved configurations.

#### Acceptance Criteria

1. WHEN an authenticated User logs in on a new device, THE Frontend SHALL fetch all bookmarks from the Backend within 2 seconds
2. WHEN the Frontend receives bookmarks from the Backend, THE Frontend SHALL merge them with any local bookmarks using timestamp-based conflict resolution
3. WHEN a User creates or modifies a bookmark on one device, THE Frontend SHALL sync the change to the Backend within 100 milliseconds
4. WHEN a User opens the application on another device, THE Frontend SHALL display the updated bookmarks after fetching from the Backend
5. WHILE the Frontend is syncing bookmarks, THE Frontend SHALL not block user interactions with the interface

### Requirement 6: Bookmark Data Integrity

**User Story:** As a user, I want my bookmark parameters to be accurately saved and restored, so that my configurations work exactly as expected when loaded.

#### Acceptance Criteria

1. WHEN the Frontend saves a bookmark, THE Frontend SHALL deep-clone all parameter values to prevent reference issues
2. WHEN the Frontend restores a bookmark, THE Frontend SHALL validate that all required parameters for the module exist in the bookmark data
3. IF a bookmark contains parameters that no longer exist in the module, THEN THE Frontend SHALL ignore those parameters and use module defaults
4. WHEN the Backend stores bookmark parameters, THE Backend SHALL serialize the parameters object as JSON with a maximum size of 10 kilobytes
5. WHEN the Backend retrieves bookmark parameters, THE Backend SHALL deserialize the JSON and validate the structure before returning to the Frontend

### Requirement 7: Bookmark UI Integration

**User Story:** As a user, I want the bookmark button to be easily accessible on every module page, so that I can save configurations without interrupting my learning flow.

#### Acceptance Criteria

1. WHEN a User views any module page, THE Frontend SHALL display a bookmark button in the module header
2. WHEN a module has saved bookmarks, THE Frontend SHALL display the bookmark count on the button
3. WHEN a User hovers over the bookmark button, THE Frontend SHALL display a tooltip indicating the button's purpose
4. WHEN the bookmark menu is open, THE Frontend SHALL close the menu if the User clicks outside the menu area
5. WHEN the bookmark menu is open, THE Frontend SHALL close the menu if the User presses the Escape key
