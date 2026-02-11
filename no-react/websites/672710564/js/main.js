// Main JavaScript - Shared functionality

// Theme management
class ThemeManager {
  constructor() {
    this.init();
  }
  
  init() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Listen for system preference changes
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addEventListener('change', () => {
      if (!localStorage.getItem('theme')) {
        this.updateTheme();
      }
    });
    
    this.setupThemeToggle();
  }
  
  setupThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        this.updateToggleButton();
      });
      
      this.updateToggleButton();
    }
  }
  
  updateToggleButton() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (toggleBtn) {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      toggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
  }
  
  updateTheme() {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
    }
  }
}

// Navigation
class Navigation {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupMobileToggle();
    this.setupActiveState();
    this.setupScrollEffect();
  }
  
  setupMobileToggle() {
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-menu');
    
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = toggle.querySelectorAll('span');
        if (menu.classList.contains('active')) {
          spans[0].style.transform = 'rotate(45deg) translateY(7px)';
          spans[1].style.opacity = '0';
          spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
        } else {
          spans[0].style.transform = '';
          spans[1].style.opacity = '1';
          spans[2].style.transform = '';
        }
      });
    }
  }
  
  setupActiveState() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.navbar-link');
    
    links.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }
  
  setupScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      let lastScroll = 0;
      
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
          navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
          navbar.style.boxShadow = 'var(--shadow-sm)';
        }
        
        lastScroll = currentScroll;
      });
    }
  }
}

// Modal management
class ModalManager {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupModals();
    this.setupEscapeKey();
  }
  
  setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        const modal = document.querySelector(`#${modalId}`);
        if (modal) {
          this.openModal(modal);
        }
      });
    });
    
    modals.forEach(modal => {
      const closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal(modal));
      }
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });
    });
  }
  
  setupEscapeKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
          this.closeModal(activeModal);
        }
      }
    });
  }
  
  openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Form validation
class FormValidator {
  constructor(form) {
    this.form = form;
    this.init();
  }
  
  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }
  
  handleSubmit(e) {
    let isValid = true;
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      e.preventDefault();
    }
  }
  
  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
    
    // Min length validation
    if (field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
      isValid = false;
      errorMessage = `Minimum ${field.getAttribute('minlength')} characters required`;
    }
    
    // Update UI
    this.updateFieldValidation(field, isValid, errorMessage);
    
    return isValid;
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  updateFieldValidation(field, isValid, errorMessage) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    let errorElement = formGroup.querySelector('.form-error');
    
    if (!isValid) {
      field.style.borderColor = 'var(--color-error)';
      
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        formGroup.appendChild(errorElement);
      }
      
      errorElement.textContent = errorMessage;
    } else {
      field.style.borderColor = '';
      if (errorElement) {
        errorElement.remove();
      }
    }
  }
  
  clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup?.querySelector('.form-error');
    
    if (errorElement) {
      errorElement.remove();
    }
    
    field.style.borderColor = '';
  }
}

// Lazy loading for images
class LazyLoader {
  constructor() {
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      this.loadAllImages();
    }
  }
  
  setupIntersectionObserver() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
  }
  
  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
    }
  }
  
  loadAllImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.loadImage(img));
  }
}

// Scroll animations
class ScrollAnimations {
  constructor() {
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.setupScrollReveal();
    }
  }
  
  setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      
      observer.observe(el);
    });
    
    // CSS for revealed state
    const style = document.createElement('style');
    style.textContent = `
      .reveal.revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Cookie consent
class CookieConsent {
  constructor() {
    this.init();
  }
  
  init() {
    if (!localStorage.getItem('cookie-consent')) {
      this.showConsent();
    }
  }
  
  showConsent() {
    const consent = document.createElement('div');
    consent.className = 'cookie-consent';
    consent.innerHTML = `
      <div class="cookie-consent-content">
        <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
        <div class="cookie-consent-actions">
          <button class="btn btn-sm" onclick="this.closest('.cookie-consent').remove(); localStorage.setItem('cookie-consent', 'accepted')">Accept</button>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .cookie-consent {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: var(--color-surface);
        border-top: 1px solid var(--color-border);
        padding: var(--space-md);
        z-index: 1000;
        box-shadow: var(--shadow-lg);
      }
      .cookie-consent-content {
        max-width: var(--content-max-width);
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-lg);
        flex-wrap: wrap;
      }
      .cookie-consent p {
        margin: 0;
        font-size: var(--text-sm);
      }
      .cookie-consent-actions {
        display: flex;
        gap: var(--space-sm);
      }
      @media (max-width: 768px) {
        .cookie-consent-content {
          flex-direction: column;
          text-align: center;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(consent);
  }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new Navigation();
  new ModalManager();
  new LazyLoader();
  new ScrollAnimations();
  new CookieConsent();
  
  // Initialize form validators
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => new FormValidator(form));
});

// Utility functions
window.utils = {
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
  
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  },
  
  formatDate(date, options = {}) {
    const defaults = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', { ...defaults, ...options }).format(date);
  }
};