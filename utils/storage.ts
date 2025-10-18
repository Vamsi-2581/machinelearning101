/**
 * Storage Service
 * Provides localStorage utilities with quota handling, error handling, and data migration
 */

export interface StorageOptions {
  prefix?: string;
  version?: number;
}

export interface StorageError {
  type: "quota_exceeded" | "not_available" | "parse_error" | "unknown";
  message: string;
  originalError?: Error;
}

export interface MigrationFunction {
  (oldData: any, oldVersion: number): any;
}

const DEFAULT_PREFIX = "ml_platform_";
const CURRENT_VERSION = 1;
const VERSION_KEY = "_storage_version";

class StorageService {
  private prefix: string;
  private version: number;
  private migrations: Map<number, MigrationFunction> = new Map();
  private isAvailable: boolean = false;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || DEFAULT_PREFIX;
    this.version = options.version || CURRENT_VERSION;
    this.isAvailable = this.checkAvailability();

    if (this.isAvailable) {
      this.runMigrations();
    }
  }

  /**
   * Check if localStorage is available
   */
  private checkAvailability(): boolean {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn("localStorage is not available:", e);
      return false;
    }
  }

  /**
   * Get the full key with prefix
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Get item from localStorage
   */
  get<T = any>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable) {
      return defaultValue ?? null;
    }

    try {
      const fullKey = this.getKey(key);
      const item = localStorage.getItem(fullKey);

      if (item === null) {
        return defaultValue ?? null;
      }

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Set item in localStorage with quota handling
   */
  set<T = any>(
    key: string,
    value: T
  ): { success: boolean; error?: StorageError } {
    if (!this.isAvailable) {
      return {
        success: false,
        error: {
          type: "not_available",
          message: "localStorage is not available in this browser",
        },
      };
    }

    try {
      const fullKey = this.getKey(key);
      const serialized = JSON.stringify(value);
      localStorage.setItem(fullKey, serialized);

      return { success: true };
    } catch (error) {
      const storageError = this.handleStorageError(error as Error, key);
      console.error(`Error writing to localStorage (key: ${key}):`, error);

      return {
        success: false,
        error: storageError,
      };
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const fullKey = this.getKey(key);
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all items with the current prefix
   */
  clear(): boolean {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  }

  /**
   * Get all keys with the current prefix
   */
  keys(): string[] {
    if (!this.isAvailable) {
      return [];
    }

    const keys: string[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.substring(this.prefix.length));
        }
      }
    } catch (error) {
      console.error("Error getting keys from localStorage:", error);
    }

    return keys;
  }

  /**
   * Check if localStorage quota is exceeded
   */
  isQuotaExceeded(error: Error): boolean {
    return (
      error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      (error as any).code === 22 ||
      (error as any).code === 1014
    );
  }

  /**
   * Handle storage errors and return structured error
   */
  private handleStorageError(error: Error, key: string): StorageError {
    if (this.isQuotaExceeded(error)) {
      return {
        type: "quota_exceeded",
        message: `Storage quota exceeded while saving "${key}". Please clear some data or browser storage.`,
        originalError: error,
      };
    }

    if (error instanceof SyntaxError) {
      return {
        type: "parse_error",
        message: `Failed to parse data for key "${key}"`,
        originalError: error,
      };
    }

    return {
      type: "unknown",
      message: `Unknown storage error for key "${key}": ${error.message}`,
      originalError: error,
    };
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): { used: number; available: boolean } {
    if (!this.isAvailable) {
      return { used: 0, available: false };
    }

    let used = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          if (value) {
            used += key.length + value.length;
          }
        }
      }
    } catch (error) {
      console.error("Error calculating storage usage:", error);
    }

    return { used, available: this.isAvailable };
  }

  /**
   * Register a migration function for a specific version
   */
  registerMigration(version: number, migrationFn: MigrationFunction): void {
    this.migrations.set(version, migrationFn);
  }

  /**
   * Run migrations if needed
   */
  private runMigrations(): void {
    const storedVersion = this.get<number>(VERSION_KEY, 0);

    if (storedVersion === this.version) {
      return; // No migration needed
    }

    console.log(
      `Migrating storage from version ${storedVersion} to ${this.version}`
    );

    // Run migrations in order
    for (let v = (storedVersion ?? 0) + 1; v <= this.version; v++) {
      const migration = this.migrations.get(v);

      if (migration) {
        try {
          console.log(`Running migration for version ${v}`);
          this.runMigration(migration, storedVersion ?? 0);
        } catch (error) {
          console.error(`Migration to version ${v} failed:`, error);
          // Continue with other migrations
        }
      }
    }

    // Update version
    this.set(VERSION_KEY, this.version);
  }

  /**
   * Run a single migration
   */
  private runMigration(
    migrationFn: MigrationFunction,
    oldVersion: number
  ): void {
    const keys = this.keys().filter((key) => key !== VERSION_KEY);

    keys.forEach((key) => {
      const oldData = this.get(key);
      if (oldData !== null) {
        try {
          const newData = migrationFn(oldData, oldVersion);
          this.set(key, newData);
        } catch (error) {
          console.error(`Failed to migrate key "${key}":`, error);
        }
      }
    });
  }

  /**
   * Check if storage is available
   */
  get available(): boolean {
    return this.isAvailable;
  }
}

// Create and export singleton instance
export const storage = new StorageService();

// Export class for custom instances
export { StorageService };
