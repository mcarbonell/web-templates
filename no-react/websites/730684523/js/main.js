/* ============================================
   SEED 730684523 - MAIN JAVASCRIPT
   ============================================
   Digit-Driven Features:
   - 6: Expressive/Dynamic animations
   - 2: Subtle lift/2D interactions
   - 8: Super-rounded visual elements
   ============================================ */

(function() {
  'use strict';

  // ==========================================
  // CONFIGURATION
  // ==========================================
  const CONFIG = {
    animationDuration: 600,
    scrollOffset: 100,
    revealThreshold: 0.15,
    cookieExpiry: 365 // days
  };

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================
  const utils = {
    // Throttle function for performance
    throttle: (func, limit) => {
      let inThrottle;
      return function(...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Debounce function
    debounce: (func, wait) => {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },

    // Check if element is in viewport
    isInViewport: (element, threshold = 0) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
        rect.bottom >= 0
      );
    },

    // Set CSS custom property
    setCSSProperty: (name, value) => {
      document.documentElement.style.setProperty(name, value);
    },

    // Get CSS custom property
    getCSSProperty: (name) => {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    },

    // Generate random number within range
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // Easing functions
    easing: {
      easeOutCubic: t => 1 - Math.pow(1 - t, 3),
      easeOutQuart: t => 1 - Math.pow(1 - t, 4),
      easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }
  };

  // ==========================================
  // THEME MANAGER
  // ==========================================
  const ThemeManager = {
    init() {
      this.themeToggle = document.querySelector('.theme-toggle');
      this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
      
      this.applyTheme(this.currentTheme);
      this.bindEvents();
    },

    getStoredTheme() {
      try {
        return localStorage.getItem('theme');
      } catch (e) {
        return null;
      }
    },

    getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      this.updateToggleIcon(theme);
    },

    updateToggleIcon(theme) {
      if (!this.themeToggle) return;
      
      const icon = theme === 'dark' ? '☀️' : '🌙';
      this.themeToggle.innerHTML = `<span class="sr-only">Toggle ${theme === 'dark' ? 'light' : 'dark'} mode</span>${icon}`;
      this.themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    },

    toggle() {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.currentTheme = newTheme;
      this.applyTheme(newTheme);
      
      try {
        localStorage.setItem('theme', newTheme);
      } catch (e) {
        console.warn('Could not save theme preference');
      }
    },

    bindEvents() {
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => this.toggle());
      }

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!this.getStoredTheme()) {
          this.currentTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(this.currentTheme);
        }
      });
    }
  };

  // ==========================================
  // NAVIGATION MANAGER
  // ==========================================
  const NavigationManager = {
    init() {
      this.nav = document.querySelector('.nav');
      this.navToggle = document.querySelector('.nav-toggle');
      this.navMenu = document.querySelector('.nav-menu');
      this.navLinks = document.querySelectorAll('.nav-link');
      
      this.bindEvents();
      this.highlightCurrentPage();
      this.handleScroll();
    },

    bindEvents() {
      // Mobile menu toggle
      if (this.navToggle) {
        this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
      }

      // Close mobile menu on link click
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMobileMenu());
      });

      // Scroll handling
      window.addEventListener('scroll', utils.throttle(() => this.handleScroll(), 100));
      
      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeMobileMenu();
      });

      // Close menu on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && this.navMenu?.classList.contains('active')) {
          this.closeMobileMenu();
        }
      });
    },

    toggleMobileMenu() {
      const isOpen = this.navMenu.classList.toggle('active');
      this.navToggle.setAttribute('aria-expanded', isOpen);
      
      // Animate hamburger to X
      const spans = this.navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    },

    closeMobileMenu() {
      this.navMenu?.classList.remove('active');
      this.navToggle?.setAttribute('aria-expanded', 'false');
      
      const spans = this.navToggle?.querySelectorAll('span');
      if (spans) {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    },

    handleScroll() {
      const scrollY = window.scrollY;
      
      // Add shadow to nav on scroll
      if (scrollY > 50) {
        this.nav?.classList.add('nav-scrolled');
      } else {
        this.nav?.classList.remove('nav-scrolled');
      }

      // Update active section in nav
      this.updateActiveSection();
    },

    updateActiveSection() {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + CONFIG.scrollOffset;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },

    handleAnchorClick(e) {
      const href = e.currentTarget.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = target.offsetTop - CONFIG.scrollOffset;
        
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    },

    highlightCurrentPage() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      
      this.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
    }
  };

  // ==========================================
  // SCROLL REVEAL ANIMATIONS
  // ==========================================
  const ScrollReveal = {
    init() {
      this.elements = document.querySelectorAll('.reveal');
      this.observer = null;
      
      if ('IntersectionObserver' in window) {
        this.setupObserver();
      } else {
        this.fallback();
      }
    },

    setupObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Stagger children if data-stagger attribute present
            if (entry.target.dataset.stagger) {
              this.staggerChildren(entry.target);
            }
            
            // Unobserve after animation
            if (!entry.target.dataset.repeat) {
              this.observer.unobserve(entry.target);
            }
          } else if (entry.target.dataset.repeat) {
            entry.target.classList.remove('active');
          }
        });
      }, {
        threshold: CONFIG.revealThreshold,
        rootMargin: '0px 0px -50px 0px'
      });

      this.elements.forEach(el => this.observer.observe(el));
    },

    staggerChildren(parent) {
      const children = parent.children;
      const delay = parseInt(parent.dataset.stagger) || 100;
      
      Array.from(children).forEach((child, index) => {
        child.style.transitionDelay = `${index * delay}ms`;
        child.classList.add('reveal');
        child.classList.add('active');
      });
    },

    fallback() {
      // Simple fallback for browsers without IntersectionObserver
      this.elements.forEach(el => el.classList.add('active'));
    }
  };

  // ==========================================
  // COOKIE CONSENT
  // ==========================================
  const CookieConsent = {
    init() {
      this.banner = document.querySelector('.cookie-consent');
      this.acceptBtn = document.querySelector('.cookie-accept');
      this.declineBtn = document.querySelector('.cookie-decline');
      
      if (!this.getConsent() && this.banner) {
        setTimeout(() => this.show(), 2000);
      }
      
      this.bindEvents();
    },

    getConsent() {
      try {
        return localStorage.getItem('cookieConsent');
      } catch (e) {
        return null;
      }
    },

    setConsent(value) {
      try {
        localStorage.setItem('cookieConsent', value);
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
      } catch (e) {
        console.warn('Could not save cookie consent');
      }
    },

    show() {
      this.banner?.classList.add('active');
    },

    hide() {
      this.banner?.classList.remove('active');
    },

    bindEvents() {
      this.acceptBtn?.addEventListener('click', () => {
        this.setConsent('accepted');
        this.hide();
      });

      this.declineBtn?.addEventListener('click', () => {
        this.setConsent('declined');
        this.hide();
      });
    }
  };

  // ==========================================
  // FORM VALIDATION
  // ==========================================
  const FormValidation = {
    init() {
      this.forms = document.querySelectorAll('form[data-validate]');
      this.bindEvents();
    },

    bindEvents() {
      this.forms.forEach(form => {
        form.addEventListener('submit', (e) => this.handleSubmit(e, form));
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          input.addEventListener('blur', () => this.validateField(input));
          input.addEventListener('input', () => this.clearError(input));
        });
      });
    },

    handleSubmit(e, form) {
      e.preventDefault();
      
      if (this.validateForm(form)) {
        this.submitForm(form);
      }
    },

    validateForm(form) {
      const inputs = form.querySelectorAll('[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });

      return isValid;
    },

    validateField(field) {
      const value = field.value.trim();
      const type = field.type;
      let isValid = true;
      let message = '';

      // Required check
      if (field.required && !value) {
        isValid = false;
        message = 'This field is required';
      }

      // Email validation
      if (isValid && type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          message = 'Please enter a valid email address';
        }
      }

      // Phone validation
      if (isValid && type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
          isValid = false;
          message = 'Please enter a valid phone number';
        }
      }

      // Custom pattern
      if (isValid && field.pattern && value) {
        const pattern = new RegExp(field.pattern);
        if (!pattern.test(value)) {
          isValid = false;
          message = field.dataset.error || 'Please match the requested format';
        }
      }

      // Update UI
      if (!isValid) {
        this.showError(field, message);
      } else {
        this.clearError(field);
        field.classList.add('valid');
      }

      return isValid;
    },

    showError(field, message) {
      field.classList.add('error');
      field.classList.remove('valid');
      
      let errorEl = field.parentElement.querySelector('.error-message');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.style.cssText = 'color: var(--color-secondary); font-size: var(--text-sm); margin-top: var(--space-1); display: block;';
        field.parentElement.appendChild(errorEl);
      }
      errorEl.textContent = message;
    },

    clearError(field) {
      field.classList.remove('error');
      const errorEl = field.parentElement.querySelector('.error-message');
      if (errorEl) {
        errorEl.remove();
      }
    },

    submitForm(form) {
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn?.textContent;
      
      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Simulate form submission (replace with actual fetch)
      setTimeout(() => {
        this.showSuccess(form);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        form.reset();
      }, 1500);
    },

    showSuccess(form) {
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success';
      successMsg.style.cssText = 'background: var(--color-accent); color: var(--color-primary-dark); padding: var(--space-4); border-radius: var(--radius-lg); margin-top: var(--space-4); text-align: center;';
      successMsg.textContent = 'Thank you! Your message has been sent successfully.';
      
      form.appendChild(successMsg);
      
      setTimeout(() => {
        successMsg.remove();
      }, 5000);
    }
  };

  // ==========================================
  // NEWSLETTER MODAL
  // ==========================================
  const NewsletterModal = {
    init() {
      this.modal = document.querySelector('.newsletter-modal');
      this.closeBtn = document.querySelector('.newsletter-close');
      this.trigger = document.querySelector('.newsletter-trigger');
      
      if (!this.modal) return;
      
      this.bindEvents();
      this.setupExitIntent();
    },

    bindEvents() {
      this.closeBtn?.addEventListener('click', () => this.close());
      this.trigger?.addEventListener('click', () => this.open());
      
      // Close on backdrop click
      this.modal?.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    },

    setupExitIntent() {
      let shown = false;
      
      document.addEventListener('mouseout', (e) => {
        if (e.clientY < 0 && !shown && !this.getDismissed()) {
          shown = true;
          setTimeout(() => this.open(), 100);
        }
      });
    },

    getDismissed() {
      try {
        return sessionStorage.getItem('newsletterDismissed');
      } catch (e) {
        return false;
      }
    },

    setDismissed() {
      try {
        sessionStorage.setItem('newsletterDismissed', 'true');
      } catch (e) {
        console.warn('Could not save dismissed state');
      }
    },

    open() {
      this.modal?.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.modal?.classList.remove('active');
      document.body.style.overflow = '';
      this.setDismissed();
    }
  };

  // ==========================================
  // LOADER
  // ==========================================
  const Loader = {
    init() {
      this.loader = document.querySelector('.loader');
      
      if (!this.loader) return;
      
      window.addEventListener('load', () => {
        setTimeout(() => this.hide(), 500);
      });
    },

    hide() {
      this.loader?.classList.add('hidden');
      setTimeout(() => {
        this.loader?.remove();
      }, 500);
    }
  };

  // ==========================================
  // PARALLAX EFFECTS
  // ==========================================
  const ParallaxEffects = {
    init() {
      this.elements = document.querySelectorAll('[data-parallax]');
      if (!this.elements.length) return;
      
      this.bindEvents();
    },

    bindEvents() {
      window.addEventListener('scroll', utils.throttle(() => this.update(), 16));
    },

    update() {
      const scrollY = window.scrollY;
      
      this.elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = scrollY * speed;
        el.style.transform = `translateY(${yPos}px)`;
      });
    }
  };

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================
  const CounterAnimation = {
    init() {
      this.counters = document.querySelectorAll('[data-counter]');
      if (!this.counters.length) return;
      
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      this.counters.forEach(counter => this.observer.observe(counter));
    },

    animate(element) {
      const target = parseInt(element.dataset.counter);
      const duration = parseInt(element.dataset.duration) || 2000;
      const suffix = element.dataset.suffix || '';
      const prefix = element.dataset.prefix || '';
      
      const startTime = performance.now();
      
      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = utils.easing.easeOutQuart(progress);
        const current = Math.floor(eased * target);
        
        element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      
      requestAnimationFrame(update);
    }
  };

  // ==========================================
  // TABS COMPONENT
  // ==========================================
  const TabsComponent = {
    init() {
      this.tabGroups = document.querySelectorAll('[data-tabs]');
      this.bindEvents();
    },

    bindEvents() {
      this.tabGroups.forEach(group => {
        const tabs = group.querySelectorAll('[data-tab]');
        const panels = group.querySelectorAll('[data-panel]');
        
        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update panels
            panels.forEach(p => {
              p.classList.remove('active');
              if (p.dataset.panel === target) {
                p.classList.add('active');
              }
            });
          });
        });
      });
    }
  };

  // ==========================================
  // ACCORDION COMPONENT
  // ==========================================
  const AccordionComponent = {
    init() {
      this.accordions = document.querySelectorAll('[data-accordion]');
      this.bindEvents();
    },

    bindEvents() {
      this.accordions.forEach(accordion => {
        const triggers = accordion.querySelectorAll('[data-accordion-trigger]');
        
        triggers.forEach(trigger => {
          trigger.addEventListener('click', () => {
            const item = trigger.closest('[data-accordion-item]');
            const isOpen = item.classList.contains('open');
            
            // Close all if single mode
            if (accordion.dataset.accordion === 'single') {
              accordion.querySelectorAll('[data-accordion-item]').forEach(i => {
                i.classList.remove('open');
              });
            }
            
            // Toggle current
            item.classList.toggle('open', !isOpen);
          });
        });
      });
    }
  };

  // ==========================================
  // LAZY LOADING
  // ==========================================
  const LazyLoader = {
    init() {
      this.images = document.querySelectorAll('img[data-src]');
      if (!this.images.length) return;
      
      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
              this.observer.unobserve(entry.target);
            }
          });
        }, {
          rootMargin: '50px 0px'
        });

        this.images.forEach(img => this.observer.observe(img));
      } else {
        // Fallback: load all images
        this.images.forEach(img => this.loadImage(img));
      }
    },

    loadImage(img) {
      const src = img.dataset.src;
      const srcset = img.dataset.srcset;
      
      if (src) img.src = src;
      if (srcset) img.srcset = srcset;
      
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
      img.classList.add('loaded');
    }
  };

  // ==========================================
  // SMOOTH SCROLL TO TOP
  // ==========================================
  const ScrollToTop = {
    init() {
      this.button = document.querySelector('.scroll-to-top');
      if (!this.button) return;
      
      this.bindEvents();
    },

    bindEvents() {
      window.addEventListener('scroll', utils.throttle(() => {
        if (window.scrollY > 500) {
          this.button.classList.add('visible');
        } else {
          this.button.classList.remove('visible');
        }
      }, 100));

      this.button.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // ==========================================
  // TOOLTIP SYSTEM
  // ==========================================
  const TooltipSystem = {
    init() {
      this.triggers = document.querySelectorAll('[data-tooltip]');
      this.bindEvents();
    },

    bindEvents() {
      this.triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', (e) => this.show(e, trigger));
        trigger.addEventListener('mouseleave', () => this.hide());
        trigger.addEventListener('focus', (e) => this.show(e, trigger));
        trigger.addEventListener('blur', () => this.hide());
      });
    },

    show(e, trigger) {
      const text = trigger.dataset.tooltip;
      const position = trigger.dataset.tooltipPosition || 'top';
      
      this.tooltip = document.createElement('div');
      this.tooltip.className = `tooltip tooltip-${position}`;
      this.tooltip.textContent = text;
      this.tooltip.style.cssText = `
        position: absolute;
        background: var(--color-primary-dark);
        color: var(--color-white);
        padding: var(--space-2) var(--space-4);
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
        z-index: var(--z-tooltip);
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transform: translateY(10px);
        transition: all var(--transition-fast);
      `;
      
      document.body.appendChild(this.tooltip);
      
      const rect = trigger.getBoundingClientRect();
      const tooltipRect = this.tooltip.getBoundingClientRect();
      
      let top, left;
      
      switch(position) {
        case 'top':
          top = rect.top - tooltipRect.height - 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + (rect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = rect.top + (rect.height - tooltipRect.height) / 2;
          left = rect.right + 8;
          break;
      }
      
      this.tooltip.style.top = `${top + window.scrollY}px`;
      this.tooltip.style.left = `${left}px`;
      
      requestAnimationFrame(() => {
        this.tooltip.style.opacity = '1';
        this.tooltip.style.transform = 'translateY(0)';
      });
    },

    hide() {
      if (this.tooltip) {
        this.tooltip.style.opacity = '0';
        this.tooltip.style.transform = 'translateY(10px)';
        setTimeout(() => this.tooltip?.remove(), 200);
      }
    }
  };

  // ==========================================
  // INITIALIZE ALL MODULES
  // ==========================================
  function init() {
    Loader.init();
    ThemeManager.init();
    NavigationManager.init();
    ScrollReveal.init();
    CookieConsent.init();
    FormValidation.init();
    NewsletterModal.init();
    ParallaxEffects.init();
    CounterAnimation.init();
    TabsComponent.init();
    AccordionComponent.init();
    LazyLoader.init();
    ScrollToTop.init();
    TooltipSystem.init();
    
    console.log('🎨 Seed 730684523 - Creative Agency Template Initialized');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose utilities globally for debugging
  window.Seed730684523 = { utils, CONFIG };
})();
