/**
 * API Client
 * 
 * Handles HTTP requests to the Cloudflare Worker backend with automatic
 * authentication header injection and 401 error handling.
 * 
 * Requirements: 3.1, 8.6
 */

import { useAuthStore } from '~/stores/auth';

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Use environment variable or fallback to localhost for development
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else {
      try {
        this.baseUrl = useRuntimeConfig().public.apiUrl || 'http://localhost:8787';
      } catch {
        // Fallback for test environments where useRuntimeConfig is not available
        this.baseUrl = 'http://localhost:8787';
      }
    }
  }

  /**
   * Get authorization header if user is authenticated
   * Requirements: 3.1
   */
  private getAuthHeader(): Record<string, string> {
    const authStore = useAuthStore();
    
    if (authStore.token) {
      return {
        'Authorization': `Bearer ${authStore.token}`,
      };
    }
    
    return {};
  }

  /**
   * Handle 401 Unauthorized errors by automatically logging out
   * Requirements: 8.6
   */
  private handleUnauthorized(): void {
    const authStore = useAuthStore();
    authStore.clearAuth();
    
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  /**
   * Perform GET request
   * Requirements: 3.1, 8.6
   */
  async get<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error('Unauthorized');
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Perform POST request
   * Requirements: 3.1, 8.6
   */
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error('Unauthorized');
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Perform PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error('Unauthorized');
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  /**
   * Perform DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error('Unauthorized');
      }

      // Handle other error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }
}

/**
 * Create a singleton instance of the API client
 */
let apiClientInstance: ApiClient | null = null;

export function useApiClient(): ApiClient {
  if (!apiClientInstance) {
    apiClientInstance = new ApiClient();
  }
  return apiClientInstance;
}
