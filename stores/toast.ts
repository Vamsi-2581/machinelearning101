import { defineStore } from 'pinia';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  suggestions?: string[];
  duration?: number;
}

export interface ToastState {
  toasts: Toast[];
}

export const useToastStore = defineStore('toast', {
  state: (): ToastState => ({
    toasts: [],
  }),

  actions: {
    /**
     * Add a toast notification
     */
    addToast(toast: Omit<Toast, 'id'>): string {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const duration = toast.duration ?? (toast.type === 'error' ? 7000 : 5000);

      const newToast: Toast = {
        ...toast,
        id,
        duration,
      };

      this.toasts.push(newToast);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(id);
        }, duration);
      }

      return id;
    },

    /**
     * Remove a toast by ID
     */
    removeToast(id: string): void {
      const index = this.toasts.findIndex(t => t.id === id);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    },

    /**
     * Clear all toasts
     */
    clearAll(): void {
      this.toasts = [];
    },

    /**
     * Show success toast
     */
    success(message: string, title?: string): string {
      return this.addToast({ type: 'success', message, title });
    },

    /**
     * Show error toast
     */
    error(message: string, title?: string, suggestions?: string[]): string {
      return this.addToast({ type: 'error', message, title, suggestions });
    },

    /**
     * Show warning toast
     */
    warning(message: string, title?: string): string {
      return this.addToast({ type: 'warning', message, title });
    },

    /**
     * Show info toast
     */
    info(message: string, title?: string): string {
      return this.addToast({ type: 'info', message, title });
    },
  },
});
