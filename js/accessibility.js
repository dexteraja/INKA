// Accessibility Features Manager
// Enhances the website with screen reader support and other accessibility features

class AccessibilityManager {
  constructor() {
    // Initialize state from localStorage or default to false
    this.highContrastMode = localStorage.getItem('highContrastMode') === 'true';
    this.largeTextMode = localStorage.getItem('largeTextMode') === 'true';
    this.reducedMotionMode = localStorage.getItem('reducedMotionMode') === 'true' || 
                           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.screenReaderMode = localStorage.getItem('screenReaderMode') === 'true';
    
    // Check for prefers-reduced-motion and respond appropriately
    this.setupMediaQueryListeners();
    
    // Accessibility menu state
    this.menuOpen = false;
    
    // Create accessibility UI
    this.createAccessibilityMenu();
    
    // Apply current settings
    this.applyAccessibilitySettings();
  }
  
  // Setup listeners for media queries (e.g., prefers-reduced-motion)
  setupMediaQueryListeners() {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Update when user changes system preferences
    reducedMotionQuery.addEventListener('change', (e) => {
      this.reducedMotionMode = e.matches;
      localStorage.setItem('reducedMotionMode', this.reducedMotionMode);
      this.applyAccessibilitySettings();
    });
    
    // Handle dark mode toggle events for accessibility
    darkModeQuery.addEventListener('change', () => {
      // Re-apply high contrast if needed when color scheme changes
      if (this.highContrastMode) {
        this.applyHighContrast();
      }
    });
  }
  
  // Create the accessibility menu UI
  createAccessibilityMenu() {
    document.addEventListener('DOMContentLoaded', () => {
      // Create button and add to DOM
      const accessibilityButton = document.createElement('button');
      accessibilityButton.className = 'accessibility-button';
      accessibilityButton.setAttribute('aria-label', 'Open accessibility options');
      accessibilityButton.innerHTML = '<i class="bi bi-universal-access"></i>';
      
      // Create the menu
      const accessibilityMenu = document.createElement('div');
      accessibilityMenu.className = 'accessibility-menu';
      accessibilityMenu.setAttribute('role', 'dialog');
      accessibilityMenu.setAttribute('aria-labelledby', 'a11y-menu-title');
      accessibilityMenu.style.display = 'none';
      
      // Menu content
      accessibilityMenu.innerHTML = `
        <div class="a11y-menu-header">
          <h3 id="a11y-menu-title">Accessibility Options</h3>
          <button class="a11y-close-btn" aria-label="Close accessibility menu">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="a11y-menu-content">
          <div class="a11y-option">
            <input type="checkbox" id="high-contrast" ${this.highContrastMode ? 'checked' : ''}>
            <label for="high-contrast">High Contrast</label>
          </div>
          <div class="a11y-option">
            <input type="checkbox" id="large-text" ${this.largeTextMode ? 'checked' : ''}>
            <label for="large-text">Larger Text</label>
          </div>
          <div class="a11y-option">
            <input type="checkbox" id="reduced-motion" ${this.reducedMotionMode ? 'checked' : ''}>
            <label for="reduced-motion">Reduce Motion</label>
          </div>
          <div class="a11y-option">
            <input type="checkbox" id="screen-reader" ${this.screenReaderMode ? 'checked' : ''}>
            <label for="screen-reader">Screen Reader Optimized</label>
          </div>
          <div class="a11y-shortcuts">
            <h4>Keyboard Shortcuts</h4>
            <ul>
              <li><kbd>Alt</kbd> + <kbd>1</kbd>: Home page</li>
              <li><kbd>Alt</kbd> + <kbd>2</kbd>: Jobs listing</li>
              <li><kbd>Alt</kbd> + <kbd>3</kbd>: About us</li>
              <li><kbd>Alt</kbd> + <kbd>4</kbd>: Contact</li>
              <li><kbd>Alt</kbd> + <kbd>0</kbd>: Accessibility menu</li>
            </ul>
          </div>
        </div>
      `;
      
      // Create container for button and menu
      const accessibilityContainer = document.createElement('div');
      accessibilityContainer.className = 'accessibility-container';
      
      accessibilityContainer.appendChild(accessibilityButton);
      accessibilityContainer.appendChild(accessibilityMenu);
      document.body.appendChild(accessibilityContainer);
      
      // Event Listeners
      accessibilityButton.addEventListener('click', () => {
        this.toggleAccessibilityMenu();
      });
      
      const closeButton = accessibilityMenu.querySelector('.a11y-close-btn');
      closeButton.addEventListener('click', () => {
        this.toggleAccessibilityMenu();
      });
      
      // Option toggles
      accessibilityMenu.querySelector('#high-contrast').addEventListener('change', (e) => {
        this.highContrastMode = e.target.checked;
        localStorage.setItem('highContrastMode', this.highContrastMode);
        this.applyAccessibilitySettings();
      });
      
      accessibilityMenu.querySelector('#large-text').addEventListener('change', (e) => {
        this.largeTextMode = e.target.checked;
        localStorage.setItem('largeTextMode', this.largeTextMode);
        this.applyAccessibilitySettings();
      });
      
      accessibilityMenu.querySelector('#reduced-motion').addEventListener('change', (e) => {
        this.reducedMotionMode = e.target.checked;
        localStorage.setItem('reducedMotionMode', this.reducedMotionMode);
        this.applyAccessibilitySettings();
      });
      
      accessibilityMenu.querySelector('#screen-reader').addEventListener('change', (e) => {
        this.screenReaderMode = e.target.checked;
        localStorage.setItem('screenReaderMode', this.screenReaderMode);
        this.applyAccessibilitySettings();
      });
      
      // Setup keyboard shortcuts
      this.setupKeyboardShortcuts();
      
      // Apply styles
      this.applyMenuStyles();
    });
  }
  
