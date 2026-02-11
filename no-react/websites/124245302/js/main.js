/**
 * SEED 124245302 - Main JavaScript
 * Position 4 (Digit 4): Moderate animations with Intersection Observer
 * Position 8 (Digit 0): Flat interactions (no 3D transforms)
 * 
 * Features:
 * - Theme toggle with localStorage persistence
 * - Mobile navigation
 * - Scroll reveal animations
 * - Smooth scroll
 * - Cookie consent
 * - Newsletter modal
 */

(function() {
  'use strict';

  // ===== THEME MANAGEMENT =====
  const ThemeManager = {
    STORAGE_KEY: 'theme-preference',
    
    init() {
      this.themeToggle = document.querySelector('.theme-toggle');
      this.html = document.documentElement;
      
      // Check for saved theme preference or respect OS preference
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme) {
        this.html.setAttribute('data-theme', savedTheme);
      } else if (prefersDark) {
        this.html.setAttribute('data-theme', 'dark');
      }
      
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => this.toggle());
      }
      
      // Listen for OS theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
          this.html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
      });
    },
    
    toggle() {
      const currentTheme = this.html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      this.html.setAttribute('data-theme', newTheme);
      localStorage.setItem(this.STORAGE_KEY, newTheme);
    }
  };

  // ===== NAVIGATION =====
  const Navigation = {
    init() {
      this.nav = document.querySelector('.nav');
      this.navToggle = document.querySelector('.nav-toggle');
      this.navMenu = document.querySelector('.nav-menu');
      this.navLinks = document.querySelectorAll('.nav-link');
      
      if (this.navToggle) {
        this.navToggle.addEventListener('click', () => this.toggleMenu());
      }
      
      // Close menu on link click
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMenu());
      });
      
      // Handle scroll
      window.addEventListener('scroll', () => this.handleScroll());
      
      // Set active link
      this.setActiveLink();
    },
    
    toggleMenu() {
      this.navToggle.classList.toggle('active');
      this.navMenu.classList.toggle('active');
      document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    },
    
    closeMenu() {
      this.navToggle.classList.remove('active');
      this.navMenu.classList.remove('active');
      document.body.style.overflow = '';
    },
    
    handleScroll() {
      if (window.scrollY > 50) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    },
    
    setActiveLink() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      
      this.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
          link.classList.add('active');
        }
      });
    }
  };

  // ===== SCROLL REVEAL =====
  // Position 4 (Digit 4): Moderate animations
  const ScrollReveal = {
    init() {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        // Show all elements immediately
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children')
          .forEach(el => el.classList.add('visible'));
        return;
      }
      
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      // Observe all reveal elements
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children')
        .forEach(el => observer.observe(el));
    }
  };

  // ===== SMOOTH SCROLL =====
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const targetId = anchor.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            e.preventDefault();
            
            const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  };

  // ===== COOKIE CONSENT =====
  const CookieConsent = {
    STORAGE_KEY: 'cookie-consent-accepted',
    
    init() {
      this.banner = document.querySelector('.cookie-consent');
      this.acceptBtn = document.querySelector('.cookie-accept');
      this.declineBtn = document.querySelector('.cookie-decline');
      
      if (!this.banner) return;
      
      // Check if already accepted
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        // Show after a short delay
        setTimeout(() => {
          this.banner.classList.add('visible');
        }, 2000);
      }
      
      if (this.acceptBtn) {
        this.acceptBtn.addEventListener('click', () => this.accept());
      }
      
      if (this.declineBtn) {
        this.declineBtn.addEventListener('click', () => this.decline());
      }
    },
    
    accept() {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      this.hide();
    },
    
    decline() {
      localStorage.setItem(this.STORAGE_KEY, 'false');
      this.hide();
    },
    
    hide() {
      this.banner.classList.remove('visible');
    }
  };

  // ===== NEWSLETTER MODAL =====
  const NewsletterModal = {
    STORAGE_KEY: 'newsletter-modal-shown',
    
    init() {
      this.modal = document.querySelector('.modal-overlay.newsletter-modal');
      this.closeBtn = document.querySelector('.modal-close');
      this.form = document.querySelector('.newsletter-form');
      
      if (!this.modal) return;
      
      // Show on exit intent or scroll threshold
      this.setupTriggers();
      
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }
      
      // Close on overlay click
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.close();
        }
      });
      
      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('active')) {
          this.close();
        }
      });
      
      if (this.form) {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      }
    },
    
    setupTriggers() {
      // Don't show if already shown in this session
      if (sessionStorage.getItem(this.STORAGE_KEY)) return;
      
      // Show after scrolling 70% of page
      let scrollTriggered = false;
      window.addEventListener('scroll', () => {
        if (scrollTriggered) return;
        
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent > 70) {
          scrollTriggered = true;
          this.show();
        }
      });
      
      // Exit intent
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY < 10 && !sessionStorage.getItem(this.STORAGE_KEY)) {
          this.show();
        }
      });
    },
    
    show() {
      if (sessionStorage.getItem(this.STORAGE_KEY)) return;
      
      this.modal.classList.add('active');
      sessionStorage.setItem(this.STORAGE_KEY, 'true');
      document.body.style.overflow = 'hidden';
    },
    
    close() {
      this.modal.classList.remove('active');
      document.body.style.overflow = '';
    },
    
    handleSubmit(e) {
      e.preventDefault();
      
      const email = this.form.querySelector('input[type="email"]').value;
      
      // Simulate submission
      const submitBtn = this.form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Subscribing...';
      
      setTimeout(() => {
        submitBtn.textContent = 'Subscribed!';
        submitBtn.classList.add('btn-success');
        
        setTimeout(() => {
          this.close();
          // Reset form
          setTimeout(() => {
            this.form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('btn-success');
          }, 300);
        }, 1500);
      }, 1000);
    }
  };

  // ===== LOADER =====
  // Position 4 (Digit 4): Moderate - simple loader
  const Loader = {
    init() {
      this.loader = document.querySelector('.loader');
      
      if (!this.loader) return;
      
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.loader.classList.add('hidden');
        }, 500);
      });
    }
  };

  // ===== UTILITY FUNCTIONS =====
  const Utils = {
    // Throttle function for scroll events
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
    
    // Debounce function for resize events
    debounce(func, wait) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    },
    
    // Format number with commas
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Validate email
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    // Copy to clipboard
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Failed to copy:', err);
        return false;
      }
    }
  };

  // ===== INITIALIZE =====
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    Navigation.init();
    ScrollReveal.init();
    SmoothScroll.init();
    CookieConsent.init();
    NewsletterModal.init();
    Loader.init();
  });

  // Expose utilities globally
  window.WebsiteUtils = Utils;
})();
