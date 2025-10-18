/**
 * Web Worker for running ML algorithms in background thread
 * Prevents UI blocking during heavy computations
 */

/**
 * Message types for worker communication
 */
export type WorkerMessageType = 'train' | 'predict' | 'optimize' | 'transform';

/**
 * Message sent to worker
 */
export interface WorkerMessage {
  type: WorkerMessageType;
  id: string;
  algorithm: string;
  data: {
    X: number[][];
    y?: number[];
    params?: Record<string, any>;
  };
}

/**
 * Response types from worker
 */
export type WorkerResponseType = 'progress' | 'complete' | 'error';

/**
 * Response sent from worker
 */
export interface WorkerResponse {
  type: WorkerResponseType;
  id: string;
  data?: any;
  progress?: number;
  error?: string;
}

/**
 * Worker message handler
 * This runs inside the Web Worker context
 */
self.onmessage = async (e: MessageEvent<WorkerMessage>) => {
  const { type, id, algorithm, data } = e.data;
  
  try {
    switch (type) {
      case 'train':
        await handleTrain(id, algorithm, data);
        break;
      case 'predict':
        await handlePredict(id, algorithm, data);
        break;
      case 'optimize':
        await handleOptimize(id, algorithm, data);
        break;
      case 'transform':
        await handleTransform(id, algorithm, data);
        break;
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    postMessage({
      type: 'error',
      id,
      error: errorMessage
    } as WorkerResponse);
  }
};

/**
 * Handle training request
 */
async function handleTrain(
  id: string,
  algorithm: string,
  data: { X: number[][]; y?: number[]; params?: Record<string, any> }
): Promise<void> {
  // Report initial progress
  postProgress(id, 0);
  
  // Simulate training with progress updates
  // In real implementation, this would call actual algorithm code
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    await new Promise(resolve => setTimeout(resolve, 100));
    postProgress(id, (i / steps) * 100);
  }
  
  // Send completion message
  postMessage({
    type: 'complete',
    id,
    data: {
      success: true,
      algorithm,
      results: {
        // Algorithm-specific results would go here
      }
    }
  } as WorkerResponse);
}

/**
 * Handle prediction request
 */
async function handlePredict(
  id: string,
  algorithm: string,
  data: { X: number[][]; params?: Record<string, any> }
): Promise<void> {
  // Simulate prediction
  await new Promise(resolve => setTimeout(resolve, 50));
  
  postMessage({
    type: 'complete',
    id,
    data: {
      predictions: []
    }
  } as WorkerResponse);
}

/**
 * Handle optimization request
 */
async function handleOptimize(
  id: string,
  algorithm: string,
  data: { X: number[][]; y?: number[]; params?: Record<string, any> }
): Promise<void> {
  postProgress(id, 0);
  
  // Simulate optimization with progress
  const iterations = 100;
  for (let i = 0; i <= iterations; i += 10) {
    await new Promise(resolve => setTimeout(resolve, 50));
    postProgress(id, (i / iterations) * 100);
  }
  
  postMessage({
    type: 'complete',
    id,
    data: {
      optimized: true
    }
  } as WorkerResponse);
}

/**
 * Handle data transformation request
 */
async function handleTransform(
  id: string,
  algorithm: string,
  data: { X: number[][]; params?: Record<string, any> }
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  postMessage({
    type: 'complete',
    id,
    data: {
      transformed: data.X
    }
  } as WorkerResponse);
}

/**
 * Post progress update
 */
function postProgress(id: string, progress: number): void {
  postMessage({
    type: 'progress',
    id,
    progress
  } as WorkerResponse);
}
