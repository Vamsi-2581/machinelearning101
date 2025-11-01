<template>
  <div class="sequence-display" :class="{ 'loading': loading }">
    <!-- Error Display -->
    <div v-if="error" class="error-message" role="alert">
      <Icon name="material-symbols:error-outline" class="error-icon" />
      <span>{{ error }}</span>
    </div>
    
    <!-- Loading State -->
    <div v-else-if="loading" class="loading-state">
      <Icon name="svg-spinners:ring-resize" class="loading-icon" />
      <span>Generating text...</span>
    </div>
    
    <!-- Sequence Display -->
    <div v-else class="sequence-content">
      <!-- Generated Text Display -->
      <div class="generated-text-section">
        <div class="section-header">
          <h3 class="section-title">Generated Text</h3>
          <div v-if="generatedText" class="text-stats">
            <span class="stat">{{ generatedText.text.length }} characters</span>
            <span class="stat">{{ generatedText.steps.length }} steps</span>
          </div>
        </div>
        
        <div 
          v-if="generatedText"
          class="generated-text"
          :style="{ fontSize: `${fontSize}px` }"
          role="region"
          aria-label="Generated text output"
        >
          <span class="seed-text">{{ generatedText.seed }}</span><span 
            v-for="(step, index) in generatedText.steps"
            :key="index"
            :class="[
              'generated-char',
              { 'char-hover': hoveredStep === index }
            ]"
            :title="`Step ${step.step}: ${getCharDisplay(step.character)} (${(step.probabilities[step.character] * 100).toFixed(1)}%)`"
            @mouseenter="hoveredStep = index"
            @mouseleave="hoveredStep = null"
            @click="selectStep(index)"
          >{{ step.character }}</span>
        </div>
      </div>
      
      <!-- Step-by-Step Visualization -->
      <div v-if="selectedStep !== null && generatedText" class="step-details">
        <div class="section-header">
          <h3 class="section-title">Step {{ generatedText.steps[selectedStep].step }} Details</h3>
          <div class="step-navigation">
            <button
              class="nav-button"
              :disabled="selectedStep === 0"
              @click="selectStep(selectedStep - 1)"
              aria-label="Previous step"
            >
              <Icon name="material-symbols:chevron-left" />
            </button>
            <span class="step-indicator">
              {{ selectedStep + 1 }} / {{ generatedText.steps.length }}
            </span>
            <button
              class="nav-button"
              :disabled="selectedStep === generatedText.steps.length - 1"
              @click="selectStep(selectedStep + 1)"
              aria-label="Next step"
            >
              <Icon name="material-symbols:chevron-right" />
            </button>
          </div>
        </div>
        
        <div class="step-content">
          <!-- Context -->
          <div class="context-section">
            <div class="context-label">Context:</div>
            <div class="context-text">{{ generatedText.steps[selectedStep].context }}</div>
          </div>
          
          <!-- Selected Character -->
          <div class="selected-char-section">
            <div class="selected-char-label">Generated Character:</div>
            <div class="selected-char">
              {{ getCharDisplay(generatedText.steps[selectedStep].character) }}
            </div>
            <div class="selected-char-prob">
              Probability: {{ (generatedText.steps[selectedStep].probabilities[generatedText.steps[selectedStep].character] * 100).toFixed(2) }}%
            </div>
          </div>
          
          <!-- Top Predictions -->
          <div class="predictions-section">
            <div class="predictions-label">Top Predictions:</div>
            <div class="predictions-list">
              <div
                v-for="(pred, index) in generatedText.steps[selectedStep].topPredictions"
                :key="index"
                class="prediction-item"
                :class="{ 'selected-prediction': pred.char === generatedText.steps[selectedStep].character }"
              >
                <div class="prediction-rank">{{ index + 1 }}</div>
                <div class="prediction-char">{{ getCharDisplay(pred.char) }}</div>
                <div class="prediction-bar-container">
                  <div 
                    class="prediction-bar"
                    :style="{ width: `${pred.prob * 100}%` }"
                  ></div>
                </div>
                <div class="prediction-prob">{{ (pred.prob * 100).toFixed(1) }}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Animation Controls -->
      <div v-if="generatedText && generatedText.steps.length > 0" class="animation-controls">
        <button
          class="control-button"
          @click="toggleAnimation"
          :aria-label="isAnimating ? 'Pause animation' : 'Play animation'"
        >
          <Icon :name="isAnimating ? 'material-symbols:pause' : 'material-symbols:play-arrow'" />
          {{ isAnimating ? 'Pause' : 'Play' }}
        </button>
        <div class="speed-control">
          <label for="animation-speed">Speed:</label>
          <input
            id="animation-speed"
            type="range"
            min="100"
            max="2000"
            step="100"
            v-model.number="animationSpeed"
            class="speed-slider"
          />
          <span class="speed-value">{{ animationSpeed }}ms</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import type { GeneratedText } from '~/algorithms/nlp/TextGeneration';

/**
 * SequenceDisplay Component
 * 
 * Displays text generation process step-by-step with character probabilities
 * and context. Supports interactive exploration and animation of generation.
 * 
 * Requirements: 3.3, 16.1, 16.2
 */

interface Props {
  generatedText: GeneratedText | null;
  fontSize?: number;
  loading?: boolean;
  error?: string | null;
  autoPlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fontSize: 16,
  loading: false,
  error: null,
  autoPlay: false,
});

