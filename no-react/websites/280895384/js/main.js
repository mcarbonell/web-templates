/**
 * NEXUS TECH - MAIN JAVASCRIPT
 * Seed: 280895384
 * 
 * Core functionality: Navigation, Theme, Utilities
 * Digit 4 = 8: High-impact animations with Intersection Observer
 * Digit 8 = 8: 3D interactions and depth effects
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    scrollOffset: 100,
    revealThreshold: 0.1,
    staggerDelay: 100,
    cookieConsentKey: 'nexus-cookie-consent',
    themeKey: 'nexus-theme',
    newsletterShownKey: 'nexus-newsletter-shown'
  };

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  const utils = {
    /**
     * Throttle function execution
     */
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

    /**
     * Debounce function execution
     */
    debounce(func, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element, threshold = 0) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
        rect.bottom >= 0
      );
    },

    /**
     * Get CSS custom property value
     */
    getCSSVariable(name) {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    },

    /**
     * Set CSS custom property value
     */
    setCSSVariable(name, value) {
      document.documentElement.style.setProperty(name, value);
    },

    /**
     * Format number with commas
     */
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Capitalize first letter
     */
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Generate random ID
     */
    generateId() {
      return 'id-' + Math.random().toString(36).substr(2, 9);
    }
  };

  // ============================================
  // THEME MANAGER
  // ============================================
  const ThemeManager = {
    currentTheme: 'light',

    init() {
      this.loadTheme();
      this.setupToggle();
      this.setupSystemPreference();
    },

    loadTheme() {
      const savedTheme = localStorage.getItem(CONFIG.themeKey);
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
      this.applyTheme(this.currentTheme);
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      this.currentTheme = theme;
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    },

    toggle() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(newTheme);
      localStorage.setItem(CONFIG.themeKey, newTheme);
    },

    setupToggle() {
      const toggle = document.querySelector('.theme-toggle');
      if (toggle) {
        toggle.addEventListener('click', () => this.toggle());
      }
    },

    setupSystemPreference() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem(CONFIG.themeKey)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  };

  // ============================================
  // NAVIGATION MANAGER
  // ============================================
  const NavigationManager = {
    nav: null,
    toggle: null,
    menu: null,
    isOpen: false,

    init() {
      this.nav = document.querySelector('.nav');
      this.toggle = document.querySelector('.nav-toggle');
      this.menu = document.querySelector('.nav-menu');

      if (this.nav) {
        this.setupScrollBehavior();
        this.setupMobileMenu();
        this.highlightCurrentPage();
        this.setupSmoothScroll();
      }
    },

    setupScrollBehavior() {
      let lastScroll = 0;

      const handleScroll = utils.throttle(() => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
          this.nav.classList.add('nav-scrolled');
        } else {
          this.nav.classList.remove('nav-scrolled');
        }

        // Hide/show on scroll (optional)
        if (currentScroll > lastScroll && currentScroll > 200) {
          this.nav.style.transform = 'translateY(-100%)';
        } else {
          this.nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
      }, 100);

      window.addEventListener('scroll', handleScroll, { passive: true });
    },

    setupMobileMenu() {
      if (!this.toggle || !this.menu) return;

      this.toggle.addEventListener('click', () => {
        this.isOpen = !this.isOpen;
        this.menu.classList.toggle('active', this.isOpen);
        this.toggle.setAttribute('aria-expanded', this.isOpen);
        
        // Animate hamburger
        const bars = this.toggle.querySelectorAll('.nav-toggle-bar');
        if (this.isOpen) {
          bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
          bars[1].style.opacity = '0';
          bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
          bars[0].style.transform = 'none';
          bars[1].style.opacity = '1';
          bars[2].style.transform = 'none';
        }
      });

      // Close menu on link click
      this.menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          if (this.isOpen) {
            this.isOpen = false;
            this.menu.classList.remove('active');
            this.toggle.setAttribute('aria-expanded', 'false');
          }
        });
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.isOpen = false;
          this.menu.classList.remove('active');
          this.toggle.setAttribute('aria-expanded', 'false');
        }
      });
    },

    highlightCurrentPage() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      
      document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
    },

    setupSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            e.preventDefault();
            const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  };

  // ============================================
  // SCROLL REVEAL (High-impact animations)
  // ============================================
  const ScrollReveal = {
    observer: null,

    init() {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
          el.classList.add('visible');
        });
        return;
      }

      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              
              // Handle stagger children
              if (entry.target.classList.contains('stagger-children')) {
                entry.target.classList.add('visible');
              }
              
              // Unobserve after revealing
              this.observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: CONFIG.revealThreshold,
          rootMargin: '0px 0px -50px 0px'
        }
      );

      // Observe all reveal elements
      document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
        this.observer.observe(el);
      });
    }
  };

  // ============================================
  // COOKIE CONSENT
  // ============================================
  const CookieConsent = {
    banner: null,

    init() {
      this.banner = document.querySelector('.cookie-consent');
      
      if (!this.banner) return;
      
      const consent = localStorage.getItem(CONFIG.cookieConsentKey);
      
      if (!consent) {
        // Show after a delay
        setTimeout(() => {
          this.show();
        }, 2000);
      }

      this.setupButtons();
    },

    show() {
      this.banner.classList.add('show');
    },

    hide() {
      this.banner.classList.remove('show');
    },

    setupButtons() {
      const acceptBtn = this.banner.querySelector('.cookie-accept');
      const declineBtn = this.banner.querySelector('.cookie-decline');

      if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
          localStorage.setItem(CONFIG.cookieConsentKey, 'accepted');
          this.hide();
        });
      }

      if (declineBtn) {
        declineBtn.addEventListener('click', () => {
          localStorage.setItem(CONFIG.cookieConsentKey, 'declined');
          this.hide();
        });
      }
    }
  };

  // ============================================
  // NEWSLETTER MODAL
  // ============================================
  const NewsletterModal = {
    modal: null,
    overlay: null,
    hasShown: false,

    init() {
      this.modal = document.querySelector('.modal-newsletter');
      this.overlay = document.querySelector('.modal-overlay');

      if (!this.modal || localStorage.getItem(CONFIG.newsletterShownKey)) {
        return;
      }

      this.setupTriggers();
      this.setupClose();
    },

    setupTriggers() {
      // Exit intent
      document.addEventListener('mouseout', (e) => {
        if (e.clientY < 10 && !this.hasShown) {
          this.show();
        }
      });

      // Scroll trigger (50% of page)
      const scrollTrigger = utils.throttle(() => {
        const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 50 && !this.hasShown) {
          this.show();
        }
      }, 1000);

      window.addEventListener('scroll', scrollTrigger, { passive: true });
    },

    show() {
      this.hasShown = true;
      localStorage.setItem(CONFIG.newsletterShownKey, 'true');
      
      if (this.overlay) this.overlay.classList.add('show');
      this.modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    },

    hide() {
      if (this.overlay) this.overlay.classList.remove('show');
      this.modal.classList.remove('show');
      document.body.style.overflow = '';
    },

    setupClose() {
      const closeBtn = this.modal.querySelector('.modal-close');
      
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hide());
      }

      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.hide());
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.hide();
        }
      });
    }
  };

  // ============================================
  // PARALLAX EFFECTS (3D depth)
  // ============================================
  const ParallaxManager = {
    elements: [],

    init() {
      // Check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      this.elements = document.querySelectorAll('[data-parallax]');
      
      if (this.elements.length === 0) return;

      window.addEventListener('scroll', utils.throttle(() => {
        this.update();
      }, 16), { passive: true });
    },

    update() {
      const scrolled = window.pageYOffset;

      this.elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const yPos = -(scrolled * speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }
  };

  // ============================================
  // 3D CARD EFFECTS
  // ============================================
  const Card3D = {
    init() {
      // Check for touch device
      if (window.matchMedia('(pointer: coarse)').matches) {
        return;
      }

      document.querySelectorAll('[data-card-3d]').forEach(card => {
        this.setupCard(card);
      });
    },

    setupCard(card) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    }
  };

  // ============================================
  // FORM VALIDATION
  // ============================================
  const FormValidation = {
    init() {
      document.querySelectorAll('form[data-validate]').forEach(form => {
        this.setupForm(form);
      });
    },

    setupForm(form) {
      form.addEventListener('submit', (e) => {
        let isValid = true;

        form.querySelectorAll('[required]').forEach(field => {
          if (!this.validateField(field)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
        }
      });

      // Real-time validation
      form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => this.clearError(field));
      });
    },

    validateField(field) {
      const value = field.value.trim();
      const type = field.type;
      let isValid = true;
      let message = '';

      if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
      } else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          message = 'Please enter a valid email address';
        }
      } else if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(value)) {
          isValid = false;
          message = 'Please enter a valid phone number';
        }
      }

      if (!isValid) {
        this.showError(field, message);
      } else {
        this.clearError(field);
      }

      return isValid;
    },

    showError(field, message) {
      this.clearError(field);
      
      field.classList.add('form-input-error');
      
      const errorEl = document.createElement('span');
      errorEl.className = 'form-error';
      errorEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        ${message}
      `;
      
      field.parentNode.appendChild(errorEl);
    },

    clearError(field) {
      field.classList.remove('form-input-error');
      const error = field.parentNode.querySelector('.form-error');
      if (error) {
        error.remove();
      }
    }
  };

  // ============================================
  // COUNTERS & ANIMATED NUMBERS
  // ============================================
  const CounterAnimation = {
    observer: null,

    init() {
      const counters = document.querySelectorAll('[data-counter]');
      
      if (counters.length === 0) return;

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => this.observer.observe(counter));
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
        
        // Ease out quad
        const easeOut = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(easeOut * target);
        
        element.textContent = prefix + utils.formatNumber(current) + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      
      requestAnimationFrame(update);
    }
  };

  // ============================================
  // LAZY LOADING IMAGES
  // ============================================
  const LazyLoader = {
    observer: null,

    init() {
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

        document.querySelectorAll('img[data-src]').forEach(img => {
          this.observer.observe(img);
        });
      } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
          this.loadImage(img);
        });
      }
    },

    loadImage(img) {
      const src = img.dataset.src;
      const srcset = img.dataset.srcset;
      
      if (src) {
        img.src = src;
      }
      
      if (srcset) {
        img.srcset = srcset;
      }
      
      img.removeAttribute('data-src');
      img.removeAttribute('data-srcset');
      img.classList.add('loaded');
    }
  };

  // ============================================
  // PAGE LOADER
  // ============================================
  const PageLoader = {
    loader: null,

    init() {
      this.loader = document.querySelector('.loader');
      
      if (!this.loader) return;

      // Hide loader when page is loaded
      if (document.readyState === 'complete') {
        this.hide();
      } else {
        window.addEventListener('load', () => this.hide());
      }
    },

    hide() {
      setTimeout(() => {
        this.loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 500);
    }
  };

  // ============================================
  // TOOLTIPS
  // ============================================
  const TooltipManager = {
    init() {
      document.querySelectorAll('[data-tooltip]').forEach(el => {
        this.setupTooltip(el);
      });
    },

    setupTooltip(element) {
      const text = element.dataset.tooltip;
      
      element.addEventListener('mouseenter', () => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
          position: absolute;
          background: var(--color-neutral-900);
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          white-space: nowrap;
          z-index: 9999;
          pointer-events: none;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.2s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
        tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
        
        requestAnimationFrame(() => {
          tooltip.style.opacity = '1';
          tooltip.style.transform = 'translateY(0)';
        });
        
        element._tooltip = tooltip;
      });

      element.addEventListener('mouseleave', () => {
        if (element._tooltip) {
          element._tooltip.remove();
          element._tooltip = null;
        }
      });
    }
  };

  // ============================================
  // INITIALIZE ALL MODULES
  // ============================================
  function init() {
    // Prevent flash of unstyled content
    document.body.style.opacity = '0';
    
    // Initialize all managers
    ThemeManager.init();
    NavigationManager.init();
    PageLoader.init();
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.body.style.opacity = '1';
        ScrollReveal.init();
        CookieConsent.init();
        NewsletterModal.init();
        ParallaxManager.init();
        Card3D.init();
        FormValidation.init();
        CounterAnimation.init();
        LazyLoader.init();
        TooltipManager.init();
      });
    } else {
      document.body.style.opacity = '1';
      ScrollReveal.init();
      CookieConsent.init();
      NewsletterModal.init();
      ParallaxManager.init();
      Card3D.init();
      FormValidation.init();
      CounterAnimation.init();
      LazyLoader.init();
      TooltipManager.init();
    }
  }

  // Start the application
  init();

  // Expose utilities globally for page-specific scripts
  window.NexusUtils = utils;
  window.NexusTheme = ThemeManager;
})();
