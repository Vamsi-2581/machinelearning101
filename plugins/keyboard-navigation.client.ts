/**
 * Global keyboard navigation plugin
 * Requirements: 1.4 - Keyboard navigation support
 */

export default defineNuxtPlugin((nuxtApp) => {
  // Add visible focus indicators globally
  const addFocusStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced focus indicators for keyboard navigation */
      *:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
        border-radius: 0.25rem;
      }

      /* Remove default focus outline for mouse users */
      *:focus:not(:focus-visible) {
        outline: none;
      }

      /* Ensure buttons have visible focus */
      button:focus-visible,
      a:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }

      /* Skip link styling */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: #3b82f6;
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 0 0 4px 0;
        z-index: 10000;
        font-weight: 500;
      }

      .skip-link:focus {
        top: 0;
      }
    `;
    document.head.appendChild(style);
  };

  // Add skip links to the page
  const addSkipLinks = () => {
    const skipLinksContainer = document.createElement('div');
    skipLinksContainer.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
    `;
    document.body.insertBefore(skipLinksContainer, document.body.firstChild);
  };

  // Initialize on client side
  if (process.client) {
    nuxtApp.hook('app:mounted', () => {
      addFocusStyles();
      addSkipLinks();

      // Add keyboard event listener for debugging (can be removed in production)
      if (process.dev) {
        document.addEventListener('keydown', (e) => {
          // Log keyboard events in dev mode for debugging
          if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ') {
            console.debug('Keyboard navigation:', {
              key: e.key,
              target: e.target,
              shiftKey: e.shiftKey,
            });
          }
        });
      }
    });
  }
});
