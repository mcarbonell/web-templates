/**
 * SEED 97232633 - MAIN JAVASCRIPT
 * ============================================
 * Core functionality for the portfolio website
 * ============================================
 */

// ============================================
// THEME MANAGEMENT
// ============================================
const ThemeManager = {
  STORAGE_KEY: 'theme-preference',
  
  init() {
    this.loadTheme();
    this.setupToggle();
    this.listenForSystemChanges();
  },
  
  loadTheme() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (systemPrefersDark ? 'dark' : 'light');
    this.applyTheme(theme);
  },
  
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.updateToggleIcon(theme);
  },
  
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    localStorage.setItem(this.STORAGE_KEY, next);
  },
  
  setupToggle() {
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggle());
    }
  },
  
  updateToggleIcon(theme) {
    const toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) {
      const icon = toggle.querySelector('i') || toggle;
      icon.className = theme === 'dark' ? 'icon-moon' : 'icon-sun';
      toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  },
  
  listenForSystemChanges() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
};

// ============================================
// NAVIGATION
// ============================================
const Navigation = {
  init() {
    this.setupMobileMenu();
    this.setupStickyHeader();
    this.highlightCurrentPage();
    this.setupSmoothScroll();
  },
  
  setupMobileMenu() {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const nav = document.querySelector('[data-main-nav]');
    
    if (!toggle || !nav) return;
    
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.classList.toggle('is-active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    });
    
    // Close on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
        document.body.classList.remove('nav-open');
      });
    });
    
    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
        document.body.classList.remove('nav-open');
      }
    });
  },
  
  setupStickyHeader() {
    const header = document.querySelector('[data-header]');
    if (!header) return;
    
    let lastScroll = 0;
    const threshold = 100;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add/remove scrolled class
      header.classList.toggle('is-scrolled', currentScroll > threshold);
      
      // Hide/show on scroll direction (optional)
      if (currentScroll > lastScroll && currentScroll > 300) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  },
  
  highlightCurrentPage() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('[data-main-nav] a').forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath || 
          (currentPath !== '/' && linkPath !== '/' && currentPath.startsWith(linkPath))) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  },
  
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
};

// ============================================
// SCROLL REVEAL (Digit 4 = 3: Moderate motion)
// ============================================
const ScrollReveal = {
  init() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleEntries(entries),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    this.observeElements();
  },
  
  observeElements() {
    document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
      this.observer.observe(el);
    });
  },
  
  handleEntries(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Unobserve after reveal for performance
        if (!entry.target.classList.contains('reveal-repeat')) {
          this.observer.unobserve(entry.target);
        }
      } else if (entry.target.classList.contains('reveal-repeat')) {
        entry.target.classList.remove('active');
      }
    });
  }
};

// ============================================
// PARALLAX EFFECTS (Digit 8 = 3: Subtle 3D)
// ============================================
const ParallaxEffects = {
  init() {
    this.elements = document.querySelectorAll('[data-parallax]');
    if (!this.elements.length) return;
    
    this.ticking = false;
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
  },
  
  onScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updatePositions();
        this.ticking = false;
      });
      this.ticking = true;
    }
  },
  
  updatePositions() {
    const scrolled = window.pageYOffset;
    
    this.elements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }
};

// ============================================
// TILT EFFECT (Digit 8 = 3: Subtle 3D)
// ============================================
const TiltEffect = {
  init() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => this.onMouseMove(e, card));
      card.addEventListener('mouseleave', (e) => this.onMouseLeave(e, card));
    });
  },
  
  onMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  },
  
  onMouseLeave(e, card) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  }
};

