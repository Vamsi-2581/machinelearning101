<template>
  <div class="text-highlighter" :class="{ 'loading': loading }">
    <!-- Error Display -->
    <div v-if="error" class="error-message" role="alert">
      <Icon name="material-symbols:error-outline" class="error-icon" />
      <span>{{ error }}</span>
    </div>
    
    <!-- Loading State -->
    <div v-else-if="loading" class="loading-state">
      <Icon name="svg-spinners:ring-resize" class="loading-icon" />
      <span>Processing text...</span>
    </div>
    
    <!-- Text Display with Highlighting -->
    <div v-else class="text-content">
      <!-- Legend -->
      <div v-if="showLegend" class="legend">
        <div class="legend-title">Token Types:</div>
        <div class="legend-items">
          <div 
            v-for="type in visibleTokenTypes" 
            :key="type"
            class="legend-item"
            :class="`token-${type}`"
          >
            <span class="legend-color"></span>
            <span class="legend-label">{{ formatTokenType(type) }}</span>
          </div>
        </div>
      </div>
      
      <!-- Highlighted Text -->
      <div 
        class="highlighted-text"
        :style="{ fontSize: `${fontSize}px` }"
        role="region"
        aria-label="Tokenized text with highlighting"
      >
        <span
          v-for="(token, index) in tokens"
          :key="index"
          :class="[
            'token',
            `token-${token.type}`,
            { 'token-hover': hoveredToken === index }
          ]"
          :title="getTokenTooltip(token)"
          @mouseenter="hoveredToken = index"
          @mouseleave="hoveredToken = null"
        >{{ token.text }}</span>
      </div>
      
      <!-- Statistics -->
      <div v-if="showStats && tokens.length > 0" class="stats">
        <div class="stat-item">
          <span class="stat-label">Total Tokens:</span>
          <span class="stat-value">{{ tokens.length }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Word Tokens:</span>
          <span class="stat-value">{{ wordTokenCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Unique Tokens:</span>
          <span class="stat-value">{{ uniqueTokenCount }}</span>
        </div>
        <div v-if="sentences.length > 0" class="stat-item">
          <span class="stat-label">Sentences:</span>
          <span class="stat-value">{{ sentences.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Token, Sentence } from '~/algorithms/nlp/Tokenizer';

/**
 * TextHighlighter Component
 * 
 * Displays tokenized text with color-coded highlighting for different token types.
 * Supports interactive hover states and displays token statistics.
 * 
 * Requirements: 3.3, 16.1, 16.2
 */

interface Props {
  tokens: Token[];
  sentences?: Sentence[];
  text?: string;
  showLegend?: boolean;
  showStats?: boolean;
  fontSize?: number;
  loading?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  sentences: () => [],
  text: '',
  showLegend: true,
  showStats: true,
  fontSize: 16,
  loading: false,
  error: null,
});

const hoveredToken = ref<number | null>(null);

/**
 * Get unique token types present in the data
 * Requirements: 3.3
 */
const visibleTokenTypes = computed(() => {
  const types = new Set(props.tokens.map(t => t.type));
  return Array.from(types).sort();
});

/**
 * Count word tokens
 * Requirements: 3.3
 */
const wordTokenCount = computed(() => {
  return props.tokens.filter(t => t.type === 'word' || t.type === 'number').length;
});

/**
 * Count unique tokens
 * Requirements: 3.3
 */
const uniqueTokenCount = computed(() => {
  const unique = new Set(
    props.tokens
      .filter(t => t.type === 'word' || t.type === 'number')
      .map(t => t.normalized || t.text)
  );
  return unique.size;
});

/**
 * Format token type for display
 * Requirements: 3.3
 */
const formatTokenType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Get tooltip text for a token
 * Requirements: 3.3, 16.1
 */
const getTokenTooltip = (token: Token): string => {
  const parts = [
    `Type: ${formatTokenType(token.type)}`,
    `Position: ${token.start}-${token.end}`
  ];
  
  if (token.normalized && token.normalized !== token.text) {
    parts.push(`Normalized: ${token.normalized}`);
  }
  
  return parts.join(' | ');
};
</script>

<style scoped>
.text-highlighter {
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

.text-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Legend Styles */
.legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.legend-title {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
}

.legend-color {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.legend-label {
  color: #6b7280;
}

/* Token Type Colors */
.token-word .legend-color,
.token.token-word {
  background-color: #dbeafe;
  color: #1e40af;
}

.token-stopword .legend-color,
.token.token-stopword {
  background-color: #fef3c7;
  color: #92400e;
}

.token-number .legend-color,
.token.token-number {
  background-color: #d1fae5;
  color: #065f46;
}

.token-punctuation .legend-color,
.token.token-punctuation {
  background-color: #e5e7eb;
  color: #4b5563;
}

.token-whitespace .legend-color {
  background-color: #f3f4f6;
}

/* Highlighted Text Styles */
.highlighted-text {
  padding: 1rem;
  line-height: 1.8;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fafafa;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.token {
  display: inline;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  cursor: default;
  position: relative;
}

.token-whitespace {
  background-color: transparent;
  padding: 0;
}

.token-hover {
  transform: scale(1.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.token:not(.token-whitespace):hover {
  filter: brightness(0.95);
}

/* Statistics Styles */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

/* Responsive Design - Requirements: 16.1, 16.2 */
@media (max-width: 768px) {
  .text-highlighter {
    padding: 0.75rem;
  }
  
  .legend {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .highlighted-text {
    font-size: 14px;
    padding: 0.75rem;
  }
  
  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .stat-value {
    font-size: 1rem;
  }
}

/* Accessibility - Requirements: 16.1 */
@media (prefers-reduced-motion: reduce) {
  .token {
    transition: none;
  }
  
  .token-hover {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .token {
    border: 1px solid currentColor;
  }
  
  .legend-color {
    border: 2px solid currentColor;
  }
}
</style>
