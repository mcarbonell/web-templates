/*
 * MAIN JAVASCRIPT - SEED: 985968480
 * Navigation, Theme Toggle, Utilities
 * Digit 4 (9): Maximal animation personality
 */

// ============================================
// THEME TOGGLE - Persistent with localStorage
// ============================================
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.setupToggle();
    this.watchSystemPreference();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    localStorage.setItem('theme', theme);
    this.updateToggleIcon();
  }

  toggle() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  setupToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  }

  updateToggleIcon() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;

    const icon = this.theme === 'light' 
      ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>';
    
    toggleBtn.innerHTML = icon;
  }

  watchSystemPreference() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

// ============================================
// MOBILE NAVIGATION
// ============================================
class MobileNav {
  constructor() {
    this.toggle = document.querySelector('.navbar-toggle');
    this.menu = document.querySelector('.navbar-menu');
    this.init();
  }

  init() {
    if (!this.toggle || !this.menu) return;

    this.toggle.addEventListener('click', () => this.toggleMenu());
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar-container')) {
        this.closeMenu();
      }
    });

    // Close menu when clicking a link
    this.menu.querySelectorAll('.navbar-link').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });
  }

  toggleMenu() {
    this.toggle.classList.toggle('active');
    this.menu.classList.toggle('active');
  }

  closeMenu() {
    this.toggle.classList.remove('active');
    this.menu.classList.remove('active');
  }
}

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.navbar-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================
// SCROLL ANIMATIONS - Intersection Observer
// Digit 4 (9): Maximal animation
// ============================================
class ScrollAnimations {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    this.init();
  }

  init() {
    const elements = document.querySelectorAll('.card, .animate-on-scroll');
    elements.forEach(el => this.observer.observe(el));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// Initialize scroll animations with initial state
function initScrollAnimations() {
  const elements = document.querySelectorAll('.card, .animate-on-scroll');
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  });
  new ScrollAnimations();
}

// ============================================
// COOKIE CONSENT - GDPR Compliant
// ============================================
class CookieConsent {
  constructor() {
    this.consent = localStorage.getItem('cookieConsent');
    this.init();
  }

  init() {
    if (!this.consent) {
      this.show();
    }
  }

  show() {
    const consentHTML = `
      <div class="cookie-consent" id="cookieConsent">
        <h4 class="cookie-consent-title">🍪 We use cookies</h4>
        <p class="cookie-consent-text">
          We use cookies to enhance your browsing experience and analyze our traffic. 
          By clicking "Accept", you consent to our use of cookies.
        </p>
        <div class="cookie-consent-actions">
          <button class="btn btn-primary btn-sm" onclick="cookieConsent.accept()">Accept</button>
          <button class="btn btn-outline btn-sm" onclick="cookieConsent.decline()">Decline</button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', consentHTML);
    
    setTimeout(() => {
      document.getElementById('cookieConsent').classList.add('show');
    }, 1000);
  }

  accept() {
    localStorage.setItem('cookieConsent', 'accepted');
    this.hide();
  }

  decline() {
    localStorage.setItem('cookieConsent', 'declined');
    this.hide();
  }

  hide() {
    const element = document.getElementById('cookieConsent');
    if (element) {
      element.classList.remove('show');
      setTimeout(() => element.remove(), 300);
    }
  }
}

// ============================================
// MODAL MANAGER
// ============================================
class ModalManager {
  constructor() {
    this.modals = {};
    this.init();
  }

  init() {
    // Setup modal triggers
    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-trigger');
        this.open(modalId);
      });
    });

    // Setup close buttons
    document.querySelectorAll('.modal-close, .modal-backdrop').forEach(closer => {
      closer.addEventListener('click', (e) => {
        if (e.target === closer) {
          this.closeAll();
        }
      });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAll();
      }
    });
  }

  open(modalId) {
    const backdrop = document.getElementById(modalId);
    if (backdrop) {
      backdrop.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  closeAll() {
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.classList.remove('show');
    });
    document.body.style.overflow = '';
  }
}

// ============================================
// NEWSLETTER MODAL - Exit Intent & Scroll
// ============================================
class NewsletterModal {
  constructor() {
    this.shown = sessionStorage.getItem('newsletterShown');
    this.modalId = 'newsletterModal';
    this.init();
  }

  init() {
    if (this.shown) return;

    // Show on exit intent
    document.addEventListener('mouseout', (e) => {
      if (e.clientY < 0 && !this.shown) {
        this.show();
      }
    });

    // Show on scroll (80% of page)
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
      if (scrollTriggered || this.shown) return;
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 80) {
        scrollTriggered = true;
        setTimeout(() => this.show(), 1000);
      }
    });
  }

  show() {
    const modal = document.getElementById(this.modalId);
    if (modal) {
      modal.classList.add('show');
      sessionStorage.setItem('newsletterShown', 'true');
      this.shown = true;
    }
  }
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ============================================
// FORM VALIDATION
// ============================================
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    this.form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    let isValid = true;
    this.form.querySelectorAll('input, textarea').forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      this.submitForm();
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let message = '';

    // Required check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Please enter a valid email';
      }
    }

    // Min length
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < minLength) {
      isValid = false;
      message = `Minimum ${minLength} characters required`;
    }

    this.showFieldError(field, isValid, message);
    return isValid;
  }

  showFieldError(field, isValid, message) {
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }

    if (!isValid) {
      field.style.borderColor = '#EF4444';
      const error = document.createElement('div');
      error.className = 'field-error';
      error.style.color = '#EF4444';
      error.style.fontSize = 'var(--font-size-sm)';
      error.style.marginTop = 'var(--space-xs)';
      error.textContent = message;
      field.parentElement.appendChild(error);
    } else {
      field.style.borderColor = '';
    }
  }

  submitForm() {
    // Show success message
    const successHTML = `
      <div class="alert alert-success">
        <strong>Success!</strong> Your form has been submitted.
      </div>
    `;
    this.form.insertAdjacentHTML('beforebegin', successHTML);
    this.form.reset();
    
    // Remove success message after 5 seconds
    setTimeout(() => {
      document.querySelector('.alert-success')?.remove();
    }, 5000);
  }
}

// ============================================
// LOADER
// ============================================
function hideLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 300);
    }, 500);
  }
}

// ============================================
// PARALLAX EFFECT - Digit 4 (9): Maximal animation
// ============================================
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-parallax') || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// ============================================
// TABS FUNCTIONALITY
// ============================================
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      const tabGroup = button.closest('[data-tab-group]');
      
      if (!tabGroup) return;
      
      // Remove active from all buttons and contents in this group
      tabGroup.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      tabGroup.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      // Add active to clicked button and corresponding content
      button.classList.add('active');
      const content = tabGroup.querySelector(`#${tabId}`);
      if (content) {
        content.classList.add('active');
      }
    });
  });
}

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Core functionality
  new ThemeManager();
  new MobileNav();
  setActiveNavLink();
  
  // Animations
  initScrollAnimations();
  initParallax();
  
  // Components
  window.cookieConsent = new CookieConsent();
  new ModalManager();
  new NewsletterModal();
  
  // Utilities
  initSmoothScroll();
  initTabs();
  new FormValidator('form');
  
  // Hide loader
  hideLoader();
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Format date
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Export for use in other scripts
window.utils = {
  debounce,
  throttle,
  formatDate,
  copyToClipboard
};
