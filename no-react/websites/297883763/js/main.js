/**
 * =============================================================================
 * MAIN.JS - Core JavaScript Functionality
 * Seed: 297883763
 * =============================================================================
 * 
 * Core functionality including:
 * - Navigation handling
 * - Theme toggle
 * - Scroll animations (IntersectionObserver)
 * - Mobile menu
 * - Cookie consent
 * - Newsletter modal
 * - Smooth scrolling
 * 
 * Animation level: Maximal (digit 4 = 8)
 * Interaction depth: 3D (digit 8 = 6)
 * =============================================================================
 */

(function() {
  'use strict';

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  const on = (element, event, handler, options = {}) => element.addEventListener(event, handler, options);
  const off = (element, event, handler) => element.removeEventListener(event, handler);
  
  // Throttle function
  const throttle = (fn, wait) => {
    let time = Date.now();
    return function() {
      if ((time + wait - Date.now()) < 0) {
        fn.apply(this, arguments);
        time = Date.now();
      }
    };
  };

  // Debounce function
  const debounce = (fn, wait) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  // ============================================================================
  // THEME MANAGEMENT
  // ============================================================================

  const ThemeManager = {
    STORAGE_KEY: 'theme-preference',
    
    init() {
      this.loadTheme();
      this.setupToggle();
    },
    
    getSystemPreference() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
    
    loadTheme() {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const theme = stored || this.getSystemPreference();
      document.documentElement.setAttribute('data-theme', theme);
    },
    
    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(this.STORAGE_KEY, next);
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
    },
    
    setupToggle() {
      const toggle = $('.theme-toggle');
      if (toggle) {
        on(toggle, 'click', () => this.toggle());
      }
    }
  };

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const Navigation = {
    init() {
      this.setupScrollEffect();
      this.setupMobileMenu();
      this.setupCurrentPage();
      this.setupSmoothScroll();
    },
    
    setupScrollEffect() {
      const nav = $('.nav');
      if (!nav) return;
      
      const handleScroll = throttle(() => {
        if (window.scrollY > 50) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }
      }, 100);
      
      on(window, 'scroll', handleScroll, { passive: true });
    },
    
    setupMobileMenu() {
      const toggle = $('.nav__toggle');
      const menu = $('.nav__menu');
      
      if (!toggle || !menu) return;
      
      on(toggle, 'click', () => {
        const isOpen = menu.classList.contains('nav__menu--open');
        menu.classList.toggle('nav__menu--open');
        toggle.classList.toggle('nav__toggle--active');
        toggle.setAttribute('aria-expanded', !isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
      });
      
      // Close on escape
      on(document, 'keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('nav__menu--open')) {
          menu.classList.remove('nav__menu--open');
          toggle.classList.remove('nav__toggle--active');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
      
      // Close on link click
      const links = $$('.nav__link', menu);
      links.forEach(link => {
        on(link, 'click', () => {
          menu.classList.remove('nav__menu--open');
          toggle.classList.remove('nav__toggle--active');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    },
    
    setupCurrentPage() {
      const currentPath = window.location.pathname;
      const links = $$('.nav__link');
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && currentPath.includes(href) && href !== '/') {
          link.classList.add('nav__link--active');
        } else if (href === '/' && currentPath === '/') {
          link.classList.add('nav__link--active');
        }
      });
    },
    
    setupSmoothScroll() {
      on(document, 'click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = $(targetId);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    }
  };

  // ============================================================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================================================

  const ScrollReveal = {
    init() {
      this.setupObserver();
      this.setupParallax();
    },
    
    setupObserver() {
      const elements = $$('.reveal');
      if (elements.length === 0) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger delay based on index
            setTimeout(() => {
              entry.target.classList.add('reveal--visible');
            }, index * 100);
            
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      elements.forEach(el => observer.observe(el));
    },
    
    setupParallax() {
      const parallaxElements = $$('[data-parallax]');
      if (parallaxElements.length === 0) return;
      
      const handleScroll = throttle(() => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.5;
          const yPos = -(scrolled * speed);
          el.style.transform = `translateY(${yPos}px)`;
        });
      }, 16);
      
      on(window, 'scroll', handleScroll, { passive: true });
    }
  };

  // ============================================================================
  // COOKIE CONSENT
  // ============================================================================

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
        <div class="cookie-banner__content">
          <p class="cookie-banner__text">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
          <div class="cookie-banner__actions">
            <button class="btn btn--ghost btn--small cookie-banner__settings">Settings</button>
            <button class="btn btn--primary btn--small cookie-banner__accept">Accept All</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(banner);
      
      // Animate in
      requestAnimationFrame(() => {
        banner.classList.add('cookie-banner--visible');
      });
      
      // Event listeners
      on($('.cookie-banner__accept', banner), 'click', () => {
        this.acceptAll();
        this.hideBanner(banner);
      });
      
      on($('.cookie-banner__settings', banner), 'click', () => {
        this.showSettings();
      });
    },
    
    hideBanner(banner) {
      banner.classList.remove('cookie-banner--visible');
      setTimeout(() => banner.remove(), 300);
    },
    
    acceptAll() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString()
      }));
    },
    
    showSettings() {
      // Simplified - could expand to modal with granular controls
      console.log('Cookie settings modal would open here');
    }
  };

  // ============================================================================
  // NEWSLETTER MODAL
  // ============================================================================

  const NewsletterModal = {
    STORAGE_KEY: 'newsletter-dismissed',
    shown: false,
    
    init() {
      if (this.shouldShow()) {
        this.setupTriggers();
      }
    },
    
    shouldShow() {
      return localStorage.getItem(this.STORAGE_KEY) !== 'true' && 
             !window.location.pathname.includes('contact');
    },
    
    setupTriggers() {
      // Show on scroll (exit intent simulated)
      const handleScroll = debounce(() => {
        if (this.shown) return;
        
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 70) {
          this.show();
        }
      }, 100);
      
      on(window, 'scroll', handleScroll, { passive: true });
      
      // Show on exit intent
      on(document, 'mouseout', (e) => {
        if (this.shown) return;
        if (e.clientY < 10) {
          this.show();
        }
      });
    },
    
    show() {
      this.shown = true;
      
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="newsletter-title">
          <div class="modal__header">
            <h3 id="newsletter-title" class="modal__title">Join Our Newsletter</h3>
            <button class="modal__close" aria-label="Close modal">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal__body">
            <p class="text-secondary" style="margin-bottom: var(--space-4);">
              Get the latest updates, exclusive offers, and insider tips delivered straight to your inbox.
            </p>
            <form class="newsletter-form">
              <div class="form-group">
                <label class="form-label" for="newsletter-email">Email Address</label>
                <input type="email" id="newsletter-email" class="form-input" placeholder="you@example.com" required>
              </div>
              <button type="submit" class="btn btn--primary btn--large" style="width: 100%;">
                Subscribe Now
              </button>
            </form>
            <p class="form-hint" style="margin-top: var(--space-4); text-align: center;">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      
      // Animate in
      requestAnimationFrame(() => {
        modal.classList.add('modal-overlay--open');
      });
      
      // Event listeners
      const closeModal = () => {
        modal.classList.remove('modal-overlay--open');
        setTimeout(() => modal.remove(), 300);
        localStorage.setItem(this.STORAGE_KEY, 'true');
      };
      
      on($('.modal__close', modal), 'click', closeModal);
      on(modal, 'click', (e) => {
        if (e.target === modal) closeModal();
      });
      
      const form = $('.newsletter-form', modal);
      on(form, 'submit', (e) => {
        e.preventDefault();
        // Handle subscription
        closeModal();
      });
    }
  };

  // ============================================================================
  // LOADER
  // ============================================================================

  const Loader = {
    init() {
      const loader = $('.loader');
      if (!loader) return;
      
      // Hide after page loads
      on(window, 'load', () => {
        setTimeout(() => {
          loader.classList.add('loader--hidden');
          setTimeout(() => loader.remove(), 500);
        }, 500);
      });
    }
  };

  // ============================================================================
  // COUNTER ANIMATION
  // ============================================================================

  const Counter = {
    init() {
      const counters = $$('[data-counter]');
      if (counters.length === 0) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      counters.forEach(counter => observer.observe(counter));
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
        
        // Ease out expo
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeProgress * target);
        
        element.textContent = prefix + current.toLocaleString() + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };
      
      requestAnimationFrame(update);
    }
  };

  // ============================================================================
  // INITIALIZE
  // ============================================================================

  const init = () => {
    ThemeManager.init();
    Navigation.init();
    ScrollReveal.init();
    CookieConsent.init();
    NewsletterModal.init();
    Loader.init();
    Counter.init();
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    on(document, 'DOMContentLoaded', init);
  } else {
    init();
  }

})();
