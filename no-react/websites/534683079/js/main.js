/**
 * SEED: 534683079 - Main JavaScript
 * Core functionality for all pages
 * 
 * Features:
 * - Theme toggle with persistence
 * - Mobile navigation
 * - Scroll animations (digit 4=6: moderate-high motion)
 * - Cookie consent
 * - Newsletter modal
 * - Active navigation highlighting
 */

// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 
                 (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupToggle();
    this.watchSystemPreference();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
  }

  setupToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  }

  watchSystemPreference() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.theme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }
}

// Mobile Navigation
class MobileNav {
  constructor() {
    this.toggle = document.querySelector('.mobile-menu-toggle');
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
    this.menu.querySelectorAll('a').forEach(link => {
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

// Active Navigation Highlighting
class NavHighlighter {
  constructor() {
    this.init();
  }

  init() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-menu a');
    
    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (currentPath === linkPath || 
          (currentPath === '/' && linkPath.includes('index.html'))) {
        link.classList.add('active');
      }
    });
  }
}

// Scroll Animations (digit 4=6: moderate-high motion)
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        this.observerOptions
      );

      // Observe elements with animation classes
      document.querySelectorAll('[data-animate]').forEach(el => {
        this.observer.observe(el);
      });
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animationType = entry.target.dataset.animate || 'fade-in';
        entry.target.classList.add(`animate-${animationType}`);
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// Cookie Consent
class CookieConsent {
  constructor() {
    this.consentKey = 'cookie-consent';
    this.init();
  }

  init() {
    if (!this.hasConsent()) {
      this.show();
    }
  }

  hasConsent() {
    return localStorage.getItem(this.consentKey) === 'true';
  }

  show() {
    const consent = document.querySelector('.cookie-consent');
    if (!consent) return;

    setTimeout(() => {
      consent.classList.add('show');
    }, 1000);

    const acceptBtn = consent.querySelector('[data-cookie-accept]');
    const declineBtn = consent.querySelector('[data-cookie-decline]');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => this.accept());
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => this.decline());
    }
  }

  accept() {
    localStorage.setItem(this.consentKey, 'true');
    this.hide();
  }

  decline() {
    localStorage.setItem(this.consentKey, 'false');
    this.hide();
  }

  hide() {
    const consent = document.querySelector('.cookie-consent');
    if (consent) {
      consent.classList.remove('show');
    }
  }
}

// Newsletter Modal
class NewsletterModal {
  constructor() {
    this.modalKey = 'newsletter-shown';
    this.delay = 5000; // Show after 5 seconds
    this.init();
  }

  init() {
    if (this.shouldShow()) {
      setTimeout(() => this.show(), this.delay);
    }

    this.setupCloseHandlers();
  }

  shouldShow() {
    return !sessionStorage.getItem(this.modalKey);
  }

  show() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
  }

  hide() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      sessionStorage.setItem(this.modalKey, 'true');
    }
  }

  setupCloseHandlers() {
    const modal = document.querySelector('.modal-overlay');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hide());
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hide();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        this.hide();
      }
    });
  }
}

// Page Loader
class PageLoader {
  constructor() {
    this.loader = document.querySelector('.page-loader');
    this.init();
  }

  init() {
    if (!this.loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        this.loader.classList.add('hidden');
      }, 300);
    });
  }
}

// Form Validation
class FormValidator {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    e.preventDefault();
    
    if (this.validate()) {
      this.showSuccess();
      this.form.reset();
    }
  }

  validate() {
    let isValid = true;
    const inputs = this.form.querySelectorAll('[required]');

    inputs.forEach(input => {
      if (!input.value.trim()) {
        this.showError(input, 'This field is required');
        isValid = false;
      } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
        this.showError(input, 'Please enter a valid email');
        isValid = false;
      } else {
        this.clearError(input);
      }
    });

    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showError(input, message) {
    this.clearError(input);
    input.classList.add('error');
    const error = document.createElement('span');
    error.className = 'form-error';
    error.textContent = message;
    error.style.color = 'var(--color-error)';
    error.style.fontSize = '0.875rem';
    error.style.marginTop = 'var(--space-xs)';
    error.style.display = 'block';
    input.parentNode.appendChild(error);
  }

  clearError(input) {
    input.classList.remove('error');
    const error = input.parentNode.querySelector('.form-error');
    if (error) {
      error.remove();
    }
  }

  showSuccess() {
    const success = document.createElement('div');
    success.className = 'form-success';
    success.textContent = 'Thank you! Your submission has been received.';
    success.style.cssText = `
      background: var(--color-success);
      color: white;
      padding: var(--space-md);
      border-radius: var(--radius-md);
      margin-top: var(--space-md);
      animation: slideDown var(--transition-base) ease-out;
    `;
    this.form.appendChild(success);

    setTimeout(() => {
      success.remove();
    }, 5000);
  }
}

// Smooth Scroll
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
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
}

// Parallax Effect (digit 8=7: high interaction)
class ParallaxEffect {
  constructor() {
    this.elements = document.querySelectorAll('[data-parallax]');
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    const scrolled = window.pageYOffset;

    this.elements.forEach(el => {
      const speed = el.dataset.parallax || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  }
}

// Counter Animation
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('[data-counter]');
    this.init();
  }

  init() {
    if (this.counters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.counter);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, 16);
  }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new MobileNav();
  new NavHighlighter();
  new ScrollAnimations();
  new CookieConsent();
  new NewsletterModal();
  new PageLoader();
  new SmoothScroll();
  new ParallaxEffect();
  new CounterAnimation();

  // Initialize form validation for common forms
  new FormValidator('#contact-form');
  new FormValidator('#newsletter-form');
  new FormValidator('#checkout-form');
});

// Utility Functions
const utils = {
  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Format date
  formatDate(date, options = {}) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(new Date(date));
  }
};

// Export for use in other scripts
window.utils = utils;
