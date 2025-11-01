/**
 * Worker manager for easy interaction with algorithm Web Workers
 */

import type { WorkerMessage, WorkerResponse, WorkerMessageType } from '~/service-workers/algorithm-worker';

/**
 * Callback for progress updates
 */
export type ProgressCallback = (progress: number) => void;

/**
 * Worker manager class
 */
export class WorkerManager {
  private worker: Worker | null = null;
  private messageId = 0;
  private pendingRequests = new Map<string, {
    resolve: (data: any) => void;
    reject: (error: Error) => void;
    onProgress?: ProgressCallback;
  }>();
  
  /**
   * Initialize the worker
   */
  init(): void {
    if (this.worker) {
      return;
    }
    
    try {
      this.worker = new Worker(
        new URL('../service-workers/algorithm-worker.ts', import.meta.url),
        { type: 'module' }
      );
      
      this.worker.onmessage = this.handleMessage.bind(this);
      this.worker.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('Failed to initialize worker:', error);
      throw new Error('Web Workers not supported in this browser');
    }
  }
  
  /**
   * Send a message to the worker
   */
  private async sendMessage(
    type: WorkerMessageType,
    algorithm: string,
    data: { X: number[][]; y?: number[]; params?: Record<string, any> },
    onProgress?: ProgressCallback
  ): Promise<any> {
    if (!this.worker) {
      this.init();
    }
    
    const id = `msg_${++this.messageId}`;
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject, onProgress });
      
      const message: WorkerMessage = {
        type,
        id,
        algorithm,
        data
      };
      
      this.worker!.postMessage(message);
    });
  }
  
  /**
   * Handle messages from worker
   */
  private handleMessage(event: MessageEvent<WorkerResponse>): void {
    const { type, id, data, progress, error } = event.data;
    
    const request = this.pendingRequests.get(id);
    if (!request) {
      console.warn('Received message for unknown request:', id);
      return;
    }
    
    switch (type) {
      case 'progress':
        if (request.onProgress && progress !== undefined) {
          request.onProgress(progress);
        }
        break;
        
      case 'complete':
        this.pendingRequests.delete(id);
        request.resolve(data);
        break;
        
      case 'error':
        this.pendingRequests.delete(id);
        request.reject(new Error(error || 'Unknown worker error'));
        break;
    }
  }
  
  /**
   * Handle worker errors
   */
  private handleError(error: ErrorEvent): void {
    console.error('Worker error:', error);
    
    // Reject all pending requests
    for (const [id, request] of this.pendingRequests.entries()) {
      request.reject(new Error('Worker encountered an error'));
      this.pendingRequests.delete(id);
    }
  }
  
  /**
   * Train an algorithm
   */
  async train(
    algorithm: string,
    X: number[][],
    y?: number[],
    params?: Record<string, any>,
    onProgress?: ProgressCallback
  ): Promise<any> {
    return this.sendMessage('train', algorithm, { X, y, params }, onProgress);
  }
  
  /**
   * Make predictions
   */
  async predict(
    algorithm: string,
    X: number[][],
    params?: Record<string, any>
  ): Promise<any> {
    return this.sendMessage('predict', algorithm, { X, params });
  }
  
  /**
   * Run optimization
   */
  async optimize(
    algorithm: string,
    X: number[][],
    y?: number[],
    params?: Record<string, any>,
    onProgress?: ProgressCallback
  ): Promise<any> {
    return this.sendMessage('optimize', algorithm, { X, y, params }, onProgress);
  }
  
  /**
   * Transform data
   */
  async transform(
    algorithm: string,
    X: number[][],
    params?: Record<string, any>
  ): Promise<any> {
    return this.sendMessage('transform', algorithm, { X, params });
  }
  
  /**
   * Terminate the worker
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    // Reject all pending requests
    for (const [id, request] of this.pendingRequests.entries()) {
      request.reject(new Error('Worker terminated'));
      this.pendingRequests.delete(id);
    }
  }
}

/**
 * Singleton instance
 */
let workerManager: WorkerManager | null = null;

/**
 * Get or create worker manager instance
 */
export function useWorkerManager(): WorkerManager {
  if (!workerManager) {
    workerManager = new WorkerManager();
  }
  return workerManager;
}