// ============================================
// COOKIE CONSENT
// ============================================
const CookieConsent = {
  STORAGE_KEY: 'cookie-consent',
  
  init() {
    if (!this.hasConsent()) {
      this.showBanner();
    }
  },
  
  hasConsent() {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  },
  
  showBanner() {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-content">
        <p>We use cookies to enhance your experience. By continuing, you agree to our use of cookies.</p>
        <div class="cookie-actions">
          <button class="btn btn-primary" data-cookie-accept>Accept</button>
          <button class="btn btn-ghost" data-cookie-decline>Decline</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Animate in
    requestAnimationFrame(() => {
      banner.classList.add('is-visible');
    });
    
    // Event listeners
    banner.querySelector('[data-cookie-accept]').addEventListener('click', () => {
      this.setConsent(true);
      this.hideBanner(banner);
    });
    
    banner.querySelector('[data-cookie-decline]').addEventListener('click', () => {
      this.setConsent(false);
      this.hideBanner(banner);
    });
  },
  
  setConsent(accepted) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      accepted,
      timestamp: new Date().toISOString()
    }));
  },
  
  hideBanner(banner) {
    banner.classList.remove('is-visible');
    setTimeout(() => banner.remove(), 300);
  }
};

// ============================================
// NEWSLETTER MODAL
// ============================================
const NewsletterModal = {
  STORAGE_KEY: 'newsletter-shown',
  
  init() {
    // Show after 30 seconds or on exit intent
    setTimeout(() => this.showIfNotShown(), 30000);
    this.setupExitIntent();
  },
  
  setupExitIntent() {
    document.addEventListener('mouseout', (e) => {
      if (e.clientY < 0 && !this.hasBeenShown()) {
        this.show();
      }
    });
  },
  
  hasBeenShown() {
    return sessionStorage.getItem(this.STORAGE_KEY) === 'true';
  },
  
  showIfNotShown() {
    if (!this.hasBeenShown()) {
      this.show();
    }
  },
  
  show() {
    const modal = document.querySelector('[data-newsletter-modal]');
    if (!modal) return;
    
    modal.classList.add('is-visible');
    sessionStorage.setItem(this.STORAGE_KEY, 'true');
    
    // Close handlers
    modal.querySelector('[data-modal-close]')?.addEventListener('click', () => {
      modal.classList.remove('is-visible');
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-visible');
      }
    });
  }
};

// ============================================
// FORM VALIDATION
// ============================================
const FormValidation = {
  init() {
    document.querySelectorAll('form[data-validate]').forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    });
  },
  
  handleSubmit(e, form) {
    e.preventDefault();
    
    const fields = form.querySelectorAll('[data-validate-field]');
    let isValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    if (isValid) {
      this.submitForm(form);
    }
  },
  
  validateField(field) {
    const value = field.value.trim();
    const type = field.dataset.validateField;
    let isValid = true;
    let message = '';
    
    switch (type) {
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        message = 'Please enter a valid email address';
        break;
      case 'required':
        isValid = value.length > 0;
        message = 'This field is required';
        break;
      case 'min-length':
        const min = parseInt(field.dataset.minLength) || 3;
        isValid = value.length >= min;
        message = `Must be at least ${min} characters`;
        break;
    }
    
    this.toggleFieldError(field, isValid, message);
    return isValid;
  },
  
  toggleFieldError(field, isValid, message) {
    const wrapper = field.closest('.form-field') || field.parentElement;
    const errorEl = wrapper.querySelector('.field-error') || document.createElement('span');
    
    if (!isValid) {
      errorEl.className = 'field-error';
      errorEl.textContent = message;
      if (!wrapper.querySelector('.field-error')) {
        wrapper.appendChild(errorEl);
      }
      field.setAttribute('aria-invalid', 'true');
    } else {
      errorEl.remove();
      field.removeAttribute('aria-invalid');
    }
  },
  
  submitForm(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Simulate submission
    setTimeout(() => {
      submitBtn.textContent = 'Sent!';
      submitBtn.classList.add('btn-success');
      
      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('btn-success');
      }, 2000);
    }, 1500);
  }
};

// ============================================
// LOADER (Digit 4 = 3: Moderate - simple fade)
// ============================================
const PageLoader = {
  init() {
    const loader = document.querySelector('[data-loader]');
    if (!loader) return;
    
    window.addEventListener('load', () => {
      loader.classList.add('is-hidden');
      setTimeout(() => loader.remove(), 500);
    });
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const Utils = {
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
  
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Navigation.init();
  ScrollReveal.init();
  ParallaxEffects.init();
  TiltEffect.init();
  CookieConsent.init();
  NewsletterModal.init();
  FormValidation.init();
  PageLoader.init();
  
  console.log('🚀 SEED 97232633 - Portfolio site initialized');
});
