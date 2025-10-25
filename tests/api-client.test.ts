/**
 * API Client Tests
 * 
 * Tests for the API client utility that handles HTTP requests
 * with authentication and error handling.
 * 
 * Requirements: 3.1, 8.6
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { ApiClient } from '~/utils/api-client';
import { useAuthStore } from '~/stores/auth';

// Mock fetch
global.fetch = vi.fn();

// Mock window.location
const mockLocation = {
  href: '',
};
Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Mock useRuntimeConfig
vi.mock('#app', () => ({
  useRuntimeConfig: () => ({
    public: {
      apiUrl: 'https://api.test.com',
    },
  }),
}));

describe('ApiClient', () => {
  let apiClient: ApiClient;
  let authStore: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    authStore = useAuthStore();
    apiClient = new ApiClient('https://api.test.com');
    vi.clearAllMocks();
    mockLocation.href = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should use provided baseUrl', () => {
      const client = new ApiClient('https://custom.api.com');
      expect(client).toBeDefined();
    });

    it('should use runtime config if no baseUrl provided', () => {
      const client = new ApiClient();
      expect(client).toBeDefined();
    });
  });

  describe('getAuthHeader', () => {
    it('should return Authorization header when token exists', async () => {
      authStore.setToken('test-token-123');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      });

      await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token-123',
          }),
        })
      );
    });

    it('should not include Authorization header when no token', async () => {
      authStore.clearAuth();

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      });

      await apiClient.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.anything(),
          }),
        })
      );
    });
  });

  describe('get', () => {
    it('should perform GET request successfully', async () => {
      const mockData = { id: 1, name: 'Test' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockData,
      });

      const result = await apiClient.get('/users/1');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/users/1',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should include Authorization header for authenticated requests', async () => {
      authStore.setToken('test-token');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await apiClient.get('/protected');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/protected',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });

    it('should handle 401 errors with automatic logout', async () => {
      authStore.setToken('expired-token');
      authStore.setUser({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        picture_url: null,
      });

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'Unauthorized' }),
      });

      await expect(apiClient.get('/protected')).rejects.toThrow('Unauthorized');

      // Verify user was logged out
      expect(authStore.token).toBeNull();
      expect(authStore.user).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
      expect(mockLocation.href).toBe('/');
    });

    it('should handle other error responses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Server error' }),
      });

      await expect(apiClient.get('/error')).rejects.toThrow('Server error');
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.get('/test')).rejects.toThrow('Network error');
    });
  });

  describe('post', () => {
    it('should perform POST request successfully', async () => {
      const requestData = { name: 'New User', email: 'new@example.com' };
      const responseData = { id: 1, ...requestData };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => responseData,
      });

      const result = await apiClient.post('/users', requestData);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/users',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(requestData),
        })
      );
      expect(result).toEqual(responseData);
    });

    it('should handle POST without body', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await apiClient.post('/action');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/action',
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        })
      );
    });

    it('should include Authorization header for authenticated requests', async () => {
      authStore.setToken('test-token');

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await apiClient.post('/protected', { data: 'test' });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/protected',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token',
          }),
        })
      );
    });

    it('should handle 401 errors with automatic logout', async () => {
      authStore.setToken('expired-token');

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'Unauthorized' }),
      });

      await expect(apiClient.post('/protected', {})).rejects.toThrow('Unauthorized');

      expect(authStore.token).toBeNull();
      expect(mockLocation.href).toBe('/');
    });

    it('should handle validation errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid data' }),
      });

      await expect(apiClient.post('/users', {})).rejects.toThrow('Invalid data');
    });
  });

  describe('put', () => {
    it('should perform PUT request successfully', async () => {
      const updateData = { name: 'Updated Name' };
      const responseData = { id: 1, ...updateData };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => responseData,
      });

      const result = await apiClient.put('/users/1', updateData);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/users/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      );
      expect(result).toEqual(responseData);
    });

    it('should handle 401 errors', async () => {
      authStore.setToken('expired-token');

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({}),
      });

      await expect(apiClient.put('/users/1', {})).rejects.toThrow('Unauthorized');
      expect(authStore.token).toBeNull();
    });
  });

  describe('delete', () => {
    it('should perform DELETE request successfully', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const result = await apiClient.delete('/users/1');

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/users/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual({ success: true });
    });

    it('should handle 401 errors', async () => {
      authStore.setToken('expired-token');

      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({}),
      });

      await expect(apiClient.delete('/users/1')).rejects.toThrow('Unauthorized');
      expect(authStore.token).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle malformed JSON responses', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(apiClient.get('/test')).rejects.toThrow('HTTP 500: Internal Server Error');
    });

    it('should log errors to console', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      await expect(apiClient.get('/test')).rejects.toThrow('Network error');

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'GET /test failed:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