  // Toggle accessibility menu visibility
  toggleAccessibilityMenu() {
    const menu = document.querySelector('.accessibility-menu');
    if (!menu) return;
    
    this.menuOpen = !this.menuOpen;
    menu.style.display = this.menuOpen ? 'block' : 'none';
    
    if (this.menuOpen) {
      // Announce opening for screen readers
      this.announceForScreenReader('Accessibility menu opened');
      
      // Trap focus within menu
      this.trapFocus(menu);
    } else {
      this.announceForScreenReader('Accessibility menu closed');
    }
  }
  
  // Apply all accessibility settings based on current state
  applyAccessibilitySettings() {
    if (this.highContrastMode) {
      this.applyHighContrast();
    } else {
      this.removeHighContrast();
    }
    
    if (this.largeTextMode) {
      this.applyLargeText();
    } else {
      this.removeLargeText();
    }
    
    if (this.reducedMotionMode) {
      this.applyReducedMotion();
    } else {
      this.removeReducedMotion();
    }
    
    if (this.screenReaderMode) {
      this.applyScreenReaderOptimizations();
    } else {
      this.removeScreenReaderOptimizations();
    }
  }
  
  // High contrast mode implementation
  applyHighContrast() {
    const style = document.createElement('style');
    style.id = 'high-contrast-styles';
    style.textContent = `
      :root {
        --primary: #FF3300 !important;
        --accent: #FFCC00 !important;
        --foreground: #000000 !important;
        --background: #FFFFFF !important;
        --card: #FFFFFF !important;
        --card-foreground: #000000 !important;
        --border: #000000 !important;
      }
      
      .dark:root {
        --primary: #FF6600 !important;
        --accent: #FFDD00 !important;
        --foreground: #FFFFFF !important;
        --background: #000000 !important;
        --card: #000000 !important;
        --card-foreground: #FFFFFF !important;
        --border: #FFFFFF !important;
      }
      
      body {
        background-color: var(--background) !important;
        color: var(--foreground) !important;
      }
      
      a, button, .btn {
        text-decoration: underline !important;
      }
      
      /* Increase contrast of focus indicators */
      a:focus, button:focus, input:focus, select:focus, textarea:focus {
        outline: 3px solid var(--primary) !important;
        outline-offset: 2px !important;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  removeHighContrast() {
    const style = document.getElementById('high-contrast-styles');
    if (style) {
      style.remove();
    }
  }
  
  // Large text mode implementation
  applyLargeText() {
    const style = document.createElement('style');
    style.id = 'large-text-styles';
    style.textContent = `
      html {
        font-size: 125% !important;
      }
      
      .btn, button {
        padding: 0.625rem 1.25rem !important;
      }
      
      h1 { font-size: 2.5rem !important; }
      h2 { font-size: 2rem !important; }
      h3 { font-size: 1.75rem !important; }
      p, li, input, select, textarea { font-size: 1.125rem !important; }
    `;
    
    document.head.appendChild(style);
  }
  
  removeLargeText() {
    const style = document.getElementById('large-text-styles');
    if (style) {
      style.remove();
    }
  }
  
  // Reduced motion implementation
  applyReducedMotion() {
    const style = document.createElement('style');
    style.id = 'reduced-motion-styles';
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
      
      .animate-bounce,
      .animate-pulse,
      .animate-spin,
      .animate-ping {
        animation: none !important;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  removeReducedMotion() {
    const style = document.getElementById('reduced-motion-styles');
    if (style) {
      style.remove();
    }
  }
  
  // Screen reader optimizations
  applyScreenReaderOptimizations() {
    // This mode adds additional hidden text for screen readers and simplifies UI
    const style = document.createElement('style');
    style.id = 'screen-reader-styles';
    
    // Create hidden elements with additional context
    this.addScreenReaderContext();
    
    // Apply styles that help with screen reader navigation
    style.textContent = `
      /* Ensure clear focus styles */
      *:focus {
        outline: 3px solid var(--primary) !important;
        outline-offset: 2px !important;
      }
      
      /* Improve skip links */
      .skip-link {
        display: block;
        background: var(--primary);
        color: white;
        padding: 0.5rem 1rem;
        position: absolute;
        top: -100px;
        left: 1rem;
        z-index: 10000;
        transition: top 0.3s;
      }
      
      .skip-link:focus {
        top: 1rem;
      }
      
      /* Ensure all interactive elements have proper focus/hover states */
      a:hover, button:hover, .btn:hover,
      a:focus, button:focus, .btn:focus {
        text-decoration: underline !important;
      }
    `;
    
    // Add the style to the document
    document.head.appendChild(style);
    
    // Add skip link if not present
    this.addSkipLinks();
  }
  
  removeScreenReaderOptimizations() {
    const style = document.getElementById('screen-reader-styles');
    if (style) {
      style.remove();
    }
    
    // Remove added context
    document.querySelectorAll('.sr-only-context').forEach(el => el.remove());
  }
  
  // Add extra context for screen readers
  addScreenReaderContext() {
    document.addEventListener('DOMContentLoaded', () => {
      // Add context to navigation
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        // Only add context if not already present
        if (!link.querySelector('.sr-only-context')) {
          const context = document.createElement('span');
          context.className = 'sr-only-context';
          context.setAttribute('aria-hidden', 'false');
          context.style.position = 'absolute';
          context.style.width = '1px';
          context.style.height = '1px';
          context.style.padding = '0';
          context.style.margin = '-1px';
          context.style.overflow = 'hidden';
          context.style.clip = 'rect(0, 0, 0, 0)';
          context.style.whiteSpace = 'nowrap';
          context.style.border = '0';
          context.textContent = ' - navigation link';
          link.appendChild(context);
        }
      });
      
      // Ensure all images have alt text
      const images = document.querySelectorAll('img:not([alt])');
      images.forEach(img => {
        // Try to infer a description from context
        let altText = 'Image';
        
        // If the image is in a job listing, provide more context
        if (img.closest('.job-card')) {
          altText = 'Job related image';
        } else if (img.closest('.hero-image')) {
          altText = 'Decorative hero image';
        }
        
        img.setAttribute('alt', altText);
      });
      
      // Ensure all buttons have accessible names
      const buttons = document.querySelectorAll('button:not([aria-label])');
      buttons.forEach(button => {
        if (!button.textContent.trim()) {
          const iconEl = button.querySelector('i.bi, svg');
          if (iconEl) {
            // Try to infer purpose from icon class
            const iconClass = iconEl.className;
            let buttonPurpose = 'Button';
            
            if (iconClass.includes('volume')) buttonPurpose = 'Toggle sound';
            else if (iconClass.includes('sun') || iconClass.includes('moon')) buttonPurpose = 'Toggle dark mode';
            else if (iconClass.includes('menu')) buttonPurpose = 'Toggle menu';
            
            button.setAttribute('aria-label', buttonPurpose);
          } else {
            button.setAttribute('aria-label', 'Button');
          }
        }
      });
    });
  }
  
  // Add skip links for keyboard navigation
  addSkipLinks() {
    document.addEventListener('DOMContentLoaded', () => {
      // Only add if not already present
      if (document.querySelector('.skip-link')) return;
      
      const skipLink = document.createElement('a');
      skipLink.className = 'skip-link';
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';
      
      // Add to DOM
      document.body.insertBefore(skipLink, document.body.firstChild);
      
      // Add an ID to the main content
      const main = document.querySelector('main');
      if (main && !main.id) {
        main.id = 'main-content';
        main.setAttribute('role', 'main');
        main.setAttribute('tabindex', '-1');
      }
    });
  }
  
  // Setup keyboard shortcuts for navigation
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Only respond to Alt + number combination
      if (e.altKey) {
        switch(e.key) {
          case '1': // Home
            e.preventDefault();
            window.location.href = '/';
            break;
          case '2': // Jobs
            e.preventDefault();
            window.location.href = '/jobs';
            break;
          case '3': // About
            e.preventDefault();
            window.location.href = '/about';
            break;
          case '4': // Contact
            e.preventDefault();
            window.location.href = '/contact';
            break;
          case '0': // Accessibility menu
            e.preventDefault();
            this.toggleAccessibilityMenu();
            break;
        }
      }
      
      // Escape key should close the accessibility menu if open
      if (e.key === 'Escape' && this.menuOpen) {
        this.toggleAccessibilityMenu();
      }
    });
  }
  
  // Focus trap for modal dialogs
  trapFocus(element) {
    // Get all focusable elements
    const focusableEls = element.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="checkbox"], select'
    );
    
    if (focusableEls.length === 0) return;
    
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];
    
    // Focus the first element
    firstFocusableEl.focus();
    
    // Handle tab key press
    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        // Shift + Tab
        if (e.shiftKey && document.activeElement === firstFocusableEl) {
          e.preventDefault();
          lastFocusableEl.focus();
        } 
        // Tab
        else if (!e.shiftKey && document.activeElement === lastFocusableEl) {
          e.preventDefault();
          firstFocusableEl.focus();
        }
      }
    });
  }
  
  // Announce for screen readers
  announceForScreenReader(message) {
    // Find or create the accessibility announcement element
    let announcementElement = document.getElementById('a11y-announcement');
    if (!announcementElement) {
      announcementElement = document.createElement('div');
      announcementElement.id = 'a11y-announcement';
      announcementElement.setAttribute('role', 'status');
      announcementElement.setAttribute('aria-live', 'polite');
      announcementElement.style.position = 'absolute';
      announcementElement.style.left = '-9999px';
      announcementElement.style.height = '1px';
      announcementElement.style.width = '1px';
      announcementElement.style.overflow = 'hidden';
      document.body.appendChild(announcementElement);
    }
    
    // Update the announcement text
    announcementElement.textContent = message;
  }
  
  // Apply CSS styles for the accessibility menu
  applyMenuStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .accessibility-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1001;
      }
      
      .accessibility-button {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: var(--primary, #FF5733);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        transition: all 0.2s ease;
      }
      
      .accessibility-button:hover {
        transform: scale(1.1);
      }
      
      .accessibility-menu {
        position: absolute;
        top: 55px;
        right: 0;
        width: 280px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        padding: 1rem;
        z-index: 1002;
      }
      
      .dark .accessibility-menu {
        background: #1e1e1e;
        color: white;
      }
      
      .a11y-menu-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      
      .dark .a11y-menu-header {
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .a11y-menu-header h3 {
        margin: 0;
        font-size: 1.125rem;
      }
      
      .a11y-close-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
      
      .a11y-close-btn:hover {
        background: rgba(0, 0, 0, 0.05);
      }
      
      .dark .a11y-close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      .a11y-option {
        display: flex;
        align-items: center;
        margin-bottom: 0.75rem;
      }
      
      .a11y-option input[type="checkbox"] {
        margin-right: 0.75rem;
        width: 18px;
        height: 18px;
      }
      
      .a11y-shortcuts {
        margin-top: 1.5rem;
        padding-top: 0.75rem;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      }
      
      .dark .a11y-shortcuts {
        border-color: rgba(255, 255, 255, 0.1);
      }
      
      .a11y-shortcuts h4 {
        font-size: 1rem;
        margin: 0 0 0.75rem 0;
      }
      
      .a11y-shortcuts ul {
        padding-left: 1.25rem;
        margin: 0;
      }
      
      .a11y-shortcuts li {
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
      }
      
      kbd {
        background: #eee;
        border-radius: 3px;
        border: 1px solid #b4b4b4;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        color: #333;
        display: inline-block;
        font-size: 0.85em;
        font-weight: 700;
        line-height: 1;
        padding: 0.2em 0.4em;
        white-space: nowrap;
      }
      
      .dark kbd {
        background: #333;
        border-color: #666;
        color: #eee;
      }
      
      /* Responsive adjustments */
      @media (max-width: 768px) {
        .accessibility-container {
          top: 10px;
          right: 10px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize and export accessibility manager
const accessibilityManager = new AccessibilityManager();

// Make it available globally
window.accessibilityManager = accessibilityManager;