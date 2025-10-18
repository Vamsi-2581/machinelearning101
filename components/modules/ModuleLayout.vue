<template>
  <div class="module-layout">
    <!-- Skip to content link for accessibility -->
    <a href="#main-content" class="skip-link">
      Skip to main content
    </a>

    <!-- Module Header -->
    <header class="module-header">
      <div class="container">
        <!-- Breadcrumbs -->
        <div class="breadcrumb-wrapper">
          <Breadcrumb :items="breadcrumbs" />
        </div>
        
        <div class="header-content">
          <div>
            <h1 class="module-title">{{ title }}</h1>
            <p v-if="description" class="module-description">{{ description }}</p>
          </div>
          <div class="header-actions">
            <div class="module-meta">
              <span class="difficulty-badge" :class="`difficulty-${difficulty}`">
                {{ difficulty }}
              </span>
              <span v-if="estimatedTime" class="time-badge">
                {{ estimatedTime }} min
              </span>
            </div>
            <!-- Bookmark button slot -->
            <slot name="bookmark-button" />
          </div>
        </div>
      </div>
    </header>

    <!-- Section Navigation -->
    <nav class="section-nav" aria-label="Module sections">
      <div class="container">
        <ul class="nav-list">
          <li>
            <button
              @click="scrollToSection('content')"
              :class="{ active: activeSection === 'content' }"
              class="nav-button"
            >
              Content
            </button>
          </li>
          <li>
            <button
              @click="scrollToSection('interactive')"
              :class="{ active: activeSection === 'interactive' }"
              class="nav-button"
            >
              Interactive
            </button>
          </li>
          <li>
            <button
              @click="scrollToSection('quiz')"
              :class="{ active: activeSection === 'quiz' }"
              class="nav-button"
            >
              Quiz
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <main id="main-content" class="module-main">
      <div class="container">
        <!-- Content Section -->
        <section
          id="content-section"
          ref="contentSection"
          class="module-section"
        >
          <slot name="content" />
        </section>

        <!-- Interactive Section -->
        <section
          id="interactive-section"
          ref="interactiveSection"
          class="module-section"
        >
          <slot name="interactive" />
        </section>

        <!-- Quiz Section -->
        <section
          id="quiz-section"
          ref="quizSection"
          class="module-section"
        >
          <slot name="quiz" />
        </section>

        <!-- Module Navigation -->
        <ModuleNavigation
          :previous-module="previousModule"
          :next-module="nextModule"
          :suggested-module="suggestedModule"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';
import { useKeyboardShortcuts } from '../../composables/useKeyboardShortcuts';
import Breadcrumb from '~/components/shared/Breadcrumb.vue';
import ModuleNavigation from '~/components/modules/ModuleNavigation.vue';
import type { ModuleNavItem } from '~/types/module';

interface Props {
  title: string;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number;
  moduleId?: string;
  previousModule?: ModuleNavItem | null;
  nextModule?: ModuleNavItem | null;
  suggestedModule?: ModuleNavItem | null;
}

const props = withDefaults(defineProps<Props>(), {
  difficulty: 'beginner',
});

const router = useRouter();
const { breadcrumbs } = useBreadcrumbs();

const contentSection = ref<HTMLElement>();
const interactiveSection = ref<HTMLElement>();
const quizSection = ref<HTMLElement>();
const activeSection = ref<'content' | 'interactive' | 'quiz'>('content');

// Module-specific keyboard shortcuts
// Requirements: 1.4 - Keyboard navigation support
useKeyboardShortcuts([
  {
    key: '1',
    description: 'Jump to content section',
    handler: () => scrollToSection('content'),
  },
  {
    key: '2',
    description: 'Jump to interactive section',
    handler: () => scrollToSection('interactive'),
  },
  {
    key: '3',
    description: 'Jump to quiz section',
    handler: () => scrollToSection('quiz'),
  },
  {
    key: 'n',
    description: 'Go to next module',
    handler: () => {
      if (props.nextModule) {
        router.push(props.nextModule.path);
      }
    },
    preventDefault: false,
  },
  {
    key: 'p',
    description: 'Go to previous module',
    handler: () => {
      if (props.previousModule) {
        router.push(props.previousModule.path);
      }
    },
    preventDefault: false,
  },
]);

/**
 * Scroll to a specific section with smooth behavior
 */
const scrollToSection = (section: 'content' | 'interactive' | 'quiz') => {
  let element: HTMLElement | undefined;
  
  switch (section) {
    case 'content':
      element = contentSection.value;
      break;
    case 'interactive':
      element = interactiveSection.value;
      break;
    case 'quiz':
      element = quizSection.value;
      break;
  }

  if (element) {
    const offset = 100; // Account for fixed header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    activeSection.value = section;
  }
};

/**
 * Update active section based on scroll position
 */
const updateActiveSection = () => {
  const scrollPosition = window.scrollY + 150;

  const sections = [
    { name: 'content' as const, element: contentSection.value },
    { name: 'interactive' as const, element: interactiveSection.value },
    { name: 'quiz' as const, element: quizSection.value },
  ];

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    if (section.element && section.element.offsetTop <= scrollPosition) {
      activeSection.value = section.name;
      break;
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveSection);
});
</script>

<style scoped>
.module-layout {
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Skip link for accessibility */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 0 0 4px 0;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

/* Module Header */
.module-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 2rem 0;
}

.breadcrumb-wrapper {
  margin-bottom: 1rem;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.module-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.module-description {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.header-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-end;
  flex-shrink: 0;
}

.module-meta {
  display: flex;
  gap: 0.5rem;
}

.difficulty-badge,
.time-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.difficulty-beginner {
  background-color: #d1fae5;
  color: #065f46;
}

.difficulty-intermediate {
  background-color: #fef3c7;
  color: #92400e;
}

.difficulty-advanced {
  background-color: #fee2e2;
  color: #991b1b;
}

.time-badge {
  background-color: #e0e7ff;
  color: #3730a3;
}

/* Section Navigation */
.section-nav {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-list {
  display: flex;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-button {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-button:hover {
  color: #111827;
  background-color: #f9fafb;
}

.nav-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.nav-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

/* Main Content */
.module-main {
  padding: 2rem 0;
}

.module-section {
  margin-bottom: 3rem;
  scroll-margin-top: 100px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .module-title {
    font-size: 1.5rem;
  }

  .module-meta {
    width: 100%;
    justify-content: flex-start;
  }

  .nav-list {
    justify-content: space-around;
  }

  .nav-button {
    padding: 0.75rem 1rem;
    font-size: 0.8125rem;
  }

  .module-main {
    padding: 1rem 0;
  }

  .module-section {
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .module-header {
    padding: 1rem 0;
  }

  .module-title {
    font-size: 1.25rem;
  }

  .module-description {
    font-size: 0.875rem;
  }

  .nav-button {
    padding: 0.75rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