const hoveredStep = ref<number | null>(null);
const selectedStep = ref<number | null>(null);
const isAnimating = ref(false);
const animationSpeed = ref(500);
let animationInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Select a specific step to view details
 * Requirements: 3.3, 16.1
 */
const selectStep = (index: number) => {
  if (props.generatedText && index >= 0 && index < props.generatedText.steps.length) {
    selectedStep.value = index;
  }
};

/**
 * Get display representation of character
 * Requirements: 3.3
 */
const getCharDisplay = (char: string): string => {
  if (char === '\n') return '\\n';
  if (char === '\t') return '\\t';
  if (char === ' ') return '␣';
  return char;
};

/**
 * Toggle animation playback
 * Requirements: 3.3, 16.1
 */
const toggleAnimation = () => {
  if (isAnimating.value) {
    stopAnimation();
  } else {
    startAnimation();
  }
};

/**
 * Start animation
 * Requirements: 3.3
 */
const startAnimation = () => {
  if (!props.generatedText || props.generatedText.steps.length === 0) return;
  
  isAnimating.value = true;
  
  // Start from beginning if at end
  if (selectedStep.value === null || selectedStep.value >= props.generatedText.steps.length - 1) {
    selectedStep.value = 0;
  }
  
  animationInterval = setInterval(() => {
    if (selectedStep.value === null || !props.generatedText) {
      stopAnimation();
      return;
    }
    
    if (selectedStep.value < props.generatedText.steps.length - 1) {
      selectedStep.value++;
    } else {
      stopAnimation();
    }
  }, animationSpeed.value);
};

/**
 * Stop animation
 * Requirements: 3.3
 */
const stopAnimation = () => {
  isAnimating.value = false;
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
};

/**
 * Watch for generated text changes
 * Requirements: 3.3
 */
watch(() => props.generatedText, (newText) => {
  if (newText && newText.steps.length > 0) {
    selectedStep.value = 0;
    if (props.autoPlay) {
      startAnimation();
    }
  } else {
    selectedStep.value = null;
    stopAnimation();
  }
});

/**
 * Watch for animation speed changes
 * Requirements: 3.3
 */
watch(animationSpeed, () => {
  if (isAnimating.value) {
    stopAnimation();
    startAnimation();
  }
});

/**
 * Cleanup on unmount
 */
onUnmounted(() => {
  stopAnimation();
});
</script>

<style scoped>
.sequence-display {
  width: 100%;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 0.375rem;
  color: #c33;
}

.error-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  color: #666;
}

.loading-icon {
  font-size: 1.5rem;
}

.sequence-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Section Headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.text-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.stat {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 0.25rem;
}

/* Generated Text Section */
.generated-text-section {
  background: #fafafa;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.generated-text {
  font-family: 'Courier New', monospace;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 1rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.seed-text {
  color: #6b7280;
  font-weight: 600;
}

.generated-char {
  display: inline;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.generated-char:hover,
.char-hover {
  background-color: #dbeafe;
  color: #1e40af;
  transform: scale(1.1);
}

/* Step Details */
.step-details {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.step-navigation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.25rem;
  color: #374151;
}

.nav-button:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.step-indicator {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  min-width: 4rem;
  text-align: center;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

/* Context Section */
.context-section {
  padding: 1rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.context-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.context-text {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #374151;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 0.25rem;
}

/* Selected Character Section */
.selected-char-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background: white;
  border-radius: 0.375rem;
  border: 2px solid #3b82f6;
}

.selected-char-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.selected-char {
  font-family: 'Courier New', monospace;
  font-size: 3rem;
  font-weight: 700;
  color: #1e40af;
  padding: 0.5rem 1rem;
  background: #dbeafe;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.selected-char-prob {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Predictions Section */
.predictions-section {
  padding: 1rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.predictions-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.predictions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.prediction-item {
  display: grid;
  grid-template-columns: 2rem 3rem 1fr 4rem;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.prediction-item:hover {
  background: #f3f4f6;
}

.selected-prediction {
  background: #dbeafe;
  border-color: #3b82f6;
}

.prediction-rank {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-align: center;
}

.prediction-char {
  font-family: 'Courier New', monospace;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  text-align: center;
}

.prediction-bar-container {
  position: relative;
  height: 1.5rem;
  background: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}

.prediction-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transition: width 0.3s ease;
}

.prediction-prob {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-align: right;
}

/* Animation Controls */
.animation-controls {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.control-button:hover {
  background: #2563eb;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.speed-control label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.speed-slider {
  flex: 1;
  height: 0.5rem;
  border-radius: 0.25rem;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.speed-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.speed-slider::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}

.speed-value {
  font-size: 0.875rem;
  color: #6b7280;
  min-width: 4rem;
  text-align: right;
}

/* Responsive Design - Requirements: 16.1, 16.2 */
@media (max-width: 768px) {
  .sequence-display {
    padding: 0.75rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .generated-text {
    font-size: 14px;
    padding: 0.75rem;
  }
  
  .selected-char {
    font-size: 2rem;
  }
  
  .prediction-item {
    grid-template-columns: 2rem 2.5rem 1fr 3.5rem;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .animation-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .speed-control {
    width: 100%;
  }
}

/* Accessibility - Requirements: 16.1 */
@media (prefers-reduced-motion: reduce) {
  .generated-char,
  .prediction-bar,
  .nav-button,
  .control-button {
    transition: none;
  }
  
  .char-hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .generated-char {
    border: 1px solid currentColor;
  }
  
  .prediction-item {
    border: 2px solid currentColor;
  }
}
</style>
