<template>
  <div class="module-layout">

    <!-- Module Header (Sticky) -->
    <header class="module-header" :class="{ 'is-sticky': isHeaderSticky }">
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

        <!-- Tab Navigation (inside sticky header) -->
        <nav class="section-nav" aria-label="Module sections">
          <ul class="nav-list">
            <li>
              <button @click="activeTab = 'content'" :class="{ active: activeTab === 'content' }" class="nav-button"
                type="button">
                Content
              </button>
            </li>
            <li>
              <button @click="activeTab = 'interactive'" :class="{ active: activeTab === 'interactive' }"
                class="nav-button" type="button">
                Interactive
              </button>
            </li>
            <li>
              <button @click="activeTab = 'quiz'" :class="{ active: activeTab === 'quiz' }" class="nav-button"
                type="button">
                Quiz
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main-content" class="module-main">
      <div class="container">
        <div class="content-wrapper">
          <!-- Table of Contents Sidebar (only for content tab) -->
          <aside v-if="activeTab === 'content' && tableOfContents && tableOfContents.length > 0" class="toc-sidebar">
            <div class="toc-sticky">
              <h3 class="toc-title">On this page</h3>
              <nav class="toc-nav" aria-label="Table of contents">
                <ul class="toc-list">
                  <li v-for="link in tableOfContents" :key="link.id" :class="['toc-item', `toc-depth-${link.depth}`]">
                    <a :href="`#${link.id}`" :class="{ active: activeTocId === link.id }" class="toc-link"
                      @click.prevent="scrollToHeading(link.id)">
                      {{ link.text }}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          <!-- Tab Content -->
          <div class="tab-content">
            <!-- Content Tab -->
            <div v-show="activeTab === 'content'" class="tab-panel" role="tabpanel">
              <slot name="content" />
            </div>

            <!-- Interactive Tab -->
            <div v-show="activeTab === 'interactive'" class="tab-panel" role="tabpanel">
              <slot name="interactive" />
            </div>

            <!-- Quiz Tab -->
            <div v-show="activeTab === 'quiz'" class="tab-panel" role="tabpanel">
              <slot name="quiz" />
            </div>
          </div>
        </div>

        <!-- Module Navigation -->
        <ModuleNavigation />
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useBreadcrumbs } from '~/composables/useBreadcrumbs';
import { useKeyboardShortcuts } from '../../composables/useKeyboardShortcuts';
import { useModuleNavigation } from '~/composables/useModuleNavigation';
import Breadcrumb from '~/components/shared/Breadcrumb.vue';
import ModuleNavigation from '~/components/modules/ModuleNavigation.vue';
import Footer from '../layout/Footer.vue';

interface TocLink {
  id: string;
  text: string;
  depth: number;
}

interface Props {
  title: string;
  description?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number;
  moduleId?: string;
  tableOfContents?: TocLink[];
}

const props = withDefaults(defineProps<Props>(), {
  difficulty: 'beginner',
  tableOfContents: () => [],
});

const router = useRouter();
const { breadcrumbs } = useBreadcrumbs();

// Get navigation from global composable
const { previousModule, nextModule, loadNavigation } = useModuleNavigation();

const activeTab = ref<'content' | 'interactive' | 'quiz'>('content');
const isHeaderSticky = ref(false);
const activeTocId = ref<string>('');

// Module-specific keyboard shortcuts
// Requirements: 1.4 - Keyboard navigation support
useKeyboardShortcuts([
  {
    key: '1',
    description: 'Jump to content tab',
    handler: () => { activeTab.value = 'content'; },
  },
  {
    key: '2',
    description: 'Jump to interactive tab',
    handler: () => { activeTab.value = 'interactive'; },
  },
  {
    key: '3',
    description: 'Jump to quiz tab',
    handler: () => { activeTab.value = 'quiz'; },
  },
  {
    key: 'n',
    description: 'Go to next module',
    handler: () => {
      if (nextModule.value) {
        router.push(nextModule.value.path);
      }
    },
    preventDefault: false,
  },
  {
    key: 'p',
    description: 'Go to previous module',
    handler: () => {
      if (previousModule.value) {
        router.push(previousModule.value.path);
      }
    },
    preventDefault: false,
  },
]);

/**
 * Scroll to a heading in the content
 */
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 120; // Account for sticky header
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    activeTocId.value = id;
  }
};

/**
 * Update active TOC item based on scroll position
 */
const updateActiveToc = () => {
  if (activeTab.value !== 'content' || !props.tableOfContents || props.tableOfContents.length === 0) {
    return;
  }

  const scrollPosition = window.scrollY + 150;

  // Find the current heading
  for (let i = props.tableOfContents.length - 1; i >= 0; i--) {
    const link = props.tableOfContents[i];
    const element = document.getElementById(link.id);

    if (element && element.offsetTop <= scrollPosition) {
      activeTocId.value = link.id;
      break;
    }
  }
};

/**
 * Update sticky header state based on scroll position
 */
const updateStickyHeader = () => {
  isHeaderSticky.value = window.scrollY > 50;
};

/**
 * Handle scroll events
 */
const handleScroll = () => {
  updateStickyHeader();
  updateActiveToc();
};

// Reset scroll position when switching tabs
watch(activeTab, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
  
  // Load navigation data
  await loadNavigation();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.module-layout {
  min-height: 100vh;
  background-color: #f9fafb;
  position: relative;
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

/* Module Header - Sticky */
.module-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 2rem 0 0 0;
  position: sticky;
  top: 0;
  z-index: 5;
  transition: box-shadow 0.2s, padding 0.2s;
}

.module-header.is-sticky {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem 0 0 0;
}

.module-header.is-sticky .module-title {
  font-size: 1.5rem;
}

.module-header.is-sticky .module-description {
  display: none;
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
  margin-bottom: 1rem;
}

.module-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
  transition: font-size 0.2s;
}

.module-description {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
  transition: opacity 0.2s;
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

/* Tab Navigation */
.section-nav {
  border-top: 1px solid #e5e7eb;
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
  background-color: #f9fafb;
}

.nav-button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

/* Main Content */
.module-main {
  padding: 2rem 0;
}

.content-wrapper {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* Table of Contents Sidebar */
.toc-sidebar {
  width: 240px;
  flex-shrink: 0;
  align-self: flex-start;
  position: sticky !important;
  top: 120px !important;
  height: fit-content;
}

.toc-sticky {
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.toc-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.toc-nav {
  font-size: 0.875rem;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-item {
  margin: 0;
}

.toc-link {
  display: block;
  padding: 0.375rem 0;
  color: #6b7280;
  text-decoration: none;
  transition: color 0.2s;
  line-height: 1.4;
}

.toc-link:hover {
  color: #111827;
}

.toc-link.active {
  color: #3b82f6;
  font-weight: 500;
}

.toc-depth-2 {
  padding-left: 0;
}

.toc-depth-3 {
  padding-left: 1rem;
}

.toc-depth-4 {
  padding-left: 2rem;
}

/* Tab Content */
.tab-content {
  flex: 1;
  min-width: 0;
}

.tab-panel {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .toc-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .module-title {
    font-size: 1.5rem;
  }

  .module-header.is-sticky .module-title {
    font-size: 1.25rem;
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
}

@media (max-width: 480px) {
  .module-header {
    padding: 1rem 0 0 0;
  }

  .module-header.is-sticky {
    padding: 0.5rem 0 0 0;
  }

  .module-title {
    font-size: 1.25rem;
  }

  .module-header.is-sticky .module-title {
    font-size: 1.125rem;
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
